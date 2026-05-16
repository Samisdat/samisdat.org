import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

const LinkStyling = styled.a`
    color: inherit;
    font-weight: 550;
    text-decoration: underline;
`;

export const Link: FC<HTMLAttributes<HTMLAnchorElement>> = ({ children, ...props }) => (
    <LinkStyling {...props}>{children}</LinkStyling>
);
