import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@12.3.0/dist/mermaid.esm.min.mjs";

const RV_ICONS = {"bolt":"<path d=\"M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11\" />","check":"<path d=\"M5 12l5 5l10 -10\" />","x":"<path d=\"M18 6l-12 12\" /> <path d=\"M6 6l12 12\" />","info-circle":"<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 9h.01\" /> <path d=\"M11 12h1v4h1\" />","alert-triangle":"<path d=\"M12 9v4\" /> <path d=\"M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0\" /> <path d=\"M12 16h.01\" />","alert-circle":"<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 8v4\" /> <path d=\"M12 16h.01\" />","copy":"<path d=\"M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666\" /> <path d=\"M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1\" />","sun":"<path d=\"M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0\" /> <path d=\"M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7\" />","moon":"<path d=\"M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008\" />","menu-2":"<path d=\"M4 6l16 0\" /> <path d=\"M4 12l16 0\" /> <path d=\"M4 18l16 0\" />","chevron-right":"<path d=\"M9 6l6 6l-6 6\" />","chevron-down":"<path d=\"M6 9l6 6l6 -6\" />","chevron-left":"<path d=\"M15 6l-6 6l6 6\" />","server":"<path d=\"M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-2\" /> <path d=\"M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2\" /> <path d=\"M7 8l0 .01\" /> <path d=\"M7 16l0 .01\" />","terminal-2":"<path d=\"M8 9l3 3l-3 3\" /> <path d=\"M13 15l3 0\" /> <path d=\"M3 6a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2l0 -12\" />","code":"<path d=\"M7 8l-4 4l4 4\" /> <path d=\"M17 8l4 4l-4 4\" /> <path d=\"M14 4l-4 16\" />","database":"<path d=\"M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0\" /> <path d=\"M4 6v6a8 3 0 0 0 16 0v-6\" /> <path d=\"M4 12v6a8 3 0 0 0 16 0v-6\" />","cloud":"<path d=\"M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878\" />","lock":"<path d=\"M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6\" /> <path d=\"M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0\" /> <path d=\"M8 11v-4a4 4 0 1 1 8 0v4\" />","rocket":"<path d=\"M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3\" /> <path d=\"M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3\" /> <path d=\"M14 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />","folder":"<path d=\"M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2\" />","file-code":"<path d=\"M14 3v4a1 1 0 0 0 1 1h4\" /> <path d=\"M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2\" /> <path d=\"M10 13l-1 2l1 2\" /> <path d=\"M14 13l1 2l-1 2\" />","chart-bar":"<path d=\"M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -6\" /> <path d=\"M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -10\" /> <path d=\"M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1l0 -14\" /> <path d=\"M4 20h14\" />","git-branch":"<path d=\"M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0\" /> <path d=\"M7 8l0 8\" /> <path d=\"M9 18h6a2 2 0 0 0 2 -2v-5\" /> <path d=\"M14 14l3 -3l3 3\" />","bug":"<path d=\"M9 9v-1a3 3 0 0 1 6 0v1\" /> <path d=\"M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3\" /> <path d=\"M3 13l4 0\" /> <path d=\"M17 13l4 0\" /> <path d=\"M12 20l0 -6\" /> <path d=\"M4 19l3.35 -2\" /> <path d=\"M20 19l-3.35 -2\" /> <path d=\"M4 7l3.75 2.4\" /> <path d=\"M20 7l-3.75 2.4\" />","flame":"<path d=\"M12 10.941c2.333 -3.308 .167 -7.823 -1 -8.941c0 3.395 -2.235 5.299 -3.667 6.706c-1.43 1.408 -2.333 3.294 -2.333 5.588c0 3.704 3.134 6.706 7 6.706c3.866 0 7 -3.002 7 -6.706c0 -1.712 -1.232 -4.403 -2.333 -5.588c-2.084 3.353 -3.257 3.353 -4.667 2.235\" />","sparkles":"<path d=\"M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6\" />","external-link":"<path d=\"M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6\" /> <path d=\"M11 13l9 -9\" /> <path d=\"M15 4h5v5\" />","refresh":"<path d=\"M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4\" /> <path d=\"M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4\" />","settings":"<path d=\"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065\" /> <path d=\"M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0\" />","search":"<path d=\"M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0\" /> <path d=\"M21 21l-6 -6\" />","trash":"<path d=\"M4 7l16 0\" /> <path d=\"M10 11l0 6\" /> <path d=\"M14 11l0 6\" /> <path d=\"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12\" /> <path d=\"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3\" />","plus":"<path d=\"M12 5l0 14\" /> <path d=\"M5 12l14 0\" />","arrow-right":"<path d=\"M5 12l14 0\" /> <path d=\"M13 18l6 -6\" /> <path d=\"M13 6l6 6\" />","arrow-up-right":"<path d=\"M17 7l-10 10\" /> <path d=\"M8 7l9 0l0 9\" />","cpu":"<path d=\"M5 6a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -12\" /> <path d=\"M9 9h6v6h-6l0 -6\" /> <path d=\"M3 10h2\" /> <path d=\"M3 14h2\" /> <path d=\"M10 3v2\" /> <path d=\"M14 3v2\" /> <path d=\"M21 10h-2\" /> <path d=\"M21 14h-2\" /> <path d=\"M14 21v-2\" /> <path d=\"M10 21v-2\" />","network":"<path d=\"M6 9a6 6 0 1 0 12 0a6 6 0 0 0 -12 0\" /> <path d=\"M12 3c1.333 .333 2 2.333 2 6s-.667 5.667 -2 6\" /> <path d=\"M12 3c-1.333 .333 -2 2.333 -2 6s.667 5.667 2 6\" /> <path d=\"M6 9h12\" /> <path d=\"M3 20h7\" /> <path d=\"M14 20h7\" /> <path d=\"M10 20a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\" /> <path d=\"M12 15v3\" />","shield-check":"<path d=\"M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06\" /> <path d=\"M15 19l2 2l4 -4\" />","clock":"<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M12 7v5l3 3\" />","tag":"<path d=\"M6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3\" />","link":"<path d=\"M9 15l6 -6\" /> <path d=\"M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464\" /> <path d=\"M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463\" />","home":"<path d=\"M5 12l-2 0l9 -9l9 9l-2 0\" /> <path d=\"M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7\" /> <path d=\"M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6\" />","eye":"<path d=\"M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0\" /> <path d=\"M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6\" />","download":"<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\" /> <path d=\"M7 11l5 5l5 -5\" /> <path d=\"M12 4l0 12\" />","upload":"<path d=\"M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2\" /> <path d=\"M7 9l5 -5l5 5\" /> <path d=\"M12 4l0 12\" />","layers-intersect":"<path d=\"M8 6a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -8\" /> <path d=\"M4 10a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -8\" />","list":"<path d=\"M9 6l11 0\" /> <path d=\"M9 12l11 0\" /> <path d=\"M9 18l11 0\" /> <path d=\"M5 6l0 .01\" /> <path d=\"M5 12l0 .01\" /> <path d=\"M5 18l0 .01\" />","layout-sidebar":"<path d=\"M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12\" /> <path d=\"M9 4l0 16\" />","dots-vertical":"<path d=\"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" />","device-mobile":"<path d=\"M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14\" /> <path d=\"M11 4h2\" /> <path d=\"M12 17v.01\" />","device-desktop":"<path d=\"M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10\" /> <path d=\"M7 20h10\" /> <path d=\"M9 16v4\" /> <path d=\"M15 16v4\" />","world":"<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0\" /> <path d=\"M3.6 9h16.8\" /> <path d=\"M3.6 15h16.8\" /> <path d=\"M11.5 3a17 17 0 0 0 0 18\" /> <path d=\"M12.5 3a17 17 0 0 1 0 18\" />","plug":"<path d=\"M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054\" /> <path d=\"M4 20l3.5 -3.5\" /> <path d=\"M15 4l-3.5 3.5\" /> <path d=\"M20 9l-3.5 3.5\" />","activity":"<path d=\"M3 12h4l3 8l4 -16l3 8h4\" />","gauge":"<path d=\"M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0\" /> <path d=\"M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0\" /> <path d=\"M13.41 10.59l2.59 -2.59\" /> <path d=\"M7 12a5 5 0 0 1 5 -5\" />"};

