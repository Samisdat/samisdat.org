export interface ArcPoint {
    x: number;
    y: number;
}

/** Where #sunAndMoonPath starts: the sun rises over the hill here, so it shows when it rises. */
export const ARC_START: ArcPoint = { x: 432.054, y: 220.087 };

/** Where #sunAndMoonPath ends, on the horizon line where the sun sets. */
export const ARC_END: ArcPoint = { x: 1270.402, y: 275.894 };

/** The straight line from the start to the end of the path, at x. */
const chordAt = (x: number) =>
    ARC_START.y + ((ARC_END.y - ARC_START.y) * (x - ARC_START.x)) / (ARC_END.x - ARC_START.x);

/**
 * A point of the path with the season applied: the arc rises over the line between its ends by `heightFactor` of its
 * height, so both ends stay where they are, in every season, and only the middle of the arc gets higher or lower.
 */
export const seasonalPoint = ({ x, y }: ArcPoint, heightFactor: number): ArcPoint => {
    const chord = chordAt(x);

    return { x, y: chord + (y - chord) * heightFactor };
};
