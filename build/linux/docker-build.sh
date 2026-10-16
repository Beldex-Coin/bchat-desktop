#!/usr/bin/env bash
# Builds Linux release packages that run on Ubuntu 20.04 - 24.04. Output: dist/linux-compat/
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT="$ROOT/dist/linux-compat"
IMAGE=bchat-linux-build:20.04

docker build --build-arg NODE_VERSION="$(cat "$ROOT/.nvmrc")" \
  -t "$IMAGE" -f "$ROOT/build/linux/Dockerfile" "$ROOT/build/linux"
mkdir -p "$OUT"
docker run --rm \
  -e HOST_UID="$(id -u)" -e HOST_GID="$(id -g)" \
  -e YARN_CACHE_FOLDER=/cache/yarn \
  -e ELECTRON_CACHE=/cache/electron \
  -e ELECTRON_BUILDER_CACHE=/cache/electron-builder \
  -e RUSTUP_HOME=/cache/rustup \
  -v "$ROOT":/src:ro \
  -v "$OUT":/out \
  -v bchat-linux-build-cache:/cache \
  "$IMAGE" bash /src/build/linux/build-in-container.sh
