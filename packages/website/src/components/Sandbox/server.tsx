import { Sandbox } from '.';
import { getSandpackFiles } from './getSandpackFiles';
import { SandboxProps } from './props';

export async function SandpackServer({ slug, name, template = 'react-ts', ...props }: SandboxProps) {
    const files = await getSandpackFiles({ slug, name, template });

    return (
        <Sandbox
            slug={slug}
            name={name}
            files={files}
            template={template}
            {...props}
        />
    );
}
