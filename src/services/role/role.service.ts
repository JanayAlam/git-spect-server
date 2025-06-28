import prisma from "../../database";

export const getRoleByName = (name: string) => {
  return prisma.role.findUnique({
    where: { name },
  });
};
