# VoiceOpenGov Membership & Funding – Produktionsbetrieb

Stand: 12. September 2026

Dieses Runbook beschreibt den technisch implementierten Mitglieder- und Funding-Track. Es ist keine Behauptung, dass externe Konten, Rechtstexte oder Übersetzungen bereits menschlich freigegeben wurden.

## Unveränderliche Leitplanke

Mitgliedschaft ist kostenfrei. Freiwillige Unterstützung ist davon unabhängig. Betrag, Zahlungsrhythmus und Zahlungsstatus verändern niemals Stimmgewicht, Zugang oder politischen Einfluss. Der technische Zahlungsdatensatz speichert deshalb `politicalVoiceWeight: "none"`.

## Produktionsfreigabe

Vor einem Deployment muss aus dem Repository ausgeführt werden:

```bash
node apps/web/scripts/check-membership-funding-env.mjs --profile=full
pnpm lint
pnpm -C apps/web exec tsc --noEmit -p tsconfig.json
pnpm -C apps/web run test:membership-funding
pnpm build
```

Nach dem Build startet CI die gebaute Anwendung und prüft Startseite, Mitgliedschaftsanker, arabisches RTL, Login, Funding, einen negativen Zahlungsstatus und den geschlossen abgesicherten Admin-Pfad Ende-zu-Ende.

## Environment-Checkliste

### Mitgliedschaft und Konto (zwingend)

- `PUBLIC_BASE_URL`: kanonische HTTPS-URL, derzeit `https://www.voiceopengov.org`
- `MONGODB_URI`: erreichbare Produktionsverbindung für öffentliche Mitglieder-, Funnel-, Funding- und Outbox-Daten
- `VOG_DB_NAME`: öffentliche/logische VoiceOpenGov-Datenbank
- `PII_MONGODB_URI`: Produktionsverbindung für Credentials und Sessions
- `PII_DB_NAME`: von `VOG_DB_NAME` verschiedene PII-Datenbank
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`: produktiver, domain-verifizierter Transaktionsversand
- `VOG_ADMIN_USER`, `VOG_ADMIN_PASSWORD`: dedizierter Admin-Zugang; Passwort mindestens 24 zufällige Zeichen
- optional gehärtet: `BCRYPT_ROUNDS=12`, `SESSION_TTL_DAYS=7`

### Internationale Unterstützung (zwingend für Online-Zahlungen)

- `STRIPE_SECRET_KEY`: Schlüssel des allein für VoiceOpenGov verantworteten Stripe-Kontos/Teilkontos
- `STRIPE_WEBHOOK_SECRET`: Signing Secret des Endpunkts `/api/funding/webhook`
- `VOG_SUPPORT_SESSION_SECRET`: mindestens 32 zufällige Zeichen für kurzlebige Portal-Tokens
- Stripe Customer Portal im Stripe-Dashboard aktivieren
- Webhook mindestens für Checkout-, Payment-Intent-, Invoice- und Subscription-Statusereignisse konfigurieren

### Bank-Fallback (zwingend)

- `VOG_PAYMENT_BANK_RECIPIENT`
- `VOG_PAYMENT_BANK_IBAN`
- empfohlen: `VOG_PAYMENT_BANK_BIC`, `VOG_PAYMENT_BANK_NAME`, `VOG_PAYMENT_REFERENCE_PREFIX`

Geheimnisse gehören ausschließlich in den Secret Store des Hosters. Sie dürfen weder in Git, Build-Logs, Screenshots noch Support-Tickets kopiert werden.

## Datenflüsse und Aufbewahrung

- DOI- und Account-Tokens werden nur gehasht gespeichert und sind zeitlich begrenzt.
- Sessions werden nur gehasht gespeichert; Cookies sind `HttpOnly`, `Secure` in Produktion und `SameSite=Lax`.
- Funnel-Ereignisse speichern keine E-Mail-Adresse und laufen nach 90 Tagen per TTL ab.
- Newsletter-/CRM-Daten werden nur nach bestätigter Einwilligung in eine interne Outbox geschrieben. Automatischer Export ist absichtlich deaktiviert, bis ein Anbieter samt AVV, Feldmapping, Lösch- und Widerrufsprozess freigegeben wurde.
- Stripe erhält Zahlungsdaten; VoiceOpenGov speichert nur notwendige Provider-IDs, Betrag, Währung, Rhythmus und Status. Kartendaten werden nicht gespeichert.

## Inbetriebnahme und Rollback

1. Environment-Check für `membership`, danach für `funding` ausführen.
2. Atlas-DNS, Netzwerkfreigabe und getrennte Datenbanknamen prüfen.
3. Testmitgliedschaft durchführen: Formular → DOI-Mail → Bestätigung → Passwort setzen → Login → Logout.
4. Stripe im Testmodus prüfen: einmalig und wiederkehrend → signierter Webhook → Statusseite → Customer Portal.
5. Bankdaten und lokale Texte visuell in allen zehn Sprachen prüfen; Arabisch zusätzlich mobil in RTL.
6. Erst danach Live-Schlüssel aktivieren und einen kleinen realen End-to-End-Betrag durchführen.

Bei Fehlern werden zuerst die vorherigen Environment-Werte wiederhergestellt und das letzte grüne Deployment erneut aktiviert. Keine fehlgeschlagene Zahlung darf manuell als erfolgreich markiert werden; Stripe/Webhook bleibt die Statusquelle.

## Noch notwendige menschliche Freigaben

- gültige Produktionszugänge für MongoDB/PII-Mongo, SMTP und Stripe
- rechtliche Endprüfung von Anbieter-, Gebühren-, Erstattungs-/Widerrufs- und Transparenztexten
- redaktionelle/muttersprachliche Freigabe der nicht-deutschen Kerntexte
- bewusste Anbieterentscheidung für Newsletter/CRM samt Auftragsverarbeitung; bis dahin bleibt die Outbox intern
