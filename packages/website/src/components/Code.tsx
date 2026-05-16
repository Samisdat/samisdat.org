import { FC, HTMLAttributes } from 'react';

export const Code: FC<HTMLAttributes<HTMLPreElement>> = ({ children, ...props }) => {
    return (
        <pre {...props}>
            <code>{children}</code>
        </pre>
    );
};
