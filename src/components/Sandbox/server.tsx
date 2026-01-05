import { Sandbox } from '.';
import { SandboxProps } from './props';
import { getSandpackFiles } from './getSandpackFiles';

export async function SandpackServer({ slug, name, template = 'react-ts', ...props }: SandboxProps) {
    const files = await getSandpackFiles({ slug, name, template });
    console.log(files);
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
