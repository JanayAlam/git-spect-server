import { OAUTH_PROVIDER, USER_STATUS } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { SYSTEM_ROLE } from "../../database/enums/system-role";
import BadRequestError from "../../errors/api-error-impl/BadRequestError";
import InternalServerError from "../../errors/api-error-impl/InternalServerError";
import UnauthenticatedError from "../../errors/api-error-impl/UnauthenticatedError";
import token from "../../lib/token";
import { IBaseJwtPayload } from "../../lib/token/token";
import { upsertOAuthAccount } from "../../services/oauth-account";
import {
  exchangeCodeForUserAccessToken,
  getGitHubAppInstallationAccessToken,
  getGitHubUserProfile,
} from "../../services/oauth/github";
import {
  createUser,
  getUserByEmail,
  updateUserById,
} from "../../services/user";

export const integrateGitHubAppController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { installationId } = req.body;

    if (!installationId) {
      throw new UnauthenticatedError("Missing installation_id");
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      throw new UnauthenticatedError("User not authenticated");
    }
    const accessToken = await getGitHubAppInstallationAccessToken(
      Number(installationId),
    );

    const githubUser = await getGitHubUserProfile(accessToken);

    await upsertOAuthAccount({
      userId: userId,
      provider: OAUTH_PROVIDER.GITHUB,
      providerId: githubUser.id.toString(),
      accessToken,
    });

    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

export const githubAppOAuthCallbackController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { code, error } = req.query;

    if (error) {
      throw new UnauthenticatedError("GitHub OAuth authorization failed");
    }

    if (!code) {
      throw new BadRequestError("Missing session code", [
        {
          name: "code",
          message: "Missing session code from github",
          in: "query",
        },
      ]);
    }

    const accessToken = await exchangeCodeForUserAccessToken(code as string);
    const githubUser = await getGitHubUserProfile(accessToken);

    let user = await getUserByEmail(githubUser.email);

    if (!user) {
      user = await createUser({
        email: githubUser.email,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        userStatus: USER_STATUS.ACTIVE,
        role: { connect: { name: SYSTEM_ROLE.USER } },
        oAuthAccounts: {
          create: {
            provider: OAUTH_PROVIDER.GITHUB,
            providerId: githubUser.id.toString(),
            accessToken,
          },
        },
      });
    } else {
      user = await updateUserById(user.id, {
        userStatus: USER_STATUS.ACTIVE,
      });

      await upsertOAuthAccount({
        userId: user.id,
        provider: OAUTH_PROVIDER.GITHUB,
        providerId: githubUser.id.toString(),
        accessToken,
      });
    }

    if (!user) {
      throw new InternalServerError("User creation or update failed");
    }

    const tokenPayload: IBaseJwtPayload = {
      sub: user.id,
      roleId: user.role.id,
    };

    const jwtAccessToken = token.signToken(tokenPayload, "access");
    const jwtRefreshToken = token.signToken(tokenPayload, "refresh");

    res.json({
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const githubAppLoginController = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = require("../../parameters/config").default.getInstance();
    const clientId = config.githubClientId;

    const githubAuthorizeUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
    res.redirect(githubAuthorizeUrl);
  } catch (err) {
    next(err);
  }
};
