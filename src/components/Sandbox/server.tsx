import { Sandbox } from '.';
import { SandboxProps } from './props';
import { getSandpackFiles } from './getSandpackFiles';

export async function SandpackServer({ slug, name, mdxDir, template = 'react-ts', ...props }: SandboxProps) {
    const files = await getSandpackFiles({ slug, name, mdxDir });
    console.log(files);
    return (
        <Sandbox
            slug={slug}
            name={name}
            mdxDir={mdxDir}
            files={files}
            template={template}
            {...props}
        />
    );
}
