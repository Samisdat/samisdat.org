import { useMediaQuery } from './useMediaQuery';

export const usePrefersReducedMotion = () =>
    useMediaQuery('(prefers-reduced-motion: reduce)');
