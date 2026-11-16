import { styled } from '@linaria/react';

import { metal } from '../Metal';
import { BlogCollectorCardProps } from '../props';
import { Banner, Inner } from '../Shared';

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
    font-size: max(11px, 3.4cqw);
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-subtle);
`;

const NameBanner = styled(Banner)`
    > span {
        --shift: -30%;

        padding: 2.4cqw 5cqw 2cqw;
        font-size: 8cqw;
        font-weight: 800;
        line-height: 1;
    }
`;

const Label = styled.span`
    font-size: max(11px, 3.4cqw);
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
    /* The label column is as wide as the longest label, shared by all rows via subgrid */
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 2cqw;
    align-content: start;
    margin: 0;

    > div {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1 / -1;
        align-items: baseline;
        padding-block: 2.3cqw;
        border-top: 0.3cqw solid var(--color-border-muted);
    }

    dt {
        white-space: nowrap;
        font-size: max(11px, 3.4cqw);
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--color-text-subtle);
    }

    dd {
        min-width: 0;
        margin: 0;
        font-size: max(13px, 4.6cqw);
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: 0.02em;
        overflow-wrap: anywhere;
        color: var(--color-text-emphasis);
    }
`;

type BackProps = Pick<BlogCollectorCardProps, 'name' | 'domain' | 'no' | 'total' | 'hue' | 'topics' | 'facts'>;

export const Back = ({ name, no, total, hue, topics, facts }: BackProps) => (
    <BackInner style={{ ['--hue' as string]: hue }}>
        <Head>
            <span>Blog-Serie</span>
            <span>
                Nr. {no} / {total}
            </span>
        </Head>
        <NameBanner>
            <span className={metal}>{name}</span>
        </NameBanner>
        <div>
            <Themen>
                <Label>Themen</Label>
                <Chips>
                    {topics.map(topic => (
                        <li key={topic}>{topic}</li>
                    ))}
                </Chips>
            </Themen>
            <Facts>
                {facts.map(([label, value]) => (
                    <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                    </div>
                ))}
            </Facts>
        </div>
    </BackInner>
);
