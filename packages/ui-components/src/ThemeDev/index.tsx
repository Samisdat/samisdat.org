import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";
import { color } from "../tokens/color/derived";

const ThemeDevStyling = styled.div`
  width: min(100% - 2rem, 1024px);
  margin-inline: auto;
`;

export const ThemeDev: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <ThemeDevStyling>
    {Object.keys(color).map((mappedColor) => (
      <div key={mappedColor} className={`color ${mappedColor}`}>
        {mappedColor}
      </div>
    ))}
    <div className="color background">background</div>
    <div className="color foreground">foreground</div>
    {children}
  </ThemeDevStyling>
);
