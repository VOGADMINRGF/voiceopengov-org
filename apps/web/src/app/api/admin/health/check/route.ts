export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

const EnvSchema = z.object({
  CORE_DB_NAME: z.string().min(1),
  CORE_MONGODB_URI: z.string().min(1),
});

async function loadSystemMatrix() {
  try {
    const mod = await import("@/server/health");
    return mod.runSystemMatrix;
  } catch (err) {
    console.error("[admin/health] system matrix unavailable", err);
    return null;
  }
}

async function isAdmin() {
  const c = await cookies();
  return c.get("u_role")?.value === "admin";
}

export async function POST() {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const envCheck = EnvSchema.safeParse(process.env);
  if (!envCheck.success) {
    return NextResponse.json(
      { error: "env_missing", details: envCheck.error.flatten() },
      { status: 503 },
    );
  }

  const runSystemMatrix = await loadSystemMatrix();
  if (!runSystemMatrix) {
    return NextResponse.json(
      { error: "system_check_unavailable", details: "env invalid" },
      { status: 503 },
    );
  }

  const services = await runSystemMatrix();
  return NextResponse.json({ ts: new Date().toISOString(), services });
}
