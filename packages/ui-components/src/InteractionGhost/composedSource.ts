import type { Norm, NormListener, NormSource } from '@samisdat/tools';

/** Duration of the scene blend from the last ghost norm to the real pointer. */
export const TAKEOVER_BLEND_MS = 250;
/** Duration of the scene blend from the real pointer back to the recording. */
export const RESUME_BLEND_MS = 500;

type Mode = 'ghost' | 'blend' | 'handback' | 'pointer';

export type ComposedSource = {
    source: NormSource;
    mode: () => Mode;
    /** Ghost drives the source; pointer norms are only remembered. */
    engage: () => void;
    /** Pointer drives the source again (no-op while blending). */
    release: () => void;
    pushGhost: (norm: Norm) => void;
    pushPointer: (norm: Norm) => void;
    /** Ghost -> pointer. Blends over `blendMs` (0 = jump). False if the ghost was not driving. */
    takeover: (blendMs?: number) => boolean;
    /** Pointer -> ghost. Blends over `blendMs` from the last emitted norm to the (moving) ghost norm. */
    resume: (blendMs?: number) => void;
    /** Back to the initial pointer mode, cancels a running blend. */
    reset: () => void;
    destroy: () => void;
};

const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
export const blendNorm = (from: Norm, to: Norm, k: number): Norm => {
    const e = ease(Math.min(1, Math.max(0, k)));
    return { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
};

/** NormSource that is driven by the ghost until `takeover()`, then by the real pointer. */
export const createComposedSource = (): ComposedSource => {
    const listeners = new Set<NormListener>();
    let mode: Mode = 'pointer';
    let lastEmitted: Norm = { x: 0, y: 0 };
    let lastPointer: Norm | null = null;
    let lastGhost: Norm | null = null;
    let raf = 0;

    const emit = (norm: Norm) => {
        lastEmitted = norm;
        listeners.forEach((listener) => listener(norm));
    };

    const cancelBlend = () => {
        cancelAnimationFrame(raf);
        raf = 0;
    };

    const finish = () => {
        cancelBlend();
        mode = 'pointer';
        if (lastPointer) emit(lastPointer);
    };

    /** Eases from the last emitted norm to a (moving) target; `done` runs once it arrived. */
    const animate = (blendMs: number, next: Mode, target: () => Norm | null, done: () => void) => {
        const from = lastEmitted;
        let startedAt: number | undefined;
        mode = next;

        const tick = (now: number) => {
            startedAt ??= now;
            const k = (now - startedAt) / blendMs;
            if (k >= 1) {
                cancelBlend();
                done();
                return;
            }
            // target is read every frame: pointer / ghost keep moving while we blend
            emit(blendNorm(from, target() ?? from, k));
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
    };

    const startBlend = (blendMs: number) => animate(blendMs, 'blend', () => lastPointer, finish);
    const startHandback = (blendMs: number) =>
        animate(
            blendMs,
            'handback',
            () => lastGhost,
            () => {
                mode = 'ghost';
                if (lastGhost) emit(lastGhost);
            }
        );

    return {
        source: {
            subscribe: (listener) => {
                listeners.add(listener);
                return () => listeners.delete(listener);
            },
        },
        mode: () => mode,
        engage: () => {
            if (mode === 'handback') return;
            cancelBlend();
            mode = 'ghost';
        },
        release: () => {
            if (mode === 'handback') cancelBlend();
            if (mode === 'ghost' || mode === 'handback') mode = 'pointer';
        },
        pushGhost: (norm) => {
            lastGhost = norm;
            if (mode === 'ghost') emit(norm);
        },
        pushPointer: (norm) => {
            lastPointer = norm;
            if (mode === 'pointer') emit(norm);
        },
        takeover: (blendMs = TAKEOVER_BLEND_MS) => {
            if (mode !== 'ghost' && mode !== 'handback') return false;
            cancelBlend();
            if (blendMs <= 0) finish();
            else startBlend(blendMs);
            return true;
        },
        resume: (blendMs = RESUME_BLEND_MS) => {
            if (mode !== 'pointer' && mode !== 'blend') return;
            cancelBlend();
            if (blendMs <= 0) {
                mode = 'ghost';
                if (lastGhost) emit(lastGhost);
            } else {
                startHandback(blendMs);
            }
        },
        reset: () => {
            cancelBlend();
            mode = 'pointer';
        },
        destroy: () => {
            cancelBlend();
            listeners.clear();
        },
    };
};
