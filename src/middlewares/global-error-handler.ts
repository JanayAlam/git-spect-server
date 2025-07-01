import { NextFunction, Request, Response } from "express";
import InternalServerError from "../errors/api-error-impl/InternalServerError";
import ApiError from "../errors/ApiError";
import Config, { ENVIRONMENT } from "../parameters/config";
import logger from "../utils/logger";
import { deepCopy } from "../utils/object";

const configInstance = Config.getInstance();

const maskSensitiveData = (obj: Record<string, unknown>) => {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const objCopy = deepCopy(obj);

  const sensitiveRules: Record<string, string> = {
    password: "******",
    authorization: "********************",
  };

  for (const key of Object.keys(objCopy)) {
    if (Object.keys(sensitiveRules).includes(key)) {
      objCopy[key] = sensitiveRules[key];
    }
  }

  return objCopy;
};

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
      body: maskSensitiveData(req.body),
      url: req.originalUrl,
      method: req.method,
      headers: maskSensitiveData(req.headers),
    });
  });

  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception thrown:", err, {
      correlationId,
      body: maskSensitiveData(req.body),
      url: req.originalUrl,
      method: req.method,
      headers: maskSensitiveData(req.headers),
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
    response: errObj,
    correlationId,
    stack: (err as Error).stack,
    body: maskSensitiveData(req.body),
    url: req.originalUrl,
    method: req.method,
    headers: maskSensitiveData(req.headers),
  });

  res.status(errObj.statusCode).json(errObj);
};

export default globalErrorHandler;
