import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";

const ThemeDevStyling = styled.div`
  width: min(100% - 2rem, 1024px);
  margin-inline: auto;
`;

export const ThemeDev: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <ThemeDevStyling>
    <div class="color aubergine"></div>
    <div class="color ivory"></div>
    <div class="color background"></div>
    <div class="color foreground"></div>
    {children}
  </ThemeDevStyling>
);
