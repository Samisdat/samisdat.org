import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";

const variantParagraph = "p" as const;
const variantEm = "em" as const;
const variantStrong = "strong" as const;

export const variants = [variantParagraph, variantEm, variantStrong] as const;

export type Variant = (typeof variants)[number];

// letter-spacing lives here, not on body: headings, em and code must not inherit it
const ParagraphStyling = styled.p`
  font-family: var(--font-body);
  color: var(--color-text-default);
  letter-spacing: 0.01em;
`;

// Handwriting face: no synthetic italic, no inherited tracking, no effect on line height
const EmStyling = styled.em`
  font-family: var(--font-italic), cursive;
  font-style: normal;
  font-weight: 400;
  font-size: 0.95em;
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
  font-family: var(--font-body);
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
