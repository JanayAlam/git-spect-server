import cors from "cors";
import express from "express";
import configureCorrelationId from "./middlewares/configure-correlationId";
import globalErrorHandler from "./middlewares/global-error-handler";
import routeNotFoundHandler from "./middlewares/route-not-found-handler";
import { expressWinstonHttpLogger } from "./middlewares/winston-logger";
import configureRoutes from "./routes";

const createApp = (): express.Express => {
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
  app.use(expressWinstonHttpLogger);

  // routes
  configureRoutes(app);

  // errors
  app.use(routeNotFoundHandler);
  app.use(globalErrorHandler);

  return app;
};

export default createApp;
