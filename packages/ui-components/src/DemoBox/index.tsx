import { styled } from "@linaria/react";
import { purple } from "@samisdat/color-scheme/primitives";
import { FC, HTMLAttributes } from "react";

const demoBoxColors = {
  red: {
    background: "var(--color-ink-red)",
  },
  blue: {
    background: "var(--color-ink-blue)",
  },
  yellow: {
    background: "var(--color-ink-yellow)",
  },
  orange: {
    background: "var(--color-ink-orange)",
  },
  green: {
    background: "var(--color-ink-green)",
  },
  teal: {
    background: "var(--color-ink-teal)",
  },
  purple: {
    background: purple[600],
  },
  pink: {
    background: "var(--color-ink-pink)",
  },
  cyan: {
    background: "var(--color-ink-cyan)",
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
