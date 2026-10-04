# Sticky-Spalten: Zusammenhang beim Scrollen erhalten

Zwei Inhalte stehen nebeneinander und gehören zusammen, zum Beispiel eine Erklärung und der zugehörige Code. Einer ist deutlich höher als der andere. Beim Scrollen der längeren Seite soll die kürzere im Viewport stehen bleiben, solange das Paar sichtbar ist.

Dieses Dokument beschreibt die Lösung mit `position: sticky` von Grund auf, inklusive der Sonderfälle, an denen sie in der Praxis meistens scheitert. Die Datei `sticky-demo.html` zeigt alle beschriebenen Fälle im Browser.

## Umsetzung im Blog: `Stack` mit `sticky`

Im Projekt steckt das Prinzip im Layout-Baustein `Stack` (`packages/ui-components/src/Stack`):

```mdx
<Stack container directionSmall="column" directionMedium="row" sticky>
    <Stack>…Demo…</Stack>
    <Stack>…Text…</Stack>
</Stack>
```

Abweichungen von den Beispielen unten:

- `Stack` ist Flexbox, kein Grid. Der Beide-sticky-Trick gilt unverändert, `align-items: start` ist hier der Default, sobald `sticky` gesetzt ist. Ein explizites `align` gewinnt (und kann sticky damit wirkungslos machen).
- Sticky ist nur in Breakpoints aktiv, in denen die effektive Richtung `row` ist (aus `directionSmall/Medium/Large`), und nur ab 560 px Viewport-Höhe. Sonst ist `position: static`.
- Linaria erzeugt aus Funktions-Interpolationen nur Werte, keine Regelblöcke. Welche Breakpoints kleben, entscheidet `Stack` in JS und gibt es über `data-sticky-small/medium/large` an statische Selektoren weiter.
- `top` ist `calc(var(--navi-height, 0px) + 1rem)`. `--navi-height` ist in `globalstyle.ts` definiert (3.2rem unter 768 px, 4rem darüber, bei 20 px Root-Schrift also 64/80 px), die Navi nutzt sie als `height`. Die bestehende Variable `--header-height` ist die Hero-Höhe und hat damit nichts zu tun.

Noch nicht umgesetzt:

- Behandlung von Spalten, die höher als der Viewport sind (Lösung A mit ResizeObserver). Solche Spalten kleben mit ihrem Anfang.
- `scroll-padding-top` für Sprungmarken und Tastaturfokus.
- Markierung, dass die Spalte klebt.

## Das Prinzip

`position: sticky` ist ein Hybrid. Das Element verhält sich zunächst wie `relative` und liegt ganz normal im Fluss. Erreicht es beim Scrollen die Schwelle, die du mit `top` festlegst, bleibt es dort stehen, als wäre es `fixed`. Der entscheidende Unterschied zu `fixed`: Es kann seinen **Elternblock nie verlassen**. Erreicht der untere Rand des Elternblocks das Element, wird es mit nach oben geschoben.

Genau dieses Verhalten brauchst du: Die kurze Spalte bleibt stehen, solange das zusammengehörige Paar sichtbar ist, und verschwindet mit ihm, sobald das Paar endet. Der Elternblock ist damit die Klammer um den Zusammenhang.

Daraus folgt die wichtigste Regel: **Sticky braucht Platz zum Wandern.** Ist das sticky Element so hoch wie sein Elternblock, gibt es keinen Weg, den es zurücklegen könnte, und es passiert sichtbar nichts.

## Das Grundgerüst

```html
<div class="pair">
  <article class="pair__long">…lange Erklärung…</article>
  <aside class="pair__short">…Vorschau und Code…</aside>
</div>
```

```css
.pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

.pair > * {
  position: sticky;
  top: 1rem;
}
```

Zwei Details sind hier nicht dekorativ.

**`align-items: start`** ist die Zeile, an der sticky in Grid und Flexbox am häufigsten scheitert. Standard ist `stretch`: Beide Spalten werden auf die Höhe der Zeile gezogen, also auf die Höhe der längeren Spalte. Dann ist die kurze Spalte genauso hoch wie ihr Bereich und hat keinen Platz mehr. Mit `start` behält sie ihre natürliche Höhe, und der Rest der Zeile ist ihr Wanderweg.

