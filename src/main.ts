import "./styles/tokens.css";
import "./styles/app.css";
import { analyze, excludeCategories } from "./analyze";
import { renderHighlights } from "./render";
import { allTells, type TellCategory } from "./data";
import { samples } from "./data/samples";
import { loadDisabledCategories, saveDisabledCategories, type KeyValueStorage } from "./storage";
import { buildSummary } from "./summary";
import { describeScore } from "./a11y";

const CATEGORY_LABELS: Record<TellCategory, string> = {
  "inflated-verb": "Inflated verb",
  hedge: "Hedge",
  "transition-crutch": "Transition crutch",
  "rule-of-three": "Rule of three",
  disclaimer: "Disclaimer",
  "vague-intensifier": "Vague intensifier",
};

const PLACEHOLDER = `Paste a paragraph here to see it marked up.

Try something like: "In today's fast-paced world, it's important to note that we must delve into this topic. Furthermore, this solution boasts a seamless, robust design that will elevate your workflow."`;

/** Falls back to an in-memory store if localStorage is unavailable (privacy mode, etc). */
function getStorage(): KeyValueStorage {
  try {
    const probeKey = "__tellsign_probe__";
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    const memory = new Map<string, string>();
    return {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => {
        memory.set(key, value);
      },
    };
  }
}

function buildLegend(disabled: ReadonlySet<TellCategory>): string {
  const categories = Array.from(new Set(allTells.map((t) => t.category)));
  return categories
    .map((category) => {
      const maxWeight = Math.max(...allTells.filter((t) => t.category === category).map((t) => t.weight));
      const swatchClass = maxWeight >= 3 ? "tell-strong" : maxWeight === 2 ? "tell-medium" : "tell";
      const checked = disabled.has(category) ? "" : "checked";
      return `<li class="legend-item">
        <label class="legend-toggle">
          <input type="checkbox" class="legend-checkbox" data-category="${category}" ${checked} />
          <span class="legend-swatch ${swatchClass}"></span>
          ${CATEGORY_LABELS[category]}
        </label>
      </li>`;
    })
    .join("");
}

