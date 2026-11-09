/* Atelier · vanilla JavaScript (no frameworks)
   Handles: mobile nav, theme toggle, library filter/search/save state, form validation. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Safe localStorage helpers (can throw in private mode)
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
  };

  /* ---------------- Data ---------------- */
  const ITEMS = [
    { id: "empathy", cat: "strategy", title: "Empathy maps", text: "Uncover user pain points through Says, Thinks, Does and Feels. We do not guess; we research." },
    { id: "wireframe", cat: "strategy", title: "Low-fidelity wireframes", text: "Focus on hierarchy and flow. If it does not work in grayscale, color will not fix it." },
    { id: "hmw", cat: "strategy", title: "How Might We", text: "Frame discovery as an opportunity question so the team solves the right problem." },
    { id: "palette", cat: "design", title: "2025 warm palette", text: "Mocha Mousse for stability, Ethereal Blue for trust, Moonlit Grey for refinement." },
    { id: "type", cat: "design", title: "Typography pairing", text: "Geometric headlines with readable body text. Maximum two font families and three weights." },
    { id: "wcag", cat: "design", title: "WCAG contrast", text: "Verify text contrast, visible focus states and 44px touch targets before shipping." },
    { id: "semantic", cat: "build", title: "Semantic HTML5", text: "header, nav, main, article and footer give screen readers and AI a table of contents." },
    { id: "grid", cat: "build", title: "CSS Grid layouts", text: "Macro layouts: a strict two-dimensional floor plan for the whole page." },
    { id: "flex", cat: "build", title: "Flexbox components", text: "Micro components such as navigation bars, button groups and card rows." },
    { id: "mobile", cat: "build", title: "Mobile-first queries", text: "Start with a single column, then expand with min-width queries at 768px and 1024px." },
    { id: "clamp", cat: "build", title: "Fluid type with clamp()", text: "Let headings scale smoothly between a minimum and maximum size without breakpoints." },
    { id: "audit", cat: "build", title: "Performance audit", text: "Measure LCP and CLS, then fix layout shifts and slow images before launch." },
  ];
  const CAT_LABEL = { strategy: "Strategy", design: "Design", build: "Build" };

  /* ---------------- Mobile nav ---------------- */
  const navToggle = $("#nav-toggle");
  const nav = $("#site-nav");
  const desktopMQ = window.matchMedia("(min-width: 1024px)");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  navToggle.addEventListener("click", () => setNav(navToggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      setNav(false); navToggle.focus();
    }
  });
  desktopMQ.addEventListener("change", () => setNav(false));

  /* ---------------- Theme toggle ---------------- */
  const themeBtn = $("#theme-toggle");
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const dark = theme === "dark";
    themeBtn.setAttribute("aria-pressed", String(dark));
    $(".theme-toggle__icon", themeBtn).textContent = dark ? "☀" : "☾";
    $(".theme-toggle__label", themeBtn).textContent = dark ? "Light" : "Dark";
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#1f1a16" : "#f2f0ea";
  }
  applyTheme(store.get("atelier-theme", prefersDark.matches ? "dark" : "light"));
  themeBtn.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    store.set("atelier-theme", next);
  });

  /* ---------------- Library: state + render ---------------- */
  const state = {
    query: "",
    category: "all",
    savedOnly: false,
    saved: new Set(store.get("atelier-saved", [])),
  };

  const grid = $("#library-grid");
  const statusEl = $("#results-status");
  const savedCount = $("#saved-count");
  const form = $("#filter-form");

  function visibleItems() {
    const q = state.query.trim().toLowerCase();
    return ITEMS.filter((it) =>
      (state.category === "all" || it.cat === state.category) &&
      (!state.savedOnly || state.saved.has(it.id)) &&
      (!q || (it.title + " " + it.text + " " + it.cat).toLowerCase().includes(q))
    );
  }

  function render() {
    const list = visibleItems();
    grid.replaceChildren();

    if (!list.length) {
      const p = document.createElement("p");
      p.className = "empty";
      p.textContent = state.savedOnly && !state.saved.size
        ? "Nothing saved yet. Tap the heart on any card to keep it here."
        : "No results. Try a different search or category.";
      grid.append(p);
    }

    list.forEach((it) => {
      const saved = state.saved.has(it.id);
      const art = document.createElement("article");
      art.className = "item";
      art.innerHTML = `
        <div class="item__top">
          <span class="item__cat"></span>
          <button class="save" type="button" aria-pressed="${saved}" data-id="${it.id}">
            <span aria-hidden="true">${saved ? "♥" : "♡"}</span>
            <span class="visually-hidden"></span>
          </button>
        </div>
        <h3></h3>
        <p></p>`;
      // textContent keeps data out of innerHTML (no injection)
      $(".item__cat", art).textContent = CAT_LABEL[it.cat];
      $("h3", art).textContent = it.title;
      $("p", art).textContent = it.text;
      $(".visually-hidden", art).textContent = (saved ? "Remove " : "Save ") + it.title + (saved ? " from saved" : "");
      grid.append(art);
    });

    savedCount.textContent = state.saved.size;
    statusEl.textContent = `${list.length} ${list.length === 1 ? "item" : "items"} shown`;
  }

  // Event delegation for save buttons
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".save");
    if (!btn) return;
    const id = btn.dataset.id;
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    store.set("atelier-saved", [...state.saved]);
    render();
    // restore focus after re-render
    const again = $(`.save[data-id="${CSS.escape(id)}"]`, grid);
    if (again) again.focus();
  });

  form.addEventListener("submit", (e) => e.preventDefault());
  $("#search").addEventListener("input", (e) => { state.query = e.target.value; render(); });
  $$('input[name="category"]', form).forEach((r) =>
    r.addEventListener("change", () => { state.category = r.value; render(); })
  );
  $("#saved-only").addEventListener("change", (e) => { state.savedOnly = e.target.checked; render(); });

  render();

  /* ---------------- Contact form validation ---------------- */
  const contact = $("#contact-form");
  const formStatus = $("#form-status");

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please write at least 10 characters."),
  };

  function validateField(input) {
    const msg = rules[input.name](input.value);
    const wrap = input.closest(".field");
    const err = $(`#${input.id}-err`);
    wrap.dataset.invalid = msg ? "true" : "false";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg;
    err.hidden = !msg;
    return !msg;
  }

  $$("input, textarea", contact).forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validateField(el); });
  });

  contact.addEventListener("submit", (e) => {
    e.preventDefault();
    formStatus.className = "form-status";
    const fields = $$("input, textarea", contact);
    const results = fields.map(validateField);
    if (results.every(Boolean)) {
      formStatus.textContent = "Thanks! Your message passed validation (demo only, nothing was sent).";
      formStatus.classList.add("is-success");
      contact.reset();
    } else {
      formStatus.textContent = "Please fix the highlighted fields.";
      fields[results.indexOf(false)].focus();
    }
  });

  /* ---------------- Active nav link on scroll ---------------- */
  const links = $$(".site-nav a");
  if ("IntersectionObserver" in window) {
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = map.get(en.target.id);
        if (a && en.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          a.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  $("#year").textContent = new Date().getFullYear();
})();
