import { useUser } from "@features/user/context/UserContext";
import { ACCESS_RULES } from "@config/accessControl";
import { usePathname } from "next/navigation";

export function useRouteGuard() {
  const { user } = useUser();
  const pathname = usePathname();

  const rule = ACCESS_RULES.find(rule => pathname.startsWith(rule.path));
  if (!rule) return { allowed: true }; // Kein spezielles Access-Rule → immer erlaubt

  // Gast-Check (wenn kein user)
  if (!user && rule.allowedRoles.includes("guest")) return { allowed: true };

  // Rollen-Match
  const allowed = !!user && user.roles?.some(r => rule.allowedRoles.includes(r.role));
  
  // Falls CustomCheck definiert
  if (rule.customCheck && user && !rule.customCheck(user)) return { allowed: false, reason: "Custom check failed." };

  return { allowed, reason: allowed ? undefined : "Zugriff verweigert." };
}
