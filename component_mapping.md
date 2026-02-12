# Component Mapping & CMS Integration Guide

## Visual Component Breakdown

### Homepage (`index.html`) Structure

```
┌─────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR (Lines 62-139)                               │
│ ├─ Logo                                                     │
│ ├─ Menu Items (Home, About, Rolling Mill)                  │
│ ├─ Bright Bar Dropdown (w-dyn-list) ⚠️ CMS READY           │
│ ├─ SS Wires Dropdown (w-dyn-list) ⚠️ CMS READY            │
│ └─ Contact Button                                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRELOADER (Lines 140-150)                                   │
│ └─ Loading animation                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SECONDARY NAVIGATION (Lines 151-240)                        │
│ └─ Mobile/Tablet variant                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WHATSAPP CHAT WIDGET (Lines 242-258)                        │
│ └─ Floating chat button                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ HERO SECTION (Lines 259-273)                                │
│ ├─ Subtitle: "Gujarat's Leading..."                        │
│ ├─ Heading: "We excel in Steel Fabrication"                │
│ ├─ Description paragraph                                     │
│ └─ Image carousel (4 images)                                 │
│ ⚠️ CMS CANDIDATE: Homepage Hero Singleton                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CLIENT LOGOS CAROUSEL (Lines 275-289)                       │
│ └─ Infinite scroll of corporate client logos                │
│ ⚠️ CMS CANDIDATE: Clients Collection                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ABOUT US SECTION (Lines 290-308)                            │
│ ├─ Image (left)                                             │
│ ├─ Subtitle: "ABOUT US"                                     │
│ ├─ Heading: "Two Decades of Steel Innovation"              │
│ ├─ Rich text description                                    │
│ └─ CTA Button: "View all services"                          │
│ ⚠️ CMS CANDIDATE: About Content Singleton                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ METRICS SECTION (Lines 309-343)                              │
│ └─ 4 Metric Cards:                                          │
│    ├─ 25K MT Production Capacity                            │
│    ├─ 20 Years Experience                                   │
│    ├─ 30+ Countries Exported                               │
│    └─ 6 State-of-the-art Facilities                        │
│ ⚠️ CMS CANDIDATE: Company Metrics Collection               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ APPLICATIONS SECTION (Lines 344-483)                        │
│ ├─ Heading: "Stainless Steel Wire Applications"            │
│ └─ 12 Service Cards (Grid Layout):                         │
│    ├─ SS Wire Meshes                                        │
│    ├─ SS Wedge Wire Screens                                │
│    ├─ SS Conveyor Belts                                    │
│    ├─ SS Kitchen Baskets                                   │
│    ├─ SS Wall Ties                                         │
│    ├─ SS Balls                                             │
│    ├─ SS Collated Nails                                    │
│    ├─ SS Chains                                            │
│    ├─ SS Orthopedic Implants                               │
│    ├─ SS Cable Trays                                       │
│    ├─ SS Fasteners                                         │
│    └─ SS Springs                                           │
│ ⚠️ CMS CANDIDATE: Services/Applications Collection          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CERTIFICATES SECTION (Lines 484-500)                       │
│ ├─ Heading: "Certificates"                                  │
│ └─ 3 Certificate Images with PDF links:                    │
│    ├─ TUV SUD Certificate                                 │
│    ├─ ISO Certificate                                      │
│    └─ (Third certificate)                                   │
│ ⚠️ CMS CANDIDATE: Certificates Collection                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ GALLERY SECTION (Lines 501-518)                             │
│ ├─ Heading: "Our Steel Products"                          │
│ └─ 3-Column Masonry Layout:                                │
│    ├─ Column 1: Smaller images (523px)                    │
│    ├─ Column 2: Medium images (812px)                     │
│    └─ Column 3: Tall images (519-740px)                   │
│ ⚠️ CMS CANDIDATE: Gallery Collection                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LOCATIONS SECTION (Lines 519-531)                           │
│ └─ World map SVG                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FOOTER (Lines 532-603)                                      │
│ ├─ Logo & Description                                       │
│ ├─ Email Subscription Form                                  │
│ ├─ Product Links                                           │
│ ├─ Other Links                                             │
│ └─ Address & Contact Info                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Detail Page Structure (`detail_ss-products.html`)

```
┌─────────────────────────────────────────────────────────────┐
│ PAGE HERO (Lines 238-263)                                    │
│ ├─ Title (w-dyn-bind-empty) ⚠️ CMS BINDING                │
│ ├─ Breadcrumb (w-dyn-bind-empty) ⚠️ CMS BINDING            │
│ └─ Call-to-action card                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCT CONTENT (Lines 264-295)                              │
│ ├─ Subtitle: "ss products applications"                     │
│ ├─ Heading (w-dyn-bind-empty) ⚠️ CMS BINDING              │
│ ├─ Description (w-richtext) ⚠️ CMS BINDING                 │
│ ├─ Download Brochure Button                                 │
│ └─ Expert Appointment Card                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRODUCT GALLERY (Lines 286-295)                             │
│ └─ Image Collection (w-dyn-list) ⚠️ CMS BINDING            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CTA SECTION (Lines 297-316)                                  │
│ └─ "Get a Quote" call-to-action                            │
└─────────────────────────────────────────────────────────────┘
```

---

## CSS Class Patterns for CMS Integration

### Dynamic List Structure
```html
<div class="w-dyn-list">
  <div role="list" class="w-dyn-items">
    <div role="listitem" class="w-dyn-item">
      <!-- Item content here -->
    </div>
  </div>
  <div class="w-dyn-empty">
    <div>No items found.</div>
  </div>
