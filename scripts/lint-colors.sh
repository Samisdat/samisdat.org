#!/bin/bash

# Lint hardcoded hex colors in styled components
# Fails if any hex colors (#xxx or #xxxxxx) are found outside of allowed files

set -e

# Search for hex colors in styled components
# Pattern: matches #rgb or #rrggbb in styled`` templates and inline styles
RESULTS=$(grep -rn \
  --include="*.tsx" \
  --include="*.ts" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  --exclude-dir=storybook-static \
  --exclude-dir=.storybook \
  --exclude="*MiniPano.tsx" \
  --exclude="*DemoAnimationsMorphHills.tsx" \
  -E "(fill|stroke|background|color|border-color|stop-color):\s*(#[0-9a-fA-F]{3,6}|'#[0-9a-fA-F]{3,6}'|\"#[0-9a-fA-F]{3,6}\")" \
  packages/website/ packages/ui-components/ 2>/dev/null || true)

if [ -n "$RESULTS" ]; then
  echo "❌ Found hardcoded hex colors in styled components:"
  echo ""
  echo "$RESULTS"
  echo ""
  echo "Please use CSS custom properties (tokens) instead:"
  echo "  var(--color-ink-red), var(--color-surface-default), etc."
  echo ""
  echo "Available tokens: see packages/ui-components/src/tokens/"
  exit 1
fi

# Architecture: level 1 (palette) never reaches CSS as a variable, and the
# pre-scheme variable names are gone. Panorama's own `--color-aubergine`
# (no suffix) is intentionally not matched.
ARCH_RESULTS=$(grep -rnE \
  --include="*.tsx" \
  --include="*.ts" \
  --include="*.css" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=dist \
  --exclude-dir=storybook-static \
  --exclude-dir=.storybook \
  --exclude-dir=codesandboxes \
  --exclude-dir=templates \
  "var\(--primitive-|var\(--color-[a-z]+-[0-9]+|--color-(background|foreground)|-on-(dark|light)|--color-(aubergine|ivory)-(deep|base|raised|subtle|muted|bright|soft|dim)" \
  packages/website/ packages/ui-components/ 2>/dev/null || true)

if [ -n "$ARCH_RESULTS" ]; then
  echo "❌ Found palette variables or removed color names:"
  echo ""
  echo "$ARCH_RESULTS"
  echo ""
  echo "Use level 2 variables (var(--color-surface-default), var(--color-text-default),"
  echo "var(--color-ink-red), …) or import level 1 values from @samisdat/color-scheme."
  exit 1
fi

echo "✅ No hardcoded hex colors found"
echo "✅ No palette variables or removed color names found"
exit 0
