import { styled } from '@linaria/react';
import { AnchorHTMLAttributes, FC } from 'react';

const LinkStyling = styled.a`
    color: var(--color-ink-turquoise);
    font-weight: 550;
    text-decoration: underline;
    text-underline-offset: 3px;
    text-decoration-thickness: 1.5px;
`;

export const Link: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, ...props }) => (
    <LinkStyling {...props}>{children}</LinkStyling>
);
