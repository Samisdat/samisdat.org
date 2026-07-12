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
  -E "(fill|stroke|background|color|border-color|stop-color):\s*(#[0-9a-fA-F]{3,6}|'#[0-9a-fA-F]{3,6}'|\"#[0-9a-fA-F]{3,6}\")" \
  packages/website/ packages/ui-components/ 2>/dev/null || true)

if [ -n "$RESULTS" ]; then
  echo "❌ Found hardcoded hex colors in styled components:"
  echo ""
  echo "$RESULTS"
  echo ""
  echo "Please use CSS custom properties (tokens) instead:"
  echo "  var(--color-red), var(--color-blue), var(--color-background), etc."
  echo ""
  echo "Available tokens: see packages/ui-components/src/tokens/"
  exit 1
fi

echo "✅ No hardcoded hex colors found"
exit 0
