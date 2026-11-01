const QUOTE_MARKS: Record<string, string> = {
    en: '“',
    de: '„',
};

const FALLBACK_QUOTE_MARK = '“';
const POST_LANG = 'de';
const MAX_PATH_LENGTH = 32;

/** Opening quotation mark for a BCP 47 language tag (`en-GB` -> `en`); unknown languages fall back to “. */
export const quoteMarkFor = (lang: string = POST_LANG): string => {
    const primary = lang.trim().toLowerCase().split('-')[0] ?? '';
    return QUOTE_MARKS[primary] ?? FALLBACK_QUOTE_MARK;
};

const shortenPath = (pathname: string): string => {
    const path = pathname.replace(/\/+$/, '');
    if (path.length <= MAX_PATH_LENGTH) return path;
    return `${path.slice(0, MAX_PATH_LENGTH)}…`;
};

/**
 * Link text for a source URL: hostname without `www.`. Without a title the link is the only hint what the
 * source is, so the (shortened) path is appended to keep its purpose clear. Unparseable hrefs are shown as-is.
 */
export const sourceLabel = (href: string, hasTitle: boolean): string => {
    let url: URL;
    try {
        url = new URL(href);
    } catch {
        return href;
    }
    const host = url.hostname.replace(/^www\./, '');
    return hasTitle ? host : `${host}${shortenPath(url.pathname)}`;
};
