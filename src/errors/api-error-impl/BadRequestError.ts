import ApiError, { IAPIError } from "../ApiError";

export interface IErrorField {
  name: string;
  message: string;
  in: "body" | "param" | "query";
}

export interface IBadRequestError extends IAPIError {
  errorFields: IErrorField[];
}

class BadRequestError extends ApiError {
  errorFields: IErrorField[];

  constructor(
    message: string,
    errorFields: IErrorField[],
    correlationId?: string,
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
