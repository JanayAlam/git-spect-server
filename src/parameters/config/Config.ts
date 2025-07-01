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

  superAdminEmail: string;
  superAdminPassword: string;

  jwtSecretSuperAdmin: string;
  jwtSecretUser: string;
  jwtAccessTokenExpire: string;
  jwtRefreshTokenExpire: string;

  githubAppId: string;
  githubClientId: string;
  githubSecret: string;
  githubPrivateKey: string;

  private constructor() {
    const {
      NODE_ENV,
      APP_NAME,
      PORT,
      DATABASE_URL,
      LOG,
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD,
      JWT_SECRET_SUPER_ADMIN,
      JWT_SECRET_USER,
      JWT_ACCESS_TOKEN_EXPIRE,
      JWT_REFRESH_TOKEN_EXPIRE,
      GITHUB_APP_ID,
      GITHUB_CLIENT_ID,
      GITHUB_SECRET,
      GITHUB_PRIVATE_KEY,
    } = process.env;

    this.environment = Object.values(ENVIRONMENT).includes(
      NODE_ENV as TEnvironment,
    )
      ? (NODE_ENV as TEnvironment)
      : ENVIRONMENT.DEVELOPMENT;

    this.port = parseInt(PORT || "8000") || 8000;
    this.appName = APP_NAME || "GitSpect";

    this.databaseUrl = DATABASE_URL || "postgresql://localhost:5432/db-dev";

    this.log = LOG ? (LOG.split(",") as TLogTarget[]) : [LOG_TARGET.CONSOLE];

    this.superAdminEmail = SUPER_ADMIN_EMAIL || "";
    this.superAdminPassword = SUPER_ADMIN_PASSWORD || "";

    this.jwtSecretSuperAdmin = JWT_SECRET_SUPER_ADMIN || "";
    this.jwtSecretUser = JWT_SECRET_USER || "";
    this.jwtAccessTokenExpire = JWT_ACCESS_TOKEN_EXPIRE || "1h";
    this.jwtRefreshTokenExpire = JWT_REFRESH_TOKEN_EXPIRE || "1d";

    this.githubAppId = GITHUB_APP_ID || "";
    this.githubClientId = GITHUB_CLIENT_ID || "";
    this.githubSecret = GITHUB_SECRET || "";
    this.githubPrivateKey = (GITHUB_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  }

  public static getInstance(): Config {
    return Config.instance;
  }
}

export default Config;
