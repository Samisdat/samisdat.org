'use client';

import { styled } from '@linaria/react';
import { Fragment, useEffect, useState } from 'react';

/**
 * Char-codes, aufgeteilt in user + domain — kein lesbarer String im Bundle.
 * Zusammengebaut wird erst client-seitig im useEffect.
 */
const _u = [98, 97, 115, 116, 105, 97, 110]; // bastian
const _s = [64]; // @
const _d = [112, 101, 114, 116, 122, 46, 101, 117]; // pertz.eu

const Wrapper = styled.span`
    display: inline;
    user-select: text;
    cursor: text;
`;

const Glyph = styled.span`
    font-size: 0;
    color: transparent;

    &::after {
        content: var(--c);
        font-size: var(--typo-body-size, 1rem);
        color: var(--color-foreground);
    }
`;

/** Decoy-Spans: im DOM vorhanden, visuell und für Screenreader unsichtbar */
const Decoy = styled.span`
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    pointer-events: none;
`;

const NOISE = ['info', 'mail', 'nope', 'xyz'];

/**
 * Zeigt eine E-Mail-Adresse an, ohne dass sie im SSR-HTML, im DOM-Text
 * oder als lesbarer String im Quelltext auftaucht.
 *
 * - useEffect → kein SSR-Output (Bots ohne JS sehen nichts)
 * - Leere <span> + CSS ::after mit custom property → kein textContent
 * - Decoy-Spans zwischen den echten Glyphen → Noise für Regex-Scraper
 */
export function ObfuscatedEmail() {
    const [chars, setChars] = useState<string[]>([]);

    useEffect(() => {
        setChars([..._u, ..._s, ..._d].map((c) => String.fromCharCode(c)));
    }, []);

    if (chars.length === 0) return null;

    return (
        <Wrapper>
            {chars.map((ch, i) => (
                <Fragment key={i}>
                    {i % 4 === 0 && (
                        <Decoy aria-hidden="true">{NOISE[i % NOISE.length]}</Decoy>
                    )}
                    <Glyph
                        style={{ '--c': `"${ch}"` } as React.CSSProperties}
                    />
                </Fragment>
            ))}
        </Wrapper>
    );
}
