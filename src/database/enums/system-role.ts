export const SYSTEM_ROLE = {
  SUPER_ADMIN: "super_admin" as const,
  USER: "user" as const,
};

export type TSystemRole = (typeof SYSTEM_ROLE)[keyof typeof SYSTEM_ROLE];
