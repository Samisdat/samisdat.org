import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';
const HandStyling = styled.div`
    fill: currentColor;
    width: 40px;

    & svg {
        fill-rule: evenodd;
        clip-rule: evenodd;
        stroke-linejoin: round;
        stroke-miterlimit: 2;
    }

    & svg .hand,
    & svg .finger {
        fill-rule: nonzero;
    }

    @keyframes spin {
        0% {
            transform: rotate(350deg);
        }

        100% {
            transform: rotate(370deg);
        }
    }

    & svg .finger {
        transform-box: fill-box;
        transform-origin: 50% 100%;
        animation: spin 0.5s ease-in-out infinite alternate;
    }
`;

export const NoNoNo: FC<HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
    return (
        <HandStyling {...props}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 450 600"
            >
                <path
                    className="hand"
                    d="M257,236c0,-17.7 14.3,-32 32,-32c17.7,0 32,14.3 32,32l0,64c0,17.7 -14.3,32 -32,32c-17.7,0 -32,-14.3 -32,-32l0,-64Zm-64,-64c17.7,0 32,14.3 32,32l0,48c0,17.7 -14.3,32 -32,32c-17.7,0 -32,-14.3 -32,-32l0,-48c0,-17.7 14.3,-32 32,-32Zm160,96c0,-17.7 14.3,-32 32,-32c17.7,0 32,14.3 32,32l0,64c0,17.7 -14.3,32 -32,32c-17.7,0 -32,-14.3 -32,-32l0,-64Zm-96,88l0,-0.6c9.4,5.4 20.3,8.6 32,8.6c13.2,0 25.4,-4 35.6,-10.8c8.7,24.9 32.5,42.8 60.4,42.8c11.7,0 22.6,-3.1 32,-8.6l0,8.6c0,88.4 -71.6,160 -160,160l-61.7,0c-42.4,0 -83.1,-16.9 -113.1,-46.9l-11.7,-11.6c-24,-24 -37.5,-56.6 -37.5,-90.5l0,-27c0,-35.3 28.7,-64 64,-64l88,0c22.1,0 40,17.9 40,40c0,22.1 -17.9,40 -40,40l-56,0c-8.8,0 -16,7.2 -16,16c0,8.8 7.2,16 16,16l56,0c39.8,0 72,-32.2 72,-72Z"
                />
                <path
                    className="finger"
                    d="M65,76c0,-17.7 14.3,-32 32,-32c17.7,0 32,14.3 32,32l0,208l-64,0l0,-208Z"
                />
            </svg>
        </HandStyling>
    );
};
