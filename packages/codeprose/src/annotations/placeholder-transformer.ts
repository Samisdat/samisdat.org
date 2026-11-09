import type { Element, ElementContent } from 'hast';
import type { ShikiTransformer } from 'shiki';

type PlaceholderInfo = {
    key: string;
    value: string;
    /** 1-based: which occurrence of the value in the line to mark */
    occurrence: number;
    nextLineIndex: number;
};

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
                markPlaceholder(lineEl, info);
            }
        },
    };
}

function getText(node: ElementContent): string {
    if (node.type === 'text') return node.value;
    if (node.type === 'element') return node.children.map(getText).join('');
    return '';
}

const WORD_CHAR = /[\w$]/;

/** A hit must not be part of a longer word or number (`0.0` must not match in `10.05` or `0.05`). */
function isDelimited(text: string, start: number, end: number): boolean {
    const before = text[start - 1];
    const after = text[end];
    const next = text[end + 1];

    if (before !== undefined && WORD_CHAR.test(before)) return false;
    if (after !== undefined && WORD_CHAR.test(after)) return false;
    if (after === '.' && next !== undefined && /\d/.test(next)) return false;
    return true;
}

function findOccurrence(text: string, value: string, occurrence: number): number {
    let seen = 0;
    for (let at = text.indexOf(value); at !== -1; at = text.indexOf(value, at + 1)) {
        if (isDelimited(text, at, at + value.length) && ++seen === occurrence) return at;
    }
    return -1;
}

const isPlainToken = (node: ElementContent): boolean =>
    node.type === 'text' || (node.type === 'element' && node.children.every(c => c.type === 'text'));

const pieceOf = (node: ElementContent, value: string): ElementContent =>
    node.type === 'element' ? { ...node, children: [{ type: 'text', value }] } : { type: 'text', value };

/**
 * Marks the nth occurrence of the value in the line. The match runs on the concatenated line text, because a
 * theme may split one literal into several tokens (`0.0` becomes `0`, `.`, `0`). The tokens are cut at the
 * boundaries of the hit and the hit becomes one span that keeps the style of its first token; everything
 * around it (quotes, punctuation) stays outside, so textContent updates don't clobber it.
 */
function markPlaceholder(lineEl: Element, info: PlaceholderInfo): boolean {
    const tokens = lineEl.children;
    if (!tokens.every(isPlainToken)) return false;

    const text = tokens.map(getText).join('');
    const start = findOccurrence(text, info.value, info.occurrence);
    if (start === -1) return false;
    const end = start + info.value.length;

    const result: ElementContent[] = [];
    let offset = 0;
    let placed = false;

    for (const token of tokens) {
        const tokenText = getText(token);
        const tokenStart = offset;
        const tokenEnd = offset + tokenText.length;
        offset = tokenEnd;

        if (tokenEnd <= start || tokenStart >= end) {
            result.push(token);
            continue;
        }

        const left = tokenText.slice(0, Math.max(0, start - tokenStart));
        const right = tokenText.slice(Math.min(tokenText.length, end - tokenStart));
        if (left) result.push(pieceOf(token, left));
        if (!placed) {
            placed = true;
            result.push({
                type: 'element',
                tagName: 'span',
                properties: { ...(token.type === 'element' ? token.properties : {}), 'data-placeholder': info.key },
                children: [{ type: 'text', value: info.value }],
            });
        }
        if (right) result.push(pieceOf(token, right));
    }

    lineEl.children = result;
    return true;
}
