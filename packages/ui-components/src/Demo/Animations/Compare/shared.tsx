import { styled } from '@linaria/react';
import { panoramaCssVars } from '@samisdat/wtal-panorama/colors';

export * from './config';

export const SvgStyling = styled.svg`
    max-width: 450px;
    width: 100%;
    fill-rule: evenodd;
    clip-rule: evenodd;
    stroke-linejoin: round;
    stroke-miterlimit: 1;
    display: block;

    & circle {
        fill-rule: nonzero;
        stroke: ${panoramaCssVars['aubergine']};
        stroke-width: 0.5px;
    }
`;
