import {
  PERMISSION_ACTION,
  PERMISSION_RESOURCE,
  PERMISSION_TYPE,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

const rolesData = [
  {
    name: "super_admin",
    description: "Highest possible role",
  },
  {
    name: "user",
    description: "Normal user role",
  },
];

const permissionsData = [
  {
    name: "perm_manage_users",
    description: "Manage users",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.MANAGE,
  },
  {
    name: "perm_read_users",
    description: "Read users",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.READ,
  },
  {
    name: "perm_write_users",
    description: "Create users",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.WRITE,
  },
  {
    name: "perm_update_users",
    description: "Update users",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.UPDATE,
  },
  {
    name: "perm_delete_users",
    description: "Delete users",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.DELETE,
  },
  {
    name: "perm_change_password",
    description: "Change own password",
    requiresOwnership: true,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.CHANGE_PASSWORD,
  },
  {
    name: "perm_update_profile",
    description: "Update own profile",
    requiresOwnership: true,
    resource: PERMISSION_RESOURCE.USER,
    action: PERMISSION_ACTION.UPDATE_PROFILE,
  },
  {
    name: "perm_manage_roles",
    description: "Manage roles",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE,
    action: PERMISSION_ACTION.MANAGE,
  },
  {
    name: "perm_read_roles",
    description: "Read roles",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE,
    action: PERMISSION_ACTION.READ,
  },
  {
    name: "perm_write_roles",
    description: "Create roles",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE,
    action: PERMISSION_ACTION.WRITE,
  },
  {
    name: "perm_update_roles",
    description: "Update roles",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE,
    action: PERMISSION_ACTION.UPDATE,
  },
  {
    name: "perm_delete_roles",
    description: "Delete roles",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE,
    action: PERMISSION_ACTION.DELETE,
  },
  {
    name: "perm_manage_user_roles",
    description: "Manage user-role assignments",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER_ROLES,
    action: PERMISSION_ACTION.MANAGE,
  },
  {
    name: "perm_read_user_roles",
    description: "Read user-role assignments",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER_ROLES,
    action: PERMISSION_ACTION.READ,
  },
  {
    name: "perm_write_user_roles",
    description: "Assign roles to users",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER_ROLES,
    action: PERMISSION_ACTION.WRITE,
  },
  {
    name: "perm_update_user_roles",
    description: "Update user-role assignments",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER_ROLES,
    action: PERMISSION_ACTION.UPDATE,
  },
  {
    name: "perm_delete_user_roles",
    description: "Remove user-role assignments",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.USER_ROLES,
    action: PERMISSION_ACTION.DELETE,
  },
  {
    name: "perm_manage_permissions",
    description: "Manage permissions",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.PERMISSION,
    action: PERMISSION_ACTION.MANAGE,
  },
  {
    name: "perm_read_permissions",
    description: "Read permissions",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.PERMISSION,
    action: PERMISSION_ACTION.READ,
  },
  {
    name: "perm_write_permissions",
    description: "Create permissions",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.PERMISSION,
    action: PERMISSION_ACTION.WRITE,
  },
  {
    name: "perm_update_permissions",
    description: "Update permissions",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.PERMISSION,
    action: PERMISSION_ACTION.UPDATE,
  },
  {
    name: "perm_delete_permissions",
    description: "Delete permissions",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.PERMISSION,
    action: PERMISSION_ACTION.DELETE,
  },
  {
    name: "perm_manage_role_permissions",
    description: "Manage role-permission mapping",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE_PERMISSIONS,
    action: PERMISSION_ACTION.MANAGE,
  },
  {
    name: "perm_read_role_permissions",
    description: "Read role-permission mapping",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE_PERMISSIONS,
    action: PERMISSION_ACTION.READ,
  },
  {
    name: "perm_write_role_permissions",
    description: "Create role-permission mapping",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE_PERMISSIONS,
    action: PERMISSION_ACTION.WRITE,
  },
  {
    name: "perm_update_role_permissions",
    description: "Update role-permission mapping",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE_PERMISSIONS,
    action: PERMISSION_ACTION.UPDATE,
  },
  {
    name: "perm_delete_role_permissions",
    description: "Delete role-permission mapping",
    requiresOwnership: false,
    resource: PERMISSION_RESOURCE.ROLE_PERMISSIONS,
    action: PERMISSION_ACTION.DELETE,
  },
];

const rolePermissionsData = [
  {
    roleName: "super_admin",
    permissionName: "perm_manage_users",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "super_admin",
    permissionName: "perm_change_password",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "super_admin",
    permissionName: "perm_update_profile",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "super_admin",
    permissionName: "perm_manage_roles",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "super_admin",
    permissionName: "perm_manage_user_roles",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "super_admin",
    permissionName: "perm_manage_permissions",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "super_admin",
    permissionName: "perm_manage_role_permissions",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "user",
    permissionName: "perm_read_users",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "user",
    permissionName: "perm_change_password",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
  {
    roleName: "user",
    permissionName: "perm_update_profile",
    permissionType: PERMISSION_TYPE.ALLOW,
  },
];

const main = async () => {
  await prisma.role.createMany({
    data: rolesData,
    skipDuplicates: true,
  });

  await prisma.permission.createMany({
    data: permissionsData,
    skipDuplicates: true,
  });

  const allRoles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const roleMap = allRoles.reduce((acc: any, cur) => {
    acc[cur.name] = cur.id;
    return acc;
  }, {});

  const allPermissions = await prisma.permission.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const permissionMap = allPermissions.reduce((acc: any, cur) => {
    acc[cur.name] = cur.id;
    return acc;
  }, {});

  await Promise.all(
    rolePermissionsData.map((rolePermission: any) =>
      prisma.rolePermission.create({
        data: {
          permissionType: rolePermission.permissionType,
          role: {
            connect: { id: roleMap[rolePermission.roleName] },
          },
          permission: {
            connect: { id: permissionMap[rolePermission.permissionName] },
          },
        },
      }),
    ),
  );
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
