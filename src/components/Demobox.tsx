import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

type DemoBoxColors = 'blue' | 'yellow' | 'red';

interface DemoBoxProps extends HTMLAttributes<HTMLDivElement> {
    color?: DemoBoxColors;
}

const demoBoxColors = {
    red: {
        background: 'lab(56.32% 68.31 23.33)',
    },
    blue: {
        background: 'lab(55.29% 14.38 -64.44)',
    },
    yellow: {
        background: 'lab(70.04% 23.01 74.24)',
    },
};

const DemoBoxStyling = styled.div<{
    $color: DemoBoxColors;
}>`
    background: ${props => demoBoxColors[props.$color].background};
`;

export const DemoBox: FC<DemoBoxProps> = ({ color = 'blue', children, ...props }) => {
    return (
        <DemoBoxStyling
            $color={color}
            {...props}
        >
            {children}
        </DemoBoxStyling>
    );
};
