import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { CloudReview } from './CloudReview';

import type { HandCloud } from './CloudReview';

/** Boxes of the hand-drawn clouds in `assets/clouds-hand.svg`, measured once, so each one can be shown at its real size. */
const BOXES: Record<string, Omit<HandCloud, 'id' | 'body' | 'shade'>> = {
    cloud1: { x: 473.1, y: 46.7, width: 253, height: 60.5 },
    claoud2: { x: 6.7, y: 83.6, width: 194.5, height: 33.4 },
    cloud3: { x: 128.5, y: 66, width: 449.5, height: 107.9 },
    claud4: { x: 587.5, y: 98.2, width: 344.5, height: 75.7 },
    claud5: { x: 705, y: 39.2, width: 98.8, height: 26.1 },
};

const PAIR =
    /<g id="([^"]+)"><path d="([^"]+)" style="fill:#[0-9a-f]+;"\/><path d="([^"]+)" style="fill:#[0-9a-f]+;"\/>/g;

/** The five clouds of the hand-made file, body and underside. */
const readHandClouds = async (): Promise<HandCloud[]> => {
    const file = path.join(process.cwd(), '../../assets/clouds-hand.svg');
    const svg = await readFile(file, 'utf8');
    const start = svg.indexOf('<g id="clouds">');
    const end = svg.indexOf('<g id="Layer30">');

    return [...svg.slice(start, end).matchAll(PAIR)]
        .filter(([, id]) => id in BOXES)
        .map(([, id, body, shade]) => ({ id, body, shade, ...BOXES[id] }));
};

/** Review of the generated clouds next to the hand-made ones. Dev tool, not part of the library. */
export default async function CloudReviewPage() {
    return <CloudReview hand={await readHandClouds()} />;
}
