// apps/web/src/config/accessControl.ts

export type UserRole = "guest" | "user" | "moderator" | "admin" | "ngo" | "politics" | "legitimized" | "premium" | string;

interface RouteAccessRule {
  path: string; // z. B. "/report", "/stream"
  label?: string; // für Sidebar/Navigation (optional)
  allowedRoles: UserRole[]; // Liste der erlaubten Rollen
  customCheck?: (user: any) => boolean; // Optional: Extra-Checker (z. B. "legitimized" UND "premium" etc.)
}

// Hier alle Seiten + Rechte
export const ACCESS_RULES: RouteAccessRule[] = [
  {
    path: "/report",
    label: "Report",
    allowedRoles: ["user", "admin", "legitimized", "moderator"],
  },
  {
    path: "/stream",
    label: "Live & Replay",
    allowedRoles: ["user", "legitimized", "admin", "moderator", "ngo", "politics],
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    allowedRoles: ["admin", "user", "legitimized", "moderator", "ngo", "politics"],
  },
  // ... beliebig viele weitere Seiten!
];
