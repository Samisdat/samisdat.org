import { styled } from '@linaria/react';
import React, { forwardRef, HTMLAttributes } from 'react';

import { breakpoints } from '../tokens/breakpoints';

type FlexDirection = 'row' | 'column';
type AlignItems = 'stretch' | 'center' | 'start' | 'end' | 'baseline';

interface StackContainerProps extends HTMLAttributes<HTMLDivElement> {
    container: true;
    directionSmall?: FlexDirection;
    directionMedium?: FlexDirection;
    directionLarge?: FlexDirection;
    align?: AlignItems;
    gap?: string;
}

interface StackItemProps extends HTMLAttributes<HTMLDivElement> {
    container?: false;
    orderSmall?: number;
    orderMedium?: number;
    orderLarge?: number;
    grow?: number;
    basis?: string;
}

type StackProps = StackContainerProps | StackItemProps;

const StackContainerStyling = styled.div<{
    $directionSmall?: FlexDirection;
    $directionMedium?: FlexDirection;
    $directionLarge?: FlexDirection;
    $align?: AlignItems;
    $gap?: string;
}>`
    display: flex;
    gap: ${props => props.$gap ?? '1rem'};
    align-items: ${props => props.$align ?? 'stretch'};
    flex-direction: ${props => props.$directionSmall ?? 'column'};
    width: 100%;

    @media (min-width: ${breakpoints.medium}) {
        flex-direction: ${props => props.$directionMedium ?? props.$directionSmall ?? 'column'};
    }

    @media (min-width: ${breakpoints.large}) {
        flex-direction: ${props =>
            props.$directionLarge ?? props.$directionMedium ?? props.$directionSmall ?? 'column'};
    }
`;

const StackItemStyling = styled.div<{
    $orderSmall?: number;
    $orderMedium?: number;
    $orderLarge?: number;
    $grow?: number;
    $basis?: string;
}>`
    flex: ${props => props.$grow ?? 1} 1 ${props => props.$basis ?? '0%'};
    order: ${props => props.$orderSmall ?? 'auto'};

    @media (min-width: ${breakpoints.medium}) {
        order: ${props => props.$orderMedium ?? props.$orderSmall ?? 'auto'};
    }

    @media (min-width: ${breakpoints.large}) {
        order: ${props => props.$orderLarge ?? props.$orderMedium ?? props.$orderSmall ?? 'auto'};
    }
`;

export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
    if (props.container) {
        const {
            container,
            directionSmall,
            directionMedium,
            directionLarge,
            align,
            gap,
            children,
            ...rest
        } = props;

        return (
            <StackContainerStyling
                ref={ref}
                $directionSmall={directionSmall}
                $directionMedium={directionMedium}
                $directionLarge={directionLarge}
                $align={align}
                $gap={gap}
                {...rest}
            >
                {children}
            </StackContainerStyling>
        );
    }

    const { container, orderSmall, orderMedium, orderLarge, grow, basis, children, ...rest } = props;

    return (
        <StackItemStyling
            ref={ref}
            $orderSmall={orderSmall}
            $orderMedium={orderMedium}
            $orderLarge={orderLarge}
            $grow={grow}
            $basis={basis}
            {...rest}
        >
            {children}
        </StackItemStyling>
    );
});

Stack.displayName = 'Stack';
