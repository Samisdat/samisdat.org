import { styled } from "@linaria/react";
import { forwardRef, HTMLAttributes } from "react";

import { breakpoints } from "../tokens/breakpoints";
import { space, type SpaceToken } from "../tokens/space";

const STICKY_MIN_HEIGHT = "560px";

// Sticky only where the columns sit side by side and the viewport leaves room
// for a pinned column (WCAG 1.4.10 reflow, landscape phones).
const stickyItem = `
  position: sticky;
  top: calc(var(--navi-height, 0px) + ${space[1]});
`;

const stickyState = (sticky: boolean | undefined, direction: FlexDirection) =>
  sticky ? (direction === "row" ? "sticky" : "static") : undefined;

type FlexDirection = "row" | "column";
type AlignItems = "stretch" | "center" | "start" | "end" | "baseline";
type JustifyContent =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";

interface StackContainerProps extends HTMLAttributes<HTMLDivElement> {
  container: true;
  directionSmall?: FlexDirection;
  directionMedium?: FlexDirection;
  directionLarge?: FlexDirection;
  align?: AlignItems;
  justify?: JustifyContent;
  gap?: SpaceToken;
  /**
   * Makes every direct child `position: sticky` while the effective direction
   * is `row`, so the shorter column stays in view next to a taller one. Sets
   * `align-items: start` unless `align` is given: stretched items have no room
   * to travel and would not stick.
   */
  sticky?: boolean;
}

interface StackItemProps extends HTMLAttributes<HTMLDivElement> {
  container?: false;
  orderSmall?: number;
  orderMedium?: number;
  orderLarge?: number;
  grow?: number;
  basis?: string;
}

type StackProps = StackContainerProps | StackItemProps;

const StackContainerStyling = styled.div<{
  $directionSmall?: FlexDirection;
  $directionMedium?: FlexDirection;
  $directionLarge?: FlexDirection;
  $align?: AlignItems;
  $justify?: JustifyContent;
  $gap?: string;
  $sticky?: boolean;
}>`
  display: flex;
  gap: ${(props) => props.$gap ?? "1rem"};
  align-items: ${(props) => props.$align ?? (props.$sticky ? "start" : "stretch")};
  justify-content: ${(props) => props.$justify ?? "start"};
  flex-direction: ${(props) => props.$directionSmall ?? "column"};

  @media (min-width: ${breakpoints.medium}) {
    flex-direction: ${(props) =>
      props.$directionMedium ?? props.$directionSmall ?? "column"};
  }

  @media (min-width: ${breakpoints.large}) {
    flex-direction: ${(props) =>
      props.$directionLarge ??
      props.$directionMedium ??
      props.$directionSmall ??
      "column"};
  }

  /* Which breakpoints pin the columns is resolved in JS and passed as data
     attributes, because Linaria turns function interpolations into values only. */
  @media (min-height: ${STICKY_MIN_HEIGHT}) {
    &[data-sticky-small="sticky"] > * {
      ${stickyItem}
    }
  }

  @media (min-width: ${breakpoints.medium}) and (min-height: ${STICKY_MIN_HEIGHT}) {
    &[data-sticky-medium="sticky"] > * {
      ${stickyItem}
    }

    &[data-sticky-medium="static"] > * {
      position: static;
    }
  }

  @media (min-width: ${breakpoints.large}) and (min-height: ${STICKY_MIN_HEIGHT}) {
    &[data-sticky-large="sticky"] > * {
      ${stickyItem}
    }

    &[data-sticky-large="static"] > * {
      position: static;
    }
  }
`;

const StackItemStyling = styled.div<{
  $orderSmall?: number;
  $orderMedium?: number;
  $orderLarge?: number;
  $grow?: number;
  $basis?: string;
}>`
  flex: ${(props) => props.$grow ?? 1} 1 ${(props) => props.$basis ?? "0%"};
  order: ${(props) => props.$orderSmall ?? "auto"};

  @media (min-width: ${breakpoints.medium}) {
    order: ${(props) => props.$orderMedium ?? props.$orderSmall ?? "auto"};
  }

  @media (min-width: ${breakpoints.large}) {
    order: ${(props) =>
      props.$orderLarge ?? props.$orderMedium ?? props.$orderSmall ?? "auto"};
  }
`;

export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  if (props.container) {
    const {
      container,
      directionSmall,
      directionMedium,
      directionLarge,
      align,
      justify,
      gap,
      sticky,
      children,
      ...rest
    } = props;

    const small = directionSmall ?? "column";
    const medium = directionMedium ?? small;
    const large = directionLarge ?? medium;

    return (
      <StackContainerStyling
        ref={ref}
        $directionSmall={directionSmall}
        $directionMedium={directionMedium}
        $directionLarge={directionLarge}
        $align={align}
        $justify={justify}
        $gap={gap}
        $sticky={sticky}
        data-sticky-small={stickyState(sticky, small)}
        data-sticky-medium={stickyState(sticky, medium)}
        data-sticky-large={stickyState(sticky, large)}
        {...rest}
      >
        {children}
      </StackContainerStyling>
    );
  }

  const {
    container,
    orderSmall,
    orderMedium,
    orderLarge,
    grow,
    basis,
    children,
    ...rest
  } = props;

  return (
    <StackItemStyling
      ref={ref}
      $orderSmall={orderSmall}
      $orderMedium={orderMedium}
      $orderLarge={orderLarge}
      $grow={grow}
      $basis={basis}
      {...rest}
    >
      {children}
    </StackItemStyling>
  );
});

Stack.displayName = "Stack";
