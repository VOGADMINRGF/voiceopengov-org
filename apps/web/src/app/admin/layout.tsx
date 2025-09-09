// apps/web/src/app/admin/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import SidebarNav from "@/components/admin/SidebarNavAdmin";
import { getServerUser } from "@/lib/auth/getServerUser"; // <- dein Server-Helper
import { ADMIN_ALLOWED_ROLES } from "@/app/admin/config/adminConfig";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // 🔐 Serverseitiger Guard für den gesamten Admin-Bereich
  const user = await getServerUser();
  const role = user?.role ?? "guest";

  if (!user || !ADMIN_ALLOWED_ROLES.includes(role as any)) {
    // optional: Grund anhängen
    redirect(`/login?next=/admin&reason=admin-only`);
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex bg-white text-black dark:bg-neutral-900 dark:text-neutral-100">
        <SidebarNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ThemeProvider>
  );
}
