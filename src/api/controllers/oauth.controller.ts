import { OAUTH_PROVIDER, USER_STATUS } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { SYSTEM_ROLE } from "../../database/enums/system-role";
import BadRequestError from "../../errors/api-error-impl/BadRequestError";
import InternalServerError from "../../errors/api-error-impl/InternalServerError";
import UnauthenticatedError from "../../errors/api-error-impl/UnauthenticatedError";
import token from "../../lib/token";
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
      throw new UnauthenticatedError(
        "Missing installation_id",
        req.headers["x-correlation-id"] as string,
      );
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      throw new UnauthenticatedError(
        "User not authenticated",
        req.headers["x-correlation-id"] as string,
      );
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
      throw new UnauthenticatedError(
        "GitHub OAuth authorization failed",
        req.headers["x-correlation-id"] as string,
      );
    }

    if (!code) {
      throw new BadRequestError(
        "Missing session code",
        req.headers["x-correlation-id"] as string,
        [
          {
            name: "code",
            message: "Missing session code from github",
            in: "query",
          },
        ],
      );
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
      throw new InternalServerError(
        "User creation or update failed",
        req.headers["x-correlation-id"] as string,
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      roleName: user.role.name,
    };

    const jwtAccessToken = token.signToken(
      tokenPayload,
      tokenPayload.roleName,
      "access",
    );

    const jwtRefreshToken = token.signToken(
      tokenPayload,
      user.role.name,
      "refresh",
    );

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
