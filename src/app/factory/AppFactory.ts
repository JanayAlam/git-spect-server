import cors from "cors";
import express from "express";

import healthRouter from "../../api/v1/health";
import configureCorrelationId from "../../middlewares/configure-correlationId";

abstract class AppFactory {
  private app: express.Express = express();

  constructor() {
    this.configureBodyParsers();
    this.configureCORS();

    this.addAppMiddlewares();

    this.configureAPIs();
  }

  abstract connectDB(): Promise<void>;

  private configureBodyParsers() {
    this.app.use(express.urlencoded());
    this.app.use(express.json());
  }

  private configureCORS() {
    this.app.use(
      cors({
        origin: true,
        credentials: true,
      }),
    );
  }

  private addAppMiddlewares() {
    this.app.use(configureCorrelationId);
  }

  private configureAPIs() {
    this.app.use("/api/v1/health", healthRouter);
  }

  getApp(): express.Express {
    return this.app;
  }
}

export default AppFactory;
