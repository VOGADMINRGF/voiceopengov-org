# VoiceOpenGov production closeout — 18 September 2026

This document records the code-complete VoiceOpenGov core closeout on current main and exists to make the production handoff auditable.

## Current code baseline

Main baseline before this closeout marker:

`b9a4c1c7ad8121313305ce70c0b67ef97517024f`

Included and already green before merge:

- #63 — public funnel telemetry fails honestly when MongoDB/DNS storage is unavailable.
- #64 — real Chromium + Axe public accessibility regression on current main.
- #65 — voluntary support contract aligned to 15 EUR minimum monthly / one-time and 180 EUR annual.

## Production rule

A GitHub merge is not production.

VoiceOpenGov may only be treated as current in production after the exact main commit is:

1. built successfully by Vercel,
2. marked READY for the production target,
3. attached to the canonical production domain,
4. verified with the public smoke checks.

## Remaining operational blockers

The MongoDB SRV/Atlas production connection remains an operations issue until a real production funnel write succeeds.

Stripe, SMTP/DOI and newsletter delivery remain operationally gated by the production-readiness checklist in issue #61.

## Next product tracks

Core closeout does not imply completion of the following separate tracks:

- #59 — valid eDebatte mandate to versioned public VOG programme projection.
- #60 — shared identity plus eDebatte entitlement without shared political rights.
- #62 — deferred product tracks such as merchandise, provider-backed newsletter delivery, Live/Streams and deeper security hardening.
- #66 — formal legal entity and membership model.

ZERO PARALLEL TRUTH · NO FALSE DONE · PRODUCTION MUST PROVE THE CLAIM
