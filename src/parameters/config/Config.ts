import {
  ENVIRONMENT,
  LOG_TARGET,
  TEnvironment,
  TLogTarget,
} from "./config.types";

class Config {
  private static instance: Config = new Config();

  environment: TEnvironment;

  appName: string;
  port: number;

  databaseUrl: string;

  log: TLogTarget[];

  private constructor() {
    const { NODE_ENV, APP_NAME, PORT, DATABASE_URL, LOG } = process.env;

    this.environment = Object.values(ENVIRONMENT).includes(
      NODE_ENV as TEnvironment,
    )
      ? (NODE_ENV as TEnvironment)
      : ENVIRONMENT.DEVELOPMENT;

    this.port = parseInt(PORT || "8000") || 8000;
    this.appName = APP_NAME || "GitSpectServer";

    this.databaseUrl = DATABASE_URL || "db-dev";

    this.log = LOG ? (LOG.split(",") as TLogTarget[]) : [LOG_TARGET.CONSOLE];
  }

  public static getInstance(): Config {
    return Config.instance;
  }
}

export default Config;
