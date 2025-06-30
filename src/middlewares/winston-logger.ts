import expressWinston from "express-winston";
import logger from "../utils/logger";
import { LOGGER_LEVEL } from "../utils/logger/logger.types";

export const expressWinstonHttpLogger = expressWinston.logger({
  level: LOGGER_LEVEL.HTTP,
  winstonInstance: logger,
  expressFormat: true,
  colorize: false,
});
