(function () {
  "use strict";
  var openBtn = document.getElementById("menu-burger");
  var closeBtn = document.getElementById("menu-close-burger");
  var sideMenu = document.getElementById("side-menu");
  if (!openBtn || !sideMenu) return;

  // style.css's .sidenav starts `visibility: hidden` by design (Step 380 --
  // an anti-flash-of-unstyled-content measure: the raw <a> markup has no
  // icon/label wrapping until JS finishes with it). The real product's
  // sidenav.js only reveals it after an async /api/ui-mode fetch resolves
  // (its own revealMenu()). This export makes no fetch calls at all and
  // never filters the nav by tier, so there is nothing to wait for --
  // reveal immediately, synchronously, or the whole rail stays permanently
  // invisible on every single page (found only by a real headless-browser
  // click test; every static check and every getBoundingClientRect() call
  // looked completely correct, since `visibility: hidden` still reports
  // real layout geometry -- only actual hit-testing/paint exposed it).
  sideMenu.style.visibility = "visible";

  function syncHeaderHeight() {
    // The real product has nothing above .site-header, so its own
    // offsetHeight alone is the right --header-height there. This export
    // adds .teaser-banner (the "you're viewing a preview" strip) above
    // it, which pushes .site-header down in normal flow but was never
    // accounted for here -- .sidenav's `top: var(--header-height)` (a
    // fixed-position element) then started too high, overlapping the
    // banner instead of sitting flush under it. Sum both real elements'
    // heights instead of just the header's.
    var header = document.querySelector(".site-header");
    var banner = document.querySelector(".teaser-banner");
    if (!header) return;
    var total = header.offsetHeight + (banner ? banner.offsetHeight : 0);
    document.documentElement.style.setProperty("--header-height", total + "px");
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);

  function currentMode() { return sideMenu.classList.contains("expanded") ? "expanded" : "collapsed"; }
  function applyMode(mode) {
    var expanded = mode === "expanded";
    sideMenu.classList.toggle("expanded", expanded);
    document.body.classList.toggle("sidenav-expanded", expanded);
    openBtn.setAttribute("aria-expanded", String(expanded));
  }
  function setMode(mode) {
    applyMode(mode);
    try { localStorage.setItem("sidenav-mode", mode); } catch (err) { /* ignore */ }
  }
  var saved = null;
  try { saved = localStorage.getItem("sidenav-mode"); } catch (err) { /* ignore */ }
  applyMode(saved === "expanded" ? "expanded" : "collapsed");

  openBtn.addEventListener("click", function (evt) {
    evt.preventDefault();
    setMode(currentMode() === "expanded" ? "collapsed" : "expanded");
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", function (evt) {
      evt.preventDefault();
      setMode("collapsed");
    });
  }
  document.addEventListener("keydown", function (evt) {
    if (evt.key === "Escape" && currentMode() === "expanded") setMode("collapsed");
  });

  document.querySelectorAll(".submenu-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (currentMode() !== "expanded") setMode("expanded");
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      var submenu = document.getElementById(btn.getAttribute("aria-controls"));
      if (submenu) submenu.classList.toggle("open", !expanded);
    });
  });
})();
