import { styled } from '@linaria/react';
import { ComponentType, SVGProps } from 'react';

import { GhostPoint, Trail } from './Guides';
import { badSquarePath, circlePath, goodSquarePath, middleSquarePath } from './paths';
import { PointGroup } from './PointGroup';

const MorphPath = styled.path`
    fill: none;
    stroke: currentColor;
    stroke-width: 4;
    stroke-linejoin: round;
    stroke-linecap: round;
`;
export const caseType = ['good', 'middle', 'bad'] as const;
export type CaseType = (typeof caseType)[number];

const Good = styled.g`
    color: var(--color-ink-jade);
`;

const Middle = styled.g`
    color: var(--color-ink-gold);
`;

const Bad = styled.g`
    color: var(--color-ink-ruby);
`;

type CaseGroupComponent = ComponentType<SVGProps<SVGGElement>>;

export const caseComponent: Record<CaseType, CaseGroupComponent> = {
    good: Good,
    middle: Middle,
    bad: Bad,
};

const animations = (xName: string, yName: string, cxValues: string, cyValues: string) => (
    <>
        <animate
            attributeName={xName}
            dur="3s"
            repeatCount="indefinite"
            values={cxValues}
        />
        <animate
            attributeName={yName}
            dur="3s"
            repeatCount="indefinite"
            values={cyValues}
        />
    </>
);

const Point = ({ label, cxValues, cyValues }: { label: string; cxValues: string; cyValues: string }) => {
    const cx = cxValues.split(';')[0].trim();
    const cy = cyValues.split(';')[0].trim();

    return (
        <PointGroup>
            <circle
                cx={cx}
                cy={cy}
                r={15}
            >
                {animations('cx', 'cy', cxValues, cyValues)}
            </circle>

            <text
                x={cx}
                y={cy}
            >
                {label}
                {animations('x', 'y', cxValues, cyValues)}
            </text>
        </PointGroup>
    );
};

const MorphShape = ({ morphTo }: { morphTo: string }) => (
    <MorphPath d={circlePath}>
        <animate
            attributeName="d"
            dur="3s"
            repeatCount="indefinite"
            values={`${circlePath};${morphTo};${circlePath}`}
        />
    </MorphPath>
);

type PointDef = {
    label: string;
    cxValues: string;
    cyValues: string;
};

const Case = ({
    type,
    x,
    morphTo,
    points,
    showGuides,
}: {
    type: CaseType;
    x: number;
    morphTo: string;
    points: PointDef[];
    showGuides: boolean;
}) => {
    const CaseWrapper = caseComponent[type];

    return (
        <CaseWrapper transform={`translate(${x}, 0)`}>
            <g
                opacity={showGuides ? 1 : 0}
                pointerEvents={showGuides ? 'auto' : 'none'}
            >
                {points.map(({ label, cxValues, cyValues }) => {
                    const [startCx, endCx] = cxValues.split(';').map(value => value.trim());
                    const [startCy, endCy] = cyValues.split(';').map(value => value.trim());

                    return (
                        <g key={label}>
                            <Trail
                                phase="outbound"
                                cxValues={cxValues}
                                cyValues={cyValues}
                                targetCx={endCx}
                                targetCy={endCy}
                            />
                            <Trail
                                phase="return"
                                cxValues={cxValues}
                                cyValues={cyValues}
                                targetCx={startCx}
                                targetCy={startCy}
                            />
                            <GhostPoint
                                phase="outbound"
                                label={label}
                                cx={endCx}
                                cy={endCy}
                            />
                            <GhostPoint
                                phase="return"
                                label={label}
                                cx={startCx}
                                cy={startCy}
                            />
                        </g>
                    );
                })}
            </g>
            <MorphShape morphTo={morphTo} />
            {points.map(({ label, cxValues, cyValues }) => (
                <Point
                    key={label}
                    label={label}
                    cxValues={cxValues}
                    cyValues={cyValues}
                />
            ))}
        </CaseWrapper>
    );
};

export const MorphMistakesSvg = ({ showGuides = false }: { showGuides?: boolean } = {}) => (
    <svg viewBox="0 0 900 300">
        <Case
            type="good"
            x={0}
            morphTo={goodSquarePath}
            showGuides={showGuides}
            points={[
                { label: 'A', cxValues: '150;60;150', cyValues: '35;60;35' },
                { label: 'B', cxValues: '265;240;265', cyValues: '150;60;150' },
                { label: 'C', cxValues: '150;240;150', cyValues: '265;240;265' },
                { label: 'D', cxValues: '35;60;35', cyValues: '150;240;150' },
            ]}
        />
        <Case
            type="middle"
            x={300}
            morphTo={middleSquarePath}
            showGuides={showGuides}
            points={[
                { label: 'A', cxValues: '150;240;150', cyValues: '35;240;35' },
                { label: 'B', cxValues: '265;60;265', cyValues: '150;240;150' },
                { label: 'C', cxValues: '150;60;150', cyValues: '265;60;265' },
                { label: 'D', cxValues: '35;240;35', cyValues: '150;60;150' },
            ]}
        />
        <Case
            type="bad"
            x={600}
            morphTo={badSquarePath}
            showGuides={showGuides}
            points={[
                { label: 'A', cxValues: '150;60;150', cyValues: '35;60;35' },
                { label: 'B', cxValues: '265;240;265', cyValues: '150;240;150' },
                { label: 'C', cxValues: '150;240;150', cyValues: '265;60;265' },
                { label: 'D', cxValues: '35;60;35', cyValues: '150;240;150' },
            ]}
        />
    </svg>
);
