import { styled } from "@linaria/react";
import { ComponentType, FC, HTMLAttributes } from "react";

const fontFamily = `font-family: var(--font-heading);`;

// Root font size is 20px, so 2.1rem = 42px and 1.1rem = 22px
const H1 = styled.h1`
  ${fontFamily}
  color: var(--color-text-emphasis);
  font-size: clamp(1.6rem, 1.2rem + 1.6vw, 2.1rem);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
`;
const H2 = styled.h2`
  ${fontFamily}
  color: var(--color-text-emphasis);
  font-size: clamp(1.3rem, 1.1rem + 0.8vw, 1.55rem);
  font-weight: 650;
  line-height: 1.15;
  letter-spacing: -0.022em;
`;

const H3 = styled.h3`
  ${fontFamily}
  color: var(--color-text-emphasis);
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.015em;
`;

const H4 = styled.h4`
  font-size: var(--typo-h4-size);
  ${fontFamily}
`;

const H5 = styled.h5`
  font-size: var(--typo-h5-size);
  ${fontFamily}
`;

const H6 = styled.h6`
  font-size: var(--typo-h6-size);
  ${fontFamily}
`;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
};

const mapLevelToStyle: {
  [key in HeadingLevel]: ComponentType<HTMLAttributes<HTMLHeadingElement>>;
} = {
  1: H1,
  2: H2,
  3: H3,
  4: H4,
  5: H5,
  6: H6,
};

export const Heading: FC<HeadingProps> = ({
  children,
  level = 2,
  ...props
}) => {
  const StyledTag = mapLevelToStyle[level];
  return <StyledTag {...props}>{children}</StyledTag>;
};
