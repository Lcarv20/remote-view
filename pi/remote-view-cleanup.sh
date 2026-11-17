#!/usr/bin/env bash
set -euo pipefail

DROPS_DIR="${1:-/var/www/drops}"
MAX_AGE_DAYS="${2:-30}"

if [[ ! -d "$DROPS_DIR" ]]; then
  exit 0
fi

# Delete old single-file HTML drops (preserve index.html if present)
find "$DROPS_DIR" -maxdepth 1 -type f -name '*.html' ! -name 'index.html' -mtime +"$MAX_AGE_DAYS" -delete

# Delete old build-output directories only if every file inside is older than MAX_AGE_DAYS
for d in "$DROPS_DIR"/*/; do
  [[ -d "$d" ]] || continue
  if [[ -z "$(find "$d" -mtime -"$MAX_AGE_DAYS" -print -quit)" ]]; then
    rm -rf -- "$d"
  fi
done
