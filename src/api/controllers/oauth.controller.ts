import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { OAUTH_PROVIDER, USER_STATUS } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { SYSTEM_ROLE } from "../../database/enums/system-role";
import UnauthenticatedError from "../../errors/api-error-impl/UnauthenticatedError";
import token from "../../lib/jwt-token";
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
    const { code, error, installation_id } = req.query;

    if (error) {
      throw new Error("GitHub OAuth authorization failed");
    }

    if (!code) {
      throw new Error("Missing `code` from GitHub OAuth callback");
    }

    const userAccessToken = await exchangeCodeForUserAccessToken(
      code as string,
    );

    const githubUser = await getGitHubUserProfile(userAccessToken);

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
            providerId: githubUser.login,
            accessToken: userAccessToken,
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
        providerId: githubUser.login,
        accessToken: userAccessToken,
      });
    }

    if (!user) {
      throw new Error("User creation or update failed");
    }

    if (installation_id) {
      const octokitApp = new Octokit({
        authStrategy: createAppAuth,
        auth: {
          appId: process.env.GITHUB_APP_ID!,
          privateKey: process.env.GITHUB_PRIVATE_KEY!,
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          installationId: Number(installation_id),
        },
      });

      await octokitApp.auth({
        type: "installation",
        installationId: Number(installation_id),
      });
    }

    const tokenPayload = {
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
    const githubAuthorizeUrl = `https://github.com/apps/gitspect/installations/new`;
    res.redirect(githubAuthorizeUrl);
  } catch (err) {
    next(err);
  }
};
