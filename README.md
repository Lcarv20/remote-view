# remote-view

A small tool for publishing HTML fragments and static build directories from a workstation to a Raspberry Pi over SSH (`lighttpd` + optional `cloudflared`). Built for coding agents like Antigravity and OpenCode.

## Why

- **No per-project dev servers:** When working remotely from a phone, you don't have to spin up ad-hoc HTTP servers or port forwards for every diagram or report. Push it with `drop-html` or `drop-dir` and open `http://bluyeti-pi.local/<id>.html`.
- **Works with browser tools:** Agent browser tools often struggle with `file://` URLs. Serving over HTTP lets the agent open and inspect the rendered page.
- **Less HTML boilerplate:** For quick explanations or dashboards, the agent only writes the inner `<main>` fragment and `drop-html` wraps it in [template/base.html](template/base.html). Full apps (`dist/`, `build/`) can be uploaded as-is with `drop-dir`.

## Setup

### 1. Raspberry Pi

Copy your SSH key so uploads don't prompt for a password:

```bash
ssh-copy-id lcarv@bluyeti-pi.local
```

Copy `pi/` to the Pi and run the setup script:

```bash
scp -r pi lcarv@bluyeti-pi.local:~/remote-view-pi
ssh -t lcarv@bluyeti-pi.local "cd ~/remote-view-pi && ./setup-pi.sh"
```

`setup-pi.sh` installs `lighttpd`, `avahi-daemon` (for `.local` mDNS), and `cloudflared`, creates `/var/www/drops` owned by your SSH user, serves it on port 80, and sets up a weekly cron job to delete drops older than 30 days (`REMOTE_VIEW_CLEANUP_DAYS=0` disables cleanup).

If you expose the server publicly without Cloudflare Access, run `REMOTE_VIEW_NO_LISTING=1 ./setup-pi.sh` to disable directory listings at `/`.

### 2. Workstation

Clone the repo and run:

```bash
./install.sh
# or for a non-default Pi hostname/user:
./install.sh --host pi@my-pi.local --url http://my-pi.local
```

This symlinks `drop-html`, `drop-dir`, and `tunel-view` into `~/.local/bin`, installs the [remote-view skill](skills/remote-view/SKILL.md) and [tunel-view skill](skills/tunel-view/SKILL.md) for Antigravity (`~/.gemini/config/skills/`) and OpenCode (`~/.agents/skills/`), and checks SSH/HTTP connectivity to the Pi.

Useful flags:

- `--host <user@host>` / `--url <base-url>` / `--theme <auto|dark|light>` — write defaults to `~/.config/remote-view/config`
- `--opencode-native` — also symlink into `~/.config/opencode/skills/`
- `--no-prompt` — skip interactive SSH key setup prompts
- `--uninstall` — remove symlinks

Verify connectivity anytime with `drop-html --check`. In prompts, tell the agent `use the /remote-view skill for this` or `use /tunel-view`.

### 3. Remote access (optional)

`setup-pi.sh` installs `cloudflared` on the Pi for access outside your LAN.

**Managed ephemeral quick tunnel (recommended, no domain needed):**

`tunel-view` starts a detached `cloudflared` quick tunnel with a **12-hour default TTL** and clean spin-down:

```bash
# Tunnel the Pi remote-view server (12h default TTL)
TUNNEL_URL="$(tunel-view up)"
drop-html --id preview --url "$TUNNEL_URL" --title "Preview" <<< '<h1>Hello</h1>'
# or use --tunnel to read the active Pi tunnel URL automatically:
drop-html --id preview --tunnel --title "Preview" <<< '<h1>Hello</h1>'

# Or serve a local HTML file / folder + tunnel it (12h TTL; edit the file in place)
tunel-view up --serve /tmp/preview.html

# Or tunnel an existing local dev server
tunel-view up --port 5173

# Inspect or cancel on demand
tunel-view status
tunel-view down
```

Running `tunel-view up` again reuses the active server and tunnel when the target matches (so updating the file works on refresh), or kills the previous tunnel/managed server when switching targets or passing `--restart`. Pass `--ttl <duration>` only if you need a custom lifetime (never exceed `12h` unless explicitly requested).

**Foreground quick tunnel directly on the Pi:**

```bash
~/remote-view-pi/quick-tunnel.sh
# prints https://<random>.trycloudflare.com
```

**Named tunnel (with a Cloudflare domain):**

```bash
~/remote-view-pi/setup-cloudflared.sh remote-view view.yourdomain.com
# or also tunnel SSH:
~/remote-view-pi/setup-cloudflared.sh remote-view view.yourdomain.com pi-ssh.yourdomain.com
```

