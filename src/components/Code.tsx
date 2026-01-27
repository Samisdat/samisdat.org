import { FC, HTMLAttributes } from 'react';

export const Code: FC<HTMLAttributes<HTMLParagraphElement>> = ({ children, ...props }) => {
    return (
        <pre {...props}>
            <code>{children}</code>
        </pre>
    );
};
