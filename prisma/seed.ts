import { PrismaClient } from "@prisma/client";

import seedPermissions from "./seeds/seeders/permission-seeder";
import seedRolePermissions from "./seeds/seeders/role-permission-seeder";
import seedRoles from "./seeds/seeders/role-seeder";
import seedUsers from "./seeds/seeders/superadmin-seeder";

const prisma = new PrismaClient();

const main = async () => {
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    throw new Error("Super admin credentials are missing");
  }

  await seedRoles(prisma);
  await seedPermissions(prisma);
  await seedRolePermissions(prisma);
  await seedUsers(prisma, superAdminEmail, superAdminPassword);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
