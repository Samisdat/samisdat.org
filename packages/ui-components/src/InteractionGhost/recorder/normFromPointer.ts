import { pointerToNorm } from '@samisdat/tools';

export type PointerRect = { left: number; top: number; width: number; height: number };

/** Client coordinates to norm (-1..1, clamped, centre 0); a zero-sized rect yields the centre. */
export const normFromPointer = (clientX: number, clientY: number, rect: PointerRect): { x: number; y: number } =>
    pointerToNorm(clientX, clientY, rect) ?? { x: 0, y: 0 };
