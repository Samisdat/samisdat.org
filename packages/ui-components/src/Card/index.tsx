import { styled } from "@linaria/react";

import { FC, HTMLAttributes } from "react";

const CardStyling = styled.div`
  border: 1px solid var(--color-aubergine-muted);
  background-color: var(--color-aubergine-tint);
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
