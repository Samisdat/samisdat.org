#!/bin/bash
set -e

SOURCE_REPO="/Users/bastian.pertz1/repos/samisdat/wtal-panorama"
TARGET_REPO="../blog"
PATCHES_DIR="/tmp/wtal-panorama-patches"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Step 1: Creating patches from wtal-panorama${NC}"
cd "$SOURCE_REPO"

# Clean up old patches
rm -rf "$PATCHES_DIR"
mkdir -p "$PATCHES_DIR"

# Get the base commit (first commit)
BASE_COMMIT=$(git rev-list --max-parents=0 HEAD)
echo "Base commit: $BASE_COMMIT"

# Create patches from all commits (preserves author dates)
git format-patch --root --output-directory "$PATCHES_DIR"
PATCH_COUNT=$(ls "$PATCHES_DIR"/*.patch | wc -l)
echo -e "${GREEN}✓ Created $PATCH_COUNT patches${NC}"

echo ""
echo -e "${YELLOW}📝 Step 2: Modifying patches to move files to packages/panorama${NC}"
cd "$PATCHES_DIR"

for patch_file in *.patch; do
  # Modify all file paths in the patch to include packages/panorama
  # This needs to handle:
  # - diff --git a/... b/...
  # - --- a/...
  # - +++ b/...

  sed -i '' \
    -e 's|^diff --git a/|diff --git a/packages/panorama/|g' \
    -e 's|^--- a/|--- a/packages/panorama/|g' \
    -e 's|^+++ b/|+++ b/packages/panorama/|g' \
    "$patch_file"
done

echo -e "${GREEN}✓ Modified all $PATCH_COUNT patches${NC}"

echo ""
echo -e "${YELLOW}📥 Step 3: Applying patches to samisdat.org${NC}"
cd "$TARGET_REPO"

# Check if we're on feature/monorepo branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "feature/monorepo" ]; then
  echo -e "${RED}❌ Not on feature/monorepo branch! Currently on: $CURRENT_BRANCH${NC}"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}❌ Working directory has uncommitted changes${NC}"
  exit 1
fi

# Apply patches (this preserves author dates from patch headers)
git am "$PATCHES_DIR"/*.patch

echo ""
echo -e "${GREEN}✅ Success! All commits applied with original timestamps${NC}"
echo ""
echo "📊 Summary:"
echo "  - Source: $SOURCE_REPO"
echo "  - Target: $TARGET_REPO (feature/monorepo)"
echo "  - Location: packages/panorama/"
echo "  - Commits: $PATCH_COUNT"
echo "  - Timestamps: Preserved from original commits"
