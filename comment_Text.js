// ==UserScript==
// @name         Khamsat Comment Count Fast Updater - Mobile Friendly
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  تحديث سريع لعدد التعليقات مع دعم محسن للجوال وعرض بجانب العنوان
// @author       Your Name
// @match        https://khamsat.com/community/requests*
// @grant        none
// ==/UserScript==

(async function () {
  'use strict';

  // Helper function to detect mobile devices
  const isMobile = () => {
    return window.innerWidth <= 767;
  };

  // Add styles for better mobile experience
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Base styles for comment count */
      .comments-count {
        color: rgb(255, 69, 0);
        font-weight: bold;
        margin-right: 5px;
        margin-left: 5px;
        transition: all 0.3s ease;
        display: inline-block;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        background-color: rgba(255, 69, 0, 0.1);
      }

      /* Animation for when comment count updates */
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      .comments-count.updated {
        animation: pulse 1s ease-in-out;
      }

      /* Make it more compact on very small screens */
      @media screen and (max-width: 375px) {
        .comments-count {
          font-size: 11px;
          padding: 1px 4px;
        }
      }
      
      /* Style for the anchor container */
      .anchor-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      
      /* RTL support for the container */
      .anchor-container.rtl {
        direction: rtl;
        text-align: right;
      }
      
      /* Position comment count correctly */
      h3 .comments-count {
        display: inline-block;
        vertical-align: middle;
        margin: 0 5px;
      }
      
      /* Ensure count is always visible */
      .comments-count {
        z-index: 5;
      }
    `;
    document.head.appendChild(style);
  };

  // Process an individual anchor to update its comment count
  async function updateAnchor(anchor) {
    try {
      const href = anchor.getAttribute('href');
      const url = new URL(href, window.location.origin);

      // Cache handling
      const cacheKey = `comment_count_${url.pathname}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      const cacheTimestamp = parseInt(sessionStorage.getItem(`${cacheKey}_timestamp`) || '0');
      const currentTime = Date.now();
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache expiry

      // Use cached data if available and not expired
      if (cachedData && (currentTime - cacheTimestamp < cacheExpiry)) {
        updateCountDisplay(anchor, cachedData);
        return;
      }

      const response = await fetch(url.href);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const header = doc.querySelector('div.card-header.bg-white h3');

      if (!header) {
        console.warn('Comment header not found for', url.href);
        return;
      }

      const match = header.textContent.match(/\((\d+)/);
      if (match) {
        const count = match[1];

        // Update count display
        updateCountDisplay(anchor, count, true);

        // Cache the count
        sessionStorage.setItem(cacheKey, count);
        sessionStorage.setItem(`${cacheKey}_timestamp`, currentTime.toString());
      } else {
        console.warn('No comment count found in header for', url.href);
      }
    } catch (error) {
      console.error('Error processing anchor:', anchor, error);
    }
  }

  // Update the comment count display in the DOM
  function updateCountDisplay(anchor, count, isNewData = false) {
    // Arabic number formatter
    const formatCount = (num) => {
      if (isMobile() && num > 99) {
        return '99+'; // Simplify for mobile if count is large
      }
      return num;
    };

    // Find the h3 parent that contains the anchor
    const h3Element = anchor.closest('h3');
    if (!h3Element) return;
    
    // Find the category icons span
    let categoryIconsSpan = h3Element.querySelector('span[style*="inline-flex"]');
    
    // Create count element if it doesn't exist
    let countSpan = document.querySelector(`.comments-count[data-href="${anchor.getAttribute('href')}"]`);
    
    if (!countSpan) {
      // Create new count element
      countSpan = document.createElement('span');
      countSpan.className = 'comments-count';
      countSpan.setAttribute('data-href', anchor.getAttribute('href'));
      countSpan.textContent = `(${formatCount(count)})`;
      
      if (categoryIconsSpan) {
        // If category icons span exists, insert count before it
        h3Element.insertBefore(countSpan, categoryIconsSpan);
      } else {
        // Create or find container for the anchor if category span doesn't exist
        let container = anchor.closest('.anchor-container');
        if (!container) {
          // Create a new container 
          container = document.createElement('div');
          container.className = 'anchor-container rtl'; // Use RTL for Arabic
          
          // Replace the anchor with our container and move the anchor inside
          anchor.parentNode.insertBefore(container, anchor);
          container.appendChild(anchor);
        }
        
        // Insert after the anchor
        container.appendChild(countSpan);
      }
    } else {
      // Update existing count
      countSpan.textContent = `(${formatCount(count)})`;
      
      // Ensure it's in the correct position
      if (categoryIconsSpan && countSpan.nextSibling !== categoryIconsSpan && !categoryIconsSpan.contains(countSpan)) {
        // Move it to be before the category icons span
        h3Element.insertBefore(countSpan, categoryIconsSpan);
      }
    }
    
    // Apply animation if new data
    if (isNewData) {
      countSpan.classList.remove('updated');
      void countSpan.offsetWidth; // Force reflow to restart animation
      countSpan.classList.add('updated');
    }
  }

  // Process all anchors in a container
  function processAnchors(root = document) {
    const anchors = root.querySelectorAll('a.ajaxbtn:not([data-processed])');
    anchors.forEach(anchor => {
      anchor.setAttribute('data-processed', 'true');
      updateAnchor(anchor);
    });
  }

  // Fix any existing comment counts and move them to the right place
  function fixExistingCommentCounts() {
    // Move any existing comment counts to their anchors
    const existingCounts = document.querySelectorAll('.comments-count');
    existingCounts.forEach(count => {
      const row = count.closest('tr, td');
      if (!row) return;

      // Find the anchor in the same row
      const anchor = row.querySelector('a.ajaxbtn');
      if (!anchor) return;
      
      // Find the h3 element that contains the anchor
      const h3Element = anchor.closest('h3');
      if (!h3Element) return;
      
      // Find category icons span if it exists
      const categoryIconsSpan = h3Element.querySelector('span[style*="inline-flex"]');
      
      // Set data-href attribute to help with identification
      if (!count.getAttribute('data-href')) {
        count.setAttribute('data-href', anchor.getAttribute('href'));
      }
      
      if (categoryIconsSpan) {
        // Insert before the category icons span
        h3Element.insertBefore(count, categoryIconsSpan);
      } else {
        // Check if anchor already has a container
        let container = anchor.closest('.anchor-container');
        if (!container) {
          // Create a new container
          container = document.createElement('div');
          container.className = 'anchor-container rtl';
          
          // Replace the anchor with our container and move the anchor inside
          anchor.parentNode.insertBefore(container, anchor);
          container.appendChild(anchor);
        }
        
        // Move the count to the container
        container.appendChild(count);
      }
    });
  }

  // Main initialization function
  function initialize() {
    // Add styles
    addStyles();

    // Wait for the category script to initialize first
    setTimeout(() => {
      // Process initial anchors
      processAnchors();

      // Fix any existing counts
      fixExistingCommentCounts();

      // Listen for category icons being added
      const categoryObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              // If this is a span added by category script
              if (node.nodeType === Node.ELEMENT_NODE && 
                  node.tagName === 'SPAN' && 
                  node.style.display === 'inline-flex') {
                
                // Find the related anchor
                const h3Element = node.closest('h3');
                if (!h3Element) return;
                
                const anchor = h3Element.querySelector('a.ajaxbtn');
                if (!anchor) return;
                
                // Find if we have a comment count for this anchor
                const href = anchor.getAttribute('href');
                const commentCount = document.querySelector(`.comments-count[data-href="${href}"]`);
                
                if (commentCount) {
                  // Move the comment count to be before the category span
                  h3Element.insertBefore(commentCount, node);
                } else {
                  // If we don't have a count yet, process the anchor to get one
                  updateAnchor(anchor);
                }
              }
            });
          }
        });
      });
      
      // Observe changes to the forum table
      const forumTable = document.querySelector('#forums_table');
      if (forumTable) {
        categoryObserver.observe(forumTable, { 
          childList: true, 
          subtree: true 
        });
      }

      // MutationObserver to handle dynamically added topics
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            if (node.matches && node.matches('a.ajaxbtn:not([data-processed])')) {
              node.setAttribute('data-processed', 'true');
              updateAnchor(node);
            } else {
              processAnchors(node);
            }
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Listen for the "عرض المواضيع الأقدم" button
      const loadMoreButton = document.getElementById('community_loadmore_btn');
      if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
          // Delay to allow new content to be inserted into DOM
          setTimeout(() => {
            processAnchors();
            fixExistingCommentCounts();
          }, 1000);
        });
      }
    }, 500); // Wait 500ms for category script to run first
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initialize();
    });
  } else {
    initialize();
  }
})();
