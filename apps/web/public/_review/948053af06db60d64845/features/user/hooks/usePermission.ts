// features/user/hooks/usePermission.ts

import { useMemo } from "react";
import { IUserProfile } from "../../../apps/web/src/models/pii/UserProfile";
import { useAuth } from "./useAuth";

export function usePermission(required: string | string[]) {
  const { user } = useAuth();
  if (!user) return false;
  const active = user.roles?.[user.activeRole]?.role;
  if (!active) return false;
  return Array.isArray(required) ? required.includes(active) : active === required;
}
type PermissionAction =
  | "writePost"
  | "vote"
  | "comment"
  | "manageTeam"
  | "createEvent"
  | "report"
  | "editPost"
  | "startPolicyReport"
  | "analyze"
  | "publicRelations"
  | "voteInternal"
  | "premiumFeature"
  | "regionVote"
  | "adminPanel";

/**
 * React-Hook für rollen-/statusbasierte Rechteabfrage.
 * @param user Aktueller User (aus Kontext, Session etc.)
 * @returns `can(action)` - Funktion zum Abfragen einzelner Rechte
 */
export function usePermission(user: IUserProfile | null) {
  return useMemo(() => ({
    can: (action: PermissionAction) => {
      if (!user || user.status !== "active") return false;

      // Multi-Account Support
      const active = user.roles[user.activeRole] || { role: "user" };

      // Hard Admin/Superadmin
      if (active.role === "admin" || active.role === "superadmin") return true;

      // Bürger:innen
      if (active.role === "user" || active.role === "citizen") {
        if (["writePost", "vote", "comment"].includes(action)) return true;
        if (action === "regionVote") return user.verification === "legitimized";
        if (action === "premiumFeature") return user.premium;
        return false;
      }

      // NGOs
      if (active.role === "ngo") {
        if (active.subRole === "admin" && ["manageTeam", "createEvent", "report"].includes(action)) return true;
        if (active.subRole === "editor" && ["writePost", "editPost"].includes(action)) return true;
        if (active.subRole === "user" && action === "writePost") return true;
        if (action === "premiumFeature") return user.premium;
        return false;
      }

      // Parteien
      if (active.role === "politics" || active.role === "party") {
        if (active.subRole === "admin" && ["manageTeam", "startPolicyReport", "analyze"].includes(action)) return true;
        if (active.subRole === "speaker" && ["writePost", "publicRelations"].includes(action)) return true;
        if (active.subRole === "user" && ["writePost", "voteInternal"].includes(action)) return true;
        if (action === "premiumFeature") return user.premium;
        return false;
      }

      return false;
    }
  }), [user]);
}
