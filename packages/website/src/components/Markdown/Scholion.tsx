'use client'
import type { ReactNode } from 'react'
import { ScholionProvider } from '@samisdat/codeprose/scholion/runtime'
import { useDockNodes } from '@samisdat/ui-components/Docks'

export function Scholion({ children, contentKey }: { children: ReactNode; contentKey?: string }) {
    const docks = useDockNodes()
    return (
        <ScholionProvider contentKey={contentKey} docks={docks}>
            {children}
        </ScholionProvider>
    )
}
