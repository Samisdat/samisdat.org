import { styled } from "@linaria/react";

import { FC, HTMLAttributes } from "react";

// Trading card proportions (5:7), deliberately without rounded corners
const BlogCollectorCardStyling = styled.div`
  aspect-ratio: 5 / 7;
  width: 100%;
  max-width: 22rem;
  border: 1px solid var(--color-border-default);
  background-color: var(--color-surface-raised);
`;

export const BlogCollectorCard: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
}) => <BlogCollectorCardStyling>{children}</BlogCollectorCardStyling>;