const SVG_NS = "http://www.w3.org/2000/svg";

function buildTablerSvg(innerMarkup) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.classList.add("rv-svg");
  svg.innerHTML = innerMarkup;
  return svg;
}

async function hydrateIcons(scope = document) {
  const nodes = scope.querySelectorAll("[data-icon]");
  for (const el of nodes) {
    const name = el.getAttribute("data-icon")?.trim();
    if (!name || el.dataset.iconHydrated === name) continue;
    el.dataset.iconHydrated = name;

    if (RV_ICONS[name]) {
      el.replaceChildren(buildTablerSvg(RV_ICONS[name]));
      continue;
    }

    // Fallback: try local /_assets/icons/<name>.svg then Tabler CDN
    for (const url of [
      `/_assets/icons/${encodeURIComponent(name)}.svg`,
      `https://cdn.jsdelivr.net/npm/@tabler/icons@3.52.0/icons/outline/${encodeURIComponent(name)}.svg`
    ]) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const fetchedSvg = doc.querySelector("svg");
        if (!fetchedSvg) continue;
        fetchedSvg.setAttribute("aria-hidden", "true");
        fetchedSvg.classList.add("rv-svg");
        fetchedSvg.removeAttribute("width");
        fetchedSvg.removeAttribute("height");
        el.replaceChildren(fetchedSvg);
        break;
      } catch {
        // ignore network errors offline
      }
    }
  }
}

/* --------------------------------------------------------------------------
   Theme Switching (System / Paper Light / Warm Dark) & Clipboard
   -------------------------------------------------------------------------- */

