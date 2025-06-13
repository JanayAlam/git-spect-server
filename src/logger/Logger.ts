import winston, { transport } from "winston";
import Config, { ENVIRONMENT } from "../parameters/Config";

// configuration variables
const configInstance = Config.getInstance();

class Logger {
  private static instance = new Logger();

  private logger: winston.Logger;

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

  public info(message: string, ...meta: any[]) {
    this.logger.info(message, ...meta);
  }

  public warn(message: string, ...meta: any[]) {
    this.logger.warn(message, ...meta);
  }

  public error(message: string, ...meta: any[]) {
    this.logger.error(message, ...meta);
  }

  public debug(message: string, ...meta: any[]) {
    this.logger.debug(message, ...meta);
  }

  public http(message: string, ...meta: any[]) {
    this.logger.http(message, ...meta);
  }
}

export default Logger;
