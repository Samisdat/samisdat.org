"use client";

import { styled } from "@linaria/react";
import { useEffect, useRef, useState } from "react";
import { useShikiHighlighter } from "react-shiki";
import { shikiTheme, styledGrammarLangs } from "../../utils/shikiTheme";
import { useDemoContext } from "../DemoContext";
import {
  AUTO_RESET_AT,
  BASE_DURATION_FALLBACK,
  CRANK_ELEMENT_ID,
  type CrankEvent,
} from "./crankEvents";

export const fmt = (value: number, digits: number) =>
  value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const fmtDur = (value: number) =>
  value.toLocaleString("de-DE", { maximumFractionDigits: 2 });

/** Plain JS number literal (dot decimals) for the code-style blocks. */
const num = (value: number, digits: number) => value.toFixed(digits);
const numDur = (value: number) => String(Number(value.toFixed(2)));

export const fmtDuration = (value: number) => `${fmtDur(value)}s`;

/** Signed number with a real minus sign (U+2212). */
export const fmtSigned = (value: number, digits: number) =>
  `${value < 0 ? "−" : "+"}${fmt(Math.abs(value), digits)}`;

const INITIAL_JUMP_LINES = [
  "Ändere die Geschwindigkeit in der Demo,",
  "um den Effekt zu sehen",
] as const;

export type FormulaField =
  | "t"
  | "dur"
  | "local"
  | "frac"
  | "theta"
  | "measured";

export type FormulaValues = Record<FormulaField, string>;

const FLASH_FIELDS: FormulaField[] = ["dur", "frac", "theta"];

/**
 * Writes straight into the DOM nodes rendered by <DemoAnimationsCrankFormula>, so the
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

  // Replacing a live value's text collapses a selection that ends inside it, so
  // the last value would be missing from a copy. Hold per-frame writes while
  // the user has a selection on the formula; the next frame after it is
  // cleared catches up.
  const hasSelection = () => {
    const selection = root.ownerDocument.getSelection();
    return !!selection && !selection.isCollapsed && selection.containsNode(root, true);
  };

  return {
    write: (values: FormulaValues) => {
      if (hasSelection()) {
        return;
      }
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

  .v-dur {
    color: var(--color-ink-gold);
  }

  .v-frac {
    color: var(--color-ink-sapphire);
  }

  .v-theta {
    color: var(--color-ink-rose);
  }

  /* Reserves the six lines until the highlighter has run. */
  .measured .snippet {
    min-height: 6lh;
  }

  .measured pre {
    margin: 0;
    padding: 0;
    font: inherit;
    overflow: visible;
    background: transparent !important;
  }

  .measured code {
    font: inherit;
  }

  .measured .result {
    color: var(--color-syntax-comment);
    font-style: italic;
  }

  .jump {
    color: var(--color-status-danger);
    min-height: 4lh;
  }
`;

/** Static token, colored like the live value of the same variable. */
const Tok = ({ f, children }: { f: FormulaField; children: string }) => (
  <span className={`v-${f}`}>{children}</span>
);

const V = ({ f, init }: { f: FormulaField; init: string }) => (
  <span data-f={f} className={`v v-${f}`}>
    {init}
  </span>
);

// Continuation of an assignment as a comment, "=" aligned under the one above.
const Cont = ({ pad }: { pad: number }) => (
  <span className="comment">{`//${" ".repeat(pad)}`}</span>
);

const consoleSnippet = (comment: string) => `// ${comment}
const g = document
  .querySelector("#${CRANK_ELEMENT_ID}");
const { a, b } = g.getCTM();
(Math.atan2(b, a) * 180 / Math.PI
  + 360) % 360`;

const ConsoleSnippet = ({ comment }: { comment: string }) =>
  useShikiHighlighter(consoleSnippet(comment), "javascript", shikiTheme, {
    customLanguages: styledGrammarLangs,
  });

/**
 * Copy for the comments, set in the MDX so the post can be translated
 * without touching this component (the leading `// ` is added here).
 */
