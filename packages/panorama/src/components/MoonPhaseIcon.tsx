import { moonShape } from '@/lib/moonPhase';

interface MoonPhaseIconProps {
    /** 0 new moon, 0.5 full moon, as `moonView` gives it. */
    phase: number;
    size?: string;
}

/** The moon as a small icon in the current text colour: the lit part solid, the dark part faint. */
export const MoonPhaseIcon = ({ phase, size = '1.1em' }: MoonPhaseIconProps) => {
    const { path, flip } = moonShape(phase);

    return (
        <svg
            viewBox="0 0 50 50"
            width={size}
            height={size}
            aria-hidden="true"
        >
            <circle
                cx="25"
                cy="25"
                r="24"
                fill="currentColor"
                opacity="0.25"
            />
            <path
                d={path}
                fill="currentColor"
                transform={flip ? 'translate(50 0) scale(-1 1)' : undefined}
            />
        </svg>
    );
};
