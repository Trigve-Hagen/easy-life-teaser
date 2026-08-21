// Phase 7 Step 161: toggle-button wiring. The actual flash-prevention read
// (localStorage -> prefers-color-scheme -> document.documentElement.dataset.theme)
// runs as an inline, non-deferred snippet in each page's <head>, before this
// file loads -- this script only wires the button, it never re-decides the
// initial theme.
(function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    btn.textContent = theme === "light" ? "\u{1F319}" : "\u{2600}\u{FE0F}"; // moon : sun
    btn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
  }

  apply(document.documentElement.dataset.theme || "dark");

  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    apply(next);
  });
})();
