import { css } from '@linaria/core';

import { light } from './light';

/**
 * Brushed-metal surface with a holographic and a specular layer.
 *
 * Driven by `--progress` (flip, set on the card) and `--parallax-x/y` (tilt, set on the wrapper), so the
 * sheen travels with both. The host must be positioned; `--shift` offsets the sheen per surface so
 * neighbouring parts do not shine in lockstep.
 *
 * The gradients cover the element exactly and only their colour stops move (no tiled, shifted background),
 * so there are no tile edges where a band could tear. `--c` is the band centre along the gradient line
 * (flip + sideways tilt), `--a` its angle (tilt forwards/backwards).
 *
 * Dark: sheen is added (colour-dodge, screen). Light: dodge would burn out on a bright base, so the
 * holo multiplies and the shine is a plain bright band on silver.
 */
export const metal = css`
    isolation: isolate;
    background:
        repeating-linear-gradient(
            90deg,
            transparent 0 2px,
            color-mix(in oklab, var(--color-surface-emphasis) 10%, transparent) 2px 3px
        ),
        linear-gradient(
            115deg,
            var(--color-surface-raised) 0%,
            var(--color-surface-muted) 25%,
            var(--color-surface-subtle) 45%,
            var(--color-surface-muted) 65%,
            var(--color-surface-raised) 100%
        );

    &::before,
    &::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        --c: calc(120% - var(--progress) * 240% - var(--parallax-x) * 60% - var(--shift, 0%) * 1.5);
        --a: calc(105deg + var(--parallax-y) * 25deg);
    }

    &::before {
        --h: calc(var(--c) - 22%);

        background-image: linear-gradient(
            var(--a),
            transparent calc(var(--h) - 69%),
            var(--color-ink-turquoise) calc(var(--h) - 33%),
            var(--color-ink-amethyst) calc(var(--h) - 12%),
            var(--color-ink-rose) calc(var(--h) + 9%),
            var(--color-ink-gold) calc(var(--h) + 30%),
            transparent calc(var(--h) + 69%)
        );
        mix-blend-mode: color-dodge;
        opacity: 0.22;
    }

    &::after {
        background-image: linear-gradient(
            var(--a),
            transparent calc(var(--c) - 30%),
            color-mix(in oklab, var(--color-text-emphasis) 38%, transparent) var(--c),
            transparent calc(var(--c) + 30%)
        );
        mix-blend-mode: screen;
    }

    ${light(`
        background:
            repeating-linear-gradient(
                90deg,
                transparent 0 2px,
                color-mix(in oklab, var(--color-text-emphasis) 7%, transparent) 2px 3px
            ),
            linear-gradient(
                115deg,
                var(--color-surface-emphasis) 0%,
                var(--color-surface-muted) 28%,
                var(--color-surface-emphasis) 48%,
                var(--color-surface-subtle) 68%,
                var(--color-surface-emphasis) 100%
            );
    `)}

    ${light(`
        &::before {
            mix-blend-mode: multiply;
            opacity: 0.3;
        }
    `)}

    ${light(`
        &::after {
            mix-blend-mode: normal;
            opacity: 0.9;
            background-image: linear-gradient(
                var(--a),
                transparent calc(var(--c) - 18%),
                var(--color-surface-emphasis) var(--c),
                transparent calc(var(--c) + 18%)
            );
        }
    `)}
`;
