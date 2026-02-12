# Contact Form Setup Guide - EmailJS

## Fastest Solution for Static Sites ✅

This guide will help you set up EmailJS to make your contact forms work without a backend server.

---

## Step 1: Create EmailJS Account (Free)

1. Go to: https://www.emailjs.com/
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

---

## Step 2: Set Up Email Service

1. **Go to Email Services** in EmailJS dashboard
2. **Click "Add New Service"**
3. **Choose your email provider:**
   - Gmail (recommended - easiest)
   - Outlook
   - Custom SMTP
   - Others

4. **For Gmail:**
   - Click "Connect Account"
   - Sign in with your Gmail
   - Authorize EmailJS
   - Note your **Service ID** (e.g., `service_abc123`)

---

## Step 3: Create Email Template

1. **Go to Email Templates** in EmailJS dashboard
2. **Click "Create New Template"**
3. **Template Settings:**
   - Template Name: "Devasya Contact Form"
   - Subject: `New Contact Form Submission - {{from_name}}`
   - Content:
   ```
   New contact form submission from Devasya Industries website:
   
   Name: {{from_name}}
   Email: {{from_email}}
   Message: {{message}}
   
   ---
   This email was sent from the contact form on devasyaindustries.com
   ```

4. **Click "Save"**
5. **Note your Template ID** (e.g., `template_xyz789`)

---

## Step 4: Get Public Key

1. **Go to Account** → **General**
2. **Find "Public Key"** section
3. **Copy your Public Key** (e.g., `abcdefghijklmnop`)

---

## Step 5: Update Configuration

1. **Open:** `js/form-handler.js`
2. **Replace these values:**

```javascript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',      // ← Paste your Service ID
  templateId: 'YOUR_TEMPLATE_ID',    // ← Paste your Template ID
  publicKey: 'YOUR_PUBLIC_KEY'       // ← Paste your Public Key
};
```

**Example:**
```javascript
const EMAILJS_CONFIG = {
  serviceId: 'service_abc123',
  templateId: 'template_xyz789',
  publicKey: 'abcdefghijklmnop'
};
```

---

## Step 6: Test the Form

1. **Open:** http://localhost:8000/contact.html
2. **Fill out the form**
3. **Submit**
4. **Check your email inbox** - you should receive the form submission!

---

## Alternative: Formspree (Even Simpler)

If you prefer an even simpler solution:

### Formspree Setup:

1. Go to: https://formspree.io/
2. Sign up (free - 50 submissions/month)
3. Create a new form
4. Get your form endpoint (e.g., `https://formspree.io/f/YOUR_FORM_ID`)

### Update form-handler.js:

Replace EmailJS code with Formspree:

```javascript
// Simple Formspree handler
function handleContactFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      showSuccess();
      form.reset();
    } else {
      showError();
    }
  })
  .catch(error => {
    showError();
  });
}
```

---

## Which Solution to Choose?

### EmailJS (Recommended)
✅ More control over email formatting  
✅ Works with any email provider  
✅ Free tier: 100 emails/month  
✅ Professional email templates  

### Formspree
✅ Easiest setup (just add endpoint)  
✅ Free tier: 50 submissions/month  
✅ Built-in spam protection  
✅ Dashboard to view submissions  

---

## Current Implementation

The form handler is already set up and ready. You just need to:

1. **Set up EmailJS account** (5 minutes)
2. **Update the 3 values in `js/form-handler.js`**
3. **Test the form**

---

## Troubleshooting

### Form not submitting?
- Check browser console (F12) for errors
- Verify EmailJS credentials are correct
- Make sure EmailJS SDK loaded (check Network tab)

### Emails not received?
- Check spam folder
- Verify email service is connected in EmailJS
- Check EmailJS dashboard for logs

### Need more emails?
- EmailJS: Upgrade to paid plan ($15/month for 1,000 emails)
- Formspree: Upgrade to paid plan ($19/month for 1,000 submissions)

---

## Security Note

The public key is safe to expose in client-side code. EmailJS uses it for authentication but doesn't expose sensitive data.

---

**Status**: Ready to configure  
**Time to setup**: ~5 minutes  
**Cost**: Free (up to 100 emails/month)

