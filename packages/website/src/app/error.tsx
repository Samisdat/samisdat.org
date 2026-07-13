'use client';

import { Heading } from '@samisdat/ui-components/Heading';
import { Typo } from '@samisdat/ui-components/Typo';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <>
            <Heading level={1}>Etwas ist schiefgelaufen</Heading>
            <Typo>
                Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es
                erneut.
            </Typo>
            <button
                onClick={reset}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    border: '1px solid currentColor',
                    background: 'transparent',
                    color: 'inherit',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '1rem',
                }}
            >
                Erneut versuchen
            </button>
        </>
    );
}
