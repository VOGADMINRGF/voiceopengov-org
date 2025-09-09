import { NextResponse } from "next/server";
import repo from "@features/graph";
import type { Region, Statement, Topic, User, Report, Vote } from "@features/graph/types";

export async function POST() {
  // Minimal-Demo-Daten (IDs stabil halten)
  const users: User[] = [
    { id: "u_de_001", name: "Ricky", locale: "de-DE" },
    { id: "u_de_002", name: "Petra", locale: "de-DE" },
  ];
  const topics: Topic[] = [
    { id: "t_democracy", name: "Demokratie", class: "politics" },
    { id: "t_water", name: "Wasser & Infrastruktur", class: "infrastructure" },
  ];
  const regions: Region[] = [
    { id: "r_de_be", code: "DE-BE", name: "Berlin", scope: "regional" },
  ];
  const statements: Statement[] = [
    { id: "s_vote16", title: "Wählen ab 16?", text: "Soll das Wahlalter bundesweit auf 16 gesenkt werden?", lang: "de" },
    { id: "s_water", title: "Trinkwasser sichern", text: "Soll Trinkwasser als Grundrecht national priorisiert werden?", lang: "de" },
  ];
  const reports: Report[] = [
    { id: "r_demo_001", title: "Jugend & Wahlen – Kurzreport", summary: "Übersicht über Wahlalter 16" },
  ];
  const votes: Vote[] = [
    { id: "v1", value: "agree", userId: "u_de_001", statementId: "s_vote16", ts: new Date().toISOString() },
  ];

  await repo.ensureSchema();

  for (const u of users) await repo.upsertUser(u);
  for (const t of topics) await repo.upsertTopic(t);
  for (const r of regions) await repo.upsertRegion(r);
  for (const s of statements) await repo.upsertStatement(s);
  for (const r of reports) await repo.upsertReport(r);

  await repo.relateStatementTopic("s_vote16", "t_democracy");
  await repo.relateStatementRegion("s_vote16", "r_de_be");
  await repo.relateReportStatement("r_demo_001", "s_vote16");

  for (const v of votes) await repo.createVote(v);

  return NextResponse.json({ ok: true, counts: { users: users.length, topics: topics.length, regions: regions.length, statements: statements.length, reports: reports.length, votes: votes.length } });
}