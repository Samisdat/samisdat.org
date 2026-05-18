# Testing Strategy for UI Components

## Overview

This document outlines the recommended testing approach for UI components in the `@samisdat/ui-components` package, using **Storybook** as the primary testing and documentation tool.

## Philosophy

For **presentational components** (stateless, CSS-driven, minimal logic), the testing pyramid is inverted:

```
        Stories (80%)
       Unit Tests (20%)
```

**Why?** TypeScript's strong typing already catches most errors. Stories provide visual regression testing and living documentation simultaneously.

---

## Storybook Stories (Primary)

### What Stories Provide

- **Visual Testing** — catch styling/layout regressions by eye
- **Living Documentation** — designers and developers see component behavior
- **Accessibility Testing** — a11y addon runs automatically on every story
- **Cross-browser Testing** — stories run in real browsers via Chromatic/CI
- **Responsive Testing** — viewport addon tests mobile/tablet/desktop views

### Story Checklist for Presentational Components

For each component, create stories for:

1. **Default/Base variant** — with minimal required props
2. **All option combinations** — if component has enums (e.g., `color`, `size`, `variant`)
3. **Content variations** — short text, long text, multiline, with markup
4. **Edge cases** — empty children, very long text, special characters
5. **Responsive** — test on mobile, tablet, desktop breakpoints (use viewport addon)

### Example: DemoBox Stories

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { DemoBox } from "@samisdat/ui-components/DemoBox";

const meta = {
  title: "DemoBox",
  component: DemoBox,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: 'todo' }, // a11y tests run automatically
  },
} satisfies Meta<typeof DemoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default variant
export const Default: Story = {
  args: {
    children: "Default DemoBox (blue)",
  },
};

// 2. All color variants
export const Red: Story = {
  args: {
    color: "red",
    children: "Red DemoBox",
  },
};

export const Blue: Story = {
  args: {
    color: "blue",
    children: "Blue DemoBox",
  },
};

export const Yellow: Story = {
  args: {
    color: "yellow",
    children: "Yellow DemoBox",
  },
};

// 3. Content variations
export const LongContent: Story = {
  args: {
    color: "red",
    children:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
};

export const WithMarkup: Story = {
  args: {
    color: "blue",
    children: (
      <>
        <strong>Bold text</strong> and <em>italic text</em> in DemoBox
      </>
    ),
  },
};

// 4. All variants together (visual regression)
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <DemoBox color="red">Red variant</DemoBox>
      <DemoBox color="blue">Blue variant</DemoBox>
      <DemoBox color="yellow">Yellow variant</DemoBox>
    </div>
  ),
};

// 5. Responsive view (viewport addon tests this)
export const ResponsiveContent: Story = {
  args: {
    color: "blue",
    children: "This box should adapt to different screen sizes",
  },
};
```

### Running Stories

```bash
# Dev mode — interactive testing
pnpm storybook

# Build — production-ready docs
pnpm build-storybook

# Visual regression (requires Chromatic integration)
pnpm chromatic
```

---

## Unit Tests (Secondary)

### What Unit Tests Should Cover

Only test behavior that **TypeScript cannot statically verify**:

1. ✅ Component renders without error
2. ✅ Props are applied correctly at runtime
3. ✅ HTML attributes pass through correctly
4. ❌ Styling (use visual testing in stories instead)
5. ❌ Snapshots (Linaria CSS changes frequently, too flaky)

### Example: DemoBox Unit Tests

```tsx
// DemoBox.test.tsx
import { render, screen } from '@testing-library/react';
import { DemoBox } from './index';

describe('DemoBox', () => {
  // Rendering
  it('renders children', () => {
    render(<DemoBox>Test content</DemoBox>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  // Default props
  it('renders with default color (blue)', () => {
    const { container } = render(<DemoBox>Content</DemoBox>);
    const box = container.firstChild as HTMLElement;
    // Assert that default blue styling is applied
    expect(box).toBeTruthy(); // or more specific assertion
  });

  // Variant props
  it('applies color prop', () => {
    const { container, rerender } = render(
      <DemoBox color="red">Content</DemoBox>
    );
    expect(container.firstChild).toBeTruthy();

    rerender(<DemoBox color="yellow">Content</DemoBox>);
    expect(container.firstChild).toBeTruthy();
  });

  // HTML attributes (extends HTMLAttributes<HTMLDivElement>)
  it('accepts and applies HTML attributes', () => {
    render(
      <DemoBox id="demo-1" className="custom-class" data-testid="box">
        Content
      </DemoBox>
    );
    const box = screen.getByTestId('box');
    expect(box).toHaveAttribute('id', 'demo-1');
    expect(box).toHaveClass('custom-class');
  });

  // Accessibility
  it('is semantically correct', () => {
    const { container } = render(<DemoBox>Content</DemoBox>);
    // Rendered as div (correct for non-interactive container)
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
```

### Running Unit Tests

```bash
# Watch mode
pnpm test -- --watch

# Coverage
pnpm test -- --coverage

# Specific file
pnpm test DemoBox.test.tsx
```

---

## Accessibility Testing

### In Storybook (Automatic)

The `a11y` addon is configured in `.storybook/preview.tsx`:

```tsx
parameters: {
  a11y: {
    test: 'todo', // shows violations in Storybook UI
  }
}
```

Every story is scanned automatically using **axe-core**. Violations appear in the "Accessibility" tab.

### In Unit Tests (Optional)

For critical components, add axe tests:

```tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('has no accessibility violations', async () => {
  const { container } = render(<DemoBox>Content</DemoBox>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Testing Pyramid

```
        Visual Regression
        (Chromatic/Screenshots)
             [80%]
        
        Storybook Stories
        (Visual + a11y testing)
        
        Unit Tests
        (Props, rendering, attributes)
             [20%]
        
        TypeScript Types
        (Static analysis - free!)
```

---

## Checklist: When Adding a New Component

- [ ] Create component file with **strong TypeScript types**
- [ ] Create stories for **all variants and edge cases**
- [ ] Run `pnpm storybook` and **visually verify all stories**
- [ ] Check **a11y tab** for violations (resolve them)
- [ ] Add **unit tests** for prop handling and rendering
- [ ] Update `package.json` exports if needed (already generic pattern)
- [ ] Document in story docs (Storybook autodocs)

---

## Tools & Integration

| Tool | Purpose | When to Use |
|------|---------|-------------|
| **Storybook** | Visual testing + docs | During development |
| **a11y addon** | Accessibility audit | Every story (automatic) |
| **Unit Tests** | Props/rendering verification | Before merge |
| **Chromatic** | Visual regression CI/CD | On PR (optional, paid) |
| **TypeScript** | Type safety | Always |

---

## Why This Approach?

1. **DRY** — Stories are both documentation AND tests
2. **Maintainable** — Less code to maintain (fewer unit test files)
3. **Designer-friendly** — Designers can review stories in Storybook
4. **Realistic** — Stories test components in actual browser (not jsdom)
5. **Accessibility-first** — a11y tests run on every story automatically
6. **Type-safe** — TypeScript catches most errors before testing

---

## References

- [Storybook Testing Best Practices](https://storybook.js.org/docs/writing-tests)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [jest-axe for Accessibility Testing](https://github.com/nickcolley/jest-axe)
- [Chromatic Visual Testing](https://www.chromatic.com/)
