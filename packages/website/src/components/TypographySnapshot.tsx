'use client';

import { styled } from '@linaria/react';
import { useSiteMode } from '@samisdat/ui-components/ColorSchemeSnapshot';
import { Segmented } from '@samisdat/ui-components/Segmented';
import { FC, useState } from 'react';

import { presetFontNames, presetStyle } from '@/lib/typography/data';
import type { PresetId } from '@/lib/typography/ids';
import { fontClasses } from '@/lib/typography/presets';
import type { TypographySnapshot as Data } from '@/lib/typography/snapshot-types';

import { PostProse } from './PostLayout';
import { TypeSpecimenText } from './TypeSpecimen';

type Mode = 'dark' | 'light';

// The bar uses the site's own colors; everything below it only the snapshot's (see colorVars),
// so the content never follows the site theme. Same frame as the color scheme snapshot.
const Figure = styled.figure`
    margin: 2rem 0;
    border: 1px solid var(--color-border-default);
    border-radius: 12px;
    overflow: hidden;
    background: var(--color-surface-default);
`;

const Bar = styled.figcaption`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem 1rem;
    padding: 0.5rem 0.75rem;
    background: var(--color-surface-raised);
    color: var(--color-text-secondary);
    border-bottom: 1px solid var(--color-border-default);
    font-size: 0.8125rem;
`;

const Stamp = styled.span`
    font-family: var(--font-code, ui-monospace, Menlo, monospace);
    font-size: 0.75rem;

    b {
        font-weight: 600;
        color: var(--color-text-default);
    }
`;

const Body = styled.div`
    padding: clamp(0.75rem, 2.5vw, 1.5rem);
    display: grid;

    /* minmax(0, ...): long lines and code scroll or wrap inside the column instead of widening it */
    grid-template-columns: minmax(0, 1fr);
    gap: 1rem;
    background: var(--color-surface-default);
    color: var(--color-text-default);
    isolation: isolate;
    transition: background-color 0.3s;
`;

const FontLine = styled.p`
    margin: 0;
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0;
    color: var(--color-text-secondary);
`;

/** `text.default` -> `--color-text-default`: the frozen values replace the site tokens inside the frame. */
const colorVars = (colors: Record<string, string>) =>
    Object.fromEntries(Object.entries(colors).map(([id, hex]) => [`--color-${id.replace(/\./g, '-')}`, hex]));

const modeOptions = [
    { value: 'dark', label: 'Dunkel' },
    { value: 'light', label: 'Hell' },
] as const;

export const TypographySnapshot: FC<{ data: Data }> = ({ data }) => {
    // Starts with the site theme and follows it until the reader picks a mode here.
    const site = useSiteMode();
    const [chosen, setMode] = useState<Mode | null>(null);
    const mode = chosen ?? site;
    const [id, setId] = useState<PresetId>(data.defaultPreset);
    const preset = data.presets.find(p => p.id === id) ?? data.presets[0];
    const names = presetFontNames(preset);

    return (
        <Figure data-snapshot={data.id}>
            <Bar>
                <Stamp>
                    Eingefrorener Stand <b>{data.id}</b> · {data.date} · {data.git.commit}
                    {data.git.dirty ? '+' : ''} · Farben {data.colors.source}
                </Stamp>
                <Segmented
                    label="Modus der Farben"
                    value={mode}
                    options={modeOptions}
                    onChange={setMode}
                />
            </Bar>
            <Body style={colorVars(data.colors[mode]) as React.CSSProperties}>
                <Segmented
                    label="Typography preset"
                    value={id}
                    options={data.presets.map(({ id: value, label }) => ({ value, label }))}
                    onChange={setId}
                    variant="chips"
                />
                <FontLine>
                    Headline: {names.head} · Text: {names.body} · Mono: {names.mono} · Akzent: {names.em}
                </FontLine>
                <PostProse
                    className={fontClasses(data.fonts)}
                    style={presetStyle(preset)}
                    data-typography={preset.id}
                >
                    <TypeSpecimenText />
                </PostProse>
            </Body>
        </Figure>
    );
};
