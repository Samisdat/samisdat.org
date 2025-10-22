import { useTal } from '@/lib/TalContext';
import { ReactElement } from 'react';

export const DigitalClock = (): ReactElement | null => {
    const { time } = useTal();

    if (!time) {
        return null;
    }

    const minutes = time.getMinutes();
    const hours = time.getHours();

    return (
        <div>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
        </div>
    );
};
