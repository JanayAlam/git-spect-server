import { Router } from "express";
import {
  loginRequestBodySchema,
  registerRequestBodySchema,
} from "../../../dto/request-dto/auth.schema";
import zodValidator from "../../../middlewares/zod-validator";
import {
  loginController,
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

export default authRouter;