**`minmax(0, 1fr)`** statt `1fr` verhindert, dass ein langer, nicht umbrechender Codeblock die Spalte breiter drückt. `1fr` hat implizit `min-content` als Untergrenze, und eine `<pre>`-Zeile kann die sehr groß machen.

## Der Trick: beide Spalten sticky

Im Gerüst oben sind **beide** Kinder sticky, nicht nur die kurze. Das ist Absicht. Die längere Spalte füllt den Grid-Bereich ohnehin komplett aus. Sie hat keinen Wanderweg, also hat sticky bei ihr keine Wirkung. Die kürzere bleibt stehen.

Der Vorteil: Du musst beim Schreiben nicht wissen, welche Seite länger ist. Das ist bei CMS-Inhalten oder responsiven Breiten, bei denen sich das Verhältnis durch Umbrüche ändert, viel wert. Ein Fall, in dem bei 1400 px der Text länger ist und bei 900 px der Code, funktioniert automatisch.

In der Demo zeigen die ersten beiden Fälle das: Fall 1 hat links den langen Text, Fall 2 rechts den langen Code. Das CSS ist identisch.

## Alternative: Wrapper, der sich streckt

Manchmal willst du `stretch` behalten, etwa weil die Spalten einen Hintergrund oder eine Trennlinie über die volle Höhe haben sollen. Dann trennst du Fläche und sticky Inhalt:

```html
<aside class="pair__short">          <!-- streckt sich, trägt Hintergrund -->
  <div class="pair__sticky">…</div>  <!-- wandert darin -->
</aside>
```

```css
.pair { align-items: stretch; }
.pair__sticky { position: sticky; top: 1rem; }
```

Der äußere Container ist zeilenhoch, der innere hat seine natürliche Höhe und darin Platz. Den Beide-sticky-Trick verlierst du dabei: Du musst wissen, welche Seite den inneren Wrapper bekommt.

## Der richtige `top`-Wert

`top` ist der Abstand zum oberen Rand des Scroll-Containers, also meist des Viewports, an dem das Element hängen bleibt. Hast du eine sticky Kopfzeile, muss deren Höhe mit hinein, sonst verschwindet die Spalte darunter:

```css
:root { --header-h: 4rem; }

.pair > * {
  top: calc(env(safe-area-inset-top, 0px) + var(--header-h) + 1rem);
}
```

`env(safe-area-inset-top)` ist auf Desktop 0. Auf iPhones mit `viewport-fit=cover` verhindert es, dass die Spalte unter Notch oder Statusleiste rutscht.

Wenn sich die Kopfzeilenhöhe ändern kann (Umbruch, Zoom, Schriftgröße), ist es robuster, `--header-h` per ResizeObserver aus der echten Höhe zu setzen, statt einen festen Wert zu pflegen. Die Demo macht das.

## Sonderfall: Die kurze Spalte ist höher als der Viewport

Das ist der Fall, den das Grundgerüst nicht löst. Ist die „kurze“ Spalte 1200 px hoch und der Viewport 800 px, bleibt sie mit ihrem Anfang oben kleben. Ihr Ende ist dann nie zu sehen, bis das ganze Paar vorbei ist. Bei einer Vorschau mit Code darunter heißt das: Der Code ist während des Lesens unerreichbar.

### Lösung A: am unteren Ende kleben lassen

Du misst die Höhe und berechnest `top` so, dass das Element bei Überhöhe mit seinem *unteren* Rand am Viewport-Boden hängen bleibt:

```css
.pair > * {
  --gap: 1rem;
  --top: calc(var(--header-h) + var(--gap));
  position: sticky;
  top: min(var(--top), calc(100svh - var(--h, 0px) - var(--gap)));
}
```

```ts
const ro = new ResizeObserver(entries => {
  for (const { target, borderBoxSize } of entries) {
    const h = borderBoxSize[0].blockSize;
    (target as HTMLElement).style.setProperty('--h', `${h}px`);
  }
});
document.querySelectorAll('.pair > *').forEach(el => ro.observe(el));
```

