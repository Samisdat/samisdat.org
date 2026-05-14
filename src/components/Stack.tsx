import { styled } from '@linaria/react';
import React, { FC, HTMLAttributes } from 'react';

type FlexDirection = 'row' | 'column';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
    container?: boolean;
    directionSmall?: FlexDirection;
    directionMedium?: FlexDirection;
    directionLarge?: FlexDirection;
    orderSmall?: number;
    orderMedium?: number;
    orderLarge?: number;
}

const StackContainerStyling = styled.div`
    display: flex;
    flex-direction: ${(props: any) => props.$directionSmall || 'column'};
    width: 100%;

    @media (min-width: 768px) {
        flex-direction: ${(props: any) => (props.$directionMedium ?? props.$directionSmall) || 'column'};
    }

    @media (min-width: 1024px) {
        flex-direction: ${(props: any) =>
            (props.$directionLarge ?? props.$directionMedium ?? props.$directionSmall) || 'column'};
    }
`;

const StackItemStyling = styled.div`
    order: ${(props: any) => props.$orderSmall ?? 'auto'};

    @media (min-width: 768px) {
        order: ${(props: any) => props.$orderMedium ?? props.$orderSmall ?? 'auto'};
    }

    @media (min-width: 1024px) {
        order: ${(props: any) => props.$orderLarge ?? props.$orderMedium ?? props.$orderSmall ?? 'auto'};
    }
`;

export const Stack: FC<StackProps> = ({
    container = false,
    directionSmall,
    directionMedium,
    directionLarge,
    orderSmall,
    orderMedium,
    orderLarge,
    children,
    ...props
}) => {
    if (container) {
        return (
            <StackContainerStyling
                $directionSmall={directionSmall}
                $directionMedium={directionMedium}
                $directionLarge={directionLarge}
                {...props}
            >
                {children}
            </StackContainerStyling>
        );
    }

    return (
        <StackItemStyling
            $orderSmall={orderSmall}
            $orderMedium={orderMedium}
            $orderLarge={orderLarge}
            {...props}
        >
            {children}
        </StackItemStyling>
    );
};
