#!/usr/bin/env bash
set -euo pipefail

# Start an ephemeral Cloudflare Quick Tunnel (trycloudflare.com) to the local
# remote-view HTTP server. Useful when away from home without a custom domain.

PORT="${REMOTE_VIEW_PORT:-80}"
exec cloudflared tunnel --url "http://127.0.0.1:${PORT}"
