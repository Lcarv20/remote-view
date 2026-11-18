#!/usr/bin/env bash
set -euo pipefail

# New-computer setup script for remote-view:
# 1. Symlinks drop-html, drop-dir, tunel-view, and global skills (Antigravity + OpenCode).
# 2. Optionally writes ~/.config/remote-view/config when target flags are passed.
# 3. Tests connecting to the Pi (syncs /_assets/ if reachable, or guides you
#    through SSH key setup, Pi provisioning, or off-LAN Cloudflare Tunnel).

REPO_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${HOME}/.local/bin"
AGY_SKILLS_DIR="${HOME}/.gemini/config/skills"
AGENTS_SKILLS_DIR="${HOME}/.agents/skills"
OPENCODE_SKILLS_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/remote-view"
CONFIG_FILE="${CONFIG_DIR}/config"

LINK_OPENCODE_NATIVE=0
UNINSTALL=0
NO_PROMPT=0
OPT_HOST=""
OPT_URL=""
OPT_REMOTE_DIR=""
OPT_THEME=""

usage() {
  cat <<'EOF'
Usage: ./install.sh [OPTIONS]

Set up remote-view on a new computer:
  - Symlinks drop-html, drop-dir, and tunel-view into ~/.local/bin
  - Symlinks the remote-view and tunel-view skills for Antigravity and OpenCode
  - Tests connecting to your Pi (and helps configure SSH or prints next steps)

Options:
  --host <user@host>   Save REMOTE_VIEW_SSH_HOST in ~/.config/remote-view/config
  --url <base-url>     Save REMOTE_VIEW_PUBLIC_URL in ~/.config/remote-view/config
  --remote-dir <dir>   Save REMOTE_VIEW_REMOTE_DIR in ~/.config/remote-view/config
  --theme <mode>       Save REMOTE_VIEW_THEME (auto|dark|light) in config
  --opencode-native    Also symlink into ~/.config/opencode/skills
  --no-prompt          Never ask interactive questions (print instructions instead)
  --uninstall          Remove installed symlinks
  -h, --help           Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)            [[ $# -ge 2 ]] || { echo "Missing value for $1" >&2; exit 1; }; OPT_HOST="$2"; shift 2 ;;
    --url)             [[ $# -ge 2 ]] || { echo "Missing value for $1" >&2; exit 1; }; OPT_URL="$2"; shift 2 ;;
    --remote-dir)      [[ $# -ge 2 ]] || { echo "Missing value for $1" >&2; exit 1; }; OPT_REMOTE_DIR="$2"; shift 2 ;;
    --theme)           [[ $# -ge 2 ]] || { echo "Missing value for $1" >&2; exit 1; }; OPT_THEME="$2"; shift 2 ;;
    --opencode-native) LINK_OPENCODE_NATIVE=1; shift ;;
    --no-prompt)       NO_PROMPT=1; shift ;;
    --uninstall)       UNINSTALL=1; shift ;;
    -h|--help)         usage; exit 0 ;;
    *)                 echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

safe_symlink() {
  local target="$1"
  local link_path="$2"
  mkdir -p -- "$(dirname -- "$link_path")"
  if [[ -L "$link_path" ]]; then
    local current
    current="$(readlink -- "$link_path")"
    if [[ "$current" == "$target" ]]; then
      echo "[ok] $link_path -> $target"
      return 0
    fi
    rm -- "$link_path"
  elif [[ -e "$link_path" ]]; then
    echo "[skip] $link_path exists and is not a symlink (back it up or remove it manually)" >&2
    return 1
  fi
  ln -s -- "$target" "$link_path"
  echo "[linked] $link_path -> $target"
}

remove_symlink() {
  local expected_target="$1"
  local link_path="$2"
  if [[ -L "$link_path" && "$(readlink -- "$link_path")" == "$expected_target" ]]; then
    rm -- "$link_path"
    echo "[removed] $link_path"
  fi
}

