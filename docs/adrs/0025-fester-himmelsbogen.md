# ADR 0025: Sonne und Mond auf festem Bogen

Datum: 2026-11-21 · Status: Vorgeschlagen

## Kontext

Der Himmel im Panorama soll lebendiger werden: Mondphasen, Dämmerungsverlauf,
Sterne und Wetter. Heute laufen Sonne und Mond auf einem festen Bogen
(`sunAndMoonPath` in `Heaven.tsx`). Der Fortschritt auf dem Bogen ergibt sich
aus Sonnenaufgang und Sonnenuntergang (`suncalc`), der Mond läuft denselben
Bogen durch die Nacht. Beide gehen jeden Tag an derselben Stelle auf und
unter.

Die Alternative wäre ein echter Himmel: Himmelsrichtung (Azimut) und Höhe
von Sonne, Mond und Sternen für Ort, Datum und Uhrzeit, abgebildet auf das
Bild. Dann stünde die Sonne im Winter tief und ginge im Südosten auf, im
Sommer hoch und im Nordosten.

## Entscheidung

Sonne und Mond bleiben auf dem festen Bogen. Auf- und Untergangsort sind
im Bild fest. Es gibt **keine** Abbildung von Azimut und Höhe auf x/y.

Das Himmelsmodell (reine Funktion, ohne Darstellung) liefert Werte statt
Positionen:

- Fortschritt der Sonne auf dem Bogen,
- Dämmerungsstufe (Tag, Goldene Stunde, bürgerlich, nautisch,
  astronomisch, Nacht),
- Mondphase, beleuchteter Anteil und Neigung der Mondsichel.

Ein Hauch Jahreszeit bleibt: Nur die **Höhe** des Bogens skaliert mit der
Mittagshöhe der Sonne des Tages. Die Endpunkte bleiben fest, im Sommer
steht die Sonne höher, im Winter flacher.

Sterne kommen aus einem echten Katalog mit echter Sternzeit, in einer
eigenen Projektion, unabhängig vom Bogen. Der Mond sitzt deshalb nicht
zwischen den richtigen Sternen und kann echte Sterne an der falschen Stelle
verdecken. Das wird in Kauf genommen. Sterne werden hinter dem Mond
gezeichnet, damit die Scheibe sie überdeckt. Katalog und Lizenz sind noch
nicht gewählt.

## Begründung

- **Stabilität**: Tag und Nacht sind dieselbe Szene in zwei Stimmungen. Die
  Hügel und Gebäude haben einen festen Bezug zu Sonne und Mond.
- **Gestaltbare Dämmerung**: Weil der Sonnenuntergang an einem bekannten Ort
  im Bild liegt, lässt sich der Abendverlauf von Hand anlegen. Er strahlt
  die Hügel von hinten an und läuft in den Himmel aus. Bei wandernden
  Auf- und Untergangsorten müsste er jede Jahreszeit neu gezähmt werden.
- **Das Bild ist kein Himmelsdom**: Das Panorama ist rund 3,4-mal so breit
  wie hoch. Ein ganzer Sommerbogen von Nordost bis Nordwest passt nur mit
  starker Verzerrung zum Rand hinein. Außerdem müssten die Hügel eine
  Horizontlinie festlegen, hinter der die Sonne verschwindet.
- **Genauigkeit sieht niemand**: Dass der Mond an der falschen Stelle
  zwischen den Sternen steht, fällt kaum jemandem auf. Der Nutzen einer
  echten Abbildung steht in keinem Verhältnis zum Aufwand.

## Alternativen

- **Echte Abbildung von Azimut und Höhe**: genau und mit sichtbaren
  Jahreszeiten, aber mit Verzerrung, ohne gestaltbaren Dämmerungsverlauf und
  mit einer festzulegenden Horizontlinie. Verworfen.
- **Erfundene Sterne mit langsamer Drehung**: wäre konsistent mit dem Mond,
  aber ohne den Reiz eines echten Himmels. Nicht gewählt, bleibt als
  Rückfall, falls kein Katalog mit passender Lizenz zu finden ist.

## Konsequenzen

- Das Himmelsmodell wird ohne x/y-Abbildung gebaut und lässt sich ohne
  Browser testen (Sonnenauf- und -untergang, Sonnenwenden, bekannte
  Vollmonde und Neumonde).
- Der Dämmerungsverlauf ist eine Gestaltungsaufgabe hinter den Hügeln und
  keine Berechnung.
- Sonne und Mond ignorieren Planeten und Sternbilder. Sichtbare
  Ungenauigkeiten sind akzeptiert.
- Soll der Himmel später doch echt abgebildet werden, ersetzt eine neue ADR
  diese.
