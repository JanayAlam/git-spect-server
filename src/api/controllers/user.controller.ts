import { NextFunction, Request, Response } from "express";

export const getMeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};
