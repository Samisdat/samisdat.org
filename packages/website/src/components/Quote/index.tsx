import { styled } from '@linaria/react';
import { FC, ReactNode } from 'react';

import { breakpoints } from '../../../../ui-components/src/tokens/breakpoints';
import { space } from '../../../../ui-components/src/tokens/space';
import { quoteMarkFor, sourceLabel } from './quote';

// Caption sits on the top frame line like a legend. No absolute positioning: figure is a grid, the caption
// (row 1) is pulled up by padding + half a line, so a wrapping caption pushes the quote down instead of covering it.
// --quote-cutout is the surface behind the caption; override it where the quote sits on another surface.
const Frame = styled.figure`
    --quote-pad: ${space[1]};

    display: grid;
    box-sizing: border-box;
    padding: var(--quote-pad);
    border: var(--border-width-default, 1px) solid var(--color-border-default);
    border-radius: 0.5rem;

    @media (min-width: ${breakpoints.medium}) {
        --quote-pad: ${space[2]};
    }

    @media (forced-colors: active) {
        border-color: CanvasText;
    }
`;

const Caption = styled.figcaption`
    grid-row: 1;
    place-self: start;
    max-width: calc(100% - ${space[1]} - 2 * ${space[0.5]});
    margin: calc(-1 * (var(--quote-pad) + 0.5lh)) 0 0 ${space[1]};
    padding: 0 ${space[0.5]};
    overflow-wrap: anywhere;
    font-family: var(--f-mono, var(--font-code));
    font-variation-settings: var(--v-mono, normal);
    font-size: 0.65rem;
    line-height: 1.5;
    letter-spacing: 0;
    color: var(--color-text-secondary);
    background-color: var(--quote-cutout, var(--color-surface-default));

    & a:focus-visible {
        outline: 2px solid var(--color-border-focus);
        outline-offset: 2px;
    }

    @media (forced-colors: active) {
        color: CanvasText;
        background-color: Canvas;

        & a:focus-visible {
            outline-color: Highlight;
        }
    }
`;

// Same slot as the caption, for quotes without a source: the mark alone interrupts the frame line.
const BareMark = styled.span`
    grid-row: 1;
    place-self: start;
    margin: calc(-1 * (var(--quote-pad) + 0.5lh)) 0 0 ${space[1]};
    padding: 0 ${space[0.5]};
    font-size: 0.65rem;
    line-height: 1.5;
    background-color: var(--quote-cutout, var(--color-surface-default));

    @media (forced-colors: active) {
        background-color: Canvas;
    }
`;

const Mark = styled.span`
    font-family: var(--ff-inter-tight, var(--f-body, var(--font-body)));
    font-weight: 800;
    font-size: 1.4em;
    line-height: 1;
    color: var(--color-ink-amethyst);

    @media (forced-colors: active) {
        color: CanvasText;
    }
`;

const Text = styled.blockquote`
    grid-row: 2;
    margin: 0;
    font-family: var(--f-body, var(--font-body));
    font-variation-settings: var(--v-body, normal);
    color: var(--color-text-emphasis);

    & p {
        color: inherit;
    }

    & > :first-child {
        margin-top: 0;
    }

    & > :last-child {
        margin-bottom: 0;
    }
`;

const Cite = styled.cite`
    font-style: normal;
`;

const Link = styled.a`
    color: var(--color-ink-turquoise);
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
`;

export interface QuoteProps {
    /** Title of the cited work or section. */
    title?: string;
    /** Source URL; also set as `cite` on the blockquote. */
    href?: string;
    /** Language of the quote, defaults to the post language. */
    lang?: string;
    children?: ReactNode;
}

export const Quote: FC<QuoteProps> = ({ title, href, lang, children }) => {
    const mark = quoteMarkFor(lang);
    const hasSource = Boolean(title || href);

    return (
        <Frame data-quote="">
            <Text
                lang={lang}
                cite={href}
            >
                {children}
            </Text>
            {hasSource ? (
                <Caption>
                    <Mark aria-hidden="true">{mark}</Mark> {title && <Cite>{title}</Cite>}
                    {title && href && <span aria-hidden="true"> · </span>}
                    {href && <Link href={href}>{sourceLabel(href, Boolean(title))}</Link>}
                </Caption>
            ) : (
                <BareMark aria-hidden="true">
                    <Mark as="span">{mark}</Mark>
                </BareMark>
            )}
        </Frame>
    );
};
