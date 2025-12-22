import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

const ContainerStyling = styled.div`
    width: min(100% - 2rem, 1024px);
    margin-inline: auto;
`;

export const Container: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
    <ContainerStyling>{children}</ContainerStyling>
);
