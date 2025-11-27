import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAccountOverview } from "@features/account/service";
import { MitgliedAntragClient } from "./MitgliedAntragClient";

export const metadata = {
  title: "Mitgliedsantrag – VoiceOpenGov",
  description: "B2C-Mitgliedschaft beantragen und Zahlungsdaten für die Gutschrift erhalten.",
};

export default async function MitgliedAntragPage({
  searchParams = {},
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const cookieStore = cookies();
  const userId = cookieStore.get("u_id")?.value;
  if (!userId) {
    redirect(`/login?next=${encodeURIComponent("/mitglied-antrag")}`);
  }

  const overview = await getAccountOverview(userId);
  if (!overview) {
    redirect(`/login?next=${encodeURIComponent("/mitglied-antrag")}`);
  }

  const initialIntent = parseIntent(searchParams);
  return <MitgliedAntragClient overview={overview} initialIntent={initialIntent} />;
}

function parseIntent(params: Record<string, string | string[] | undefined>) {
  const amountRaw = toSingle(params.betrag);
  const amount = amountRaw ? Number(amountRaw) : null;
  const rhythm = toSingle(params.rhythm);
  const memberCountRaw = toSingle(params.personen);
  const memberCount = memberCountRaw ? Number(memberCountRaw) : null;
  const edbPlan = toSingle(params.edbPlan);

  if (!amount && !rhythm && !memberCount && !edbPlan) {
    return undefined;
  }

  return {
    amount: Number.isFinite(amount) ? amount : null,
    rhythm: rhythm ?? null,
    memberCount: Number.isFinite(memberCount) ? memberCount : null,
    edbPlan: edbPlan ?? null,
  };
}

function toSingle(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value ?? undefined;
}
