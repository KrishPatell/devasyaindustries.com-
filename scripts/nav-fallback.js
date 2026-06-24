(function () {
  function disableWebflowScrollAnimations() {
    try {
      if (window.Webflow && typeof window.Webflow.require === "function") {
        var ix2 = window.Webflow.require("ix2");
        if (ix2 && typeof ix2.destroy === "function") ix2.destroy();
      }
    } catch (error) {
      // Webflow's IX2 runtime is optional in this static export.
    }
  }

  function setupOneShotReveals() {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-w-id]")).filter(function (node) {
      if (node.closest(".codex-navbar, .preloader, .live-chat-wrapper---brix, .live-chat-bubbble---brix")) return false;
      return /opacity\s*:\s*0/.test(node.getAttribute("style") || "");
    });

    if (!items.length) return;

    var reveal = function (node) {
      node.classList.add("codex-revealed");
      node.style.opacity = "";
      node.style.transform = "";
    };

    items.forEach(function (node) {
      node.classList.add("codex-reveal-once");
      node.style.opacity = "";
      node.style.transform = "";
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach(reveal);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach(function (node) {
      observer.observe(node);
    });
  }

  function closeDropdown(drop) {
    var toggle = drop.querySelector(".w-dropdown-toggle");
    var list = drop.querySelector(".w-dropdown-list");
    drop.classList.remove("w--open");
    if (toggle) {
      toggle.classList.remove("w--open");
      toggle.setAttribute("aria-expanded", "false");
    }
    if (list) {
      list.classList.remove("w--open");
      list.style.display = "";
    }
  }

  function openDropdown(drop) {
    var toggle = drop.querySelector(".w-dropdown-toggle");
    var list = drop.querySelector(".w-dropdown-list");
    drop.classList.add("w--open");
    if (toggle) {
      toggle.classList.add("w--open");
      toggle.setAttribute("aria-expanded", "true");
    }
    if (list) {
      list.classList.add("w--open");
      list.style.display = "block";
    }
  }

  function setupDropdown(drop) {
    var toggle = drop.querySelector(".w-dropdown-toggle");
    var list = drop.querySelector(".w-dropdown-list");
    if (!toggle || !list || toggle.dataset.codexDropdownReady) return;

    toggle.dataset.codexDropdownReady = "true";
    toggle.setAttribute("tabindex", "0");
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var isOpen = list.classList.contains("w--open") || drop.classList.contains("w--open");
      document.querySelectorAll(".w-dropdown").forEach(function (other) {
        if (other !== drop) closeDropdown(other);
      });
      if (isOpen) closeDropdown(drop);
      else openDropdown(drop);
    });

    toggle.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle.click();
      } else if (event.key === "Escape") {
        closeDropdown(drop);
      }
    });
  }

  document.addEventListener("click", function (event) {
    document.querySelectorAll(".w-dropdown").forEach(function (drop) {
      if (!drop.contains(event.target)) closeDropdown(drop);
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    disableWebflowScrollAnimations();
    setupOneShotReveals();
    document.querySelectorAll(".w-dropdown").forEach(setupDropdown);
  });

  window.addEventListener("load", function () {
    disableWebflowScrollAnimations();
  });
})();
