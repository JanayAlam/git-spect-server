import { Router } from "express";
import {
  loginRequestBodySchema,
  refreshAccessTokenBodySchema,
  registerRequestBodySchema,
} from "../../../dto/request-dto/auth.schema";
import zodValidator from "../../../middlewares/zod-validator";
import {
  loginController,
  refreshAccessTokenController,
  registerController,
} from "../../controllers/auth.controller";

const authRouter = Router({ mergeParams: true });

authRouter.post(
  "/register",
  zodValidator(registerRequestBodySchema),
  registerController,
);

authRouter.post(
  "/login",
  zodValidator(loginRequestBodySchema),
  loginController,
);

authRouter.post(
  "/refresh",
  zodValidator(refreshAccessTokenBodySchema),
  refreshAccessTokenController,
);

export default authRouter;
