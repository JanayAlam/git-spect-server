import winston, { transport } from "winston";
import Config, { ENVIRONMENT } from "../parameters/Config";

const { printf, combine, timestamp, colorize, align, errors } = winston.format;

// configuration variables
const configInstance = Config.getInstance();

class Logger {
  private static instance = new Logger();

  private logger: winston.Logger;

  private constructor() {
    const transports: transport[] = [];

    if (
      configInstance.environment === ENVIRONMENT.DEVELOPMENT ||
      configInstance.environment === ENVIRONMENT.TEST
    ) {
      transports.push(this.createConsoleLogTransport());
    }

    this.logger = winston.createLogger({
      exitOnError: false,
      level: configInstance.logLevel,
      format: combine(
        colorize({ all: true }),
        timestamp({
          format: "YYYY-MM-DD hh:mm:ss.SSS A",
        }),
        align(),
        errors({ stack: true }),
        printf((info) => {
          let msg = `[${info.timestamp} - ${info.level}]: ${info.message}`;

          if (info.stack) {
            msg += `\n${info.stack}`;
          }

          const meta = Object.assign({}, info);

          delete (meta as any).level;
          delete (meta as any).message;
          delete (meta as any).timestamp;
          delete (meta as any).stack;

          if (Object.keys(meta).length > 0) {
            msg += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
          }

          return msg;
        }),
      ),
      exceptionHandlers: transports,
      rejectionHandlers: transports,
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

  public profile(id: string | number, meta?: Record<string, any>) {
    this.logger.profile(id, meta);
  }
}

export default Logger;
