import { NextFunction, Request, Response } from "express";
import InternalServerError from "../errors/api-error-impl/InternalServerError";
import ApiError from "../errors/ApiError";
import Config, { ENVIRONMENT } from "../parameters/config";
import logger from "../utils/logger";

// env variables
const configInstance = Config.getInstance();

const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const correlationId = req.headers["x-correlation-id"] as string;

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at:", promise, "reason:", reason, {
      correlationId,
      body: req.body,
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
    });
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception thrown:", err, {
      correlationId,
      body: req.body,
      url: req.originalUrl,
      method: req.method,
      headers: req.headers,
    });
  });

  const apiError =
    err instanceof ApiError
      ? err
      : new InternalServerError(
          configInstance.environment === ENVIRONMENT.PRODUCTION
            ? "Something went wrong"
            : (err as Error).message,
          req.headers["x-correlation-id"] as string,
        );

  const errObj = apiError.toObject();

  logger.error({
    ...errObj,
    correlationId,
    stack: (err as Error).stack,
    body: req.body,
    url: req.originalUrl,
    method: req.method,
    headers: req.headers,
  });

  res.status(errObj.statusCode).json(errObj);
};

export default globalErrorHandler;
