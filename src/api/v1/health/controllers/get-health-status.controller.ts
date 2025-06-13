import { Request, Response } from "express";

export const getHealthStatusController = (req: Request, res: Response) => {
  res.send("ok");
};
