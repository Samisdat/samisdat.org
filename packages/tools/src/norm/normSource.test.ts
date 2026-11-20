import { describe, expect, it, vi } from 'vitest';

import { pointerSource, pointerToNorm } from './normSource';

const rect = { left: 100, top: 50, width: 200, height: 100 };

describe('pointerToNorm', () => {
    it('maps centre to 0 and corners to -1/1', () => {
        expect(pointerToNorm(200, 100, rect)).toEqual({ x: 0, y: 0 });
        expect(pointerToNorm(100, 50, rect)).toEqual({ x: -1, y: -1 });
        expect(pointerToNorm(300, 150, rect)).toEqual({ x: 1, y: 1 });
    });

    it('clamps outside the rect', () => {
        expect(pointerToNorm(-500, 900, rect)).toEqual({ x: -1, y: 1 });
    });

    it('returns null for a zero-sized rect', () => {
        expect(pointerToNorm(0, 0, { ...rect, width: 0 })).toBeNull();
    });
});

describe('pointerSource', () => {
    const setup = () => {
        const target = new EventTarget();
        const element = Object.assign(target, { getBoundingClientRect: () => rect }) as unknown as HTMLElement;
        const fire = (type: string, clientX: number, clientY: number) =>
            target.dispatchEvent(Object.assign(new Event(type), { clientX, clientY }));
        return { element, fire };
    };

    it('notifies on pointermove and pointerdown', () => {
        const { element, fire } = setup();
        const listener = vi.fn();
        pointerSource(element).subscribe(listener);

        fire('pointermove', 250, 75);
        fire('pointerdown', 100, 150);

        expect(listener).toHaveBeenNthCalledWith(1, { x: 0.5, y: -0.5 });
        expect(listener).toHaveBeenNthCalledWith(2, { x: -1, y: 1 });
    });

    it('stops notifying after unsubscribe', () => {
        const { element, fire } = setup();
        const listener = vi.fn();
        const unsubscribe = pointerSource(element).subscribe(listener);

        unsubscribe();
        fire('pointermove', 200, 100);

        expect(listener).not.toHaveBeenCalled();
    });
});
