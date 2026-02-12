# Email Configuration

## Recipient Email Addresses

All contact form submissions and newsletter subscriptions will be sent to:

1. **sales@devasyaengineers.com** (Primary)
2. **Devasyaindustriesabd@gmail.com** (CC)

---

## Formspree Setup

When setting up Formspree, you have two options:

### Option 1: Configure in Formspree Dashboard (Recommended)

1. Go to your Formspree form settings
2. In **"Email Notifications"** section:
   - **To:** `sales@devasyaengineers.com`
   - **CC:** `Devasyaindustriesabd@gmail.com`
3. Save settings

The form handler will automatically send to both addresses.

### Option 2: Use _cc Parameter (Already Configured)

The form handler already includes `_cc` parameter with both email addresses. Formspree will send copies to both recipients.

---

## EmailJS Setup

If using EmailJS:

1. In your EmailJS template, configure:
   - **To:** `sales@devasyaengineers.com`
   - **CC:** `Devasyaindustriesabd@gmail.com`

2. The template parameters include:
   ```javascript
   to_email: 'sales@devasyaengineers.com'
   cc_email: 'sales@devasyaengineers.com,Devasyaindustriesabd@gmail.com'
   ```

---

## Current Configuration

```javascript
const RECIPIENT_EMAILS = [
  'sales@devasyaengineers.com',
  'Devasyaindustriesabd@gmail.com'
];
```

Both email addresses will receive:
- ✅ Contact form submissions
- ✅ Newsletter subscriptions

---

## Testing

After setting up Formspree/EmailJS:

1. Submit the contact form
2. Check both email inboxes:
   - sales@devasyaengineers.com
   - Devasyaindustriesabd@gmail.com
3. Both should receive the form submission

---

## Need to Change Recipients?

Edit `js/form-handler.js` and update the `RECIPIENT_EMAILS` array:

```javascript
const RECIPIENT_EMAILS = [
  'your-email@example.com',
  'another-email@example.com'
];
```

