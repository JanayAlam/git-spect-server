import { Router } from "express";
import isAuthenticated from "../../../middlewares/is-authenticated";
import { getRepoListController } from "../../controllers/repo.controller";

const repoRouter = Router({ mergeParams: true });

repoRouter.get("/list", isAuthenticated(), getRepoListController);

export default repoRouter;
