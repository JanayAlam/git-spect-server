import ApiError, { IAPIError } from "../ApiError";

export interface IErrorField {
  name: string;
  message: string;
}

export interface IBadRequestError extends IAPIError {
  errorFields: IErrorField[];
}

class BadRequestError extends ApiError {
  errorFields: IErrorField[];

  constructor(
    message: string,
    correlationId: string,
    errorFields: IErrorField[],
  ) {
    super(message, 400, correlationId);
    this.errorFields = errorFields;
  }

  toObject(): IBadRequestError {
    return {
      ...super.toObject(),
      errorFields: this.errorFields,
    };
  }
}

export default BadRequestError;
