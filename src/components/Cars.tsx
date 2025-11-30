import { css } from '@linaria/core';

const duration = '80s';
const start = 100;
const stop = 1400;

const carCss = css`
    fill: #00afeb;
    stroke: #000051;
    stroke-width: 3;
    width: 81px;
    height: 11px;
`;

export const Cars = () => (
    <>
        <rect
            className={carCss}
            x={start}
            y={'309'}
        >
            <animate
                attributeName="x"
                values={`${start};${stop};${start}`}
                dur={duration}
                repeatCount="indefinite"
            />
        </rect>
        <rect
            className={carCss}
            x={1330}
            y={'309'}
        >
            <animate
                attributeName="x"
                values={`${stop};${start};${stop}`}
                dur={duration}
                repeatCount="indefinite"
            />
        </rect>
    </>
);
