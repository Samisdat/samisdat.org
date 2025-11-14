import { styled } from "@linaria/react";
import { FC, HTMLAttributes, ComponentType } from "react";

const H1 = styled.h1`
  background: lime;
  font-size: var(--typo-h1-size);
`;
const H2 = styled.h2`
  background: red;
  font-size: var(--typo-h2-size);
`;

const H3 = styled.h3`
  background: blue;
  font-size: var(--typo-h3-size);
`;

const H4 = styled.h4`
  background: yellow;
  font-size: var(--typo-h4-size);
`;

const H5 = styled.h5`
  background: grey;
  font-size: var(--typo-h5-size);
`;

const H6 = styled.h6`
  background: lightgrey;
  font-size: var(--typo-h6-size);
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
