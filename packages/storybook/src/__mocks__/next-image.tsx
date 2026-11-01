import { CSSProperties } from 'react';

interface ImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    style?: CSSProperties;
    width?: number;
    height?: number;
}

// Storybook stand-in for next/image: a plain <img> is the point of this mock
const Image = ({ src, alt, fill, style, sizes: _sizes, ...props }: ImageProps) => (
    // oxlint-disable-next-line next/no-img-element
    <img
        src={src}
        alt={alt}
        style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', ...style } : style}
        {...props}
    />
);

export default Image;
