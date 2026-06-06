import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";

const demoBoxColors = {
  red: {
    background: "var(--color-red)",
  },
  blue: {
    background: "var(--color-blue)",
  },
  yellow: {
    background: "var(--color-yellow)",
  },
  orange: {
    background: "var(--color-orange)",
  },
  green: {
    background: "var(--color-green)",
  },
  teal: {
    background: "var(--color-teal)",
  },
  purple: {
    background: "var(--primitive-purple)",
  },
  pink: {
    background: "var(--color-pink)",
  },
  cyan: {
    background: "var(--color-cyan)",
  },
};

type DemoBoxColors = keyof typeof demoBoxColors;

interface DemoBoxProps extends HTMLAttributes<HTMLDivElement> {
  color?: DemoBoxColors;
}

const DemoBoxStyling = styled.div<{
  $color: DemoBoxColors;
}>`
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${(props) => demoBoxColors[props.$color].background};
  color: contrast-color(${(props) => demoBoxColors[props.$color].background});
`;

export const DemoBox: FC<DemoBoxProps> = ({
  color = "blue",
  children,
  ...props
}) => {
  return (
    <DemoBoxStyling $color={color} {...props}>
      {children}
    </DemoBoxStyling>
  );
};
