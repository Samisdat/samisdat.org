import type { ReactNode } from 'react';

/** Demo-like stage: the ghost components expect a 150x100 viewBox. */
export const Stage = ({ children }: { children: ReactNode }) => (
    <svg
        viewBox="0 0 150 100"
        width={450}
        style={{
            display: 'block',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-surface-raised)',
        }}
    >
        {children}
    </svg>
);
