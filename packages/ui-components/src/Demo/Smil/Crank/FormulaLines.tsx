import { num } from './formatNumbers';
import { Cont, Tok, V } from './FormulaParts';

export const FormulaLines = ({
    phaseComment,
    angleComment,
    dur,
}: {
    phaseComment: string;
    angleComment: string;
    dur: string;
}) => {
    const zero = num(0, 2);

    return (
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
            <div className="comment">{`// ${phaseComment}`}</div>
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
            <div className="comment">{`// ${angleComment}`}</div>
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
};
