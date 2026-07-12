# ADR 0015: Sprach-Konvention

Datum: 2026-07-12 · Status: Akzeptiert

## Kontext

Das Projekt mischte bisher Deutsch und Englisch ohne klare Regel: Code-
Kommentare teils deutsch („Zeiger beim Mount…"), teils englisch („Slot-
based drawing…"), commit-Messages historisch gemischt, Tippfehler und
Scherznamen in Dateinamen (`LotOfHassleForSmallFx` für einen Range-Slider).

Mit der npm-Veröffentlichung von `@samisdat/panorama` (ADR 0014) werden
Namen und API öffentlich sichtbar — Konsistenz wird wichtiger.

## Entscheidung

**Code, Bezeichner und Kommentare**: Englisch  
**Content (Blog-Posts, UI-Texte) und Dokumentation**: Deutsch

Konkret:
- Variablen, Funktionen, Typen, Klassen, Komponenten: Englisch
- Code-Kommentare, JSDoc, Inline-Erklärungen: Englisch
- Commit-Messages, ADRs, README, Markdown-Docs: Deutsch (Status quo)
- Blog-Posts, Demo-UI-Texte: Deutsch (Status quo)

## Begründung

- **Einheitlicher Code**: Der Code selbst (inklusive APIs, die als npm-
  Package veröffentlicht werden) folgt der JavaScript/React-Konvention
  (englisch). Keine sprach-gemischten Bezeichner mehr.
- **Deutsche Docs**: Die Dokumentation (ADRs, READMEs, Commit-Messages)
  bleibt deutsch, weil sie für ein deutschsprachiges Publikum geschrieben
  wird und das Projekt kein Open-Source-Beitrag mit internationalem Fokus
  ist.
- **Weniger kognitive Last**: Eine Datei = eine Sprache (Code englisch,
  Markdown deutsch). Kein Kontext-Switch innerhalb einer `.ts`-Datei mehr.

## Konsequenzen

- Neue Code-Kommentare werden auf Englisch geschrieben.
- Bestehende Kommentare werden **nicht** massenhaft umgeschrieben — nur
  bei Gelegenheit (wenn die Datei ohnehin angefasst wird).
- Irreführende oder schlecht benannte Komponenten werden umbenannt:
  - `LotOfHassleForSmallFx` → `RangeSlider` (in diesem Branch)
  - `RedCurch` → `RedChurch` (bereits in `feature/panorama-cleanup` gefixt)
- Commit-Messages bleiben deutsch (wie bisher üblich in diesem Projekt).
