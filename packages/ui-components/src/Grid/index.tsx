import { styled } from '@linaria/react';
import React, { FC, HTMLAttributes } from 'react';

import { breakpoints } from '../tokens/breakpoints';

type GridCols = 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1;

interface GridProps extends HTMLAttributes<HTMLDivElement> {
    container?: boolean;
    small?: GridCols;
    medium?: GridCols;
    large?: GridCols;
    orderSmall?: number;
}

const GridContainerStyling = styled.div`
    display: grid;
    grid-gap: 2rem;
    width: 100%;
    grid-template-columns: repeat(8, 1fr);
`;

const GridItemStyling = styled.div<{
    $small?: number;
    $medium?: number;
    $large?: number;
    $orderSmall?: number;
}>`
    grid-column: span ${props => props.$small || 8};

    order: ${props => props.$orderSmall ?? 0};

    @media (min-width: ${breakpoints.medium}) {
        grid-column: span ${props => props.$medium || props.$small || 8};
        order: 0;
    }

    @media (min-width: ${breakpoints.large}) {
        grid-column: span ${props => props.$large || props.$medium || props.$small || 8};
    }
`;

export const Grid: FC<GridProps> = ({
    container = false,
    small = 8,
    medium,
    large,
    orderSmall,
    children,
    ...props
}) => {
    if (container) {
        return <GridContainerStyling {...props}>{children}</GridContainerStyling>;
    }

    return (
        <GridItemStyling
            $small={small}
            $medium={medium}
            $large={large}
            $orderSmall={orderSmall}
            {...props}
        >
            {children}
        </GridItemStyling>
    );
};
