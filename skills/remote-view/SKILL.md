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
<header class="stack">
  <h1>Concise Page Title</h1>
  <p class="muted">One-sentence summary without dense code-chip clutter.</p>
</header>

<section class="stack">
  <h2>Key Comparison</h2>
  <p>Short intro sentence pairing the heading with its content below.</p>
</section>
REMOTE_VIEW_EOF
```

- Pass only the inner body HTML (`<!DOCTYPE>`, `<html>`, `<head>`, and CDN imports are already in `template/base.html`).
- Use a distinct quoted heredoc delimiter (e.g. `<<'REMOTE_VIEW_EOF'`) if your fragment contains `EOF` or `$`.

### Strict Styling Contract (Do Not Hallucinate CSS)

- **ONLY use plain semantic HTML and documented `rv.css` classes.** Do **NOT** invent undocumented classes (no Tailwind utilities like `flex`, `mt-4`, `p-4`, `text-gray-400`; no guessed names like `.hero`, `.subtitle`, `.container`, `.wrapper`, `.panel`, `.card-body`, `.text-muted`).
- **NEVER add `<style>` blocks or inline `style="..."` layout/color overrides** inside `drop-html` fragments. All colors, spacing, dark mode, and mobile rules come from `rv.css`. If you need custom CSS/JS or a bespoke layout, publish a standalone page with `drop-html --raw` or a build with `drop-dir`.

### Mobile-First Layout & Restraint Rules

Pages are frequently read on phones (`320px–390px` wide) as well as desktops:

- **Keep headings short and plain:** Keep `<h1>` and `<h2>` concise (≤ 6–8 words) and **do NOT put `<code>` chips inside `<h1>` or `<h2>`**. Put type signatures or file paths in the `<p class="muted">` subtitle or code snippet instead.
- **Structure with clean vertical rhythm:** Place elements directly inside `<main>` or group each section in `<section class="stack">` (or `<section>` / `<header>`). Pair each `<h2>` with at most one brief intro line before a list, table, diagram, or code block.
- **Keep prose and lists scannable:** Prefer short 1–3 line paragraphs and tight 1-line bullets. Avoid stuffing 3+ inline `<code>` chips into every sentence.
- **Keep code lines narrow (~55–65 chars):** Trim snippets to the 5–15 lines that show the core idea and wrap long expressions to ~55–65 characters so mobile readers don't scroll horizontally on every line.
- **HTML-escape `<`, `>`, `&` inside `<pre><code>`:** Escape them as `&lt;`, `&gt;`, `&amp;` (e.g., generics like `Promise&lt;T&gt;`, JSX/HTML, bash heredocs `&lt;&lt;'EOF'`) so the browser does not parse them as HTML tags.
- **Never cram wide content into `.grid-2` / `.grid-3`:** Do **NOT** place `<pre>` code blocks, `<table>`s, or wide Mermaid diagrams side-by-side inside `.grid-2` or `.grid-3`. Use full-width `<div class="tabs" data-tabs>` or stacked sections for comparing code/diagrams; reserve `.grid-2` / `.grid-3` / `.grid-4` strictly for short `.stat` tiles or compact `.card` summaries.
- **Keep tables and diagrams compact:** Limit tables to 2–4 columns with short cell phrases (not multi-sentence paragraphs or long call chains). Keep Mermaid nodes to 2–4 words (max 2 short lines), and avoid `<T>` inside Mermaid labels (use `Prop(T)` or `Prop[T]` because Mermaid parses `<T>` as HTML).
- **Avoid card & box pollution:** Components (`.card`, `.stat`, `<details>`, `.callout`) are optional. Plain headings, prose, lists, and tables read calmer than wrapping every point in a bordered box.

### Documented Local Stack & Class Allowlist

Only these classes exist in `assets/rv.css` (plus plain semantic HTML `h1..h4`, `p`, `ul`, `ol`, `blockquote`, `hr`, `table`, `<details>`, `<pre><code>`):

- **Layout & Text Utilities:** `.stack`, `.row`, `.cluster`, `.split`, `.grid-2`, `.grid-3`, `.grid-4`, `.gap-sm`, `.gap-md`, `.gap-lg`, `.muted`, `.faint`, `.mono`, `.text-sm`, `.text-xs`.
- **Navigation Sidebar + Mobile Drawer:** `<nav class="rv-sidebar" aria-label="Sections">` with `.rv-sidebar-title` and `a.active` (`aria-current="page"`). Turns into a topbar burger drawer below `960px`.
- **Optional Components:** `<article class="card">` (`.interactive`, direct `header`/`footer`), `<article class="stat">` (`.stat-label`, `.stat-value`, `.stat-note`), `<span class="badge [brand|info|success|warning|danger] [pill]">`, `<aside class="callout [info|success|warning|danger]">` (`.callout-icon`, `.callout-body`), `<div class="tabs" data-tabs>`, `<ol class="steps">`, `<div class="progress" data-value="65"><span></span></div>` or native `<progress value="65" max="100"></progress>`, `<button class="btn [primary|danger|ghost]">`, native `<details>` (open by default; add `data-closed` to start collapsed), and `.rv-menu[popover]` (`.rv-menu-list`).
- **Icons, Code, Charts, Diagrams, Math:** `<i data-icon="bolt"></i>` (55 Tabler outline icons bundled locally; other outline icon names resolve automatically), `<pre><code class="language-...">` (Highlight.js + language bar + Copy), `<div class="chart-box"><canvas id="c1"></canvas></div>` (`Chart`), `<pre class="mermaid">...</pre>` (Mermaid v12), `<table>` (auto-wrapped with readable column sizing, horizontal scroll cues, and a `Table / Cards` toggle), and KaTeX (`$$...$$`, `\[...\]`, `\(...\)`; single `$` stays safe).
- See [references/components.md](references/components.md) for exact markup examples.

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
- `--title <text>`: page `<title>` (auto-extracts the first `<h1>` when omitted, falling back to `Drop <id>`)
- `--theme auto|dark|light`: default color scheme for wrapped fragments (default: `auto` / system)
- `--local` / `-o <path>`: write HTML locally without SSH (local CSS/JS/fonts are inlined; external libraries—Highlight.js, Chart.js, Mermaid, KaTeX—load from jsDelivr when online)
- `--tunnel`: use the active Pi tunnel URL from `tunel-view-pi.ref` (available on `drop-html` and `drop-dir`)
- `--sync-assets`: force re-upload of `assets/rv.*` and `assets/fonts/*` to `/_assets/` on the Pi
- `--host <user@host>` / `--url <base-url>`: override configured SSH target or public URL
- `--list`, `--rm <id>`, `--prune <days>`, `--check`: inspect, remove, or diagnose drops on the server

Published URLs are served over HTTP/HTTPS, so they can be opened directly from remote devices (such as a phone) or inspected with browser tools. For off-LAN or mobile HTTPS access via an ephemeral 12-hour Cloudflare Quick Tunnel, use the `tunel-view` skill (`tunel-view up`).
