(function () {
  var form = document.querySelector("[data-contact-enquiry-form]");
  if (!form) return;

  var wrapper = form.closest(".w-form");
  var success = wrapper && wrapper.querySelector(".w-form-done");
  var error = wrapper && wrapper.querySelector(".w-form-fail");
  var submit = form.querySelector('[type="submit"]');
  var defaultSubmitText = submit ? submit.value : "";
  var isSubmitting = false;
  var hasSubmittedSuccessfully = false;

  function show(node, visible) {
    if (node) node.style.display = visible ? "block" : "none";
  }

  function unlockSubmit() {
    if (!submit || isSubmitting) return;
    // Only mutate attributes that actually need changing. The MutationObserver
    // below watches this button's class/disabled/value; setting `.value` on a
    // submit input rewrites the `value` attribute, so unconditionally assigning
    // here would re-trigger the observer and spin in an infinite loop (freezing
    // the page). Guarding each write makes this a no-op once the button is clean.
    if (submit.disabled) submit.disabled = false;
    if (submit.classList.contains("w-form-loading")) submit.classList.remove("w-form-loading");
    if (submit.value !== defaultSubmitText) submit.value = defaultSubmitText;
  }

  function resetMessages() {
    if (!hasSubmittedSuccessfully) show(success, false);
    show(error, false);
  }

  show(success, false);
  show(error, false);
  if (submit) {
    unlockSubmit();
    new MutationObserver(unlockSubmit).observe(submit, {
      attributes: true,
      attributeFilter: ["class", "disabled", "value"]
    });
  }
  window.addEventListener("load", unlockSubmit);
  window.setTimeout(unlockSubmit, 0);
  window.setTimeout(unlockSubmit, 500);
  window.setTimeout(unlockSubmit, 1500);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    hasSubmittedSuccessfully = false;
    resetMessages();

    if (!form.checkValidity()) {
      unlockSubmit();
      form.reportValidity();
      return;
    }

    isSubmitting = true;
    if (submit) {
      submit.disabled = true;
      submit.classList.add("w-form-loading");
      submit.value = submit.getAttribute("data-wait") || "Sending...";
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("Form submission failed");
      form.reset();
      form.style.display = "none";
      hasSubmittedSuccessfully = true;
      show(success, true);
    }).catch(function () {
      var message = error && error.querySelector("div");
      if (message) {
        message.textContent = "Sorry, the message could not be sent. Please email Devasyaindustriesabd@gmail.com directly.";
      }
      show(error, true);
    }).finally(function () {
      isSubmitting = false;
      unlockSubmit();
    });
  }, true);
})();
