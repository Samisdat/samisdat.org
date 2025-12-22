import { styled } from '@linaria/react';
import { FC, HTMLAttributes } from 'react';

const variantParagraph = 'p';
const variantEm = 'em';
const variantStrong = 'strong';

type Variant = typeof variantParagraph | typeof variantEm | typeof variantStrong;

const ParagraphStyling = styled.p`
    font-family: var(--font-sans);
`;

const EmStyling = styled.em`
    font-family: var(--font-italic);

    strong & {
        font-weight: 400;
        text-shadow:
            0.4px 0 0 currentColor,
            -0.4px 0 0 currentColor;
    }
`;

const BoldStyling = styled.strong`
    font-family: var(--font-sans);
`;

const htmlTags: { [key in Variant]: any } = {
    p: ParagraphStyling,
    em: EmStyling,
    strong: BoldStyling,
};

interface TypoProps extends HTMLAttributes<HTMLDivElement> {
    variant: Variant;
}

export const Typo: FC<TypoProps> = ({ variant, children, ...props }) => {
    const HtmlTag = htmlTags[variant];

    return <HtmlTag {...props}>{children}</HtmlTag>;
};
