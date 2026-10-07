# ADR 0021: No interaction without direct feedback

Datum: 2026-10-07 · Status: Akzeptiert

## Kontext

Interaktive Elemente (Buttons, Links, Controls) können in einen Zustand
geraten, in dem ein Klick/Tap **keine wahrnehmbare Wirkung** hätte — z. B.
weil der Effekt, den sie normalerweise auslösen, gerade gar nicht sichtbar
ist, oder weil eine Aktion bereits läuft. Bleibt das Element trotzdem aktiv
und fokussierbar, lernt die Nutzerin aus der Interaktion nichts: kein
visuelles Feedback, keine Fehlermeldung, einfach nichts. Das ist schlechter
als ein sichtbar deaktiviertes oder verstecktes Element, weil es Interaktion
suggeriert, die nicht eingelöst wird.

Leitbeispiel aus diesem Repo: `ThemeSwitcher` schaltet zwischen hellem und
dunklem Theme um. Solange das Panorama (`.panorama`) im Viewport sichtbar
ist, zeigt es den Theme-Wechsel bereits selbst (Sonnenstand/Himmelsfarbe) —
ein zusätzlicher Klick auf den `ThemeSwitcher` hätte für die Panorama-Fläche
keine sichtbare zusätzliche Wirkung, nur die DOM-`data-theme`-Variable würde
sich ändern, ohne dass sich etwas im sichtbaren Bereich verändert. Der
Switcher bleibt in diesem Zustand aber fokussierbar in der Tab-Reihenfolge —
ein Nutzer, der per Tastatur navigiert, landet auf einem Control, dessen
Betätigung augenscheinlich nichts tut.

## Entscheidung

Jedes interaktive Element, das temporär keine Wirkung hätte, muss für die
Dauer dieses Zustands **deaktiviert oder ausgeblendet** sein — nicht nur
visuell gedimmt, sondern auch aus Fokus-Reihenfolge und Hit-Testing
entfernt. Konkret:

- **Fokus entfernen:** `inert` auf den Wrapper statt nur `pointer-events:
  none` oder `opacity`. `inert` nimmt Nachfahren zusätzlich aus Tab-Reihenfolge
  und Accessibility-Tree.
- **Sichtbares Feedback:** eine Opacity-/Transition-Änderung (kein
  abruptes Verschwinden), damit der Zustandswechsel selbst wahrnehmbar
  bleibt, statt das Element kommentarlos aus dem Layout zu nehmen.
- **Fokus-Übergabe:** Hält das Element beim Deaktivieren noch den Fokus,
  muss der Fokus aktiv auf ein sinnvolles Ziel verschoben werden (z. B.
  `document.body.focus()`), statt ihn auf einem jetzt `inert`-Element
  verwaist zurückzulassen.

Referenzimplementierung: `ThemeSwitcherSlot` kapselt genau dieses Verhalten
um den unveränderten `ThemeSwitcher` herum — ein `IntersectionObserver` auf
`.panorama` steuert `inert` und `opacity` auf einem Wrapper-`div`, mit
320ms-Transition und Fokus-Rückgabe an `document.body`, falls der Fokus beim
Deaktivieren noch im Wrapper stand.

### Bezug zu ADR 0020 (SOLID)

- **SRP:** `ThemeSwitcherSlot` übernimmt genau eine Verantwortung —
  Sichtbarkeits-/Fokus-Steuerung abhängig vom Panorama — und delegiert das
  eigentliche Theme-Umschalten unverändert an `ThemeSwitcher`. Eine Änderung
  an der Feedback-Regel (z. B. andere Transition-Dauer) trifft nur den Slot,
  nicht den Switcher.
- **OCP:** Die Feedback-Logik wird als **neue** Komponente um eine
  bestehende gelegt (`ThemeSwitcherSlot` um `ThemeSwitcher`), nicht durch
  Ändern von `ThemeSwitcher` selbst. Dieses Prinzip — Composition statt
  interner `if`-Zweige — ist der Standardweg, um diese ADR auf weitere
  Elemente mit demselben Problem anzuwenden: ein eigener Slot/Wrapper pro
  Fall, nicht eine wachsende Zahl `disabled`-Bedingungen in der
  Ursprungskomponente.

## Begründung

- Rein visuelles Dimmen (`opacity` ohne `inert`) behebt nur das
  Sehtbarkeits-Signal, nicht das Tastatur-/Screenreader-Problem — der
  Fokus landet weiterhin auf einem wirkungslosen Element.
- Abruptes Entfernen aus dem DOM (`display: none` ohne Transition) ist für
  sehende Nutzer ein Sprung im Layout ohne erklärenden Übergang; die
  Transition macht den Zustandswechsel selbst zum Feedback.
- Fokus-Verwaisung (Fokus bleibt auf einem gerade `inert` gewordenen
  Element) ist ein eigenständiger, oft übersehener Fehlerfall, der explizit
  behandelt werden muss, nicht nebenbei durch `inert` miterledigt wird.

## Konsequenzen

- Neue interaktive Elemente mit einem "temporär wirkungslos"-Zustand
  bekommen einen eigenen Slot/Wrapper nach dem `ThemeSwitcherSlot`-Muster
  (ADR 0020 OCP), statt die Bedingung in die bestehende Komponente zu
  mischen (ADR 0020 SRP).
- Reviews dürfen einen fokussierbaren, wirkungslosen Interaktionszustand
  unter Verweis auf diese ADR beanstanden, auch ohne Screenreader-Test.
- Bestehende interaktive Elemente werden nicht rückwirkend durch diese ADR
  auditiert; das ist ein Kandidat für ein künftiges Review, kein offener
  Task dieser ADR.
