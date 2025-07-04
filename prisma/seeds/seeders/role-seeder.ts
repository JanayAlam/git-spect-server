import { PrismaClient } from "@prisma/client";

import rolesData from "../data/roles.json";

const seedRoles = async (prisma: PrismaClient) => {
  await prisma.role.createMany({
    data: rolesData,
    skipDuplicates: true,
  });
};

export default seedRoles;
