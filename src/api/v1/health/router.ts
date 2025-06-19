import { Router } from "express";
import { getHealthStatusController } from "./controllers/get-status.controllers";

const healthRouter = Router({ mergeParams: true });

healthRouter.get("/", getHealthStatusController);

export default healthRouter;