const root = document.documentElement;
const themeMeta = document.querySelector('meta[name="color-scheme"]');
const themeBtn = document.getElementById("rv-theme-btn");
const themeIcon = document.getElementById("rv-theme-icon");
const themeLabel = document.getElementById("rv-theme-label");
const themeMenu = document.getElementById("rv-theme-menu");
const systemLabel = document.getElementById("rv-system-label");
const copyUrlBtn = document.getElementById("rv-copy-url");
const copyUrlLabel = document.getElementById("rv-copy-url-label");
const osDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
  }
  return Promise.resolve(legacyCopy(text));
}

function legacyCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  ta.style.left = "-9999px";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus({ preventScroll: true });
  ta.select();
  ta.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

function resolveTheme(mode) {
  if (mode === "light" || mode === "dark") return mode;
  return osDarkQuery.matches ? "dark" : "light";
}

function updateThemeUI(mode, resolved) {
  const osResolved = osDarkQuery.matches ? "Dark" : "Light";
  if (systemLabel) systemLabel.textContent = `System (${osResolved})`;

  if (themeLabel) {
    themeLabel.textContent = mode === "auto" ? "System" : (mode === "light" ? "Light" : "Dark");
  }

  if (themeIcon) {
    const iconName = mode === "auto"
      ? "device-desktop"
      : (mode === "light" ? "sun" : "moon");
    themeIcon.dataset.iconHydrated = "";
    themeIcon.setAttribute("data-icon", iconName);
    hydrateIcons(themeBtn || themeIcon.parentElement);
  }

  if (themeMenu) {
    for (const item of themeMenu.querySelectorAll("[data-theme-choice]")) {
      item.setAttribute("aria-checked", item.dataset.themeChoice === mode ? "true" : "false");
    }
  }
}

async function renderMermaid(theme) {
  const nodes = Array.from(document.querySelectorAll("pre.mermaid, .mermaid"));
  if (!nodes.length) return;

  for (const el of nodes) {
    if (!el.dataset.mermaidSrc) {
      el.dataset.mermaidSrc = el.textContent.trim();
    } else {
      el.removeAttribute("data-processed");
      el.textContent = el.dataset.mermaidSrc;
    }
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: theme === "light" ? "default" : "dark",
    securityLevel: "loose"
  });
  await mermaid.run({ nodes });
}

async function applyThemeMode(mode, persist = false) {
  const normalized = (mode === "light" || mode === "dark") ? mode : "auto";
  const resolved = resolveTheme(normalized);

  if (themeMeta) {
    themeMeta.content = normalized === "auto" ? "light dark" : normalized;
  }
  root.dataset.themeMode = normalized;
  root.dataset.theme = resolved;

  if (persist) {
    try {
      if (normalized === "auto") localStorage.removeItem("rv-theme");
      else localStorage.setItem("rv-theme", normalized);
    } catch {}
  }

  updateThemeUI(normalized, resolved);
  window.rvSyncHighlightTheme?.(resolved);
  window.rvApplyChartTheme?.(resolved);
  await renderMermaid(resolved);
}

/* --------------------------------------------------------------------------
   Responsive Sidebar + Mobile Burger Drawer
   -------------------------------------------------------------------------- */

