# VoiceOpenGov agent contract

## Governance / representation is human-locked

VoiceOpenGov is the political representation and implementation layer for valid eDebatte decisions. Agents MUST NOT introduce a parallel VoiceOpenGov political truth that can override a valid eDebatte majority mandate inside its defined scope.

### Canonical authority flow

`eDebatte evidence + participation -> valid versioned decision -> VoiceOpenGov representation mandate -> political implementation/status -> feedback to eDebatte`

A binding VoiceOpenGov representation mandate requires a validly concluded eDebatte process under its published decision rules. Drafts, ongoing deliberation, incomplete votes and informal sentiment are not binding.

VoiceOpenGov representatives MAY hold, publish and advocate personal positions before a decision. After a valid decision, their public representative duty is the current mandate, not their personal preference. Relevant minority positions remain visible and may trigger a new/reopened process, but do not silently replace the current mandate.

VoiceOpenGov has no frozen party manifesto. Its public program is a versioned projection of currently valid eDebatte mandates. New valid decisions may add, refine, replace or revoke earlier program positions at municipal, regional, national, European or international scope where the relevant jurisdiction/scope is explicit.

The first 50 core questions are seed questions, not dogma. They may be improved, clarified, split into subquestions/eventualities, expanded and revisited. Agents MUST preserve version history and must not present an earlier answer as permanently binding after a later valid decision supersedes it.

Confirmed VoiceOpenGov supporters are intended to receive eDebatte usage without an additional usage fee. Shared identity/login MAY be implemented, but VoiceOpenGov affiliation, eDebatte roles, voting eligibility and domain data MUST remain independently traceable. Financial support MUST NOT create extra voting weight or political priority.

Regional eDebatte × VoiceOpenGov contact points are a target operating model. Planned offices, buses, teams, events or representatives MUST never be presented as live unless verified.

## Brand / CI is human-locked

VoiceOpenGov belongs to the same visual product family as eDebatte. The public movement may use a more human, campaign-oriented composition, but it must not introduce an independent color system or silently redefine the family identity.

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
