import { FC, HTMLAttributes } from 'react';

import { DemoBox } from '@samisdat/ui-components/DemoBox';
import { DemoContext } from '@samisdat/ui-components/Demo/DemoContext';
import { Grid } from '@samisdat/ui-components/Grid';
import { Stack } from '@samisdat/ui-components/Stack';
import { Heading } from '@samisdat/ui-components/Heading';
import { Lead } from '@samisdat/ui-components/Lead';
import { Typo } from '@samisdat/ui-components/Typo';

import { SandpackFiles } from '@codesandbox/sandpack-react';
import { Code } from '../Code';
import { Link } from '../Link';
import { Sandbox } from '../Sandbox';
import { SandPackCSS } from '../Sandbox/SandPackCSS';
import * as ClientDemos from './ClientAnimations';
import { SnapshotFrame } from './SnapshotFrame';
import { TypeSpecimen } from '../TypeSpecimen';
import { TypographySnapshotFrame } from './TypographySnapshotFrame';
import {
    SnapshotCode,
    SnapshotCvd,
    SnapshotDistinct,
    SnapshotEditor,
    SnapshotExceptions,
    SnapshotInks,
    SnapshotMatrix,
    SnapshotModes,
    SnapshotScales,
} from '@samisdat/ui-components/ColorSchemeSnapshot';
import { DemoSmilMorphMistakes } from '@samisdat/ui-components/Demo/Smil/MorphMistakes';

interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
    MDXContent: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
    slug?: string;
    mdxDir?: string;
    sandboxFiles?: Record<string, SandpackFiles>;
}

export const Markdown: FC<MarkdownProps> = ({ MDXContent, slug: _slug, mdxDir: _mdxDir, sandboxFiles }) => {
    const components = {
        h1: (props: any) => (
            <Heading
                level={1}
                {...props}
            />
        ),
        h2: (props: any) => (
            <Heading
                level={2}
                {...props}
            />
        ),
        h3: (props: any) => (
            <Heading
                level={3}
                {...props}
            />
        ),
        Lead: (props: any) => <Lead {...props} />,
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
        pre: (props: any) => <Code {...props} />,
        DemoContext: (props: any) => <DemoContext {...props} />,
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
        DemoAnimationsCssJs: ClientDemos.DemoAnimationsCssJs,
        DemoAnimationsJsAttributes: ClientDemos.DemoAnimationsJsAttributes,
        DemoAnimationsMorphThumb: ClientDemos.DemoAnimationsMorphThumb,
        DemoAnimationsMorphCoffee: ClientDemos.DemoAnimationsMorphCoffee,
        DemoAnimationsMorphHills: ClientDemos.DemoAnimationsMorphHills,
        DemoSmilMorphMistakes: ClientDemos.DemoSmilMorphMistakes,
        DemoSmilSchwebebahn: ClientDemos.DemoSmilSchwebebahn,
        DemoAnimationsMorphHeart: ClientDemos.DemoAnimationsMorphHeart,
        DemoParallaxSectors: ClientDemos.DemoParallaxSectors,
        DemoParallaxHills: ClientDemos.DemoParallaxHills,
        DemoParallaxCircles: ClientDemos.DemoParallaxCircles,
        DemoSmilDisc: ClientDemos.DemoSmilDisc,
        DemoAnimationsCrank: ClientDemos.DemoAnimationsCrank,
        DemoAnimationsCrankFormula: ClientDemos.DemoAnimationsCrankFormula,
        // Color scheme snapshot: frame loads content/snapshots/<id>.json, blocks render it
        ColorSchemeSnapshot: SnapshotFrame,
        SnapshotInks,
        SnapshotMatrix,
        SnapshotCode,
        SnapshotModes,
        SnapshotCvd,
        SnapshotDistinct,
        SnapshotScales,
            SnapshotExceptions,
        SnapshotEditor,
        TypeSpecimen,
        TypographySnapshot: TypographySnapshotFrame,
    };

    const hasSandbox = sandboxFiles && Object.keys(sandboxFiles).length > 0;

    return (
        <div>
            {hasSandbox && <SandPackCSS />}
            <MDXContent components={components} />
        </div>
    );
};
