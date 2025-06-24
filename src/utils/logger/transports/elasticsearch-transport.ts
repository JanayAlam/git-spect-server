import { ElasticsearchTransport } from "winston-elasticsearch";
import Config from "../../../parameters/config";
import { LOGGER_LEVEL, TLoggerLevel } from "../logger.types";

// configuration variables
const configInstance = Config.getInstance();

const createElasticsearchTransport = (level: TLoggerLevel) => {
  if (!configInstance.elasticsearchUrl) return null;

  return new ElasticsearchTransport({
    level,
    clientOpts: {
      node: configInstance.elasticsearchUrl,
    },
    indexPrefix: "logs",
    indexSuffixPattern: "DD-MM-YYYY",
  });
};

export const elasticsearchTransport = createElasticsearchTransport(
  LOGGER_LEVEL.DEBUG,
);
