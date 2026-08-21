(function () {
  "use strict";

  var openBtn = document.getElementById("menu-burger");
  var closeBtn = document.getElementById("menu-close-burger");
  var sideMenu = document.getElementById("side-menu");
  var content = document.querySelector("main");

  if (!openBtn || !closeBtn || !sideMenu) return;

  function openMenu() {
    sideMenu.classList.add("open");
    if (content) content.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeMenu() {
    sideMenu.classList.remove("open");
    if (content) content.removeAttribute("aria-hidden");
    openBtn.setAttribute("aria-expanded", "false");
    openBtn.focus();
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(evt) {
    if (evt.key === "Escape") {
      closeMenu();
      return;
    }
    // Simple focus trap while the menu is open.
    if (evt.key === "Tab") {
      var focusable = sideMenu.querySelectorAll("a[href], button");
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (evt.shiftKey && document.activeElement === first) {
        evt.preventDefault();
        last.focus();
      } else if (!evt.shiftKey && document.activeElement === last) {
        evt.preventDefault();
        first.focus();
      }
    }
  }

  openBtn.addEventListener("click", function (evt) {
    evt.preventDefault();
    openMenu();
  });

  closeBtn.addEventListener("click", function (evt) {
    evt.preventDefault();
    closeMenu();
  });

  // Collapsible "Docs" (or any future) submenu group.
  document.querySelectorAll(".submenu-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      var submenu = document.getElementById(btn.getAttribute("aria-controls"));
      if (submenu) submenu.classList.toggle("open", !expanded);
    });
  });

  // Auto-expand the Docs submenu if the current page is one of its children
  // (e.g. arriving at /phase-docs.html#phase-3 directly, menu closed).
  document.querySelectorAll(".submenu a").forEach(function (a) {
    if (a.classList.contains("active")) {
      var submenu = a.closest(".submenu");
      var toggle = submenu && submenu.previousElementSibling;
      if (submenu) submenu.classList.add("open");
      if (toggle && toggle.classList.contains("submenu-toggle")) {
        toggle.setAttribute("aria-expanded", "true");
      }
    }
  });
})();
