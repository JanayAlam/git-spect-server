import { NextFunction, Request, Response } from "express";
import prisma from "../database";
import UnauthenticatedError from "../errors/api-error-impl/UnauthenticatedError";
import jwtToken from "../lib/jwt-token";

const isAuthenticated = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("Token is not privded");
      }

      const accessToken = authHeader.split(" ")[1];

      if (!accessToken) {
        throw new UnauthenticatedError("Token is not privded");
      }

      const payload = jwtToken.verifyToken(accessToken);

      if (!payload) {
        throw new UnauthenticatedError("Token is not valid or expired");
      }

      const user = await prisma.user.findFirst({
        where: {
          id: payload.sub,
          roleId: payload.roleId,
        },
        include: { role: true },
        omit: { password: true },
      });

      if (!user) {
        throw new UnauthenticatedError("Token is not valid");
      }

      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default isAuthenticated;
