import { css } from '@linaria/core';

const gelberTurmBaseCss = css`
    fill: #ffd101;
`;
const gelberTurmLightCss = css`
    fill: #d98c00;
`;
const gelberTurmDarkCss = css`
    fill: #9b690d;
`;

export const GelberTurm = () => (
    <g data-id="3700-turm">
        <path
            className={gelberTurmBaseCss}
            d="M1215.55,352.19c0,0 -2.174,-3.792 -2.213,-3.774l-0,-3.956c3.554,-1.66 7.842,-2.63 12.457,-2.63c5.094,0 9.791,1.183 13.543,3.17l-0,3.957c-0.235,0.328 -2.214,3.233 -2.214,3.233l1.979,70.976l-25.53,-0l1.978,-70.976Z"
        />
        <rect
            className={gelberTurmDarkCss}
            x="1219.56"
            y="366.825"
            width="3.063"
            height="1.978"
        />
        <rect
            className={gelberTurmLightCss}
            x="1219.56"
            y="368.804"
            width="3.063"
            height="8.401"
        />
        <path
            className={gelberTurmLightCss}
            d="M1213.33,348.43c3.548,-1.649 7.182,-2.551 12.457,-2.643c6.532,-0.113 13.543,3.184 13.543,3.184l-2.227,3.246c0,0 -5.77,-1.884 -11.268,-1.846c-5.197,0.035 -10.292,1.819 -10.292,1.819l-2.213,-3.76Z"
        />
    </g>
);
