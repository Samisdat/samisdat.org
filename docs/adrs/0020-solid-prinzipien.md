# ADR 0020: SOLID-Prinzipien in React/TypeScript

Datum: 2026-10-07 · Status: Akzeptiert

## Kontext

Die SOLID-Prinzipien (Single Responsibility, Open/Closed, Liskov
Substitution, Interface Segregation, Dependency Inversion) stammen aus der
objektorientierten Programmierung und werden dort oft über Klassen und
Vererbung erklärt. In einer Codebase ohne Klassen (Function Components,
Hooks, Props) bleibt unklar, was die Prinzipien hier bedeuten — ohne
Übersetzung wirken sie wie importierte Theorie statt wie etwas, das sich
beim Review einfordern lässt.

ADR 0021 (No interaction without direct feedback) referenziert diese ADR
als Architekturgrundlage. Die folgenden Übersetzungen nutzen bestehenden
Code aus diesem Repo als Beleg, nicht als nachträglich konstruierte
Beispiele.

## Entscheidung

Wir übernehmen SOLID als Architekturprinzip für React/TypeScript-Code in
diesem Repo, mit folgender Übersetzung:

### Single Responsibility Principle (SRP)

Eine Komponente oder ein Hook hat einen Grund, sich zu ändern. In
React/TypeScript heißt das: **Darstellung, Zustand und Seiteneffekt
trennen**, nicht in einer Datei mischen.

Beleg: `Demo/Parallax/useParallax.tsx` kapselt genau einen Belang — die
Zeiger-Position in CSS-Custom-Properties übersetzen, inklusive
`prefers-reduced-motion`. Die Komponente, die den Hook nutzt, kümmert
sich nicht darum, *wie* Parallax funktioniert, nur dass sie ein `ref`
übergibt. Ändert sich die Parallax-Logik (z. B. anderes Easing), ändert
sich nur `useParallax.tsx`.

Gegenbeispiel im Repo: `Post/index.tsx` mischt Layout-Komponente und
fest verdrahteten Artikel-Inhalt (Platzhaltertext) in einer Datei. Jede
Änderung am Inhalt und jede Änderung am Layout träfen dieselbe Datei —
ein Kandidat für eine künftige Trennung in `Post` (Layout) und den Inhalt
als Children/Props.

### Open/Closed Principle (OCP)

Erweiterbar durch Hinzufügen, nicht durch Ändern bestehenden Codes. In
React/TypeScript heißt das: **neues Verhalten über eine neue Komponente
hinter einer gemeinsamen Prop-Schnittstelle**, statt bestehende
Komponenten mit zusätzlichen `if`-Zweigen aufzubohren.

Beleg: `Demo/Animations/Compare/` vergleicht vier
Animationstechniken (SMIL, CSS, JS, JS+CSS). Jede Implementierung
(`Smil.tsx`, `Js.tsx`, `JsCss.tsx`, `Css.tsx`) ist eine eigene Datei, die
dieselbe Props-Schnittstelle (`DemoAnimationsCompareProps` aus
`shared.tsx`) implementiert. `Compare/index.tsx` reiht sie nur
nebeneinander auf. Eine fünfte Technik kommt als neue Datei dazu, ohne
dass `Smil.tsx` oder `index.tsx` angefasst werden.

### Liskov Substitution Principle (LSP)

Implementierungen hinter derselben Schnittstelle müssen austauschbar
sein, ohne dass der Aufrufer sich anpassen muss. In React/TypeScript
heißt das: **gleiche Props-Typen → gleiches Verhalten nach außen**, auch
wenn die Innenimplementierung unterschiedlich ist.

Beleg: `Smil`, `Css`, `Js` und `JsCss` (`Demo/Animations/Compare/`) nehmen
alle `{ isPlaying, resetTrigger }` entgegen und reagieren alle gleich:
starten/pausieren bei `isPlaying`, springen bei Änderung von
`resetTrigger` zurück auf Start. `index.tsx` rendert alle vier mit
identischen Props — keine Komponente braucht einen Sonderfall, obwohl
eine mit `SVGAnimationElement`-APIs arbeitet (`Smil`) und eine andere mit
`requestAnimationFrame` (`Js`).

