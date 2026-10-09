'use client'

import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext'

export const Code: FC<HTMLAttributes<HTMLPreElement>> = ({ children, ...props }) => {
    const ref = useRef<HTMLPreElement>(null)
    const ctx = useDemoContext()
    const [scrollable, setScrollable] = useState(false)

    // A horizontally scrolling block must be reachable by keyboard; Safari does not focus scroll containers itself
    useEffect(() => {
        const pre = ref.current
        if (!pre) return
        const check = () => setScrollable(pre.scrollWidth > pre.clientWidth)
        check()
        const observer = new ResizeObserver(check)
        observer.observe(pre)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!ctx || !ref.current) return
        for (const [key, value] of Object.entries(ctx.values)) {
            for (const span of ref.current.querySelectorAll<HTMLElement>(`[data-placeholder="${key}"]`)) {
                span.textContent = value
            }
        }
    }, [ctx?.values])

    return (
        <pre ref={ref} tabIndex={scrollable ? 0 : undefined} {...props}>
            {children}
        </pre>
    )
}
