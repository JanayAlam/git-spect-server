import { Router } from "express";
import {
  githubAppLoginController,
  githubAppOAuthCallbackController,
  integrateGitHubAppController,
} from "../../controllers/oauth.controller";

const oauthRouter = Router({ mergeParams: true });

oauthRouter.get("/github/authorize", githubAppLoginController);

oauthRouter.post("/github/integrate", integrateGitHubAppController);

oauthRouter.get("/github/callback", githubAppOAuthCallbackController);

export default oauthRouter;
