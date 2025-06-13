import winston, { transport } from "winston";
import Config, { ENVIRONMENT } from "../parameters/Config";

// configuration variables
const configInstance = Config.getInstance();

class Logger {
  private static instance = new Logger();

  logger: winston.Logger;

  private constructor() {
    const transports: transport[] = [];

    if (configInstance.environment === ENVIRONMENT.DEVELOPMENT) {
      transports.push(this.createConsoleLogTransport());
    }

    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports,
    });
  }

  private createConsoleLogTransport(): transport {
    return new winston.transports.Console();
  }

  public static getInstance(): Logger {
    return this.instance;
  }
}

export default Logger;
