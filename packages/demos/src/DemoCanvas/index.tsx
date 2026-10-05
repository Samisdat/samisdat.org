import { styled } from "@linaria/react";
import { HTMLAttributes, Ref } from "react";

const Styling = styled.div`
  background-image: conic-gradient(
    #d4d4d4 25%,
    #fff 0 50%,
    #d4d4d4 0 75%,
    #fff 0
  );
  background-size: 1rem 1rem;
  padding: 1rem;
`;

export const DemoCanvas = ({
  children,
  ref,
  ...props
}: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) => (
  <Styling ref={ref} {...props}>
    {children}
  </Styling>
);
