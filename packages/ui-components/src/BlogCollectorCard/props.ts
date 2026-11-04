export interface BlogCollectorCardProps {
    /** Display name of the blog author. */
    name: string;
    /** Bare domain, e.g. `joshwcomeau.com`. */
    domain: string;
    /** Serial number within the series, e.g. `01`. */
    no: string;
    /** Size of the series. */
    total: number;
    /** URL of the homepage screenshot (the dark one when `shotLight` is given). */
    shot: string;
    /** Screenshot of the site in its light theme, shown instead of `shot` in the light theme. */
    shotLight?: string;
    /** CSS color used as accent for this card. */
    hue: string;
    /** Topics the blog covers. */
    themen: string[];
    /** Label/value rows of the facts table, in display order. */
    facts: [label: string, value: string][];
}
