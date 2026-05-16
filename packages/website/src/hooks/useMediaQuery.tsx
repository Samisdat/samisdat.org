import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string, init = false) => {
    const [mediaQueryMatches, setMediaQueryMatches] = useState(init);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);

        const handleMediaQueryChange = (event: MediaQueryListEvent) => {
            setMediaQueryMatches(event.matches);
        };

        setMediaQueryMatches(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaQueryChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaQueryChange);
        };
    }, [query]);

    return mediaQueryMatches;
};
