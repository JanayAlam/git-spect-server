import { format } from "winston";
import { TLoggerLevel } from "./logger.types";

export const LOGGER_DATETIME_FORMAT = "YYYY-MM-DD hh:mm:ss.SSS A";

export const onlyLevel = (level: TLoggerLevel) =>
  format((info) => (info.level === level ? info : false))();
