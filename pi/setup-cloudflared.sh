#!/usr/bin/env bash
set -euo pipefail

# Configure a persistent named Cloudflare Tunnel on the Raspberry Pi and install
# it as a systemd service. Run on the Pi after setup-pi.sh.
#
# Usage:
#   ./setup-cloudflared.sh <tunnel-name> <view-hostname> [ssh-hostname]
# Example:
#   ./setup-cloudflared.sh remote-view view.example.com pi-ssh.example.com

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <tunnel-name> <view-hostname> [ssh-hostname]" >&2
  exit 1
fi

TUNNEL_NAME="$1"
VIEW_HOST="$2"
SSH_HOST="${3:-}"
PORT="${REMOTE_VIEW_PORT:-80}"
CF_DIR="${HOME}/.cloudflared"

command -v cloudflared >/dev/null 2>&1 || {
  echo "cloudflared is not installed. Run ./setup-pi.sh first." >&2
  exit 1
}

if [[ ! -f "$CF_DIR/cert.pem" ]]; then
  echo "==> Authenticating with Cloudflare (open the URL printed below)..."
  cloudflared tunnel login
fi

if ! cloudflared tunnel list 2>/dev/null | awk '{print $2}' | grep -qx "$TUNNEL_NAME"; then
  echo "==> Creating tunnel '$TUNNEL_NAME'..."
  cloudflared tunnel create "$TUNNEL_NAME"
fi

TUNNEL_UUID="$(cloudflared tunnel list | awk -v name="$TUNNEL_NAME" '$2 == name {print $1; exit}')"
[[ -n "$TUNNEL_UUID" ]] || {
  echo "Could not resolve UUID for tunnel '$TUNNEL_NAME'." >&2
  exit 1
}

CRED_FILE="$CF_DIR/${TUNNEL_UUID}.json"
[[ -f "$CRED_FILE" ]] || {
  echo "Credentials file not found: $CRED_FILE" >&2
  exit 1
}

echo "==> Writing $CF_DIR/config.yml..."
cat > "$CF_DIR/config.yml" <<EOF
tunnel: ${TUNNEL_UUID}
credentials-file: ${CRED_FILE}

ingress:
  - hostname: ${VIEW_HOST}
    service: http://127.0.0.1:${PORT}
EOF

if [[ -n "$SSH_HOST" ]]; then
  cat >> "$CF_DIR/config.yml" <<EOF
  - hostname: ${SSH_HOST}
    service: ssh://127.0.0.1:22
EOF
fi

cat >> "$CF_DIR/config.yml" <<'EOF'
  - service: http_status:404
EOF

echo "==> Routing DNS for $VIEW_HOST..."
cloudflared tunnel route dns "$TUNNEL_NAME" "$VIEW_HOST"
if [[ -n "$SSH_HOST" ]]; then
  echo "==> Routing DNS for $SSH_HOST..."
  cloudflared tunnel route dns "$TUNNEL_NAME" "$SSH_HOST"
fi

echo "==> Installing and starting cloudflared systemd service..."
if systemctl list-unit-files | grep -q '^cloudflared\.service'; then
  sudo cp "$CF_DIR/config.yml" /etc/cloudflared/config.yml 2>/dev/null || true
  sudo systemctl restart cloudflared
else
  sudo cloudflared --config "$CF_DIR/config.yml" service install
  sudo systemctl enable --now cloudflared
fi

echo ""
echo "Cloudflare Tunnel active!"
echo "  Public URL : https://${VIEW_HOST}/"
if [[ -n "$SSH_HOST" ]]; then
  echo "  Remote SSH : ${SSH_HOST} (use ProxyCommand cloudflared access ssh --hostname %h)"
fi
echo ""
echo "Tip: Protect https://${VIEW_HOST}/ with Cloudflare Access (Zero Trust) or set"
echo "     REMOTE_VIEW_NO_LISTING=1 and re-run ./setup-pi.sh to disable directory listing."
