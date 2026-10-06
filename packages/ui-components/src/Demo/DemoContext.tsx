'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type CtxValue = {
    values: Record<string, string>
    setValue: (key: string, value: string) => void
}

const Ctx = createContext<CtxValue | null>(null)

export function useDemoContext() {
    return useContext(Ctx)
}

export function DemoContext({ children, ...props }: { children?: ReactNode; [k: string]: unknown }) {
    const initial = Object.fromEntries(
        Object.entries(props).filter(([, v]) => typeof v === 'string')
    ) as Record<string, string>

    const [values, setValues] = useState(initial)

    const setValue = (key: string, value: string) =>
        setValues(prev => ({ ...prev, [key]: value }))

    return <Ctx.Provider value={{ values, setValue }}>{children}</Ctx.Provider>
}
