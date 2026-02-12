/**
 * Contact Form Handler
 * Supports both EmailJS and Formspree
 * Fastest solution for static sites - no backend required
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION - Choose ONE method below
  // ============================================
  
  // OPTION 1: EmailJS (Recommended - more control)
  const USE_EMAILJS = false; // Set to true to use EmailJS
  const EMAILJS_CONFIG = {
    serviceId: 'YOUR_SERVICE_ID',      // Get from EmailJS dashboard
    templateId: 'YOUR_TEMPLATE_ID',    // Get from EmailJS dashboard
    publicKey: 'YOUR_PUBLIC_KEY'       // Get from EmailJS dashboard
  };

  // OPTION 2: Formspree (Easiest - just add form ID)
  const USE_FORMSPREE = true; // Set to true to use Formspree
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwpgdvbl'; // Formspree endpoint configured
  
  // Recipient email addresses (multiple recipients supported)
  const RECIPIENT_EMAILS = [
    'sales@devasyaengineers.com',
    'Devasyaindustriesabd@gmail.com'
  ];
  
  // Primary recipient (for EmailJS)
  const RECIPIENT_EMAIL = 'sales@devasyaengineers.com';

  // Initialize form handler based on selected method
  function initFormHandler() {
    if (USE_EMAILJS && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
      initEmailJS();
    } else if (USE_FORMSPREE && FORMSPREE_ENDPOINT !== 'YOUR_FORMSPREE_ENDPOINT') {
      attachFormHandlers();
    } else {
      console.warn('Form handler not configured. Please set up EmailJS or Formspree.');
      console.warn('See FORM_SETUP_GUIDE.md for instructions.');
      // Still attach handlers but show warning
      attachFormHandlers();
    }
  }

  // Initialize EmailJS SDK
  function initEmailJS() {
    // Load EmailJS SDK
    if (typeof emailjs === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = function() {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('EmailJS initialized');
        attachFormHandlers();
      };
      document.head.appendChild(script);
    } else {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      attachFormHandlers();
    }
  }

  // Attach handlers to all forms
  function attachFormHandlers() {
    // Hide all error messages by default
    const allErrorMessages = document.querySelectorAll('.error-message.w-form-fail, .w-form-fail');
    allErrorMessages.forEach(err => {
      err.style.display = 'none';
      err.classList.remove('show-error');
    });
    
    // Main contact form
    const contactForm = document.querySelector('#email-form.form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactFormSubmit);
      // Prevent Webflow's default form handling
      contactForm.setAttribute('novalidate', 'novalidate');
    }

    // Footer subscription form
    const footerForm = document.querySelector('#email-form.uui-footer01_form');
    if (footerForm) {
      footerForm.addEventListener('submit', handleFooterFormSubmit);
      // Prevent Webflow's default form handling
      footerForm.setAttribute('novalidate', 'novalidate');
    }
  }

  // Handle main contact form submission
  function handleContactFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent Webflow form validation
    
    const form = e.target;
    const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
    const successMessage = form.parentElement.querySelector('.utility-message.w-form-done, .w-form-done');
    const errorMessage = form.parentElement.querySelector('.error-message.w-form-fail, .w-form-fail');
    
    // Immediately hide any error messages
    if (errorMessage) {
      errorMessage.style.display = 'none';
      errorMessage.classList.remove('show-error');
    }
    
    // Get form values
    const firstName = form.querySelector('#name-4')?.value || '';
    const lastName = form.querySelector('#name-2')?.value || '';
    const email = form.querySelector('#name-3')?.value || '';
    const message = form.querySelector('#field-2')?.value || '';
    
    // Validation
    if (!email || !message) {
      showError(errorMessage, 'Please fill in all required fields.');
      return;
    }

    // Disable submit button
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.value = submitButton.getAttribute('data-wait') || 'Sending...';
    }

    // Hide previous messages
    hideMessages(successMessage, errorMessage);

    // Use Formspree if configured
    if (USE_FORMSPREE && FORMSPREE_ENDPOINT !== 'YOUR_FORMSPREE_ENDPOINT') {
      sendViaFormspree(form, submitButton, successMessage, errorMessage, {
        firstName,
        lastName,
        email,
        message
      });
    } 
    // Use EmailJS if configured
    else if (USE_EMAILJS && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
      sendViaEmailJS(submitButton, successMessage, errorMessage, {
        firstName,
        lastName,
        email,
        message
      });
    } else {
      // Fallback: Show configuration error
      showError(errorMessage, 'Form is not configured. Please contact the website administrator.');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.value = 'Submit';
      }
    }
  }

  // Send via Formspree (simpler)
  function sendViaFormspree(form, submitButton, successMessage, errorMessage, data) {
    const formData = new FormData();
    formData.append('name', `${data.firstName} ${data.lastName}`.trim() || 'Website Visitor');
    formData.append('email', data.email);
    formData.append('message', data.message);
    formData.append('_subject', 'New Contact Form Submission - Devasya Industries');
    formData.append('_replyto', data.email);
    // Add multiple recipients (Formspree supports comma-separated emails)
    formData.append('_cc', RECIPIENT_EMAILS.join(','));

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('Form submitted successfully via Formspree');
        showSuccess(successMessage, form);
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.value = 'Submit';
        }
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Formspree submission failed:', error);
      showError(errorMessage, 'Failed to send message. Please try again or contact us directly.');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.value = 'Submit';
      }
    });
  }

  // Send via EmailJS
  function sendViaEmailJS(submitButton, successMessage, errorMessage, data) {
    // EmailJS sends to primary recipient, but you can configure template to CC others
    const templateParams = {
      from_name: `${data.firstName} ${data.lastName}`.trim() || 'Website Visitor',
      from_email: data.email,
      message: data.message,
      to_email: RECIPIENT_EMAIL,
      cc_email: RECIPIENT_EMAILS.join(','), // CC other recipients
      subject: 'New Contact Form Submission from Devasya Industries Website'
    };

    emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    )
    .then(function(response) {
      console.log('Email sent successfully:', response.status, response.text);
      showSuccess(successMessage, document.querySelector('#email-form.form'));
      document.querySelector('#email-form.form').reset();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.value = 'Submit';
      }
    })
    .catch(function(error) {
      console.error('Email send failed:', error);
      showError(errorMessage, 'Failed to send message. Please try again or contact us directly.');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.value = 'Submit';
      }
    });
  }

  // Handle footer subscription form submission
  function handleFooterFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent Webflow form validation
    
    const form = e.target;
    const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
    const successMessage = form.parentElement.querySelector('.success-message.w-form-done');
    const errorMessage = form.parentElement.querySelector('.error-message-2.w-form-fail');
    
    // Immediately hide any error messages
    if (errorMessage) {
      errorMessage.style.display = 'none';
      errorMessage.classList.remove('show-error');
    }
    
    const email = form.querySelector('#email')?.value || '';
    
    // Validation
    if (!email) {
      showError(errorMessage, 'Please enter your email address.');
      return;
    }

    // Disable submit button
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.value = submitButton.getAttribute('data-wait') || 'Subscribing...';
    }

    // Hide previous messages
    hideMessages(successMessage, errorMessage);

    // Use Formspree if configured
    if (USE_FORMSPREE && FORMSPREE_ENDPOINT !== 'YOUR_FORMSPREE_ENDPOINT') {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('_subject', 'New Newsletter Subscription - Devasya Industries');
      formData.append('_replyto', email);
      // Add multiple recipients for newsletter subscriptions
      formData.append('_cc', RECIPIENT_EMAILS.join(','));

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          showSuccess(successMessage, form);
          form.reset();
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.value = 'Subscribe';
          }
        } else {
          throw new Error('Subscription failed');
        }
      })
      .catch(error => {
        showError(errorMessage, 'Failed to subscribe. Please try again.');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.value = 'Subscribe';
        }
      });
    } 
    // Use EmailJS if configured
    else if (USE_EMAILJS && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
      const templateParams = {
        from_email: email,
        to_email: RECIPIENT_EMAIL,
        cc_email: RECIPIENT_EMAILS.join(','), // CC other recipients
        subject: 'New Newsletter Subscription from Devasya Industries Website',
        message: `New newsletter subscription from: ${email}`
      };

      emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      )
      .then(function(response) {
        console.log('Subscription email sent:', response.status);
        showSuccess(successMessage, form);
        form.reset();
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.value = 'Subscribe';
        }
      })
      .catch(function(error) {
        console.error('Subscription email failed:', error);
        showError(errorMessage, 'Failed to subscribe. Please try again.');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.value = 'Subscribe';
        }
      });
    } else {
      showError(errorMessage, 'Form is not configured. Please contact the website administrator.');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.value = 'Subscribe';
      }
    }
  }

  // Show success message
  function showSuccess(successElement, form) {
    if (successElement) {
      // Hide form
      form.style.display = 'none';
      
      // Hide any error messages
      const errorMessages = form.parentElement.querySelectorAll('.error-message.w-form-fail, .w-form-fail');
      errorMessages.forEach(errorMsg => {
        errorMsg.style.display = 'none';
      });
      
      // Show success message
      successElement.style.display = 'block';
      
      // Scroll to success message
      successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Show error message
  function showError(errorElement, message) {
    if (errorElement) {
      errorElement.style.display = 'block';
      errorElement.classList.add('show-error');
      if (message && errorElement.querySelector('div')) {
        errorElement.querySelector('div').textContent = message;
      }
      
      // Scroll to error message
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Hide messages
  function hideMessages(successElement, errorElement) {
    if (successElement) successElement.style.display = 'none';
    if (errorElement) {
      errorElement.style.display = 'none';
      // Also hide any Webflow error messages
      const allErrors = document.querySelectorAll('.error-message.w-form-fail, .w-form-fail');
      allErrors.forEach(err => err.style.display = 'none');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormHandler);
  } else {
    initFormHandler();
  }

})();

