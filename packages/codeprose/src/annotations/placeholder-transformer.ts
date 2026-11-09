import type { Element, ElementContent } from 'hast';
import type { ShikiTransformer } from 'shiki';

type PlaceholderInfo = {
    key: string;
    value: string;
    /** 1-based: which occurrence of the value in the line to mark */
    occurrence: number;
    nextLineIndex: number;
};

const QUOTES = ['"', "'", '`'];

const MARKER_PREFIX_RE = /^\/\/\s*!placeholder\s+/;

/**
 * `// !placeholder key value`, `// !placeholder key "value"` and an optional `#n` suffix
 * (`// !placeholder key 0.00#2`). Quotes around the value in the comment are optional.
 */
function parseMarker(trimmed: string): Pick<PlaceholderInfo, 'key' | 'value' | 'occurrence'> | null {
    const prefix = trimmed.match(MARKER_PREFIX_RE);
    if (!prefix) return null;

    // Plain string operations instead of one regex with overlapping \s / .+? parts (polynomial backtracking)
    const rest = trimmed.slice(prefix[0].length);
    const keyEnd = rest.search(/\s/);
    if (keyEnd === -1) return null;

    const key = rest.slice(0, keyEnd);
    let value = rest.slice(keyEnd).trim();
    let occurrence = 1;

    const hash = value.lastIndexOf('#');
    if (hash !== -1 && /^\d+$/.test(value.slice(hash + 1))) {
        occurrence = Number(value.slice(hash + 1));
        value = value.slice(0, hash);
    }
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    }
    if (value === '' || occurrence < 1) return null;

    return { key, value, occurrence };
}

/** The quote character if `text` is a quoted literal (same quote on both ends), otherwise null. */
function quoteOf(text: string): string | null {
    if (text.length < 2) return null;
    const first = text[0];
    return QUOTES.includes(first) && text.endsWith(first) ? first : null;
}

export function placeholderTransformer(): ShikiTransformer {
    let infos: PlaceholderInfo[] = [];

    return {
        name: '@samisdat/placeholder',
        preprocess(code) {
            infos = [];
            const lines = code.split('\n');
            const kept: string[] = [];
            let collapseLines = 0;

            for (let i = 0; i < lines.length; i++) {
                const trimmed = lines[i].trim();
                const marker = parseMarker(trimmed);
                if (marker) {
                    infos.push({ ...marker, nextLineIndex: kept.length - collapseLines });
                    // Strip this line — don't push
                } else if (/^\/\/\s*!collapse\(/.test(trimmed)) {
                    // Stripped later by the collapse transformer; keep it in the text, but don't count it as a rendered line
                    kept.push(lines[i]);
                    collapseLines++;
                } else {
                    kept.push(lines[i]);
                }
            }

            return kept.join('\n');
        },
        code(codeEl) {
            if (infos.length === 0) return;

            const lines = codeEl.children.filter((c): c is Element => c.type === 'element' && c.tagName === 'span');

            for (const info of infos) {
                const lineEl = lines[info.nextLineIndex];
                if (!lineEl) continue;
                markPlaceholder(lineEl, info, { seen: 0 });
            }
        },
    };
}

function getText(node: ElementContent): string {
    if (node.type === 'text') return node.value;
    if (node.type === 'element') return node.children.map(getText).join('');
    return '';
}

function markPlaceholder(lineEl: Element, info: PlaceholderInfo, counter: { seen: number }): boolean {
    for (const child of lineEl.children) {
        if (child.type !== 'element') continue;
        const text = getText(child);
        const trimmed = text.trimStart();
        const prefix = text.slice(0, text.length - trimmed.length);
        const quote = quoteOf(trimmed);

        if (trimmed === info.value && ++counter.seen === info.occurrence) {
            child.properties = { ...child.properties, 'data-placeholder': info.key };
            return true;
        }
        if (quote && trimmed.slice(1, -1) === info.value && ++counter.seen === info.occurrence) {
            // Keep quotes (and any leading whitespace) outside the marked span
            // so textContent updates don't clobber them.
            child.children = [
                { type: 'text', value: prefix + quote },
                {
                    type: 'element',
                    tagName: 'span',
                    properties: { 'data-placeholder': info.key },
                    children: [{ type: 'text', value: info.value }],
                },
                { type: 'text', value: quote },
            ];
            return true;
        }
        if (markPlaceholder(child, info, counter)) return true;
    }
    return false;
}
