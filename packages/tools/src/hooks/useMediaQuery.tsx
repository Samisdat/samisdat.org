import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string, init = false) => {
    const [mediaQueryMatches, setMediaQueryMatches] = useState(init);

    useEffect(() => {
        if (typeof window === 'undefined') {
            setMediaQueryMatches(init);
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
    }, [query, init]);

    return mediaQueryMatches;
};
