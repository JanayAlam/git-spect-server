export interface IAPIError {
  message: string;
  statusCode: number;
  correlationId: string;
}

class ApiError {
  constructor(
    private message: string,
    private statusCode: number,
    private correlationId: string,
  ) {}

  toObject(): IAPIError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
    };
  }
}

export default ApiError;
