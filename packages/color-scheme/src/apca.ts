/**
 * APCA (Lc) as a second contrast gate next to WCAG 2.
 *
 * WCAG 2 overrates light text on dark grounds: dark-mode inks can pass 4.5:1
 * and still reach only Lc 36–51. Thresholds (|Lc|, polarity ignored):
 * - every `ink.*` and every `syntax.*` foreground on `syntax.background` and
 *   `surface.default`: APCA_MIN (60)
 * - `text.default` on both: APCA_TEXT_WARN (75), warning only
 *
 * Exceptions: `$extensions["org.samisdat.a11y"].apcaMin` + `apcaReason` on a
 * level 2 token. Aliases (syntax.*, status.*) inherit the exception of the
 * token they point to.
 *
 * Consumers: scripts/lint-apca.ts and the Storybook contrast grid.
 */
import { converter } from "culori";
// apca-w3 ships no types.
// @ts-expect-error TS7016
import { APCAcontrast, sRGBtoY } from "apca-w3";
import {
  SYNTAX_BACKGROUND,
  SYNTAX_BACKGROUNDS,
  syntaxForegrounds,
  tokensOf,
  type FlatToken,
  type Mode,
} from "./contrast";

export const APCA_MIN = 60;
export const APCA_TEXT_WARN = 75;
export const APCA_TEXT_TOKEN = "text.default";

const toRgb = converter("rgb");

const luminance = (color: string): number => {
  const rgb = toRgb(color);
  if (!rgb) throw new Error(`Cannot parse color: ${color}`);
  return sRGBtoY([rgb.r * 255, rgb.g * 255, rgb.b * 255]) as number;
};

/** Signed APCA Lc of text on a background (negative: light text on dark). */
export const apcaLc = (foreground: string, background: string): number =>
  APCAcontrast(luminance(foreground), luminance(background)) as number;

/** Unrounded |Lc|; gates compare this value exactly, displays use one decimal. */
export const apcaAbs = (foreground: string, background: string): number =>
  Math.abs(apcaLc(foreground, background));

const ALIAS = /^\{(.+)\}$/;

/**
 * Applicable APCA minimum of a level 2/3 token: its own `apcaMin`, else that
 * of the token it aliases (transitively), else APCA_MIN.
 */
export function apcaMinOf(
  mode: Mode,
  id: string,
): { min: number; reason?: string; inheritedFrom?: string } {
  const tokens = new Map(tokensOf(mode).map((t) => [t.id, t]));
  let current: FlatToken | undefined = tokens.get(id);
  while (current) {
    if (current.apcaMin !== undefined) {
      return {
        min: current.apcaMin,
        reason: current.apcaReason,
        inheritedFrom: current.id === id ? undefined : current.id,
      };
    }
    const target = ALIAS.exec(current.value)?.[1];
    current = target ? tokens.get(target) : undefined;
  }
  return { min: APCA_MIN };
}

export type ApcaPair = {
  id: string;
  mode: Mode;
  foreground: string;
  background: string;
  /** Applicable minimum |Lc| */
  min: number;
  reason?: string;
};

const apcaPair = (mode: Mode, foreground: string, background: string): ApcaPair => ({
  id: `${mode}:${foreground}/${background}`,
  mode,
  foreground,
  background,
  ...apcaMinOf(mode, foreground),
});

/** Gated pairs: every ink and syntax foreground on the code block and the page. */
export function apcaPairs(mode: Mode): ApcaPair[] {
  const inks = tokensOf(mode).filter((t) => t.id.startsWith("ink.") && !t.exempt);
  return [...inks, ...syntaxForegrounds(mode)].flatMap((fg) =>
    SYNTAX_BACKGROUNDS.map((bg) => apcaPair(mode, fg.id, bg)),
  );
}

/** Warning-only pairs: body text on both backgrounds, min APCA_TEXT_WARN. */
export const apcaTextPairs = (mode: Mode): ApcaPair[] =>
  SYNTAX_BACKGROUNDS.map((bg) => ({
    ...apcaPair(mode, APCA_TEXT_TOKEN, bg),
    min: APCA_TEXT_WARN,
    reason: undefined,
  }));

export { SYNTAX_BACKGROUND };
