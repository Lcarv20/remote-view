# remote-view UI Component Reference

All styling comes from `assets/rv.css` and `assets/rv.js`—plain semantic HTML (`h1..h4`, `p`, `ul`, `ol`, `blockquote`, `hr`, `table`, `<details>`, `<pre><code>`) works without extra classes.

## Guardrails & Complete Class Allowlist

- **Do NOT invent classes** (no `flex`, `mt-4`, `text-muted`, `.hero`, `.subtitle`, `.container`, `.panel`, `.card-body`).
- **Do NOT add `<style>` tags or inline `style="..."` attributes** in `drop-html` fragments (use `drop-html --raw` or `drop-dir` for custom apps).
- **Do NOT put `<code>` chips inside `<h1>` or `<h2>`**, and **do NOT place `<pre>` code blocks or `<table>`s inside `.grid-2`/`.grid-3`/`.grid-4`**.

| Category | Exact Allowed Classes |
| :--- | :--- |
| Layout | `.stack`, `.row`, `.cluster`, `.split`, `.grid-2`, `.grid-3`, `.grid-4`, `.gap-sm`, `.gap-md`, `.gap-lg` |
| Text | `.muted`, `.faint`, `.mono`, `.text-sm`, `.text-xs` |
| Navigation | `.rv-sidebar`, `.rv-sidebar-title`, `.active` |
| Surfaces | `.card` (`.interactive`), `.stat` (`.stat-label`, `.stat-value`, `.stat-note`), `.callout` (`.info`, `.success`, `.warning`, `.danger`, `.callout-icon`, `.callout-body`) |
| Controls & Status | `.badge` (`.brand`, `.info`, `.success`, `.warning`, `.danger`, `.pill`), `.btn` (`.primary`, `.danger`, `.ghost`), `.tabs` (`[data-tabs]`), `.rv-menu` (`.rv-menu-list`), `.steps`, `.progress` |
| Media & Code | `.chart-box`, `pre.mermaid` |

## 1. Page Header, Sections & Sidebar

Keep headings short and plain; put code symbols in the `.muted` subtitle. Adding `.rv-sidebar` activates a sticky left sidebar on desktop (`>= 960px`) and reveals the topbar burger drawer on mobile:

```html
<nav class="rv-sidebar" aria-label="Sections">
  <span class="rv-sidebar-title">Overview</span>
  <ul>
    <li><a href="#intro" class="active"><i data-icon="home"></i> Introduction</a></li>
    <li><a href="#options"><i data-icon="code"></i> Options</a></li>
    <li><a href="#metrics"><i data-icon="chart-bar"></i> Metrics</a></li>
  </ul>
</nav>

<header id="intro" class="stack">
  <div class="row">
    <span class="badge brand pill"><i data-icon="bolt"></i> Step 1 of 4</span>
    <span class="badge pill">Mobile Ready</span>
  </div>
  <h1>Flat Node Tree Design</h1>
  <p class="muted">Replaces manual coordinates in <code>main.dart</code> with retained layout nodes.</p>
</header>

<section id="options" class="stack">
  <h2>Comparison Overview</h2>
  <p>Short lead sentence introducing the list, table, or code below.</p>
</section>
```

## 2. Badges, Callouts, Buttons & Progress

```html
<div class="row">
  <span class="badge brand pill"><i data-icon="bolt"></i> Ready</span>
  <span class="badge success pill">Healthy</span>
  <span class="badge warning">Warning</span>
</div>

<div class="row">
  <button type="button" class="btn primary">Deploy</button>
  <button type="button" class="btn">Secondary</button>
  <button type="button" class="btn danger">Reset</button>
  <button type="button" class="btn ghost">Cancel</button>
</div>

<div class="progress" aria-label="Completion"><span style="width: 65%"></span></div>

<aside class="callout info">
  <i class="callout-icon" data-icon="info-circle"></i>
  <div class="callout-body">
    <strong>Note:</strong> Short highlight without wrapping every paragraph in a card.
  </div>
</aside>
```

Callout variants: `info`, `success`, `warning`, `danger`. Badge variants: `brand`/`info`, `success`, `warning`, `danger` (plus `pill`). Note: `progress > span` width percentage is the one exception where a data value (`width: 65%`) may use `style` if needed, or omit `.progress` when prose suffices.

