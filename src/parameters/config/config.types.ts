export const ENVIRONMENT = {
  PRODUCTION: "production" as const,
  STAGING: "staging" as const,
  TEST: "test" as const,
  DEVELOPMENT: "development" as const,
};

export type TEnvironment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

export const LOG_TARGET = {
  CONSOLE: "console" as const,
  FILE: "file" as const,
  ELASTICSEARCH: "elasticsearch" as const,
};

export type TLogTarget = (typeof LOG_TARGET)[keyof typeof LOG_TARGET];
