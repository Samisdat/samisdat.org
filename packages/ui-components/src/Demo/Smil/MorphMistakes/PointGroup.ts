import { styled } from '@linaria/react';

export const PointGroup = styled.g`
    & circle {
        fill: currentColor;
        stroke: white;
        stroke-width: 0;
    }

    & text {
        fill: white;
        font-size: 14px;
        font-weight: 800;
        text-anchor: middle;
        dominant-baseline: central;
        pointer-events: none;
    }
`;
