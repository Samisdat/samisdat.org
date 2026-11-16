// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScholionProvider } from '../src/scholion/runtime/ScholionProvider';
import { FIXTURE } from './helpers/scholionDom';

import type { Docks } from '../src/scholion/runtime/dockNode';

const VH = window.innerHeight;
const box = (top: number, height = 20, left = 100, width = 40) => ({
    top,
    bottom: top + height,
    left,
    right: left + width,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
});
const IN_VIEW = box(200);
const BELOW = box(VH + 500);
const ABOVE = box(-500);

let docks: Docks;
let scrollIntoView: ReturnType<typeof vi.fn>;

let geo = { a: IN_VIEW, c: IN_VIEW };

/** Place the code token and the text target of `alpha` in the viewport (or not). */
function place(a: typeof geo.a, c: typeof geo.c) {
    geo = { a, c };
}

async function renderProvider(contentKey = 'one') {
    const view = render(
        <ScholionProvider
            contentKey={contentKey}
            docks={docks}
        >
            <div dangerouslySetInnerHTML={{ __html: FIXTURE }} />
        </ScholionProvider>
    );
    // the scan runs in an effect after mount
    await waitFor(() => expect(document.querySelector('.scholion-wires')).not.toBeNull());
    return {
        ...view,
        aEl: document.querySelector<HTMLAnchorElement>('a.ref[data-ref="alpha"]')!,
        cEl: document.querySelector<HTMLElement>('.ref-target[data-ref="alpha"]')!,
    };
}

const hover = (el: Element, type: 'pointerOver' | 'pointerOut' = 'pointerOver') =>
    fireEvent[type](el, { pointerType: 'mouse' });
const settle = () => act(() => new Promise<void>(resolve => requestAnimationFrame(() => resolve())));
const wire = (id: string) => document.querySelector(`.scholion-wires g:nth-child(${id === 'alpha' ? 1 : 2})`)!;

beforeEach(() => {
    docks = { top: document.createElement('div'), bottom: document.createElement('div') };
    document.body.append(docks.top!, docks.bottom!);
    place(IN_VIEW, IN_VIEW);
    Element.prototype.getBoundingClientRect = function (this: Element) {
        return (this.matches('a.ref[data-ref="alpha"]') ? geo.a : box(0, 0, 0, 0)) as DOMRect;
    };
    Element.prototype.getClientRects = function (this: Element) {
        const hit = this.matches('.ref-target[data-ref="alpha"]');
        return (hit ? [geo.c] : []) as unknown as DOMRectList;
    };
    scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView as unknown as typeof Element.prototype.scrollIntoView;
});

afterEach(() => {
    cleanup();
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('style');
});