if [[ "$UNINSTALL" -eq 1 ]]; then
  remove_symlink "$REPO_DIR/bin/drop-html" "$BIN_DIR/drop-html"
  remove_symlink "$REPO_DIR/bin/drop-dir" "$BIN_DIR/drop-dir"
  remove_symlink "$REPO_DIR/bin/tunel-view" "$BIN_DIR/tunel-view"
  remove_symlink "$REPO_DIR/skills/remote-view" "$AGY_SKILLS_DIR/remote-view"
  remove_symlink "$REPO_DIR/skills/tunel-view" "$AGY_SKILLS_DIR/tunel-view"
  remove_symlink "$REPO_DIR/skills/remote-view" "$AGENTS_SKILLS_DIR/remote-view"
  remove_symlink "$REPO_DIR/skills/tunel-view" "$AGENTS_SKILLS_DIR/tunel-view"
  remove_symlink "$REPO_DIR/skills/remote-view" "$OPENCODE_SKILLS_DIR/remote-view"
  remove_symlink "$REPO_DIR/skills/tunel-view" "$OPENCODE_SKILLS_DIR/tunel-view"
  exit 0
fi

chmod +x \
  "$REPO_DIR/bin/drop-html" \
  "$REPO_DIR/bin/drop-dir" \
  "$REPO_DIR/bin/tunel-view" \
  "$REPO_DIR/pi/setup-pi.sh" \
  "$REPO_DIR/pi/setup-cloudflared.sh" \
  "$REPO_DIR/pi/quick-tunnel.sh" \
  "$REPO_DIR/pi/remote-view-cleanup.sh" \
  "$REPO_DIR/install.sh"

echo "==> Linking CLIs and global skills..."
safe_symlink "$REPO_DIR/bin/drop-html" "$BIN_DIR/drop-html"
safe_symlink "$REPO_DIR/bin/drop-dir" "$BIN_DIR/drop-dir"
safe_symlink "$REPO_DIR/bin/tunel-view" "$BIN_DIR/tunel-view"
safe_symlink "$REPO_DIR/skills/remote-view" "$AGY_SKILLS_DIR/remote-view"
safe_symlink "$REPO_DIR/skills/tunel-view" "$AGY_SKILLS_DIR/tunel-view"
safe_symlink "$REPO_DIR/skills/remote-view" "$AGENTS_SKILLS_DIR/remote-view"
safe_symlink "$REPO_DIR/skills/tunel-view" "$AGENTS_SKILLS_DIR/tunel-view"

if [[ "$LINK_OPENCODE_NATIVE" -eq 1 ]]; then
  safe_symlink "$REPO_DIR/skills/remote-view" "$OPENCODE_SKILLS_DIR/remote-view"
  safe_symlink "$REPO_DIR/skills/tunel-view" "$OPENCODE_SKILLS_DIR/tunel-view"
fi

if [[ -n "$OPT_HOST" || -n "$OPT_URL" || -n "$OPT_REMOTE_DIR" || -n "$OPT_THEME" ]]; then
  # Load existing config values before rewriting requested overrides
  if [[ -r "$CONFIG_FILE" ]]; then
    # shellcheck source=/dev/null
    source "$CONFIG_FILE"
  fi
  mkdir -p -- "$CONFIG_DIR"
  cat > "$CONFIG_FILE" <<EOF
REMOTE_VIEW_SSH_HOST="${OPT_HOST:-${REMOTE_VIEW_SSH_HOST:-lcarv@bluyeti-pi.local}}"
REMOTE_VIEW_PUBLIC_URL="${OPT_URL:-${REMOTE_VIEW_PUBLIC_URL:-http://bluyeti-pi.local}}"
REMOTE_VIEW_REMOTE_DIR="${OPT_REMOTE_DIR:-${REMOTE_VIEW_REMOTE_DIR:-/var/www/drops}}"
REMOTE_VIEW_THEME="${OPT_THEME:-${REMOTE_VIEW_THEME:-auto}}"
EOF
  echo "[saved] $CONFIG_FILE"
fi

if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo ""
  echo "[note] $BIN_DIR is not in your current PATH."
  echo "       Add this to ~/.bashrc or ~/.zshrc:  export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

# Resolve effective target (respecting env > config > defaults)
# shellcheck source=bin/remote-view-common.sh
source "$REPO_DIR/bin/remote-view-common.sh"
rv_load_config "$REPO_DIR"

SSH_HOST="$REMOTE_VIEW_SSH_HOST"
PUBLIC_URL="${REMOTE_VIEW_PUBLIC_URL%/}"
HOST_ONLY="${SSH_HOST#*@}"

