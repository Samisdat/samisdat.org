import qrcode from 'qrcode-generator';
import { useMemo } from 'react';

const MARGIN = 1;

interface QrCodeProps {
    url: string;
    label: string;
}

export const QrCode = ({ url, label }: QrCodeProps) => {
    const { path, size } = useMemo(() => {
        const code = qrcode(0, 'M');
        code.addData(url);
        code.make();

        const count = code.getModuleCount();
        let d = '';

        for (let y = 0; y < count; y++) {
            for (let x = 0; x < count; x++) {
                if (code.isDark(y, x)) {
                    d += `M${x + MARGIN} ${y + MARGIN}h1v1h-1z`;
                }
            }
        }

        return { path: d, size: count + 2 * MARGIN };
    }, [url]);

    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- an inline <svg> cannot be an <img>; role="img" gives it one accessible name
            role="img"
            aria-label={label}
            shapeRendering="crispEdges"
        >
            <path d={path} />
        </svg>
    );
};
