import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

export const PlaceholderStyling = styled.div`
    color: #1c1917;
    background: #e2e8f0;
    padding: 1rem;
    border: 1px dashed #d97706;
`;

export const Placeholder: FC<HTMLAttributes<HTMLDivElement>> = ({ children = 'Lorem Ipsum' }) => (
    <PlaceholderStyling>{children}</PlaceholderStyling>
);
