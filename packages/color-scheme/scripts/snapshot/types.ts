/** Format of a snapshot file (content/snapshots/<id>.json). Bump `version` on breaking changes. */
import type { WcagLevel } from './levels';

export type { WcagLevel };

export type SnapshotToken = {
    id: string;
    hex: string;
    /** Raw DTCG value, e.g. `{color.aubergine.900}` or `{ink.ruby}`. */
    raw?: string;
    exempt?: string;
    textTier?: string;
};

export type Rating = {
    /** WCAG 2 ratio, rounded down to two decimals. */
    w: number;
    wl: WcagLevel;
};

export type CodeToken = { c: string; f?: string; s?: 'italic' | 'bold' };
export type CodeLine = CodeToken[];

export type LegendEntry = Rating & {
    id: string;
    hex: string;
    raw?: string;
};

export type ModeSnapshot = {
    /** Every semantic token as hex. */
    colors: Record<string, string>;
    tokens: SnapshotToken[];
    /** foreground id -> surface id -> rating. */
    contrast: Record<string, Record<string, Rating>>;
    code: {
        bg: string;
        fg: string;
        theme: CodeLine[];
        diff: { kind: 'hunk' | 'ctx' | 'add' | 'del'; line: CodeLine }[];
        legend: LegendEntry[];
    };
    cvd: {
        /** Per vision type: the inks as that vision sees them (order of `Snapshot.inks`). */
        simulated: Record<'protan' | 'deutan' | 'tritan', string[]>;
        /** ΔE OK between all ink pairs per vision type. */
        delta: Record<'normal' | 'protan' | 'deutan' | 'tritan', number[][]>;
    };
    names: {
        inks: { id: string; top: { term: string; p: number }[]; gap: number }[];
        /** Hellinger name distance between all ink pairs (0 same names, 1 disjoint). */
        hellinger: number[][];
    };
    exceptions: { id: string; kind: 'exempt'; reason: string }[];
    /** Candidate values for one ink, rated like the ink itself (proposals; absent in most snapshots). */
    alternatives?: { ink: string; items: { label: string; hex: string; contrast: Record<string, Rating> }[] };
    /** Distance of the CursorLine/selection fills to the code and page background (ΔE OK). */
    fills: { token: string; toSyntax: number; toSurface: number }[];
};

export type Snapshot = {
    version: 1;
    id: string;
    /** ISO date. */
    date: string;
    git: { commit: string; dirty: boolean };
    inks: string[];
    surfaces: string[];
    /** Surfaces that carry ink text (code colors); the ink chart offers only these. */
    inkSurfaces: string[];
    texts: string[];
    modes: { dark: ModeSnapshot; light: ModeSnapshot };
    /** Primitive scales: hue -> step -> hex. */
    scales: Record<string, Record<string, string>>;
    correspondence: { roles: number; spearman: number; meanAbsDiffWcag: number } | null;
};
