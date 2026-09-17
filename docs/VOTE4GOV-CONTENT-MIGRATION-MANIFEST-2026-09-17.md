# Vote4Gov Content Migration Manifest — 2026-09-17

Status: REVIEWED / PARTIAL IMPLEMENTATION

Architecture contract:

- Vote4Gov = critical review, system questions, theses, international comparison.
- VoiceOpenGov = people, regions, community, membership, partnerships and current regional context.
- eDebatte = evidence, counterpositions, dossiers, alternatives, participation, voting and impact.
- Voxy = explanation, language and accessibility; no autonomous decision layer.

## 1. VoiceOpenGov content that belongs primarily to Vote4Gov

| Source | Existing title/content | Recommended Vote4Gov area | Type | Desired framing | eDebatte handoff | Redirect / link recommendation | Duplicate risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/thesen/ricky-gerd-fleischer` | Personal theses of the initiator on democratic development | Vote4Gov / Systemfragen or a dedicated `/thesen` review area | Thesis / review | Reframe each proposition as a testable question with a strongest counterposition and a falsification/evidence question. | Existing per-thesis eDebatte handoff should be retained. | Do not redirect yet: create the canonical Vote4Gov destination first, migrate content, then 301 the VoiceOpenGov route. | HIGH while both surfaces remain public. |
| `apps/web/src/content/initiatorTheses.ts` | Five multilingual thesis records powering the route above | Vote4Gov content source | Thesis | Preserve IDs for handoff continuity; change from declarative thesis copy to thesis + counterposition + review question. | Preserve canonical IDs. | Move only after Vote4Gov has a multilingual destination and stable IDs. | HIGH. |
| `docs/VOICEOPENGOV-50-FRAGEN.md` | Foundational democratic/system questions mixed into the movement repository | Vote4Gov for system-review questions; eDebatte for dossier work | Review / question | Keep genuinely organizational or movement questions at VoiceOpenGov; move system-design questions to Vote4Gov. | Deep analysis must point to eDebatte. | Content-level split; do not bulk redirect the document. | MEDIUM. |

## 2. Vote4Gov regional inventory

### Already correctly separated

- `/regionen.html` is a noindex compatibility entry and points to `/systeme-laender`.
- `/systeme-laender.html` explicitly defines countries and political levels as analytical comparison spaces, not community hubs.
- Vote4Gov `sitemap.xml` does not advertise the legacy `/de/*` territorial pages.
- Vote4Gov `vercel.json` applies `X-Robots-Tag: noindex, follow` to `/de/:path*`.
- `/systeme-laender` should remain at Vote4Gov.

### Legacy/mixed territorial pages requiring split

The repository still contains territorial pages under:

- `/de/weltweit/`
- `/de/afrika/`
- `/de/asien/`
- `/de/europa/`
- `/de/lateinamerika-karibik/`
- `/de/nordamerika/`
- `/de/ozeanien/`
- `/de/deutschland/`
- `/de/deutschland/baden-wuerttemberg/`
- `/de/deutschland/bayern/`
- `/de/deutschland/berlin/`
- `/de/deutschland/brandenburg/`
- `/de/deutschland/bremen/`
- `/de/deutschland/hamburg/`
- `/de/deutschland/hessen/`
- `/de/deutschland/mecklenburg-vorpommern/`
- `/de/deutschland/niedersachsen/`
- `/de/deutschland/nordrhein-westfalen/`
- `/de/deutschland/rheinland-pfalz/`
- `/de/deutschland/saarland/`
- `/de/deutschland/sachsen/`
- `/de/deutschland/sachsen-anhalt/`
- `/de/deutschland/schleswig-holstein/`
- `/de/deutschland/thueringen/`

Sample review of `/de/deutschland/berlin/` shows a MIXED page: it discusses political levels and responsibility, but also frames Berlin as a regional participation surface and promises future regional dossiers/participation. Therefore it must not be blindly redirected or copied.

## 3. Canonical target mapping for the German state pages

Community / territorial target URLs exist canonically at VoiceOpenGov:

- `https://www.voiceopengov.org/regionen/deutschland/baden-wuerttemberg`
- `https://www.voiceopengov.org/regionen/deutschland/bayern`
- `https://www.voiceopengov.org/regionen/deutschland/berlin`
- `https://www.voiceopengov.org/regionen/deutschland/brandenburg`
- `https://www.voiceopengov.org/regionen/deutschland/bremen`
- `https://www.voiceopengov.org/regionen/deutschland/hamburg`
- `https://www.voiceopengov.org/regionen/deutschland/hessen`
- `https://www.voiceopengov.org/regionen/deutschland/mecklenburg-vorpommern`
- `https://www.voiceopengov.org/regionen/deutschland/niedersachsen`
- `https://www.voiceopengov.org/regionen/deutschland/nordrhein-westfalen`
- `https://www.voiceopengov.org/regionen/deutschland/rheinland-pfalz`
- `https://www.voiceopengov.org/regionen/deutschland/saarland`
- `https://www.voiceopengov.org/regionen/deutschland/sachsen`
- `https://www.voiceopengov.org/regionen/deutschland/sachsen-anhalt`
- `https://www.voiceopengov.org/regionen/deutschland/schleswig-holstein`
- `https://www.voiceopengov.org/regionen/deutschland/thueringen`

These VoiceOpenGov pages intentionally do not invent members, groups, contacts, events or current topics. Until verified regional data exists they expose the state transparently as `Community im Aufbau` and route regional activation through the canonical `/vor-ort` intake and detailed evidence work to eDebatte.

SEO is fail closed: the 15 generic build-state pages are `noindex, follow` and are excluded from the sitemap. Berlin remains indexable because it already has dedicated regional context rather than a generic build-state surface. A build-state page should only become indexable after substantive, verifiable regional content exists.

## 4. Redirect policy

Do not apply bulk redirects from Vote4Gov state URLs yet.

For each legacy page:

1. Extract system-comparison content that still has analytical value.
2. Move/rewrite that material into `/systeme-laender`, `/systemfragen`, a Vote4Gov review or a journal article.
3. Move only community/territorial intent to the corresponding VoiceOpenGov regional URL.
4. If no distinct Vote4Gov analytical page remains, 301 the old territorial URL to VoiceOpenGov.
5. If an analytical page remains, give it a distinct system-analysis URL/title and link to the VoiceOpenGov community page rather than redirecting the analysis page.

This prevents a false equivalence between a Vote4Gov analytical country/state page and a VoiceOpenGov community page.

## 5. SEO checklist for the follow-up Vote4Gov workstream

- keep legacy Vote4Gov `/de/*` pages out of the sitemap and `noindex, follow` until their split is complete;
- remove a legacy territorial page only after its analytical retention decision is explicit;
- replace self-canonicals on migrated community-only pages with 301 redirects;
- keep `/systeme-laender` indexable and self-canonical;
- distinguish system-analysis titles from community titles;
- update internal navigation and breadcrumbs;
- preserve eDebatte deep links and source identifiers;
- add VoiceOpenGov community links where region context is useful;
- verify old URLs do not become unnecessary 404s;
- verify hreflang only where equivalent localized pages actually exist;
- only promote a generic VoiceOpenGov region from `noindex` when it has substantive, verifiable regional content.

## 6. Current implementation status

### IMPLEMENTED

- VoiceOpenGov owns the canonical German territorial/community hierarchy.
- All 16 German states are represented in one canonical data registry.
- Berlin keeps its existing dedicated regional page.
- The remaining states receive a shared, multilingual, fail-honest regional entry page.
- Empty regional state is explicitly labelled as community being built; no fake groups, contacts, events or member counts are generated.
- Germany hub links to every state.
- State pages provide canonical `/vor-ort` regional activation and eDebatte evidence-work handoffs.
- Canonical, hreflang, OpenGraph and structured-data metadata are generated for the state pages.
- Generic build-state pages are `noindex, follow`; only indexable regional pages are emitted in the sitemap.
- A dedicated regional architecture test and CI smoke check guard the registry, sitemap and noindex behavior.
- README ecosystem role text is aligned with the architecture contract.

### MIGRATED

- No Vote4Gov page content has been declared migrated yet. This is intentional: the legacy state pages are mixed and require separation before redirect.

### REDIRECTED

- No new cross-domain redirects are introduced by this change.
- Existing Vote4Gov `/regionen.html` compatibility redirect to `/systeme-laender` remains the correct analytical handoff.

### NOCH NICHT MIGRIERT

- VoiceOpenGov initiator thesis page/content source to Vote4Gov.
- Vote4Gov world/continent legacy pages where community and system comparison are mixed.
- Vote4Gov Germany/state legacy pages where community/participation wording and analytical content coexist.

### BLOCKIERT

- Cross-domain redirects are intentionally blocked until each Vote4Gov mixed page has a distinct analytical retention decision. Redirecting them now would either erase analytical content or misrepresent a system-analysis page as a community page.

### VOTE4GOV HANDOFF

- Create/confirm the canonical Vote4Gov thesis/review destination.
- Split each legacy regional page into analytical material (Vote4Gov) and territorial/community intent (VoiceOpenGov).
- Apply redirects only after that split.
- Update Vote4Gov canonicals, internal links and breadcrumbs accordingly; keep `/de/*` noindex during the transition.