echo ""
echo "==> Checking connection to Pi (${SSH_HOST})..."

has_ssh_key() {
  compgen -G "${HOME}/.ssh/id_*.pub" >/dev/null 2>&1
}

print_ssh_help() {
  echo ""
  echo "To connect this computer to your Pi:"
  if ! has_ssh_key; then
    echo "  1. Generate an SSH key:"
    echo "       ssh-keygen -t ed25519"
    echo "  2. Copy your key to the Pi:"
    echo "       ssh-copy-id ${SSH_HOST}"
    echo "  3. Verify and sync UI assets:"
    echo "       drop-html --sync-assets && drop-html --check"
  else
    echo "  1. Copy your SSH key to the Pi:"
    echo "       ssh-copy-id ${SSH_HOST}"
    echo "  2. Verify and sync UI assets:"
    echo "       drop-html --sync-assets && drop-html --check"
  fi
  echo ""
  echo "If you are away from home (off LAN), configure ~/.ssh/config with cloudflared:"
  echo "  Host ${HOST_ONLY}"
  echo "    ProxyCommand cloudflared access ssh --hostname %h"
}

print_pi_provision_help() {
  echo ""
  echo "Your Pi needs lighttpd / /var/www/drops provisioned. Run:"
  echo "  scp -r \"${REPO_DIR}/pi\" ${SSH_HOST}:~/remote-view-pi"
  echo "  ssh -t ${SSH_HOST} \"cd ~/remote-view-pi && ./setup-pi.sh\""
}

RESOLVED_HOST="$(ssh -G "$SSH_HOST" 2>/dev/null | awk '/^hostname /{print $2; exit}' || true)"
[[ -n "$RESOLVED_HOST" ]] || RESOLVED_HOST="$HOST_ONLY"

if ! getent hosts "$RESOLVED_HOST" >/dev/null 2>&1; then
  echo "[warn] Could not resolve '${RESOLVED_HOST}' via getent hosts (continuing to SSH check — SSH config aliases/ProxyCommand may still work)."
fi

if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$SSH_HOST" true 2>/dev/null; then
  echo "[warn] '${HOST_ONLY}' resolves, but passwordless SSH to ${SSH_HOST} is not set up yet."
  if [[ "$NO_PROMPT" -eq 0 && -t 0 && -t 1 ]]; then
    printf "Would you like to set up SSH key access to %s now? [y/N] " "$SSH_HOST"
    read -r ans
    if [[ "$ans" =~ ^[Yy]$ ]]; then
      if ! has_ssh_key; then
        ssh-keygen -t ed25519
      fi
      ssh-copy-id "$SSH_HOST"
    else
      print_ssh_help
      exit 0
    fi
  else
    print_ssh_help
    exit 0
  fi
fi

# SSH works — check remote directory and HTTP server
if ssh -o BatchMode=yes -o ConnectTimeout=5 "$SSH_HOST" "test -d '$REMOTE_VIEW_REMOTE_DIR' && test -w '$REMOTE_VIEW_REMOTE_DIR'" 2>/dev/null; then
  echo "[ok] Non-interactive SSH works and '$REMOTE_VIEW_REMOTE_DIR' is writable."
  "$REPO_DIR/bin/drop-html" --sync-assets >/dev/null
  echo "[ok] Synced local UI assets to $REMOTE_VIEW_REMOTE_DIR/_assets/."
else
  echo "[warn] SSH works, but '$REMOTE_VIEW_REMOTE_DIR' does not exist or is not writable on $SSH_HOST."
  print_pi_provision_help
  exit 0
fi

if command -v curl >/dev/null 2>&1; then
  HTTP_CODE="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 3 "$PUBLIC_URL/" || true)"
  if [[ "$HTTP_CODE" =~ ^(200|301|302|403|404)$ ]]; then
    echo "[ok] HTTP server is live at $PUBLIC_URL/ (HTTP $HTTP_CODE)."
    echo ""
    echo "All set! Try a quick test:"
    echo "  drop-html --title \"Hello\" <<< '<h1>It works!</h1>'"
  else
    echo "[warn] SSH works, but $PUBLIC_URL/ returned HTTP ${HTTP_CODE:-000}."
    print_pi_provision_help
  fi
fi
