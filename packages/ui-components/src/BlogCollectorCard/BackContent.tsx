import { styled } from '@linaria/react';

import { Banner, Inner } from './Shared';

import type { CardData } from './FrontContent';

const BackInner = styled(Inner)`
    display: grid;
    grid-template-rows: auto auto 1fr;
    align-content: start;
    gap: 3.6cqw;
    padding: 5cqw;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
`;

const Head = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 3cqw;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
`;

const NameBanner = styled(Banner)`
    > span {
        padding: 2.4cqw 5cqw 2cqw;
        font-size: 8cqw;
        font-weight: 800;
        line-height: 1;
    }
`;

const Label = styled.span`
    font-size: 3cqw;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
`;

const Themen = styled.div`
    display: grid;
    gap: 1.6cqw;
`;

const Chips = styled.ul`
    display: flex;
    flex-wrap: wrap;
    gap: 1.6cqw;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
        padding: 1.6cqw 2.8cqw;
        border: 0.4cqw solid var(--hue);
        border-radius: 0.8cqw;
        font-size: 4cqw;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--color-text-emphasis);
    }
`;

const Facts = styled.dl`
    display: grid;
    align-content: start;
    margin: 0;

    > div {
        display: grid;
        grid-template-columns: 26cqw 1fr;
        gap: 2cqw;
        align-items: baseline;
        padding-block: 2.3cqw;
        border-top: 0.3cqw solid var(--color-border-muted);
    }

    dt {
        font-size: 3cqw;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-text-subtle);
    }

    dd {
        min-width: 0;
        margin: 0;
        font-size: 4.6cqw;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: 0.02em;
        overflow-wrap: anywhere;
        color: var(--color-text-emphasis);
    }

    .primary dd {
        font-size: 6.4cqw;
        color: var(--hue);
    }
`;

const Unverified = styled.span`
    font-weight: 700;
    color: var(--color-ink-gold);
`;

const SrOnly = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
`;

interface FactProps {
    label: string;
    value: string;
    className?: string;
}

const Fact = ({ label, value, className }: FactProps) => {
    const [text, ...rest] = value.split('?');
    const unverified = rest.length > 0;

    return (
        <div className={className}>
            <dt>{label}</dt>
            <dd>
                {text}
                {unverified && (
                    <>
                        <Unverified aria-hidden="true">?</Unverified>
                        <SrOnly>(ungeprüft)</SrOnly>
                        {rest.join('?')}
                    </>
                )}
            </dd>
        </div>
    );
};

export const BackContent = ({
    name,
    no,
    total,
    hue,
    themen,
    sprache,
    nat,
    rolle,
    wohnort,
    format,
    stack,
}: CardData) => (
    <BackInner style={{ ['--hue' as string]: hue }}>
        <Head>
            <span>Blog-Serie</span>
            <span>
                Nr. {no} / {total}
            </span>
        </Head>
        <NameBanner>
            <span>{name}</span>
        </NameBanner>
        <div>
            <Themen>
                <Label>Themen</Label>
                <Chips>
                    {themen.map(thema => (
                        <li key={thema}>{thema}</li>
                    ))}
                </Chips>
            </Themen>
            <Facts>
                <Fact
                    className="primary"
                    label="Sprache"
                    value={sprache}
                />
                <Fact
                    label="Nationalität"
                    value={nat}
                />
                <Fact
                    label="Rolle"
                    value={rolle}
                />
                <Fact
                    label="Wohnort"
                    value={wohnort}
                />
                <Fact
                    label="Format"
                    value={format}
                />
                <Fact
                    label="Gebaut mit"
                    value={stack}
                />
            </Facts>
        </div>
    </BackInner>
);
