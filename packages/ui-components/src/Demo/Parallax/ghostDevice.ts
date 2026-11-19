import {
    mouseDemoScript,
    padDemoScript,
    tiltDemoScript,
    touchDemoScript,
    type Device,
} from '@samisdat/ui-components/InteractionGhost';

export const GHOST_HINT = 'Bewege den Zeiger oder tippe auf die Demo, um selbst zu steuern.';

const scripts = {
    pad: padDemoScript,
    mouse: mouseDemoScript,
    touch: touchDemoScript,
    tilt: tiltDemoScript,
};

/** MDX-friendly props: the script is picked by device name. */
export type GhostDeviceProps = {
    device?: Device;
    resumeAfterMs?: number;
    loop?: boolean;
    /** Checkerboard canvas around the demo (default true). */
    canvas?: boolean;
};

export const scriptForDevice = (device: Device = 'pad') => scripts[device];
