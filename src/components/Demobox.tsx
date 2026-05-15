import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

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

type DemoBoxColors = keyof typeof demoBoxColors;

interface DemoBoxProps extends HTMLAttributes<HTMLDivElement> {
    color?: DemoBoxColors;
}

const DemoBoxStyling = styled.div<{
    $color: DemoBoxColors;
}>`
    padding: 1rem;
    margin-bottom: 1rem;
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
