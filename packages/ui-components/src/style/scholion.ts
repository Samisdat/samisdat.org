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

  /* ── Accessibility overrides ─────────────────────────────────────────── */
  @media (forced-colors: active) {
    a.ref,
    .ref-target {
      box-shadow: none;
      text-decoration: underline;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    a.ref,
    .ref-target,
    .backref {
      transition: none;
    }
  }
`
