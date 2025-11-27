import type { BankDetails } from "@/config/banking";

type VerificationTemplateInput = {
  verifyUrl: string;
  displayName?: string | null;
  locale?: string;
};

export function buildVerificationMail({ verifyUrl, displayName }: VerificationTemplateInput) {
  const greeting = displayName ? `Hallo ${displayName}` : "Hallo";
  const html = `
    <p>${greeting},</p>
    <p>bitte bestätige deine E-Mail-Adresse, um mit dem Login abzuschließen.</p>
    <p>
      <a href="${verifyUrl}" style="display:inline-flex;padding:10px 18px;border-radius:999px;background:#111;color:#fff;text-decoration:none;font-weight:600;">
        E-Mail bestätigen
      </a>
    </p>
    <p>Oder kopiere diesen Link in deinen Browser:<br />
      <a href="${verifyUrl}">${verifyUrl}</a>
    </p>
    <p>Falls du kein Konto angelegt hast, kannst du diese Nachricht ignorieren.</p>
    <p>– Das Team von VoiceOpenGov sagt Danke für deine Zeit der Sichtung.</p>
  `;
  const text = `${greeting},

bitte bestätige deine E-Mail-Adresse:
${verifyUrl}

Falls du kein Konto angelegt hast, kannst du diese Nachricht ignorieren.

– VoiceOpenGov`;

  return { subject: "Bitte bestätige deine E-Mail-Adresse", html, text };
}

export function buildTwoFactorCodeMail({ code }: { code: string }) {
  const subject = "Dein Login-Code für VoiceOpenGov";
  const html = `
    <p>Hallo,</p>
    <p>dein 2FA-Code für den Login lautet:</p>
    <p style="font-size:26px;font-weight:700;letter-spacing:4px;">${code}</p>
    <p>Der Code ist nur wenige Minuten gültig. Falls du den Login nicht gestartet hast, kannst du diese Nachricht ignorieren.</p>
    <p>– Dein VoiceOpenGov / eDebatte Team</p>
  `;

  const text = `Hallo,

dein 2FA-Code lautet: ${code}
Er ist nur wenige Minuten gültig.

Falls du den Login nicht gestartet hast, kannst du diese Nachricht ignorieren.

– VoiceOpenGov / eDebatte`;

  return { subject, html, text };
}

type MembershipMailInput = {
  firstName?: string | null;
  planLabel: string;
  monthlyAmount: number;
  discountApplied: boolean;
  reference: string;
  bank: BankDetails;
};

export function buildMembershipConfirmationMail({
  firstName,
  planLabel,
  monthlyAmount,
  discountApplied,
  reference,
  bank,
}: MembershipMailInput) {
  const greeting = firstName ? `Hallo ${firstName}` : "Hallo";
  const amount = formatEuro(monthlyAmount);
  const discountLine = discountApplied ? " (inkl. 25 % Mitgliederrabatt)" : "";

  const bankHtml = `
    <ul>
      <li><strong>Empfänger:</strong> ${bank.recipient}</li>
      <li><strong>Bank:</strong> ${bank.bankName}</li>
      <li><strong>IBAN:</strong> ${bank.iban}</li>
      <li><strong>BIC:</strong> ${bank.bic}</li>
      <li><strong>Verwendungszweck:</strong> ${reference}</li>
    </ul>
  `;

  const html = `
    <p>${greeting},</p>
    <p>danke für deinen Antrag auf die VoiceOpenGov-Mitgliedschaft (<strong>${planLabel}</strong>).</p>
    <p>Dein monatlicher Beitrag beträgt <strong>${amount}${discountLine}</strong>. Bitte richte eine Überweisung oder einen Dauerauftrag mit folgenden Bankdaten ein:</p>
    ${bankHtml}
    <p>Wichtig: Es handelt sich um eine Gutschrift bzw. einen Mitgliedsbeitrag – keine Spende, keine Spendenquittung.</p>
    <p>Sobald der erste Beitrag eingegangen ist, erhältst du die Bestätigung deiner Mitgliedschaft und (falls gebucht) den Rabatt auf eDebatte Pro/Premium.</p>
    <p>– Dein VoiceOpenGov Team</p>
  `;

  const text = `${greeting},

danke für deinen Antrag auf die VoiceOpenGov-Mitgliedschaft (${planLabel}).
Monatlicher Beitrag: ${amount}${discountLine}

Bank:
Empfänger: ${bank.recipient}
Bank: ${bank.bankName}
IBAN: ${bank.iban}
BIC: ${bank.bic}
Verwendungszweck: ${reference}

Es handelt sich um eine Gutschrift bzw. einen Mitgliedsbeitrag – keine Spende, keine Spendenquittung.

Sobald der erste Beitrag eingegangen ist, erhältst du die Bestätigung deiner Mitgliedschaft.

– VoiceOpenGov Team`;

  return {
    subject: "VoiceOpenGov – Mitgliedsantrag eingegangen",
    html,
    text,
  };
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(value);
}
