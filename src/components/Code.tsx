import { FC, HTMLAttributes } from 'react';

export const Code: FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
    console.log(children);
    return <p {...props}>Foo{children}bar</p>;
};
