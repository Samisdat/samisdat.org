"use client";

import { styled } from "@linaria/react";
import type { ModeSnapshot, Snapshot } from "@samisdat/color-scheme/snapshot-types";
import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type FC,
  type ReactNode,
} from "react";

export type SnapshotMode = "dark" | "light";

type Context = { data: Snapshot; mode: SnapshotMode; m: ModeSnapshot };

const SnapshotContext = createContext<Context | null>(null);

export const useSnapshot = (): Context => {
  const ctx = useContext(SnapshotContext);
  if (!ctx) throw new Error("Snapshot blocks must be placed inside <ColorSchemeSnapshot>");
  return ctx;
};

/** `surface.default` -> `--cs-surface-default`. */
export const csVar = (tokenId: string) => `--cs-${tokenId.replace(/\./g, "-")}`;
/** `var(--cs-...)` of a frozen token. */
export const cs = (tokenId: string) => `var(${csVar(tokenId)})`;

const tokenVars = (m: ModeSnapshot): CSSProperties =>
  Object.fromEntries(Object.entries(m.colors).map(([id, hex]) => [csVar(id), hex])) as CSSProperties;

/**
 * The frame is the visible border between the frozen scheme and the site: the
 * bar uses the site's own colors, everything below it only the snapshot's
 * (inline custom properties), so the content never follows the site theme.
 */
const Figure = styled.figure`
  margin: 2rem 0;
  border: 1px solid var(--color-border-default);
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface-default);
`;

const Bar = styled.figcaption`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-surface-raised);
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border-default);
  font-size: 0.8125rem;
`;

const Stamp = styled.span`
  font-family: var(--font-mono, ui-monospace, Menlo, monospace);
  font-size: 0.75rem;

  b {
    font-weight: 600;
    color: var(--color-text-default);
  }
`;

const Switch = styled.fieldset`
  display: inline-flex;
  margin: 0;
  padding: 2px;
  border: 1px solid var(--color-border-default);
  border-radius: 999px;
  min-inline-size: 0;

  legend {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  label {
    position: relative;
  }

  input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  span {
    display: block;
    padding: 0.2rem 0.75rem;
    border-radius: 999px;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  input:checked + span {
    background: var(--color-text-default);
    color: var(--color-surface-default);
  }

  input:focus-visible + span {
    outline: 2px solid var(--color-border-focus);
    outline-offset: 1px;
  }
`;

const Body = styled.div`
  padding: clamp(0.75rem, 2.5vw, 1.5rem);
  display: grid;
  gap: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--cs-surface-default);
  color: var(--cs-text-default);
  font-size: 0.9375rem;
  line-height: 1.5;

  /* inline code, hints and every block stay inside this island */
  isolation: isolate;
  transition: background-color 0.3s;
`;

const siteMode = (): SnapshotMode => {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

/** The site theme (data-theme or system preference) as an external store. */
const subscribeSite = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
};

type Props = { data: Snapshot; children?: ReactNode };

export const ColorSchemeSnapshot: FC<Props> = ({ data, children }) => {
  const name = useId();
  // Starts with the site theme and follows it until the reader picks a mode here.
  const site = useSyncExternalStore(subscribeSite, siteMode, () => "dark" as SnapshotMode);
  const [chosen, setMode] = useState<SnapshotMode | null>(null);
  const mode = chosen ?? site;

  const m = data.modes[mode];
  const value = useMemo(() => ({ data, mode, m }), [data, mode, m]);

  return (
    <SnapshotContext.Provider value={value}>
      <Figure data-snapshot={data.id}>
        <Bar>
          <Stamp>
            Eingefrorener Stand <b>{data.id}</b> · {data.date} · {data.git.commit}
            {data.git.dirty ? "+" : ""}
          </Stamp>
          <Switch>
            <legend>Modus des Schemas</legend>
            {(["dark", "light"] as const).map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name={name}
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                />
                <span>{value === "dark" ? "Dunkel" : "Hell"}</span>
              </label>
            ))}
          </Switch>
        </Bar>
        <Body style={tokenVars(m)}>{children}</Body>
      </Figure>
    </SnapshotContext.Provider>
  );
};
