import { Router } from "express";
import {
  githubAppAuthorizeController,
  githubAppOAuthCallbackController,
} from "../../controllers/oauth.controller";

const oauthRouter = Router({ mergeParams: true });

oauthRouter.get("/github/authorize", githubAppAuthorizeController);

oauthRouter.get("/github/callback", githubAppOAuthCallbackController);

export default oauthRouter;
