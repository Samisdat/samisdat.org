'use client'

import { FC, HTMLAttributes, useEffect, useRef } from 'react'
import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext'

export const Code: FC<HTMLAttributes<HTMLPreElement>> = ({ children, ...props }) => {
    const ref = useRef<HTMLPreElement>(null)
    const ctx = useDemoContext()

    useEffect(() => {
        if (!ctx || !ref.current) return
        for (const [key, value] of Object.entries(ctx.values)) {
            for (const span of ref.current.querySelectorAll<HTMLElement>(`[data-placeholder="${key}"]`)) {
                span.textContent = value
            }
        }
    }, [ctx?.values])

    return (
        <pre ref={ref} {...props}>
            {children}
        </pre>
    )
}
