export const ENVIRONMENT = {
  PRODUCTION: "production",
  STAGING: "staging",
  TEST: "test",
  DEVELOPMENT: "development",
} as const;

export type TEnvironment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];

class Config {
  private static instance: Config = new Config();

  environment: TEnvironment;
  port: number;

  mongodbConnectionURI: string;
  databaseName: string;

  private constructor() {
    const { NODE_ENV, PORT, MONGODB_CONNECTION_URI, DATABASE_NAME } =
      process.env;

    this.port = parseInt(PORT || "8000") || 8000;
    this.environment = Object.values(ENVIRONMENT).includes(
      NODE_ENV as TEnvironment,
    )
      ? (NODE_ENV as TEnvironment)
      : ENVIRONMENT.DEVELOPMENT;

    this.mongodbConnectionURI =
      MONGODB_CONNECTION_URI || "mongodb://localhost:27017";
    this.databaseName = DATABASE_NAME || "db-dev";
  }

  public static getInstance(): Config {
    return Config.instance;
  }
}

export default Config;
