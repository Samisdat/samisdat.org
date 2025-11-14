import { FC, HTMLAttributes } from "react";

export const Paragraph: FC<HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  ...props
}) => <p {...props}>{children}</p>;
