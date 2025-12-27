'use client';

import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

import { Frontmatter } from '@/components/Markdown/serialise';
import { Sandbox } from '@/components/Sandbox';
import { Typo } from '@/components/Typo';
import type { MDXRemoteProps } from 'next-mdx-remote';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Link } from '../Link';
const MarkdownStyling = styled.div``;

interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
    serializedSource: MDXRemoteSerializeResult<Frontmatter>;
    slug?: string;
    mdxDir?: string;
}

export const Markdown: FC<MarkdownProps> = ({ serializedSource, slug, mdxDir }) => {
    const components: MDXRemoteProps['components'] = {
        p: props => (
            <Typo
                variant="p"
                {...props}
            />
        ),
        em: props => (
            <Typo
                variant="em"
                {...props}
            />
        ),
        strong: props => (
            <Typo
                variant="strong"
                {...props}
            />
        ),
        a: props => <Link {...props} />,
        Sandbox: props => (
            <Sandbox
                {...props}
                slug={slug}
                mdxDir={mdxDir}
            />
        ),
    };

    console.log('Markdown', slug, mdxDir);

    return (
        <MarkdownStyling>
            <MDXRemote
                {...serializedSource}
                components={components}
            />
        </MarkdownStyling>
    );
};
