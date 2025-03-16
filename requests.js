// ==UserScript==
// @name         عكس التعليقات ورفع التعليق - محسن للجوال
// @namespace    https://khamsat.com/
// @version      1.1
// @description  عكس التعليقات ورفع التعليق مع تجربة محسنة للجوال
// @author       Your Name
// @match        https://khamsat.com/community/requests/*
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
      /* Fixed comment form for mobile */
      @media screen and (max-width: 767px) {
        .comments-fixed-indicator {
          position: fixed;
          bottom: 80px;
          right: 20px;
          background-color: #007bff;
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          z-index: 100;
          cursor: pointer;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .comments-fixed-indicator.active {
          opacity: 1;
          transform: scale(1);
        }
        
        .comments-fixed-indicator:active {
          transform: scale(0.9);
        }
        
        /* Comment separator for better visibility */
        .discussion-item.comment {
          border-bottom: 1px solid #eee;
          position: relative;
          margin-bottom: 10px;
          padding-bottom: 10px;
        }
        
        /* Comment date better visibility */
        .meta--date {
          font-size: 11px;
          color: #777;
          margin-top: 5px;
        }
        
        /* Highlight most recent comments */
        .discussion-item.comment:first-child {
          background-color: rgba(0, 123, 255, 0.05);
          border-right: 3px solid #007bff;
          padding-right: 10px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Create a floating button to scroll to comment form on mobile
  const addFloatingCommentButton = () => {
    if (!isMobile()) return;
    
    const button = document.createElement('div');
    button.className = 'comments-fixed-indicator';
    button.innerHTML = '<i class="fas fa-comment-alt"></i>';
    
    button.addEventListener('click', () => {
      const commentForm = document.getElementById('add_comment');
      if (commentForm) {
        window.scrollTo({
          top: commentForm.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
    
    document.body.appendChild(button);
    
    // Show button when scrolling down
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const commentForm = document.getElementById('add_comment');
      if (!commentForm) return;
      
      const formRect = commentForm.getBoundingClientRect();
      
      // Show button when comment form is out of view (above viewport)
      if (formRect.bottom < 0) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
      
      lastScrollY = window.scrollY;
    });
  };

  // Load FontAwesome for icons
  const loadFontAwesome = () => {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
      document.head.appendChild(link);
    }
  };

  // Main functionality (reverse comments and move comment form)
  const processComments = () => {
    let repliesContainer = document.getElementById('post_replies');
    if (!repliesContainer) return;
    
    let commentsContainer = repliesContainer.querySelector('.comments');
    if (!commentsContainer) return;
    
    // Get all comments
    let comments = commentsContainer.querySelectorAll('.discussion-item.comment');
    if (comments.length === 0) return;
    
    // Move comment form above the comments section
    let commentForm = document.getElementById('add_comment');
    if (commentForm) {
      // For mobile, we keep the form at the top for better UX
      repliesContainer.parentNode.insertBefore(commentForm, repliesContainer);
      
      // Ensure the textarea is appropriate for mobile
      if (isMobile()) {
        const textarea = commentForm.querySelector('textarea');
        if (textarea) {
          textarea.style.minHeight = '100px';
          textarea.style.fontSize = '16px'; // Better size for mobile typing
        }
      }
    }
    
    // Sort comments by ID in descending order (newest first)
    Array.from(comments)
      .sort((a, b) => parseInt(b.getAttribute('data-id')) - parseInt(a.getAttribute('data-id')))
      .forEach(comment => {
        // Enhance comments for mobile view
        if (isMobile()) {
          // Add clearer timestamp format if needed
          const dateEl = comment.querySelector('.meta--date');
          if (dateEl && !dateEl.dataset.processed) {
            const originalDate = dateEl.textContent.trim();
            dateEl.dataset.processed = 'true';
            
            // If needed, you could format the date here for better mobile display
          }
        }
        
        // Re-append to container to change order
        commentsContainer.appendChild(comment);
      });
  };

  // Initialize
  const initialize = () => {
    // Add styles
    addStyles();
    
    // Load FontAwesome
    loadFontAwesome();
    
    // Process comments
    processComments();
    
    // Add floating button for mobile
    addFloatingCommentButton();
  };

  // Run on page load
  if (location.href.includes('/community/requests')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialize);
    } else {
      initialize();
    }
    
    // Also handle dynamic changes (like AJAX content loads)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          processComments();
        }
      });
    });
    
    // Start observing when content container is available
    window.addEventListener('load', () => {
      const contentContainer = document.querySelector('.discussion-list');
      if (contentContainer) {
        observer.observe(contentContainer, {
          childList: true,
          subtree: true
        });
      }
    });
  }
})();
