import { OAUTH_PROVIDER, USER_STATUS } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { SYSTEM_ROLE } from "../../database/enums/system-role";
import token from "../../lib/jwt-token";
import {
  findOAuthAccountByProvider,
  upsertOAuthAccount,
} from "../../services/oauth-account";
import {
  exchangeCodeForUserAccessToken,
  getGitHubUserProfile,
} from "../../services/oauth/github";
import {
  createUser,
  getUserByEmail,
  updateUserById,
} from "../../services/user";

export const githubAppAuthorizeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.redirect("https://github.com/apps/gitspect/installations/new");
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
      throw new Error("GitHub OAuth authorization failed");
    }

    if (!code) {
      throw new Error("Missing `code` from GitHub OAuth callback");
    }

    const userAccessToken = await exchangeCodeForUserAccessToken(
      code as string,
    );

    const githubUser = await getGitHubUserProfile(userAccessToken);

    const existingOAuthAccount = await findOAuthAccountByProvider(
      OAUTH_PROVIDER.GITHUB,
      githubUser.login,
    );

    let user = await getUserByEmail(githubUser.email);

    if (existingOAuthAccount) {
      // OAuth account exist
      await upsertOAuthAccount({
        userId: existingOAuthAccount.userId,
        provider: OAUTH_PROVIDER.GITHUB,
        providerId: githubUser.login,
        accessToken: userAccessToken,
      });
      user = await updateUserById(existingOAuthAccount.userId, {
        userStatus: USER_STATUS.ACTIVE,
      });
    } else if (!user) {
      // No user and no OAuth account, create both
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
      // User exists but no OAuth account, create OAuth account for user
      await upsertOAuthAccount({
        userId: user.id,
        provider: OAUTH_PROVIDER.GITHUB,
        providerId: githubUser.login,
        accessToken: userAccessToken,
      });
      user = await updateUserById(user.id, {
        userStatus: USER_STATUS.ACTIVE,
      });
    }

    if (!user) {
      throw new Error("User creation or update failed");
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
