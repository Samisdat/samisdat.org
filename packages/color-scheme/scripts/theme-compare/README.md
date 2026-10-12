# Theme comparison

Repeatable comparison of the samisdat syntax colors with well-known Shiki themes (Solarized, Gruvbox, Dracula, Nord, Catppuccin, Tokyo Night, One, Monokai, Rosé Pine, Kanagawa, Everforest). Run it after color changes:

```sh
pnpm --filter @samisdat/color-scheme build   # refresh generated/shiki
pnpm --filter @samisdat/color-scheme compare:themes
```

Output goes to `reports/theme-compare/` (gitignored): `index.html` (one table per mode, a rank per metric, rows ordered by mean rank) and `metrics.json` (all numbers including the palette per theme).

## Method

1. Each theme highlights the same sample (`samples/*.sample`: TSX, CSS, JSON, shell, about 80 lines) with Shiki.
2. Every non-blank character is attributed to the color it is painted in. Colors with alpha are flattened onto the editor background.
3. Colors closer than a just-noticeable difference (ΔE OK < 0.02) are merged into the heavier one. Colors painting less than 0.5 % of the characters are dropped. Accents are the remaining colors with OKLCH chroma ≥ 0.05.
4. Metrics (all per theme and mode):
   - **WCAG 2**: share of characters with ratio ≥ 4.5 and ≥ 7, weakest and weighted median ratio against the editor background.
   - **APCA**: weighted median |Lc|, weakest |Lc|, share of characters with |Lc| ≥ 45, 60, 75. Uses `src/apca.ts`, the same function as the lint.
   - **Distance**: smallest ΔE OK and ΔE2000 between any two accents, number of pairs below 0.08.
   - **Color vision deficiency**: the same smallest distance after simulating protan, deutan and tritan vision (Machado 2009 via culori, severity 1).
   - **Lightness spread**: standard deviation of OKLCH lightness over the accents.
   - **Dark/light correspondence** (families with both modes only): characters are grouped by their (dark color, light color) role; Spearman correlation and mean absolute difference of |Lc| over these roles. Asks whether a role that is hard to read in dark is also hard to read in light.
5. Per mode, each metric is ranked over all themes (1 is best, ties share the better rank).

## Limits

- **The sample decides.** About 80 lines in four languages; a theme that colors constructs the sample never uses is not credited for them. Change the sample files and all numbers move.
- **Direction is a judgement.** Higher is treated as better for contrast, distances and correspondence, lower for lightness spread and the dark/light |Lc| difference. An even lightness spread is not objectively better than a varied one; the mean rank mixes metrics with equal weight and is a reading aid, not a verdict. The dark/light columns exist only for families with both modes, so themes without a counterpart are averaged over fewer metrics.
- **Not the lint.** This compares against other themes on a code sample. The gates (`lint:contrast`, `lint-apca.ts`, `lint-cvd.ts`) check the tokens themselves and stay authoritative.
- **Simulated color vision.** The Machado model is an approximation of full dichromacy. It says nothing about milder or mixed deficiencies.
- **No name distance.** Whether two colors are also *named* differently (Heer & Stone, c3) is not measured here. For the samisdat inks that is `pnpm --filter @samisdat/color-scheme names:inks`, see "Farbnamen" in the package README.
- **Themes come from `shiki`.** The compared themes change with the installed Shiki version; pin it when you need to compare runs over time.
- Only syntax colors are compared. UI colors (surfaces, borders, status) are out of scope.
