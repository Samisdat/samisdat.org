import { styled } from '@linaria/react';

import { QrCode } from './QrCode';
import { Banner, Inner } from './Shared';

export interface CardData {
    /** Display name of the blog author. */
    name: string;
    /** Bare domain, e.g. `joshwcomeau.com`. */
    domain: string;
    /** Serial number within the series, e.g. `01`. */
    no: string;
    /** Size of the series. */
    total: number;
    /** URL of the homepage screenshot. */
    shot: string;
    /** CSS color used as accent for this card. */
    hue: string;
    /** Topics the blog covers. */
    themen: string[];
    sprache: string;
    nat: string;
    rolle: string;
    wohnort: string;
    format: string;
    /** What the blog is built with. A `?` in any fact marks it as unverified. */
    stack: string;
}

const Backdrop = styled.div`
    position: absolute;
    inset: 0;
    background:
        radial-gradient(
            120% 70% at 50% 25%,
            color-mix(in oklab, var(--hue) 30%, var(--color-surface-subtle)),
            transparent 70%
        ),
        var(--color-surface-emphasis);
`;

const Chrome = styled.div`
    position: absolute;
    left: 7cqw;
    right: 7cqw;
    top: 7cqw;
    height: 50cqw;
    display: grid;
    grid-template-rows: 5.5cqw 1fr;
    border-radius: 2cqw;
    background: var(--color-surface-raised);
    overflow: hidden;
    box-shadow: 0 2cqw 5cqw var(--color-surface-emphasis);

    img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0;
        object-fit: cover;
        object-position: top center;
    }
`;

const ChromeBar = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    padding-inline: 2.4cqw;
    background: var(--color-surface-subtle);

    i {
        width: 1.8cqw;
        height: 1.8cqw;
        border-radius: 50%;
        background: var(--color-surface-muted);
    }

    span {
        margin-left: 2cqw;
        font-size: 2.6cqw;
        color: var(--color-text-secondary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const NameBanner = styled(Banner)`
    position: absolute;
    left: 5%;
    right: 5%;
    bottom: 52cqw;

    > span {
        padding: 2.6cqw 6cqw 2.2cqw;
        font-size: 8.6cqw;
        font-weight: 800;
        line-height: 1;
        letter-spacing: 0.01em;
    }
`;

const DomainBanner = styled(Banner)`
    --notch: 3cqw;

    position: absolute;

    left: 17%;
    right: 17%;
    bottom: 43.5cqw;

    > span {
        padding: 1.8cqw 4cqw 1.5cqw;
        font-size: 5cqw;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0.04em;
        text-transform: none;
    }
`;

const Shield = styled.div`
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
        fill: var(--color-surface-raised);
        stroke: var(--color-border-default);
        stroke-width: 3;
        stroke-linejoin: round;
    }

    > div {
        position: relative;
        display: grid;
        align-content: center;
        justify-items: center;
        height: 100%;
        padding-bottom: 12%;
        line-height: 1;
        text-align: center;
        color: var(--color-text-emphasis);
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

const SHIELD_PATH =
    'M50 3C62 8 80 11 94 12Q98 12.5 97.5 17L96 60C95 78 80 94 54 116Q50 119 46 116C20 94 5 78 4 60L2.5 17Q2 12.5 6 12C20 11 38 8 50 3Z';

const Scan = styled.div`
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
        background: var(--color-text-emphasis);
    }

    path {
        fill: var(--color-surface-emphasis);
    }
`;

type FrontContentProps = Pick<CardData, 'name' | 'domain' | 'no' | 'total' | 'shot' | 'hue'>;

export const FrontContent = ({
    name,
    domain,
    no,
    total,
    shot,
    hue,
}: FrontContentProps) => (
    <Inner style={{ ['--hue' as string]: hue }}>
        <Backdrop aria-hidden="true" />
        <Chrome>
            <ChromeBar aria-hidden="true">
                <i />
                <i />
                <i />
                <span>{domain}</span>
            </ChromeBar>
            {/* oxlint-disable-next-line next/no-img-element -- ui-components is framework-agnostic; the shot is a small static file */}
            <img
                src={shot}
                alt={`Startseite von ${domain}`}
            />
        </Chrome>
        <NameBanner>
            <span>{name}</span>
        </NameBanner>
        <DomainBanner>
            <span>{domain}</span>
        </DomainBanner>
        <Shield>
            <svg
                viewBox="0 0 100 120"
                aria-hidden="true"
            >
                <path d={SHIELD_PATH} />
            </svg>
            <div>
                <small>Nr.</small>
                <b>{no}</b>
                <span>/ {total}</span>
            </div>
        </Shield>
        <Scan>
            <span>
                Scan
                <br />
                zum Blog
            </span>
            <QrCode
                url={`https://${domain}`}
                label={`QR-Code für ${domain}`}
            />
        </Scan>
    </Inner>
);
