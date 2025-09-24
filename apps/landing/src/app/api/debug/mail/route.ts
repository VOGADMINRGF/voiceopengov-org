import { NextResponse } from "next/server";
import { verifyTransport, sendMail } from "@/libs/mailer/transport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const toParam = url.searchParams.get("to") || undefined;

  const verify = await verifyTransport();

  let recipient =
    toParam ||
    process.env.MAIL_TEST_TO ||
    (process.env.MAIL_FROM?.match(/<(.+?)>/)?.[1] ?? undefined);

  let send: any = null;
  if (verify.ok && recipient) {
    send = await sendMail({
      to: recipient,
      subject: "SMTP Test – VoiceOpenGov",
      html: "<p>SMTP funktioniert ✅</p>",
    });
  }
  return NextResponse.json({
    ok: !!(verify.ok && send?.ok),
    verify,
    recipient: recipient || null,
    send: send || { ok: false, reason: "NO_TO" },
  });
}
