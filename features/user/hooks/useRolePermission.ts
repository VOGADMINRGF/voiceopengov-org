// apps/web/src/features/user/hooks/useRolePermission.ts
"use client";

import { useMemo } from "react";
import {
  type RpUser,
  type GlobalRole,
  type Permission,
  type PermissionContext,
  DEFAULT_POLICY,
  checkPermission,
} from "@/lib/access/permissions";

export function useRolePermission(
  user: RpUser | null | undefined,
  options?: { policy?: Partial<Record<Permission, GlobalRole[]>> }
) {
  const mergedPolicy = useMemo(() => {
    if (!options?.policy) return DEFAULT_POLICY;
    const out: Record<Permission, GlobalRole[]> = { ...DEFAULT_POLICY };
    for (const [k, v] of Object.entries(options.policy)) {
      out[k as Permission] = v as GlobalRole[];
    }
    return out;
  }, [options?.policy]);

  const hasRole = (role: GlobalRole) => !!user?.roles?.includes(role);
  const isAnyRole = (...roles: GlobalRole[]) => roles.some(hasRole);

  const can = (permission: Permission, ctx?: PermissionContext) =>
    checkPermission(user as any, permission, ctx, mergedPolicy);

  const withOrg = (orgId: string) => ({
    can: (permission: Permission, ctx?: Omit<PermissionContext, "orgId">) =>
      can(permission, { ...ctx, orgId }),
  });

  return {
    user,
    roles: user?.roles ?? [],
    policy: mergedPolicy,
    hasRole,
    isAnyRole,
    can,
    withOrg,
  };
}

export type { RpUser, GlobalRole, Permission, PermissionContext };
