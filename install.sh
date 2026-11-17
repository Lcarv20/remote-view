#!/usr/bin/env bash
set -euo pipefail

# Install remote-view CLIs and global agent skills (Antigravity + OpenCode)
# using symlinks into this repository so updates stay in sync.

REPO_DIR="$(cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${HOME}/.local/bin"
AGY_SKILLS_DIR="${HOME}/.gemini/config/skills"
AGENTS_SKILLS_DIR="${HOME}/.agents/skills"
OPENCODE_SKILLS_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills"

LINK_OPENCODE_NATIVE=0
UNINSTALL=0

usage() {
  cat <<'EOF'
Usage: ./install.sh [OPTIONS]

Symlink drop-html and drop-dir into ~/.local/bin and the remote-view skill
into global Antigravity (~/.gemini/config/skills) and OpenCode (~/.agents/skills) folders.

Options:
  --opencode-native   Also symlink into ~/.config/opencode/skills (in addition
                      to ~/.agents/skills)
  --uninstall         Remove installed symlinks
  -h, --help          Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --opencode-native) LINK_OPENCODE_NATIVE=1; shift ;;
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
  remove_symlink "$REPO_DIR/skills/remote-view" "$AGY_SKILLS_DIR/remote-view"
  remove_symlink "$REPO_DIR/skills/remote-view" "$AGENTS_SKILLS_DIR/remote-view"
  remove_symlink "$REPO_DIR/skills/remote-view" "$OPENCODE_SKILLS_DIR/remote-view"
  exit 0
fi

chmod +x \
  "$REPO_DIR/bin/drop-html" \
  "$REPO_DIR/bin/drop-dir" \
  "$REPO_DIR/pi/setup-pi.sh" \
  "$REPO_DIR/pi/setup-cloudflared.sh" \
  "$REPO_DIR/pi/quick-tunnel.sh" \
  "$REPO_DIR/pi/remote-view-cleanup.sh" \
  "$REPO_DIR/install.sh"

safe_symlink "$REPO_DIR/bin/drop-html" "$BIN_DIR/drop-html"
safe_symlink "$REPO_DIR/bin/drop-dir" "$BIN_DIR/drop-dir"
safe_symlink "$REPO_DIR/skills/remote-view" "$AGY_SKILLS_DIR/remote-view"
safe_symlink "$REPO_DIR/skills/remote-view" "$AGENTS_SKILLS_DIR/remote-view"

if [[ "$LINK_OPENCODE_NATIVE" -eq 1 ]]; then
  safe_symlink "$REPO_DIR/skills/remote-view" "$OPENCODE_SKILLS_DIR/remote-view"
fi

echo ""
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo "Note: $BIN_DIR is not in your current PATH. Add it in your shell profile."
fi
echo "Next steps:"
echo "  1. Set up your Raspberry Pi: copy pi/ to the Pi and run ./setup-pi.sh"
echo "  2. Copy your SSH key to the Pi: ssh-copy-id lcarv@bluyeti-pi.local"
echo "  3. Verify connectivity: drop-html --check"
