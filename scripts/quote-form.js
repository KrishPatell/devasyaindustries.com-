(function () {
  var modal = document.querySelector("[data-quote-modal]");
  if (!modal) return;

  var dialog = modal.querySelector("[data-quote-dialog]");
  var form = modal.querySelector("[data-quote-form]");
  var success = modal.querySelector("[data-quote-success]");
  var error = modal.querySelector("[data-quote-error]");
  var submit = form && form.querySelector('[type="submit"]');
  var defaultSubmitText = submit ? submit.textContent : "";
  var lastFocused = null;
  var isSubmitting = false;

  function show(node, visible) {
    if (node) node.hidden = !visible;
  }

  function focusableItems() {
    return Array.prototype.slice
      .call(dialog.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ))
      .filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      });
  }

  function resetView() {
    show(success, false);
    show(error, false);
    show(form, true);
  }

  function openModal(trigger) {
    lastFocused = trigger || document.activeElement;
    resetView();
    modal.hidden = false;
    document.documentElement.classList.add("codex-quote-open");
    // Defer so the reveal transition can run from the hidden state.
    window.requestAnimationFrame(function () {
      modal.classList.add("is-open");
      var focusables = focusableItems();
      if (focusables.length) focusables[0].focus();
    });
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.classList.remove("is-open");
    document.documentElement.classList.remove("codex-quote-open");
    var finish = function () {
      modal.hidden = true;
      modal.removeEventListener("transitionend", onEnd);
    };
    var onEnd = function (event) {
      if (event.target === modal) finish();
    };
    modal.addEventListener("transitionend", onEnd);
    // Fallback in case transitionend does not fire (reduced motion, display none).
    window.setTimeout(finish, 320);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;
    var focusables = focusableItems();
    if (!focusables.length) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest("[data-quote-open]");
    if (opener) {
      event.preventDefault();
      openModal(opener);
      return;
    }
    if (event.target.closest("[data-quote-close]")) {
      event.preventDefault();
      closeModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    } else {
      trapFocus(event);
    }
  });

  if (!form) return;

  // Block anything that isn't a phone character (digits, +, -, spaces, parens)
  // as the user types, so alphabets can't be entered on mobile or desktop.
  var phone = form.querySelector('input[name="phone"]');
  if (phone) {
    phone.addEventListener("input", function () {
      var cleaned = phone.value.replace(/[^0-9+\-\s()]/g, "");
      if (cleaned !== phone.value) {
        var pos = phone.selectionStart ? phone.selectionStart - 1 : phone.value.length;
        phone.value = cleaned;
        try {
          phone.setSelectionRange(pos, pos);
        } catch (e) {
          // Some input types disallow setSelectionRange; ignore.
        }
      }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (isSubmitting) return;

    show(error, false);

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    isSubmitting = true;
    if (submit) {
      submit.disabled = true;
      submit.textContent = submit.getAttribute("data-wait") || "Sending...";
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        return response.json().catch(function () {
          return { success: response.ok };
        });
      })
      .then(function (data) {
        if (!data || !data.success) throw new Error("Quote submission failed");
        form.reset();
        show(form, false);
        show(success, true);
        var heading = success && success.querySelector("[data-quote-focus]");
        if (heading) heading.focus();
      })
      .catch(function () {
        show(error, true);
      })
      .finally(function () {
        isSubmitting = false;
        if (submit) {
          submit.disabled = false;
          submit.textContent = defaultSubmitText;
        }
      });
  });
})();
