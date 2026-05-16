import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

const ColophonStyling = styled.div`
    background: red;
`;

export const Colophon: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
    <ColophonStyling>samisdat.org is build by Bastian Pertz using React, NextJS.</ColophonStyling>
);
