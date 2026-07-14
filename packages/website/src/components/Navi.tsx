import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@linaria/react';
import { Container } from '@samisdat/ui-components/Container';
import { Stack } from '@samisdat/ui-components/Stack';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';
import { breakpoints } from '../../../ui-components/src/tokens/breakpoints';
import { space } from '../../../ui-components/src/tokens/space';
import { ThemeSwitcher } from './ThemeSwitcher';

const StickyShell = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
`;

const Bar = styled.div`
    background: var(--color-background);
    border-bottom: 2px solid transparent;
    transition: border-color 320ms ease;

    @supports (animation-timeline: scroll()) {
        animation: header-border-fade linear both;
        animation-timeline: scroll(root);
        animation-range: var(--header-height) calc(var(--header-height) + 100px);
    }

    @keyframes header-border-fade {
        from {
            border-color: transparent;
            background: var(--color-background);
        }

        to {
            border-color: var(--color-background-muted);
            background: var(--color-background-secondary);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const Teal = styled.span`
    color: var(--color-teal);
    text-decoration-color: var(--color-teal);
`;
const Red = styled.span`
    color: var(--color-red);
    text-decoration-color: var(--color-red);
`;

const StyledLink = styled(Link)`
    justify-self: center;
    text-decoration: none;
    font-family: var(--font-code);
    font-weight: bold;
    font-size: var(--typo-h5-size);

    @media (min-width: ${breakpoints.medium}) {
        font-size: var(--typo-h4-size);
    }

    &:hover {
        text-decoration: none;
    }
    &:hover ${Teal}, &:hover ${Red} {
        text-decoration: underline;
    }
`;

const IconNav = styled.nav`
    justify-self: end;
    display: flex;
    align-items: center;
    gap: var(--space-3, 0.75rem);

    & a {
        display: inline-flex;
        color: var(--color-foreground);
        transition: color 160ms ease;
    }

    & a:hover,
    & a:focus-visible {
        color: var(--color-accent-primary, var(--primitive-pink));
    }

    & svg {
        width: var(--typo-h5-size);
        height: var(--typo-h5-size);
    }

    @media (min-width: ${breakpoints.medium}) {
        & svg {
            width: var(--typo-h4-size);
            height: var(--typo-h4-size);
        }
    }
`;

const ProgressBar = styled.div`
    background: var(--color-background-muted);
    height: 2px;
    width: 0;
    border-start-end-radius: 20px;
    animation-name: progress-bar;
    animation-timeline: scroll(y);
    animation-range: var(--header-height) 100%;

    @keyframes progress-bar {
        from {
            width: 0;
        }

        to {
            width: 100%;
        }
    }
`;

export const Navi: FC<HTMLAttributes<HTMLDivElement>> = () => (
    <>
        <StickyShell>
            <Bar className="force-theme-dark">
                <Container padding={space[0.5]}>
                    <Stack
                        directionSmall="row"
                        align="center"
                        justify="space-between"
                        container
                    >
                        <StyledLink href="/">
                            <Teal>sam</Teal>
                            <Red>isdat</Red>
                        </StyledLink>
                        <Stack
                            directionSmall="row"
                            align="center"
                            gap={space[0.5]}
                            container
                        >
                            <ThemeSwitcher />
                            <IconNav aria-label="Externe Links">
                                <a href="https://github.com/Samisdat/">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                                <a href="https://www.linkedin.com/in/bastian-pertz">
                                    <FontAwesomeIcon icon={faLinkedin} />
                                </a>
                                <a
                                    href="/feed.xml"
                                    aria-label="RSS-Feed"
                                >
                                    <FontAwesomeIcon icon={faRss} />
                                </a>
                            </IconNav>
                        </Stack>
                    </Stack>
                </Container>
                <ProgressBar />
            </Bar>
        </StickyShell>
    </>
);
