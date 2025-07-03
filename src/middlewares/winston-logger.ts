import expressWinston from "express-winston";
import logger from "../utils/logger";
import { LOGGER_LEVEL } from "../utils/logger/logger.types";

const expressWinstonHttpLogger = expressWinston.logger({
  level: LOGGER_LEVEL.HTTP,
  winstonInstance: logger,
  meta: false,
  expressFormat: true,
  colorize: false,
});

export default expressWinstonHttpLogger;
