/** A run of text with its syntax color (a CSS color, e.g. var(--color-syntax-keyword)) and, in a changed line, what happened to it. */
export type Part = {
    t: string;
    c?: string;
    k?: 'old' | 'new';
    /** Parts with the same `g` are one replacement: the old text and what took its place. */
    g?: number;
};

/** Syntax-highlighted line, as the highlighter returns it. */
export type ColorToken = { text: string; color?: string };

/** One line of the new file as the reader sees it. */
export type Line = {
    no: number;
    /** add: new line, chg: old and new token in one line, ws: only whitespace differs, same: unchanged */
    kind: 'same' | 'add' | 'chg' | 'ws';
    parts: Part[];
};

export type RemovedLine = { no: number; parts: Part[] };

export type Item =
    | { type: 'lines'; lines: Line[] }
    /** Unchanged lines collapsed to one line. */
    | { type: 'fold'; label: string; lines: Line[] }
    | {
          type: 'change';
          /**
           * New lines with token marks; removed lines collapse into one ghost. A line with more than one change is not
           * marked inline: its old version stands above it as a visible removed line.
           */
          rows: (
              | { type: 'line'; line: Line }
              | { type: 'ghost'; lines: RemovedLine[] }
              | { type: 'old'; line: RemovedLine }
          )[];
      };

export type UnifiedLine = { prefix: ' ' | '+' | '-'; text: string };
/** `header` is the `@@ -a,b +c,d @@` range; `context` the enclosing declaration git prints after it. */
export type UnifiedHunk = { header: string; context?: string; lines: UnifiedLine[] };
