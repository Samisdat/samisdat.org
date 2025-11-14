import { FC, HTMLAttributes } from "react";

/*
const PageStyled = styled("div")({
  background: "#2a1f31",
  color: "#fff",
});

 */

export const Page: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <div>{children}</div>
);
