import {
  PERMISSION_ACTION,
  PERMISSION_RESOURCE,
  PrismaClient,
} from "@prisma/client";

import permissionsData from "../data/permissions.json";

const seedPermissions = async (prisma: PrismaClient) => {
  await prisma.permission.createMany({
    data: permissionsData.map((perm: any) => ({
      ...perm,
      resource:
        PERMISSION_RESOURCE[perm.resource as keyof typeof PERMISSION_RESOURCE],
      action: PERMISSION_ACTION[perm.action as keyof typeof PERMISSION_ACTION],
    })),
    skipDuplicates: true,
  });
};

export default seedPermissions;
