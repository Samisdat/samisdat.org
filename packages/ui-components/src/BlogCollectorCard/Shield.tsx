import { styled } from '@linaria/react';

import { metal } from './Metal';

const SHIELD_PATH =
    'M50 3C62 8 80 11 94 12Q98 12.5 97.5 17L96 60C95 78 80 94 54 116Q50 119 46 116C20 94 5 78 4 60L2.5 17Q2 12.5 6 12C20 11 38 8 50 3Z';

// Masks (not clip-path: url(#id)) cut the metal to the outline: references into an inline <svg> are
// unreliable for HTML elements inside a 3D-transformed context.
const SHIELD_MASK = `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" preserveAspectRatio="none"><path d="${SHIELD_PATH}"/></svg>`
)}") center / 100% 100% no-repeat`;

const ShieldStyling = styled.div`
    position: absolute;
    left: 8cqw;
    bottom: 3.5cqw;
    width: 20cqw;
    aspect-ratio: 5 / 6;

    svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        fill: none;
        stroke: var(--color-border-default);
        stroke-width: 3;
        stroke-linejoin: round;
    }

    /* Metal fill, cut to the shield outline */
    .fill {
        --shift: -20%;

        position: absolute;
        inset: 0;
        mask: ${SHIELD_MASK};
        -webkit-mask: ${SHIELD_MASK};
    }

    /* Out of flow: in flow its height would stretch the shield past its 5:6 aspect ratio */
    .label {
        position: absolute;
        inset: 0;
        display: grid;
        align-content: center;
        justify-items: center;
        padding-bottom: 12%;
        line-height: 1;
        text-align: center;
        color: var(--color-text-emphasis);
        text-shadow: 0 0.3cqw 0.6cqw color-mix(in oklab, var(--color-surface-emphasis) 80%, transparent);
    }

    small {
        font-size: 3cqw;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    b {
        font-size: 8.5cqw;
        font-weight: 800;
    }

    span {
        font-size: 3.8cqw;
        font-weight: 700;
    }
`;

interface ShieldProps {
    no: string;
    total: number;
}

export const Shield = ({ no, total }: ShieldProps) => (
    <ShieldStyling>
        <div
            className={`fill ${metal}`}
            aria-hidden="true"
        />
        <svg
            viewBox="0 0 100 120"
            aria-hidden="true"
        >
            <path d={SHIELD_PATH} />
        </svg>
        <div className="label">
            <small>Nr.</small>
            <b>{no}</b>
            <span>/ {total}</span>
        </div>
    </ShieldStyling>
);
