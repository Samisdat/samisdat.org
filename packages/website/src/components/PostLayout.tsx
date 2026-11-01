import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

import { presetFontClasses, presetStyle, resolvePreset } from '@/lib/typography/presets';

// Prose is capped to a readable measure; figures, code blocks and demo layouts keep the full width.
// --measure is registered as <length>, so 68ch is resolved here against the body font, not per heading.
// The typography preset only lives on this wrapper (see presetStyle), header, navigation and footer keep the site fonts.
export const PostProse = styled.article`
    --measure: 68ch;

    font-family: var(--f-body, var(--font-body));
    font-size: var(--bz, 0.9rem);
    font-variation-settings: var(--v-body, normal);
    line-height: var(--blh, 1.65);

    & > :is(h1, h2, h3),
    & > div > :is(p, ul, ol, h1, h2, h3, h4, blockquote, figure[data-quote]) {
        max-width: var(--measure);
    }
`;

interface PostLayoutProps extends HTMLAttributes<HTMLElement> {
    /** Preset id from the post's frontmatter; unknown or missing ids resolve to the default preset. */
    typography?: string;
}

export const PostLayout: FC<PostLayoutProps> = ({ typography, children, className, style, ...props }) => {
    const preset = resolvePreset(typography);

    return (
        <PostProse
            {...props}
            className={[presetFontClasses(preset), className].filter(Boolean).join(' ')}
            style={{ ...presetStyle(preset), ...style }}
            data-typography={preset.id}
        >
            {children}
        </PostProse>
    );
};
