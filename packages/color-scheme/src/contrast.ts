/**
 * Contrast matrix: the required foreground/background pairs, derived from the
 * token files per mode. Nothing is maintained by hand; the pairs follow from
 * roles (see ADR 0019, "Barrierefreiheit").
 *
 * Token metadata lives in `$extensions["org.samisdat.a11y"]`:
 * - `textTier` on surfaces: "full" | "neutral-only"
 * - `exempt` (string, the reason) on any token: skipped in every pair
 * - `apcaMin` (number) + `apcaReason` (string) on a level 2 token: documented
 *   exception from the APCA minimum (see src/apca.ts); aliases inherit it
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
  $extensions?: Record<
    string,
    {
      textTier?: TextTier;
      exempt?: string;
      apcaMin?: number;
      apcaReason?: string;
    }
  >;
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
  /** Lowered APCA minimum |Lc| for this token (documented exception). */
  apcaMin?: number;
  apcaReason?: string;
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
        apcaMin: ext?.apcaMin,
        apcaReason: ext?.apcaReason,
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
// `syntax.*` (level 3) is checked separately: every foreground on
// `syntax.background` (the code block) AND `surface.default` (inline code in
// running text). `syntax.background` itself is the background, not a foreground.
//
// `border.strong` and `border.focus` are checked against `surface.default` with
// min 3 (WCAG 1.4.11 non-text contrast). Checking against all surfaces is not
// practical: border.strong cannot achieve 3:1 on the lighter dark surfaces.
//
// `selection` and `highlight` carry `textTier: "neutral-only"` and are picked up
// automatically as backgrounds for text.default and text.emphasis (min 4.5:1).
export const MIN_BORDER = 3;
const BORDER_STRONG_IDS = ["border.strong", "border.focus"] as const;

const FOREGROUND_GROUPS = ["text", "ink"] as const;
const NEUTRAL_TEXT = ["text.default", "text.emphasis"];

export function borderPairs(mode: Mode): ContrastPair[] {
  const tokens = tokensOf(mode);
  const borders = tokens.filter(
    (t) => BORDER_STRONG_IDS.includes(t.id as typeof BORDER_STRONG_IDS[number]) && !t.exempt,
  );
  return borders.map((b) => ({
    id: `${mode}:${b.id}/surface.default`,
    mode,
    foreground: b.id,
    background: "surface.default",
    min: MIN_BORDER,
  }));
}

export function contrastMatrix(mode: Mode): ContrastPair[] {
  const tokens = tokensOf(mode);
  // surfaces: surface.* group + any token with textTier (selection, highlight)
  const surfaces = tokens.filter(
    (t) => (startsWith(t, "surface") || t.textTier !== undefined) && !t.exempt,
  );
  const foregrounds = tokens.filter(
    (t) => FOREGROUND_GROUPS.some((g) => startsWith(t, g)) && !t.exempt,
  );

  // Foreground first (grid rows), then surface (columns).
  const surfacePairs = foregrounds.flatMap((fg) =>
    surfaces
      .filter((bg) => bg.textTier === "full" || NEUTRAL_TEXT.includes(fg.id))
      .map((bg) => pair(mode, fg.id, bg.id)),
  );

  return [...surfacePairs, ...syntaxPairs(mode), ...borderPairs(mode)];
}

const pair = (mode: Mode, foreground: string, background: string): ContrastPair => ({
  id: `${mode}:${foreground}/${background}`,
  mode,
  foreground,
  background,
  min: MIN_TEXT,
});

export const SYNTAX_BACKGROUND = "syntax.background";
export const SYNTAX_BACKGROUNDS = [SYNTAX_BACKGROUND, "surface.default"] as const;

/** `syntax.*` foregrounds of a mode (everything but `syntax.background`). */
export const syntaxForegrounds = (mode: Mode): FlatToken[] =>
  tokensOf(mode).filter(
    (t) => startsWith(t, "syntax") && t.id !== SYNTAX_BACKGROUND && !t.exempt,
  );

/** Every syntax foreground on the code background and on the page. */
export const syntaxPairs = (mode: Mode): ContrastPair[] =>
  syntaxForegrounds(mode).flatMap((fg) =>
    SYNTAX_BACKGROUNDS.map((bg) => pair(mode, fg.id, bg)),
  );

export const contrastMatrixAll = (): ContrastPair[] =>
  modes.flatMap((mode) => contrastMatrix(mode));
