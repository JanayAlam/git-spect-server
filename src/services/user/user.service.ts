import { User, USER_STATUS } from "@prisma/client";
import prisma from "../../database";
import { SYSTEM_ROLE } from "../../database/enums/system-role";

export interface ICreateUserData {
  email: string;
  avatarUrl?: string;
  name?: string;
  password?: string;
  userStatus?: USER_STATUS;
  roleName?: string;
}

type TOptions = { omit?: Partial<Record<keyof User, boolean>> };

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

export const getUserById = (id: string, options?: TOptions) => {
  return prisma.user.findUnique({
    where: { id },
    omit: options ? { ...options.omit } : {},
  });
};

export const getUserByEmail = (email: string, options?: TOptions) => {
  return prisma.user.findFirst({
    where: { email },
    include: { role: true },
    omit: options ? { ...options.omit } : {},
  });
};
