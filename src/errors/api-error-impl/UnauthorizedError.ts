import ApiError from "../ApiError";

class UnauthorizedError extends ApiError {
  constructor(message: string, correlationId?: string) {
    super(message, 403, correlationId);
  }
}

export default UnauthorizedError;