describe('ScholionProvider', () => {
    it('renders only its children when the document has no refs', async () => {
        render(
            <ScholionProvider docks={docks}>
                <p>plain</p>
            </ScholionProvider>
        );
        await settle();
        expect(screen.getByText('plain')).toBeTruthy();
        expect(document.querySelector('.scholion-wires')).toBeNull();
    });

    it('mirrors token colors into <html> and removes them on unmount', async () => {
        const { unmount } = await renderProvider();
        await waitFor(() =>
            expect(document.documentElement.style.getPropertyValue('--scholion-color-alpha')).toBe('rgb(1, 2, 3)')
        );
        unmount();
        expect(document.documentElement.style.getPropertyValue('--scholion-color-alpha')).toBe('');
    });

    it('draws a wire between both ends while a ref is hovered and fades it out after the grace period', async () => {
        place(IN_VIEW, box(400));
        const { aEl } = await renderProvider();
        expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on');

        hover(aEl);
        await waitFor(() => expect(wire('alpha').getAttribute('class')).toContain('scholion-g--on'));
        expect(wire('alpha').querySelector('path')?.getAttribute('d')).toMatch(/^M/);
        expect(document.querySelector('.scholion-peek')).toBeNull();

        vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
        hover(aEl, 'pointerOut');
        act(() => vi.advanceTimersByTime(300));
        vi.useRealTimers();
        await waitFor(() => expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on'));
        // the last geometry stays so the wire can fade out in place
        expect(wire('alpha').querySelector('path')).not.toBeNull();
    });

    it('ignores non-mouse hover', async () => {
        place(IN_VIEW, box(400));
        const { aEl } = await renderProvider();
        fireEvent.pointerOver(aEl, { pointerType: 'touch' });
        await settle();
        expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on');
    });

    it('shows a text peek at the bottom when the explanation is below the fold, and jumps with a return chip', async () => {
        place(IN_VIEW, BELOW);
        const { aEl, cEl } = await renderProvider();
        hover(aEl);

        const peek = await waitFor(() => {
            const el = docks.bottom!.querySelector('.scholion-peek--text');
            expect(el).not.toBeNull();
            return el as HTMLElement;
        });
        expect(peek.getAttribute('aria-label')).toBe('Zur Erklärung springen');
        expect(peek.textContent).toContain('About');
        await waitFor(() => expect(peek.className).toContain('scholion-peek--on'));
        // dashed wire to the peek
        expect(wire('alpha').getAttribute('class')).toContain('scholion-g--dashed');

        fireEvent.click(peek);
        const chip = await waitFor(() => {
            const el = docks.bottom!.querySelector('.scholion-chip--on');
            expect(el).not.toBeNull();
            return el as HTMLElement;
        });
        expect(chip.textContent).toBe('Zurück zum Code');
        expect(document.activeElement).toBe(document.querySelector('[data-explains="alpha"]'));
        expect(scrollIntoView).toHaveBeenCalledTimes(1);

        // Return target (code token) is in view while the chip is shown: it stays until clicked
        fireEvent.click(chip);
        await waitFor(() => expect(docks.bottom!.querySelector('.scholion-chip--on')).toBeNull());
        expect(scrollIntoView).toHaveBeenCalledTimes(2);
        expect(document.activeElement).toBe(aEl);
        void cEl;
    });

    it('shows a code peek at the top when the token is above the header', async () => {
        place(ABOVE, IN_VIEW);
        const { cEl } = await renderProvider();
        hover(cEl);

        const peek = await waitFor(() => {
            const el = docks.top!.querySelector('.scholion-peek--code');
            expect(el).not.toBeNull();
            return el as HTMLElement;
        });
        expect(peek.getAttribute('aria-label')).toBe('Zur Codezeile springen');
        expect(peek.textContent).toContain('Zeile 3');
        expect(peek.querySelector('.scholion-peek__token')?.textContent).toBe('foo');

        fireEvent.click(peek);
        const chip = await waitFor(() => {
            const el = docks.bottom!.querySelector('.scholion-chip--on');
            expect(el).not.toBeNull();
            return el as HTMLElement;
        });
        expect(chip.textContent).toBe('Zurück zum Text');
        expect(document.activeElement).toBe(document.querySelector('a.ref[data-ref="alpha"]'));
    });

    it('keeps the peek up while the pointer is on it and ends it when it leaves', async () => {
        place(IN_VIEW, BELOW);
        const { aEl } = await renderProvider();
        hover(aEl);
        const peek = (await waitFor(() => {
            const el = docks.bottom!.querySelector('.scholion-peek--text');
            expect(el).not.toBeNull();
            return el;
        })) as HTMLElement;

        fireEvent.pointerEnter(peek, { pointerType: 'mouse' });
        hover(aEl, 'pointerOut');
        await act(() => new Promise(resolve => setTimeout(resolve, 350)));
        expect(wire('alpha').getAttribute('class')).toContain('scholion-g--on');

        fireEvent.pointerLeave(peek, { pointerType: 'mouse' });
        await waitFor(() => expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on'));
        await waitFor(() => expect(peek.className).not.toContain('scholion-peek--on'));
    });

    it('activates on the first tap without navigating and clears on escape or an outside tap', async () => {
        place(IN_VIEW, box(400));
        const { aEl } = await renderProvider();

        fireEvent.pointerDown(aEl, { pointerType: 'touch' });
        const first = fireEvent.click(aEl, { detail: 1 });
        expect(first).toBe(false); // default prevented
        await waitFor(() => expect(wire('alpha').getAttribute('class')).toContain('scholion-g--on'));

        fireEvent.keyDown(document, { key: 'Escape' });
        await waitFor(() => expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on'));

        fireEvent.pointerDown(aEl, { pointerType: 'touch' });
        fireEvent.click(aEl, { detail: 1 });
        await waitFor(() => expect(wire('alpha').getAttribute('class')).toContain('scholion-g--on'));
        fireEvent.click(document.body);
        await waitFor(() => expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on'));
    });

    it('does not clear a tap when tapping inside a peek', async () => {
        place(IN_VIEW, BELOW);
        const { aEl } = await renderProvider();
        fireEvent.pointerDown(aEl, { pointerType: 'touch' });
        fireEvent.click(aEl, { detail: 1 });
        const peek = (await waitFor(() => {
            const el = docks.bottom!.querySelector('.scholion-peek--text');
            expect(el).not.toBeNull();
            return el;
        })) as HTMLElement;
        // clicking inside the peek is a jump, not a clear
        fireEvent.click(peek.querySelector('.scholion-peek__meta')!);
        await waitFor(() => expect(docks.bottom!.querySelector('.scholion-chip--on')).not.toBeNull());
    });

    it('lets mouse clicks follow the link when one end is out of view, and blocks them when both are visible', async () => {
        place(IN_VIEW, BELOW);
        const { aEl } = await renderProvider();
        expect(fireEvent.click(aEl, { detail: 1 })).toBe(true);

        place(IN_VIEW, box(400));
        expect(fireEvent.click(aEl, { detail: 1 })).toBe(false);
    });

    it('always follows the link for keyboard activation', async () => {
        place(IN_VIEW, box(400));
        const { aEl } = await renderProvider();
        expect(fireEvent.click(aEl, { detail: 0 })).toBe(true);
    });

    it('ignores escape and outside clicks when nothing is active', async () => {
        place(IN_VIEW, box(400));
        await renderProvider();
        fireEvent.keyDown(document, { key: 'Escape' });
        fireEvent.keyDown(document, { key: 'a' });
        fireEvent.click(document.body);
        await settle();
        expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on');
    });

    it('activates the wire on keyboard focus and drops it on blur', async () => {
        place(IN_VIEW, box(400));
        const { aEl } = await renderProvider();
        // happy-dom has no real :focus-visible, treat every focus as keyboard focus
        const matches = aEl.matches.bind(aEl);
        vi.spyOn(aEl, 'matches').mockImplementation(((sel: string) =>
            sel === ':focus-visible' ? true : matches(sel)) as typeof aEl.matches);
        fireEvent.focusIn(aEl);
        await waitFor(() => expect(wire('alpha').getAttribute('class')).toContain('scholion-g--on'));
        fireEvent.focusOut(aEl);
        await waitFor(() => expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on'));
    });

    it('does not activate on pointer focus (no :focus-visible)', async () => {
        place(IN_VIEW, box(400));
        const { aEl } = await renderProvider();
        vi.spyOn(aEl, 'matches').mockReturnValue(false);
        fireEvent.focusIn(aEl);
        await settle();
        expect(wire('alpha').getAttribute('class')).not.toContain('scholion-g--on');
    });

    it('dismisses the chip once the return target has left the view and arrives again', async () => {
        place(IN_VIEW, BELOW);
        const { aEl } = await renderProvider();
        hover(aEl);
        const peek = (await waitFor(() => {
            const el = docks.bottom!.querySelector('.scholion-peek--text');
            expect(el).not.toBeNull();
            return el;
        })) as HTMLElement;
        fireEvent.click(peek);
        await waitFor(() => expect(docks.bottom!.querySelector('.scholion-chip--on')).not.toBeNull());

        // user scrolls so that the code token (return target) is gone, then comes back
        place(ABOVE, BELOW);
        fireEvent.scroll(window);
        await settle();
        place(IN_VIEW, BELOW);
        fireEvent.scroll(window);
        await waitFor(() => expect(docks.bottom!.querySelector('.scholion-chip--on')).toBeNull());
    });

    it('rescans when the content key changes', async () => {
        const { rerender } = await renderProvider('one');
        const first = document.querySelector('.scholion-wires');
        rerender(
            <ScholionProvider
                contentKey="two"
                docks={docks}
            >
                <div dangerouslySetInnerHTML={{ __html: FIXTURE }} />
            </ScholionProvider>
        );
        await waitFor(() => expect(document.querySelector('.scholion-wires')).not.toBe(first));
    });

    it('does not render peeks or the chip without dock nodes', async () => {
        place(IN_VIEW, BELOW);
        docks = { top: null, bottom: null };
        const { aEl } = await renderProvider();
        hover(aEl);
        await settle();
        expect(document.querySelector('.scholion-peek')).toBeNull();
        expect(document.querySelector('.scholion-chip')).toBeNull();
    });

    it('uses auto scroll behavior with reduced motion', async () => {
        const original = window.matchMedia;
        window.matchMedia = ((q: string) => ({
            ...original.call(window, q),
            matches: q.includes('reduce'),
            addEventListener: () => {},
            removeEventListener: () => {},
        })) as typeof window.matchMedia;
        try {
            place(IN_VIEW, BELOW);
            const { aEl } = await renderProvider();
            hover(aEl);
            const peek = (await waitFor(() => {
                const el = docks.bottom!.querySelector('.scholion-peek--text');
                expect(el).not.toBeNull();
                return el;
            })) as HTMLElement;
            fireEvent.click(peek);
            expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
        } finally {
            window.matchMedia = original;
        }
    });
});
