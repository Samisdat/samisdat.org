'use client';

import { styled } from '@linaria/react';
import { Heading } from '@samisdat/ui-components/Heading';
import { Lead } from '@samisdat/ui-components/Lead';
import { Segmented } from '@samisdat/ui-components/Segmented';
import { Typo } from '@samisdat/ui-components/Typo';
import { CSSProperties, FC, useState } from 'react';

import {
    ALL_FONT_CLASSES,
    PRESETS,
    presetFontNames,
    presetStyle,
    resolvePreset,
    type PresetId,
} from '@/lib/typography/presets';

import { Link } from './Link';
import { PostProse } from './PostLayout';

const SwitcherSlot = styled.div`
    margin-block-end: 12px;
`;

// Specimen chrome stays in the site font: only the text block below changes with the preset
const FontLine = styled.p`
    margin: 0 0 24px;
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    letter-spacing: 0;
    color: var(--color-text-secondary);
`;

const token = (name: string): CSSProperties => ({ color: `var(--color-syntax-${name})` });

const Ideas = styled.span`
    color: var(--color-ink-rose);
`;

/** The text block alone; it takes its fonts from the surrounding preset variables. */
export const TypeSpecimenText: FC = () => (
    <>
        <Heading level={1}>Hallo</Heading>
        {/* One wrapper like MDX output: lead and paragraphs are siblings, so paragraph margins apply */}
        <div>
            <Lead>
                <p>
                    Ein Blog über <Ideas>Ideen</Ideas>, die beim Bauen entstehen: kurz genug zum Lesen, genau genug zum
                    Nachbauen.
                </p>
            </Lead>
            <Typo variant="p">
                Lorem ipsum dolor sit amet, <Typo variant="em">consectetur adipiscing</Typo> elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat — Größe, Maß und Straße, „typografische“
                Anführungszeichen inklusive.
            </Typo>
            <Typo variant="p">
                Duis aute irure dolor in reprehenderit in <Typo variant="em">voluptate velit</Typo> esse cillum dolore.
                Der Fortschritt steckt in <code>--theme-progress</code>, mehr dazu auf der{' '}
                <Link href="/">Startseite</Link>. Excepteur sint occaecat cupidatat non proident.
            </Typo>
            <Heading level={3}>Vestibulum cursus</Heading>
            <Typo variant="p">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam
                rem aperiam, eaque ipsa quae ab illo inventore veritatis.
            </Typo>
            <pre>
                <code>
                    <span style={token('comment')}>{'// Turns a theme into CSS custom properties'}</span>
                    {'\n'}
                    <span style={token('keyword')}>export function</span> <span style={token('function')}>toCSS</span>
                    <span style={token('punctuation')}>(</span>
                    <span style={token('parameter')}>theme</span>
                    <span style={token('punctuation')}>:</span> <span style={token('type')}>Theme</span>
                    <span style={token('punctuation')}>)</span>
                    <span style={token('punctuation')}>:</span> <span style={token('type')}>string</span>{' '}
                    <span style={token('punctuation')}>{'{'}</span>
                    {'\n  '}
                    <span style={token('keyword')}>const</span> <span style={token('variable')}>rules</span>{' '}
                    <span style={token('operator')}>=</span> <span style={token('type')}>Object</span>.
                    <span style={token('function')}>entries</span>
                    <span style={token('punctuation')}>(</span>
                    <span style={token('parameter')}>theme</span>
                    <span style={token('punctuation')}>)</span>.<span style={token('function')}>map</span>
                    <span style={token('punctuation')}>(([</span>
                    <span style={token('parameter')}>key</span>, <span style={token('parameter')}>value</span>
                    <span style={token('punctuation')}>])</span> <span style={token('operator')}>=&gt;</span>{' '}
                    <span style={token('string')}>{'`--theme-${key}: ${value};`'}</span>
                    <span style={token('punctuation')}>)</span>;{'\n  '}
                    <span style={token('keyword')}>return</span>{' '}
                    <span style={token('string')}>{'`:root {\\n  ${rules.join("\\n  ")}\\n}`'}</span>;{'\n'}
                    <span style={token('punctuation')}>{'}'}</span>
                    {'\n'}
                    <span style={token('comment')}>{'/* 0O 1lI {} [] => */'}</span>
                </code>
            </pre>
            <Typo
                variant="p"
                style={{ fontStyle: 'italic' }}
            >
                Und zum Schluss ein kursiver Absatz: Sed quia consequuntur magni dolores eos qui ratione voluptatem
                sequi nesciunt, neque porro quisquam est.
            </Typo>
        </div>
    </>
);

interface TypeSpecimenProps {
    /** Preset shown first; also read from `?preset=` on the lab page. */
    initial?: string;
    /** Mirror the selection into the URL so variants can be linked. */
    syncUrl?: boolean;
}

export const TypeSpecimen: FC<TypeSpecimenProps> = ({ initial, syncUrl = false }) => {
    const [id, setId] = useState<PresetId>(() => resolvePreset(initial).id);
    const preset = resolvePreset(id);
    const names = presetFontNames(preset);

    const select = (next: PresetId) => {
        setId(next);
        if (syncUrl) {
            const url = new URL(window.location.href);
            url.searchParams.set('preset', next);
            window.history.replaceState(null, '', url);
        }
    };

    return (
        <section aria-label="Typography specimen">
            <SwitcherSlot>
                <Segmented
                    label="Typography preset"
                    value={id}
                    options={PRESETS.map(({ id: value, label }) => ({ value, label }))}
                    onChange={select}
                    variant="chips"
                />
            </SwitcherSlot>
            <FontLine>
                Headline: {names.head} · Text: {names.body} · Mono: {names.mono} · Akzent: {names.em}
            </FontLine>
            <PostProse
                className={ALL_FONT_CLASSES}
                style={presetStyle(preset)}
                data-typography={preset.id}
            >
                <TypeSpecimenText />
            </PostProse>
        </section>
    );
};
