import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GhostRecorder } from '../GhostRecorder';

import type { Script } from '../../script';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const rect = { left: 0, top: 0, width: 200, height: 100 };

let root: Root;
let host: HTMLDivElement;
let now = 0;
let onScript: ReturnType<typeof vi.fn<(script: Script, snippet: string) => void>>;
let writeText: ReturnType<typeof vi.fn>;

const stage = () => host.querySelector<HTMLElement>('[data-recording]')!;
const button = (name: string) =>
    [...host.querySelectorAll('button')].find((b) => b.textContent?.startsWith(name)) as HTMLButtonElement;
const click = (el: Element) => act(() => el.dispatchEvent(new MouseEvent('click', { bubbles: true })));
const fire = (type: string, x: number, y: number, t: number) =>
    act(() => {
        now = t;
        stage().dispatchEvent(Object.assign(new Event(type, { bubbles: true }), { clientX: x, clientY: y, pointerId: 1 }));
    });

/** pointerdown, a wavy drag over ~1 s, pointerup */
const drag = () => {
    fire('pointerdown', 20, 50, 0);
    for (let i = 1; i <= 30; i++) {
        fire('pointermove', 20 + i * 5, 50 + Math.sin(i / 3) * 30, i * 30);
    }
    fire('pointerup', 170, 50, 940);
};

beforeEach(() => {
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
    now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);
    onScript = vi.fn();
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    act(() => root.render(<GhostRecorder onScript={onScript}>{() => <div />}</GhostRecorder>));
});

afterEach(() => {
    act(() => root.unmount());
    host.remove();
    vi.restoreAllMocks();
});

const record = () => {
    click(button('Aufnehmen'));
    drag();
    click(button('Stopp'));
};

describe('GhostRecorder', () => {
    it('starts ready and shows the pointer hint as plain text', () => {
        expect(host.textContent).toContain('Bereit');
        expect(host.textContent).toContain('Bedienung per Tastatur nicht möglich');
        expect(host.querySelector('pre')).toBeNull();
    });

    it('records a drag into a pan snippet', () => {
        click(button('Aufnehmen'));
        expect(host.textContent).toContain('Aufnahme läuft');
        drag();
        click(button('Stopp'));

        expect(host.querySelector('pre code')?.textContent).toContain('pan:');
        expect(host.querySelector('pre code')?.textContent).toContain("defineScript('pad'");
        expect(onScript).toHaveBeenCalled();
        expect(host.querySelector('[data-testid="recorder-preview"]')).not.toBeNull();
    });

    it('recomputes the point count when the tolerance changes', () => {
        record();
        const points = () => Number(host.querySelector('[data-testid="recorder-points"]')?.textContent?.split(' ')[0]);
        const slider = host.querySelector<HTMLInputElement>('input[type="range"]')!;
        const setTolerance = (value: string) =>
            act(() => {
                Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(slider, value);
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                slider.dispatchEvent(new Event('change', { bubbles: true }));
            });

        setTolerance('0.15');
        const coarse = points();
        setTolerance('0.005');
        const fine = points();
        expect(fine).toBeGreaterThan(coarse);
        expect(fine).toBeLessThanOrEqual(12);
    });

    it('copies the snippet to the clipboard and reports it in the button text', async () => {
        record();
        await act(async () => button('Kopieren').click());

        expect(writeText).toHaveBeenCalledWith(host.querySelector('pre code')?.textContent);
        expect(button('Kopiert')).toBeTruthy();
    });

    it('locks recording while the script plays', () => {
        record();
        click(button('Abspielen'));

        expect(button('Aufnehmen').disabled).toBe(true);
        expect(button('Abspielen').disabled).toBe(true);
    });

    it('records mouse moves and clicks as move and click steps', () => {
        act(() => root.render(<GhostRecorder key="mouse" device="mouse">{() => <div />}</GhostRecorder>));
        click(button('Aufnehmen'));
        for (let i = 0; i < 10; i++) fire('pointermove', 20 + i * 10, 40, i * 40);
        fire('click', 120, 40, 800);
        click(button('Stopp'));

        const code = host.querySelector('pre code')?.textContent ?? '';
        expect(code).toContain('move:');
        expect(code).toContain('click:');
    });

    it('has no live regions', () => {
        record();
        expect(host.querySelector('[aria-live], [role="status"], [role="alert"]')).toBeNull();
    });
});
