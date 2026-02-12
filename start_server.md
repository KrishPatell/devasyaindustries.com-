# Local Server Instructions

## Quick Start

The server should now be running! Access your website at:

🌐 **http://localhost:8000**

## Main Pages

- **Homepage**: http://localhost:8000/index.html
- **About**: http://localhost:8000/about.html
- **Contact**: http://localhost:8000/contact.html
- **Rolling Mill**: http://localhost:8000/rolling-mill.html

## Test CMS Integration

### Navigation Dropdowns
1. Go to http://localhost:8000/index.html
2. Hover over **"Bright Bar"** in the navigation
3. You should see: Flats Bars, Hexagon Bars, Profile Bars, Round Bars, Square Bars
4. Hover over **"SS Products"** or **"SS Wires"**
5. You should see all SS Products listed

### Detail Pages
Test these URLs:

**Bright Bars:**
- http://localhost:8000/detail_bars.html?slug=flats-bar
- http://localhost:8000/detail_bars.html?slug=hexagons-bar
- http://localhost:8000/detail_bars.html?slug=rounds-bar
- http://localhost:8000/detail_bars.html?slug=sqaures-bar
- http://localhost:8000/detail_bars.html?slug=profiles-bar

**SS Products:**
- http://localhost:8000/detail_ss-products.html?slug=epq-wire
- http://localhost:8000/detail_ss-products.html?slug=wire-for-springs
- http://localhost:8000/detail_ss-products.html?slug=wire-for-nails
- http://localhost:8000/detail_ss-products.html?slug=electrode-quality-wire

## Stop the Server

Press `Ctrl + C` in the terminal where the server is running, or run:
```bash
lsof -ti:8000 | xargs kill
```

## Troubleshooting

If the server isn't running, start it manually:
```bash
cd /Users/krishpatel/Downloads/devasyagroup-b42e236fb2cf02739035cf5590.webflow
python3 -m http.server 8000
```

Or use a different port:
```bash
python3 -m http.server 8080
```

Then access at: http://localhost:8080

## Browser Console

Open browser DevTools (F12) to see:
- CMS data loading
- Navigation population
- Any errors or warnings

## What to Check

✅ Navigation dropdowns populate with products
✅ Clicking products navigates to detail pages
✅ Detail pages show correct product information
✅ Images load correctly
✅ Content displays properly
✅ No console errors


