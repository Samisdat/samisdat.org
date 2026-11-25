# Changelog

## [Unreleased]

### Breaking Changes

- `WtalPanorama` no longer takes `generatedClouds`. There is one cloud renderer now; drop the prop.

### Changed

- Cumulus, stratocumulus, altocumulus and cirrocumulus are drawn by a new generator in the look of hand-drawn
  comic clouds: a row of round lobes with sharp notches, a round crown, pointed tails and a lens-shaped darker
  underside, all as exact SVG arcs. Every placed cloud has its own shape, the same sky always draws the same clouds.
- Clouds of one layer that overlap merge into one cloud instead of lying on top of each other.
- The bump clouds drift on four lanes between the cirrus and the hills, never behind a hill. As the wind picks up
  with the height, the higher lanes carry smaller, faster clouds and the lower ones bigger, slower clouds; cirrus,
  the highest, now drifts fastest.
- Bump clouds drift at speeds of their own on their lane. A faster cloud pushes into a slower one on its
  lane until their dark undersides touch, then both drift on as one; merged clouds part again after a while, and some
  wide clouds start as two halves that come apart.
- Every bump cloud is a flow of lobes under a wind from the right: lobes are blown up on the windward side, travel
  slowly through the cloud and let their air out on the lee side, so the windward side stands higher and the shape
  keeps changing.
- Clouds dissolve by letting the air out of their lobes one by one, like balloons, and new ones are blown up lobe by
  lobe elsewhere on the layer, so the cover stays the same. `?cloudspeed=20` runs it twenty times as fast.
- With reduced motion the bump clouds stand still, as the other clouds do.
- Cloud tones: the day body and underside follow the hand-drawn clouds (`#d7d7d7` / `#a7bed0`), the night tones are
  darker. The other cover tones moved by the same amount.

### Removed

- The noise-filter clouds and the old ellipse lobes for the bump cloud types.

### Fixed

- `suncalc` is now a runtime dependency (it was a devDependency and got bundled into `dist`).
- Removed the unused `astronomy-engine` dependency.

## [2.0.0] - 2026-10-07

### Breaking Changes

- CSS custom properties renamed from `--color-*` to `--panorama-*` in `panorama.css` and `colors.css`.
  Any consumer referencing e.g. `var(--color-deep-pine)` must update to `var(--panorama-deep-pine)`.

### Added

- New subpath export `@samisdat/wtal-panorama/colors` — typed JS module exporting `panoramaColors`
  (raw oklch values) and `panoramaCssVars` (CSS variable references).
- New subpath export `@samisdat/wtal-panorama/colors.css` — generated CSS with all `--panorama-*`
  custom properties as `:root` declarations.
