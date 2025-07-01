import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";
import axios from "axios";
import Config from "../../../parameters/config";

const configInstance = Config.getInstance();

export const getGitHubAppInstallationAccessToken = async (
  installationId: number,
) => {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: configInstance.githubAppId,
      privateKey: configInstance.githubPrivateKey,
      clientId: configInstance.githubClientId,
      clientSecret: configInstance.githubSecret,
      installationId,
    },
  });
  const auth = await octokit.auth({ type: "installation", installationId });
  return (auth as { token: string }).token;
};

export const getGitHubAppJwt = async () => {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: configInstance.githubAppId,
      privateKey: configInstance.githubPrivateKey,
      clientId: configInstance.githubClientId,
      clientSecret: configInstance.githubSecret,
    },
  });
  const auth = await octokit.auth({ type: "app" });
  return (auth as { token: string }).token;
};

export const exchangeCodeForUserAccessToken = async (code: string) => {
  const url = "https://github.com/login/oauth/access_token";
  const { data } = await axios.post(
    url,
    {
      client_id: configInstance.githubClientId,
      client_secret: configInstance.githubSecret,
      code,
    },
    {
      headers: { Accept: "application/json" },
    },
  );
  if (data.error) throw new Error(data.error_description || data.error);
  return data.access_token;
};

// Fetch GitHub user profile using user access token
export const getGitHubUserProfile = async (accessToken: string) => {
  const { data } = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};
