#!/usr/bin/env bash
# Runs inside build/linux/Dockerfile. /src is the read-only host checkout, /out receives the packages.
# The source is copied without node_modules so every native module is compiled here against glibc 2.31.
set -euo pipefail
: "${HOST_UID:?}" "${HOST_GID:?}"

trap 'chown -R "$HOST_UID:$HOST_GID" /out' EXIT

rm -rf /work && mkdir -p /work
tar -C /src \
  --exclude=./node_modules --exclude=./dist --exclude=./release --exclude=./.git \
  -cf - . | tar -C /work -xf -
cd /work

# The host .npmrc can point at host-only tools (e.g. python3.10); use the container's.
printf 'python=/usr/bin/python3\nnode_gyp=/usr/local/bin/node-gyp\n' > .npmrc

export SIGNAL_ENV=production
# electron-builder downloads its own Electron for packaging; skip the unused npm-installed binaries
# and Playwright's test browsers.
export ELECTRON_SKIP_BINARY_DOWNLOAD=1 PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
# @signalapp/sqlcipher's install script test-loads its upstream prebuild (needs GLIBC_2.34) and
# falls back to a source build the npm tarball can't do, so a normal install fails here. Install
# without scripts, swap in a prebuild compiled against glibc 2.31, then run the install scripts in
# place. Never run `yarn install` after the swap: it relinks the original prebuild back.
yarn install --frozen-lockfile --network-timeout 600000 --ignore-scripts
bash /work/build/linux/build-sqlcipher.sh /work/node_modules/@signalapp/sqlcipher
npm rebuild --foreground-scripts
yarn run postinstall
yarn build-all

rm -rf /out/*
BUILDER=(yarn electron-builder --config.extraMetadata.environment=production --publish=never --config.directories.output=/out)
# Two passes: afterPackHook.js swaps in the sandbox launcher only when the AppImage target is built.
"${BUILDER[@]}" --linux deb rpm freebsd
"${BUILDER[@]}" --linux AppImage

bash /work/build/linux/check-glibc.sh /out/linux-unpacked
