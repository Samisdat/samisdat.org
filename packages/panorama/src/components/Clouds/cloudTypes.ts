export type CloudType = 'cirrus' | 'cirrocumulus' | 'altocumulus' | 'cumulus' | 'stratocumulus';

/**
 * Colours of one cloud type. Every value is optional and any CSS colour; what is missing keeps the
 * default of the cover's tone. Day and night are mixed with the night factor, like the defaults.
 */
export interface CloudPalette {
    day?: { body?: string; shade?: string };
    night?: { body?: string; shade?: string };
}
