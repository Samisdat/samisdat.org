import { describe, expect, it } from 'vitest';

import { remarkSandboxCollector } from '../remarkSandboxCollector';

import type { Root } from 'mdast';

const sandbox = (attributes: unknown[], name = 'Sandbox') => ({ type: 'mdxJsxFlowElement', name, attributes });
const nameAttr = (value: unknown) => ({ type: 'mdxJsxAttribute', name: 'name', value });

const collect = (...children: unknown[]): string[] => {
    const sandboxNames: string[] = [];
    const tree = { type: 'root', children } as unknown as Root;
    // The unified Plugin type expects a processor as `this`; the collector does not use it.
    const attach = remarkSandboxCollector as unknown as (options: { sandboxNames: string[] }) => (tree: Root) => void;
    attach({ sandboxNames })(tree);
    return sandboxNames;
};

describe('remarkSandboxCollector', () => {
    it('collects literal names in document order', () => {
        expect(collect(sandbox([nameAttr('a')]), sandbox([nameAttr('b')]))).toEqual(['a', 'b']);
    });

    it('collects string literals inside expressions', () => {
        const expression = (value: string) => ({ type: 'mdxJsxAttributeValueExpression', value });

        expect(collect(sandbox([nameAttr(expression("'single'"))]), sandbox([nameAttr(expression('"double"'))]))).toEqual(
            ['single', 'double']
        );
    });

    it('ignores names that are not statically known', () => {
        const expression = { type: 'mdxJsxAttributeValueExpression', value: 'someVariable' };

        expect(collect(sandbox([nameAttr(expression)]))).toEqual([]);
    });

    it('ignores empty names, missing name attributes and other attributes', () => {
        expect(
            collect(
                sandbox([nameAttr('')]),
                sandbox([{ type: 'mdxJsxAttribute', name: 'template', value: 'react-ts' }]),
                sandbox([{ type: 'mdxJsxExpressionAttribute', value: '...props' }])
            )
        ).toEqual([]);
    });

    it('ignores other elements and elements without attributes', () => {
        const noAttributes = { type: 'mdxJsxFlowElement', name: 'Sandbox' };

        expect(collect(sandbox([nameAttr('x')], 'Other'), noAttributes)).toEqual([]);
    });
});
