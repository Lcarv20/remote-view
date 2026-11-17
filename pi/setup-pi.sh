#!/usr/bin/env bash
set -euo pipefail

# Idempotent Raspberry Pi setup script for remote-view.
# Installs lighttpd, avahi-daemon, and cloudflared (with armv6l support),
# configures /var/www/drops, and installs the weekly cleanup cron.
#
# Run on the Pi as a user with sudo privileges:
#   ./setup-pi.sh

SCRIPT_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DROPS_DIR="${REMOTE_VIEW_REMOTE_DIR:-/var/www/drops}"
DROP_USER="${REMOTE_VIEW_USER:-$USER}"
PORT="${REMOTE_VIEW_PORT:-80}"
CLEANUP_DAYS="${REMOTE_VIEW_CLEANUP_DAYS:-30}"
NO_LISTING="${REMOTE_VIEW_NO_LISTING:-0}"
INSTALL_CLOUDFLARED="${REMOTE_VIEW_INSTALL_CLOUDFLARED:-1}"

if [[ "$(id -u)" -eq 0 && -n "${SUDO_USER:-}" && -z "${REMOTE_VIEW_USER:-}" ]]; then
  DROP_USER="$SUDO_USER"
fi

echo "==> Installing lighttpd, avahi-daemon, and curl..."
sudo apt-get update -qq
sudo apt-get install -y lighttpd avahi-daemon curl ca-certificates

if [[ "$INSTALL_CLOUDFLARED" -eq 1 ]]; then
  if command -v cloudflared >/dev/null 2>&1 && cloudflared --version >/dev/null 2>&1; then
    echo "[ok] cloudflared already installed: $(cloudflared --version)"
  else
    ARCH="$(uname -m)"
    case "$ARCH" in
      armv6l)
        # Debian/Cloudflare armhf packages require ARMv7 and crash with SIGILL on ARMv6 Pi 1 / Zero.
        echo "==> Installing cloudflared-linux-arm for ${ARCH}..."
        curl -fsSL -o /tmp/cloudflared.bin \
          "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm"
        sudo install -m 0755 /tmp/cloudflared.bin /usr/local/bin/cloudflared
        rm -f /tmp/cloudflared.bin
        cloudflared --version
        ;;
      *)
        echo "==> Installing cloudflared from Cloudflare APT repository (${ARCH})..."
        sudo mkdir -p --mode=0755 /usr/share/keyrings
        curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
          | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
        echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' \
          | sudo tee /etc/apt/sources.list.d/cloudflared.list >/dev/null
        sudo apt-get update -qq
        sudo apt-get install -y cloudflared
        ;;
    esac
  fi
fi

echo "==> Preparing drop directory: $DROPS_DIR (writable by $DROP_USER, readable by www-data)..."
sudo mkdir -p "$DROPS_DIR"
sudo chown -R "$DROP_USER:$DROP_USER" "$DROPS_DIR"
sudo chmod 0755 "$DROPS_DIR"

DIR_LISTING="enable"
if [[ "$NO_LISTING" -eq 1 ]]; then
  DIR_LISTING="disable"
fi

echo "==> Configuring lighttpd (/etc/lighttpd/conf-available/99-remote-view.conf)..."
sudo tee /etc/lighttpd/conf-available/99-remote-view.conf >/dev/null <<EOF
server.document-root := "${DROPS_DIR}"
server.port := ${PORT}
dir-listing.activate := "${DIR_LISTING}"
server.tag := "remote-view"
EOF

sudo ln -sf /etc/lighttpd/conf-available/99-remote-view.conf /etc/lighttpd/conf-enabled/99-remote-view.conf
sudo lighttpd -t -f /etc/lighttpd/lighttpd.conf
sudo systemctl enable lighttpd
sudo systemctl restart lighttpd

if [[ "$CLEANUP_DAYS" -gt 0 ]]; then
  echo "==> Installing weekly cleanup cron (/etc/cron.weekly/remote-view-cleanup, >${CLEANUP_DAYS} days)..."
  sudo install -m 0755 "$SCRIPT_DIR/remote-view-cleanup.sh" /usr/local/bin/remote-view-cleanup
  sudo tee /etc/cron.weekly/remote-view-cleanup >/dev/null <<EOF
#!/bin/sh
exec /usr/local/bin/remote-view-cleanup "$DROPS_DIR" "$CLEANUP_DAYS"
EOF
  sudo chmod 0755 /etc/cron.weekly/remote-view-cleanup
fi

HOST_LOCAL="$(hostname).local"
echo ""
echo "Setup complete!"
sudo systemctl --no-pager --lines=5 status lighttpd || true
echo ""
if [[ "$PORT" -eq 80 ]]; then
  echo "LAN URL     : http://${HOST_LOCAL}/"
else
  echo "LAN URL     : http://${HOST_LOCAL}:${PORT}/"
fi
if command -v cloudflared >/dev/null 2>&1; then
  echo "cloudflared : $(cloudflared --version)"
  echo "Quick tunnel: ./quick-tunnel.sh  (or cloudflared tunnel --url http://127.0.0.1:${PORT})"
  echo "Named tunnel: ./setup-cloudflared.sh <tunnel-name> <view-hostname> [ssh-hostname]"
fi
