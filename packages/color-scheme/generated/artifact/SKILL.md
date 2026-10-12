---
name: samisdat-artifacts
description: Style Claude artifacts (HTML, React, SVG) with the samisdat color scheme, dark by default and light on request. Use whenever building or restyling an artifact, page or chart for the user.
---

# samisdat artifact colors

Generated – do not edit. Paste the CSS below into the artifact's `<style>` and use only these variables. Dark is the default; set `data-theme="light"` on `<html>` only when the user asks for light (or for print).

- Page background `--color-surface-default`, text `--color-text-default`, code blocks `--color-syntax-background`.
- Cards and panels use `--color-surface-raised` with `--color-text-default`, `-emphasis` or `-secondary` only. Accent (`ink-*`) text goes only on `--color-surface-default` or `--color-syntax-background`.
- Accents come only from `--color-ink-*`; status uses `--color-status-*`.
- `text-*` and `ink-*` are for text, `surface-*` for backgrounds, `border-*` for borders.

```css
/* Generated – do not edit. samisdat color scheme, same variable names as the website. */
/* Dark is the default; set data-theme="light" on <html> for light. */
:root {
  --color-surface-default: oklch(22% 0.05 300);
  --color-surface-emphasis: oklch(15% 0.05 300);
  --color-surface-raised: oklch(37% 0.06 300);
  --color-surface-subtle: oklch(44% 0.05 300);
  --color-surface-muted: oklch(57% 0.04 300);
  --color-text-default: oklch(85.4% 0.037 30);
  --color-text-emphasis: oklch(89.97% 0.037 30);
  --color-text-secondary: oklch(77.97% 0.037 30);
  --color-text-subtle: oklch(64.97% 0.037 30);
  --color-text-muted: oklch(61.29% 0.037 30);
  --color-ink-red: oklch(68% 0.208 25);
  --color-ink-orange: oklch(77.5% 0.119 69);
  --color-ink-yellow: oklch(83.2% 0.162 85.7);
  --color-ink-green: oklch(74.6% 0.172 158.1);
  --color-ink-teal: oklch(79.3% 0.132 202.6);
  --color-ink-cyan: oklch(78.2% 0.048 198.4);
  --color-ink-blue: oklch(76.7% 0.125 248);
  --color-ink-purple: oklch(77.7% 0.078 303.2);
  --color-ink-pink: oklch(80.7% 0.189 326.9);
  --color-ink-comment: oklch(83.8% 0.08 262.6);
  --color-status-danger: oklch(68% 0.208 25);
  --color-status-warning: oklch(77.5% 0.119 69);
  --color-status-success: oklch(74.6% 0.172 158.1);
  --color-status-info: oklch(76.7% 0.125 248);
  --color-border-muted: oklch(57% 0.04 300);
  --color-border-default: oklch(66.22% 0.05 300);
  --color-border-strong: oklch(61.29% 0.037 30);
  --color-border-focus: oklch(79.3% 0.132 202.6);
  --color-selection: oklch(37% 0.06 300);
  --color-highlight: oklch(37% 0.06 300);
  --color-diff-add: oklch(37.7% 0.084 139.9);
  --color-diff-delete: oklch(41.6% 0.155 12.5);
  --color-diff-change: oklch(38.64% 0.1425 265);
  --color-syntax-foreground: oklch(85.4% 0.037 30);
  --color-syntax-background: oklch(15% 0.05 300);
  --color-syntax-comment: oklch(83.8% 0.08 262.6);
  --color-syntax-keyword: oklch(68% 0.208 25);
  --color-syntax-string: oklch(74.6% 0.172 158.1);
  --color-syntax-string-special: oklch(78.2% 0.048 198.4);
  --color-syntax-number: oklch(74.6% 0.172 158.1);
  --color-syntax-constant: oklch(74.6% 0.172 158.1);
  --color-syntax-function: oklch(76.7% 0.125 248);
  --color-syntax-type: oklch(78.2% 0.048 198.4);
  --color-syntax-variable: oklch(85.4% 0.037 30);
  --color-syntax-parameter: oklch(83.2% 0.162 85.7);
  --color-syntax-property: oklch(79.3% 0.132 202.6);
  --color-syntax-tag: oklch(80.7% 0.189 326.9);
  --color-syntax-tag-attribute: oklch(77.7% 0.078 303.2);
  --color-syntax-operator: oklch(77.97% 0.037 30);
  --color-syntax-punctuation: oklch(77.97% 0.037 30);
  --color-syntax-diff-plus: oklch(74.6% 0.172 158.1);
  --color-syntax-diff-minus: oklch(68% 0.208 25);
}

:root[data-theme="light"] {
  --color-surface-default: oklch(85.4% 0.037 30);
  --color-surface-emphasis: oklch(61.29% 0.037 30);
  --color-surface-raised: oklch(89.97% 0.037 30);
  --color-surface-subtle: oklch(72.97% 0.037 30);
  --color-surface-muted: oklch(64.97% 0.037 30);
  --color-text-default: oklch(22% 0.05 300);
  --color-text-emphasis: oklch(15% 0.05 300);
  --color-text-secondary: oklch(37% 0.06 300);
  --color-text-subtle: oklch(44% 0.05 300);
  --color-text-muted: oklch(45.6% 0.037 30);
  --color-ink-red: oklch(41.6% 0.155 12.5);
  --color-ink-orange: oklch(40.4% 0.102 53.4);
  --color-ink-yellow: oklch(33% 0.069 75.8);
  --color-ink-green: oklch(37.7% 0.084 139.9);
  --color-ink-teal: oklch(40.7% 0.041 204.9);
  --color-ink-cyan: oklch(32.6% 0.054 204.2);
  --color-ink-blue: oklch(42.2% 0.237 269.5);
  --color-ink-purple: oklch(37% 0.192 305);
  --color-ink-pink: oklch(39.2% 0.168 342.4);
  --color-ink-comment: oklch(42.2% 0.138 287.2);
  --color-status-danger: oklch(41.6% 0.155 12.5);
  --color-status-warning: oklch(40.4% 0.102 53.4);
  --color-status-success: oklch(37.7% 0.084 139.9);
  --color-status-info: oklch(42.2% 0.237 269.5);
  --color-border-muted: oklch(64.97% 0.037 30);
  --color-border-default: oklch(45.6% 0.037 30);
  --color-border-strong: oklch(44% 0.05 300);
  --color-border-focus: oklch(40.7% 0.041 204.9);
  --color-selection: oklch(77.7% 0.078 303.2);
  --color-highlight: oklch(83.8% 0.08 262.6);
  --color-diff-add: oklch(94.66% 0.0422 155);
  --color-diff-delete: oklch(92.8% 0.0373 10);
  --color-diff-change: oklch(94.52% 0.0259 265);
  --color-syntax-foreground: oklch(22% 0.05 300);
  --color-syntax-background: oklch(89.97% 0.037 30);
  --color-syntax-comment: oklch(42.2% 0.138 287.2);
  --color-syntax-keyword: oklch(41.6% 0.155 12.5);
  --color-syntax-string: oklch(37.7% 0.084 139.9);
  --color-syntax-string-special: oklch(32.6% 0.054 204.2);
  --color-syntax-number: oklch(37.7% 0.084 139.9);
  --color-syntax-constant: oklch(37.7% 0.084 139.9);
  --color-syntax-function: oklch(42.2% 0.237 269.5);
  --color-syntax-type: oklch(32.6% 0.054 204.2);
  --color-syntax-variable: oklch(22% 0.05 300);
  --color-syntax-parameter: oklch(33% 0.069 75.8);
  --color-syntax-property: oklch(40.7% 0.041 204.9);
  --color-syntax-tag: oklch(39.2% 0.168 342.4);
  --color-syntax-tag-attribute: oklch(37% 0.192 305);
  --color-syntax-operator: oklch(37% 0.06 300);
  --color-syntax-punctuation: oklch(37% 0.06 300);
  --color-syntax-diff-plus: oklch(37.7% 0.084 139.9);
  --color-syntax-diff-minus: oklch(41.6% 0.155 12.5);
}
```
