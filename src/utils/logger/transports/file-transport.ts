import { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { onlyLevel } from "../logger.helpers";
import { LOGGER_LEVEL, TLoggerLevel } from "../logger.types";

const createFileTransport = (level: TLoggerLevel, filename: string) => {
  let fileFormat = onlyLevel(level || LOGGER_LEVEL.INFO);

  if (level === LOGGER_LEVEL.ERROR) {
    fileFormat = format.combine(
      format.errors({ stack: true }),
      onlyLevel(level),
    );
  }

  return new DailyRotateFile({
    level: level || LOGGER_LEVEL.INFO,
    filename: filename || "logs/info/info-%DATE%.log",
    datePattern: "DD-MM-YYYY-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    format: fileFormat,
  });
};

export const infoFileTransport = createFileTransport(
  LOGGER_LEVEL.INFO,
  "logs/info/info-%DATE%.log",
);

export const httpFileTransport = createFileTransport(
  LOGGER_LEVEL.HTTP,
  "logs/http/http-%DATE%.log",
);

export const errorFileTransport = createFileTransport(
  LOGGER_LEVEL.ERROR,
  "logs/error/error-%DATE%.log",
);

infoFileTransport.on("error", (_error: any) => {});

infoFileTransport.on(
  "rotate",
  (_oldFilename: string, _newFilename: string) => {},
);

httpFileTransport.on("error", (_error: any) => {});

httpFileTransport.on(
  "rotate",
  (_oldFilename: string, _newFilename: string) => {},
);

errorFileTransport.on("error", (_error: any) => {});

errorFileTransport.on(
  "rotate",
  (_oldFilename: string, _newFilename: string) => {},
);
