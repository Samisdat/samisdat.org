import { FC, HTMLAttributes } from 'react';

import { DemoBox } from '@samisdat/ui-components/DemoBox';
import { Grid } from '@samisdat/ui-components/Grid';
import { Stack } from '@samisdat/ui-components/Stack';
import { Typo } from '@samisdat/ui-components/Typo';

import { SandpackFiles } from '@codesandbox/sandpack-react';
import { Link } from '../Link';
import { Sandbox } from '../Sandbox';
import { SandPackCSS } from '../Sandbox/SandPackCSS';
import {
    DemoAnimationsCompare,
    DemoAnimationsCss,
    DemoAnimationsCssJs,
    DemoAnimationsJsAttributes,
    DemoAnimationsMorphCoffee,
    DemoAnimationsMorphThumb,
    DemoAnimationsMorphUgly,
    DemoAnimationsSvg,
    DemoParallaxCircles,
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
        DemoBox: (props: any) => {
            return <DemoBox {...props} />;
        },
        Grid: (props: any) => {
            return <Grid {...props} />;
        },
        Stack: (props: any) => {
            return <Stack {...props} />;
        },
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
        DemoAnimationsMorphThumb: () => <DemoAnimationsMorphThumb />,
        DemoAnimationsMorphCoffee: () => <DemoAnimationsMorphCoffee />,
        DemoAnimationsMorphUgly: () => <DemoAnimationsMorphUgly />,
        DemoParallaxSectors: () => <DemoParallaxSectors />,
        DemoParallaxHills: () => <DemoParallaxHills />,
        DemoParallaxCircles: () => <DemoParallaxCircles />,
    };

    const hasSandbox = sandboxFiles && Object.keys(sandboxFiles).length > 0;

    return (
        <div>
            {hasSandbox && <SandPackCSS />}
            <MDXContent components={components} />
        </div>
    );
};
