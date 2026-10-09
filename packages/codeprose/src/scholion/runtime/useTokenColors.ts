import { useEffect, useState } from 'react'
import { readTokenColor, type Registry } from './scan'

function readColors(registry: Registry): Record<string, string> {
    return Object.fromEntries(registry.ids.map(id => [id, readTokenColor(registry.refs[id].a)]))
}

/**
 * Current token color per ref id. The color is not fixed: theme switches and the theme morph change
 * it after the scan, so it is read again whenever `<html>` changes (style, class, data-theme) or the
 * system color scheme flips. State only updates when a value actually changed, which also stops the
 * provider's own `--scholion-color-*` writes on `<html>` from looping back here.
 */
export function useTokenColors(registry: Registry): Record<string, string> {
    const [colors, setColors] = useState(() => readColors(registry))

    useEffect(() => {
        let raf = 0
        const refresh = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
                const next = readColors(registry)
                setColors(prev => (registry.ids.every(id => prev[id] === next[id]) ? prev : next))
            })
        }
        refresh()
        const observer = new MutationObserver(refresh)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class', 'data-theme'] })
        const scheme = matchMedia('(prefers-color-scheme: dark)')
        scheme.addEventListener('change', refresh)
        return () => {
            cancelAnimationFrame(raf)
            observer.disconnect()
            scheme.removeEventListener('change', refresh)
        }
    }, [registry])

    return colors
}
