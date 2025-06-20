export const LOGGER_LEVEL = {
  ERROR: "error" as const,
  WARN: "warn" as const,
  INFO: "info" as const,
  HTTP: "http" as const,
  VERBOSE: "verbose" as const,
  DEBUG: "debug" as const,
  SILLY: "silly" as const,
};

export type TLoggerLevel = (typeof LOGGER_LEVEL)[keyof typeof LOGGER_LEVEL];
