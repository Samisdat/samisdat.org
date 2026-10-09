import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import {
  BottomDock,
  BottomDockContainer,
  DockProvider,
  TopDock,
  TopDockContainer,
} from "@samisdat/ui-components/Docks";

const meta = {
  title: "Layout/Docks",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Stands in for the website's Navi: sticky, z-index 10, height --navi-height.
const FakeNavi = () => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 10,
      height: "var(--navi-height)",
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      background: "var(--color-surface-default)",
      borderBottom: "2px solid var(--color-ink-teal)",
      color: "var(--color-text-default)",
    }}
  >
    Sticky header (--navi-height)
  </header>
);

const Card = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      width: "min(24rem, calc(100vw - 24px))",
      margin: "0 auto",
      padding: "0.75rem 1rem",
      borderRadius: 8,
      background: "var(--color-surface-raised)",
      color: "var(--color-text-default)",
      border: "1.5px dashed var(--color-ink-teal)",
      boxShadow: "0 8px 28px rgba(0, 0, 0, 0.32)",
    }}
  >
    {children}
  </div>
);

const Page = ({ children }: { children: ReactNode }) => (
  <DockProvider>
    <div style={{ background: "var(--color-surface-default)" }}>
      <FakeNavi />
      <main
        style={{
          height: "250vh",
          padding: "1rem 12px",
          color: "var(--color-text-default)",
        }}
      >
        Scroll: the docks stay put, the header is never covered.
      </main>
    </div>
    <TopDockContainer />
    <BottomDockContainer />
    {children}
  </DockProvider>
);

/** The top dock starts below the sticky header and never overlaps it. */
export const TopDockBelowHeader: Story = {
  render: () => (
    <Page>
      <TopDock>
        <Card>Top dock content</Card>
      </TopDock>
    </Page>
  ),
};

/**
 * Narrow viewport. The bottom dock adds `env(safe-area-inset-bottom)` as
 * padding, which Storybook cannot simulate; check it on a device.
 */
export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <Page>
      <TopDock>
        <Card>Top dock content</Card>
      </TopDock>
      <BottomDock>
        <Card>Bottom dock content</Card>
      </BottomDock>
    </Page>
  ),
};

/** Two consumers of one dock stack in mount order without overlapping. */
export const TwoConsumersStacking: Story = {
  render: () => (
    <Page>
      <TopDock>
        <Card>Top consumer A</Card>
      </TopDock>
      <TopDock>
        <Card>Top consumer B</Card>
      </TopDock>
      <BottomDock>
        <Card>Bottom consumer A</Card>
      </BottomDock>
      <BottomDock>
        <Card>Bottom consumer B</Card>
      </BottomDock>
    </Page>
  ),
};
