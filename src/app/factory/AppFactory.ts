import cors from "cors";
import express from "express";

abstract class AppFactory {
  private app: express.Express = express();

  constructor() {
    this.configureBodyParsers();
    this.configureCORS();
  }

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

  abstract connectDB(): Promise<void>;

  getApp(): express.Express {
    return this.app;
  }
}

export default AppFactory;
