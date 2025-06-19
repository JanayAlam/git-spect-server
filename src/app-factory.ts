import cors from "cors";
import express from "express";
import morgan from "morgan";
import Logger from "./logger";
import configureCorrelationId from "./middlewares/configure-correlationId";
import globalErrorHandler from "./middlewares/global-error-handler";
import routeNotFoundHandler from "./middlewares/route-not-found-handler";
import configureRoutes from "./routes";

const createApp = (): express.Express => {
  // logger
  const loggerInstance = Logger.getInstance();

  // express application
  const app: express.Express = express();

  // body parsers
  app.use(express.urlencoded());
  app.use(express.json());

  // cors
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );

  // middlewares
  app.use(configureCorrelationId);
  app.use(
    morgan(":method :url :status - :response-time ms", {
      stream: {
        write: (message) => loggerInstance.http(message.trim()),
      },
    }),
  );

  // routes
  configureRoutes(app);

  // errors
  app.use(routeNotFoundHandler);
  app.use(globalErrorHandler);

  return app;
};

export default createApp;
