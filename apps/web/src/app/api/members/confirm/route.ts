import { membersCol } from "@/lib/vogMongo";
import { getCountryMeta } from "@/lib/countries";

type MemberPreview = {
  type: "person" | "organisation";
  firstName?: string;
  lastName?: string;
  orgName?: string;
  city?: string;
  country?: string;
  avatarUrl?: string;
  supporterImageUrl?: string;
  publicSupporter?: boolean;
  supporterNote?: string;
  wantsNewsletter?: boolean;
  wantsNewsletterEdDebatte?: boolean;
  isPublic?: boolean;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCountryLabel(code?: string | null) {
  if (!code) return "";
  const meta = getCountryMeta(code);
  const translations = (meta as any)?.translations;
  return (
    translations?.deu?.common ||
    translations?.deu?.official ||
    (meta as any)?.name?.common ||
    code.toUpperCase()
  );
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "V";
  const letters = parts.slice(0, 2).map((part) => part[0].toUpperCase());
  return letters.join("");
}

function renderPage(opts: {
  title: string;
  message: string;
  ok: boolean;
  baseUrl: string;
  member?: MemberPreview | null;
}) {
  const { title, message, ok, baseUrl, member } = opts;
  const name =
    member?.type === "organisation"
      ? member?.orgName?.trim()
      : [member?.firstName?.trim(), member?.lastName?.trim()].filter(Boolean).join(" ");
  const location = [member?.city?.trim(), getCountryLabel(member?.country)].filter(Boolean).join(", ");
  const visibility = member?.isPublic ? "Öffentlich (nur Orts-Summen)" : "Privat";
  const supporter = member?.publicSupporter ? "Ja" : "Nein";
  const newsletter = member?.wantsNewsletter ? "Ja" : "Nein";
  const newsletterEd = member?.wantsNewsletterEdDebatte ? "Ja" : "Nein";
  const initials = initialsFromName(name || "VoiceOpenGov");
  const avatarSrc = member?.supporterImageUrl || member?.avatarUrl || "";
  const avatarUrl = avatarSrc ? escapeHtml(avatarSrc) : "";
  const statusColor = ok ? "#0ea5e9" : "#ef4444";

  const profileCard = member
    ? `
      <div style="margin-top: 18px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px; background: #f8fafc;">
        <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 10px;">
          Profil-Vorschau
        </div>
        <div style="display: flex; gap: 14px; align-items: center;">
          ${
            avatarUrl
              ? `<img src="${avatarUrl}" alt="Profilbild" style="width: 64px; height: 64px; border-radius: 999px; object-fit: cover; border: 2px solid #e2e8f0;" />`
              : `<div style="width: 64px; height: 64px; border-radius: 999px; background: #e2e8f0; color: #0f172a; display: flex; align-items: center; justify-content: center; font-weight: 700;">${escapeHtml(initials)}</div>`
          }
          <div>
            <div style="font-size: 16px; font-weight: 700; color: #0f172a;">${
              name ? escapeHtml(name) : "Mitglied"
            }</div>
            <div style="font-size: 13px; color: #475569;">${location || "Ort folgt"}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${visibility}</div>
          </div>
        </div>
        <table style="width: 100%; margin-top: 12px; font-size: 12px; color: #0f172a; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #475569;">Unterstützer-Banner</td><td style="padding: 4px 0; font-weight: 600;">${supporter}</td></tr>
          ${
            member?.supporterNote
              ? `<tr><td style="padding: 4px 0; color: #475569;">Motivation</td><td style="padding: 4px 0; font-weight: 600;">${escapeHtml(
                  member.supporterNote
                )}</td></tr>`
              : ""
          }
          <tr><td style="padding: 4px 0; color: #475569;">Newsletter VoiceOpenGov</td><td style="padding: 4px 0; font-weight: 600;">${newsletter}</td></tr>
          <tr><td style="padding: 4px 0; color: #475569;">Updates eDebatte</td><td style="padding: 4px 0; font-weight: 600;">${newsletterEd}</td></tr>
        </table>
      </div>
    `
    : "";

  const html = `<!doctype html>
  <html lang="de">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
    </head>
    <body style="margin:0; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; color: #0f172a;">
      <div style="max-width: 720px; margin: 40px auto; padding: 0 20px;">
        <div style="border-radius: 20px; background: #ffffff; box-shadow: 0 20px 50px rgba(15,23,42,0.08); padding: 28px;">
          <div style="height: 6px; border-radius: 999px; background: linear-gradient(90deg,#06b6d4,#0ea5e9,#2563eb); margin-bottom: 18px;"></div>
          <h1 style="margin: 0 0 10px; font-size: 24px; font-weight: 800;">${escapeHtml(title)}</h1>
          <p style="margin: 0 0 16px; font-size: 14px; color: #475569; line-height: 1.6;">${escapeHtml(message)}</p>
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; background: ${statusColor}; color: #ffffff; font-size: 12px; font-weight: 700;">
            ${ok ? "Bestätigt" : "Nicht bestätigt"}
          </div>
          ${profileCard}
          <div style="margin-top: 18px; padding: 14px; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; margin-bottom: 6px;">Nächste Schritte</div>
            <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569;">
              <li>Profil & Passwort kommen als nächster Schritt (in Arbeit).</li>
              <li>Chat & Zusammenarbeit folgen danach, damit Chapters lokal sichtbar werden.</li>
              <li>Wenn du Fragen hast, melde dich jederzeit.</li>
            </ul>
          </div>
          <div style="margin-top: 18px; display: flex; flex-wrap: wrap; gap: 10px;">
            <a href="${baseUrl}/" style="background: #0ea5e9; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 999px; font-weight: 600; font-size: 13px;">Zur Startseite</a>
            <a href="https://startnext.com/mehrheit" style="background: #06b6d4; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 999px; font-weight: 600; font-size: 13px;">Spenden via Startnext</a>
            <a href="${baseUrl}/kontakt" style="background: #e2e8f0; color: #0f172a; text-decoration: none; padding: 10px 16px; border-radius: 999px; font-weight: 600; font-size: 13px;">Fragen?</a>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  return new Response(html, {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const base = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
  if (!token) {
    return renderPage({
      title: "Link unvollständig",
      message: "Der Bestätigungslink ist unvollständig. Bitte nutze den Link aus deiner E-Mail.",
      ok: false,
      baseUrl: base,
    });
  }

  const col = await membersCol();
  const now = new Date();

  const member = await col.findOne({ doiToken: token });
  if (!member) {
    return renderPage({
      title: "Bestätigungslink ungültig",
      message:
        "Der Link ist ungültig oder wurde bereits verwendet. Falls nötig, trage dich bitte erneut ein.",
      ok: false,
      baseUrl: base,
    });
  }

  if (member.doiExpiresAt && member.doiExpiresAt < now) {
    return renderPage({
      title: "Bestätigungslink abgelaufen",
      message:
        "Der Link ist abgelaufen. Bitte trage dich erneut ein, damit wir dir einen neuen Link senden.",
      ok: false,
      baseUrl: base,
    });
  }

  await col.updateOne(
    { _id: member._id },
    { $set: { status: "active", confirmedAt: now }, $unset: { doiToken: "", doiExpiresAt: "" } }
  );

  return renderPage({
    title: "E-Mail bestätigt",
    message: "Danke! Deine Mitgliedschaft ist jetzt aktiv. Unten siehst du eine Vorschau.",
    ok: true,
    baseUrl: base,
    member: member as MemberPreview,
  });
}
