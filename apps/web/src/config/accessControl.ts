export const accessControl = {
  allowedRoles: ["user", "legitimized", "admin", "moderator", "ngo", "politics"] as const,
};
export type AllowedRole = typeof accessControl.allowedRoles[number];
