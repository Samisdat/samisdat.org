import { styled } from '@linaria/react';

import { light } from './light';
import { metal } from './Metal';
import { Scan } from './Scan';
import { Banner, Inner } from './Shared';
import { Shield } from './Shield';

export interface CardData {
    /** Display name of the blog author. */
    name: string;
    /** Bare domain, e.g. `joshwcomeau.com`. */
    domain: string;
    /** Serial number within the series, e.g. `01`. */
    no: string;
    /** Size of the series. */
    total: number;
    /** URL of the homepage screenshot (the dark one when `shotLight` is given). */
    shot: string;
    /** Screenshot of the site in its light theme, shown instead of `shot` in the light theme. */
    shotLight?: string;
    /** CSS color used as accent for this card. */
    hue: string;
    /** Topics the blog covers. */
    themen: string[];
    /** Label/value rows of the facts table, in display order. */
    facts: [label: string, value: string][];
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

    /* Light cone behind the screenshot */
    &::after {
        content: '';
        position: absolute;
        left: -10%;
        right: -10%;
        top: -5%;
        height: 75%;
        background: radial-gradient(closest-side, color-mix(in oklab, var(--hue) 35%, transparent), transparent);
    }

    ${light(`
        background:
            radial-gradient(
                120% 70% at 50% 25%,
                color-mix(in oklab, var(--hue) 18%, var(--color-surface-raised)),
                transparent 70%
            ),
            var(--color-surface-emphasis);

        &::after {
            background: radial-gradient(closest-side, color-mix(in oklab, var(--hue) 22%, transparent), transparent);
        }
    `)}
`;

const Chrome = styled.div`
    position: absolute;
    left: 5cqw;
    right: 5cqw;
    top: 5.5cqw;
    height: 53cqw;
    display: grid;
    grid-template-rows: 5.5cqw minmax(0, 1fr);
    padding: 1.5cqw;
    border-radius: 2.8cqw;
    background: var(--color-surface-raised);
    overflow: hidden;
    /* Ring like the card edge, then a drop shadow that lifts the screenshot off the card */
    box-shadow:
        0 0 0 0.5cqw var(--color-border-default),
        0 1.6cqw 2cqw rgb(15 5 29 / 0.45);

    img {
        display: block;
        width: 100%;
        height: 100%;
        min-height: 0;
        border-radius: 0 0 1.4cqw 1.4cqw;
        background: var(--color-surface-emphasis);
        box-shadow: 0 0 0 0.3cqw var(--color-surface-raised);
        object-fit: cover;
        object-position: top center;
    }

    ${light(`
        box-shadow:
            0 0 0 0.5cqw var(--color-border-default),
            0 1.6cqw 2cqw rgb(30 20 46 / 0.35);
    `)}

    /* With a light screenshot both images are rendered and the theme picks one */
    img[data-theme-shot='light'] {
        display: none;
    }

    ${light(`
        img[data-theme-shot='dark'] {
            display: none;
        }

        img[data-theme-shot='light'] {
            display: block;
        }
    `)}
`;

const ChromeBar = styled.div`
    display: flex;
    align-items: center;
    gap: 1.2cqw;
    padding-inline: 2.4cqw;
    border-radius: 1.4cqw 1.4cqw 0 0;
    background: var(--hue);

    i {
        width: 1.8cqw;
        height: 1.8cqw;
        border-radius: 50%;
        background: color-mix(in oklab, var(--color-surface-default) 75%, transparent);
    }

    span {
        margin-left: 2cqw;
        font-size: 2.6cqw;
        font-weight: 700;
        color: var(--color-surface-default);
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
        --shift: -8%;

        padding: 1.8cqw 4cqw 1.5cqw;
        font-size: 5cqw;
        font-weight: 700;
        line-height: 1;
        letter-spacing: 0.04em;
        text-transform: none;
    }
`;

type FrontContentProps = Pick<CardData, 'name' | 'domain' | 'no' | 'total' | 'shot' | 'shotLight' | 'hue'>;

export const FrontContent = ({ name, domain, no, total, shot, shotLight, hue }: FrontContentProps) => {
    return (
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
                    loading="lazy"
                    data-theme-shot={shotLight ? 'dark' : undefined}
                />
                {shotLight && (
                    // oxlint-disable-next-line next/no-img-element -- see above
                    <img
                        src={shotLight}
                        alt={`Startseite von ${domain}`}
                        loading="lazy"
                        data-theme-shot="light"
                    />
                )}
            </Chrome>
            <NameBanner>
                <span className={metal}>{name}</span>
            </NameBanner>
            <DomainBanner>
                <span className={metal}>{domain}</span>
            </DomainBanner>
            <Shield
                no={no}
                total={total}
            />
            <Scan domain={domain} />
        </Inner>
    );
};
