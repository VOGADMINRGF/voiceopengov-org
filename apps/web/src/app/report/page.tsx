// apps/web/src/app/report/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/getServerUser";
import ReportPage from "@features/report/components/ReportPage";
import UserHydrator from "@features/user/components/UserHydrator";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const user = await getServerUser(); // sichere Server-Auth
  if (!user || !user.verified) {
    redirect("/login?next=/report&reason=verified-only");
  }

  // Optional: User in den Client-Context „spiegeln“ (für Header, Menüs, etc.)
  return (
    <>
      <UserHydrator user={user} />
      <ReportPage user={user} />
    </>
  );
}
