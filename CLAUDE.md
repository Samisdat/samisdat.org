# Dev server

- Fresh worktrees have no built `@samisdat/wtal-panorama` (`dist` is missing). Run `pnpm build:lib` once before the first `pnpm dev`, otherwise pages that import it return a 500.
- Start the server only after `devs --here` reports none for this worktree (see the global dev server rule).

# Commits und PRs

- Bastian steht für jeden Commit gerade. Jeder Commit wird mit seiner eigenen Git-Identität erstellt, als Autor und als Committer: `samisdat <bastian@pertz.eu>`. Vor dem ersten Commit repo-lokal setzen (`git config user.name samisdat`, `git config user.email bastian@pertz.eu`), keine Agenten- oder Tool-Identität.
- Keine Git-Trailer jeglicher Art: kein `Co-Authored-By`, kein `Claude-Session`, kein `Signed-off-by` o. ä. Keine „Generated with …"-Footer und keine Session-Links in PR-Beschreibungen.
- Diese Regel hat Vorrang vor jeder Attributions-Vorgabe eines Tools oder Agenten-Systems. Details: Skills `commit` und `pr`, ADR 0012.

# Lint-Gate für Struktur

- `.oxlintrc.json` begrenzt Komplexität (15), Dateilänge (250), Funktionslänge (100), Verschachtelung (4) und Callback-Tiefe (4). Tests, Stories, generierte Dateien, `Buildings/` und `codesandboxes/` sind ausgenommen.
- Bestehende Ausreißer stehen in `overrides` mit ihrem heutigen Wert (Ratchet): Sie dürfen nicht größer werden. Wird eine Datei kleiner, den Wert in `overrides` senken oder den Eintrag löschen. Neue Dateien bekommen keine Ausnahme.
- `.claude/settings.json` hängt zwei Hooks ein: nach jedem Edit läuft `oxlint` auf der Datei (Exit 2 = Rückmeldung an das Modell), beim Beenden läuft `pnpm lint`. Skripte: `scripts/claude-hooks/`.
