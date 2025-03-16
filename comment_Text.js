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

    // Create container for the anchor if it doesn't exist
    let container = anchor.closest('.anchor-container');
    if (!container) {
      // Create a new container 
      container = document.createElement('div');
      container.className = 'anchor-container rtl'; // Use RTL for Arabic
      
      // Replace the anchor with our container and move the anchor inside
      anchor.parentNode.insertBefore(container, anchor);
      container.appendChild(anchor);
    }

    // Check if we already have a comments-count span
    let countSpan = container.querySelector('.comments-count');

    if (countSpan) {
      // Update existing count
      countSpan.textContent = `(${formatCount(count)})`;
      if (isNewData) {
        // Add animation class for newly fetched data
        countSpan.classList.remove('updated');
        void countSpan.offsetWidth; // Force reflow to restart animation
        countSpan.classList.add('updated');
      }
    } else {
      // Create new count element
      countSpan = document.createElement('span');
      countSpan.className = 'comments-count';
      countSpan.textContent = `(${formatCount(count)})`;

      // Insert after the anchor
      container.appendChild(countSpan);

      if (isNewData) {
        countSpan.classList.add('updated');
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

  // Fix any existing comment counts and move them next to the title
  function fixExistingCommentCounts() {
    // Move any existing comment counts to their anchors
    const existingCounts = document.querySelectorAll('.comments-count');
    existingCounts.forEach(count => {
      const row = count.closest('tr, td');
      if (!row) return;

      // Find the anchor in the same row
      const anchor = row.querySelector('a.ajaxbtn');
      if (!anchor) return;

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
    });
  }

  // Main initialization function
  function initialize() {
    // Add styles
    addStyles();

    // Process initial anchors
    processAnchors();

    // Fix any existing counts
    fixExistingCommentCounts();

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
    document.addEventListener('DOMContentLoaded', () => {
      initialize();
    });
  } else {
    initialize();
  }
})();
