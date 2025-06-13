import ApiError from "../ApiError";

class NotFoundError extends ApiError {
  constructor(message: string, correlationId: string) {
    super(message, 404, correlationId);
  }
}

export default NotFoundError;
