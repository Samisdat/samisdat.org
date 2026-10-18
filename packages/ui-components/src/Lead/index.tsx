import { styled } from "@linaria/react";
import { FC, HTMLAttributes } from "react";

// Wrapper, not a <p>: in MDX the Markdown inside becomes its own paragraph(s).
// Meant for short leads (2-3 lines); text-secondary is too weak for running text.
const LeadStyling = styled.div`
  max-width: var(--measure, none);

  /* Root font size is 20px, so 0.95rem = 19px; a preset (--bz, --lw) sets body size + 3px instead */
  & > p {
    font-size: calc(var(--bz, 16px) + 3px);
    font-weight: var(--lw, 500);
    line-height: 1.45;
    letter-spacing: 0;
    color: var(--color-text-secondary);
  }
`;

export const Lead: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => <LeadStyling {...props}>{children}</LeadStyling>;
