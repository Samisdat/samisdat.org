import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'

import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export const parseMarkdown = async (markdown: string): any => {

    const code = String(
        await compile(markdown, { outputFormat: 'function-body',remarkPlugins: [
                remarkFrontmatter,
                // `name` = wie der Export heißen soll:
                [remarkMdxFrontmatter, { name: 'frontmatter' }],
            ], })
    )

    // Run the compiled code with the runtime and get the default export
    const { default: MDXContent, frontmatter } = await run(code, {
        ...runtime,
        baseUrl: import.meta.url,
    })

    console.log(MDXContent, frontmatter)

    return {
        MDXContent,
        frontmatter
    }

}