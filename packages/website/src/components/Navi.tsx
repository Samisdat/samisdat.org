import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@linaria/react';
import { Container } from '@samisdat/ui-components/Container';
import { Stack } from '@samisdat/ui-components/Stack';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';
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

const StyledLink = styled(Link)`
    justify-self: center;

    text-decoration: none;
    font-family: var(--font-code);
    font-weight: bold;
    &:hover {
        text-decoration: underline;
    }
`;
const DomainStyling = styled.span`
    color: var(--color-teal);
`;
const DotStyling = styled.span`
    color: var(--color-red);
`;
const TldStyling = styled.span`
    color: var(--color-red);
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
        width: 1.25rem;
        height: 1.25rem;
    }
`;

const ProgressBar = styled.div`
    background: var(--color-purple);
    background: var(--color-background-secondary);
    background: var(--color-background-muted);

    height: 2px;
    border-start-end-radius: 20px;
    animation-name: progress-bar;
    animation-timeline: scroll(y);
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
            <Bar>
                <Container>
                    <Stack
                        directionSmall="row"
                        container
                    >
                        <Stack>
                            <StyledLink href="/">
                                <DomainStyling>samisdat</DomainStyling>
                                <DotStyling>.</DotStyling>
                                <TldStyling>org</TldStyling>
                            </StyledLink>
                        </Stack>
                        <Stack>
                            <ThemeSwitcher />
                        </Stack>
                        <Stack align="end">
                            <a href="https://github.com/Samisdat/">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="https://www.linkedin.com/in/bastian-pertz">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                            <a href="/rss">
                                <FontAwesomeIcon icon={faRss} />
                            </a>
                        </Stack>
                    </Stack>
                </Container>
                <ProgressBar />
            </Bar>
        </StickyShell>
    </>
);
