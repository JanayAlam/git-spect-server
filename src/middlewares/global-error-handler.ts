import { NextFunction, Request, Response } from "express";
import InternalServerError from "../errors/api-error-impl/InternalServerError";
import ApiError from "../errors/ApiError";
import Logger from "../logger";
import Config, { ENVIRONMENT } from "../parameters/config";

// env variables
const configInstance = Config.getInstance();

// logger
const logger = Logger.getInstance();

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception thrown:", err);
  });

  if (err instanceof ApiError) {
    const errObj = err.toObject();
    res.status(errObj.statusCode).json(errObj);
    return;
  }

  let errMessage: string = (err as Error).message;

  if (configInstance.environment === ENVIRONMENT.PRODUCTION) {
    errMessage = "Something went wrong";
  }

  const errObj = new InternalServerError(
    errMessage,
    req.headers["x-correlation-id"] as string,
  );

  res.status(500).json(errObj);
};

export default globalErrorHandler;
