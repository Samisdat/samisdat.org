import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@linaria/react';
import { Container } from '@samisdat/ui-components/Container';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

const StickyShell = styled.header`
    position: sticky;
    top: 0;
    z-index: 10;
`;

const Bar = styled.div`
    background: var(--primitive-aubergine);

    border-bottom: 1px solid transparent;
    transition: border-color 320ms ease;

    @supports (animation-timeline: scroll()) {
        animation: header-border-fade linear both;
        animation-timeline: scroll(root);
        animation-range: var(--panorama-height, 100dvh) calc(var(--panorama-height, 100dvh) + 160px);
    }

    @keyframes header-border-fade {
        from {
            border-color: transparent;
        }
        to {
            border-color: var(--color-accent-primary, var(--primitive-pink));
        }
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

const BarCenter = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--space-4, 1rem);
    padding: var(--space-3, 0.75rem) var(--space-5, 1.5rem);
`;

const SwitcherSlot = styled.div`
    justify-self: start;
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
        color: var(--primitive-ivory);
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

export const Navi: FC<HTMLAttributes<HTMLDivElement>> = () => (
    <>
        <StickyShell>
            <Bar>
                <Container>
                    <BarCenter>
                        <SwitcherSlot>
                            <ThemeSwitcher />
                        </SwitcherSlot>

                        <StyledLink href="/">
                            <DomainStyling>samisdat</DomainStyling>
                            <DotStyling>.</DotStyling>
                            <TldStyling>org</TldStyling>
                        </StyledLink>

                        <IconNav aria-label="Externe Links">
                            <a href="https://github.com/Samisdat/">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                            <a href="https://www.linkedin.com/in/bastian-pertz">
                                <FontAwesomeIcon icon={faLinkedin} />
                            </a>
                            <a href="/rss">
                                <FontAwesomeIcon icon={faRss} />
                            </a>
                        </IconNav>
                    </BarCenter>
                </Container>
            </Bar>
        </StickyShell>
    </>
);
