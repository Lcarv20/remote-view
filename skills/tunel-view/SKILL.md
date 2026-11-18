---
name: tunel-view
description: >-
  Manage ephemeral Cloudflare Quick Tunnels (`trycloudflare.com`) via `tunel-view`
  for `remote-view` drops on the Raspberry Pi, local HTML files/folders (`--serve`),
  or local dev servers (`--port`), with strict 12-hour TTL defaults and on-demand cleanup.
---

# Ephemeral Tunnels with tunel-view

Use `tunel-view` to expose an HTML preview or local dev server over an ephemeral `https://<random>.trycloudflare.com` tunnel (`cloudflared`), and keep the same server and tunnel running while iterating on the file.

## Strict Rules

1. **12-hour maximum lifetime by default:** `tunel-view up` enforces `--ttl 12h` automatically. **Never** pass a longer `--ttl` (or `--ttl 0` / `none`) unless the user **explicitly** asks for more than 12 hours. Always mention the expiry time when sharing the URL (check `tunel-view status` or `tunel-view up` stderr for the exact expiry timestamp).
2. **Keep the same server and tunnel across back-and-forth edits — just update the file:**
   - **Local HTML file or directory (`--serve`):** Start once with `tunel-view up --serve /path/to/preview.html` (or a folder). When the user asks for changes, **just edit/overwrite that file in place** (for example via `drop-html -o /path/to/preview.html` or file edits). Do **not** recreate the server or tunnel on every edit—the user simply refreshes the same URL. Single-file `--serve /tmp/preview.html` only exposes that specific file (not sibling files in `/tmp`) with `Cache-Control: no-store`.
   - **Raspberry Pi (`remote-view`):** Start the tunnel once (`TUNNEL_URL="$(tunel-view up)"`) and publish with a stable slug (`drop-html --id <slug> --url "$TUNNEL_URL"` or `drop-html --id <slug> --tunnel`). On follow-up edits, **re-upload to the same `--id`** (`drop-html --id <slug> --tunnel` or `TUNNEL_URL="$(tunel-view up)" && drop-html --id <slug> --url "$TUNNEL_URL"`); do not spawn a new tunnel every turn.
   - **External local dev server (`--port` / `--target`):** Tunnel the running server once (`tunel-view up --port 5173`) and update source files in place.
   - **Only replace when actually switching targets:** Running `tunel-view up` with the same target reuses the active server and tunnel; running it with a different target/path/port (or `--restart`) kills the previous tunnel/managed server first so duplicates never pile up. If you manually spawned an external dev server and must launch a replacement, kill the old server process first.
3. **Cancel on demand (`tunel-view down`):** Whenever the user asks to stop/cancel the server or tunnel, or when temporary previewing is finished, run `tunel-view down` (stops both `cloudflared` and any `--serve` HTTP server cleanly).
4. **Never invoke raw `cloudflared tunnel` directly:** Always use `tunel-view` so PID/PGID tracking, 12-hour auto-expiry, and clean shutdown stay intact.

## 1. Local HTML File or Folder (`--serve`)

When creating and iterating on a local HTML file without uploading to the Pi:

```bash
# First preview: wrap fragment locally and spin up a managed 12h server + tunnel
drop-html -o /tmp/preview.html --title "Architecture" <<'REMOTE_VIEW_EOF'
<h1>Cache Flow</h1>
<p>First draft.</p>
REMOTE_VIEW_EOF
tunel-view up --serve /tmp/preview.html
# -> https://<random>.trycloudflare.com/preview.html

# Follow-up edits: update the file ONLY (server + tunnel stay running)
drop-html -o /tmp/preview.html --title "Architecture" <<'REMOTE_VIEW_EOF'
<h1>Cache Flow</h1>
<p>Updated after feedback.</p>
REMOTE_VIEW_EOF
```

## 2. Raspberry Pi `remote-view` Server

Spin up one 12-hour tunnel on the Pi and reuse its URL across updates to the same `--id`:

```bash
TUNNEL_URL="$(tunel-view up)"
drop-html --id preview --url "$TUNNEL_URL" --title "Preview" <<'REMOTE_VIEW_EOF'
<h1>Remote Preview</h1>
<p>First draft.</p>
REMOTE_VIEW_EOF

# Follow-up edits: overwrite the same slug using --tunnel (or reuse tunel-view up)
drop-html --id preview --tunnel --title "Preview" page.html
# or:
TUNNEL_URL="$(tunel-view up)" && drop-html --id preview --url "$TUNNEL_URL" --title "Preview" page.html
```

Or publish a static build directory:

```bash
TUNNEL_URL="$(tunel-view up)"
drop-dir --id my-app --url "$TUNNEL_URL" dist/
```

## 3. Existing Local Dev Server (`--port` / `--target`)

```bash
tunel-view up --port 5173
# or any local URL:
tunel-view up --target http://127.0.0.1:3000
```

## 4. Lifecycle, Status & Cleanup

- `tunel-view status` — inspect active tunnel(s), URL, target, PID/PGID, and remaining TTL
- `tunel-view url` — print the active URL cleanly (exits non-zero if inactive)
- `tunel-view up --restart` — force a fresh tunnel URL (`--keep-other` preserves a tunnel in the other scope)
- `tunel-view down` (or `tunel-view down --all`) — cancel active tunnel(s) and any `--serve` HTTP server immediately
- `tunel-view logs [-n 50]` — show recent `cloudflared` and `--serve` output
- `--host <user@host>` / `--remote-port <port>` — override Pi SSH host or HTTP port (default `80`)
- `--ttl <duration>` — override TTL (e.g. `30m`, `2h`, `12h`); **only** exceed `12h` on explicit user request
- `--json` — machine-readable JSON output for `up`, `down`, `status`, and `url`
