import { useCallback, useEffect, useRef, useState } from 'react';

export type CopyState = 'idle' | 'done' | 'failed';

/** Copies text to the clipboard; `state` is shown briefly as text in the button. */
export const useCopy = (text: string) => {
    const [state, setState] = useState<CopyState>('idle');
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    const copy = useCallback(async () => {
        let next: CopyState = 'done';
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            next = 'failed';
        }
        setState(next);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setState('idle'), 2000);
    }, [text]);

    return { state, copy };
};
