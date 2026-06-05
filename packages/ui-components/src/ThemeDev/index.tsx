import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";
import { themedColors } from "../tokens/themes";

const ThemeDevStyling = styled.div`
  width: min(100% - 2rem, 1024px);
  margin-inline: auto;
`;

export const ThemeDev: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <ThemeDevStyling>
    {themedColors.map((mappedColor) => (
      <div key={mappedColor} className={`color ${mappedColor}`}>
        {mappedColor}
      </div>
    ))}
    {children}
  </ThemeDevStyling>
);
