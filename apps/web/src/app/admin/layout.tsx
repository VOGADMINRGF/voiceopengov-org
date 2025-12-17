import { redirect } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";
import { getSessionUser } from "@/lib/server/auth/sessionUser";
import { sessionHasPassedTwoFactor, userRequiresTwoFactor } from "@/lib/server/auth/twoFactor";
import { userIsAdminDashboard } from "@/lib/server/auth/roles";

type Props = {
  children: ReactNode;
};

export const metadata = {
  title: "Admin · VoiceOpenGov",
};

export default async function AdminLayout({ children }: Props) {
  const user = await getSessionUser();
  const requiresTwoFactor = userRequiresTwoFactor(user);
  const hasTwoFactor = sessionHasPassedTwoFactor(user);

  logGate({
    path: "/admin",
    userId: user?._id ? String(user._id) : null,
    email: maskEmail((user as any)?.email),
    roles: (user as any)?.roles || (user as any)?.role,
    requiresTwoFactor,
    hasTwoFactor,
  });

  if (!user) {
    redirect(`/login?next=${encodeURIComponent("/admin")}`);
  }

  if (requiresTwoFactor && !hasTwoFactor) {
    redirect(`/login?next=${encodeURIComponent("/admin")}&step=verify`);
  }

  if (!userIsAdminDashboard(user)) {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/access", label: "Access Center" },
    { href: "/admin/users", label: "Nutzer & Rollen" },
    { href: "/admin/analytics", label: "Analytics" },
    { href: "/admin/graph/impact", label: "Graph & Evidence" },
    { href: "/admin/telemetry/ai", label: "AI Telemetry" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/newsletter", label: "Newsletter" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
        <aside className="hidden w-56 shrink-0 flex-col gap-3 rounded-3xl bg-white/90 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 md:flex">
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">Admin</p>
            <p className="text-sm font-semibold text-slate-900">VoiceOpenGov</p>
            <p className="text-xs text-slate-500 truncate">{user.email ?? "admin"}</p>
          </div>
          <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-slate-100 px-3 py-2 hover:border-sky-300 hover:bg-sky-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="flex items-center justify-between rounded-3xl bg-white/90 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)] ring-1 ring-slate-100">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">Admin Dashboard</p>
              <h1 className="text-xl font-semibold text-slate-900">Kontrolle & Insights</h1>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700"
            >
              Zurück zur App
            </Link>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

function maskEmail(email?: string | null) {
  if (!email) return null;
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const head = name.slice(0, 2);
  return `${head}${name.length > 2 ? "***" : ""}@${domain}`;
}

function logGate(payload: Record<string, unknown>) {
  try {
    console.log("[admin-layout]", payload);
  } catch {
    // ignore
  }
}
