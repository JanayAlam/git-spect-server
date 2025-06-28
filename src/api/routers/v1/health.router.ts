import { Router } from "express";
import { getHealthStatus } from "../../controllers/health.controller";

const healthRouter = Router({ mergeParams: true });

healthRouter.get("/", getHealthStatus);

export default healthRouter;
