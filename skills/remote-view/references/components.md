# remote-view UI Component Reference

All styling comes from `assets/rv.css` and `assets/rv.js`—plain semantic HTML (`h1..h4`, `p`, `ul`, `ol`, `blockquote`, `table`, `<details>`, `<pre><code>`) works without extra classes. Use components selectively when they add clarity.

## 1. Sidebar + Mobile Burger Drawer

Adding `.rv-sidebar` automatically activates a sticky left sidebar on desktop (`>= 960px`) and reveals the topbar burger menu on mobile:

```html
<nav class="rv-sidebar" aria-label="Sections">
  <span class="rv-sidebar-title">Overview</span>
  <ul>
    <li><a href="#intro" class="active"><i data-icon="home"></i> Introduction</a></li>
    <li><a href="#flow"><i data-icon="git-branch"></i> Architecture</a></li>
    <li><a href="#metrics"><i data-icon="chart-bar"></i> Metrics</a></li>
  </ul>
</nav>
```

## 2. Badges, Callouts & Stats

```html
<div class="row">
  <span class="badge brand pill"><i data-icon="bolt"></i> Ready</span>
  <span class="badge success pill">Healthy</span>
  <span class="badge warning">Warning</span>
</div>

<aside class="callout info">
  <i class="callout-icon" data-icon="info-circle"></i>
  <div class="callout-body">
    <strong>Note:</strong> Short highlight without wrapping every paragraph in a card.
  </div>
</aside>

<div class="grid-3">
  <article class="stat">
    <div class="stat-label"><span>Memory</span><span class="badge success">RSS</span></div>
    <div class="stat-value">2.4 MB</div>
    <div class="stat-note">lighttpd on Raspberry Pi</div>
  </article>
</div>
```

Callout variants: `info`, `success`, `warning`, `danger`. Badge variants: `brand`/`info`, `success`, `warning`, `danger` (plus `pill`).

## 3. Cards & Grids (Use Sparingly)

```html
<div class="grid-2">
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

## 4. Tabs (`data-tabs`)

```html
<div class="tabs" data-tabs>
  <div role="tablist" aria-label="Views">
    <button type="button" role="tab" aria-selected="true" data-tab="diagram">Diagram</button>
    <button type="button" role="tab" data-tab="code">Code</button>
  </div>
  <section role="tabpanel" data-panel="diagram">
    <pre class="mermaid">
flowchart LR
  A[Client] --> B[Pi Server]
    </pre>
  </section>
  <section role="tabpanel" data-panel="code" hidden>
    <pre><code class="language-bash">drop-html --check</code></pre>
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
  <summary>Show raw output</summary>
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
