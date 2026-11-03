/**
 * Chromatic snapshots one story once per mode. 320px is the WCAG 1.4.10
 * (Reflow) floor, so demos must still fit there without horizontal scrolling.
 */
export const viewportModes = {
    'mobile-320': { viewport: 320 },
    'mobile-375': { viewport: 375 },
    'tablet-768': { viewport: 768 },
};

/** The same widths for the toolbar, so they can be checked locally too. */
export const viewportOptions = {
    'mobile-320': { name: 'Mobile 320', styles: { width: '320px', height: '800px' } },
    'mobile-375': { name: 'Mobile 375', styles: { width: '375px', height: '800px' } },
    'tablet-768': { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
};
