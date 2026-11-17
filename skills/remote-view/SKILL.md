---
name: remote-view
description: >-
  How to publish HTML fragments, standalone HTML pages, and static build output
  directories to the remote-view server using `drop-html` and `drop-dir`.
---

# Publishing with remote-view

Three publishing modes are available depending on what is being shared:

## 1. HTML Fragment (`drop-html`)

`drop-html` wraps an inner `<main>` HTML fragment inside the pre-styled `base.html` shell and prints the published URL.

```bash
drop-html --title "Page Title" <<'EOF'
<h1>Heading</h1>
<wa-callout variant="brand">Fragment body here.</wa-callout>
EOF
```

- Pass only the inner body HTML (`<!DOCTYPE>`, `<html>`, `<head>`, and CDN imports are already in `base.html`).
- Quote `'EOF'` so `$` in shell snippets or math is not expanded by bash.
- Preloaded libraries: **Web Awesome 3** (`<wa-card>`, `<wa-tab-group>`, `<wa-callout>`, `<wa-details>`, `<wa-badge>`, `<wa-icon>`), **Tailwind CSS v4**, **Highlight.js** (`<pre><code class="language-...">`), **Chart.js** (`Chart`), **Mermaid v12** (`<pre class="mermaid">`), **KaTeX** (`$$...$$`, `\[...\]`, `\(...\)`), and auto-scrolled `<table>` wrappers.
- See [references/components.md](references/components.md) for component markup examples.

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
- `--local` / `-o <path>`: write locally (`/tmp/remote-view-<id>*`) without SSH
- `--host <user@host>` / `--url <base-url>`: override configured SSH target or public URL
- `--list`, `--rm <id>`, `--prune <days>`, `--check`: inspect, remove, or diagnose drops on the server

Published URLs are served over HTTP/HTTPS, so they can be opened directly from remote devices (such as a phone) or inspected with browser tools.
