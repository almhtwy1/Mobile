// ==UserScript==
// @name         عكس التعليقات ورفع التعليق - محسن للجوال
// @namespace    https://khamsat.com/
// @version      1.2
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
      /* Mobile specific styles */
      @media screen and (max-width: 767px) {
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
      }
    `;
    document.head.appendChild(style);
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
        // Re-append to container to change order
        commentsContainer.appendChild(comment);
      });
  };

  // Initialize
  const initialize = () => {
    // Add styles
    addStyles();

    // Process comments
    processComments();
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
