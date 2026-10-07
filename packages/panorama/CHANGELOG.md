# Changelog

## [2.0.0] - 2026-10-07

### Breaking Changes

- CSS custom properties renamed from `--color-*` to `--panorama-*` in `panorama.css` and `colors.css`.
  Any consumer referencing e.g. `var(--color-deep-pine)` must update to `var(--panorama-deep-pine)`.

### Added

- New subpath export `@samisdat/wtal-panorama/colors` — typed JS module exporting `panoramaColors`
  (raw oklch values) and `panoramaCssVars` (CSS variable references).
- New subpath export `@samisdat/wtal-panorama/colors.css` — generated CSS with all `--panorama-*`
  custom properties as `:root` declarations.
