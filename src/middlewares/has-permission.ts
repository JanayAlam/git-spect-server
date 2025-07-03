import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../database";
import UnauthenticatedError from "../errors/api-error-impl/UnauthenticatedError";

const hasPermission = (
  resource: PERMISSION_RESOURCE,
  action: PERMISSION_ACTION,
  requiresOwnership: boolean = false,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        throw new UnauthenticatedError("Unauthorized: No user or role found");
      }

      const permission = await prisma.rolePermission.findFirst({
        where: {
          roleId: user.role.id,
          permission: {
            resource,
            action: { in: [action, PERMISSION_ACTION.MANAGE] },
            requiresOwnership,
          },
        },
      });

      if (!permission) {
        next(new UnauthenticatedError("Forbidden access request"));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default hasPermission;
