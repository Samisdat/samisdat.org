import { FC } from "react";

interface SunProps {
  x: number;
  y: number;
}

export const Sun: FC<SunProps> = ({ x, y }) => (
  <circle className={"sunCss"} cx={x} cy={y} r="25" />
);
