import { Heading } from '@samisdat/ui-components/Heading';
import { Typo } from '@samisdat/ui-components/Typo';
import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <Heading level={1}>404 — Seite nicht gefunden</Heading>
            <Typo>Die angeforderte Seite existiert nicht oder wurde verschoben.</Typo>
            <Typo>
                <Link href="/">Zurück zur Startseite</Link>
            </Typo>
        </>
    );
}
