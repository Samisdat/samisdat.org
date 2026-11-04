import { styled } from '@linaria/react';

import { QrCode } from './QrCode';

const ScanStyling = styled.div`
    position: absolute;
    right: 6cqw;
    bottom: 4.5cqw;
    display: flex;
    align-items: flex-end;
    gap: 2.4cqw;

    span {
        font-size: 3.6cqw;
        font-weight: 700;
        line-height: 1.05;
        text-align: right;
        text-transform: uppercase;
        color: var(--color-text-default);
    }

    svg {
        display: block;
        width: 20cqw;
        height: 20cqw;
        max-width: 100%;
        padding: 1.2cqw;
        background: #fffcf7;
        box-shadow: 0 0 0 0.3cqw var(--color-border-muted);
    }

    /* Scanners need dark modules on a light plate in both themes, so these do not follow the tokens */
    path {
        fill: #1e142e;
    }
`;

interface ScanProps {
    domain: string;
}

export const Scan = ({ domain }: ScanProps) => (
    <ScanStyling>
        <span>
            Scan
            <br />
            zum Blog
        </span>
        <QrCode
            url={`https://${domain}`}
            label={`QR-Code für ${domain}`}
        />
    </ScanStyling>
);
