# remote-view Component Reference

Copy-paste patterns for fragments piped into `drop-html`.

## 1. Web Awesome 3 Components

### Cards & Grid Layout
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <wa-card>
    <div slot="header" class="flex items-center justify-between">
      <strong>Throughput</strong>
      <wa-badge variant="success">+24%</wa-badge>
    </div>
    <p class="m-0 text-sm rv-muted">14,200 req/s steady state.</p>
  </wa-card>
</div>
```

### Tabs (`panel` + `name`, no `slot="nav"`)
```html
<wa-tab-group>
  <wa-tab panel="overview">Overview</wa-tab>
  <wa-tab panel="details">Details</wa-tab>
  <wa-tab-panel name="overview" active>
    <p>Shown initially.</p>
  </wa-tab-panel>
  <wa-tab-panel name="details">
    <p>Second tab panel.</p>
  </wa-tab-panel>
</wa-tab-group>
```

### Callouts & Disclosures
```html
<wa-callout variant="warning">
  <wa-icon slot="icon" name="triangle-exclamation"></wa-icon>
  <strong>Watch out:</strong> Migration locks the users table for ~3s.
</wa-callout>

<wa-details summary="View raw SQL migration">
  <pre><code class="language-sql">ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member';</code></pre>
</wa-details>
```
Callout / badge variants: `brand`, `success`, `neutral`, `warning`, `danger`.

## 2. Mermaid Diagrams (v12)

Keep raw diagram text inside `<pre class="mermaid">`. Avoid HTML comments inside Mermaid blocks.

```html
<pre class="mermaid">
sequenceDiagram
  participant Client
  participant API
  participant DB
  Client->>API: POST /orders
  API->>DB: INSERT order
  DB-->>API: 201 Created
  API-->>Client: JSON receipt
</pre>
```

## 3. Chart.js (v4)

`Chart` is pre-loaded and pre-themed for light/dark mode. Give the canvas a sized wrapper for responsive mobile layout:

```html
<wa-card>
  <div slot="header"><strong>Latency Percentiles (ms)</strong></div>
  <div class="relative h-64">
    <canvas id="latencyChart"></canvas>
  </div>
</wa-card>

<script>
  new Chart(document.getElementById("latencyChart"), {
    type: "line",
    data: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00"],
      datasets: [
        { label: "p50", data: [12, 11, 18, 22, 16], borderColor: "#38bdf8", tension: 0.3 },
        { label: "p99", data: [48, 42, 79, 95, 64], borderColor: "#f472b6", tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
</script>
```

## 4. Tables & Code Blocks

- Use semantic `<table><thead>...</thead><tbody>...</tbody></table>`; the shell automatically wraps tables in an accessible scrollable container.
- Use `<pre><code class="language-python">...</code></pre>`; Highlight.js highlights it and injects a Copy button automatically.
- For KaTeX math, use `$$ ... $$`, `\[ ... \]`, or `\( ... \)` (never single `$`).
