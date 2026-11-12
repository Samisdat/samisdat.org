import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlaybackControl, type Mark } from '../index';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let host: HTMLDivElement;

const base = {
    isPlaying: false,
    speed: 10,
    onPlay: () => {},
    onPause: () => {},
    onReset: () => {},
    onSpeedChange: () => {},
};

const marks: Mark[] = [{ at: 1, label: 'Click' }, { from: 2, to: 3, label: 'Pan' }, { at: 4 }];

const seekInput = () => host.querySelector<HTMLInputElement>('input[aria-label="Position in der Aufzeichnung"]')!;

beforeEach(() => {
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
});

afterEach(() => {
    act(() => root.unmount());
    host.remove();
});

describe('PlaybackControl', () => {
    it('renders the classic structure without device and timeline', () => {
        act(() => root.render(<PlaybackControl {...base} />));
        const container = host.firstElementChild!;

        expect(container.children).toHaveLength(2);
        expect(container.children[0].querySelectorAll('button')).toHaveLength(2);
        expect(container.children[1].querySelector('input[aria-label="Speed"]')).toBeTruthy();
        expect(seekInput()).toBeNull();
    });

    it('renders device, timecode, marks and hides speed on demand', () => {
        act(() =>
            root.render(
                <PlaybackControl
                    {...base}
                    speedControl={false}
                    notice="Takeover"
                    device={<svg data-testid="device" />}
                    timeline={{ position: 3.42, duration: 6, marks, onSeek: () => {} }}
                />
            )
        );

        expect(host.querySelector('[data-testid="device"]')).toBeTruthy();
        expect(host.textContent).toContain('00:03.42');
        expect(host.textContent).toContain('Takeover');
        expect(host.querySelector('input[aria-label="Speed"]')).toBeNull();
        expect(host.textContent).toContain('Click');
        expect(host.textContent).toContain('Pan');
        expect(host.querySelectorAll('[aria-hidden="true"] span[data-active]')).toHaveLength(2);
    });

    it('marks only the label around the position as active', () => {
        act(() =>
            root.render(
                <PlaybackControl
                    {...base}
                    timeline={{ position: 2.5, duration: 6, marks, onSeek: () => {} }}
                />
            )
        );
        const active = [...host.querySelectorAll('span[data-active="true"]')].map((n) => n.textContent);

        expect(active).toEqual(['Pan']);
    });

    it('exposes the timecode as aria-valuetext and calls onSeek', () => {
        const onSeek = vi.fn();
        act(() =>
            root.render(
                <PlaybackControl
                    {...base}
                    timeline={{ position: 3.42, duration: 6, marks, onSeek }}
                />
            )
        );
        const input = seekInput();

        expect(input.getAttribute('aria-valuetext')).toBe('00:03.42');
        expect(input.step).toBe('0.01');

        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
        act(() => {
            setter.call(input, '1.5');
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        expect(onSeek).toHaveBeenCalledWith(1.5);
    });
});
