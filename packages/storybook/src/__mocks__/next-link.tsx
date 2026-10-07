import { AnchorHTMLAttributes, ReactNode } from "react";

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: ReactNode;
}

const Link = ({ href, children, ...props }: LinkProps) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export default Link;