Then set `REMOTE_VIEW_PUBLIC_URL="https://view.yourdomain.com"` in `~/.config/remote-view/config`. If you tunneled SSH too, add this to `~/.ssh/config` on your workstation:

```sshconfig
Host pi-ssh.yourdomain.com
  User lcarv
  ProxyCommand cloudflared access ssh --hostname %h
```

Put `view.yourdomain.com` behind Cloudflare Zero Trust Access (or use `REMOTE_VIEW_NO_LISTING=1`) if you don't want drops publicly listable. `REMOTE_VIEW_NO_LISTING=1` is also recommended when exposing the Pi via `tunel-view up` or `quick-tunnel.sh`.

## Usage

**HTML fragment:**

```bash
drop-html --title "Cache Architecture" <<'EOF'
<h1>Redis Write-Through Flow</h1>
<pre class="mermaid">
sequenceDiagram
  App->>Cache: write(key, val)
  Cache->>DB: persist(key, val)
</pre>
EOF
# -> http://bluyeti-pi.local/k4m9x2.html
```

**Standalone HTML file:**

```bash
drop-html --raw --id report report.html
```

**Static build directory:**

```bash
# Use a relative base so assets resolve under /<id>/
vite build --base=./
drop-dir dist/
# -> http://bluyeti-pi.local/m8q3z1/

# Fixed slug for repeated builds
drop-dir --id my-app dist/
```

**Local preview & cleanup:**

```bash
drop-html --local --title "Showcase" examples/showcase.html
drop-dir --local dist/

drop-html --list
drop-html --rm k4m9x2
drop-html --prune 14
```

## Configuration

Defaults can be set in `~/.config/remote-view/config` or via environment variables (precedence: CLI flags > env vars > config file > built-in defaults):

```bash
REMOTE_VIEW_SSH_HOST="lcarv@bluyeti-pi.local"
REMOTE_VIEW_PUBLIC_URL="http://bluyeti-pi.local"
REMOTE_VIEW_REMOTE_DIR="/var/www/drops"
REMOTE_VIEW_THEME="auto"   # auto | dark | light
REMOTE_VIEW_PORT="80"      # HTTP port on the Pi
REMOTE_VIEW_SSH_BATCH="1"  # 1 = BatchMode=yes (fail fast instead of prompting)
REMOTE_VIEW_TEMPLATE=""    # optional custom base.html path
```

## Template & UI assets

Fragments are wrapped in [template/base.html](template/base.html) using [assets/rv.css](assets/rv.css) and [assets/rv.js](assets/rv.js), which are content-hashed and synced to `/var/www/drops/_assets/` (or inlined with `--local`).

- Light and dark themes with self-hosted fonts (`Fraunces`, `IBM Plex Sans`, `JetBrains Mono` in [assets/fonts](assets/fonts))
- Plain semantic HTML styling plus optional helpers (`.rv-sidebar`, `.card`, `.stat`, `.badge`, `.callout`, `[data-tabs]`, `.rv-menu[popover]`, `.steps`, `.grid-2`/`3`/`4`)
- 55 bundled Tabler icons (`<i data-icon="bolt"></i>`)
- Built-in Highlight.js, Chart.js, Mermaid, and KaTeX (`$$`, `\[`, `\(`) — see [examples/showcase.html](examples/showcase.html) and [skills/remote-view/references/components.md](skills/remote-view/references/components.md)

## Repo layout

- [bin/drop-html](bin/drop-html), [bin/drop-dir](bin/drop-dir), [bin/tunel-view](bin/tunel-view), [bin/remote-view-common.sh](bin/remote-view-common.sh) — CLI scripts and SSH/management helpers
- [template/base.html](template/base.html), [assets/](assets) — HTML shell, CSS/JS, and fonts
- [pi/](pi) — Pi provisioning (`setup-pi.sh`), `cloudflared` helpers, and cleanup cron script
- [skills/remote-view/](skills/remote-view), [skills/tunel-view/](skills/tunel-view) — Agent skills and component reference
- [examples/showcase.html](examples/showcase.html) — Example fragment
- [install.sh](install.sh) — Workstation installer

## Troubleshooting

- **`.local` doesn't resolve (Android or off-LAN):** Set `REMOTE_VIEW_PUBLIC_URL` to your `cloudflared` URL or the Pi's LAN IP (e.g. `http://192.168.1.97`).
- **Assets 404 inside `drop-dir` output:** `index.html` is likely referencing `/assets/...` from root; rebuild with a relative base (`vite build --base=./`).
- **`Permission denied (publickey)`:** Run `ssh-copy-id <user>@bluyeti-pi.local`. `BatchMode=yes` is enabled so commands fail immediately instead of hanging on a password prompt.