So funktioniert die Rechnung: Passt das Element in den Viewport, ist `100svh - h - gap` größer als der normale Offset, und `min()` nimmt den Offset. Alles verhält sich wie gehabt. Ist es zu hoch, wird der zweite Wert negativ, und `top` wird negativ. Das Element scrollt dann zunächst normal mit, bis sein unterer Rand den Viewport-Boden erreicht, und bleibt erst dort stehen. Der Leser sieht also den Anfang, scrollt durch und behält dann das Ende im Blick.

`svh` statt `vh` ist wichtig auf Mobilgeräten. `vh` entspricht dort dem großen Viewport ohne eingeblendete Browserleisten, und die Spalte würde unter der Adressleiste verschwinden.

Fehlt das Skript, fällt `var(--h, 0px)` auf 0 zurück, und es gilt das normale Verhalten. Das Skript ist eine reine Verbesserung.

Fall 3 der Demo zeigt das Verhalten. Am deutlichsten wird es, wenn du das Browserfenster niedriger machst.

### Lösung B: eigener Scrollbereich

```css
.pair__short {
  max-height: calc(100svh - var(--header-h) - 2rem);
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

Das ist einfach, aber meist die schlechtere Wahl. Verschachtelte Scrollbereiche sind auf Touchgeräten fummelig, Mausrad-Nutzer bleiben darin hängen, und der Bereich muss für Tastaturnutzer fokussierbar sein (`tabindex="0"` und ein zugänglicher Name), sonst ist der Inhalt per Tastatur nicht scrollbar. Für einen Codeblock allein kann das in Ordnung sein, für eine Kombination aus Vorschau und Code eher nicht.

## Warum sticky manchmal einfach nicht geht

Fast alle Fälle von „sticky funktioniert nicht“ haben eine dieser Ursachen:

- **Ein Vorfahre hat `overflow: hidden`, `auto` oder `scroll`.** Dann wird dieser Vorfahre zum Scroll-Container, und sticky bezieht sich auf ihn statt auf den Viewport. Scrollt er selbst nicht, klebt nichts. Das ist der häufigste Fall, oft durch ein `overflow-x: hidden` gegen horizontales Scrollen ganz oben im Layout. Abhilfe: `overflow-x: clip` statt `hidden`. `clip` schneidet genauso ab, erzeugt aber keinen Scroll-Container.
- **Kein `top` gesetzt.** Ohne Schwellenwert verhält sich sticky wie `relative`.
- **Das Element ist so hoch wie sein Elternblock.** Siehe `align-items: start` oben.
- **Der Elternblock ist zu kurz.** Sticky wirkt nur innerhalb des direkten Elternblocks. Steckt das Element in einem zusätzlichen Wrapper ohne eigene Höhe, ist dieser Wrapper die Grenze.

Für die erste Ursache hilft dieses Snippet in der Konsole. Es listet alle Vorfahren, die Scroll-Container sind:

```js
let el = document.querySelector('.pair__short');
while ((el = el.parentElement)) {
  const { overflow, overflowX, overflowY } = getComputedStyle(el);
  if (/(auto|scroll|hidden)/.test(overflow + overflowX + overflowY))
    console.log(el, { overflow, overflowX, overflowY });
}
```

## Responsive Verhalten

Auf schmalen Bildschirmen werden die Spalten gestapelt, und sticky muss aus:

```css
@media (max-width: 760px) {
  .pair { grid-template-columns: 1fr; }
  .pair > * { position: static; }
}
```

Bleibt sticky beim Stapeln aktiv, klebt die obere Spalte über der unteren und verdeckt sie, sobald sie kürzer ist als der Rest des Paares.

Weniger offensichtlich ist die **Höhe** des Viewports. Bei 200 % oder 400 % Zoom (WCAG 1.4.10 Reflow) oder auf einem Laptop im Querformat mit eingeblendeter Tastatur bleibt kaum Höhe übrig, und eine sticky Spalte belegt dann den halben Bildschirm. Deshalb sollte sticky zusätzlich an eine Mindesthöhe gebunden sein:

```css
@media (min-width: 761px) and (min-height: 560px) {
  .pair > * { position: sticky; }
}
```

Schreibt man sticky gleich in diese Media Query, entfällt das Zurücksetzen auf `static` für schmale Bildschirme.

## Barrierefreiheit

**Lesereihenfolge.** Sticky ändert nur die Darstellung, nicht die DOM-Reihenfolge. Screenreader lesen die kurze Spalte dort, wo sie im Markup steht. Steht die Vorschau im DOM vor der Erklärung, hört man sie zuerst, auch wenn sie optisch rechts liegt. Ordne das Markup also nach inhaltlicher Logik, nicht nach Optik.

**Fokus verdeckt (WCAG 2.2, 2.4.11).** Das betrifft weniger die sticky Spalte als eine sticky Kopfzeile darüber. Springt der Fokus per Tab auf einen Link in der langen Spalte, kann der Browser ihn so scrollen, dass er unter der Kopfzeile landet. `scroll-padding-top` auf `html` sagt dem Browser, dass oben ein Bereich verdeckt ist:

```css
html { scroll-padding-top: calc(var(--header-h) + 1rem); }
```

Das gilt auch für Sprungmarken (`#abschnitt`).

