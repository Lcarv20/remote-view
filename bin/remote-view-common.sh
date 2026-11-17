#!/usr/bin/env bash
# Shared configuration, validation, SSH, and management helpers for drop-html and drop-dir.

rv_resolve_script_dir() {
  local src="$1"
  while [[ -L "$src" ]]; do
    local dir
    dir="$(cd -P -- "$(dirname -- "$src")" && pwd)"
    src="$(readlink -- "$src")"
    [[ "$src" != /* ]] && src="$dir/$src"
  done
  cd -P -- "$(dirname -- "$src")" && pwd
}

rv_load_config() {
  local repo_dir="$1"
  local config_file="${XDG_CONFIG_HOME:-$HOME/.config}/remote-view/config"

  local _env_ssh_host="${REMOTE_VIEW_SSH_HOST:-}"
  local _env_public_url="${REMOTE_VIEW_PUBLIC_URL:-}"
  local _env_remote_dir="${REMOTE_VIEW_REMOTE_DIR:-}"
  local _env_theme="${REMOTE_VIEW_THEME:-}"
  local _env_template="${REMOTE_VIEW_TEMPLATE:-}"
  local _env_ssh_batch="${REMOTE_VIEW_SSH_BATCH:-}"
  local _env_port="${REMOTE_VIEW_PORT:-}"

  if [[ -r "$config_file" ]]; then
    # shellcheck source=/dev/null
    source "$config_file"
  fi

  REMOTE_VIEW_SSH_HOST="${_env_ssh_host:-${REMOTE_VIEW_SSH_HOST:-lcarv@bluyeti-pi.local}}"
  REMOTE_VIEW_PUBLIC_URL="${_env_public_url:-${REMOTE_VIEW_PUBLIC_URL:-http://bluyeti-pi.local}}"
  REMOTE_VIEW_REMOTE_DIR="${_env_remote_dir:-${REMOTE_VIEW_REMOTE_DIR:-/var/www/drops}}"
  REMOTE_VIEW_THEME="${_env_theme:-${REMOTE_VIEW_THEME:-auto}}"
  REMOTE_VIEW_TEMPLATE="${_env_template:-${REMOTE_VIEW_TEMPLATE:-$repo_dir/template/base.html}}"
  REMOTE_VIEW_SSH_BATCH="${_env_ssh_batch:-${REMOTE_VIEW_SSH_BATCH:-1}}"
  REMOTE_VIEW_PORT="${_env_port:-${REMOTE_VIEW_PORT:-80}}"
}

rv_die() {
  echo "${RV_PROG:-remote-view}: error: $*" >&2
  exit 1
}

rv_generate_id() {
  local id=""
  while [[ ${#id} -lt 6 ]]; do
    id+=$(dd if=/dev/urandom bs=128 count=1 2>/dev/null | LC_ALL=C tr -dc 'a-z0-9')
  done
  printf '%s' "${id:0:6}"
}

rv_validate_slug() {
  local slug="${1%.html}"
  slug="${slug%/}"
  if [[ ! "$slug" =~ ^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$ ]]; then
    rv_die "invalid id '$1' (allowed: letters, digits, '-' and '_', max 64 chars)"
  fi
  printf '%s' "$slug"
}

rv_ssh() {
  local opts=(-o ConnectTimeout=5)
  if [[ "$REMOTE_VIEW_SSH_BATCH" == "1" ]]; then
    opts+=(-o BatchMode=yes)
  fi
  ssh "${opts[@]}" "$REMOTE_VIEW_SSH_HOST" "$@"
}

rv_run_check() {
  local ok=0
  local hostname_only="${REMOTE_VIEW_SSH_HOST#*@}"
  local public_base="${REMOTE_VIEW_PUBLIC_URL%/}"

  echo "Checking remote-view configuration..."
  echo "  SSH target : $REMOTE_VIEW_SSH_HOST"
  echo "  Public URL : $public_base"
  echo "  Remote dir : $REMOTE_VIEW_REMOTE_DIR"
  echo "  Template   : $REMOTE_VIEW_TEMPLATE"

  if [[ -r "$REMOTE_VIEW_TEMPLATE" ]]; then
    echo "[ok] Template found"
  else
    echo "[fail] Template not readable: $REMOTE_VIEW_TEMPLATE" >&2
    ok=1
  fi

  if getent hosts "$hostname_only" >/dev/null 2>&1; then
    echo "[ok] Host resolves: $(getent hosts "$hostname_only" | head -n 1)"
  else
    echo "[warn] Could not resolve '$hostname_only' via getent hosts"
  fi

  if rv_ssh "test -d '$REMOTE_VIEW_REMOTE_DIR' && test -w '$REMOTE_VIEW_REMOTE_DIR'" 2>/dev/null; then
    echo "[ok] Non-interactive SSH works and '$REMOTE_VIEW_REMOTE_DIR' is writable"
  else
    echo "[fail] SSH check failed for $REMOTE_VIEW_SSH_HOST ($REMOTE_VIEW_REMOTE_DIR)" >&2
    echo "       Tip: copy your SSH key with: ssh-copy-id $REMOTE_VIEW_SSH_HOST" >&2
    echo "       Or run pi/setup-pi.sh on your Raspberry Pi." >&2
    ok=1
  fi

  if command -v curl >/dev/null 2>&1; then
    local http_code
    http_code="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 3 "$public_base/" || true)"
    if [[ "$http_code" =~ ^(200|301|302|403|404)$ ]]; then
      echo "[ok] HTTP server reachable at $public_base/ (HTTP $http_code)"
    else
      echo "[fail] HTTP server not reachable at $public_base/ (got HTTP ${http_code:-000})" >&2
      ok=1
    fi
  fi

  exit "$ok"
}

rv_list_drops() {
  rv_ssh "ls -lht --time-style='+%Y-%m-%d %H:%M' '$REMOTE_VIEW_REMOTE_DIR' | grep -E '(\.html|^d)' | grep -v ' _assets\$' || echo '(no drops yet)'"
}

rv_remove_drop() {
  local slug
  slug="$(rv_validate_slug "$1")"
  rv_ssh "rm -rf -- '$REMOTE_VIEW_REMOTE_DIR/${slug}' '$REMOTE_VIEW_REMOTE_DIR/${slug}.html'"
  echo "Removed ${slug} (${slug}.html / ${slug}/) from ${REMOTE_VIEW_REMOTE_DIR}"
}

rv_prune_drops() {
  local days="$1"
  [[ "$days" =~ ^[0-9]+$ ]] || rv_die "--prune requires a non-negative integer number of days"
  rv_ssh "
    find '$REMOTE_VIEW_REMOTE_DIR' -maxdepth 1 -type f -name '*.html' ! -name 'index.html' -mtime +'$days' -print -delete
    for d in '$REMOTE_VIEW_REMOTE_DIR'/*/; do
      [ -d \"\$d\" ] || continue
      case \"\$(basename \"\$d\")\" in _*) continue ;; esac
      if [ -z \"\$(find \"\$d\" -mtime -'$days' -print -quit)\" ]; then
        printf '%s\n' \"\$d\"
        rm -rf -- \"\$d\"
      fi
    done
  "
}