## 3. Stats & Cards in Grids (Short Summaries Only)

Reserve `.grid-2`, `.grid-3`, and `.grid-4` for `.stat` tiles or compact `.card` summaries—**never** place `<pre>` code blocks, `<table>`s, or wide Mermaid diagrams side-by-side inside `.grid-*`.

```html
<div class="grid-3">
  <article class="stat">
    <div class="stat-label"><span>Memory</span><span class="badge success">RSS</span></div>
    <div class="stat-value">2.4 MB</div>
    <div class="stat-note">lighttpd on Raspberry Pi</div>
  </article>
  <article class="card">
    <header>
      <span>Service Status</span>
      <span class="badge success">Online</span>
    </header>
    <p class="text-sm muted">Listening on port 80.</p>
    <footer>Updated every deploy</footer>
  </article>
</div>
```

## 4. Comparing Code & Diagrams with Tabs (`data-tabs`)

Prefer full-width `[data-tabs]` (or stacked sections) instead of `.grid-2` when showing multiple code examples, and keep lines within ~55–65 characters so mobile screens don't clip:

```html
<div class="tabs" data-tabs>
  <div role="tablist" aria-label="Syntax Options">
    <button type="button" role="tab" aria-selected="true" data-tab="opt-a">Option A</button>
    <button type="button" role="tab" aria-selected="false" data-tab="opt-b">Option B</button>
    <button type="button" role="tab" aria-selected="false" data-tab="flow">Diagram</button>
  </div>
  <section role="tabpanel" data-panel="opt-a">
    <pre><code class="language-dart">box([text('Save')])
  .p(Edges(x: 16, y: 8))
  .bg(() =&gt; isMobile.value
    ? Colors.green400
    : Colors.red500)</code></pre>
  </section>
  <section role="tabpanel" data-panel="opt-b" hidden>
    <pre><code class="language-dart">box([text('Save')])
  .p(Edges(x: 16, y: 8))
  .bg.fn(() =&gt; isMobile.value ? .green400 : .red500)</code></pre>
  </section>
  <section role="tabpanel" data-panel="flow" hidden>
    <pre class="mermaid">
flowchart LR
  A[Client] --> B[Pi Server]
    </pre>
  </section>
</div>
```

## 5. Popup Menu (`popover="auto"`)

```html
<div>
  <button type="button" class="btn" id="actions-btn" aria-haspopup="menu" aria-expanded="false"
    commandfor="actions-menu" command="toggle-popover">
    Actions <i data-icon="chevron-down"></i>
  </button>
  <div id="actions-menu" popover="auto" class="rv-menu">
    <div class="rv-menu-list" role="menu" aria-labelledby="actions-btn">
      <a href="#top" role="menuitem"><i data-icon="arrow-up-right"></i> Back to top</a>
      <hr>
      <button type="button" role="menuitem" onclick="window.print()"><i data-icon="download"></i> Print</button>
    </div>
  </div>
</div>
```

## 6. Steps, Disclosures, Charts & Math

```html
<ol class="steps">
  <li><strong>Build locally:</strong> Run <code>vite build --base=./</code>.</li>
  <li><strong>Publish:</strong> Push with <code>drop-dir dist/</code>.</li>
</ol>

<details>
  <summary>Show raw output (open by default; add data-closed to start collapsed)</summary>
  <pre><code class="language-json">{ "status": "ok" }</code></pre>
</details>

<div class="chart-box">
  <canvas id="myChart"></canvas>
</div>
<script>
  new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: { labels: ["A", "B"], datasets: [{ label: "Latency (ms)", data: [12, 4] }] },
    options: { responsive: true, maintainAspectRatio: false }
  });
</script>
```

KaTeX math renders `$$...$$`, `\[...\]`, and `\(...\)` while ignoring single `$` signs.

## 7. Smart Tables (Automatic)

Plain semantic `<table>` markup (`<thead>`, `<tbody>`, optional `<caption>` and `<tfoot>`) gets smart responsive behavior automatically with no extra classes: readable column minimum widths prevent mobile text cramping, overflowing tables gain horizontal scroll shadows and a reactive `Scroll →` hint plus a 1-tap `Table / Cards` view toggle, compact first columns stay sticky when room permits, and tall tables cap height with a sticky `<thead>`.
