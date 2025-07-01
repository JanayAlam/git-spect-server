import { Prisma, USER_STATUS } from "@prisma/client";
import prisma from "../../database";

export interface ICreateUserData {
  email: string;
  avatarUrl?: string;
  name?: string;
  password?: string;
  userStatus?: USER_STATUS;
  roleName?: string;
}

type TOptions = { include?: Prisma.UserInclude; omit?: Prisma.UserOmit };

export const createUser = (
  userInput: Prisma.UserCreateInput,
  options?: TOptions,
) => {
  return prisma.user.create({
    data: userInput,
    omit: options ? { ...options.omit } : { password: true },
    include: options ? { ...options.include } : { role: true },
  });
};

export const getUserById = (id: string, options?: TOptions) => {
  return prisma.user.findUnique({
    where: { id },
    omit: options ? { ...options.omit } : { password: true },
    include: options ? { ...options.include } : { role: true },
  });
};

export const getUserByEmail = (email: string | null, options?: TOptions) => {
  if (!email) return null;

  return prisma.user.findFirst({
    where: { email },
    include: { role: true },
    omit: options ? { ...options.omit } : {},
  });
};

export const updateUserById = (
  id: string,
  data: Prisma.UserUpdateInput,
  options?: TOptions,
) => {
  return prisma.user.update({
    where: { id },
    data,
    omit: options?.omit,
    include: options?.include ?? { role: true },
  });
};
