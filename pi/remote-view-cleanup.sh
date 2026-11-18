#!/usr/bin/env bash
set -euo pipefail

DROPS_DIR="${1:-/var/www/drops}"
MAX_AGE_DAYS="${2:-30}"

if [[ ! -d "$DROPS_DIR" ]]; then
  exit 0
fi

if [[ "$MAX_AGE_DAYS" -eq 0 ]]; then
  find "$DROPS_DIR" -maxdepth 1 -type f -name '*.html' ! -name 'index.html' -delete
  for d in "$DROPS_DIR"/*/; do
    [[ -d "$d" ]] || continue
    [[ "$(basename "$d")" == _* ]] && continue
    rm -rf -- "$d"
  done
else
  # Delete old single-file HTML drops (preserve index.html if present)
  find "$DROPS_DIR" -maxdepth 1 -type f -name '*.html' ! -name 'index.html' -mtime +"$MAX_AGE_DAYS" -delete

  # Delete old build-output directories only if every file inside is older than MAX_AGE_DAYS
  # (never prune _assets or other _-prefixed system directories)
  for d in "$DROPS_DIR"/*/; do
    [[ -d "$d" ]] || continue
    [[ "$(basename "$d")" == _* ]] && continue
    if [[ -z "$(find "$d" -mtime -"$MAX_AGE_DAYS" -print -quit)" ]]; then
      rm -rf -- "$d"
    fi
  done
fi
