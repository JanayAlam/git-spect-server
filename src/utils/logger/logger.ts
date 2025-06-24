import { createLogger, format, transport } from "winston";
import Config, { LOG_TARGET } from "../../parameters/config";
import { LOGGER_DATETIME_FORMAT } from "./logger.helpers";
import {
  consoleTransport,
  elasticsearchTransport,
  errorFileTransport,
  httpFileTransport,
  infoFileTransport,
} from "./transports";

const configInstance = Config.getInstance();

const createTransports = () => {
  const transports: transport[] = [];

  // console transport
  if (configInstance.log.includes(LOG_TARGET.CONSOLE)) {
    transports.push(consoleTransport);
  }

  // file transport
  if (configInstance.log.includes(LOG_TARGET.FILE)) {
    transports.push(infoFileTransport);
    transports.push(httpFileTransport);
    transports.push(errorFileTransport);
  }

  // elasticsearch transport
  if (
    configInstance.log.includes(LOG_TARGET.ELASTICSEARCH) &&
    elasticsearchTransport
  ) {
    transports.push(elasticsearchTransport);
  }

  return transports;
};

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: LOGGER_DATETIME_FORMAT }),
    format.json(),
  ),
  transports: createTransports(),
});

export default logger;
