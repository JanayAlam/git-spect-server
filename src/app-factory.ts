import cors from "cors";
import express from "express";
import morgan from "morgan";
import healthRouter from "./api/v1/health";
import Logger from "./logger";
import configureCorrelationId from "./middlewares/configure-correlationId";

const createApp = (): express.Express => {
  const loggerInstance = Logger.getInstance();

  const app: express.Express = express();

  app.use(express.urlencoded());
  app.use(express.json());

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  app.use(configureCorrelationId);
  app.use(
    morgan(":method :url :status - :response-time ms", {
      stream: {
        write: (message) => loggerInstance.http(message.trim()),
      },
    }),
  );

  app.use("/api/v1/health", healthRouter);

  return app;
};

export default createApp;
