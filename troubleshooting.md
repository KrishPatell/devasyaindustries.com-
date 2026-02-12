# Troubleshooting Guide

## Server is Running ✅
The server should be accessible at: **http://localhost:8000**

## Common Issues & Solutions

### 1. Navigation Dropdowns Not Showing Products

**Check Browser Console (F12):**
- Look for errors related to `cms-data.json`
- Check if you see: "Loading CMS data from: ..."
- Check if you see: "CMS data loaded successfully"

**Solutions:**
- Make sure you're accessing via `http://localhost:8000` (not `file://`)
- Check Network tab in DevTools - verify `cms-data.json` loads with status 200
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### 2. JSON File Not Loading

**Test JSON file directly:**
- Visit: http://localhost:8000/js/cms-data.json
- Should see JSON data, not 404 error

**If 404:**
- Verify file exists: `ls -la js/cms-data.json`
- Check file permissions
- Restart server

### 3. Detail Pages Not Loading Data

**Check URL format:**
- Correct: `detail_bars.html?slug=flats-bar`
- Wrong: `detail_bars.html#slug=flats-bar`

**Check Console:**
- Look for "Item not found for slug: ..."
- Verify slug exists in JSON file

### 4. Server Not Starting

**Manual start:**
```bash
cd /Users/krishpatel/Downloads/devasyagroup-b42e236fb2cf02739035cf5590.webflow
python3 -m http.server 8000
```

**Use different port:**
```bash
python3 -m http.server 8080
```

### 5. CORS Errors

**If you see CORS errors:**
- Make sure you're using `http://localhost:8000` not `file://`
- The server must be running (not opening HTML files directly)

## Debug Steps

1. **Open Browser Console (F12)**
2. **Check Console Tab** for errors
3. **Check Network Tab** - look for `cms-data.json` request
4. **Verify JSON loads** - should see 200 status
5. **Check Elements Tab** - verify dropdown HTML is populated

## Expected Console Output

When working correctly, you should see:
```
Loading CMS data from: js/cms-data.json
CMS data loaded successfully: {brightBars: 5, ssProducts: 13}
Found Bright Bar dropdown, populating with 5 items
Found SS Products dropdown, populating with 13 items
```

## Quick Test URLs

Test these in your browser:

1. **Homepage**: http://localhost:8000/index.html
2. **JSON File**: http://localhost:8000/js/cms-data.json
3. **Bright Bar**: http://localhost:8000/detail_bars.html?slug=flats-bar
4. **SS Product**: http://localhost:8000/detail_ss-products.html?slug=epq-wire

## Still Not Working?

1. **Clear browser cache**
2. **Try different browser** (Chrome, Firefox, Safari)
3. **Check file paths** - make sure all files are in correct locations
4. **Restart server** - kill and restart
5. **Check file permissions** - ensure files are readable

## Contact for Help

If still having issues, check:
- Browser console errors
- Network tab for failed requests
- File paths and permissions
- Server is actually running on port 8000


