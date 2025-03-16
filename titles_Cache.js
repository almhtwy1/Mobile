// ==UserScript==
// @name         Titles Cache Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.5
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
      // First, clean up any incorrect user titles in the left column
      document.querySelectorAll('tr').forEach(row => {
        // Find the left cell (which should not have user titles)
        const leftCell = row.querySelector('td:last-child');
        if (leftCell) {
          // Remove any user titles from last activity users
          const leftUserTitles = leftCell.querySelectorAll('.user-title');
          leftUserTitles.forEach(title => title.remove());
        }
      });
      
      // Now process only the topic creators (users on the right side)
      document.querySelectorAll('tr').forEach(row => {
        // Check if this is a proper topic row
        if (!row.querySelector('td')) return;
        
        // Find the right cell where topic creator is
        const rightCell = Array.from(row.querySelectorAll('td')).find(cell => {
          // The rightmost cell with the topic title and creator
          return cell.querySelector('a.ajaxbtn') || 
                 cell.classList.contains('details-td') ||
                 cell.classList.contains('forum-topic');
        });
        
        if (!rightCell) return;
        
        // Find only the main user link (topic creator)
        const userLinks = rightCell.querySelectorAll('a.user');
        if (userLinks.length === 0) return;
        
        // Get the first user link (should be the topic creator)
        const userLink = userLinks[0];
        
        // Skip if already processed or has title
        if (userLink.getAttribute('data-processed') || userLink.querySelector('.user-title')) return;
        
        // Double-check: make sure this is not a "last activity" user
        if (userLink.closest('li') && userLink.closest('li').querySelector('i.fa-clock-o')) return;
        
        // Mark as processed
        userLink.setAttribute('data-processed', 'true');
        
        // Get user profile URL
        let href = userLink.getAttribute('href');
        let h = href.startsWith('http') ? href : `https://khamsat.com${href}`;
        
        // Check cache or fetch
        if (C[h] && typeof C[h] === 'string' && C[h] !== '[object Object]') {
          ad(userLink, C[h]);
        } else {
          if (C[h]) {
            delete C[h];
            localStorage.setItem('titlesCache', JSON.stringify(C));
          }
          Q.push(() => pr(userLink, h));
        }
      });
      
      pq();
      console.log('Titles updated - processed topic creators only');
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
