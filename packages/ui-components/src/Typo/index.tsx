import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";

const variantParagraph = "p" as const;
const variantEm = "em" as const;
const variantStrong = "strong" as const;

export const variants = [variantParagraph, variantEm, variantStrong] as const;

export type Variant = (typeof variants)[number];

// letter-spacing lives here, not on body: headings, em and code must not inherit it
// --f-body, --bls, --v-body ... come from a typography preset (website); fallbacks are the current site values
const ParagraphStyling = styled.p`
  font-family: var(--f-body, var(--font-body));
  font-variation-settings: var(--v-body, normal);
  color: var(--color-text-default);
  letter-spacing: var(--bls, 0.01em);
`;

// Handwriting face by default: no synthetic italic (--es), no inherited tracking, no effect on line height
const EmStyling = styled.em`
  font-family: var(--f-em, var(--font-italic)), cursive;
  font-variation-settings: var(--v-em, normal);
  font-style: var(--es, normal);
  font-weight: var(--ew, 400);
  font-size: var(--ez, 0.95em);
  line-height: 1;
  letter-spacing: 0;
  color: var(--color-text-emphasis);

  strong & {
    font-weight: 400;
    text-shadow:
      0.4px 0 0 currentColor,
      -0.4px 0 0 currentColor;
  }
`;

const BoldStyling = styled.strong`
  font-family: var(--f-body, var(--font-body));
`;

const htmlTags: { [key in Variant]: any } = {
  p: ParagraphStyling,
  em: EmStyling,
  strong: BoldStyling,
} as const;

export interface TypoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

export const Typo: FC<TypoProps> = ({ variant = "p", children, ...props }) => {
  const HtmlTag = htmlTags[variant];

  return <HtmlTag {...props}>{children}</HtmlTag>;
};
