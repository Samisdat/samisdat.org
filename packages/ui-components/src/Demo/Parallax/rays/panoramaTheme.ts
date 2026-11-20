import { css } from '@linaria/core';

/**
 * Panorama variant: day sky, hills, house and map in the colours of the panorama in the page header.
 * The values are the panorama tokens, with their value as fallback where the panorama css is not loaded.
 * `&&` lifts the specificity above the default colours of the demo.
 */
export const panoramaTheme = css`
    --p-sky-top: #0376bf;
    --p-sky-low: #a8d0f5;
    --p-hill-far: var(--panorama-warm-olive, oklch(0.38 0.12 115));
    --p-hill-near: var(--panorama-forest-hill, oklch(0.4 0.08 140));
    --p-ground: var(--panorama-dark-moss, oklch(0.22 0.06 120));
    --p-wall: var(--panorama-apricot, oklch(0.8 0.1 55));
    --p-roof: var(--panorama-brick-red, oklch(0.38 0.12 30));
    --p-accent: var(--panorama-fire-red, oklch(0.65 0.23 35));
    --p-crown: var(--panorama-spring-green, oklch(0.5 0.12 155));
    --p-trunk: var(--panorama-copper-brown, oklch(0.54 0.1 50));
    --p-map: var(--panorama-moss-green-light, oklch(0.62 0.06 135));
    --p-line: var(--panorama-dark-moss, oklch(0.22 0.06 120));
    --p-rail: var(--panorama-slate-gray, oklch(0.45 0.01 270));
    --p-eye: var(--panorama-sunflower-yellow, oklch(0.78 0.2 90));
    --p-tree-ray: var(--panorama-emerald-dark, oklch(0.3 0.15 160));
    --p-hill-ray: var(--panorama-dark-ochre, oklch(0.5 0.14 75));

    /* window view */
    && .sky {
        fill: var(--sky-fill);
    }
    && .sky-top {
        stop-color: var(--p-sky-top);
    }
    && .sky-low {
        stop-color: var(--p-sky-low);
    }
    && .ground {
        fill: var(--p-ground);
    }
    && .horizon {
        stroke: none;
    }
    && .ridge.far {
        fill: var(--p-hill-far);
        fill-opacity: 1;
    }
    && .ridge.near {
        fill: var(--p-hill-near);
        fill-opacity: 1;
    }
    && .crown {
        fill: var(--p-crown);
    }
    && .trunk {
        fill: var(--p-trunk);
    }
    && .wall {
        fill: var(--p-wall);
    }
    && .roof {
        fill: var(--p-accent);
    }
    && .opening {
        fill: var(--p-roof);
    }

    /* map */
    && .map-bg {
        fill: var(--p-map);
    }
    && .cone {
        fill: var(--p-sky-low);
        fill-opacity: 0.4;
        stroke: var(--p-sky-top);
        stroke-opacity: 0.8;
    }
    && .contour {
        stroke: var(--p-line);
        stroke-opacity: 0.45;
    }
    && .contour.index {
        stroke-opacity: 0.85;
    }
    && .rail line {
        stroke: var(--p-rail);
    }
    && .train rect {
        fill: var(--p-accent);
    }
    && .train circle {
        fill: var(--p-eye);
    }
    && .k-tree .wedge,
    && .k-tree .tree-mark circle {
        fill: var(--p-tree-ray);
    }
    && .k-tree .ray {
        stroke: var(--p-tree-ray);
    }
    && .k-house .wedge,
    && .house-mark rect {
        fill: var(--p-roof);
    }
    && .k-house .ray,
    && .house-mark line {
        stroke: var(--p-roof);
    }
    && .k-hill .wedge,
    && .hill-mark {
        fill: var(--p-hill-ray);
    }
    && .k-hill .ray {
        stroke: var(--p-hill-ray);
    }
`;
