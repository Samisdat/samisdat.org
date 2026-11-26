'use client';

import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Segmented } from '@samisdat/ui-components/Segmented';
import { MoonPhaseIcon, useSkyJump } from '@samisdat/wtal-panorama';

type DayPart = 'day' | 'night';

const DAY_PARTS = [
    { value: 'day' as DayPart, label: 'Tag', icon: <FontAwesomeIcon icon={faSun} /> },
    { value: 'night' as DayPart, label: 'Nacht', icon: <FontAwesomeIcon icon={faMoon} /> },
];

/** Jumps of the panorama's clock to day, night and a moon phase. Renders inside the time control overlay. */
export const SkyJumpSegments = () => {
    const { isDay, moonPhase, moonPhases, jumpToDay, jumpToNight, jumpToMoonPhase } = useSkyJump();
    const phases = moonPhases.map((entry, index) => ({
        value: String(index),
        label: entry.label,
        icon: <MoonPhaseIcon phase={entry.phase} />,
    }));

    return (
        <>
            <Segmented
                label="Tageszeit"
                value={isDay ? 'day' : 'night'}
                options={DAY_PARTS}
                onChange={part => {
                    if ('day' === part) {
                        jumpToDay();
                    } else {
                        jumpToNight();
                    }
                }}
            />
            <Segmented
                label="Mondphase"
                value={String(moonPhase)}
                options={phases}
                onChange={index => {
                    jumpToMoonPhase(Number(index));
                }}
            />
        </>
    );
};
