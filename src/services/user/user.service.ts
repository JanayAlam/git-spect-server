import { USER_STATUS } from "@prisma/client";
import prisma from "../../database";
import { SYSTEM_ROLE } from "../../database/enums/system-role";

export interface ICreateUserData {
  email: string;
  avatarUrl?: string;
  name: string;
  password?: string;
  userStatus?: USER_STATUS;
  roleName?: string;
}

export const createUser = (userData: ICreateUserData) => {
  const { roleName, ...rest } = userData;

  return prisma.user.create({
    data: {
      ...rest,
      role: {
        connect: { name: roleName || SYSTEM_ROLE.USER },
      },
    },
    omit: { password: true },
  });
};
