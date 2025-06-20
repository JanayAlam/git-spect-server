import expressWinston from "express-winston";
import logger from "../utils/logger";
import { LOGGER_LEVEL, TLoggerLevel } from "../utils/logger/logger.types";

const createExpressWinstonLogger = (level: TLoggerLevel) => {
  return expressWinston.logger({
    level: level || "http",
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms correlationId: {{res.correlationId}}",
    expressFormat: true,
    colorize: false,
  });
};

export const expressWinstonHttpLogger = createExpressWinstonLogger(
  LOGGER_LEVEL.HTTP,
);
