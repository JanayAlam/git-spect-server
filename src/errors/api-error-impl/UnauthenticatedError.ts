import ApiError from "../ApiError";

class UnauthenticatedError extends ApiError {
  constructor(message: string, correlationId?: string) {
    super(message, 401, correlationId);
  }
}

export default UnauthenticatedError;
