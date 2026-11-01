export const BASE_DURATION_FALLBACK = 40;

/** Document time (s) at which the demo resets itself and pauses. */
export const AUTO_RESET_AT = 360;

/** Id of the rotating group; the formula shows it in a console-runnable selector. */
export const CRANK_ELEMENT_ID = 'crank-arm';

/** Data published by <DemoAnimationsCrank>, rendered by <DemoAnimationsCrankFormula>. */
export type CrankEvent =
    | {
          kind: 'frame';
          t: number;
          begin: number;
          dur: number;
          local: number;
          frac: number;
          theta: number;
          measured: number;
      }
    | {
          kind: 'jump';
          before: number;
          after: number;
          t: number;
          thetaBefore: number;
          thetaAfter: number;
          delta: number;
          flash: boolean;
      }
    | { kind: 'reset'; reason: 'button' | 'limit' };
