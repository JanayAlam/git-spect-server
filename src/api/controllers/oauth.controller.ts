import { OAUTH_PROVIDER, USER_STATUS } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SYSTEM_ROLE } from "../../database/enums/system-role";
import token from "../../lib/jwt-token";
import Config from "../../parameters/config";
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

const configInstance = Config.getInstance();

export const githubAppInstallController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.redirect("https://github.com/apps/gitspect/installations/new");
  } catch (err) {
    next(err);
  }
};

export const githubAppAuthorizeController = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clientId = configInstance.githubClientId;
    const scope = "user:email repo";

    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(configInstance.githubAppRedirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code`;

    return res.redirect(authUrl);
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

    const hasAppInstalled = await checkIfUserInstalledApp(githubUser.login);

    if (!hasAppInstalled) {
      return res.redirect("https://github.com/apps/gitspect/installations/new");
    }

    const existingOAuthAccount = await findOAuthAccountByProvider(
      OAUTH_PROVIDER.GITHUB,
      githubUser.login,
    );

    let user = await getUserByEmail(githubUser.email);

    if (existingOAuthAccount) {
      // OAuth account exists, update access token
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

// 4. HELPER FUNCTION TO CHECK APP INSTALLATION
async function checkIfUserInstalledApp(username: string): Promise<boolean> {
  try {
    const jwt = generateJWT();
    const response = await fetch(`https://api.github.com/app/installations`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github+json",
      },
    });

    const installations = (await response.json()) as any;

    return installations.some(
      (installation: any) => installation.account.login === username,
    );
  } catch {
    return false;
  }
}

function generateJWT(): string {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 600,
    iss: process.env.GITHUB_APP_ID,
  };

  return jwt.sign(payload, configInstance.githubPrivateKey, {
    algorithm: "RS256",
  });
}
