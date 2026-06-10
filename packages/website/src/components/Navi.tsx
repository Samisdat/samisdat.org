import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
import { faSquareRss } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@linaria/react';
import { ColorSwitcher } from '@samisdat/ui-components/ColorSwitcher';
import { Container } from '@samisdat/ui-components/Container';
import Link from 'next/link';
import { FC, HTMLAttributes } from 'react';

const NavStyling = styled.div`
    position: sticky;
    top: 0px;
`;

const StyledLink = styled(Link)`
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

export const Navi: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
    <>
        <NavStyling>
            <Container>
                <StyledLink href="/">
                    <DomainStyling>samisdat</DomainStyling>
                    <DotStyling>.</DotStyling>
                    <TldStyling>org</TldStyling>
                </StyledLink>

                <nav
                    id="main-navigation"
                    aria-label="Hauptnavigation"
                >
                    <ColorSwitcher />
                    <ul>
                        <li>
                            <a href="https://github.com/Samisdat/">
                                <FontAwesomeIcon icon={faGithubSquare} />
                            </a>
                        </li>
                        <li>
                            <a href="/rss">
                                <FontAwesomeIcon icon={faSquareRss} />
                            </a>
                        </li>
                    </ul>
                </nav>
            </Container>
        </NavStyling>
    </>
);
