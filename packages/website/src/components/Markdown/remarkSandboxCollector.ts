import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

/**
 * Remark plugin that extracts sandbox names from <Sandbox name="..." /> elements
 * in MDX by traversing the AST instead of using regex.
 */
export interface SandboxCollectorOptions {
    sandboxNames: string[];
}

export const remarkSandboxCollector: Plugin<[SandboxCollectorOptions], Root> = options => {
    return tree => {
        visit(tree, 'mdxJsxFlowElement', (node: any) => {
            // Only look for <Sandbox> elements
            if (node.name !== 'Sandbox') {
                return;
            }

            // Find the 'name' attribute
            const nameAttr = node.attributes?.find(
                (attr: any) => attr.type === 'mdxJsxAttribute' && attr.name === 'name'
            );

            if (!nameAttr) {
                return;
            }

            // Extract the value
            let sandboxName: string | undefined;

            if (typeof nameAttr.value === 'string') {
                // name="literal-string"
                sandboxName = nameAttr.value;
            } else if (nameAttr.value?.type === 'mdxJsxAttributeValueExpression') {
                // name={'string'} or name={variable}
                const expression = nameAttr.value.value;
                // Extract string literals from JSX expressions like {'my-sandbox'}
                const stringMatch = expression.match(/^['"](.+?)['"]$/);
                if (stringMatch) {
                    sandboxName = stringMatch[1];
                }
                // For variables or complex expressions, we can't extract at build time
                // This is intentional - we want to enforce static names
            }

            if (sandboxName) {
                options.sandboxNames.push(sandboxName);
            }
        });
    };
};
