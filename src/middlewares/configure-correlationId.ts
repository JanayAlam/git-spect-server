import { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";

const configureCorrelationId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let correlationId = req.headers["x-correlation-id"] as string | undefined;

    if (!correlationId || typeof correlationId !== "string") {
      correlationId = nanoid(12);
      req.headers["x-correlation-id"] = correlationId;
    }

    res.setHeader("x-correlation-id", correlationId);

    next();
  } catch (err) {
    next(err);
  }
};

export default configureCorrelationId;
