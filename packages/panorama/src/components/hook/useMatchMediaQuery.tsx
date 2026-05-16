import { useEffect, useState } from 'react';

export const useMatchMediaQuery = (query: string, initialState = false) => {
    const [mediaQueryMatches, setMediaQueryMatches] = useState(initialState);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setMediaQueryMatches(initialState);
            return;
        }

        const mediaQuery = window.matchMedia(query);

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setMediaQueryMatches(event.matches);
        };

        setMediaQueryMatches(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, [query, initialState]);

    return mediaQueryMatches;
};
