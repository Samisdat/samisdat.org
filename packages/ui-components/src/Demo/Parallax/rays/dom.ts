/** Writes attributes straight into the DOM. Views use it per frame instead of re-rendering. */
export const setAttrs = (el: Element | null | undefined, attrs: Record<string, string>) => {
    if (!el) {
        return;
    }
    for (const [name, value] of Object.entries(attrs)) {
        el.setAttribute(name, value);
    }
};
