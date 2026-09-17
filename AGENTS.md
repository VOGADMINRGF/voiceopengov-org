# VoiceOpenGov agent contract

## Public identity / status is human-locked

Public VoiceOpenGov copy must reflect the current legal and product state. Agents MUST NOT silently promote a future target state into a present-tense fact.

### Canonical public roles

- **VoiceOpenGov** is currently an international initiative and community for participation, regional organisation and traceable decision information.
- **eDebatte** is an independent open information and decision infrastructure used by VoiceOpenGov. VoiceOpenGov and eDebatte must not be described as the same legal/product entity or as a parent/owned product relationship unless that becomes factually true and is explicitly approved.
- **Vote4Gov** is a separate project. Its positions must not be presented as binding VoiceOpenGov positions.
- **Voxy** is an assistive layer for explanation, structuring and translation. Voxy does not make political or organisational decisions.

### Current community / legal-status contract

VoiceOpenGov is currently not a registered association, foundation or separate company. The current `/mitmachen` registration records affiliation with the VoiceOpenGov community; it is not a Vereins- or corporate-law membership.

Agents MUST NOT use public present-tense wording such as `Mitgliederbewegung`, `membership movement`, `Mitglied werden`, `Become a member`, `Mitgliedschaft aktiv` or equivalent translations in a way that implies an already established legal membership structure. Internal legacy model/type names may remain where changing them would create migration risk, but public copy must use the current community/status wording.

Financial support is separate from community affiliation and must never be described as purchasing political weight, editorial rights, voting weight or privileged participation.

### Capability truth

Public capabilities must distinguish current availability from roadmap intent. Use explicit status language such as `live`, `beta`, `im Aufbau` / `being built`, or `Perspektive` / `planned` where appropriate. Hubs, mobile formats, stores/studios, reports, APIs, white-label services and similar future formats must not be described as broadly available unless the corresponding runtime/service is actually operating.

The public journey should describe VoiceOpenGov as producing or supporting **decision information / Entscheidungsgrundlagen**, not as making binding political decisions. Binding decisions remain with people or the legitimately authorised democratic/institutional procedure.

### Source-of-truth hierarchy

For current public positioning, use this precedence:

1. runtime public copy and current legal/privacy notices;
2. this `AGENTS.md` contract;
3. the current `README.md`;
4. historical planning/relaunch documents under `docs/`.

Historical documents may preserve prior terminology for audit/history, but they MUST NOT override current runtime, legal or public-status truth.

## Brand / CI is human-locked

VoiceOpenGov belongs to the same visual product family as eDebatte. The public initiative may use a more human, campaign-oriented composition, but it must not introduce an independent color system or silently redefine the family identity.

### Canonical family palette

- Deep background: `#020617`
- Raised dark surface: `#0b1220`
- Primary blue: `#1a8cff`
- Primary cyan/turquoise: `#18cfc8`
- Primary light text: `#f8fafc`
- Primary dark text on bright CTA: `#071727`

### Canonical typography and composition

Human-approved editorial refinement 2026-09-16:

- Display headlines use an editorial serif stack (`Georgia`, `Times New Roman`, serif fallback) to create a more institutional, civic-infrastructure character.
- UI, navigation, controls and body copy stay in a neutral system sans stack (`Inter` when available, otherwise platform sans fallbacks).
- The visual language may use cinematic dark surfaces, restrained glass layers, subtle cyan/blue glow and fine divider lines.
- The system must remain sober, legible and institutional. It must not drift into party-campaign aesthetics, neon-gaming aesthetics or a separate luxury brand disconnected from eDebatte.
- Blue/turquoise stays the identity anchor; typography and depth create the premium editorial character, not a new color family.

The canonical runtime brand layer is `apps/web/src/app/brand-ci.css` and MUST be imported by `apps/web/src/app/layout.tsx` after `globals.css`.

`apps/web/public/edebatte-ci.css` remains a legacy compatibility surface only. Public rendering must not depend on that separately linked stylesheet to restore the canonical palette.

### Forbidden autonomous changes

Agents MUST NOT, without explicit human acceptance:

- redefine the canonical palette, typography or logo language;
- introduce a new dominant brand color or a replacement palette;
- turn VoiceOpenGov into a visually unrelated brand;
- remove, reorder or bypass the bundled `brand-ci.css` runtime layer;
- make the public CI depend only on `public/edebatte-ci.css`;
- replace shared brand tokens with hard-coded page-specific brand colors;
- introduce new public lime/green brand colors such as `#d6ff65` or `#48a78f` as canonical values;
- describe a visual redesign as a harmless closing pass, cleanup or refactor.

Legacy relaunch classes may remain temporarily where migration risk would be disproportionate, but `brand-ci.css` must map them to the canonical blue/turquoise family. New public surfaces should use the canonical palette/tokens directly instead of extending the legacy lime/green vocabulary.

A requested layout, UX, accessibility, responsive or content improvement does NOT grant permission to change the brand identity.

### Human acceptance gate

Any intended brand change must be called out explicitly as a `BRAND/CI CHANGE` in the PR description and must receive human acceptance before merge. Silence is not acceptance.

### Automated drift gate

`Web CI` must fail if the bundled canonical brand layer is missing, is no longer imported after `globals.css`, or no longer contains the approved blue/turquoise family anchors. This automated guard complements human ownership; it does not authorize agents to redefine the CI.

## Internationalization is a launch contract

Language selection must change the complete public experience, not only client components. Header, page content, footer, privacy/cookie UI, metadata-relevant server surfaces and RTL direction must stay on one locale after a switch.

Agents MUST NOT add new German-only public copy to a locale-aware surface without either:

1. providing translations for every supported launch locale used by that surface, or
2. using the established locale fallback contract and documenting the fallback honestly.

Changes to locale state, cookie/query synchronization or server/client locale resolution require the existing locale contract tests to remain green.
