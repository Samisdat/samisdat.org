import { useSyncExternalStore } from 'react';

export const useMediaQuery = (query: string, init = false) => {
    const subscribe = (callback: () => void) => {
        if (typeof window === 'undefined') {
            return () => {};
        }
        const mediaQuery = window.matchMedia(query);
        mediaQuery.addEventListener('change', callback);
        return () => {
            mediaQuery.removeEventListener('change', callback);
        };
    };

    const getSnapshot = () => {
        if (typeof window === 'undefined') {
            return init;
        }
        return window.matchMedia(query).matches;
    };

    const getServerSnapshot = () => init;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
