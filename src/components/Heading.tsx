import { styled } from "@linaria/react";
import { FC, HTMLAttributes, ComponentType } from "react";

const fontFamily = `font-family: var(--font-serif);`;

const H1 = styled.h1`
  font-size: var(--typo-h1-size);
  ${fontFamily}
`;
const H2 = styled.h2`
  font-size: var(--typo-h2-size);
  ${fontFamily}
`;

const H3 = styled.h3`
  font-size: var(--typo-h3-size);
  ${fontFamily}
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
