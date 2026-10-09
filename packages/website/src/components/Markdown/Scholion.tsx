'use client'
import type { ReactNode } from 'react'
import { ScholionProvider } from '@samisdat/codeprose/scholion/runtime'

export function Scholion({ children, contentKey }: { children: ReactNode; contentKey?: string }) {
    return <ScholionProvider contentKey={contentKey}>{children}</ScholionProvider>
}
