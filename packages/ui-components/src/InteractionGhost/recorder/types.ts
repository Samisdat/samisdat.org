export type RecordedEventType = 'down' | 'move' | 'up' | 'click';

/** One raw pointer event; x, y in norm coordinates (-1..1), t in ms. */
export type RecordedEvent = { type: RecordedEventType; t: number; x: number; y: number };

export type SimplifyOptions = {
    /** RDP tolerance in norm units */
    tolerance?: number;
    maxPoints?: number;
};

export type SegmentOptions = {
    /** gaps longer than this between gestures become a wait */
    pauseMs?: number;
    /** a press moving less than this (path length, norm) ... */
    tapTravel?: number;
    /** ... and shorter than this is a tap */
    tapMaxMs?: number;
};

export type RecordOptions = SegmentOptions & SimplifyOptions;
