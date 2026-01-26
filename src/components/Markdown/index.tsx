import { FC, HTMLAttributes } from 'react';

import { Typo } from '@/components/Typo';

import { SandpackFiles } from '@codesandbox/sandpack-react';
import { Link } from '../Link';
import { Sandbox } from '../Sandbox';
import {
    DemoAnimationsCompare,
    DemoAnimationsCss,
    DemoAnimationsCssJs,
    DemoAnimationsJsAttributes,
    DemoAnimationsMorph,
    DemoAnimationsSvg,
    DemoParallaxHills,
    DemoParallaxSectors,
} from './ClientAnimations';

interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
    MDXContent: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
    slug?: string;
    mdxDir?: string;
    sandboxFiles?: Record<string, SandpackFiles>;
}

export const Markdown: FC<MarkdownProps> = ({ MDXContent, slug, mdxDir, sandboxFiles }) => {
    const components = {
        p: (props: any) => (
            <Typo
                variant="p"
                {...props}
            />
        ),
        em: (props: any) => (
            <Typo
                variant="em"
                {...props}
            />
        ),
        strong: (props: any) => (
            <Typo
                variant="strong"
                {...props}
            />
        ),
        a: (props: any) => <Link {...props} />,
        Sandbox: (props: any) => {
            const files = sandboxFiles?.[props.name];
            return (
                <Sandbox
                    {...props}
                    files={files}
                />
            );
        },
        DemoAnimationsCss: () => <DemoAnimationsCss />,
        DemoAnimationsCssJs: () => <DemoAnimationsCssJs />,
        DemoAnimationsSvg: () => <DemoAnimationsSvg />,
        DemoAnimationsJsAttributes: () => <DemoAnimationsJsAttributes />,
        DemoAnimationsCompare: () => <DemoAnimationsCompare />,
        DemoAnimationsMorph: () => <DemoAnimationsMorph />,
        DemoParallaxSectors: () => <DemoParallaxSectors />,
        DemoParallaxHills: () => <DemoParallaxHills />,
    };

    return (
        <div>
            <MDXContent components={components} />
        </div>
    );
};
