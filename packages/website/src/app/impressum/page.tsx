import type { Metadata } from 'next';
import Link from 'next/link';

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
                Haus Düssel 28
                <br />
                42489 Wülfrath
            </address>

            <h2>Kontakt</h2>
            <p>
                E-Mail: <ObfuscatedEmail />
            </p>

            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <address>
                {SITE_AUTHOR}
                <br />
                Haus Düssel 28
                <br />
                42489 Wülfrath
            </address>

            <h2>Datenschutz</h2>
            <p>
                Informationen zur Verarbeitung personenbezogener Daten findest du in der{' '}
                <Link href="/datenschutz">Datenschutzerklärung</Link>.
            </p>
        </>
    );
}
