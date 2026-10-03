// Styles for the scholion plugin (packages/scholion).
// Stage 0: semantic base — links, lemma spans, explanation paragraphs.
// Stage 1: :has()-hover rules are generated per-ref by the remark plugin
//          and injected as a <style> tag into the MDX output.
//          The two custom properties below are the only values they read.

export const scholionStyles = `
  /* ── Custom properties ──────────────────────────────────────────────── */
  :root {
    /* currentColor resolves at usage site, so each ref glows in its own hue */
    --scholion-hover-bg: color-mix(in srgb, currentColor 18%, transparent);
    --scholion-b-outline: 1px dashed color-mix(in srgb, currentColor 55%, transparent);
  }

  /* ── A: token in code ────────────────────────────────────────────────── */
  a.ref {
    color: inherit;
    text-decoration: none;
    border-radius: 2px;
    padding: 0.05em 0.1em;
    /* inset underline in the token's own syntax color */
    box-shadow: inset 0 -1.5px 0 color-mix(in srgb, currentColor 55%, transparent);
    scroll-margin: 35vh 2rem;
    transition: background-color 0.12s ease;
  }

  a.ref:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  /* ── C: lemma in prose ───────────────────────────────────────────────── */
  .ref-target {
    font-family: var(--font-code, monospace);
    font-size: 0.85em;
    border-radius: 2px;
    padding: 0.05em 0.2em;
    color: var(--color-teal);
    box-shadow: inset 0 -1.5px 0 color-mix(in srgb, currentColor 55%, transparent);
    transition: background-color 0.12s ease;
  }

  /* ── B: explanation paragraph ────────────────────────────────────────── */
  [data-explains] {
    border-radius: 4px;
    scroll-margin: 30vh 0;
    outline: none;
  }

  .backref {
    font-size: 0.78em;
    color: var(--color-foreground-subtle);
    text-decoration: none;
    margin-left: 0.5em;
    opacity: 0.7;
    transition: opacity 0.12s ease;
  }

  .backref:hover {
    opacity: 1;
  }

  /* ── Stage 3: SVG wire overlay ──────────────────────────────────────── */
  .scholion-wires {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
    overflow: visible;
  }

  .scholion-g {
    opacity: 0;
    transition: opacity 0.2s;
  }

  .scholion-g--on {
    opacity: 1;
  }

  .scholion-g path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }

  .scholion-g circle {
    fill: currentColor;
  }

  .scholion-g--dashed path {
    stroke-dasharray: 3 5;
  }

  /* ── Stage 3: Peek ───────────────────────────────────────────────────── */
  .scholion-peek {
    position: fixed;
    z-index: 200;
    left: 50%;
    transform: translateX(-50%);
    top: 10px;
    width: min(39.5rem, calc(100vw - 24px));
    border: 1.5px dashed currentColor;
    border-radius: 8px;
    padding: 0.45rem 0 0.55rem;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.32);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s, visibility 0s 0.15s;
  }

  .scholion-peek--on {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.15s;
  }

  .scholion-peek--bottom {
    top: auto;
    bottom: 10px;
  }

  /* Code peek: dark (matches code block appearance) */
  .scholion-peek--code {
    background: var(--scholion-code-bg, hsl(220 17% 13%));
    color: var(--scholion-code-fg, hsl(220 14% 86%));
  }

  /* Text peek: matches prose background */
  .scholion-peek--text {
    background: var(--color-background);
    color: var(--color-foreground);
    border-color: var(--color-teal);
  }

  .scholion-peek__meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0 0.9rem 0.2rem;
    font-size: 0.74rem;
    opacity: 0.55;
  }

  .scholion-peek__code-line {
    display: block;
    white-space: pre;
    overflow: hidden;
    padding: 0 0.9rem;
    font-family: var(--font-code, monospace);
    font-size: 0.8rem;
    line-height: 1.6;
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 1.5rem, #000 calc(100% - 1.5rem), transparent);
    mask-image: linear-gradient(90deg, transparent, #000 1.5rem, #000 calc(100% - 1.5rem), transparent);
  }

  .scholion-peek__body {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    padding: 0 0.9rem;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .scholion-peek__token {
    border-radius: 3px;
    background: color-mix(in srgb, currentColor 22%, transparent);
  }

  /* ── Stage 3: Return chip ────────────────────────────────────────────── */
  .scholion-chip {
    position: fixed;
    z-index: 210;
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
    border: 0;
    border-radius: 999px;
    background: var(--color-foreground);
    color: var(--color-background);
    font: 600 0.9rem / 1 inherit;
    padding: 0.75rem 1.15rem;
    min-height: 44px;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.28);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s, visibility 0s 0.15s;
  }

  .scholion-chip--on {
    opacity: 1;
    visibility: visible;
    transition: opacity 0.15s;
  }

  /* ── Accessibility overrides ─────────────────────────────────────────── */
  @media (forced-colors: active) {
    a.ref,
    .ref-target {
      box-shadow: none;
      text-decoration: underline;
    }

    .scholion-g {
      color: CanvasText !important;
    }

    .scholion-peek {
      border-color: CanvasText;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    a.ref,
    .ref-target,
    .backref,
    .scholion-g,
    .scholion-peek,
    .scholion-chip {
      transition: none !important;
    }
  }
`
