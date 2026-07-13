import type { Metadata } from 'next';

import { ObfuscatedEmail } from '@/components/ObfuscatedEmail';
import { SITE_AUTHOR } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Impressum',
};

export default function ImpressumPage() {
    return (
        <>
            <h1>Impressum</h1>

            <h2>Angaben gemäß § 5 DDG</h2>
            <address>
                {SITE_AUTHOR}
                <br />
                [Straße Hausnummer]
                <br />
                [PLZ] Wuppertal
            </address>

            <h2>Kontakt</h2>
            <p>
                E-Mail: <ObfuscatedEmail />
            </p>

            <h2>Verantwortlich für den Inhalt</h2>
            <p>{SITE_AUTHOR}</p>
        </>
    );
}
