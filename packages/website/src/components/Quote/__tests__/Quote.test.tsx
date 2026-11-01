import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { Quote } from '../index';
import { quoteMarkFor, sourceLabel } from '../quote';

const render = (props: Parameters<typeof Quote>[0]) => renderToStaticMarkup(<Quote {...props} />);

describe('quoteMarkFor', () => {
    it('maps en -> “ and de -> „', () => {
        expect(quoteMarkFor('en')).toBe('“');
        expect(quoteMarkFor('de')).toBe('„');
    });

    it('uses the primary subtag, case-insensitive', () => {
        expect(quoteMarkFor('EN-gb')).toBe('“');
        expect(quoteMarkFor('de-AT')).toBe('„');
    });

    it('falls back to “ for other languages and to the post language (de) when missing', () => {
        expect(quoteMarkFor('fr')).toBe('“');
        expect(quoteMarkFor('')).toBe('“');
        expect(quoteMarkFor()).toBe('„');
    });
});

describe('sourceLabel', () => {
    it('strips www. and shows only the host when a title exists', () => {
        expect(sourceLabel('https://www.w3.org/TR/SMIL3/smil-timing.html#q109', true)).toBe('w3.org');
    });

    it('appends the path without a title', () => {
        expect(sourceLabel('https://www.w3.org/TR/SMIL3/smil-timing.html', false)).toBe('w3.org/TR/SMIL3/smil-timing.html');
    });

    it('shortens long paths and drops trailing slashes', () => {
        expect(sourceLabel('https://example.com/docs/', false)).toBe('example.com/docs');
        expect(sourceLabel('https://example.com/a/very/long/path/that/keeps/going', false)).toBe('example.com/a/very/long/path/that/keeps/goi…');
    });

    it('returns unparseable hrefs unchanged', () => {
        expect(sourceLabel('not a url', true)).toBe('not a url');
    });
});

describe('Quote', () => {
    it('renders quote first, then caption with cite and link (title + href)', () => {
        const html = render({ title: 'Timing', href: 'https://www.w3.org/TR/x', lang: 'en', children: <p>Text</p> });
        expect(html.indexOf('<blockquote')).toBeLessThan(html.indexOf('<figcaption'));
        expect(html).toContain('lang="en"');
        expect(html).toContain('cite="https://www.w3.org/TR/x"');
        expect(html).toMatch(/<cite[^>]*>Timing<\/cite>/);
        expect(html).toMatch(/<a [^>]*href="https:\/\/www\.w3\.org\/TR\/x"[^>]*>w3\.org<\/a>/);
        expect(html.indexOf('Timing')).toBeLessThan(html.indexOf('w3.org</a>'));
        expect(html).toMatch(/<span aria-hidden="true"[^>]*>“<\/span>/);
        expect(html).toContain('aria-hidden="true"> · </span>');
    });

    it('title only: no link, no middle dot, no cite attribute', () => {
        const html = render({ title: 'Timing', children: <p>Text</p> });
        expect(html).toMatch(/<cite[^>]*>Timing<\/cite>/);
        expect(html).not.toContain('<a ');
        expect(html).not.toContain(' · ');
        expect(html).not.toContain('cite="');
    });

    it('href only: link text carries host and path, no cite element', () => {
        const html = render({ href: 'https://example.com/docs/page', children: <p>Text</p> });
        expect(html).not.toContain('<cite');
        expect(html).not.toContain(' · ');
        expect(html).toMatch(/<a [^>]*>example\.com\/docs\/page<\/a>/);
    });

    it('no source: no figcaption, only the aria-hidden quote mark', () => {
        const html = render({ children: <p>Text</p> });
        expect(html).not.toContain('<figcaption');
        expect(html).not.toContain('<cite');
        expect(html).not.toContain('<a ');
        expect(html).toMatch(/aria-hidden="true"[^>]*>(<span[^>]*>)?„/);
    });

    it('keeps several paragraphs and inline code', () => {
        const html = render({
            children: (
                <>
                    <p>
                        One <code>x</code>
                    </p>
                    <p>Two</p>
                </>
            ),
        });
        expect(html.match(/<p>/g)).toHaveLength(2);
        expect(html).toContain('<code>x</code>');
    });

    it('does not truncate long titles', () => {
        const title = 'A'.repeat(120);
        expect(render({ title, children: <p>Text</p> })).toContain(title);
    });
});
