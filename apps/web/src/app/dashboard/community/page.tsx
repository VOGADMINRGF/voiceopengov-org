// apps/web/src/app/dashboard/community/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react"; // wichtig: normales Minus!
import TabNav from "@components/TabNav";

import UserAdminList from "@features/user/components/UserAdminList";
import EngagementStats from "@features/ngo/components/EngagementStats";
import StatementList from "@features/statement/components/StatementList";

import {
  useRolePermission,
  type RpUser,
  type GlobalRole,
} from "@features/user/hooks/useRolePermission";

export default function CommunityDashboardPage() {
  const params = useSearchParams();
  const demo = params?.get("demo") === "1";

  // Auth / User aus NextAuth (falls aktiv)
  const { data, status } = useSession();
  const me: RpUser | null = (data?.user as unknown as RpUser) ?? null;

  // Rollen-Gate
  const { hasRole } = useRolePermission(me);
  const required: readonly GlobalRole[] = ["admin", "superadmin", "moderator"];
  const hasCommunity = required.some((r) => hasRole(r));

  if (!demo) {
    if (status === "loading") return <div className="p-6">Lädt…</div>;
    if (!hasCommunity) return <div className="p-6">Zugriff verweigert</div>;
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Community-Dashboard</h1>

      <TabNav tabs={["User", "Beteiligung", "Statements"]}>
        {/* Tab 1: User */}
        <UserAdminList />

        {/* Tab 2: Beteiligung – neutrale Defaults, bis echte Daten kommen */}
        <EngagementStats
          periodLabel="letzte 30 Tage"
          totals={{ members: 0, contributions: 0, activeThisMonth: 0 }}
          kpis={[]}
          timeseries={[]}
          segments={[]}
        />

        {/* Tab 3: Statements */}
        <StatementList />
      </TabNav>
    </main>
  );
}
