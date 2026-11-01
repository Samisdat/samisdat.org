import type { CrankFormulaTexts, FormulaField } from './Formula';

/** Plain JS number literal (dot decimals) for the code-style blocks. */
export const num = (value: number, digits: number) => value.toFixed(digits);

const Tok = ({ f, children }: { f: FormulaField; children: string }) => <span className={`v-${f}`}>{children}</span>;

const V = ({ f, init }: { f: FormulaField; init: string }) => (
    <span
        data-f={f}
        className={`v v-${f}`}
    >
        {init}
    </span>
);

// Continuation of an assignment as a comment, "=" aligned under the one above.
const Cont = ({ pad }: { pad: number }) => <span className="comment">{`//${' '.repeat(pad)}`}</span>;

export const FormulaLines = ({ texts, zero, dur }: { texts: CrankFormulaTexts; zero: string; dur: string }) => (
    <div className="formula">
        <div>
            <Tok f="t">t</Tok>
            {' = '}
            <V
                f="t"
                init={zero}
            />
        </div>
        <div> </div>
        <div className="comment">{`// ${texts.phaseComment}`}</div>
        <div>
            <Tok f="frac">frac</Tok>
            {'  = ('}
            <Tok f="t">t</Tok>
            {' % '}
            <Tok f="dur">dur</Tok>
            {') / '}
            <Tok f="dur">dur</Tok>
            {';'}
        </div>
        <div>
            <Cont pad={4} />
            {'= ('}
            <V
                f="t"
                init={zero}
            />
            {' % '}
            <V
                f="dur"
                init={dur}
            />
            {') / '}
            <V
                f="dur"
                init={dur}
            />
        </div>
        <div>
            <Cont pad={4} />
            {'= '}
            <V
                f="local"
                init={zero}
            />
            {' / '}
            <V
                f="dur"
                init={dur}
            />
        </div>
        <div>
            <Cont pad={4} />
            {'= '}
            <V
                f="frac"
                init={num(0, 4)}
            />
        </div>
        <div> </div>
        <div className="comment">{`// ${texts.angleComment}`}</div>
        <div>
            <Tok f="theta">angle</Tok>
            {' = from + '}
            <Tok f="frac">frac</Tok>
            {' * (to - from);'}
        </div>
        <div>
            <Cont pad={4} />
            {'= 0 + '}
            <V
                f="frac"
                init={num(0, 4)}
            />
            {' * (360 - 0)'}
        </div>
        <div>
            <Cont pad={4} />
            {'= '}
            <V
                f="theta"
                init={num(0, 1)}
            />
        </div>
    </div>
);
