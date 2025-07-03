import { Router } from "express";
import isAuthenticated from "../../../middlewares/is-authenticated";
import { getMeController } from "../../controllers/user.controller";

const userRouter = Router({ mergeParams: true });

// self authenticated routes
userRouter.get("/me", isAuthenticated(), getMeController);

export default userRouter;