function initSidebarDrawer() {
  const sidebar = document.querySelector(".rv-sidebar");
  const menuBtn = document.getElementById("rv-menu-btn");
  const mainContent = document.getElementById("rv-main");
  if (!sidebar || !menuBtn) return;

  if (!sidebar.id) sidebar.id = "rv-sidebar";
  menuBtn.setAttribute("aria-controls", sidebar.id);
  menuBtn.setAttribute("aria-expanded", "false");

  // Add mobile drawer header with close button if missing
  let closeBtn = sidebar.querySelector(".rv-sidebar-close");
  if (!sidebar.querySelector(".rv-sidebar-head")) {
    const head = document.createElement("div");
    head.className = "rv-sidebar-head";
    const title = document.createElement("span");
    title.textContent = sidebar.getAttribute("aria-label") || "Navigation";
    closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "rv-icon-btn rv-sidebar-close";
    closeBtn.setAttribute("aria-label", "Close navigation");
    closeBtn.innerHTML = "<i data-icon=\"x\"></i>";
    head.append(title, closeBtn);
    sidebar.prepend(head);
    hydrateIcons(head);
  }

  const mq = window.matchMedia("(max-width: 959px)");
  const supportsPopover = Object.hasOwn(HTMLElement.prototype, "popover");

  function setInertSiblings(isInert) {
    if (!mainContent) return;
    for (const child of mainContent.children) {
      if (child !== sidebar) child.inert = isInert;
    }
  }

  function openDrawer() {
    if (!mq.matches) return;
    if (supportsPopover) sidebar.showPopover();
    else sidebar.classList.add(":popover-open");
    sidebar.setAttribute("aria-modal", "true");
    setInertSiblings(true);
    menuBtn.setAttribute("aria-expanded", "true");
    (closeBtn || sidebar.querySelector("a, button"))?.focus();
  }

  function closeDrawer() {
    if (!sidebar.hasAttribute("aria-modal")) return;
    if (supportsPopover) {
      try { sidebar.hidePopover(); } catch {}
    } else {
      sidebar.classList.remove(":popover-open");
    }
    sidebar.removeAttribute("aria-modal");
    setInertSiblings(false);
    menuBtn.setAttribute("aria-expanded", "false");
    if (mq.matches) menuBtn.focus();
  }

  function syncMode() {
    if (mq.matches) {
      sidebar.setAttribute("popover", "manual");
      sidebar.setAttribute("role", "dialog");
    } else {
      closeDrawer();
      sidebar.removeAttribute("popover");
      sidebar.removeAttribute("role");
      sidebar.removeAttribute("aria-modal");
      setInertSiblings(false);
    }
  }

  syncMode();
  mq.addEventListener("change", syncMode);

  menuBtn.addEventListener("click", () => {
    if (sidebar.hasAttribute("aria-modal")) closeDrawer();
    else openDrawer();
  });
  closeBtn?.addEventListener("click", closeDrawer);

  // Clicking backdrop (the fixed popover area outside or Escape) or clicking a nav link closes drawer
  sidebar.addEventListener("click", (e) => {
    if (mq.matches && e.target.closest("a[href]")) {
      closeDrawer();
    }
  });

  document.addEventListener("pointerdown", (e) => {
    if (!mq.matches || !sidebar.hasAttribute("aria-modal")) return;
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      closeDrawer();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.hasAttribute("aria-modal")) {
      e.preventDefault();
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   Tabs ([data-tabs])
   -------------------------------------------------------------------------- */

function initTabs() {
  for (const container of document.querySelectorAll("[data-tabs], .tabs")) {
    const tabs = Array.from(container.querySelectorAll("[role=\"tab\"]"));
    const panels = Array.from(container.querySelectorAll("[role=\"tabpanel\"]"));
    if (!tabs.length || !panels.length) continue;

    function selectTab(targetTab, moveFocus = false) {
      const targetKey = targetTab.dataset.tab;
      for (const tab of tabs) {
        const active = tab === targetTab;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.tabIndex = active ? 0 : -1;
      }
      for (const panel of panels) {
        const match = panel.dataset.panel === targetKey || panel.id === targetKey;
        panel.hidden = !match;
      }
      if (moveFocus) targetTab.focus();
      if (window.Chart?.instances) {
        for (const chart of Object.values(Chart.instances)) chart.resize();
      }
    }

    const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
    selectTab(initial, false);

    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => selectTab(tab, false));
      tab.addEventListener("keydown", (e) => {
        let nextIdx = -1;
        if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
        else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") nextIdx = 0;
        else if (e.key === "End") nextIdx = tabs.length - 1;
        if (nextIdx >= 0) {
          e.preventDefault();
          selectTab(tabs[nextIdx], true);
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   Popup Menus (popover="auto" + fallback for commandfor / anchor positioning)
   -------------------------------------------------------------------------- */

function initMenus() {
  const supportsCommand = "commandForElement" in HTMLButtonElement.prototype;
  const supportsAnchor = CSS.supports("position-area", "block-end");

  for (const trigger of document.querySelectorAll("[commandfor]")) {
    const menuId = trigger.getAttribute("commandfor");
    const menu = menuId ? document.getElementById(menuId) : null;
    if (!menu) continue;

    if (!supportsCommand && trigger.getAttribute("command") === "toggle-popover") {
      trigger.addEventListener("click", () => {
        if (menu.matches(":popover-open")) menu.hidePopover();
        else menu.showPopover({ source: trigger });
      });
    }

    menu.addEventListener("toggle", (e) => {
      const isOpen = e.newState === "open";
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (isOpen && !supportsAnchor) {
        const rect = trigger.getBoundingClientRect();
        menu.style.position = "fixed";
        menu.style.inset = "auto";
        menu.style.margin = "0";
        menu.style.top = `${Math.min(rect.bottom + 6, window.innerHeight - menu.offsetHeight - 8)}px`;
        menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8))}px`;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Code Blocks, Tables, KaTeX, Mermaid
   -------------------------------------------------------------------------- */

const hljsLangLoads = new Map();

function ensureHljsLanguage(lang) {
  if (!window.hljs || !lang || window.hljs.getLanguage(lang)) {
    return Promise.resolve(true);
  }
  if (!/^[a-z0-9_-]+$/i.test(lang)) return Promise.resolve(false);
  if (hljsLangLoads.has(lang)) return hljsLangLoads.get(lang);

  const p = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = `https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.12.0/languages/${encodeURIComponent(lang)}.min.js`;
    s.onload = () => resolve(Boolean(window.hljs?.getLanguage(lang)));
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
  hljsLangLoads.set(lang, p);
  return p;
}

async function initCodeBlocks() {
  const jobs = [];
  for (const codeEl of document.querySelectorAll("pre > code")) {
    const pre = codeEl.parentElement;
    if (!pre || pre.classList.contains("mermaid")) continue;

    if (!pre.hasAttribute("tabindex")) pre.setAttribute("tabindex", "0");
    if (!pre.hasAttribute("role")) pre.setAttribute("role", "region");
    if (!pre.hasAttribute("aria-label") && !pre.hasAttribute("aria-labelledby")) {
      pre.setAttribute("aria-label", "Code block");
    }

    const langMatch = Array.from(codeEl.classList).find((c) => c.startsWith("language-"));
    const langName = langMatch ? langMatch.replace(/^language-/, "") : "";

    if (!pre.parentElement?.classList.contains("rv-code-wrap")) {
      const wrap = document.createElement("div");
      wrap.className = "rv-code-wrap";
      pre.parentNode.insertBefore(wrap, pre);

      const bar = document.createElement("div");
      bar.className = "rv-code-bar";

      const langSpan = document.createElement("span");
      langSpan.className = "rv-code-lang";
      langSpan.textContent = langName || "code";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "rv-copy-code";
      copyBtn.textContent = "Copy";
      copyBtn.addEventListener("click", async () => {
        const ok = await copyText(codeEl.innerText);
        copyBtn.textContent = ok ? "Copied" : "Failed";
        setTimeout(() => { copyBtn.textContent = "Copy"; }, 1400);
      });

      bar.append(langSpan, copyBtn);
      wrap.append(bar, pre);
    }

    if (window.hljs && !codeEl.classList.contains("hljs")) {
      jobs.push(
        ensureHljsLanguage(langName).then(() => {
          window.hljs.highlightElement(codeEl);
        })
      );
    }
  }
  await Promise.all(jobs);
}

const RV_TABLE_ICONS = {
  table: '<path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14" /><path d="M3 10h18" /><path d="M10 3v18" />',
  cards: '<path d="M4 5a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4" /><path d="M4 15a1 1 0 0 1 1 -1h14a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-4" />'
};

const RV_NUMERIC_CELL_RE = /^[~≈<>≤≥+\-−]?[$€£¥]?[\d.,]+(?:\s*(?:%|ms|us|µs|ns|s|m|h|d|k|M|B|KB|MB|GB|TB|KiB|MiB|GiB|px|rem|em|vw|vh|rps|ops\/s|req\/s|x|×))?$/i;

function normalizeTableText(el) {
  return (el?.textContent || "").replace(/\s+/g, " ").trim();
}

function setDataAttrIfChanged(el, key, value) {
  if (el.dataset[key] !== value) {
    el.dataset[key] = value;
  }
}

/** Inspect table structure, header labels, and whether row cells map 1:1 to columns. */
function analyzeTableStructure(table) {
  const headRows = table.tHead ? Array.from(table.tHead.rows) : [];
  const bodyRows = Array.from(table.tBodies).flatMap((b) => Array.from(b.rows));
  const footRows = table.tFoot ? Array.from(table.tFoot.rows) : [];
  const allRows = [...headRows, ...bodyRows, ...footRows];

  let colCount = 0;
  for (const row of allRows) {
    let spanSum = 0;
    for (const cell of row.cells) spanSum += cell.colSpan || 1;
    if (spanSum > colCount) colCount = spanSum;
  }

  const lastHeadRow = headRows.length ? headRows[headRows.length - 1] : null;
  const headerIsFlat = Boolean(
    lastHeadRow &&
    lastHeadRow.cells.length === colCount &&
    Array.from(lastHeadRow.cells).every((c) => (c.colSpan || 1) === 1 && (c.rowSpan || 1) === 1)
  );
  const labels = headerIsFlat ? Array.from(lastHeadRow.cells).map(normalizeTableText) : [];

  const rowsMapFlat = [...bodyRows, ...footRows].every(
    (row) =>
      row.cells.length === colCount &&
      Array.from(row.cells).every((c) => (c.colSpan || 1) === 1 && (c.rowSpan || 1) === 1)
  );
  const hasComplexSpans = !rowsMapFlat || (Boolean(lastHeadRow) && !headerIsFlat);

  const firstFullBodyRow = bodyRows.find(
    (row) =>
      row.cells.length === colCount &&
      Array.from(row.cells).every((c) => (c.colSpan || 1) === 1 && (c.rowSpan || 1) === 1)
  ) || null;

  const sizingCells = headerIsFlat
    ? Array.from(lastHeadRow.cells)
    : (firstFullBodyRow ? Array.from(firstFullBodyRow.cells) : []);
  const firstColCell = sizingCells[0] || null;
  const isCardable = headerIsFlat && colCount >= 2 && labels.some(Boolean) && !hasComplexSpans;

  return {
    caption: table.querySelector("caption"),
    bodyRows,
    footRows,
    colCount,
    labels,
    sizingCells,
    firstColCell,
    hasComplexSpans,
    isCardable
  };
}

/** Estimate readable minimum column widths from cell content and inject card-view header labels. */
function applySmartColumnSizing(table, info) {
  const { colCount, labels, bodyRows, footRows, sizingCells, isCardable } = info;
  if (!colCount) return;

  const flatDataRows = bodyRows.filter(
    (row) =>
      row.cells.length === colCount &&
      Array.from(row.cells).every((c) => (c.colSpan || 1) === 1 && (c.rowSpan || 1) === 1)
  );

  if (sizingCells.length === colCount) {
    let totalRem = 0;

    for (let col = 0; col < colCount; col++) {
      const headerText = labels[col] || "";
      const headerLen = headerText.length;
      const headerLongestWord = headerText
        ? Math.max(...headerText.split(/\s+/).map((w) => w.length))
        : 0;

      const lengths = [];
      const proseLengths = [];
      let maxWordLen = 0;
      let maxTokenLen = 0;
      let numericCount = 0;

      for (const row of flatDataRows) {
        const text = normalizeTableText(row.cells[col]);
        if (!text) continue;
        lengths.push(text.length);
        let proseLen = 0;
        for (const token of text.split(/\s+/)) {
          if (token.length > maxTokenLen) maxTokenLen = token.length;
          // Cap normal-word floor so short English words never split mid-word while huge URLs still wrap.
          if (token.length <= 22 && token.length > maxWordLen) maxWordLen = token.length;
          proseLen += Math.min(token.length, 20) + 1;
        }
        proseLengths.push(Math.max(0, proseLen - 1));
        if (RV_NUMERIC_CELL_RE.test(text) || (text.length <= 10 && /\d/.test(text) && !/\s.*\s/.test(text))) {
          numericCount++;
        }
      }

      lengths.sort((a, b) => a - b);
      proseLengths.sort((a, b) => a - b);
      const nonEmptyCount = lengths.length;
      const p75Raw = nonEmptyCount ? lengths[Math.min(nonEmptyCount - 1, Math.floor(nonEmptyCount * 0.75))] : 0;
      const maxLenRaw = nonEmptyCount ? lengths[nonEmptyCount - 1] : 0;
      const p75Prose = nonEmptyCount ? proseLengths[Math.min(nonEmptyCount - 1, Math.floor(nonEmptyCount * 0.75))] : 0;
      const maxProse = nonEmptyCount ? proseLengths[nonEmptyCount - 1] : 0;
      const effLen = Math.max(p75Prose, Math.min(maxProse, p75Prose * 1.35 + 10));
      const isMostlyNumeric = nonEmptyCount > 0 && (numericCount / nonEmptyCount) >= 0.7 && maxLenRaw <= 18;

      const wordFloor = headerLongestWord * 0.56 + 1.85;
      const headerFloor = headerLen <= 22
        ? Math.max(wordFloor, Math.min(13.5, headerLen * 0.49 + 1.85))
        : Math.max(wordFloor, Math.min(14.5, headerLen * 0.28 + 2.1));

      const normalWordFloor = maxWordLen ? (maxWordLen * 0.52 + 1.85) : 0;
      const tokenFloor = maxTokenLen > 14 ? Math.min(15.5, maxTokenLen * 0.44 + 1.9) : 0;

      let proseFloor;
      if (isMostlyNumeric) {
        proseFloor = Math.max(4.75, Math.min(9.5, Math.max(p75Raw, maxLenRaw) * 0.52 + 1.9));
      } else if (effLen <= 14) {
        proseFloor = Math.max(5.5, effLen * 0.46 + 1.9);
      } else if (effLen <= 32) {
        proseFloor = 8.3 + (effLen - 14) * 0.23;
      } else if (effLen <= 70) {
        proseFloor = 12.4 + (effLen - 32) * 0.145;
      } else {
        proseFloor = Math.min(18.5, 17.0 + (effLen - 70) * 0.045);
      }

      const bodyFloor = Math.max(normalWordFloor, tokenFloor, proseFloor);
      const colMinRem = Math.max(4.75, Math.min(19.0, Math.max(headerFloor, bodyFloor)));
      totalRem += colMinRem;

      sizingCells[col].setAttribute("data-rv-col-min", "");
      sizingCells[col].style.setProperty("--rv-col-min", `${colMinRem.toFixed(2)}rem`);
    }

    table.style.setProperty("--rv-table-min", `${totalRem.toFixed(2)}rem`);
  }

  if (isCardable) {
    for (const row of [...bodyRows, ...footRows]) {
      for (let col = 0; col < colCount; col++) {
        const label = labels[col];
        if (!label) continue;
        const cell = row.cells[col];
        cell.setAttribute("data-rv-label", "");
        cell.style.setProperty("--rv-label", JSON.stringify(label));
      }
    }
  }
}

function createTableModeButton(mode, text, iconMarkup, pressed) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "rv-table-mode-btn";
  btn.dataset.tableViewMode = mode;
  btn.setAttribute("aria-pressed", pressed ? "true" : "false");
  btn.append(buildTablerSvg(iconMarkup), Object.assign(document.createElement("span"), { textContent: text }));
  return btn;
}

function buildTableShell(table, info, index) {
  const existingWrap = table.parentElement?.classList.contains("rv-table-wrap")
    ? table.parentElement
    : null;
  const wrap = existingWrap || document.createElement("div");
  if (!existingWrap) {
    wrap.className = "rv-table-wrap";
    table.parentNode.insertBefore(wrap, table);
  }
  wrap.setAttribute("data-rv-table", "");
  wrap.dataset.view = "table";

  const inheritedLabel = existingWrap?.getAttribute("aria-label") || "";
  const inheritedLabelledBy = existingWrap?.getAttribute("aria-labelledby") || "";
  if (existingWrap) {
    existingWrap.removeAttribute("tabindex");
    existingWrap.removeAttribute("role");
    existingWrap.removeAttribute("aria-label");
    existingWrap.removeAttribute("aria-labelledby");
  }

  const bar = document.createElement("div");
  bar.className = "rv-table-bar";

  const meta = document.createElement("div");
  meta.className = "rv-table-meta";

  const rowCount = info.bodyRows.length;
  const dims = document.createElement("span");
  dims.className = "rv-table-dims";
  dims.textContent = `${info.colCount} ${info.colCount === 1 ? "col" : "cols"} · ${rowCount} ${rowCount === 1 ? "row" : "rows"}`;

  const hintEl = document.createElement("span");
  hintEl.className = "rv-table-hint";
  hintEl.setAttribute("aria-hidden", "true");

  meta.append(dims, hintEl);
  bar.appendChild(meta);

  let tableBtn = null;
  let cardsBtn = null;
  if (info.isCardable) {
    const switchEl = document.createElement("div");
    switchEl.className = "rv-table-switch";
    switchEl.setAttribute("role", "group");
    switchEl.setAttribute("aria-label", "Table view mode");
    tableBtn = createTableModeButton("table", "Table", RV_TABLE_ICONS.table, true);
    cardsBtn = createTableModeButton("cards", "Cards", RV_TABLE_ICONS.cards, false);
    switchEl.append(tableBtn, cardsBtn);
    bar.appendChild(switchEl);
  }

  const viewport = document.createElement("div");
  viewport.className = "rv-table-viewport";

  const scrollEl = document.createElement("div");
  scrollEl.className = "rv-table-scroll";
  scrollEl.setAttribute("tabindex", "0");
  scrollEl.setAttribute("role", "region");

  if (info.caption && normalizeTableText(info.caption)) {
    if (!info.caption.id) info.caption.id = `rv-table-cap-${index}`;
    scrollEl.setAttribute("aria-labelledby", info.caption.id);
  } else if (inheritedLabelledBy) {
    scrollEl.setAttribute("aria-labelledby", inheritedLabelledBy);
  } else if (inheritedLabel) {
    scrollEl.setAttribute("aria-label", inheritedLabel);
  } else {
    const preview = info.labels.filter(Boolean).slice(0, 4).join(", ");
    scrollEl.setAttribute("aria-label", preview ? `Data table: ${preview}` : "Data table");
  }

  scrollEl.appendChild(table);
  viewport.appendChild(scrollEl);
  wrap.replaceChildren(bar, viewport);

  return { wrap, viewport, scrollEl, hintEl, tableBtn, cardsBtn };
}

function initTables() {
  const tableControllers = [];
  let tableIndex = 0;

  for (const table of document.querySelectorAll("#rv-main table")) {
    if (table.dataset.rvTableInit === "1") continue;
    if (table.closest(".table-wrapper, .mermaid, .katex")) continue;
    if (table.parentElement?.closest("table")) continue;

    table.dataset.rvTableInit = "1";
    tableIndex++;

    const info = analyzeTableStructure(table);
    applySmartColumnSizing(table, info);
    const refs = buildTableShell(table, info, tableIndex);
    const { wrap, viewport, scrollEl, hintEl, tableBtn, cardsBtn } = refs;

    const syncState = () => {
      if (scrollEl.clientWidth === 0) return;

      const isCards = wrap.dataset.view === "cards";
      const tallCap = Math.min(512, Math.round(window.innerHeight * 0.7));
      const isTall = !isCards && info.bodyRows.length >= 8 && table.offsetHeight > tallCap + 60;
      setDataAttrIfChanged(wrap, "rvTall", isTall ? "true" : "false");

      const maxScrollX = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
      const overflowX = !isCards && maxScrollX > 2;
      const isRtl = getComputedStyle(scrollEl).direction === "rtl";
      const posX = isRtl ? Math.abs(scrollEl.scrollLeft) : Math.max(0, scrollEl.scrollLeft);
      const canScrollStart = overflowX && posX > 2;
      const canScrollEnd = overflowX && posX < maxScrollX - 2;

      const maxScrollY = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
      const overflowY = !isCards && maxScrollY > 2;
      const canScrollTop = overflowY && scrollEl.scrollTop > 2;
      const canScrollBottom = overflowY && scrollEl.scrollTop < maxScrollY - 2;

      let stickyCol = false;
      let stickyColW = 0;
      if (!isCards && overflowX && info.colCount >= 3 && !info.hasComplexSpans && info.firstColCell) {
        const col1W = info.firstColCell.getBoundingClientRect().width;
        const vpW = scrollEl.clientWidth;
        if (col1W > 0 && col1W <= Math.min(180, vpW * 0.40) && (vpW - col1W) >= 190) {
          stickyCol = true;
          stickyColW = Math.round(col1W);
        }
      }

      setDataAttrIfChanged(wrap, "overflowX", overflowX ? "true" : "false");
      setDataAttrIfChanged(wrap, "scrollStart", canScrollStart ? "true" : "false");
      setDataAttrIfChanged(wrap, "scrollEnd", canScrollEnd ? "true" : "false");
      setDataAttrIfChanged(wrap, "scrollTop", canScrollTop ? "true" : "false");
      setDataAttrIfChanged(wrap, "scrollBottom", canScrollBottom ? "true" : "false");
      setDataAttrIfChanged(wrap, "stickyCol", stickyCol ? "true" : "false");
      viewport.style.setProperty("--rv-sticky-col-w", `${stickyColW}px`);

      let hintText = "";
      if (overflowX) {
        if (canScrollStart && canScrollEnd) hintText = "← Scroll →";
        else if (canScrollEnd) hintText = "Scroll →";
        else if (canScrollStart) hintText = "← Scroll";
      }
      if (hintEl.textContent !== hintText) hintEl.textContent = hintText;
    };

    let rafId = 0;
    const scheduleSync = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        syncState();
      });
    };

    if (tableBtn && cardsBtn) {
      const setViewMode = (mode) => {
        if (wrap.dataset.view === mode) return;
        wrap.dataset.view = mode;
        tableBtn.setAttribute("aria-pressed", mode === "table" ? "true" : "false");
        cardsBtn.setAttribute("aria-pressed", mode === "cards" ? "true" : "false");
        if (mode === "table") scrollEl.scrollLeft = 0;
        syncState();
      };
      tableBtn.addEventListener("click", () => setViewMode("table"));
      cardsBtn.addEventListener("click", () => setViewMode("cards"));
    }

    scrollEl.addEventListener("scroll", scheduleSync, { passive: true });
    tableControllers.push({ scrollEl, table, syncState, scheduleSync });
    syncState();
  }

  if (!tableControllers.length) return;

  if (typeof ResizeObserver !== "undefined") {
    const syncByNode = new Map();
    for (const ctrl of tableControllers) {
      syncByNode.set(ctrl.scrollEl, ctrl.scheduleSync);
      syncByNode.set(ctrl.table, ctrl.scheduleSync);
    }
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) syncByNode.get(entry.target)?.();
    });
    for (const node of syncByNode.keys()) ro.observe(node);
  }

  window.addEventListener("resize", () => {
    for (const ctrl of tableControllers) ctrl.scheduleSync();
  }, { passive: true });

  document.fonts?.ready?.then(() => {
    for (const ctrl of tableControllers) ctrl.scheduleSync();
  });
}

function initDetails() {
  for (const d of document.querySelectorAll("#rv-main details")) {
    if (d.hasAttribute("data-closed") || d.hasAttribute("name")) continue;
    d.open = true;
  }
}

function initMath() {
  if (!window.renderMathInElement) return;
  const target = document.getElementById("rv-main");
  if (!target) return;
  window.renderMathInElement(target, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false }
    ],
    throwOnError: false
  });
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

initDetails();
initTables();
initTabs();
initMenus();
initSidebarDrawer();
initMath();
await Promise.all([initCodeBlocks(), hydrateIcons(document), document.fonts?.ready]);

const initialMode = root.dataset.themeMode || "auto";
const initialResolved = resolveTheme(initialMode);
updateThemeUI(initialMode, initialResolved);
await renderMermaid(initialResolved);

if (themeMenu) {
  themeMenu.addEventListener("click", (e) => {
    const choice = e.target.closest("[data-theme-choice]")?.dataset.themeChoice;
    if (!choice) return;
    applyThemeMode(choice, true);
    try { themeMenu.hidePopover(); } catch {}
  });
}

osDarkQuery.addEventListener("change", () => {
  if ((root.dataset.themeMode || "auto") === "auto") {
    applyThemeMode("auto", false);
  } else {
    updateThemeUI(root.dataset.themeMode, resolveTheme(root.dataset.themeMode));
  }
});

window.addEventListener("storage", (e) => {
  if (e.key === "rv-theme") {
    applyThemeMode(e.newValue || "auto", false);
  }
});

let copyUrlResetTimer;
copyUrlBtn?.addEventListener("click", async () => {
  const ok = await copyText(window.location.href);
  const iconEl = copyUrlBtn.querySelector("[data-icon]");
  if (copyUrlLabel) {
    copyUrlLabel.textContent = ok ? "Copied" : "Copy failed";
  }
  copyUrlBtn.dataset.copied = ok ? "true" : "false";
  if (ok && iconEl) {
    iconEl.dataset.iconHydrated = "";
    iconEl.setAttribute("data-icon", "check");
    hydrateIcons(copyUrlBtn);
  }
  clearTimeout(copyUrlResetTimer);
  copyUrlResetTimer = setTimeout(() => {
    if (copyUrlLabel) copyUrlLabel.textContent = "Copy URL";
    delete copyUrlBtn.dataset.copied;
    if (iconEl) {
      iconEl.dataset.iconHydrated = "";
      iconEl.setAttribute("data-icon", "copy");
      hydrateIcons(copyUrlBtn);
    }
  }, 1400);
});
