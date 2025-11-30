import { css } from '@linaria/core';
import { FC } from 'react';

const alterMarktCss = css`
    fill: #5b5b5e;
`;

interface AlterMarktProps {
    beforeTrack?: boolean;
}

export const AlterMarkt: FC<AlterMarktProps> = ({ beforeTrack = false }) => {
    if (beforeTrack) {
        return (
            <g data-id="2600-bridge">
                <path
                    className={alterMarktCss}
                    d="M1398.65,244.339l-3.764,-0.152l-13.648,121.413l7.134,1.849l10.278,-123.11Z"
                />
                <path
                    className={alterMarktCss}
                    d="M1394.05,293.255l-50.755,-11.589l-1.306,8.286l50.755,11.589l1.306,-8.286Z"
                />
            </g>
        );
    }
    return (
        <path
            data-id="1400"
            className={alterMarktCss}
            d="M1331.52,345.768l7.384,0l8.746,-109.854l-3.764,-0.152l-12.366,110.006Z"
        />
    );
};
