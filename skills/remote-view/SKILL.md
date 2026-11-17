---
name: remote-view
description: >-
  How to publish HTML fragments, standalone HTML pages, and static build output
  directories to the remote-view server using `drop-html` and `drop-dir`.
---

# Publishing with remote-view

Three publishing modes are available depending on what is being shared:

## 1. HTML Fragment (`drop-html`)

`drop-html` wraps an inner `<main>` HTML fragment inside the local paper-style shell (`assets/rv.css` + `assets/rv.js`) and prints the published URL.

```bash
drop-html --title "Page Title" <<'REMOTE_VIEW_EOF'
<h1>Heading</h1>
<p>Plain prose, lists, tables, and code blocks are styled cleanly by default.</p>
REMOTE_VIEW_EOF
```

- Pass only the inner body HTML (`<!DOCTYPE>`, `<html>`, `<head>`, and CDN imports are already in `base.html`).
- Use a distinct quoted heredoc delimiter (e.g. `<<'REMOTE_VIEW_EOF'`) if your fragment contains `EOF` or `$`.
- **Keep layouts clean and restrained:** The UI components below are optional tools, not a checklist—use only what clarifies the content. Prefer plain headings, prose, lists, and tables over wrapping every section in `.card` boxes (avoid card pollution).

### Available Local Stack & Primitives

- **Typography & Layout:** `h1`/`h2` display serif (`Fraunces`), readable body (`IBM Plex Sans`), `.grid-2`, `.grid-3`, `.grid-4`, `.stack`, `.row`, `.split`, `.muted`, `.mono`.
- **Optional Components:** `<article class="card">`, `<article class="stat">`, `<span class="badge [brand|success|warning|danger] pill">`, `<aside class="callout [info|success|warning|danger]">`, `<div class="tabs" data-tabs>`, `<ol class="steps">`, native `<details>`, `.btn`, and `.rv-menu[popover]` dropdowns.
- **Navigation Sidebar + Mobile Burger Drawer:** Include `<nav class="rv-sidebar" aria-label="Sections">...</nav>` inside the fragment for a sticky desktop sidebar that turns into a topbar burger drawer on mobile.
- **Tabler Icons (local):** `<i data-icon="bolt"></i>` (54 core icons bundled locally; any other Tabler outline icon name resolves automatically).
- **Code, Charts, Diagrams, Math:** `<pre><code class="language-...">` (Highlight.js + language chip + Copy), `<div class="chart-box"><canvas id="c1"></canvas></div>` (`Chart`), `<pre class="mermaid">...</pre>` (Mermaid v12), `<table>` (auto-scrolled), and KaTeX (`$$...$$`, `\[...\]`, `\(...\)`).
- See [references/components.md](references/components.md) for markup examples.

## 2. Standalone HTML File (`drop-html --raw`)

Full HTML documents starting with `<!DOCTYPE html>` or `<html>` are detected automatically (or pass `--raw`) and uploaded verbatim without wrapping:

```bash
drop-html --raw --id my-report report.html
```

## 3. Build Output Directory (`drop-dir`)

`drop-dir` uploads an entire static build directory (e.g. `dist/`, `build/`, `out/`) to `/<id>/` and prints `http://.../<id>/`:

```bash
drop-dir dist/
drop-dir --id preview-v2 dist/
```

- Re-using `--id <slug>` replaces that directory cleanly with the latest build.
- Because directory drops live under a subpath (`/<id>/`), build SPAs/assets with a relative base when supported (for example, `vite build --base=./`) so root-relative `/assets/...` paths do not 404.
- Passing a directory directly to `drop-html dist/` delegates to `drop-dir`.

## Useful Options & Management

- `--id <slug>`: stable custom URL slug instead of a random 6-character ID
- `--theme dark|light|auto`: default color scheme for wrapped fragments (default: `dark`)
- `--local` / `-o <path>`: write self-contained HTML locally without SSH
- `--sync-assets`: force re-upload of `assets/rv.*` and `assets/fonts/*` to `/_assets/` on the Pi
- `--host <user@host>` / `--url <base-url>`: override configured SSH target or public URL
- `--list`, `--rm <id>`, `--prune <days>`, `--check`: inspect, remove, or diagnose drops on the server

Published URLs are served over HTTP/HTTPS, so they can be opened directly from remote devices (such as a phone) or inspected with browser tools.
