export const fmt = (locale: string, value: number, digits: number) =>
    value.toLocaleString(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });

export const fmtDur = (locale: string, value: number) => value.toLocaleString(locale, { maximumFractionDigits: 2 });

/** Signed number with a real minus sign (U+2212). */
export const fmtSigned = (locale: string, value: number, digits: number) =>
    `${value < 0 ? '−' : '+'}${fmt(locale, Math.abs(value), digits)}`;

/** Plain JS number literal (dot decimals) for the code-style blocks. */
export const num = (value: number, digits: number) => value.toFixed(digits);
export const numDur = (value: number) => String(Number(value.toFixed(2)));

/** Replaces `{name}` placeholders; unknown names are left as they are. */
export const interpolate = (template: string, values: Record<string, string>) =>
    template.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match);
