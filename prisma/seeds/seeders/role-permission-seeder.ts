import { PrismaClient } from "@prisma/client";

import rolePermissionsData from "../data/role-permissions.json";

const seedRolePermissions = async (prisma: PrismaClient) => {
  await Promise.all(
    rolePermissionsData.map((rolePermission: any) =>
      prisma.rolePermission.create({
        data: {
          permissionType: rolePermission.permissionType,
          role: {
            connect: { name: rolePermission.roleName },
          },
          permission: {
            connect: { name: rolePermission.permissionName },
          },
        },
      }),
    ),
  );
};

export default seedRolePermissions;
