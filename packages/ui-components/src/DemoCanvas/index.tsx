import { styled } from "@linaria/react";
import { HTMLAttributes } from "react";

const Styling = styled.div`
  background-image: conic-gradient(
    #d4d4d4 25%,
    #fff 0 50%,
    #d4d4d4 0 75%,
    #fff 0
  );
  background-size: 1rem 1rem;
`;

export const DemoCanvas = ({
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => <Styling {...props}>{children}</Styling>;
