#!/usr/bin/env bash
# Runs inside a stock ubuntu:<version> container with the packages mounted at /pkg.
# Installs the .deb through apt (proving its Depends resolve on this release), checks every
# shared library resolves, then opens an encrypted database through @signalapp/sqlcipher with the
# packaged Electron from both the .deb and the extracted AppImage.
set -euo pipefail
: "${DEB:?}" "${APPIMAGE:?}"
export DEBIAN_FRONTEND=noninteractive

SQLCIPHER=resources/app.asar/node_modules/@signalapp/sqlcipher

apt-get update -qq
apt-get install -y -qq --no-install-recommends "/pkg/$DEB" >/dev/null

missing="$(ldd /opt/BChat/bchat-desktop | grep 'not found' || true)"
if [ -n "$missing" ]; then
  echo "deb: unresolved libraries:"
  echo "$missing"
  exit 1
fi
ELECTRON_RUN_AS_NODE=1 /opt/BChat/bchat-desktop /smoke-sqlcipher.cjs "/opt/BChat/$SQLCIPHER"

cd /tmp
"/pkg/$APPIMAGE" --appimage-extract >/dev/null
ELECTRON_RUN_AS_NODE=1 /tmp/squashfs-root/bchat-desktop-bin /smoke-sqlcipher.cjs "/tmp/squashfs-root/$SQLCIPHER"
