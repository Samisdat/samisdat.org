'use client';

import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useShikiHighlighter } from 'react-shiki';

import { shikiTheme, styledGrammarLangs } from '../../../utils/shikiTheme';
import { AUTO_RESET_AT, BASE_DURATION_FALLBACK, CRANK_ELEMENT_ID, type CrankEvent } from './crankEvents';
import { fmt, fmtDur, fmtSigned, interpolate, num, numDur } from './formatNumbers';
import { FormulaLines } from './FormulaLines';
import { Block } from './FormulaParts';
import { createFormulaWriter } from './formulaWriter';

/**
 * All natural-language copy, set in the MDX so the post can be translated
 * without touching this component. Lines are arrays (no embedded newlines);
 * `{placeholders}` are filled with numbers formatted for `locale`.
 */
export type CrankFormulaTexts = {
    /** Comment above the phase line (the leading `// ` is added here). */
    phaseComment: string;
    /** Comment above the angle line. */
    angleComment: string;
    /** First line of the console snippet. */
    consoleComment: string;
    /** Shown until the first change. */
    hint: string[];
    /** After a `dur` change: {before} {after} {t} {angleBefore} {angleAfter} {delta}. */
    jump: string[];
    /** After the Reset button. */
    reset: string[];
    /** After the automatic reset: {limit}. */
    resetLimit: string[];
};

const consoleSnippet = (comment: string) => `// ${comment}
const g = document
  .querySelector("#${CRANK_ELEMENT_ID}");
const { a, b } = g.getCTM();
(Math.atan2(b, a) * 180 / Math.PI
  + 360) % 360`;

const ConsoleSnippet = ({ comment }: { comment: string }) =>
    useShikiHighlighter(consoleSnippet(comment), 'javascript', shikiTheme, {
        customLanguages: styledGrammarLangs,
    });

type Copy = { texts: CrankFormulaTexts; locale: string };

/**
 * Feeds the crank events into the formula's DOM nodes. The subscription is set
 * up once; it reads the current copy through a ref.
 */
const useFormulaSubscription = (rootRef: RefObject<HTMLDivElement | null>, copyRef: RefObject<Copy>) => {
    const live = useDemoContext()?.live;

    useEffect(() => {
        if (!rootRef.current || !live) {
            return;
        }
        const writer = createFormulaWriter(rootRef.current);

        return live.subscribe(raw => {
            const event = raw as CrankEvent;
            switch (event.kind) {
                case 'frame':
                    writer.write({
                        t: num(event.t, 2),
                        dur: numDur(event.dur),
                        local: num(event.local, 2),
                        frac: num(event.frac, 4),
                        theta: num(event.theta, 1),
                        measured: num(event.measured, 1),
                    });
                    break;
                case 'jump': {
                    const { texts, locale } = copyRef.current;
                    const values = {
                        before: fmtDur(locale, event.before),
                        after: fmtDur(locale, event.after),
                        t: fmt(locale, event.t, 2),
                        angleBefore: fmt(locale, event.thetaBefore, 1),
                        angleAfter: fmt(locale, event.thetaAfter, 1),
                        delta: fmtSigned(locale, event.delta, 1),
                    };
                    writer.setJump(texts.jump.map(line => interpolate(line, values)));
                    if (event.flash) {
                        writer.flash();
                    }
                    break;
                }
                case 'reset': {
                    const { texts } = copyRef.current;
                    writer.setJump(
                        event.reason === 'limit'
                            ? texts.resetLimit.map(line => interpolate(line, { limit: String(AUTO_RESET_AT) }))
                            : texts.reset
                    );
                    break;
                }
            }
        });
    }, [live, rootRef, copyRef]);
};

type DemoAnimationsCrankFormulaProps = {
    texts: CrankFormulaTexts;
    /** BCP 47 tag for the numbers inside the messages, e.g. "de-DE". */
    locale: string;
};

export const DemoSmilCrankFormula = ({ texts, locale }: DemoAnimationsCrankFormulaProps) => {
    const ctx = useDemoContext();
    const copyRef = useRef<Copy>({ texts, locale });
    useEffect(() => {
        copyRef.current = { texts, locale };
    });
    const [baseDuration] = useState(() => parseFloat(ctx?.values.duration ?? '') || BASE_DURATION_FALLBACK);

    const rootRef = useRef<HTMLDivElement | null>(null);
    useFormulaSubscription(rootRef, copyRef);

    // Reserve the tallest message so the layout does not jump on the first change.
    const jumpLines = Math.max(texts.hint.length, texts.jump.length, texts.reset.length, texts.resetLimit.length);

    return (
        <Block ref={rootRef}>
            <FormulaLines
                phaseComment={texts.phaseComment}
                angleComment={texts.angleComment}
                dur={numDur(baseDuration)}
            />
            <div
                className="jump"
                aria-live="polite"
                data-f="jump"
                style={{ minHeight: `${jumpLines}lh` }}
            >
                {texts.hint.join('\n')}
            </div>
            <div className="measured">
                <div className="snippet">
                    <ConsoleSnippet comment={texts.consoleComment} />
                </div>
                <div className="result">
                    {'// → '}
                    <span data-f="measured">{num(0, 1)}</span>
                    {'°'}
                </div>
            </div>
        </Block>
    );
};
