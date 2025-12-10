// file: app/account/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AccountClient } from "./AccountClient";
import { getAccountOverview } from "@features/account/service";
import { readSession } from "@/utils/session";

export const metadata = {
  title: "Mein Konto & eDebatte · VoiceOpenGov",
};

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AccountPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const session = await readSession();
  const userId = cookieStore.get("u_id")?.value || session?.uid;

  if (!userId) {
    redirect(`/login?next=${encodeURIComponent("/account")}`);
  }

  const overview = await getAccountOverview(userId);
  if (!overview) {
    redirect(`/login?next=${encodeURIComponent("/account")}`);
  }

  const membershipNotice =
    typeof searchParams?.membership === "string" &&
    searchParams.membership === "thanks";

  const displayName: string | undefined = (overview as any)?.profile?.displayName || (overview as any)?.displayName;
  const firstName = displayName?.trim().split(" ").filter(Boolean)[0] ?? undefined;
  const hasPackage = (overview as any)?.edebatte?.status && (overview as any).edebatte.status !== "none";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white py-8 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-12">
        <header className="space-y-2 md:space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">Konto &amp; eDebatte</p>

          <h1 className="text-2xl font-semibold leading-tight text-slate-900 md:text-3xl">
            {firstName ? (
              <>
                <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">{firstName}</span>
                <span className="text-slate-900">, dein Profil &amp; dein eDebatte-Paket</span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Dein Profil &amp; dein eDebatte-Paket
              </span>
            )}
          </h1>

          <p className="max-w-2xl text-xs md:text-sm text-slate-600">
            Verwalte deinen Zugang zu VoiceOpenGov und dein gewähltes eDebatte-Paket <strong>(Basis, Start oder Pro)</strong>. Hier kannst du
            Profilangaben, Sprache und Benachrichtigungen anpassen.
          </p>
          {!hasPackage && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Nächster Schritt: Wähle dein eDebatte-Paket (Basis, Start oder Pro).
            </p>
          )}
        </header>

        <AccountClient initialData={overview} membershipNotice={membershipNotice} />
      </div>
    </main>
  );
}
