import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

import { Typo } from '@/components/Typo';

import { DemoAnimationsCompare } from '../Demo/Animations/Compare';
import { SvgAnimate } from '../Demo/Animations/SvgAnimate';
import { SvgCss } from '../Demo/Animations/SvgCss';
import { SvgPathWithJs } from '../Demo/Animations/SvgPathWithJs';
import { Link } from '../Link';
import { SandpackServer } from '../Sandbox/server';

const MarkdownStyling = styled.div``;

interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
    MDXContent: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
    slug?: string;
    mdxDir?: string;
}

export const Markdown: FC<MarkdownProps> = ({ MDXContent, slug, mdxDir }) => {
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
        Sandbox: (props: any) => (
            <SandpackServer
                {...props}
                slug={slug}
            />
        ),
        SvgCss: (props: any) => (
            <SvgCss
                {...props}
                slug={slug}
            />
        ),
        SvgAnimate: (props: any) => (
            <SvgAnimate
                {...props}
                mdxDir={mdxDir}
            />
        ),
        SvgPathWithJs: (props: any) => (
            <SvgPathWithJs
                {...props}
            />
        ),
        DemoAnimationsCombined: (props: any) => (
            <DemoAnimationsCompare
                {...props}
                slug={slug}
            />
        ),
    };

    console.log('Markdown', slug);

    return (
        <MarkdownStyling>
            <MDXContent components={components} />
        </MarkdownStyling>
    );
};
