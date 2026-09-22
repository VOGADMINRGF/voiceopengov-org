# VoiceOpenGov Membership & Funding – Produktionsbetrieb

Stand: 22. September 2026

Dieses Runbook beschreibt den technisch implementierten Mitglieder-, Auth- und Funding-Track. Es ist keine Behauptung, dass externe Konten, Rechtstexte oder Übersetzungen bereits menschlich freigegeben wurden.

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
- `MONGODB_URI`: erreichbare Produktionsverbindung für operative, nicht direkt identifizierende VOG-Daten wie Funnel-/Map-Daten
- `VOG_DB_NAME`: operative/logische VoiceOpenGov-Datenbank, empfohlen `vog_public`
- `PII_MONGODB_URI`: Produktionsverbindung für Mitgliederstammdaten, DOI-Zustand, direkte Kontakt-/Intake-Daten, Credentials und Sessions
- `PII_DB_NAME`: von `VOG_DB_NAME` verschiedene PII-Datenbank, empfohlen `vog_pii`
- `MONGODB_URI` und `PII_MONGODB_URI` dürfen auf denselben MongoDB-Atlas-Cluster zeigen; die logische Trennung erfolgt über unterschiedliche DB-Namen
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`: produktiver, domain-verifizierter Transaktionsversand
- `VOG_ADMIN_USER`, `VOG_ADMIN_PASSWORD`: dedizierter Admin-Zugang; Passwort mindestens 24 zufällige Zeichen
- optional gehärtet: `BCRYPT_ROUNDS=12`, `SESSION_TTL_DAYS=7`

### Cross-Domain-Login zu eDebatte

- `VOG_EDB_AUTH_HANDOFF_SECRET`: mindestens 32 zufällige Zeichen; identischer Server-Secret-Wert in VOG und eDebatte
- niemals als `NEXT_PUBLIC_*` setzen
- niemals in Git oder Client-Code schreiben
- VOG- und eDebatte-Sessions bleiben getrennt; kein Domain-Cookie und kein Passwort wird zwischen den Systemen geteilt

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

- `members`, `chapter_intake` und `regional_interest_intake` liegen im PII-Store.
- DOI- und Account-Tokens werden nur gehasht gespeichert und sind zeitlich begrenzt.
- Sessions werden nur gehasht gespeichert; Cookies sind `HttpOnly`, `Secure` in Produktion und `SameSite=Lax`.
- Funnel-Ereignisse speichern keine E-Mail-Adresse und laufen nach 90 Tagen per TTL ab.
- Newsletter-/CRM-Daten werden nur nach bestätigter Einwilligung in eine interne Outbox geschrieben. Automatischer Export ist absichtlich deaktiviert, bis ein Anbieter samt AVV, Feldmapping, Lösch- und Widerrufsprozess freigegeben wurde.
- Stripe erhält Zahlungsdaten; VoiceOpenGov speichert nur notwendige Provider-IDs, Betrag, Währung, Rhythmus und Status. Kartendaten werden nicht gespeichert.
- Die Community-Anmeldung erhebt bewusst keine vollständige Straßenanschrift. Eine Anschrift darf erst in einem späteren formalen Mitgliedschaftsprozess erhoben werden, wenn dafür ein klarer Zweck besteht; sie gehört dann ausschließlich in den PII-Store.

## PII-Cutover aus bestehendem `vog_public`

Der Migrationsbefehl ist standardmäßig ein Dry-Run und protokolliert nur Counts und DB-Namen, niemals Verbindungsstrings oder Dokumentinhalte.

```bash
pnpm --dir apps/web run migrate:vog-pii
```

Bestehende direkte PII-Datensätze idempotent nach `vog_pii` kopieren:

```bash
pnpm --dir apps/web run migrate:vog-pii -- --apply
```

Der Copy ist insert-only: bereits in `vog_pii` vorhandene Dokumente werden nicht überschrieben. Nach erfolgreichem Copy muss der neue Code deployt und vollständig getestet werden. Erst danach darf der Legacy-Bestand aus `vog_public` entfernt werden:

```bash
VOG_PII_PURGE_CONFIRM=I_HAVE_DEPLOYED_AND_VERIFIED_VOG_PII_CUTOVER \
  pnpm --dir apps/web run migrate:vog-pii -- --apply --purge-source
```

Der Purge prüft batchweise, dass jede zu löschende `_id` im Ziel vorhanden ist, und bricht bei Abweichungen ab.

## Inbetriebnahme und Rollback

1. Environment-Check für `membership`, danach für `funding` ausführen.
2. Atlas-DNS, Netzwerkfreigabe und getrennte Datenbanknamen prüfen.
3. Vor dem PII-Cutover den Migration-Dry-Run ausführen und Counts dokumentieren.
4. Migration mit `--apply` ausführen; noch nichts aus `vog_public` löschen.
5. Neuen Code deployen.
6. Testmitgliedschaft durchführen: Formular → DOI-Mail → Bestätigung → Passwort setzen → Login → Session → Logout.
7. Bestehenden Account testen: Login → Session → Logout.
8. Regional-/Chapter-Intake testen und sicherstellen, dass neue Direktkontakt-Daten im PII-Store landen.
9. eDebatte-Handoff testen: eDebatte → VOG-Login → signierter Handoff → eDebatte-Session; vorhandene eDebatte-2FA darf nicht umgangen werden.
10. Erst nach diesen Smokes Legacy-PII mit dem ausdrücklich bestätigten Purge entfernen.
11. Stripe im Testmodus prüfen: einmalig und wiederkehrend → signierter Webhook → Statusseite → Customer Portal.
12. Bankdaten und lokale Texte visuell in allen zehn Sprachen prüfen; Arabisch zusätzlich mobil in RTL.
13. Erst danach Live-Schlüssel aktivieren und einen kleinen realen End-to-End-Betrag durchführen.

Bei Fehlern werden zuerst die vorherigen Environment-Werte wiederhergestellt und das letzte grüne Deployment erneut aktiviert. Vor einem PII-Purge bleibt `vog_public` als Rollback-Quelle bestehen. Nach einem bestätigten Purge darf ein Rollback niemals wieder auf `vog_public.members` als produktive Quelle zeigen. Keine fehlgeschlagene Zahlung darf manuell als erfolgreich markiert werden; Stripe/Webhook bleibt die Statusquelle.

## Noch notwendige menschliche Freigaben

- gültige Produktionszugänge für MongoDB/PII-Mongo, SMTP und Stripe
- rechtliche Endprüfung von Anbieter-, Gebühren-, Erstattungs-/Widerrufs- und Transparenztexten
- redaktionelle/muttersprachliche Freigabe der nicht-deutschen Kerntexte
- bewusste Anbieterentscheidung für Newsletter/CRM samt Auftragsverarbeitung; bis dahin bleibt die Outbox intern
