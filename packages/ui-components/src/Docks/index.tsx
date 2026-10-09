"use client";

import { styled } from "@linaria/react";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * Layout slots at the page edges. Overlay docks: nothing in flow, no layout
 * shift. The top dock sits right below the sticky header (`--navi-height`),
 * the bottom dock at the viewport bottom (incl. the safe area).
 *
 * The provider holds only the two DOM nodes. Content is portaled into them, so
 * only React content belongs in a dock - never DOM that is added imperatively.
 * Several consumers of one dock stack in a flex column in mount order; there is
 * no priority logic. The containers carry no ARIA role, consumers set their own
 * semantics.
 */

// Header is z-index 10; the bottom dock stays below modals.
const TOP_DOCK_Z = 9;
const BOTTOM_DOCK_Z = 200;

export type DockNodes = {
  top: HTMLElement | null;
  bottom: HTMLElement | null;
};

type DockName = keyof DockNodes;

type DockContextValue = DockNodes & {
  setTop: (node: HTMLElement | null) => void;
  setBottom: (node: HTMLElement | null) => void;
};

const DockContext = createContext<DockContextValue | null>(null);

function useDockContext(): DockContextValue {
  const value = useContext(DockContext);
  if (!value) throw new Error("Docks must be used inside <DockProvider>");
  return value;
}

export const DockProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [top, setTop] = useState<HTMLElement | null>(null);
  const [bottom, setBottom] = useState<HTMLElement | null>(null);
  const value = useMemo(
    () => ({ top, bottom, setTop, setBottom }),
    [top, bottom],
  );

  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
};

/** The current dock nodes, `null` until the containers are mounted. */
export function useDockNodes(): DockNodes {
  const { top, bottom } = useDockContext();
  return useMemo(() => ({ top, bottom }), [top, bottom]);
}

const TopDockStyling = styled.div`
  position: fixed;
  top: var(--navi-height, 0px);
  left: 0;
  right: 0;
  z-index: ${TOP_DOCK_Z};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 0;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  &:empty {
    display: none;
  }
`;

const BottomDockStyling = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${BOTTOM_DOCK_Z};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px calc(env(safe-area-inset-bottom, 0px) + 10px);
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  &:empty {
    display: none;
  }
`;

/** Mount point of the top dock. Render once, e.g. in the root layout. */
export const TopDockContainer: FC = () => {
  const { setTop } = useDockContext();
  return <TopDockStyling ref={setTop} />;
};

/** Mount point of the bottom dock. Render once, e.g. in the root layout. */
export const BottomDockContainer: FC = () => {
  const { setBottom } = useDockContext();
  return <BottomDockStyling ref={setBottom} />;
};

function createSlot(name: DockName): FC<{ children?: ReactNode }> {
  const Slot: FC<{ children?: ReactNode }> = ({ children }) => {
    const node = useDockContext()[name];
    return node ? createPortal(children, node) : null;
  };
  Slot.displayName = name === "top" ? "TopDock" : "BottomDock";
  return Slot;
}

/** Renders its children into the top dock (below the sticky header). */
export const TopDock = createSlot("top");

/** Renders its children into the bottom dock (above the safe area). */
export const BottomDock = createSlot("bottom");
