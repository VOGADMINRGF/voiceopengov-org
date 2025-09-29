// apps/web/src/hooks/useRouteGuardClient.ts
"use client";
import { usePathname } from "next/navigation";
import { useRouteGuard, type AccessRule, type UserLike } from "../../../features/auth/hooks/useRouteGuard";

// Falls du noch keinen UserContext hast, setz user = null oder bring deinen eigenen Hook mit:
function useUser(): UserLike {
  return null; // stub, bis dein echter Context da ist
}

// Beispiel-Regeln – oder importiere deine echten:
const DEFAULT_RULES: AccessRule[] = [
  { path: "/admin", allowedRoles: ["admin"] },
  { path: "/account", allowedRoles: ["user", "admin"] },
];

export default function useRouteGuardClient(rules: AccessRule[] = DEFAULT_RULES) {
  const pathname = usePathname() || "/";
  const user = useUser();
  return useRouteGuard({ pathname, user, rules });
}
