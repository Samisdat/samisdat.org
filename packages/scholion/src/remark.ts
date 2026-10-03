import type { Code, Link, Paragraph, Parent, PhrasingContent, Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'
import { parseScholionMeta } from './parse-meta.ts'
import type { ScholionRef } from './types.ts'

// Custom node types that mdast-util-to-hast's unknownHandler will convert
// via data.hName + data.hProperties + children recursion.
type HastMappedNode = {
    type: string
    data: { hName: string; hProperties: Record<string, unknown> }
    children: PhrasingContent[]
}

function makeHastNode(hName: string, props: Record<string, unknown>, children: PhrasingContent[]): HastMappedNode {
    return { type: `scholion-${hName}`, data: { hName, hProperties: props }, children }
}

function transformChildren(children: PhrasingContent[], refId: string): PhrasingContent[] {
    return children.map(child => {
        if (child.type === 'link') {
            const frag = child.url?.startsWith('#') ? child.url.slice(1) : null
            if (frag === refId) {
                return makeHastNode(
                    'span',
                    { className: ['ref-target'], 'data-ref': refId },
                    child.children as PhrasingContent[]
                ) as unknown as PhrasingContent
            }
        }
        return child
    })
}

function generateCss(refs: ScholionRef[]): string {
    return refs
        .map(ref =>
            [
                `:has([data-ref="${ref.id}"]:is(.ref-target:hover,.ref-target:focus-visible,a.ref:hover,a.ref:focus-visible)) [data-ref="${ref.id}"] {
  background: var(--scholion-hover-bg);
}`,
                `:has([data-explains="${ref.id}"]:hover) a.ref[data-ref="${ref.id}"] {
  outline: var(--scholion-b-outline);
  outline-offset: 2px;
}`,
                `:root[data-scholion-pin="${ref.id}"] [data-ref="${ref.id}"] {
  background: var(--scholion-hover-bg);
}`,
                `:root[data-scholion-pin="${ref.id}"] a.ref[data-ref="${ref.id}"] {
  outline: var(--scholion-b-outline);
  outline-offset: 2px;
}`,
                `.ref-target[data-ref="${ref.id}"] {
  color: var(--scholion-color-${ref.id}, var(--color-teal));
}`,
            ].join('\n')
        )
        .join('\n')
}

export const remarkScholion: Plugin<[], Root> = () => {
    return (tree, file) => {
        // Pass 1: collect all scholion refs from code fences
        const refMap = new Map<string, ScholionRef>()
        visit(tree, 'code', (node: Code) => {
            if (!node.meta) return
            for (const ref of parseScholionMeta(node.meta)) {
                refMap.set(ref.id, ref)
            }
        })
        if (refMap.size === 0) return

        // Pass 2: transform explanation paragraphs
        const explainedRefs = new Set<string>()
        visit(tree, 'paragraph', (node: Paragraph) => {
            const firstRefId = findFirstScholionRef(node.children, refMap)
            if (!firstRefId) return

            const ref = refMap.get(firstRefId)!
            explainedRefs.add(firstRefId)
            const displayLabel = ref.pattern.replace(/^<\/?/, '')

            // Annotate paragraph with explain attributes (paragraph handler uses data.hProperties)
            node.data = {
                ...node.data,
                hProperties: {
                    id: `explain-${firstRefId}`,
                    'data-explains': firstRefId,
                    tabIndex: -1,
                },
            }

            // Replace children: [descSpan, backlink]
            const descSpan = makeHastNode(
                'span',
                { id: `desc-${firstRefId}` },
                transformChildren(node.children, firstRefId)
            )
            const backlink: Link = {
                type: 'link',
                url: `#ref-${firstRefId}`,
                data: {
                    hProperties: {
                        className: ['backref'],
                        ariaLabel: `Zurück zum Code: ${displayLabel}`,
                    },
                },
                children: [{ type: 'text', value: 'Zum Code' }],
            }

            node.children = [descSpan as unknown as PhrasingContent, backlink as PhrasingContent]
        })

        // Validate: refs without any explanation
        for (const [id] of refMap) {
            if (!explainedRefs.has(id)) {
                file.message(`scholion: ref "${id}" is never explained in prose`)
            }
        }

        // Inject per-ref :has() CSS as a custom node (unknownHandler → <style>)
        const css = generateCss([...refMap.values()])
        const styleNode = {
            type: 'scholion-style-inject',
            data: { hName: 'style', hProperties: {} },
            children: [{ type: 'text', value: css }],
        }
        ;(tree as Parent).children.push(styleNode as unknown as Root['children'][number])
    }
}

function findFirstScholionRef(
    children: PhrasingContent[],
    refMap: Map<string, ScholionRef>
): string | null {
    for (const child of children) {
        if (child.type === 'link') {
            const frag = child.url?.startsWith('#') ? child.url.slice(1) : null
            if (frag && refMap.has(frag)) return frag
        }
    }
    return null
}
