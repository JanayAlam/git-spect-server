export const ENVIRONMENT = {
  PRODUCTION: "production",
  STAGING: "staging",
  TEST: "test",
  DEVELOPMENT: "development",
} as const;

export type TEnvironment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];
