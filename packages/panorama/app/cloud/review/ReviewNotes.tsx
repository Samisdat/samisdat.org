import { useState } from 'react';

import type { BumpCloudType } from '@/components/Clouds/bumpCloud';

export interface ReviewNote {
    seed: number;
    width: number;
    height: number;
    note: string;
}

export interface Review {
    type: BumpCloudType;
    light: number;
    /** Seeds shown, so a later round can be compared against the same set. */
    seeds: { first: number; count: number };
    notes: ReviewNote[];
}

/** Hands the review over as a downloaded file named after the type. */
const download = (review: Review, json: string) => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const link = document.createElement('a');

    link.href = url;
    link.download = `cloud-review-${review.type}.json`;
    link.click();
    URL.revokeObjectURL(url);
};

interface ReviewNotesProps {
    /** Builds the review from the notes written so far. */
    collect: () => Review;
    onClear: () => void;
}

/** Turns the notes under the clouds into JSON: downloaded, and shown to copy. */
export const ReviewNotes = ({ collect, onClear }: ReviewNotesProps) => {
    const [json, setJson] = useState('');

    const submit = () => {
        const review = collect();
        const text = JSON.stringify(review, null, 2);

        setJson(text);
        download(review, text);
    };

    return (
        <section style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    type="button"
                    onClick={submit}
                >
                    submit notes as JSON
                </button>
                {json && (
                    <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(json)}
                    >
                        copy JSON
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        setJson('');
                        onClear();
                    }}
                >
                    clear notes
                </button>
            </div>
            {json && (
                <textarea
                    readOnly
                    value={json}
                    rows={8}
                    style={{ font: '12px monospace' }}
                />
            )}
        </section>
    );
};
