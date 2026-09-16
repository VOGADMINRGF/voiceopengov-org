# VoiceOpenGov Home UX Review — 2026-09-16

## Befund

Die erste Infrastruktur-Repositionierung war strategisch richtig, aber auf der Homepage zu textlastig. Mehrere Ebenen erklärten dieselbe These erneut: gesellschaftliche Lücke, bestehende Modelle, VoiceOpenGov-Rahmen, Ökosystem, eDebatte, regionale Präsenz, Transparenz und Mitgliedschaft. Dadurch sank die visuelle Hierarchie und der eigentliche Kern wurde zu spät erfassbar.

Die Mitgliedschaft war zusätzlich direkt in die Homepage eingebettet. Das erzeugte zwei Probleme: Die Startseite wurde funktional überladen und ein Fehler im Registrierungs-Backend wirkte wie ein Fehler der gesamten Landingpage.

Auch der Header widersprach der neuen Positionierung: Die Wortmarke wirkte wie ein generisches App-Icon mit starkem Tracking, die Subline `Internationale Mitgliederbewegung` war enger als die inzwischen etablierte Infrastruktur-Positionierung und die Navigation priorisierte `Bewegung` statt Produktlogik und gesellschaftliche Erklärung.

## Entscheidung

1. Homepage radikal kürzen und pro Abschnitt nur eine neue Information vermitteln.
2. Keine Registrierung mehr direkt auf der Homepage.
3. Alle primären Mitmachen-CTAs führen auf `/mitmachen`.
4. `/mitmachen` trennt drei Einstiege: Mitgliedschaft, öffentliche Fragen, regionale Mitarbeit.
5. Die Mitgliedschaft wird auf `/mitmachen#mitglied` ausgeführt und nutzt weiterhin den kanonischen DOI-Endpunkt `/api/members/public-register`.
6. Der Header wird auf die Wortmarke `VoiceOpenGov` plus Subline `Infrastruktur für informierte Demokratie` reduziert.
7. Primärnavigation: Warum · eDebatte · 50 Fragen · Transparenz · Mitmachen.

## Nicht geändert

- keine politische Position oder Parteiempfehlung
- keine Stimmgewichtung
- keine Funding-/Stripe-Logik
- kein Membership-Backend
- keine kanonische Farbpalette
