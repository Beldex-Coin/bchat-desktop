#!/usr/bin/env bash
# Runs inside a stock ubuntu:<version> container (needs --security-opt seccomp=unconfined so the
# Chromium sandbox can create namespaces). Installs the .deb, launches BChat as a normal user under
# Xvfb with the sandbox enabled, and checks it stays up and creates an encrypted database.
set -euo pipefail
: "${DEB:?}"
export DEBIAN_FRONTEND=noninteractive

apt-get update -qq
apt-get install -y -qq --no-install-recommends "/pkg/$DEB" xvfb xauth sudo >/dev/null
useradd -m tester

set +e
sudo -u tester -H timeout 40 xvfb-run -a /opt/BChat/bchat-desktop >/tmp/app.log 2>&1
code=$?
set -e

db="$(find /home/tester/.config -name db.sqlite 2>/dev/null | head -1)"
if [ "$code" -ne 124 ]; then
  echo "app exited early with code $code"; tail -30 /tmp/app.log; exit 1
fi
# "Failed to shutdown" is Electron reacting to timeout's SIGTERM, seen on every release.
if grep -vF 'Failed to shutdown' /tmp/app.log | grep -qE 'ERR_DLOPEN_FAILED|GLIBC_[0-9.]+. not found|FATAL'; then
  echo "app log has fatal errors"; grep -E 'ERR_DLOPEN_FAILED|GLIBC|FATAL' /tmp/app.log | head; exit 1
fi
if [ -z "$db" ]; then
  echo "no db.sqlite created"; tail -30 /tmp/app.log; exit 1
fi
if [ "$(head -c 15 "$db")" = "SQLite format 3" ]; then
  echo "database is not encrypted: $db"; exit 1
fi
echo "app ran 40s sandboxed, encrypted database at $db ($(stat -c %s "$db") bytes)"
