import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DemoAnimation } from '../index';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let callback: Callback;

class MockObserver {
    constructor(cb: Callback) {
        callback = cb;
    }
    observe() {}
    disconnect() {}
}

let root: Root;
let host: HTMLDivElement;
const onPlay = vi.fn();
const onPause = vi.fn();

const render = (isPlaying: boolean, playOnce?: boolean) =>
    act(() =>
        root.render(
            <DemoAnimation
                playOnce={playOnce}
                playbackControl={{ isPlaying, speed: 1, onPlay, onPause, onReset: vi.fn(), onSpeedChange: vi.fn() }}
            >
                demo
            </DemoAnimation>
        )
    );
const visible = (isIntersecting: boolean) => act(() => callback([{ isIntersecting }]));

beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockObserver);
    vi.stubGlobal('matchMedia', () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
    }));
    onPlay.mockClear();
    onPause.mockClear();
    host = document.createElement('div');
    root = createRoot(host);
});

afterEach(() => {
    act(() => root.unmount());
    vi.unstubAllGlobals();
});

describe('DemoAnimation playOnce', () => {
    it('starts on first visibility, pauses on leaving, does not start again', () => {
        render(false, true);
        visible(true);
        expect(onPlay).toHaveBeenCalledTimes(1);

        render(true, true);
        visible(false);
        expect(onPause).toHaveBeenCalledTimes(1);

        render(false, true);
        visible(true);
        expect(onPlay).toHaveBeenCalledTimes(1);
    });

    it('without playOnce starts again on every visibility', () => {
        render(false);
        visible(true);
        render(true);
        visible(false);
        render(false);
        visible(true);
        expect(onPlay).toHaveBeenCalledTimes(2);
        expect(onPause).toHaveBeenCalledTimes(1);
    });
});

describe('DemoAnimation reduced motion', () => {
    it('does not autoplay', () => {
        vi.stubGlobal('matchMedia', () => ({
            matches: true,
            addEventListener: () => {},
            removeEventListener: () => {},
            addListener: () => {},
            removeListener: () => {},
        }));
        const spy = vi.fn(MockObserver);
        vi.stubGlobal('IntersectionObserver', spy);
        render(false, true);
        expect(spy).not.toHaveBeenCalled();
        expect(host.textContent).toContain('Reduced motion');
    });
});
