/** A run of text with the SGR attributes that were active when it was printed. */
export type AnsiSpan = {
    text: string;
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
    /** Basic color 0-7 (black, red, green, yellow, blue, magenta, cyan, white); bright variants map to the same. */
    fg?: number;
};

type State = Omit<AnsiSpan, 'text'>;

/** Parses colored terminal output (SGR sequences only) into lines of styled spans. */
export function parseAnsi(input: string): AnsiSpan[][] {
    const lines: AnsiSpan[][] = [];
    let state: State = {};
    let line: AnsiSpan[] = [];

    const push = (text: string) => {
        if (text) line.push({ text, ...state });
    };

    // eslint-disable-next-line no-control-regex
    const token = /\x1b\[([0-9;]*)m|\n/g;
    let last = 0;
    for (let match = token.exec(input); match; match = token.exec(input)) {
        push(input.slice(last, match.index));
        last = match.index + match[0].length;

        if (match[0] === '\n') {
            lines.push(line);
            line = [];
            continue;
        }

        for (const code of (match[1] || '0').split(';').map(Number)) {
            if (code === 0) state = {};
            else if (code === 1) state = { ...state, bold: true };
            else if (code === 2) state = { ...state, dim: true };
            else if (code === 3) state = { ...state, italic: true };
            else if (code === 4) state = { ...state, underline: true };
            else if (code === 22) state = { ...state, bold: false, dim: false };
            else if (code === 39) state = { ...state, fg: undefined };
            else if ((code >= 30 && code <= 37) || (code >= 90 && code <= 97)) state = { ...state, fg: code % 10 };
        }
    }
    push(input.slice(last));
    if (line.length) lines.push(line);

    return lines;
}
