import { useSyncExternalStore } from 'react';

export const useMatchMediaQuery = (query: string, initialState = false) => {
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
            return initialState;
        }
        return window.matchMedia(query).matches;
    };

    const getServerSnapshot = () => initialState;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
