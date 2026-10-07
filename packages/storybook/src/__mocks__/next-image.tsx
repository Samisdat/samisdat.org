import { CSSProperties } from "react";

interface ImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
}

const Image = ({ src, alt, fill, style, sizes: _sizes, ...props }: ImageProps) => (
  <img
    src={src}
    alt={alt}
    style={
      fill
        ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style }
        : style
    }
    {...props}
  />
);

export default Image;
