# ADR 0027: Sternkatalog HYG als statisches Asset der Website

Datum: 2026-11-25 · Status: Akzeptiert

## Kontext

ADR 0025 verlangt Sterne aus einem echten Katalog. Der Katalog muss klein
sein, eine Lizenz haben, die zur Seite passt, und darf die MIT-Lizenz der
Library nicht berühren.

## Entscheidung

- Quelle ist die HYG-Datenbank v4.4 (Hipparcos, Yale Bright Star, Gliese),
  CC BY-SA 4.0.
- `pnpm generate:stars` in `packages/website` erzeugt daraus
  `public/stars/stars.json`: Sterne bis Helligkeit 4,5 (925 Stück), vier Werte
  je Stern (Rektaszension, Deklination, Helligkeit, Farbindex), hellster
  zuerst. Das Skript prüft den SHA-256 der Quelle.
- Der Auszug ist ein abgeleitetes Werk und bleibt unter CC BY-SA 4.0
  (`public/stars/LICENSE.txt`). Er liegt in der Website, nicht im npm-Paket
  der Library. Die Library bekommt die Sterne über die Prop `stars` und
  bleibt MIT.
- Der Browser lädt `stars.json` nach der Hydration einmal (`useStars`). Das
  Impressum nennt die Quelle und verlinkt die Lizenz.

## Konsequenzen

- Die Share-Alike-Pflicht gilt für den Datenauszug. Der Code der Website
  bleibt MIT, weil er die Daten nur lädt und nicht verändert.
- Die Datei ist etwa 25 KB groß und wird einmal nach der Hydration
  geladen. Schlägt das fehl, bleibt der Himmel ohne Sterne.
- Ein anderer Katalog oder eine andere Grenzhelligkeit heißt: Skript
  anpassen und neu erzeugen.
