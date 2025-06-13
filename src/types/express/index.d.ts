import "express";

declare module "express-serve-static-core" {
  interface Request {
    headers: {
      [key: string]: any;
      "x-correlation-id": string;
      authorization: string;
    };
  }
}
