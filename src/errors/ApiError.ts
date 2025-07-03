export interface IAPIError {
  message: string;
  statusCode: number;
  correlationId: string | null;
}

class ApiError {
  constructor(
    private message: string,
    private statusCode: number,
    private correlationId: string | null = null,
  ) {}

  setCorrelationId(correlationId: string) {
    this.correlationId = correlationId;
  }

  toObject(): IAPIError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      correlationId: this.correlationId,
    };
  }
}

export default ApiError;
