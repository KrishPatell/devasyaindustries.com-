/**
 * Devasya Group CMS Integration
 * Handles Bright Bars and SS Products collections
 */

(function() {
  'use strict';

  // CMS Data Storage
  let cmsData = {
    brightBars: [],
    ssProducts: []
  };

  // Initialize CMS Integration
  function initCMS() {
    // Wait for DOM to be fully ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initializeCMSData();
      });
    } else {
      // DOM already ready, but wait a bit for any redirects
      setTimeout(() => {
        initializeCMSData();
      }, 100);
    }
  }

  function initializeCMSData() {
    // Load CMS data
    loadCMSData().then(() => {
      // Populate navigation dropdowns
      populateNavigationDropdowns();
      
      // Handle detail page routing (this might redirect)
      handleDetailPageRouting();
      
      // Bind detail page data if on detail page
      // Wait a bit after potential redirect
      setTimeout(() => {
        if (isDetailPage()) {
          console.log('Detail page detected, binding data...');
          bindDetailPageData();
        }
      }, 200);
    }).catch(error => {
      console.error('CMS Integration Error:', error);
    });
  }

  /**
   * Load CMS data from JSON file
   */
  async function loadCMSData() {
    try {
      // Try multiple path options
      let jsonPath = 'js/cms-data.json';
      
      // If we're in a subdirectory, adjust path
      const pathParts = window.location.pathname.split('/').filter(p => p);
      if (pathParts.length > 1 && !pathParts[pathParts.length - 1].includes('.html')) {
        jsonPath = '../js/cms-data.json';
      } else if (pathParts.length > 1) {
        jsonPath = './js/cms-data.json';
      }
      
      console.log('Loading CMS data from:', jsonPath);
      const response = await fetch(jsonPath);
      
      if (!response.ok) {
        // Try alternative path
        const altPath = '/js/cms-data.json';
        console.log('Trying alternative path:', altPath);
        const altResponse = await fetch(altPath);
        if (!altResponse.ok) {
          throw new Error(`Failed to load CMS data: ${response.status} ${response.statusText}`);
        }
        cmsData = await altResponse.json();
      } else {
        cmsData = await response.json();
      }
      
      console.log('CMS data loaded successfully:', {
        brightBars: cmsData.brightBars?.length || 0,
        ssProducts: cmsData.ssProducts?.length || 0
      });
      
      // Filter out archived and draft items
      cmsData.brightBars = (cmsData.brightBars || []).filter(item => !item.archived && !item.draft);
      cmsData.ssProducts = (cmsData.ssProducts || []).filter(item => !item.archived && !item.draft);
      
      // Sort SS Products by order field
      cmsData.ssProducts.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      return cmsData;
    } catch (error) {
      console.error('Error loading CMS data:', error);
      console.error('Current path:', window.location.pathname);
      // Don't throw - allow page to continue without CMS data
      return { brightBars: [], ssProducts: [] };
    }
  }

  /**
   * Populate navigation dropdowns with CMS data
   */
  function populateNavigationDropdowns() {
    if (!cmsData || (!cmsData.brightBars?.length && !cmsData.ssProducts?.length)) {
      console.warn('No CMS data available to populate navigation');
      return;
    }
    
    console.log('Populating navigation dropdowns...');
    
    // Bright Bar dropdowns (multiple instances on page)
    const brightBarDropdowns = document.querySelectorAll('.uui-navbar07_menu-dropdown, .uui-navbar07_menu-dropdown-3');
    
    brightBarDropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.uui-navbar07_dropdown-toggle, .uui-navbar07_dropdown-toggle-3');
      if (toggle && toggle.textContent.includes('Bright Bar')) {
        const dynList = dropdown.querySelector('.w-dyn-list');
        if (dynList) {
          console.log('Found Bright Bar dropdown, populating with', cmsData.brightBars.length, 'items');
          populateDropdownList(dynList, cmsData.brightBars, 'bars');
        }
      }
    });

    // SS Products/SS Wires dropdowns
    const ssProductDropdowns = document.querySelectorAll('.uui-navbar07_menu-dropdown, .uui-navbar07_menu-dropdown-3');
    
    ssProductDropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.uui-navbar07_dropdown-toggle, .uui-navbar07_dropdown-toggle-3');
      if (toggle && (toggle.textContent.includes('SS Products') || toggle.textContent.includes('SS Wires'))) {
        const dynList = dropdown.querySelector('.w-dyn-list');
        if (dynList) {
          console.log('Found SS Products dropdown, populating with', cmsData.ssProducts.length, 'items');
          populateDropdownList(dynList, cmsData.ssProducts, 'ss-products');
        }
      }
    });
  }

  /**
   * Populate a dropdown list with items
   */
  function populateDropdownList(container, items, type) {
    const itemsContainer = container.querySelector('.w-dyn-items');
    const emptyState = container.querySelector('.w-dyn-empty');
    
    if (!itemsContainer) return;
    
    // Clear existing items
    itemsContainer.innerHTML = '';
    
    if (items.length === 0) {
      if (emptyState) {
        emptyState.style.display = 'block';
      }
      return;
    }
    
    // Hide empty state
    if (emptyState) {
      emptyState.style.display = 'none';
    }
    
    // Create items
    items.forEach(item => {
      const itemElement = createDropdownItem(item, type);
      itemsContainer.appendChild(itemElement);
    });
  }

  /**
   * Create a dropdown menu item element
   */
  function createDropdownItem(item, type) {
    const itemDiv = document.createElement('div');
    itemDiv.setAttribute('role', 'listitem');
    itemDiv.className = 'w-dyn-item';
    
    const link = document.createElement('a');
    const isMobileNav = document.querySelector('.uui-navbar07_menu-dropdown-3');
    if (isMobileNav && type === 'bars') {
      link.className = 'uui-navbar07_dropdown-link-3 w-inline-block';
      link.href = `detail_bars.html?slug=${item.slug}`;
      
      const rightDiv = document.createElement('div');
      rightDiv.className = 'uui-navbar07_item-right-3';
      
      const heading = document.createElement('div');
      heading.className = 'uui-navbar07_item-heading-3';
      heading.textContent = item.nameOfProduct || item.name;
      
      rightDiv.appendChild(heading);
      link.appendChild(rightDiv);
    } else if (isMobileNav && type === 'ss-products') {
      link.className = 'uui-navbar07_dropdown-link-3 w-inline-block';
      link.href = `detail_ss-products.html?slug=${item.slug}`;
      
      const rightDiv = document.createElement('div');
      rightDiv.className = 'uui-navbar07_item-right-3';
      
      const heading = document.createElement('div');
      heading.className = 'uui-navbar07_item-heading-3';
      heading.textContent = item.nameOfProduct || item.name;
      
      rightDiv.appendChild(heading);
      link.appendChild(rightDiv);
    } else {
      link.className = 'uui-navbar07_dropdown-link w-inline-block';
      link.href = type === 'bars' ? `detail_bars.html?slug=${item.slug}` : `detail_ss-products.html?slug=${item.slug}`;
      
      const rightDiv = document.createElement('div');
      rightDiv.className = 'uui-navbar07_item-right';
      
      const heading = document.createElement('div');
      heading.className = 'uui-navbar07_item-heading';
      heading.textContent = item.nameOfProduct || item.name;
      
      rightDiv.appendChild(heading);
      link.appendChild(rightDiv);
    }
    
    itemDiv.appendChild(link);
    return itemDiv;
  }

  /**
   * Check if current page is a detail page
   */
  function isDetailPage() {
    const path = window.location.pathname;
    return path.includes('detail_bars.html') || path.includes('detail_ss-products.html') || 
           path.includes('/bars/') || path.includes('/ss-products/');
  }

  /**
   * Get URL parameter value
   */
  function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  /**
   * Handle detail page routing and data binding
   */
  function handleDetailPageRouting() {
    // Handle clean URL format: /bars/flats-bar or /ss-products/epq-wire
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(p => p);
    
    // Check for /bars/slug or /ss-products/slug format
    if (pathParts.length >= 2) {
      const category = pathParts[pathParts.length - 2];
      const slug = pathParts[pathParts.length - 1];
      
      if (category === 'bars' && slug) {
        // Redirect to detail page with query parameter
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        window.location.href = `${basePath}/detail_bars.html?slug=${slug}`;
        return;
      } else if (category === 'ss-products' && slug) {
        // Redirect to detail page with query parameter
        const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
        window.location.href = `${basePath}/detail_ss-products.html?slug=${slug}`;
        return;
      }
    }
  }

  /**
   * Bind data to detail page
   */
  function bindDetailPageData() {
    // Ensure data is loaded
    if (!cmsData || (!cmsData.brightBars?.length && !cmsData.ssProducts?.length)) {
      console.warn('CMS data not loaded yet, retrying...');
      setTimeout(() => {
        if (cmsData && (cmsData.brightBars?.length || cmsData.ssProducts?.length)) {
          bindDetailPageData();
        } else {
          console.error('CMS data still not loaded after retry');
        }
      }, 500);
      return;
    }
    
    let slug = getURLParameter('slug');
    const path = window.location.pathname;
    
    console.log('Binding detail page data:', { slug, path });
    
    // Handle clean URL format: /bars/slug or /ss-products/slug
    if (!slug && (path.includes('/bars/') || path.includes('/ss-products/'))) {
      const pathParts = path.split('/').filter(p => p);
      slug = pathParts[pathParts.length - 1];
      console.log('Extracted slug from path:', slug);
    }
    
    if (!slug) {
      console.warn('No slug parameter found in URL');
      return;
    }
    
    let item = null;
    let collectionType = null;
    
    if (path.includes('detail_bars.html') || path.includes('/bars/')) {
      item = cmsData.brightBars.find(b => b.slug === slug);
      collectionType = 'bars';
      console.log('Looking for Bright Bar:', slug, 'Found:', !!item);
      console.log('Available Bright Bar slugs:', cmsData.brightBars.map(b => b.slug));
    } else if (path.includes('detail_ss-products.html') || path.includes('/ss-products/')) {
      item = cmsData.ssProducts.find(p => p.slug === slug);
      collectionType = 'ss-products';
      console.log('Looking for SS Product:', slug, 'Found:', !!item);
      console.log('Available SS Product slugs:', cmsData.ssProducts.map(p => p.slug));
    }
    
    if (!item) {
      console.error('Item not found for slug:', slug, 'Type:', collectionType);
      console.error('Available items:', collectionType === 'bars' ? cmsData.brightBars : cmsData.ssProducts);
      return;
    }
    
    console.log('Item found:', item.name, 'ProjectInfo length:', item.projectInfo ? item.projectInfo.length : 0);
    
    // Bind data to page elements
    bindItemDataToPage(item, collectionType);
  }

  /**
   * Bind item data to detail page elements
   */
  function bindItemDataToPage(item, type) {
    console.log('Binding data for item:', item.name, 'Type:', type);
    
    // Update page title
    const titleElement = document.querySelector('.xxl-heading.one');
    if (titleElement) {
      titleElement.textContent = item.nameOfProduct || item.name;
      titleElement.classList.remove('w-dyn-bind-empty');
      console.log('Updated title:', titleElement.textContent);
    }
    
    // Update breadcrumb
    const breadcrumbElement = document.querySelector('.div-block-14 .w-dyn-bind-empty, .div-block-16 .w-dyn-bind-empty');
    if (breadcrumbElement) {
      const category = type === 'bars' ? 'Bright Bar' : 'SS Products';
      breadcrumbElement.textContent = `${category} / ${item.nameOfProduct || item.name}`;
      breadcrumbElement.classList.remove('w-dyn-bind-empty');
      console.log('Updated breadcrumb:', breadcrumbElement.textContent);
    }
    
    // Update heading
    const headingElement = document.querySelector('.large-heading.half');
    if (headingElement) {
      headingElement.textContent = item.nameOfProduct || item.name;
      headingElement.classList.remove('w-dyn-bind-empty');
      console.log('Updated heading:', headingElement.textContent);
    }
    
    // Update rich text content - try multiple selectors
    let richTextElement = document.querySelector('.rich-text-block.w-richtext');
    if (!richTextElement) {
      // Try finding by parent container (for detail_bars.html)
      const parent = document.querySelector('.div-block-12');
      if (parent) {
        richTextElement = parent.querySelector('.w-richtext');
      }
    }
    if (!richTextElement) {
      // Try selector for detail_ss-products.html (has target="_blank")
      richTextElement = document.querySelector('div.w-richtext.w-dyn-bind-empty[target="_blank"]');
    }
    if (!richTextElement) {
      richTextElement = document.querySelector('.w-richtext.w-dyn-bind-empty');
    }
    if (!richTextElement) {
      richTextElement = document.querySelector('div.w-richtext');
    }
    if (!richTextElement) {
      // Last resort: find any w-richtext in the content area
      const contentArea = document.querySelector('.div-block-12, #w-node-be9708ad-f919-edf1-5822-32ba4abbf45b-2996d66b');
      if (contentArea) {
        richTextElement = contentArea.querySelector('.w-richtext');
      }
    }
    
    if (richTextElement && item.projectInfo) {
      // Remove empty class and set content
      richTextElement.classList.remove('w-dyn-bind-empty');
      richTextElement.innerHTML = item.projectInfo;
      console.log('Updated rich text content, length:', item.projectInfo.length);
      console.log('Rich text element:', richTextElement);
    } else {
      console.warn('Rich text element not found or no projectInfo:', {
        found: !!richTextElement,
        hasProjectInfo: !!item.projectInfo,
        projectInfoLength: item.projectInfo ? item.projectInfo.length : 0,
        selectors: ['.rich-text-block.w-richtext', '.w-richtext.w-dyn-bind-empty', 'div.w-richtext']
      });
      // Try to find all w-richtext elements for debugging
      const allRichText = document.querySelectorAll('.w-richtext');
      console.log('All w-richtext elements found:', allRichText.length);
      allRichText.forEach((el, i) => {
        console.log(`  ${i}:`, el.className, el.parentElement?.className);
      });
    }
    
    // Update hero background image
    const heroBackground = document.querySelector('.hero-background-image.contact-background');
    if (heroBackground) {
      const backgroundImage = type === 'bars' ? item.cardImage : item.featuredImage;
      if (backgroundImage) {
        heroBackground.style.backgroundImage = `url('${backgroundImage}')`;
        heroBackground.style.backgroundSize = 'cover';
        heroBackground.style.backgroundPosition = 'center';
        heroBackground.style.backgroundRepeat = 'no-repeat';
        console.log('Updated hero background image:', backgroundImage);
      } else {
        console.warn('No background image found for item:', item.name);
      }
    } else {
      console.warn('Hero background element not found');
    }
    
    // Update product images gallery
    // Try multiple selectors to find the gallery container
    let galleryContainer = null;
    const selectors = [
      '.collection-list-wrapper-2 .w-dyn-items',
      '.collection-list-3 .w-dyn-items',
      '.div-block-15 .w-dyn-items',
      '.div-block-15 .collection-list-3',
      '.w-dyn-list .collection-list-3 .w-dyn-items'
    ];
    
    for (const selector of selectors) {
      galleryContainer = document.querySelector(selector);
      if (galleryContainer) {
        console.log('Gallery container found with selector:', selector);
        break;
      }
    }
    
    if (galleryContainer) {
      const images = type === 'bars' ? item.projectImages : item.productImages;
      console.log('Gallery container found:', galleryContainer.className);
      console.log('Gallery images found:', images ? images.length : 0);
      console.log('Images array:', images);
      
      // Ensure images is an array
      let imageArray = images;
      if (typeof images === 'string') {
        imageArray = images.split(';').map(url => url.trim()).filter(url => url);
      } else if (!Array.isArray(images)) {
        imageArray = [];
      }
      
      if (imageArray && imageArray.length > 0) {
        galleryContainer.innerHTML = '';
        imageArray.forEach((imageUrl, index) => {
          // Skip empty or invalid URLs
          if (!imageUrl || imageUrl.trim() === '') {
            console.warn('Skipping empty image URL at index:', index);
            return;
          }
          
          const imgItem = document.createElement('div');
          imgItem.setAttribute('role', 'listitem');
          // Use correct class based on page type
          if (type === 'ss-products') {
            imgItem.className = 'w-dyn-item';
          } else {
            imgItem.className = 'collection-item w-dyn-item';
          }
          
          const img = document.createElement('img');
          img.src = imageUrl.trim();
          img.loading = 'lazy';
          img.alt = item.nameOfProduct || item.name;
          // Use correct image class based on page type
          if (type === 'ss-products') {
            img.className = 'image-100';
          } else {
            img.className = 'image-99';
          }
          
          // Add error handling for images
          img.onerror = function() {
            console.error('Failed to load image:', imageUrl);
            this.style.display = 'none';
          };
          
          img.onload = function() {
            console.log('Image loaded successfully:', imageUrl);
          };
          
          imgItem.appendChild(img);
          galleryContainer.appendChild(imgItem);
        });
        
        // Hide empty state (always hide, even if no images)
        const emptyStates = document.querySelectorAll('.collection-list-wrapper-2 .w-dyn-empty, .collection-list-3 .w-dyn-empty, .div-block-15 .w-dyn-empty, .w-dyn-list .w-dyn-empty');
        emptyStates.forEach(emptyState => {
          emptyState.style.display = 'none';
        });
        
        console.log('Gallery populated with', imageArray.length, 'images');
      } else {
        console.warn('No images found for gallery. Images value:', images);
        // Still hide empty state
        const emptyStates = document.querySelectorAll('.collection-list-wrapper-2 .w-dyn-empty, .collection-list-3 .w-dyn-empty, .div-block-15 .w-dyn-empty, .w-dyn-list .w-dyn-empty');
        emptyStates.forEach(emptyState => {
          emptyState.style.display = 'none';
        });
      }
    } else {
      console.warn('Gallery container not found. Tried selectors:', selectors);
      // Try to find any w-dyn-items in div-block-15
      const divBlock15 = document.querySelector('.div-block-15');
      if (divBlock15) {
        console.log('Found .div-block-15, searching for gallery inside...');
        const allDynItems = divBlock15.querySelectorAll('.w-dyn-items');
        console.log('Found .w-dyn-items elements:', allDynItems.length);
        allDynItems.forEach((el, i) => {
          console.log(`  ${i}:`, el.className, el.parentElement?.className);
        });
      }
    }
    
    // Update meta tags for SEO
    updateMetaTags(item, type);
  }

  /**
   * Update meta tags for SEO
   */
  function updateMetaTags(item, type) {
    const title = item.nameOfProduct || item.name;
    const description = extractTextFromHTML(item.projectInfo || '') || `${title} - Devasya Group`;
    
    // Update document title
    document.title = `${title} | Devasya Group`;
    
    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
    
    // Update OG tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);
    
    // Update OG image if available
    const imageUrl = item.featuredImage || item.cardImage;
    if (imageUrl) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', imageUrl);
    }
  }

  /**
   * Extract plain text from HTML
   */
  function extractTextFromHTML(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Initialize when DOM is ready
  initCMS();

  // Export for global access if needed
  window.DevasyaCMS = {
    getData: () => cmsData,
    getItemBySlug: (slug, type) => {
      if (type === 'bars') {
        return cmsData.brightBars.find(b => b.slug === slug);
      } else if (type === 'ss-products') {
        return cmsData.ssProducts.find(p => p.slug === slug);
      }
      return null;
    }
  };

})();

