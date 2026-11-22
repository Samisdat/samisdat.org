import { styled } from '@linaria/react';

const ScreenReaderOnlyStyled = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
`;

interface ScreenReaderOnlyProps {
    children: string;
}

export const ScreenReaderOnly = ({ children }: ScreenReaderOnlyProps) => (
    <ScreenReaderOnlyStyled>{children}</ScreenReaderOnlyStyled>
);
