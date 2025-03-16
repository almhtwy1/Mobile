// ==UserScript==
// @name         Titles Cache Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.4
// @description  اظهار مسمى المشتري (أصحاب المواضيع فقط) - نسخة محسنة للجوال
// @author       Your Name
// @match        https://khamsat.com/community/requests
// @icon         https://khamsat.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Helper function to detect mobile devices
  const isMobile = () => {
    return window.innerWidth <= 767;
  };

  // Add styles for better mobile experience
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Styles for both mobile and desktop */
      .user-title {
        color: #007bff;
        font-weight: bold;
        margin-right: 5px;
        display: inline-block;
        transition: all 0.3s ease;
      }
      
      /* Mobile-specific styles */
      @media screen and (max-width: 767px) {
        .user-title {
          display: block;
          margin-top: 3px;
          margin-bottom: 3px;
          font-size: 12px;
          background-color: rgba(0, 123, 255, 0.1);
          padding: 2px 6px;
          border-radius: 12px;
          color: #007bff;
          max-width: fit-content;
        }
      }
    `;
    document.head.appendChild(style);
  };

  if (location.href.includes('/community/requests')) {
    // Add styles
    addStyles();

    // Initialize cache
    const C = JSON.parse(localStorage.getItem('titlesCache') || '{}');
    const Q = [];
    let A = 0;

    async function pr(l, u) {
      A++;
      try {
        let s = await fetch(u, { credentials: 'include' });
        if (!s.ok) throw new Error();
        let t = await s.text(),
          p = new DOMParser().parseFromString(t, 'text/html'),
          d = p.querySelector('ul.details-list.pe-0 li');
        
        if (d) {
          // Extract the actual title text properly
          let T = d.textContent.trim();
          // Store the title as a string, not an object
          C[u] = T;
          ad(l, T);
          localStorage.setItem('titlesCache', JSON.stringify(C));
        }
      } catch (e) {
        console.error('Error fetching title:', e);
        Q.push(() => pr(l, u));
      } finally {
        A--;
        pq();
      }
    }

    function ad(l, t) {
      // Don't add if already exists or if title is not valid
      if (!l.querySelector('.user-title') && t && typeof t === 'string' && t !== '[object Object]') {
        let s = document.createElement('span');
        
        // Different style and placement based on device
        if (isMobile()) {
          s.textContent = t;
          s.className = 'user-title';
          
          // For mobile, add after the link's parent li element
          const parentLi = l.closest('li');
          if (parentLi) {
            parentLi.appendChild(s);
          } else {
            l.parentNode.appendChild(s);
          }
        } else {
          s.textContent = ` (${t})`;
          s.className = 'user-title';
          l.appendChild(s);
        }
      }
    }

    function pq() {
      while (A < 5 && Q.length) Q.shift()();
    }

    function uT() {
      // ======== IMPORTANT CHANGE ========
      // Target only topic owners (right side users) and not "آخر تفاعل" users
      document.querySelectorAll('tr').forEach(row => {
        // Find the rightmost column in each row (topic owner column)
        const lastCell = row.querySelector('td:last-child') || row.querySelector('td.details-td');
        if (!lastCell) return;
        
        // Get only the main user link, not the "آخر تفاعل" links
        const userLinks = lastCell.querySelectorAll('a.user');
        
        // Process only the first user link in the cell (the topic owner)
        if (userLinks.length > 0) {
          const a = userLinks[0];
          
          // Make sure we're not processing "آخر تفاعل" users by checking for clock icon nearby
          const isLastActivity = a.closest('li') && a.closest('li').querySelector('i.fa-clock-o');
          if (isLastActivity) return;
          
          // Skip if already processed
          if (a.querySelector('.user-title') || a.getAttribute('data-processed')) return;
          
          // Mark as processed to avoid duplicate processing
          a.setAttribute('data-processed', 'true');
          
          let href = a.getAttribute('href');
          // Make sure we have the full URL
          let h = href.startsWith('http') ? href : `https://khamsat.com${href}`;
          
          // Check if cached title is valid before using it
          if (C[h] && typeof C[h] === 'string' && C[h] !== '[object Object]') {
            ad(a, C[h]);
          } else {
            // If the cached title is invalid, remove it and fetch again
            if (C[h]) {
              delete C[h];
              localStorage.setItem('titlesCache', JSON.stringify(C));
            }
            Q.push(() => pr(a, h));
          }
        }
      });
      pq();
      
      // Log for debugging
      console.log('Titles updated - processed ' + document.querySelectorAll('[data-processed="true"]').length + ' users');
    }

    // Clear invalid entries from cache on initial load
    for (const key in C) {
      if (typeof C[key] !== 'string' || C[key] === '[object Object]') {
        delete C[key];
      }
    }
    localStorage.setItem('titlesCache', JSON.stringify(C));

    // Initial run
    window.addEventListener('load', uT);
    
    // Also run when content might change (like infinite scroll)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          uT();
        }
      });
    });
    
    // Observe the table for new rows or content changes
    const tableContainer = document.querySelector('#forums_table');
    if (tableContainer) {
      observer.observe(tableContainer, {
        childList: true,
        subtree: true
      });
    }
    
    // Observe the "Load More" button specifically
    const loadMoreButton = document.querySelector('#community_loadmore_btn');
    if (loadMoreButton) {
      // Add a direct click event listener to ensure we catch the action
      loadMoreButton.addEventListener('click', function() {
        // Wait a bit for the content to load
        setTimeout(uT, 1000);
        // And check again after a longer period to catch any delayed loading
        setTimeout(uT, 3000);
      });
      
      // Also observe the button for changes (like being disabled/re-enabled)
      observer.observe(loadMoreButton, {
        attributes: true,
        childList: true
      });
    }
    
    // Create a more robust observer for the entire content area to catch any updates
    const contentObserver = new MutationObserver((mutations) => {
      setTimeout(uT, 500);
    });
    
    // Observe the main content container for any changes
    const mainContent = document.querySelector('.forum-page, .forums-section');
    if (mainContent) {
      contentObserver.observe(mainContent, {
        childList: true,
        subtree: true
      });
    }
    
    // Update style on window resize
    window.addEventListener('resize', () => {
      document.querySelectorAll('.user-title').forEach(title => {
        if (isMobile()) {
          if (title.parentNode.tagName === 'A') {
            // Move to parent li if on mobile
            const parentLi = title.parentNode.closest('li');
            if (parentLi && !parentLi.querySelector('.user-title')) {
              title.textContent = title.textContent.replace(/^\s*\(|\)\s*$/g, '');
              parentLi.appendChild(title);
            }
          }
        } else {
          if (title.parentNode.tagName === 'LI') {
            // Move back to anchor if on desktop
            const anchor = title.parentNode.querySelector('a.user');
            if (anchor && !anchor.querySelector('.user-title')) {
              title.textContent = ` (${title.textContent})`;
              anchor.appendChild(title);
            }
          }
        }
      });
    });
  }
})();
