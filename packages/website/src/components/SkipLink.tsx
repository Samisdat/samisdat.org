import { styled } from '@linaria/react';

const Link = styled.a`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
    padding: 0.5rem 1rem;
    background: var(--color-surface-default);
    color: var(--color-text-default);
    transform: translateY(-100%);

    &:focus {
        transform: none;
        outline: 2px solid var(--color-text-default);
    }
`;

export const SkipLink = () => <Link href="#main">Zum Inhalt springen</Link>;
