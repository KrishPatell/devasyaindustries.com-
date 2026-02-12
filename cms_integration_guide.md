# CMS Integration Guide - Devasya Group Website

## Overview
This guide explains how the Bright Bars and SS Products CMS collections are integrated into the website.

## Files Created/Modified

### New Files
1. **`js/cms-data.json`** - Contains all Bright Bars and SS Products data in JSON format
2. **`js/cms-integration.js`** - JavaScript file that handles CMS integration, navigation population, and detail page data binding

### Modified Files
- `index.html` - Added CMS integration script
- `detail_bars.html` - Added CMS integration script
- `detail_ss-products.html` - Added CMS integration script
- `about.html` - Added CMS integration script
- `contact.html` - Added CMS integration script
- `rolling-mill.html` - Added CMS integration script

## How It Works

### 1. Navigation Dropdowns
The CMS integration automatically populates the navigation dropdowns:
- **Bright Bar dropdown** - Shows all Bright Bar products (Flats Bars, Hexagon Bars, Profile Bars, Round Bars, Square Bars)
- **SS Products/SS Wires dropdown** - Shows all SS Products (EPQ Wire, General Purpose Wire, etc.)

**Location**: Navigation bars on all pages

### 2. Detail Pages
Detail pages are accessed via URL parameters:
- **Bright Bars**: `detail_bars.html?slug=flats-bar`
- **SS Products**: `detail_ss-products.html?slug=epq-wire`

The CMS integration automatically:
- Loads the correct product data based on the slug
- Populates the page title, heading, breadcrumb, content, and images
- Updates SEO meta tags

### 3. Data Structure

#### Bright Bars Collection
Each item contains:
- `name` - Product name
- `slug` - URL-friendly identifier
- `nameOfProduct` - Display name
- `cardImage` - Featured image
- `projectImages` - Array of product images
- `projectInfo` - Rich HTML content
- `archived` - Boolean (archived items are filtered out)
- `draft` - Boolean (draft items are filtered out)

#### SS Products Collection
Each item contains:
- `name` - Product name
- `slug` - URL-friendly identifier
- `nameOfProduct` - Display name
- `featuredImage` - Featured image
- `productImages` - Array of product images
- `projectInfo` - Rich HTML content
- `order` - Display order (used for sorting)
- `archived` - Boolean (archived items are filtered out)
- `draft` - Boolean (draft items are filtered out)

## Usage

### Accessing Products
1. **Via Navigation**: Click on "Bright Bar" or "SS Products" in the navigation menu
2. **Direct URL**: Navigate to `detail_bars.html?slug=YOUR-SLUG` or `detail_ss-products.html?slug=YOUR-SLUG`

### Available Bright Bar Slugs
- `flats-bar`
- `hexagons-bar`
- `profiles-bar`
- `rounds-bar`
- `sqaures-bar`

### Available SS Product Slugs
- `epq-wire`
- `general-purpose-wire`
- `cold-heating-wire`
- `wire-for-nails`
- `free-cutting-wire`
- `wire-for-springs`
- `lashing-wire`
- `wire-for-ropes`
- `fine-wires`
- `wire-for-building-industry`
- `chain-wire`
- `wire-for-conveyor-belt-weaving`
- `electrode-quality-wire`

## Updating Data

### To Update Product Data
1. Edit `js/cms-data.json`
2. Update the relevant product object
3. Refresh the page

### To Add New Products
1. Add a new object to the appropriate array in `js/cms-data.json`
2. Ensure it has all required fields
3. Refresh the page

### To Remove Products
Set `archived: true` or `draft: true` in the product object, and it will be automatically filtered out.

## Technical Details

### JavaScript API
The CMS integration exposes a global `DevasyaCMS` object:

```javascript
// Get all CMS data
const data = DevasyaCMS.getData();

// Get a specific item by slug
const item = DevasyaCMS.getItemBySlug('epq-wire', 'ss-products');
const bar = DevasyaCMS.getItemBySlug('flats-bar', 'bars');
```

### Page Detection
The integration automatically detects:
- Detail pages (`detail_bars.html`, `detail_ss-products.html`)
- URL parameters (`?slug=...`)
- Navigation dropdowns

### Error Handling
- If a slug is not found, an error is logged to the console
- If CMS data fails to load, navigation dropdowns remain empty
- Missing images or content fields are handled gracefully

## Testing Checklist

- [x] Navigation dropdowns populate correctly
- [x] Bright Bar products appear in dropdown
- [x] SS Products appear in dropdown
- [x] Clicking dropdown items navigates to correct detail page
- [x] Detail pages load correct product data
- [x] Product images display correctly
- [x] Rich text content renders properly
- [x] SEO meta tags update correctly
- [x] Breadcrumbs display correctly
- [x] Archived/draft items are filtered out
- [x] SS Products are sorted by order field

## Troubleshooting

### Navigation Dropdowns Not Populating
1. Check browser console for errors
2. Verify `js/cms-data.json` is accessible
3. Check that the JSON file is valid
4. Ensure the script is loaded after jQuery

### Detail Page Not Loading Data
1. Check URL parameter: `?slug=YOUR-SLUG`
2. Verify slug exists in `cms-data.json`
3. Check browser console for errors
4. Ensure product is not archived or draft

### Images Not Displaying
1. Verify image URLs in `cms-data.json` are valid
2. Check browser network tab for failed image requests
3. Ensure images are accessible (CORS if hosted elsewhere)

## Future Enhancements

Potential improvements:
1. Server-side rendering for better SEO
2. Caching mechanism for CMS data
3. Admin interface for managing products
4. Search functionality
5. Filtering and sorting options
6. Related products suggestions

## Support

For issues or questions:
1. Check browser console for errors
2. Verify JSON file structure
3. Test with different browsers
4. Check network requests in browser DevTools

---

**Last Updated**: December 2025
**Version**: 1.0.0


