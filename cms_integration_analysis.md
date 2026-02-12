# Devasya Group Website - CMS Integration Analysis

## Executive Summary
This Webflow site for Devasya Industries (steel manufacturer) has been analyzed for headless CMS integration. The site contains several components that are currently hardcoded but are prime candidates for CMS-driven content management.

---

## Site Structure Overview

### Technology Stack
- **Framework**: Webflow (static HTML export)
- **CSS**: Custom Webflow CSS + Normalize.css
- **JavaScript**: Webflow.js + jQuery 3.5.1
- **Fonts**: Montserrat, Inter (Google Fonts), Eudoxus Sans, Outfit, Satoshi (local)
- **Site ID**: `6941428e12e7af812996d675`
- **Page ID (Home)**: `6941428e12e7af812996d665`

### Key Pages
1. `index.html` - Homepage
2. `about.html` - About Us
3. `rolling-mill.html` - Rolling Mill services
4. `contact.html` - Contact page
5. `detail_ss-products.html` - SS Products detail page
6. `detail_posts.html` - Blog/News detail page (empty template)
7. `news.html` - News listing (empty template)
8. `projects.html` - Projects listing (empty template)

---

## Components Ready for CMS Integration

### 1. **Navigation Dropdowns** (Currently Empty)
**Location**: Lines 72-119, 161-217 in `index.html`

**Structure**:
```html
<div class="w-dyn-list">
  <div role="list" class="w-dyn-items">
    <div role="listitem" class="w-dyn-item">
      <a href="#" class="uui-navbar07_dropdown-link">
        <div class="uui-navbar07_item-heading w-dyn-bind-empty"></div>
      </a>
    </div>
  </div>
  <div class="w-dyn-empty">No items found.</div>
</div>
```

**CMS Collections Needed**:
- **Bright Bar Collection**: Menu items for Bright Bar dropdown
- **SS Products Collection**: Menu items for SS Products/SS Wires dropdown

**Fields Required**:
- `title` (text) - Menu item name
- `slug` (text) - URL slug
- `order` (number) - Display order

---

### 2. **Service/Application Cards** (Currently Hardcoded)
**Location**: Lines 361-482 in `index.html`

**Current Structure**: 12 hardcoded service cards with:
- Icon image (SVG)
- Title (e.g., "SS Wire Meshes", "SS Wedge Wire Screens")
- Description text
- Link URL

**CMS Collection**: `SS Applications` or `Services`

**Fields Required**:
- `title` (text) - Service name
- `description` (rich text) - Service description
- `icon` (image/file) - Icon SVG or image
- `link_url` (text) - External link
- `order` (number) - Display order
- `category` (text/select) - Optional categorization

**Example Card Structure**:
```html
<div class="service-card">
  <div class="icon-container_64px-rounded">
    <img src="[icon]" class="vectors-wrapper-3">
  </div>
  <div class="text-2">
    <div class="plumbing-services">[title]</div>
    <div class="text-3">[description]</div>
    <div class="container-3">
      <a href="[link_url]">
        <img src="[arrow-icon]" class="vectors-wrapper-4">
      </a>
    </div>
  </div>
</div>
```

---

### 3. **Gallery Images** (Currently Hardcoded)
**Location**: Lines 513-517 in `index.html`

**Current Structure**: Three columns of images (`frame-1171275355`, `frame-1171275356`, `frame-1171275357`)

**CMS Collection**: `Gallery` or `Product Images`

**Fields Required**:
- `image` (image) - Gallery image
- `title` (text) - Image title/alt text
- `category` (text/select) - Column assignment or category
- `order` (number) - Display order
- `product_reference` (reference) - Optional link to product

**Current Columns**:
- Column 1: Smaller images (523px width)
- Column 2: Medium images (812px width)
- Column 3: Tall images (519px height, 740px height)

---

### 4. **Corporate Clients Logos** (Currently Hardcoded)
**Location**: Lines 283-285 in `index.html`

**Current Structure**: Infinite scroll carousel of client logos

**CMS Collection**: `Clients` or `Corporate Partners`

**Fields Required**:
- `logo` (image) - Client logo
- `company_name` (text) - Company name
- `website_url` (text) - Optional link
- `order` (number) - Display order

---

### 5. **Certificates** (Currently Hardcoded)
**Location**: Lines 494-498 in `index.html`

**Current Structure**: Three certificate images with PDF links

**CMS Collection**: `Certificates`

**Fields Required**:
- `certificate_image` (image) - Certificate thumbnail
- `certificate_pdf` (file) - PDF download
- `certificate_name` (text) - Certificate title
- `issuing_organization` (text) - e.g., "TUV SUD", "ISO"
- `order` (number) - Display order

---

### 6. **Metrics/Statistics** (Currently Hardcoded)
**Location**: Lines 313-339 in `index.html`

**Current Structure**: Four metric cards

**CMS Collection**: `Company Metrics`

**Fields Required**:
- `number` (text) - Metric value (e.g., "25K", "20", "30+")
- `label` (text) - Metric description
- `icon` (image/file) - Optional icon
- `order` (number) - Display order

**Current Metrics**:
1. "25K" - MT (T) PRODUCTION CAPACITY
2. "20" - YEARS OF EXPERIENCE
3. "30+" - COUNTRY EXPORTED
4. "6" - STATE-OF-THE ART FACILITIES

---

### 7. **Hero Section Content** (Currently Hardcoded)
**Location**: Lines 259-273 in `index.html`