**Bewegung.** Sticky selbst ist keine Animation. Es gibt keinen Grund, es unter `prefers-reduced-motion` abzuschalten. Im Gegenteil: Es ist die ruhigste Variante, um den Zusammenhang zu halten.

## Optional: zeigen, dass die Spalte klebt

Wenn die Spalte steht, hilft eine dezente Markierung, etwa ein Schatten oder eine Linie, die sichtbar macht, dass sie jetzt „mitfährt“. Dafür gibt es zwei Wege.

Der neue CSS-Weg sind Scroll-State Container Queries. Sie werden derzeit nur in Chromium unterstützt und sind damit reine Progressive Enhancement:

```css
.pair__short {
  container-type: scroll-state;
  position: sticky;
  top: 1rem;
}
@container scroll-state(stuck: top) {
  .pair__short > * { box-shadow: 0 0 0 1px var(--line); }
}
```

Der klassische Weg mit Support überall ist ein IntersectionObserver auf ein unsichtbares Sentinel-Element direkt über der sticky Spalte. Verlässt das Sentinel den Viewport, klebt die Spalte, und du setzt eine Klasse.

## Zusammengefasst

```css
:root { --header-h: 4rem; --gap: 1rem; }
html { scroll-padding-top: calc(var(--header-h) + var(--gap)); }

.pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;
}

@media (min-width: 761px) and (min-height: 560px) {
  .pair > * {
    --top: calc(env(safe-area-inset-top, 0px) + var(--header-h) + var(--gap));
    position: sticky;
    top: min(var(--top), calc(100svh - var(--h, 0px) - var(--gap)));
  }
}

@media (max-width: 760px) {
  .pair { grid-template-columns: 1fr; }
}
```

```ts
const ro = new ResizeObserver(entries => {
  for (const { target, borderBoxSize } of entries) {
    const h = borderBoxSize[0].blockSize;
    (target as HTMLElement).style.setProperty('--h', `${h}px`);
  }
});
document.querySelectorAll('.pair > *').forEach(el => ro.observe(el));
```

Das CSS allein liefert das Grundverhalten mit automatischer Erkennung der kürzeren Spalte, responsivem Abschalten und korrektem Abstand zur Kopfzeile. Die paar Zeilen Skript ergänzen die Behandlung zu hoher Spalten.

## Die Demo

`sticky-demo.html` ist eine einzelne Datei ohne Abhängigkeiten außer Google Fonts (mit System-Fallback). Sie enthält drei Fälle:

1. **Langer Text, kurze Vorschau** – der Standardfall. Rechts bleibt Vorschau mit Code stehen.
2. **Kurzer Text, langer Code** – die Umkehrung mit identischem CSS. Links bleibt stehen.
3. **Kurze Spalte höher als der Viewport** – zeigt Lösung A. Auf Bildschirmen unter etwa 1100 px Höhe scrollt die rechte Spalte erst mit und klebt dann mit ihrem unteren Rand.

Das gesamte Verhalten steckt in den Regeln für `.pair` und `.pair > *`. Das Skript setzt nur `--h` pro Spalte und `--header-h` für die Kopfzeile. Der Rest des Skripts erzeugt die Beispiel-Spirale und den Code dazu.
