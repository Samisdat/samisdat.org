export type ScholionRef = {
    id: string;
    pattern: string;
    line?: number;
    occurrence?: number;
    /** `#all`: every match is a target (the first one is the link target of the prose side) */
    all?: boolean;
};
