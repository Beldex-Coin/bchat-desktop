#!/usr/bin/env bash
# Rebuilds @signalapp/sqlcipher's linux-x64 prebuild from pinned upstream source so it links
# against this container's glibc 2.31. Upstream prebuilds are made on Ubuntu 22.04 and need
# GLIBC_2.34, which Ubuntu 20.04 lacks. Usage: build-sqlcipher.sh <node_modules/@signalapp/sqlcipher>
set -euo pipefail

PKG="$(cd "${1:?usage: build-sqlcipher.sh <node_modules/@signalapp/sqlcipher>}" && pwd)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="${SQLCIPHER_BUILD_DIR:-/tmp/node-sqlcipher}"
TARGET="$PKG/prebuilds/linux-x64/@signalapp+sqlcipher.node"

# Bumping @signalapp/sqlcipher requires adding its tag's commit here (git ls-remote --tags).
declare -A PINNED=(
  [4.1.0]=0efcacbbc81360e3be5aa414109d12e50bb72642
)

VERSION="$(node -p "require('$PKG/package.json').version")"
COMMIT="${PINNED[$VERSION]:-}"
if [ -z "$COMMIT" ]; then
  echo "no pinned source commit for @signalapp/sqlcipher $VERSION (add it to $0)"
  exit 1
fi

rm -rf "$SRC"
git -c advice.detachedHead=false clone -q --depth 1 --branch "v$VERSION" https://github.com/signalapp/node-sqlcipher.git "$SRC"
GOT="$(git -C "$SRC" rev-parse HEAD)"
if [ "$GOT" != "$COMMIT" ]; then
  echo "commit mismatch: expected $COMMIT got $GOT"
  exit 1
fi

cd "$SRC"
rustup toolchain install "$(cat rust-toolchain)" --profile minimal
pnpm install --frozen-lockfile --ignore-scripts
CC=gcc-10 CXX=g++-10 pnpm exec node-gyp rebuild --release

BUILT="$SRC/build/Release/node_sqlcipher.node"
strip "$BUILT"
mkdir -p "$SRC/gate" && cp "$BUILT" "$SRC/gate/"
bash "$HERE/check-glibc.sh" "$SRC/gate"

OLD="$(sha256sum "$TARGET" | cut -d' ' -f1)"
cp "$BUILT" "$TARGET"
NEW="$(sha256sum "$TARGET" | cut -d' ' -f1)"
# Only linux-x64 is shipped from this build; the other prebuilds (incl. linux-arm64, GLIBC_2.34)
# would only bloat the package and fail the glibc gate.
find "$PKG/prebuilds" -mindepth 1 -maxdepth 1 ! -name linux-x64 -exec rm -rf {} +
echo "sqlcipher $VERSION built from $COMMIT: $OLD -> $NEW"
