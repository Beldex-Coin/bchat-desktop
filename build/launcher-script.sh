#!/usr/bin/env bash

# do not set -x here because it will fail on non-debian  based distrib
# set -e

# Some distributions do not have unprivileged_userns_clone disabled.
# If that's the case, and we run an AppImage (deb is not impacted by this),
# the app won't start unless we start it with --no-sandbox.
# Ubuntu 23.10+ restricts unprivileged user namespaces through AppArmor instead
# (unprivileged_userns_clone stays 1), so check that too.
# This bash script is the launcher script for AppImage only, and will at runtime check
# if we need to add the --no-sandbox before running the AppImage itself.

UNPRIVILEGED_USERNS_ENABLED=$(cat /proc/sys/kernel/unprivileged_userns_clone 2>/dev/null)
APPARMOR_USERNS_RESTRICTED=$(cat /proc/sys/kernel/apparmor_restrict_unprivileged_userns 2>/dev/null)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

EXTRA_ARGS=()
if [[ $UNPRIVILEGED_USERNS_ENABLED == 0 || $APPARMOR_USERNS_RESTRICTED == 1 ]]; then
  EXTRA_ARGS+=(--no-sandbox)
fi

exec "$SCRIPT_DIR/bchat-desktop-bin" "${EXTRA_ARGS[@]}" "$@"