function render(): void {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) return;

  const storage = getStorage();
  const disabled = loadDisabledCategories(storage);

  app.innerHTML = `
    <header class="header">
      <h1 class="wordmark">
        Tell<span class="mark">sign
          <svg viewBox="0 0 80 12" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 8 Q 40 2 78 8" />
          </svg>
        </span>
      </h1>
      <a class="header-link" href="./site/">What is this?</a>
    </header>
    <main class="layout">
      <section class="manuscript-card">
        <div class="manuscript-shell">
          <div class="manuscript-backdrop" id="backdrop" aria-hidden="true"></div>
          <textarea
            class="manuscript-input"
            id="input"
            aria-label="Manuscript text to check for AI writing tells"
            placeholder="${PLACEHOLDER.replace(/"/g, "&quot;")}"
            spellcheck="false"
          ></textarea>
        </div>
      </section>
      <div class="tell-tooltip" id="tooltip" role="tooltip"></div>
      <aside class="sidebar">
        <div class="meter-card">
          <h2 class="meter-label">AI-osity</h2>
          <div
            class="meter-track"
            id="meter-track"
            role="progressbar"
            aria-label="AI-osity score"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow="0"
          >
            <div class="meter-fill" id="meter-fill"></div>
          </div>
          <div class="meter-readout" id="meter-readout">0</div>
          <div class="sr-only" id="meter-live" aria-live="polite" aria-atomic="true"></div>
        </div>
        <div class="meter-card">
          <h2 class="meter-label">Tell categories</h2>
          <ul class="legend" id="legend">${buildLegend(disabled)}</ul>
        </div>
        <div class="meter-card">
          <h2 class="meter-label">Try an example</h2>
          <div class="sample-buttons" id="samples">
            ${samples
              .map((sample) => `<button type="button" class="sample-btn" data-sample="${sample.id}">${sample.label}</button>`)
              .join("")}
          </div>
        </div>
        <div class="meter-card">
          <h2 class="meter-label">Share</h2>
          <button type="button" class="copy-btn" id="copy-summary" aria-live="polite">Copy summary</button>
        </div>
      </aside>
    </main>
  `;

  const input = app.querySelector<HTMLTextAreaElement>("#input")!;
  const backdrop = app.querySelector<HTMLDivElement>("#backdrop")!;
  const meterTrack = app.querySelector<HTMLDivElement>("#meter-track")!;
  const meterFill = app.querySelector<HTMLDivElement>("#meter-fill")!;
  const meterReadout = app.querySelector<HTMLDivElement>("#meter-readout")!;
  const meterLive = app.querySelector<HTMLDivElement>("#meter-live")!;
  const legend = app.querySelector<HTMLUListElement>("#legend")!;
  const sampleButtons = app.querySelector<HTMLDivElement>("#samples")!;
  const copyButton = app.querySelector<HTMLButtonElement>("#copy-summary")!;
  const tooltip = app.querySelector<HTMLDivElement>("#tooltip")!;

  let debounceHandle: ReturnType<typeof setTimeout> | undefined;
  let copyResetHandle: ReturnType<typeof setTimeout> | undefined;
  let lastResult = analyze("", []);

  function update(): void {
    const activeTells = excludeCategories(allTells, disabled);
    lastResult = analyze(input.value, activeTells);
    backdrop.innerHTML = renderHighlights(input.value, lastResult.matches);
    meterFill.style.width = `${lastResult.score}%`;
    meterReadout.textContent = String(lastResult.score);
    meterTrack.setAttribute("aria-valuenow", String(lastResult.score));
    meterLive.textContent = describeScore(lastResult);
  }

  function showTooltip(mark: HTMLElement): void {
    const category = mark.dataset.category as TellCategory | undefined;
    const explanation = mark.dataset.explanation;
    if (!category || !explanation) return;

    const title = document.createElement("strong");
    title.textContent = CATEGORY_LABELS[category] ?? category;
    tooltip.replaceChildren(title, document.createElement("br"), document.createTextNode(explanation));

    tooltip.classList.add("tell-tooltip-visible");
    const markRect = mark.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const left = Math.max(8, Math.min(markRect.left, window.innerWidth - tooltipRect.width - 8));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(8, markRect.top - tooltipRect.height - 8)}px`;
  }

  function hideTooltip(): void {
    tooltip.classList.remove("tell-tooltip-visible");
  }

  async function copySummary(): Promise<void> {
    const text = buildSummary(lastResult, CATEGORY_LABELS);
    clearTimeout(copyResetHandle);
    try {
      await navigator.clipboard.writeText(text);
      copyButton.textContent = "Copied!";
      copyButton.classList.add("copy-btn-success");
    } catch {
      copyButton.textContent = "Copy failed";
      copyButton.classList.add("copy-btn-error");
    }
    copyResetHandle = setTimeout(() => {
      copyButton.textContent = "Copy summary";
      copyButton.classList.remove("copy-btn-success", "copy-btn-error");
    }, 1500);
  }

  input.addEventListener("input", () => {
    clearTimeout(debounceHandle);
    debounceHandle = setTimeout(update, 120);
  });

  legend.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement) || !checkbox.dataset.category) return;
    const category = checkbox.dataset.category as TellCategory;
    if (checkbox.checked) {
      disabled.delete(category);
    } else {
      disabled.add(category);
    }
    saveDisabledCategories(storage, disabled);
    update();
  });

  sampleButtons.addEventListener("click", (event) => {
    const button = event.target;
    if (!(button instanceof HTMLButtonElement) || !button.dataset.sample) return;
    const sample = samples.find((s) => s.id === button.dataset.sample);
    if (!sample) return;
    input.value = sample.text;
    input.focus();
    update();
  });

  copyButton.addEventListener("click", () => {
    void copySummary();
  });

  input.addEventListener("scroll", () => {
    // Sync by ratio, not raw pixels: the textarea's native scrollbar can
    // make its content box a few px narrower than the backdrop div's,
    // producing a slightly different scrollHeight that drifts out of
    // alignment near the bottom if copied 1:1.
    const maxInputScroll = input.scrollHeight - input.clientHeight;
    const maxBackdropScroll = backdrop.scrollHeight - backdrop.clientHeight;
    const ratio = maxInputScroll > 0 ? input.scrollTop / maxInputScroll : 0;
    backdrop.scrollTop = maxBackdropScroll > 0 ? ratio * maxBackdropScroll : 0;
    backdrop.scrollLeft = input.scrollLeft;
    hideTooltip();
  });

  backdrop.addEventListener("mouseover", (event) => {
    const mark = (event.target as HTMLElement).closest<HTMLElement>(".tell");
    if (mark) showTooltip(mark);
  });

  backdrop.addEventListener("mouseout", (event) => {
    if ((event.target as HTMLElement).closest(".tell")) hideTooltip();
  });

  backdrop.addEventListener(
    "touchstart",
    (event) => {
      const mark = (event.target as HTMLElement).closest<HTMLElement>(".tell");
      if (mark) showTooltip(mark);
    },
    { passive: true },
  );

  document.addEventListener(
    "touchstart",
    (event) => {
      if (!(event.target as HTMLElement).closest(".tell")) hideTooltip();
    },
    { passive: true },
  );

  update();

  requestAnimationFrame(() => {
    app.querySelector(".wordmark .mark svg path")?.classList.add("drawn");
  });
}

render();
