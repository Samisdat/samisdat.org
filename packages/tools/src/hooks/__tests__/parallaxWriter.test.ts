import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createParallaxWriter } from '../parallaxWriter';

const setup = () => {
    const props: Record<string, string> = {};
    const writes = vi.fn((name: string, value: string) => {
        props[name] = value;
    });
    const el = {
        style: { setProperty: writes },
        getBoundingClientRect: () => ({ y: -50, height: 200 }),
    } as unknown as HTMLElement;

    return { el, props, writes };
};

describe('createParallaxWriter', () => {
    let queue: (() => void)[];
    const runFrame = () => queue.splice(0).forEach(callback => callback());

    beforeEach(() => {
        queue = [];
        vi.stubGlobal('requestAnimationFrame', (callback: () => void) => queue.push(callback));
        vi.stubGlobal('cancelAnimationFrame', () => queue.splice(0));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('writes the start value once and then stays idle', () => {
        const { el, props, writes } = setup();
        createParallaxWriter(el, { scroll: false, reduceMotion: false });

        runFrame();
        expect(props).toEqual({ '--parallax-x': '0', '--parallax-y': '0' });
        expect(queue).toHaveLength(0);

        writes.mockClear();
        runFrame();
        expect(writes).not.toHaveBeenCalled();
    });

    it('writes several changes within a frame once, and ignores an unchanged position', () => {
        const { el, props, writes } = setup();
        const writer = createParallaxWriter(el, { scroll: false, reduceMotion: false });
        runFrame();
        writes.mockClear();

        writer.set(0, 0);
        expect(queue).toHaveLength(0);

        writer.set(0.2, 0.1);
        writer.set(0.5, -0.5);
        expect(queue).toHaveLength(1);
        runFrame();
        expect(props).toMatchObject({ '--parallax-x': '0.5', '--parallax-y': '-0.5' });
        expect(writes).toHaveBeenCalledTimes(2);
    });

    it('writes --scroll only in scroll mode and only after a refresh', () => {
        const { el, props, writes } = setup();
        const writer = createParallaxWriter(el, { scroll: true, reduceMotion: false });
        runFrame();
        expect(props['--scroll']).toBe('0.25');

        writes.mockClear();
        expect(queue).toHaveLength(0);
        writer.refresh();
        runFrame();
        expect(writes).toHaveBeenCalled();

        const still = setup();
        createParallaxWriter(still.el, { scroll: false, reduceMotion: false });
        runFrame();
        expect(still.props['--scroll']).toBeUndefined();
    });

    it('holds --scroll at 0 for reduced motion', () => {
        const { el, props } = setup();
        createParallaxWriter(el, { scroll: true, reduceMotion: true });
        runFrame();
        expect(props['--scroll']).toBe('0');
    });

    it('cancels a pending frame on dispose', () => {
        const { el, writes } = setup();
        const writer = createParallaxWriter(el, { scroll: false, reduceMotion: false });
        writer.dispose();
        runFrame();
        expect(writes).not.toHaveBeenCalled();
    });
});
