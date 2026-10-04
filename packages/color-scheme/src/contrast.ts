/**
 * Contrast matrix: the required foreground/background pairs, derived from the
 * token files per mode. Nothing is maintained by hand; the pairs follow from
 * roles (see ADR 0019, "Barrierefreiheit").
 *
 * Token metadata lives in `$extensions["org.samisdat.a11y"]`:
 * - `textTier` on surfaces: "full" | "neutral-only"
 * - `exempt` (string, the reason) on any token: skipped in every pair
 *
 * Consumers: the contrast lint (scripts/lint-contrast.ts,
 * terrazzo.contrast.config.ts) and the Storybook contrast grid.
 */
import darkTokens from "../tokens/dark.tokens.json";
import lightTokens from "../tokens/light.tokens.json";

export const modes = ["dark", "light"] as const;
export type Mode = (typeof modes)[number];

export const A11Y_EXTENSION = "org.samisdat.a11y";

export type TextTier = "full" | "neutral-only";

export type ContrastPair = {
  /** e.g. `dark:text.muted/surface.default` */
  id: string;
  mode: Mode;
  /** Token id of the foreground, e.g. `text.muted` */
  foreground: string;
  /** Token id of the background, e.g. `surface.default` */
  background: string;
  /** Minimum WCAG contrast ratio */
  min: number;
};

type TokenNode = {
  $value?: unknown;
  $extensions?: Record<string, { textTier?: TextTier; exempt?: string }>;
  [key: string]: unknown;
};

const tokenFiles: Record<Mode, Record<string, unknown>> = {
  dark: darkTokens,
  light: lightTokens,
};

export type FlatToken = {
  id: string;
  /** Raw `$value`, e.g. `{color.aubergine.900}` */
  value: string;
  textTier?: TextTier;
  exempt?: string;
};

/** Flattens a DTCG group into `id -> token`, ids joined with ".". */
const collect = (group: unknown, path: string[] = []): FlatToken[] => {
  if (typeof group !== "object" || group === null) return [];
  const node = group as TokenNode;
  if ("$value" in node) {
    const ext = node.$extensions?.[A11Y_EXTENSION];
    return [
      {
        id: path.join("."),
        value: String(node.$value),
        textTier: ext?.textTier,
        exempt: ext?.exempt,
      },
    ];
  }
  return Object.entries(node)
    .filter(([key]) => !key.startsWith("$"))
    .flatMap(([key, child]) => collect(child, [...path, key]));
};

/** All level 2 tokens of a mode with their a11y metadata. */
export const tokensOf = (mode: Mode): FlatToken[] =>
  collect(tokenFiles[mode]);

const startsWith = (token: FlatToken, prefix: string) =>
  token.id.startsWith(`${prefix}.`);

export const MIN_TEXT = 4.5;

// `status.*` are aliases of `ink.*`; they are deliberately not part of the
// matrix, since every status pair would duplicate an ink pair.
//
// Extension points for later phases (do not add before the tokens exist):
// - `border.strong`, `border.focus` on every surface: min 3 (Phase 4)
// - `syntax.*` on `syntax.background` and `surface.default`: min 4.5 (Phase 5)
const FOREGROUND_GROUPS = ["text", "ink"] as const;
const NEUTRAL_TEXT = ["text.default", "text.emphasis"];

export function contrastMatrix(mode: Mode): ContrastPair[] {
  const tokens = tokensOf(mode);
  const surfaces = tokens.filter((t) => startsWith(t, "surface") && !t.exempt);
  const foregrounds = tokens.filter(
    (t) => FOREGROUND_GROUPS.some((g) => startsWith(t, g)) && !t.exempt,
  );

  // Foreground first (grid rows), then surface (columns).
  return foregrounds.flatMap((fg) =>
    surfaces
      .filter((bg) => bg.textTier === "full" || NEUTRAL_TEXT.includes(fg.id))
      .map((bg) => ({
        id: `${mode}:${fg.id}/${bg.id}`,
        mode,
        foreground: fg.id,
        background: bg.id,
        min: MIN_TEXT,
      })),
  );
}

export const contrastMatrixAll = (): ContrastPair[] =>
  modes.flatMap((mode) => contrastMatrix(mode));
