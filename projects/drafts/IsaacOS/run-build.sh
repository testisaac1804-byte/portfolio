#!/bin/bash
# =============================================================================
# IsaacOS Builder Runner v2 - simpler approach
# Mounts the build script directly into the container
# =============================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$PROJECT_DIR/output"
ARCH="${1:-arm64}"  # Default to arm64

if [[ "$ARCH" != "arm64" && "$ARCH" != "amd64" ]]; then
    echo "Usage: $0 [arm64|amd64]"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "========================================"
echo "  Building IsaacOS for ${ARCH}"
echo "========================================"

# Copy build script to output dir so it's accessible via volume mount
cp "$PROJECT_DIR/build-isaacos.sh" "$OUTPUT_DIR/build-isaacos.sh"
chmod +x "$OUTPUT_DIR/build-isaacos.sh"

# Build and tag the final image with script embedded
docker build --platform "linux/${ARCH}" \
    --build-arg "ARCH=${ARCH}" \
    -f "$PROJECT_DIR/Dockerfile.embed" \
    -t "isaacos-builder-${ARCH}-final" \
    "$PROJECT_DIR" 2>&1

echo "Starting ISO build for ${ARCH}..."
echo "This will take 15-60 minutes depending on network speed."
echo "Output ISO goes to: $OUTPUT_DIR/"

# Run the build
docker run --rm --platform "linux/${ARCH}" \
    -v "$OUTPUT_DIR:/build/output" \
    "isaacos-builder-${ARCH}-final" \
    "$ARCH" 2>&1

echo ""
if ls "$OUTPUT_DIR"/IsaacOS-*.iso 2>/dev/null; then
    echo "SUCCESS: ISO built!"
    ls -lh "$OUTPUT_DIR"/IsaacOS-*.iso
else
    echo "FAILED: No ISO produced. Check logs above."
fi
