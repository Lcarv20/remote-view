# remote-view

An always-on **LAN & Tunneled Artifact Drop-Box** powered by a Raspberry Pi (`lighttpd` + `cloudflared`) and a zero-boilerplate HTML shell (`drop-html` / `drop-dir`), built for **Antigravity** and **OpenCode**.

## Why this exists

When coding agents generate HTML explanations, charts, diagrams, or static build outputs:

1. **Zero tunnel/server hassle from your phone:** When driving your workstation remotely from a phone, you don't need to spin up ad-hoc Python HTTP servers for each output. Publish with `drop-html` or `drop-dir` and open `http://bluyeti-pi.local/<id>.html` on your LAN—or via **Cloudflare Tunnel (`cloudflared`)** when away from home.
2. **Agents can actually see their own output:** Browser tools (such as Antigravity's built-in browser subagent) often cannot open or render local `file://` paths reliably. Serving over HTTP lets the agent inspect and verify the live rendered page.
3. **~80% fewer tokens for HTML views:** For quick explanations/dashboards, agents write only the inner `<main>` HTML fragment; `drop-html` wraps it in [template/base.html](template/base.html). For full apps/bundles (`dist/`, `build/`), `drop-dir` uploads the entire directory.

## Architecture

```text
┌─────────────────────────────┐   fragment / dist/   ┌───────────────────────────┐
│ Coding Agent                │ ───────────────────▶ │ drop-html / drop-dir      │
│ (Antigravity / OpenCode)    │                      └─────────────┬─────────────┘
└─────────────────────────────┘                                    │ SSH push
        ▲                                                          ▼
        │ browser inspection                         ┌───────────────────────────┐
        │                                            │ Raspberry Pi              │
┌───────┴─────────────────────┐    LAN :80           │ lighttpd (/var/www/drops) │
│ Phone / Desktop / Browser   │ ◀─────────────────── │ + cloudflared tunnel      │
└─────────────────────────────┘   or HTTPS tunnel    └───────────────────────────┘
```

## Repository Layout

| Path | Purpose |
| :--- | :--- |
| [bin/drop-html](bin/drop-html) | Publishes HTML fragments (wrapped in `base.html`) or standalone `--raw` HTML files |
| [bin/drop-dir](bin/drop-dir) | Publishes static build output directories (`dist/`, `build/`, `out/`) via `tar` over SSH |
| [bin/remote-view-common.sh](bin/remote-view-common.sh) | Shared config, validation, SSH, `--list`, `--rm`, `--prune`, and `--check` helpers |
| [template/base.html](template/base.html) | Minimal paper-inspired HTML shell (`{{RV_CSS_TAG}}` / `{{RV_JS_TAG}}`) |
| [assets/rv.css](assets/rv.css) | Self-owned zero-build design system (warm paper light/dark palettes, sidebar + burger drawer, cards, stats, tabs, menus) |
| [assets/rv.js](assets/rv.js) | Vanilla JS controller with 54 bundled Tabler icons, theme toggle, drawer, tabs, menus, copy-code, and table wrappers |
| [assets/fonts](assets/fonts) | Self-hosted WOFF2 fonts (`Fraunces 800`, `IBM Plex Sans 400/600`, `JetBrains Mono 400`) |
| [pi/setup-pi.sh](pi/setup-pi.sh) | Idempotent Pi setup: installs `lighttpd`, `avahi-daemon`, `cloudflared`, config, and cleanup cron |
| [pi/setup-cloudflared.sh](pi/setup-cloudflared.sh) | Configures a persistent named Cloudflare Tunnel (`view.<domain>` and optional `ssh.<domain>`) |
| [pi/quick-tunnel.sh](pi/quick-tunnel.sh) | Starts an ephemeral `trycloudflare.com` tunnel to the Pi's drop server |
| [pi/cloudflared-config.yml.example](pi/cloudflared-config.yml.example) | Example `cloudflared` ingress config for HTTP drops + SSH |
| [pi/remote-view-cleanup.sh](pi/remote-view-cleanup.sh) | Deletes file and directory drops older than N days (default 30) while preserving `index.html` |
| [skills/remote-view/SKILL.md](skills/remote-view/SKILL.md) | Publishing guide skill for Antigravity and OpenCode (`use the /remote-view skill for this`) |
| [skills/remote-view/references/components.md](skills/remote-view/references/components.md) | Copy-paste component patterns for fragments |
| [examples/showcase.html](examples/showcase.html) | Sample fragment demonstrating cards, tabs, callouts, charts, Mermaid, tables, code, and math |
| [install.sh](install.sh) | Symlinks `drop-html`/`drop-dir` into `~/.local/bin` and the skill into Antigravity & OpenCode global folders |

---

## 1. Raspberry Pi Setup

Run these steps once to turn your Pi into a 24/7 artifact server (~2 MB RAM) with `cloudflared` ready for remote tunnels.

### 1.1 Copy SSH key for non-interactive uploads

```bash
ssh-copy-id lcarv@bluyeti-pi.local   # replace user/host if yours differs
```

### 1.2 Install `lighttpd`, `avahi-daemon`, and `cloudflared` on the Pi

```bash
ssh lcarv@bluyeti-pi.local "rm -rf ~/remote-view-pi"
scp -r pi lcarv@bluyeti-pi.local:~/remote-view-pi
ssh -t lcarv@bluyeti-pi.local "cd ~/remote-view-pi && ./setup-pi.sh"
```

What `pi/setup-pi.sh` does:
- Installs `lighttpd` and `avahi-daemon` (for `.local` mDNS).
- Installs `cloudflared` (using `cloudflared-linux-arm` directly on `armv6l` Pis so it never hits `Illegal instruction` from ARMv7 `armhf` builds, and Cloudflare's APT repo on newer Pis).
- Creates `/var/www/drops` owned by your SSH user (`0755`) so `drop-html` / `drop-dir` can write `0644`/`0755` artifacts.
- Configures `/etc/lighttpd/conf-available/99-remote-view.conf` (`server.document-root := "/var/www/drops"` on port 80 with directory listing enabled) and enables `lighttpd`.
- Installs a weekly cleanup cron (`/etc/cron.weekly/remote-view-cleanup`) pruning drops older than `30` days (`REMOTE_VIEW_CLEANUP_DAYS=0` disables it).

> **Tip:** Set `REMOTE_VIEW_NO_LISTING=1 ./setup-pi.sh` if you expose the Pi publicly via Cloudflare Tunnel without Cloudflare Access and want to disable directory listings at `/`.

---

## 2. Remote Access with `cloudflared` (When Not at Home)

`pi/setup-pi.sh` installs `cloudflared` on the Pi so you can reach your drops (and optionally SSH into the Pi) from anywhere.

### Option A: Quick Tunnel (no domain required)

On the Pi, start an instant ephemeral HTTPS tunnel:

```bash
~/remote-view-pi/quick-tunnel.sh
# -> prints https://<random>.trycloudflare.com
```

### Option B: Persistent Named Tunnel (recommended)

If you have a domain on Cloudflare, run on the Pi:

```bash
~/remote-view-pi/setup-cloudflared.sh remote-view view.yourdomain.com
```

To also expose SSH over the tunnel (so `drop-html` / `drop-dir` work when your laptop is off the home LAN):

```bash
~/remote-view-pi/setup-cloudflared.sh remote-view view.yourdomain.com pi-ssh.yourdomain.com
```

Then on your workstation:
1. Point `~/.config/remote-view/config` at your tunnel URL:
   ```bash
   REMOTE_VIEW_PUBLIC_URL="https://view.yourdomain.com"
   ```
2. Optional `~/.ssh/config` entry for off-LAN uploads via `cloudflared access ssh`:
   ```sshconfig
   Host pi-ssh.yourdomain.com
     User lcarv
     ProxyCommand cloudflared access ssh --hostname %h
   ```
3. **Recommended security:** Put `https://view.yourdomain.com` behind a **Cloudflare Zero Trust Access** policy (e.g., email OTP) or run `setup-pi.sh` with `REMOTE_VIEW_NO_LISTING=1`.

---

## 3. Workstation & Agent Skill Setup

Run `./install.sh` from the repository root:

```bash
./install.sh
```

This creates symlinks pointing directly into this repository:
- `~/.local/bin/drop-html` → `bin/drop-html`
- `~/.local/bin/drop-dir` → `bin/drop-dir`
- `~/.gemini/config/skills/remote-view` → `skills/remote-view` (**Antigravity** global skill)
- `~/.agents/skills/remote-view` → `skills/remote-view` (**OpenCode** & universal cross-agent global skill)

> Pass `--opencode-native` if you also want a symlink at `~/.config/opencode/skills/remote-view`, or `--uninstall` to remove the symlinks.

Then in prompts to Antigravity or OpenCode, simply tell the agent:

> `use the /remote-view skill for this`

Verify workstation-to-Pi connectivity:

```bash
drop-html --check
```

---

## 4. Configuration (Optional)

Override defaults via environment variables or `~/.config/remote-view/config`:

```bash
# ~/.config/remote-view/config
REMOTE_VIEW_SSH_HOST="lcarv@bluyeti-pi.local"
REMOTE_VIEW_PUBLIC_URL="http://bluyeti-pi.local"
REMOTE_VIEW_REMOTE_DIR="/var/www/drops"
REMOTE_VIEW_THEME="auto"   # auto | dark | light
```

Precedence: CLI flags (`--host`, `--url`, `--theme`) > environment variables > `~/.config/remote-view/config` > built-in defaults.

---

## 5. Usage

### HTML fragments (`drop-html`)

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

### Standalone HTML files (`--raw`)

```bash
drop-html --raw --id report report.html
```

### Build outputs & static sites (`drop-dir`)

```bash
# Build with relative base so assets resolve under /<id>/
vite build --base=./
drop-dir dist/
# -> http://bluyeti-pi.local/m8q3z1/

# Or update a fixed slug on every rebuild
drop-dir --id my-app dist/
```

### Local preview & management

```bash
drop-html --local --title "Showcase" examples/showcase.html
drop-dir --local dist/

drop-html --list
drop-html --rm k4m9x2
drop-html --prune 14
```

---

## 6. Local Paper UI Kit & Component Stack

Instead of third-party CSS frameworks or icon CDNs, `remote-view` ships its own lightweight, zero-build UI kit in [assets/rv.css](assets/rv.css) and [assets/rv.js](assets/rv.js) (automatically content-hashed and synced to `/var/www/drops/_assets/` on the Pi, or inlined when using `--local`):

- **Warm Paper Light & Dark Modes:** Archival ivory light mode (`#f7f4ec`) and warm charcoal dark mode (`#151412`), paired with bold **Fraunces** display headings, **IBM Plex Sans** body copy, and **JetBrains Mono** code—served from local WOFF2 files in [assets/fonts](assets/fonts).
- **Classless Semantic Base:** Headings, paragraphs, lists, blockquotes, `<details>`, `<table>`, and `<pre><code>` look crisp with zero classes—avoiding card/component pollution when plain prose works best.
- **Built-in Components:** Optional `.rv-sidebar` (sticky on desktop, auto-collapses into a topbar burger drawer on mobile), `.card`, `.stat`, `.badge`, `.callout`, `[data-tabs]`, `.rv-menu[popover]`, `.steps`, and `.grid-2` / `.grid-3` / `.grid-4`.
- **Tabler Icons:** 54 curated [Tabler Icons](https://github.com/tabler/tabler-icons) bundled locally inside `rv.js` (`<i data-icon="bolt"></i>`) with automatic fallback for any other Tabler icon name.
- **Code, Charts, Diagrams, Math:** Highlight.js (`11.12.0`, theme-synced + Copy button), Chart.js (`4.6.1`), Mermaid (`12.3.0`), and KaTeX (`0.19.1` scoped to `$$`, `\[`, `\(`).

---

## 7. Troubleshooting

- **`.local` doesn't resolve on Android / away from home:** Use a Cloudflare Tunnel URL (`REMOTE_VIEW_PUBLIC_URL="https://view.yourdomain.com"`) or your Pi's LAN IP (`http://192.168.1.97`).
- **Build output assets return 404 under `/<id>/`:** Check if `index.html` references `/assets/...` from `/`; rebuild with a relative base (e.g., `vite build --base=./`).
- **`Permission denied (publickey)` on `drop-html` / `drop-dir`:** Run `ssh-copy-id <user>@bluyeti-pi.local`. `BatchMode=yes` is enabled by default so agents fail fast instead of hanging on password prompts.
