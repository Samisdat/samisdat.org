import { css } from '@linaria/core';

const greenTowerBaseCss = css`
    fill: #a0b491;
`;

const greenTowerWindowCss = css`
    fill: #536d46;
`;

const greenTowerDarkCss = css`
    fill: #536d46;
`;

export const GreenTower = () => (
    <g data-id="3900-green-tower">
        <path
            className={greenTowerDarkCss}
            d="M698.275,331.6l-7.839,-8.427l-2.716,2.08l-21.43,-0.215l-2.571,-1.645l-6.68,5.664l1.917,2.635l36.798,0.998l2.521,-1.09Z"
        />
        <path
            className={greenTowerBaseCss}
            d="M696.743,331.503l-6.455,-6.854l-2.053,1.528l-22.292,-0.157l-2.125,-1.369l-5.631,4.535l1.493,2.011l1.806,-0.137l-9.211,127.648l44.217,-0l-2.963,-125.906l1.403,-0.138l1.811,-1.161Z"
        />
        <path
            className={greenTowerDarkCss}
            d="M663.719,334.354l-1.399,-0l-9.052,124.354l1.453,-0l8.998,-124.354Zm12.641,-0.006l2.056,0.008l-2.158,124.352l-1.749,-0l1.851,-124.36Zm16.209,0.006l-1.128,-0l2.874,124.354l1.181,-0l-2.927,-124.354Z"
        />
        <path
            className={greenTowerWindowCss}
            d="M670.899,334.844l2.055,0.008l-0.668,19.09l-1.749,-0l0.362,-19.098Zm9.93,0l2.056,0.008l0.325,19.09l-1.75,-0l-0.631,-19.098Zm5.462,0l2.055,0.008l0.822,19.09l-1.75,-0l-1.127,-19.098Zm-20.358,0l2.056,0.008l-1.165,19.09l-1.749,-0l0.858,-19.098Z"
        />
    </g>
);
