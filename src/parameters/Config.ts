export const ENVIRONMENT = {
  PRODUCTION: "production",
  STAGING: "staging",
  TEST: "test",
  DEVELOPMENT: "development",
} as const;

export type TEnvironment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

class Config {
  private static config: Config = new Config();

  environment: TEnvironment;
  port: number;

  private constructor() {
    const { NODE_ENV, PORT } = process.env;

    this.port = parseInt(PORT || "8000") || 8000;
    this.environment = Object.values(ENVIRONMENT).includes(
      NODE_ENV as TEnvironment,
    )
      ? (NODE_ENV as TEnvironment)
      : ENVIRONMENT.DEVELOPMENT;
  }

  public static getInstance(): Config {
    return Config.config;
  }
}

export default Config;
