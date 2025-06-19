import { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/api-error-impl/NotFoundError";

const routeNotFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    new NotFoundError(
      "Route does not exists",
      req.headers["x-correlation-id"] as string,
    ),
  );
};

export default routeNotFoundHandler;
