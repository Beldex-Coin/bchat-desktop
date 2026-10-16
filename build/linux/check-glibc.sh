#!/usr/bin/env bash
# Fails if any ELF file under <dir> needs a glibc / libstdc++ symbol version newer than
# Ubuntu 20.04 provides. Packages that pass run on Ubuntu 20.04, 22.04 and 24.04.
set -euo pipefail

DIR="${1:?usage: check-glibc.sh <dir>}"
MAX_GLIBC="${MAX_GLIBC:-2.31}"
MAX_GLIBCXX="${MAX_GLIBCXX:-3.4.28}"
MAX_CXXABI="${MAX_CXXABI:-1.3.12}"

# true when version $1 is strictly greater than version $2
newer() {
  [ "$1" != "$2" ] && [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | tail -1)" = "$1" ]
}

fail=0
checked=0
while IFS= read -r -d '' f; do
  file -b "$f" | grep -q '^ELF' || continue
  checked=$((checked + 1))
  while read -r sym; do
    name="${sym%%_*}"
    ver="${sym#*_}"
    case "$name" in
      GLIBC) max="$MAX_GLIBC" ;;
      GLIBCXX) max="$MAX_GLIBCXX" ;;
      CXXABI) max="$MAX_CXXABI" ;;
      *) continue ;;
    esac
    if newer "$ver" "$max"; then
      echo "TOO NEW: $f needs $sym (max ${name}_${max})"
      fail=1
    fi
  done < <(objdump -T "$f" 2>/dev/null | grep -oE '(GLIBC|GLIBCXX|CXXABI)_[0-9.]+' | sort -u)
done < <(find "$DIR" -type f -print0)

if [ "$checked" -eq 0 ]; then
  echo "No ELF files found under $DIR"
  exit 1
fi
echo "Checked $checked ELF files under $DIR"
exit "$fail"