export type CrankFormulaTexts = {
  phaseComment: string;
  angleComment: string;
  consoleComment: string;
};

export const DemoAnimationsCrankFormula = ({
  texts,
}: {
  texts: CrankFormulaTexts;
}) => {
  const ctx = useDemoContext();
  const [baseDuration] = useState(
    () => parseFloat(ctx?.values.duration ?? "") || BASE_DURATION_FALLBACK,
  );
  const dur = numDur(baseDuration);
  const zero = num(0, 2);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const live = ctx?.live;

  useEffect(() => {
    if (!rootRef.current || !live) {
      return;
    }
    const writer = createFormulaWriter(rootRef.current);

    return live.subscribe((raw) => {
      const event = raw as CrankEvent;
      switch (event.kind) {
        case "frame":
          writer.write({
            t: num(event.t, 2),
            dur: numDur(event.dur),
            local: num(event.local, 2),
            frac: num(event.frac, 4),
            theta: num(event.theta, 1),
            measured: num(event.measured, 1),
          });
          break;
        case "jump":
          writer.setJump(
            `dur ${fmtDuration(event.before)} → ${fmtDuration(event.after)} bei t = ${fmt(event.t, 2)}s`,
            `angle springt\nvon ${fmt(event.thetaBefore, 1)}° auf ${fmt(event.thetaAfter, 1)}°\nΔ ${fmtSigned(event.delta, 1)}°`,
          );
          if (event.flash) {
            writer.flash();
          }
          break;
        case "reset":
          writer.setJump(
            "Zurückgesetzt auf t = 0.",
            event.reason === "limit" ? `t erreichte ${AUTO_RESET_AT}s` : "",
          );
          break;
      }
    });
  }, [live]);

  return (
    <Block ref={rootRef}>
      <div className="formula">
        <div>
          <Tok f="t">t</Tok>
          {" = "}
          <V f="t" init={zero} />
        </div>
        <div>{" "}</div>
        <div className="comment">{`// ${texts.phaseComment}`}</div>
        <div>
          <Tok f="frac">frac</Tok>
          {"  = ("}
          <Tok f="t">t</Tok>
          {" % "}
          <Tok f="dur">dur</Tok>
          {") / "}
          <Tok f="dur">dur</Tok>
          {";"}
        </div>
        <div>
          <Cont pad={4} />
          {"= ("}
          <V f="t" init={zero} />
          {" % "}
          <V f="dur" init={dur} />
          {") / "}
          <V f="dur" init={dur} />
        </div>
        <div>
          <Cont pad={4} />
          {"= "}
          <V f="local" init={zero} />
          {" / "}
          <V f="dur" init={dur} />
        </div>
        <div>
          <Cont pad={4} />
          {"= "}
          <V f="frac" init={num(0, 4)} />
        </div>
        <div>{" "}</div>
        <div className="comment">{`// ${texts.angleComment}`}</div>
        <div>
          <Tok f="theta">angle</Tok>
          {" = from + "}
          <Tok f="frac">frac</Tok>
          {" * (to - from);"}
        </div>
        <div>
          <Cont pad={4} />
          {"= 0 + "}
          <V f="frac" init={num(0, 4)} />
          {" * (360 - 0)"}
        </div>
        <div>
          <Cont pad={4} />
          {"= "}
          <V f="theta" init={num(0, 1)} />
        </div>
      </div>
      <div className="jump" aria-live="polite">
        <div data-f="jump1">{INITIAL_JUMP_LINES[0]}</div>
        <div data-f="jump2">{INITIAL_JUMP_LINES[1]}</div>
      </div>
      <div className="measured">
        <div className="snippet">
          <ConsoleSnippet comment={texts.consoleComment} />
        </div>
        <div className="result">
          {"// → "}
          <span data-f="measured">{num(0, 1)}</span>
          {"°"}
        </div>
      </div>
    </Block>
  );
};
