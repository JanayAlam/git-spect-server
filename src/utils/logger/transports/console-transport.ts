import winston from "winston";
import { LOGGER_LEVEL } from "../logger.types";

const { combine, prettyPrint, errors } = winston.format;

export const consoleTransport = new winston.transports.Console({
  level: LOGGER_LEVEL.DEBUG,
  format: combine(errors({ stack: true }), prettyPrint()),
});
