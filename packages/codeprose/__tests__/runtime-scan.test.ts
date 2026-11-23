// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';

import { emptyRegistry, readTokenColor, scanRefs } from '../src/scholion/runtime/scan';
import { FIXTURE, mount } from './helpers/scholionDom';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('readTokenColor', () => {
    it('prefers the inline color of the inner span', () => {
        const root = mount();
        const a = root.querySelector<HTMLAnchorElement>('a[data-ref="alpha"]')!;
        expect(readTokenColor(a)).toBe('rgb(1, 2, 3)');
    });

    it('falls back to the computed color of the anchor without a span', () => {
        const root = mount();
        const a = root.querySelector<HTMLAnchorElement>('a[data-ref="beta"]')!;
        a.style.color = 'rgb(9, 8, 7)';
        expect(readTokenColor(a)).toBe('rgb(9, 8, 7)');
    });
});

describe('scanRefs', () => {
    it('returns the empty registry shape for a document without refs', () => {
        const root = mount('<p>nothing</p>');
        expect(scanRefs(root)).toEqual(emptyRegistry);
    });

    it('skips refs without explanation or description', () => {
        const registry = scanRefs(mount());
        expect(registry.ids).toEqual(['alpha', 'beta']);
        expect(registry.refs.orphan).toBeUndefined();
    });

    it('skips a ref that has an explanation but no description', () => {
        const registry = scanRefs(
            mount(`<a class="ref" data-ref="x" href="#">x</a><div data-explains="x"></div>`)
        );
        expect(registry.ids).toEqual([]);
    });

    it('deduplicates ids when a ref occurs several times', () => {
        const root = mount(FIXTURE + `<a class="ref" data-ref="alpha" href="#">again</a>`);
        expect(scanRefs(root).ids).toEqual(['alpha', 'beta']);
    });

    it('collects the elements of a ref', () => {
        const root = mount();
        const { refs } = scanRefs(root);
        expect(refs.alpha.a).toBe(root.querySelector('a.ref[data-ref="alpha"]'));
        expect(refs.alpha.b).toBe(root.querySelector('[data-explains="alpha"]'));
        expect(refs.alpha.d.id).toBe('desc-alpha');
        expect(refs.alpha.cs).toHaveLength(1);
        expect(refs.beta.cs).toEqual([]);
        expect(refs.alpha.pre).toBe(root.querySelector('pre'));
        expect(refs.alpha.color).toBe('rgb(1, 2, 3)');
    });

    it('snapshots the code line with refs replaced by plain spans and the own token marked', () => {
        const { refs } = scanRefs(mount());
        const html = refs.alpha.codeHtml;
        expect(refs.alpha.lineNum).toBe('3');
        expect(html).not.toContain('<a');
        const holder = document.createElement('div');
        holder.innerHTML = html;
        expect(holder.querySelectorAll('.scholion-peek__token')).toHaveLength(1);
        expect(holder.querySelector('.scholion-peek__token')!.textContent).toBe('foo');
        // the other ref is flattened but not marked
        expect(holder.textContent).toContain('bar');
    });

    it('falls back to a `.line` element without data-line', () => {
        const root = mount(
            `<pre><span class="line"><a class="ref" data-ref="x" href="#">t</a></span></pre>
             <div data-explains="x"></div><p id="desc-x">d</p>`
        );
        const { refs } = scanRefs(root);
        expect(refs.x.lineNum).toBeNull();
        expect(refs.x.codeHtml).toContain('scholion-peek__token');
    });

    it('yields an empty snapshot when the ref is not inside a code line', () => {
        const root = mount(
            `<a class="ref" data-ref="x" href="#">t</a><div data-explains="x"></div><p id="desc-x">d</p>`
        );
        const { refs } = scanRefs(root);
        expect(refs.x.codeHtml).toBe('');
        expect(refs.x.lineNum).toBeNull();
        expect(refs.x.pre).toBeNull();
    });

    it('snapshots the description without id and without nested links', () => {
        const { refs } = scanRefs(mount());
        const holder = document.createElement('div');
        holder.innerHTML = refs.alpha.textHtml;
        expect(holder.querySelector('[id]')).toBeNull();
        expect(holder.querySelector('a')).toBeNull();
        const token = holder.querySelector('.ref-target.scholion-peek__token');
        expect(token?.textContent).toBe('foo');
        // the live description keeps its link
        expect(refs.alpha.d.querySelector('a.ref-target')).not.toBeNull();
    });
});
