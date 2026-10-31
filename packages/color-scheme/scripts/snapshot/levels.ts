/** Threshold names shared by the snapshot and its components. */
export type WcagLevel = 'aaa' | 'aa' | 'large' | 'fail';

export const wcagLevel = (ratio: number): WcagLevel =>
    ratio >= 7 ? 'aaa' : ratio >= 4.5 ? 'aa' : ratio >= 3 ? 'large' : 'fail';
