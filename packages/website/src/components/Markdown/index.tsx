import { FC, HTMLAttributes, ReactElement } from 'react';

import { DemoBox } from '@samisdat/ui-components/DemoBox';
import { Grid } from '@samisdat/ui-components/Grid';
import { Stack } from '@samisdat/ui-components/Stack';
import { Typo } from '@samisdat/ui-components/Typo';

import { SandpackFiles } from '@codesandbox/sandpack-react';
import { Link } from '../Link';
import { Sandbox } from '../Sandbox';
import { SandPackCSS } from '../Sandbox/SandPackCSS';
import * as ClientDemos from './ClientAnimations';

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
        // Demo-Komponenten aus Registry: explizite Named Exports für MDX-Build-Zeit-Analyse
        DemoAnimationsCompare: ClientDemos.DemoAnimationsCompare,
        DemoAnimationsSvg: ClientDemos.DemoAnimationsSvg,
        DemoAnimationsCssJs: ClientDemos.DemoAnimationsCssJs,
        DemoAnimationsJsAttributes: ClientDemos.DemoAnimationsJsAttributes,
        DemoAnimationsMorphThumb: ClientDemos.DemoAnimationsMorphThumb,
        DemoAnimationsMorphCoffee: ClientDemos.DemoAnimationsMorphCoffee,
        DemoAnimationsMorphUgly: ClientDemos.DemoAnimationsMorphUgly,
        DemoParallaxSectors: ClientDemos.DemoParallaxSectors,
        DemoParallaxHills: ClientDemos.DemoParallaxHills,
        DemoParallaxCircles: ClientDemos.DemoParallaxCircles,
    };

    const hasSandbox = sandboxFiles && Object.keys(sandboxFiles).length > 0;

    return (
        <div>
            {hasSandbox && <SandPackCSS />}
            <MDXContent components={components} />
        </div>
    );
};
