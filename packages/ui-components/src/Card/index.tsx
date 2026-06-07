import { styled } from "@linaria/react";

import { FC, HTMLAttributes } from "react";

const CardStyling = styled.div`
  border: 1px solid var(--color-background-muted);
  background-color: var(--color-background-secondary);
  padding: 1rem;
  border-radius: 0.5rem;

  & > *:first-child {
    margin-block-start: 0;
  }
  & > *:last-child {
    margin-block-end: 0;
  }
`;

export const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children }) => (
  <CardStyling>{children}</CardStyling>
);
