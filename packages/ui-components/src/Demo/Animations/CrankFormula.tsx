"use client";

import { styled } from "@linaria/react";
import { memo, type RefObject } from "react";

export const fmt = (value: number, digits: number) =>
  value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const fmtDur = (value: number) =>
  value.toLocaleString("de-DE", { maximumFractionDigits: 2 });

export const fmtDuration = (value: number) => `${fmtDur(value)}s`;

/** Signed number with a real minus sign (U+2212). */
export const fmtSigned = (value: number, digits: number) =>
  `${value < 0 ? "−" : "+"}${fmt(Math.abs(value), digits)}`;

export const mod = (a: number, b: number) => ((a % b) + b) % b;

const INITIAL_JUMP_TEXT = "Noch keine Änderung an dur.";

export type FormulaField =
  | "t"
  | "begin"
  | "dur"
  | "local"
  | "frac"
  | "theta"
  | "measured";

export type FormulaValues = Record<FormulaField, string>;

const FLASH_FIELDS: FormulaField[] = ["dur", "frac", "theta"];

/**
 * Writes straight into the DOM nodes rendered by <CrankFormula>, so the
 * per-frame updates never go through React.
 */
export const createFormulaWriter = (root: HTMLElement) => {
  const fields = new Map<string, HTMLElement[]>();
  root.querySelectorAll<HTMLElement>("[data-f]").forEach((node) => {
    const name = node.dataset.f as string;
    fields.set(name, [...(fields.get(name) ?? []), node]);
  });

  const last = new Map<string, string>();
  const set = (name: string, text: string) => {
    if (last.get(name) === text) {
      return;
    }
    last.set(name, text);
    fields.get(name)?.forEach((node) => {
      node.textContent = text;
    });
  };

  return {
    write: (values: FormulaValues) => {
      (Object.keys(values) as FormulaField[]).forEach((name) =>
        set(name, values[name]),
      );
    },
    setJump: (line1: string, line2 = "") => {
      set("jump1", line1);
      set("jump2", line2);
    },
    flash: () => {
      FLASH_FIELDS.forEach((name) =>
        fields.get(name)?.forEach((node) =>
          node.animate(
            [
              {
                backgroundColor:
                  "color-mix(in oklch, currentColor 45%, transparent)",
              },
              { backgroundColor: "transparent" },
            ],
            { duration: 700, easing: "ease-out" },
          ),
        ),
      );
    },
  };
};

export type FormulaWriter = ReturnType<typeof createFormulaWriter>;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;

  .formula,
  .jump,
  .measured {
    padding: 0.75rem 1rem;
    background: var(--color-syntax-background);
    white-space: pre;
    overflow-x: auto;
  }

  .formula,
  .measured {
    color: var(--color-text-primary, inherit);
  }

  .comment {
    opacity: 0.6;
  }

  .v {
    border-radius: 2px;
  }

  .v-t {
    color: var(--color-ink-turquoise);
  }

  .v-begin {
    color: var(--color-ink-amethyst);
  }

  .v-dur {
    color: var(--color-ink-gold);
  }

  .v-frac {
    color: var(--color-ink-sapphire);
  }

  .v-theta {
    color: var(--color-ink-rose);
  }

  .jump {
    color: var(--color-status-danger);
    min-height: 3.5em;
  }
`;

const INDENT = "     ";

const V = ({ f, init }: { f: FormulaField; init: string }) => (
  <span data-f={f} className={`v v-${f === "local" ? "t" : f}`}>
    {init}
  </span>
);

type CrankFormulaProps = {
  ref: RefObject<HTMLDivElement | null>;
  baseDuration: number;
};

export const CrankFormula = memo(({ ref, baseDuration }: CrankFormulaProps) => {
  const dur = fmtDur(baseDuration);
  const zero = fmt(0, 2);

  return (
    <Block ref={ref}>
      <div className="formula">
        <div className="comment">{"// Winkel"}</div>
        <div>
          {"θ    = from + "}
          <V f="frac" init={fmt(0, 4)} />
          {" · (to − from)"}
        </div>
        <div>
          {INDENT}
          {"= 0° + "}
          <V f="frac" init={fmt(0, 4)} />
          {" · (360° − 0°)"}
        </div>
        <div>
          {INDENT}
          {"= "}
          <V f="theta" init={fmt(0, 1)} />
          {"°"}
        </div>
        <div>{" "}</div>
        <div className="comment">{"// Phase im aktuellen Zyklus"}</div>
        <div>{"frac = ((t − begin) mod dur) / dur"}</div>
        <div>
          {INDENT}
          {"= (("}
          <V f="t" init={zero} />
          {"s − "}
          <V f="begin" init={zero} />
          {"s) mod "}
          <V f="dur" init={dur} />
          {"s) / "}
          <V f="dur" init={dur} />
          {"s"}
        </div>
        <div>
          {INDENT}
          {"= "}
          <V f="local" init={zero} />
          {"s / "}
          <V f="dur" init={dur} />
          {"s"}
        </div>
        <div>
          {INDENT}
          {"= "}
          <V f="frac" init={fmt(0, 4)} />
        </div>
      </div>
      <div className="jump" aria-live="polite">
        <div data-f="jump1">{INITIAL_JUMP_TEXT}</div>
        <div data-f="jump2" />
      </div>
      <div className="measured">
        {"Browser misst: θ = "}
        <span data-f="measured">{fmt(0, 1)}</span>
        {"°"}
      </div>
    </Block>
  );
});
