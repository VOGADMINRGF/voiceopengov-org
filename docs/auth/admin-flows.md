Auth & Admin Flows (Kurz)
=========================

Entry Points (Server)
- Login: `POST /api/auth/login` – prüft Passwort, setzt ggf. 2FA-Challenge (`pending_2fa` Cookie) und liefert `require2fa`.
- 2FA-Confirm: `POST /api/auth/verify-2fa` – prüft Challenge (E-Mail-Code oder TOTP), setzt Session-Cookies via `applySessionCookies`, löscht `pending_2fa`.
- TOTP-Setup: `POST /api/auth/totp/initiate` → `POST /api/auth/totp/verify` – legt temporäres Secret ab, bestätigt Setup, aktualisiert `verification.twoFA` und Session.
- TOTP-Status: `GET /api/auth/totp/status` – meldet, ob 2FA aktiv ist und welche Methode.
- E-Mail-Verifikation: `POST /api/auth/email/confirm` – verifiziert Mail, erneuert Session.

Relevante Flags/Felder
- User (`users`):
  - `verification.twoFA.enabled` (boolean)
  - `verification.twoFA.method` (z.B. `totp`)
  - `verification.twoFA.secret` (falls hinterlegt)
  - `verification.methods` (enthält z.B. `otp_app` nach TOTP-Setup)
- Credentials (`user_credentials`):
  - `twoFactorEnabled`, `twoFactorMethod`, `otpSecret`, `otpTempSecret`
- Session (JWT in `session_token` Cookie):
  - `uid`, `roles`, `tfa` (Two-Factor für diese Session bestätigt)
- Cookies:
  - `pending_2fa` (offene Challenge)
  - `u_id`, `u_role`, `u_verified`, `u_tier`, `u_groups`, `u_loc`
  - `u_2fa` (spiegelt Session-Flag `tfa`)

Helpers & Gates
- Session-Helpers: `utils/session.ts` (JWT lesen/setzen), `lib/server/auth/sessionUser.ts` (User + Session laden).
- 2FA-Helpers: `lib/server/auth/twoFactor.ts` – `userRequiresTwoFactor`, `sessionHasPassedTwoFactor`.
- Rollen: `lib/server/auth/roles.ts` – `ADMIN_DASHBOARD_ROLES`, `userIsAdminDashboard`, `userIsSuperadmin`.
- Admin-Gate:
  - Server-Layout `/admin/layout.tsx` prüft: Session vorhanden → 2FA erfüllt (falls nötig) → Rolle admin/superadmin.
  - Admin-APIs unter `/api/admin/**` nutzen dieselben Checks und liefern JSON-Fehler (401 unauthorized, 403 two_factor_required/forbidden).

Session-Validierung (Soll)
- Login ohne 2FA: Session wird direkt gesetzt (`tfa=true`), Admin-Gate lässt durch.
- Login mit 2FA: Session erst nach `/api/auth/verify-2fa`; solange keine Session → Redirect auf Login.
- Aktivierte 2FA + bestehende Session ohne `tfa`: Admin-Gate verlangt erneute 2FA (Redirect bzw. 403 two_factor_required).
