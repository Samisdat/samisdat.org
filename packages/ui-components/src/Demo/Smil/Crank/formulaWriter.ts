export type FormulaField = 't' | 'dur' | 'local' | 'frac' | 'theta' | 'measured';

export type FormulaValues = Record<FormulaField, string>;

const FLASH_FIELDS: FormulaField[] = ['dur', 'frac', 'theta'];

/**
 * Writes straight into the DOM nodes rendered by <DemoAnimationsCrankFormula>, so the
 * per-frame updates never go through React.
 */
export const createFormulaWriter = (root: HTMLElement) => {
    const fields = new Map<string, HTMLElement[]>();
    root.querySelectorAll<HTMLElement>('[data-f]').forEach(node => {
        const name = node.dataset.f as string;
        fields.set(name, [...(fields.get(name) ?? []), node]);
    });

    const last = new Map<string, string>();
    const set = (name: string, text: string) => {
        if (last.get(name) === text) {
            return;
        }
        last.set(name, text);
        fields.get(name)?.forEach(node => {
            node.textContent = text;
        });
    };

    // Replacing a live value's text collapses a selection that ends inside it, so
    // the last value would be missing from a copy. Hold per-frame writes while
    // the user has a selection on the formula; the next frame after it is
    // cleared catches up.
    const hasSelection = () => {
        const selection = root.ownerDocument.getSelection();
        return !!selection && !selection.isCollapsed && selection.containsNode(root, true);
    };

    return {
        write: (values: FormulaValues) => {
            if (hasSelection()) {
                return;
            }
            (Object.keys(values) as FormulaField[]).forEach(name => set(name, values[name]));
        },
        setJump: (lines: string[]) => {
            set('jump', lines.join('\n'));
        },
        flash: () => {
            FLASH_FIELDS.forEach(name =>
                fields.get(name)?.forEach(node =>
                    node.animate(
                        [
                            {
                                backgroundColor: 'color-mix(in oklch, currentColor 45%, transparent)',
                            },
                            { backgroundColor: 'transparent' },
                        ],
                        { duration: 700, easing: 'ease-out' }
                    )
                )
            );
        },
    };
};

export type FormulaWriter = ReturnType<typeof createFormulaWriter>;