**CMS Collection**: `Homepage Hero` (Singleton)

**Fields Required**:
- `subtitle` (text) - "Gujarat's Leading Steel Manufacturer..."
- `main_heading` (text) - "We excel in Steel Fabrication"
- `description` (rich text) - Hero description paragraph
- `hero_images` (multi-image) - Background images carousel

---

### 8. **About Us Section** (Currently Hardcoded)
**Location**: Lines 292-307 in `index.html`

**CMS Collection**: `About Content` (Singleton)

**Fields Required**:
- `subtitle` (text) - "ABOUT US"
- `heading` (text) - "Two Decades of Steel Innovation"
- `content` (rich text) - About description
- `about_image` (image) - Side image
- `cta_text` (text) - Button text
- `cta_link` (text) - Button URL

---

### 9. **SS Products Detail Page** (`detail_ss-products.html`)
**Location**: Lines 238-295

**CMS Collection**: `SS Products`

**Fields Required**:
- `title` (text) - Product name
- `slug` (text) - URL slug
- `breadcrumb` (text) - Breadcrumb path
- `subtitle` (text) - "ss products applications"
- `heading` (text) - Product heading
- `description` (rich text) - Product description
- `brochure_pdf` (file) - Download link
- `gallery_images` (multi-image) - Product images
- `meta_title` (text) - SEO title
- `meta_description` (text) - SEO description

---

### 10. **News/Blog Posts** (`detail_posts.html`, `news.html`)
**Current Status**: Empty templates

**CMS Collection**: `News` or `Blog Posts`

**Fields Required**:
- `title` (text) - Post title
- `slug` (text) - URL slug
- `excerpt` (text) - Short description
- `content` (rich text) - Full post content
- `featured_image` (image) - Hero image
- `publish_date` (date) - Publication date
- `author` (text) - Author name
- `category` (reference) - Post category
- `meta_title` (text) - SEO title
- `meta_description` (text) - SEO description

---

## Recommended CMS Schema

### Collection Structure Summary

1. **Navigation Items** (`navigation_items`)
   - title, slug, order, parent_category

2. **Services/Applications** (`services`)
   - title, description, icon, link_url, order, category

3. **Gallery** (`gallery`)
   - image, title, category, order, product_reference

4. **Clients** (`clients`)
   - logo, company_name, website_url, order

5. **Certificates** (`certificates`)
   - certificate_image, certificate_pdf, certificate_name, issuing_organization, order

6. **Company Metrics** (`metrics`)
   - number, label, icon, order

7. **SS Products** (`ss_products`)
   - title, slug, breadcrumb, subtitle, heading, description, brochure_pdf, gallery_images, meta_title, meta_description

8. **News/Blog** (`news`)
   - title, slug, excerpt, content, featured_image, publish_date, author, category, meta_title, meta_description

9. **Singleton Collections**:
   - `homepage_hero` - Hero section content
   - `about_content` - About section content
   - `company_info` - Company details, contact info

---

## Integration Points

### Webflow Dynamic Elements Already Present
The site uses Webflow's dynamic list structure (`w-dyn-list`, `w-dyn-items`, `w-dyn-item`, `w-dyn-bind-empty`) which suggests it was designed with CMS in mind but not yet connected.

### Key Integration Areas:
1. **Navigation Dropdowns** - Lines 80-94, 104-118 (Bright Bar, SS Wires)
2. **Service Cards** - Lines 361-482 (12 application cards)
3. **Gallery** - Lines 513-517 (Three-column masonry layout)
4. **Client Logos** - Lines 283-285 (Carousel)
5. **Detail Pages** - `detail_ss-products.html` (Product detail template)

---

## Technical Considerations

### Data Attributes
- Webflow uses `data-wf-page` and `data-wf-site` attributes
- Dynamic elements use `w-dyn-bind-empty` for empty states
- Form elements use `data-wf-page-id` and `data-wf-element-id`

### JavaScript Dependencies
- jQuery 3.5.1 (from Webflow CDN)
- Webflow.js (custom interactions)
- Google Analytics (gtag.js)

### CSS Classes Pattern
- `w-dyn-list` - Dynamic list container
- `w-dyn-items` - List items wrapper
- `w-dyn-item` - Individual item
- `w-dyn-bind-empty` - Empty state binding
- `w-dyn-empty` - Empty state message

---

## Next Steps for CMS Integration

1. **Choose Headless CMS Platform**
   - Recommended: Contentful, Strapi, Sanity, or Webflow CMS API
   - Consider: Directus, Payload CMS

2. **Create Collection Schemas**
   - Map fields to CMS content models
   - Set up relationships between collections

3. **Build API Integration**
   - Create JavaScript fetch functions
   - Map CMS data to Webflow dynamic elements
   - Handle loading states and errors

4. **Update HTML Templates**
   - Replace hardcoded content with dynamic bindings
   - Add loading skeletons
   - Implement error handling

5. **Testing**
   - Test all dynamic sections
   - Verify responsive behavior
   - Check SEO metadata

---

## Notes

- The site has a preloader component (lines 140-150)
- Custom scrollbar styling (lines 28-51)
- WhatsApp chat widget (lines 242-258)
- Two navigation bars (desktop and mobile variants)
- Form submission handling via Webflow forms

---

**Analysis Date**: December 2025
**Analyst**: UI/UX & Webflow Development Expert
**Status**: Ready for CMS Integration Planning


