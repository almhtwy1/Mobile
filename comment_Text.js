// ==UserScript==
// @name         Khamsat Comment Count Fast Updater - Consistent Position
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  تحديث سريع لعدد التعليقات مع موضع ثابت في جميع أحجام الشاشات
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
        transition: all 0.3s ease;
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
      
      /* Consistent styles for all screen sizes */
      .comments-count {
        display: inline-block;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        background-color: rgba(255, 69, 0, 0.1);
        color: rgb(255, 69, 0);
        font-weight: bold;
        margin-right: 4px;
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
      if (num > 99) {
        return '99+'; // Simplify if count is large
      }
      return num;
    };
    
    // Find the details list element
    const row = anchor.closest('tr') || anchor.closest('.row');
    if (!row) return;
    
    const detailsList = row.querySelector('.details-list');
    if (!detailsList) return;
    
    // Look for existing comment count
    let existingSpan = detailsList.querySelector('span.comments-count');
    
    if (existingSpan) {
      // Update existing count
      existingSpan.textContent = ` (${formatCount(count)} تعليقات)`;
      if (isNewData) {
        // Add animation class for newly fetched data
        existingSpan.classList.remove('updated');
        void existingSpan.offsetWidth; // Force reflow to restart animation
        existingSpan.classList.add('updated');
      }
    } else {
      // Create new count element
      const newSpan = document.createElement('span');
      newSpan.className = 'comments-count';
      newSpan.textContent = ` (${formatCount(count)} تعليقات)`;
      
      // Always append to details list
      detailsList.appendChild(newSpan);
      
      if (isNewData) {
        newSpan.classList.add('updated');
      }
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

  // Main initialization function
  function initialize() {
    // Add styles
    addStyles();
    
    // Process initial anchors
    processAnchors();
    
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
        setTimeout(() => processAnchors(), 500);
      });
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
