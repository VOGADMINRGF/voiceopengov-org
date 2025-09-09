
console.log("useRolePermission RENDERT");

import { useAuth } from "../../auth/hooks/useAuth";

export function useRolePermission(required: string | string[]) {
  const { user } = useAuth();
  if (!user) return false;
  const active = user.roles?.[user.activeRole]?.role;
  if (!active) return false;
  return Array.isArray(required) ? required.includes(active) : active === required;
}
