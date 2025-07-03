import ApiError, { IAPIError } from "../ApiError";

export interface IInternalServerError extends IAPIError {
  errorStack: string;
}

class InternalServerError extends ApiError {
  constructor(message: string, correlationId?: string) {
    super(message, 500, correlationId);
  }
}

export default InternalServerError;
