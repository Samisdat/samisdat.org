import { useTal } from '@/lib/TalContext';
import { ChangeEvent } from 'react';

export const TimeFactor = () => {
    const { timeFactor, setTimeFactor } = useTal();

    if (undefined === timeFactor) {
        return null;
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.currentTarget.value;
        console.log(newValue);
        setTimeFactor(parseInt(newValue, 10));
    };
    return (
        <div>
            {timeFactor}
            <br />
            <input
                onChange={onChange}
                type="range"
                min="0"
                max="5000"
                defaultValue={timeFactor}
                step="250"
            />
        </div>
    );
};
