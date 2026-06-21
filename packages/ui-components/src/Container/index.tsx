import { styled } from "@linaria/react";
import { HTMLAttributes } from "react";
import { space, SpaceToken } from "../tokens/space";

const ContainerStyling = styled.div<{
  $padding?: SpaceToken;
}>`
  padding-top: ${(props) => props.$padding ?? space[0]};
  padding-bottom: ${(props) => props.$padding ?? space[0]};
  width: min(100% - 2rem, 1024px);
  margin-inline: auto;
`;

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  padding?: SpaceToken;
}

export const Container = ({ padding, children }: ContainerProps) => (
  <ContainerStyling $padding={padding}>{children}</ContainerStyling>
);
