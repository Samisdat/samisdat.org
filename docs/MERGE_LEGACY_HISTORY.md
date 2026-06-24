# Alte und neue History zusammenführen (Option A)

## Ausgangslage

Das Repo `Samisdat/samisdat.org` enthält **zwei komplett getrennte Historien
ohne gemeinsamen Vorfahren**:

| Branch                       | Erster Commit                                   | Tip                          | Commits |
| ---------------------------- | ----------------------------------------------- | ---------------------------- | ------- |
| `origin/master` (alt)        | `d6ee1c0d` · 2015-11-09 · *Initial commit*      | `d257cc2f` · 2016-10-13      | 652     |
| `main` / `origin/main` (neu) | `352d591e` · 2025-10-20 · *Create Next App*     | `20d9f3d3` · 2026-05-16      | 124     |
| `feature/import-pano`        | `352d591e` (= main)                             | `1aeb1850`                   | 364     |

`feature/import-pano` sitzt auf `main` auf (gemeinsame History). Der Bruch
besteht nur zwischen der **alten** `master`-Linie (11 Jahre) und der **neuen**
`main`-Linie, die mit *Create Next App* frisch aufgesetzt wurde.

> **Wichtig:** Aktuell ist nichts verloren. Die alte History lebt auf
> `origin/master`. Verloren ginge sie nur, wenn dieser Branch ohne anderen
> Ref/Tag gelöscht und später per Garbage Collection entfernt würde.

## Ziel von Option A

Beide Wurzeln über einen **Merge-Commit** zu *einer* verbundenen History
verschmelzen. Danach läuft `git log` über beide Linien — kein Commit geht
verloren, die alte und die neue Arbeit hängen in einem Graphen zusammen.

```
            o---o---o  (alt: master, 2015–2016)
                       \
... o---o---o (neu) -----M   <- Merge mit --allow-unrelated-histories
```

## Schritte

### 0. Safety-Net (immer zuerst, risikofrei)

Permanenten Tag auf den alten Stand setzen, damit die History nie an einem
einzelnen Branch-Namen hängt:

```bash
git tag archive/legacy-2016 origin/master
git push origin archive/legacy-2016
```

### 1. Aktuellen Stand holen

```bash
git fetch origin
```

### 2. Auf den Ziel-Branch wechseln

In diesem Beispiel wird die **neue** Linie zum Ziel und die alte History
hineingezogen. Wir arbeiten auf einem Integrations-Branch, damit `main` und
`feature/import-pano` unangetastet bleiben, bis das Ergebnis stimmt:

```bash
git switch feature/import-pano
git switch -c integrate/legacy-history
```

### 3. Alte History hineinmergen

```bash
git merge --allow-unrelated-histories origin/master
```

Das erzeugt fast sicher **Konflikte**, weil beide Linien Dateien an der Wurzel
haben (`package.json`, `README`, …). Da der **neue** Code-Stand gewinnen soll
und es nur darum geht, die alten *Commits* anzuhängen (nicht den alten *Inhalt*),
nimmt man den kompletten neuen Tree:

```bash
# kompletten Arbeitsbaum auf den neuen Stand zurücksetzen ...
git checkout feature/import-pano -- .
# ... gelöschte Dateien aus der neuen Linie respektieren:
git status            # verbleibende Konflikte prüfen
git add -A
git commit            # Merge-Commit abschließen
```

> Ergebnis-Inhalt = exakt der neue Stand. Hinzugekommen ist nur der zweite
> Eltern-Strang mit den 652 alten Commits, jetzt dauerhaft im Graphen erreichbar.

### 4. Ergebnis prüfen

```bash
# Beide Wurzeln müssen erreichbar sein:
git log --oneline --graph | tail -20
git log --oneline | grep d6ee1c0d        # alter Initial-Commit ist dabei
git rev-list --count HEAD                 # ~ 364 + 652 + 1 Merge

# Arbeitsbaum identisch zum neuen Stand?
git diff feature/import-pano --stat       # sollte leer sein
```

### 5. In die Ziel-Branches überführen

Wenn das Ergebnis stimmt, den Integrations-Branch in den gewünschten
Haupt-Branch übernehmen (Beispiel `main`):

```bash
git switch main
git merge --ff-only integrate/legacy-history   # oder regulärer Merge / PR
git push origin main
```

Branch löschen, wenn nicht mehr gebraucht:

```bash
git branch -d integrate/legacy-history
```

## Hinweise

- **Keine SHAs werden umgeschrieben.** `--allow-unrelated-histories` fügt nur
  einen Merge-Commit hinzu; alle bestehenden Commits behalten ihre Hashes.
- **GitHub-Default-Branch** separat in den Repo-Settings setzen, falls die
  Hauptlinie wechseln soll (`master` → `main`).
- Der Archiv-Tag aus Schritt 0 bleibt unabhängig vom Merge bestehen und ist die
  eigentliche Lebensversicherung für die alte History.
- Alternativen zu Option A: **B** (beide Branches getrennt behalten, `master`
  als Archiv) oder **C** (`git replace --graft`, um eine künstlich durchgehende
  Linie zu erzeugen — invasiv, nicht empfohlen).
