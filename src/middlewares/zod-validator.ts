import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import BadRequestError, {
  IErrorField,
} from "../errors/api-error-impl/BadRequestError";

const zodValidator = (
  bodySchema?: ZodSchema<any> | null,
  paramsSchema?: ZodSchema<any> | null,
  querySchema?: ZodSchema<any> | null,
) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const correlationId = (req.headers["x-correlation-id"] as string) || "";
      if (bodySchema) {
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
          const errorFields: IErrorField[] = result.error.errors.map((err) => ({
            name: err.path.join("."),
            message: err.message,
            in: "body",
          }));
          throw new BadRequestError(
            "Invalid request body",
            correlationId,
            errorFields,
          );
        }
      }
      if (paramsSchema) {
        const result = paramsSchema.safeParse(req.params);
        if (!result.success) {
          const errorFields: IErrorField[] = result.error.errors.map((err) => ({
            name: err.path.join("."),
            message: err.message,
            in: "param",
          }));
          throw new BadRequestError(
            "Invalid request params",
            correlationId,
            errorFields,
          );
        }
      }
      if (querySchema) {
        const result = querySchema.safeParse(req.query);
        if (!result.success) {
          const errorFields: IErrorField[] = result.error.errors.map((err) => ({
            name: err.path.join("."),
            message: err.message,
            in: "query",
          }));
          throw new BadRequestError(
            "Invalid request query",
            correlationId,
            errorFields,
          );
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default zodValidator;
