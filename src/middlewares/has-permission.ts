import { PERMISSION_ACTION, PERMISSION_RESOURCE } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import prisma from "../database";
import UnauthorizedError from "../errors/api-error-impl/UnauthorizedError";

const hasPermission = (
  resource: PERMISSION_RESOURCE,
  action: PERMISSION_ACTION,
  requiresOwnership: boolean = false,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !user.role) {
        throw new UnauthorizedError("No user or role found");
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
        next(new UnauthorizedError("Access request denied"));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default hasPermission;
