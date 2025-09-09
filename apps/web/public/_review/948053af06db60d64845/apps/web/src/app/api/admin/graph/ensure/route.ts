import { NextResponse } from "next/server";
import repo from "@features/graph";

export async function POST() {
  await repo.ensureSchema();
  return NextResponse.json({ ok: true });
}