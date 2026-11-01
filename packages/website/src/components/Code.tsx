'use client';

import { useDemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react';

export const Code: FC<HTMLAttributes<HTMLPreElement>> = ({ children, ...props }) => {
    const ref = useRef<HTMLPreElement>(null);
    const values = useDemoContext()?.values;
    const [scrollable, setScrollable] = useState(false);

    // A horizontally scrolling block must be reachable by keyboard; Safari does not focus scroll containers itself
    useEffect(() => {
        const pre = ref.current;
        if (!pre) return;
        const check = () => setScrollable(pre.scrollWidth > pre.clientWidth);
        check();
        const observer = new ResizeObserver(check);
        observer.observe(pre);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!values || !ref.current) return;
        for (const [key, value] of Object.entries(values)) {
            for (const span of ref.current.querySelectorAll<HTMLElement>(`[data-placeholder="${key}"]`)) {
                span.textContent = value;
            }
        }
    }, [values]);

    return (
        <pre
            ref={ref}
            tabIndex={scrollable ? 0 : undefined}
            {...props}
        >
            {children}
        </pre>
    );
};