</div>
```

### Binding Classes
- `w-dyn-bind-empty` - For text content that may be empty
- `w-richtext` - For rich text content
- `w-dyn-bind-[field-name]` - Custom field bindings (if using Webflow CMS)

---

## JavaScript Integration Points

### Current Scripts
1. **jQuery** (Line 605)
   - Used for DOM manipulation
   - Can be used for CMS data fetching

2. **Webflow.js** (Line 606)
   - Handles Webflow interactions
   - May need modification for CMS data

### Recommended Integration Approach

```javascript
// Example CMS Integration Pattern
async function fetchCMSData(collectionName) {
  try {
    const response = await fetch(`YOUR_CMS_API_URL/${collectionName}`);
    const data = await response.json();
    return data.items; // Adjust based on your CMS structure
  } catch (error) {
    console.error('CMS fetch error:', error);
    return [];
  }
}

// Populate dynamic lists
function populateDynamicList(containerSelector, items, templateFunction) {
  const container = document.querySelector(containerSelector);
  const itemsContainer = container.querySelector('.w-dyn-items');
  const emptyState = container.querySelector('.w-dyn-empty');
  
  if (items.length === 0) {
    itemsContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  itemsContainer.innerHTML = items.map(templateFunction).join('');
  emptyState.style.display = 'none';
}
```

---

## Priority Integration Order

### Phase 1: High Priority (Core Content)
1. ✅ **Services/Applications** - Most visible, frequently updated
2. ✅ **SS Products** - Product catalog is essential
3. ✅ **Gallery** - Visual content needs easy management

### Phase 2: Medium Priority (Supporting Content)
4. ✅ **Company Metrics** - May change over time
5. ✅ **Certificates** - New certificates added periodically
6. ✅ **Clients** - Logo updates needed

### Phase 3: Lower Priority (Static Content)
7. ✅ **Navigation Items** - Less frequently changed
8. ✅ **Homepage Hero** - Rarely changes
9. ✅ **About Content** - Very stable content

### Phase 4: Future Features
10. ✅ **News/Blog** - Currently empty templates
11. ✅ **Projects** - Currently empty template

---

## Field Mapping Reference

### Service Card Example
```javascript
{
  "title": "SS Wire Meshes",
  "description": "Used in filtration, sieving, and security systems",
  "icon": "https://cdn.../Vectors-Wrapper.svg",
  "link_url": "https://www.devasyaindustries.com/ss-products/epq-wire",
  "order": 1
}
```

### Gallery Item Example
```javascript
{
  "image": "https://.../image.jpg",
  "title": "Stainless Steel Wire",
  "category": "column-1", // or "column-2", "column-3"
  "order": 1
}
```

### SS Product Example
```javascript
{
  "title": "EPQ Wire",
  "slug": "epq-wire",
  "breadcrumb": "Home / SS Products / EPQ Wire",
  "heading": "EPQ Wire Applications",
  "description": "<p>Rich text description...</p>",
  "brochure_pdf": "https://.../brochure.pdf",
  "gallery_images": ["url1", "url2", "url3"]
}
```

---

## Responsive Considerations

### Breakpoints (Inferred from CSS)
- Mobile: `< 600px` (scrollbar hidden)
- Tablet: `600px - 991px`
- Desktop: `> 991px`

### Components with Responsive Variants
- Navigation (two separate nav bars)
- Gallery (responsive image sizes)
- Service cards (grid layout adapts)

---

**Last Updated**: December 2025
**Status**: Ready for CMS Integration


