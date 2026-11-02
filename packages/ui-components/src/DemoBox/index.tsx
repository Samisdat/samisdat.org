import { styled } from '@linaria/react';
import { purple } from '@samisdat/color-scheme/primitives';
import { FC, HTMLAttributes } from 'react';

const demoBoxColors = {
    red: {
        background: 'var(--color-ink-ruby)',
    },
    blue: {
        background: 'var(--color-ink-sapphire)',
    },
    yellow: {
        background: 'var(--color-ink-gold)',
    },
    orange: {
        background: 'var(--color-ink-copper)',
    },
    green: {
        background: 'var(--color-ink-jade)',
    },
    teal: {
        background: 'var(--color-ink-turquoise)',
    },
    purple: {
        background: purple[600],
    },
    pink: {
        background: 'var(--color-ink-rose)',
    },
    cyan: {
        background: 'var(--color-ink-steel)',
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
    color: contrast-color(${props => demoBoxColors[props.$color].background});
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
