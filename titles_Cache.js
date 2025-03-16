// ==UserScript==
// @name         Titles Cache Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.2
// @description  اظهار مسمى المشتري - نسخة محسنة للجوال
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
      document.querySelectorAll('td.details-td ul.details-list li a.user, .meta--user a.user').forEach(a => {
        let h = `https://khamsat.com${a.getAttribute('href')}`;
        
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
      });
      pq();
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
