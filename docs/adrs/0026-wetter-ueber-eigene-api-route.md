# ADR 0026: Wetter über eine eigene API-Route

Datum: 2026-11-25 · Status: Akzeptiert

## Kontext

Das Panorama soll das echte Wetter zeigen: Bewölkung in drei Höhenbändern
und Regen. Die Library (ADR 0011) soll frei von Transport- und
Datenquellen-Code bleiben und ohne Netz funktionieren. Besucher dürfen nicht
einzeln bei einem Drittanbieter anfragen, und der Anbieter darf bei Ausfall
den Himmel nicht blockieren.

## Entscheidung

- Die Website besitzt die Route `/api/weather`
  (`packages/website/src/app/api/weather/route.ts`). Sie holt die
  aktuellen Daten von Open-Meteo (CC BY 4.0) für Wuppertal, mit einem
  Timeout und 30 Minuten Cache (`next.revalidate` und `s-maxage`).
- Die Route prüft die Antwort Feld für Feld und liefert nie Teildaten. Bei
  einem Fehler antwortet sie mit 502 und 60 Sekunden CDN-Cache.
- Die Library kennt nur den Typ `Weather` und die Prop `weather`. Die
  Website wandelt die Prozentwerte in Bewölkungsstufen um
  (`toPanoramaWeather`).
- Fehlt das Wetter oder schlägt die Anfrage fehl, zeigt der Himmel das vom
  Datum abhängige Wetter der Library. Der Start ist immer klarer Himmel und
  wird erst nach dem Mount ersetzt, damit es keinen Hydration-Mismatch gibt.
- Open-Meteo wird im Impressum genannt (`Colophon.tsx`).

## Konsequenzen

- Open-Meteo ist eine Laufzeit-Abhängigkeit der Website, aber keine harte:
  der Himmel fällt auf das Datumswetter zurück.
- Die Route nimmt keine Eingaben und verarbeitet keine personenbezogenen
  Daten. Es gibt kein Rate-Limit; der Cache hält die Anfragen an den
  Anbieter klein.
- Der Ort steht an zwei Stellen (`WEATHER_LOCATION` und `LAT`/`LNG` der
  Library). Ein Test hält beide gleich, weil die Route nichts aus dem
  Client-Einstieg der Library importieren kann.
- Ein anderer Anbieter ersetzt nur `openMeteo.ts` und die Umwandlung.
