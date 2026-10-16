#!/usr/bin/env bash
# Installs and loads the built Linux packages on stock Ubuntu 20.04, 22.04 and 24.04 containers.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$(cd "${1:-$ROOT/dist/linux-compat}" && pwd)"
DEB="$(cd "$OUT" && ls bchat-desktop-linux-amd64-*.deb)"
APPIMAGE="$(cd "$OUT" && ls bchat-desktop-linux-x86_64-*.AppImage)"

for v in 20.04 22.04 24.04; do
  echo "=== ubuntu:$v ==="
  docker run --rm \
    -e DEB="$DEB" -e APPIMAGE="$APPIMAGE" \
    -v "$OUT":/pkg:ro \
    -v "$ROOT/build/linux/smoke-test-in-container.sh":/smoke.sh:ro \
    -v "$ROOT/build/linux/smoke-sqlcipher.cjs":/smoke-sqlcipher.cjs:ro \
    "ubuntu:$v" bash /smoke.sh
  # Docker's default seccomp profile blocks the namespaces Chromium's sandbox needs.
  docker run --rm --security-opt seccomp=unconfined \
    -e DEB="$DEB" \
    -v "$OUT":/pkg:ro \
    -v "$ROOT/build/linux/smoke-launch-in-container.sh":/launch.sh:ro \
    "ubuntu:$v" bash /launch.sh
  echo "PASS ubuntu:$v"
done
