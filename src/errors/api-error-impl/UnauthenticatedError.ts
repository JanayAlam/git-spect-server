import ApiError from "../ApiError";

class UnauthenticatedError extends ApiError {
  constructor(message: string, correlationId: string) {
    super(message, 403, correlationId);
  }
}

export default UnauthenticatedError;
