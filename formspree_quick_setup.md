# Formspree Quick Setup (FASTEST - 2 Minutes) ⚡

## Why Formspree?
- ✅ **Fastest setup** - Just add one URL
- ✅ **No coding** - Works immediately
- ✅ **Free tier** - 50 submissions/month
- ✅ **Spam protection** - Built-in
- ✅ **Dashboard** - View all submissions

---

## Step 1: Sign Up (30 seconds)

1. Go to: **https://formspree.io/**
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with email or Google
4. Verify your email

---

## Step 2: Create Form (30 seconds)

1. After login, click **"New Form"**
2. Form Name: `Devasya Contact Form`
3. Click **"Create Form"**
4. **Copy your form endpoint** - it looks like:
   ```
   https://formspree.io/f/YOUR_FORM_ID
   ```

---

## Step 3: Update Code (30 seconds)

1. Open: `js/form-handler.js`
2. Find this line (around line 18):
   ```javascript
   const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT';
   ```
3. Replace with your Formspree endpoint:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
4. Make sure `USE_FORMSPREE = true` (should already be true)

---

## Step 4: Test (30 seconds)

1. Open: http://localhost:8000/contact.html
2. Fill out the form
3. Submit
4. Check your email - Formspree will send you the submission!

---

## That's It! 🎉

Your form is now working. Formspree will:
- Send you an email for each submission
- Store submissions in your dashboard
- Protect against spam automatically

---

## View Submissions

1. Go to: https://formspree.io/forms
2. Click on your form
3. See all submissions in the dashboard

---

## Need More Submissions?

- **Free**: 50/month
- **Starter**: $19/month - 1,000 submissions
- **Professional**: $49/month - 5,000 submissions

---

## Example Configuration

```javascript
const USE_FORMSPREE = true;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpzgqkny';
```

**That's all you need!** The form will work immediately.

