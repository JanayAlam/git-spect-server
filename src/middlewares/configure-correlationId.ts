import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";

const KEY = "x-correlation-id";

const configureCorrelationId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let correlationId = req.headers[KEY] as string | undefined;

    if (!correlationId || typeof correlationId !== "string") {
      correlationId = nanoid(12);
      req.headers[KEY] = correlationId;
    }

    req.correlationId = correlationId;
    res.setHeader(KEY, correlationId);

    next();
  } catch (err) {
    next(err);
  }
};

export default configureCorrelationId;