Verletzung wäre z. B., wenn eine der vier Varianten bei `resetTrigger`
nicht zurückspringt, sondern weiterläuft — der Aufrufer müsste dann
wissen, welche Variante er gerade rendert, und das Austauschen würde den
Vertrag brechen.

### Interface Segregation Principle (ISP)

Konsumenten sollen nicht von Props abhängen (und sie mitschleifen
müssen), die sie nicht brauchen. In React/TypeScript heißt das: **kleine,
auf den Verwendungszweck zugeschnittene Props-Typen** statt einer
gemeinsamen Fat Interface mit lauter optionalen Feldern.

Beleg: `Stack/index.tsx` definiert `StackProps` als Union
(`StackContainerProps | StackItemProps`) statt eines einzelnen Typs mit
`container`-, `direction*`-, `order*`- und `grow`-Feldern, die sich
gegenseitig ausschließen. Ein `<Stack>`, der Item ist, sieht gar nicht
erst `directionSmall` oder `sticky` in der Autovervollständigung — diese
Props gehören nur zum Container.

Gegenbeispiel im Repo: `PlaybackControl` bekommt `speedControl`,
`resetControl`, `notice` immer als Props, auch wenn ein Aufrufer nur
Play/Pause braucht; `resetControl` wird sogar ungenutzt destrukturiert
(`resetControl: _resetControl`). Ein Kandidat, die Steuerelemente über
Composition (`children`) statt über Boolean-Flags zu segmentieren.

### Dependency Inversion Principle (DIP)

Komponenten hängen von Abstraktionen ab, nicht von konkreten
Implementierungen. In React/TypeScript heißt das: **Verhalten kommt über
Props/Callbacks von außen rein**, die Komponente kennt nur die
Props-Schnittstelle, nicht woher `onPlay`, `onUpdate` etc. stammen.

Beleg: `ThemeSwitcher` kennt nur `{ theme, onUpdate }` — nicht, dass
`onUpdate` am Ende `localStorage` schreibt oder ein Context-Provider
dahinter steckt. `PlaybackControl` kennt nur `onPlay`/`onPause`/`onReset`/
`onSpeedChange` — ob der Aufrufer `useState` nutzt (wie
`DemoAnimationsCompare`) oder einen Reducer, ist für die Komponente
unsichtbar. Dasselbe Prinzip gilt für `useParallax(ref)`: der Hook hängt
vom `RefObject`-Typ ab (Abstraktion), nicht von einer konkreten
DOM-Node, die er selbst erzeugt — der Aufrufer liefert das `ref`.

## Begründung

- Jedes Prinzip ist an eine **bestehende** Stelle im Code gebunden, nicht
  an ein Lehrbuchbeispiel. Reviews können auf diese ADR verweisen
  („das ist wie in `Compare/`", „das verletzt ISP wie `PlaybackControl`")
  statt die Prinzipien jedes Mal neu herzuleiten.
- Die Übersetzung bewusst über **Props-Schnittstellen und Komposition**
  statt über Klassen/Vererbung, weil die Codebase keine Klassenhierarchien
  hat — Vererbung ist in React/Function-Components kein Baustein.
- Gegenbeispiele (`Post`, `PlaybackControl`) sind bewusst mit aufgenommen:
  SOLID dient hier als Diagnoseinstrument, nicht als Behauptung, der
  bestehende Code sei bereits vorbildlich.

## Konsequenzen

- ADR 0021 referenziert diese ADR, um Feedback-Verhalten als eigene,
  austauschbare Verantwortlichkeit zu begründen.
- Die benannten Gegenbeispiele (`Post/index.tsx`, `PlaybackControl`)
  werden nicht automatisch durch diese ADR behoben; sie sind Kandidaten
  für künftige Refactorings, kein offener Task.
- Reviews dürfen SOLID-Verletzungen unter Verweis auf diese ADR
  einfordern, ohne das Prinzip jedes Mal neu zu erklären.
