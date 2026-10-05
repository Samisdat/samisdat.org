import type { Meta, StoryObj } from "@storybook/react";
import { styled } from "@linaria/react";
import { syntaxForegrounds } from "@samisdat/color-scheme/contrast";
import { CodeBlock } from "../CodeBlock";
import { getDarkTheme, getLightTheme } from "../tokens/themes";

const Panels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const Panel = styled.section`
  padding: 1rem;
  font-family: var(--font-sans);
  background: var(--color-surface-default);
  color: var(--color-text-default);
  min-width: 0;

  pre {
    overflow-x: auto;
  }
`;

// The theme variables are set locally per panel (runtime <style>, not a
// Linaria interpolation), so both modes render side by side regardless of the
// Storybook theme. Light needs --theme-progress: 1.
const panelThemes = `
  .color-scheme-dark { ${getDarkTheme()} }
  .color-scheme-light { --theme-progress: 1; ${getLightTheme()} }
`;

const Prose = styled.p`
  line-height: 1.7;

  code {
    font-family: var(--font-code);
    font-size: 0.9em;
  }
`;

// Token id `syntax.tag-attribute` -> CSS variable `--color-syntax-tag-attribute`.
const captures = syntaxForegrounds("dark").map((t) => ({
  name: t.id.replace("syntax.", ""),
  variable: `var(--color-${t.id.replaceAll(".", "-")})`,
}));

const code = `const Box = styled.div\`
  color: var(--color-ink-red);
  /* comment */
  padding: \${space[4]};
\`;

export const Label = ({ text }: { text: string }) => (
  <span className="label">{text}</span>
);`;

const Preview = ({ title }: { title: string }) => (
  <>
    <h2>{title}</h2>
    <CodeBlock code={code} language="tsx" />
    <Prose>
      Inline code in running text uses the same variables on the page
      background:{" "}
      {captures.map(({ name, variable }) => (
        <span key={name}>
          <code style={{ color: variable }}>{name}</code>{" "}
        </span>
      ))}
      sit next to ordinary body text, as in{" "}
      <code>
        <span style={{ color: "var(--color-syntax-tag)" }}>
          &lt;animateTransform
        </span>{" "}
        <span style={{ color: "var(--color-syntax-tag-attribute)" }}>
          repeatCount
        </span>
        <span style={{ color: "var(--color-syntax-operator)" }}>=</span>
        <span style={{ color: "var(--color-syntax-string)" }}>
          &quot;indefinite&quot;
        </span>
        <span style={{ color: "var(--color-syntax-tag)" }}>/&gt;</span>
      </code>
      .
    </Prose>
  </>
);

const SyntaxPreview = () => (
  <Panels>
    <style>{panelThemes}</style>
    <Panel className="color-scheme-dark" aria-label="Dark">
      <Preview title="Dark" />
    </Panel>
    <Panel className="color-scheme-light" aria-label="Light">
      <Preview title="Light" />
    </Panel>
  </Panels>
);

const meta = {
  title: "Color Scheme/Syntax Preview",
  component: SyntaxPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SyntaxPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
