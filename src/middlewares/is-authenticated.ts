import { NextFunction, Request, Response } from "express";
import prisma from "../database";
import UnauthorizedError from "../errors/api-error-impl/UnauthorizedError";
import tokenService from "../lib/token";

const isAuthenticated = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Token is not privded");
      }

      const accessToken = authHeader.split(" ")[1];

      if (!accessToken) {
        throw new UnauthorizedError("Token is not privded");
      }

      const payload = tokenService.verifyToken(accessToken);

      if (!payload) {
        throw new UnauthorizedError("Token is not valid or expired");
      }

      const user = await prisma.user.findFirst({
        where: {
          id: payload.sub,
          roleId: payload.roleId,
        },
        include: {
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedError("Token is not valid");
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default isAuthenticated;
