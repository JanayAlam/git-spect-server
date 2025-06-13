import { Router } from "express";
import { getHealthStatusController } from "./controllers/get-health-status.controller";

const healthRouter = Router({ mergeParams: true });

healthRouter.get("/", getHealthStatusController);

export default healthRouter;
