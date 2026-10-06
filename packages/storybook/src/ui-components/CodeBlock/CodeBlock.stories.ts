import type { Meta, StoryObj } from "@storybook/react";
import { CodeBlock } from "@samisdat/ui-components/CodeBlock";

const meta = {
  title: "CodeBlock",
  component: CodeBlock,
  tags: ["autodocs"],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Html: Story = {
  args: {
    language: "html",
    code: `<svg viewBox="0 0 450 300" width="100%" height="100%">
  <rect x="0" y="0" width="450" height="300" fill="oklch(0.32 0.11 150)" />
  <path class="wupper" d="M0,273 Q225,240 450,273 L450,300 L0,300 Z" />
  <rect class="car" x="20" y="236" width="40" height="20" rx="4">
    <animate
      attributeName="x"
      from="-50"
      to="180"
      dur="40s"
      repeatCount="indefinite"
    />
  </rect>
</svg>`,
  },
};

export const Css: Story = {
  args: {
    language: "css",
    code: `:root {
  --border-width-default: 1px;
  --border-radius-none: 0;
  --color-surface-default: oklch(0.22 0.05 300);
}

.demo-canvas {
  border: var(--border-width-default) solid var(--color-surface-muted);
  border-radius: var(--border-radius-none);
  background-image: conic-gradient(
    #d4d4d4 25%,
    #fff 0 50%,
    #d4d4d4 0 75%,
    #fff 0
  );
  background-size: 1rem 1rem;
  padding: 1rem;
}`,
  },
};

export const Js: Story = {
  args: {
    language: "js",
    code: `const path = document.querySelector(".sunPath");
const length = path.getTotalLength();

function animate(time) {
  const distance = (length * (time % dayLength)) / dayLength;
  const point = path.getPointAtLength(distance);
  sun.setAttribute("cx", point.x);
  sun.setAttribute("cy", point.y);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);`,
  },
};

export const Ts: Story = {
  args: {
    language: "ts",
    code: `export type PanoramaColorName = keyof typeof panoramaColors;

export const panoramaColors = {
  "deep-pine": "oklch(0.32 0.11 150)",
  "river-blue": "oklch(0.55 0.12 230)",
  "brick-red": "oklch(0.48 0.14 25)",
} as const;

export const panoramaCssVars = {
  "deep-pine": "var(--panorama-deep-pine)",
  "river-blue": "var(--panorama-river-blue)",
  "brick-red": "var(--panorama-brick-red)",
} as const;`,
  },
};

export const Tsx: Story = {
  args: {
    language: "tsx",
    code: `const BridgeSvgStyling = styled.svg\`
  background: \${panoramaCssVars["deep-pine"]};

  .wupper {
    transform: translateY(-273px);
    fill: \${panoramaCssVars["river-blue"]};
  }

  .car {
    fill: \${panoramaCssVars["sky-blue"]};
    stroke: \${panoramaCssVars["midnight-indigo"]};
    stroke-width: 3;
  }
\`;

export const DemoAnimationsSvg = () => (
  <DemoAnimation>
    <BridgeSvgStyling viewBox="0 0 450 300" />
  </DemoAnimation>
);`,
  },
};
