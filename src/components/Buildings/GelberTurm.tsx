import { css } from '@linaria/core';

const gelberTurmBaseCss =css`
    fill: #ffd101;
`;
const gelberTurmLightCss =css`
    fill: #d98c00;
`;
const gelberTurmDarkCss =css`
    fill: #9b690d;
`;

export const GelberTurm = () => (
    <g id="_3700-turm" data-id="3700-turm">
        <path
            className={gelberTurmBaseCss}
            d="M1220.5,328.399c0,-0 -2.174,-3.792 -2.213,-3.774l-0,-3.957c3.554,-1.66 7.842,-2.63 12.457,-2.63c5.094,0 9.791,1.183 13.543,3.17l-0,3.957c-0.234,0.328 -2.214,3.234 -2.214,3.234l1.979,70.975l-25.53,0l1.978,-70.975Z"
        />
        <rect
            className={gelberTurmDarkCss}
            x="1224.51"
            y="343.034"
            width="3.063"
            height="1.978"
        />
        <rect
            className={gelberTurmLightCss}
            x="1224.51"
            y="345.012"
            width="3.063"
            height="8.401"
        />
        <path
            className={gelberTurmLightCss}
            d="M1218.29,324.639c3.548,-1.65 7.182,-2.552 12.457,-2.644c6.532,-0.113 13.543,3.185 13.543,3.185l-2.227,3.246c0,-0 -5.77,-1.885 -11.268,-1.847c-5.197,0.036 -10.292,1.82 -10.292,1.82l-2.213,-3.76Z"
        />
    </g>

)