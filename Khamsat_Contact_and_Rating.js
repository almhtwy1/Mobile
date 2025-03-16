// ==UserScript==
// @name         Khamsat Contact & Rating Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.3
// @description  إضافة زر "اتصل بي" وعرض التقييمات للمعلقين في خمسات - نسخة محسنة للجوال
// @author       Your Name
// @match        https://khamsat.com/community/requests/*
// @icon         https://khamsat.com/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to detect mobile devices
    const isMobile = () => {
        return window.innerWidth <= 767;
    };

    // Add styles for better mobile experience
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Base styles for both mobile and desktop */
            .custom-contact-btn {
                padding: 4px 12px;
                font-size: 13px;
                border-radius: 20px;
                background-color: #4267B2;
                color: white;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
                margin-right: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .custom-contact-btn:hover {
                background-color: #365899;
                transform: translateY(-1px);
                box-shadow: 0 3px 6px rgba(0,0,0,0.15);
            }
            
            .custom-contact-btn i {
                font-size: 12px;
            }
            
            .rating-container {
                display: inline-flex;
                align-items: center;
                margin-right: 8px;
                background-color: #f5f5f5;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 12px;
            }
            
            .rating-stars {
                color: #FFC107;
                margin-left: 4px;
            }
            
            .rating-text {
                color: #555;
                font-weight: 600;
            }
            
            /* Mobile-specific styles */
            @media screen and (max-width: 767px) {
                .meta--user-mobile-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-top: 5px;
                }
                
                .meta--user-mobile-row {
                    display: flex;
                    align-items: center;
                    margin-top: 5px;
                    flex-wrap: wrap;
                    width: 100%;
                    justify-content: space-between;
                }
                
                .custom-contact-btn {
                    padding: 3px 10px;
                    font-size: 12px;
                    margin-bottom: 4px;
                    order: 2; /* Force to appear second/left in RTL */
                }
                
                .rating-container {
                    margin-bottom: 4px;
                    margin-right: 0;
                    order: 1; /* Force to appear first/right in RTL */
                }
                
                /* Fix for overlapping elements in mobile view */
                .discussion-item.comment .meta,
                .comment-item .meta {
                    flex-wrap: wrap;
                }
            }
            
            /* Positioning for desktop */
            .meta--user {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
            }
            
            /* Fixed positioning to ensure left/right alignment */
            .meta--user a.user {
                order: 1; /* Username first */
            }
            
            .rating-container {
                order: 2; /* Rating second, right after username */
            }
            
            .custom-contact-btn.desktop-position {
                order: 3; /* Contact button last (far left in RTL) */
            }
            
            /* Loading animation */
            .rating-loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(0,0,0,0.1);
                border-top: 2px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 5px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    };

    // Process each comment
    const processComment = (comment) => {
        // Only process if not already processed
        if (comment.dataset.processed) return;
        
        const userLink = comment.querySelector('.meta--user a');
        const userProfile = userLink ? userLink.href : null;

        if (userProfile) {
            // Create rating container with modern design
            const ratingCont = document.createElement('span');
            ratingCont.className = 'rating-container';
            ratingCont.style.display = 'none';
            
            // Create stars container with icon
            const stars = document.createElement('span');
            stars.className = 'rating-stars';
            stars.innerHTML = '<i class="fas fa-star"></i>';
            ratingCont.appendChild(stars);
            
            // Create rating text
            const ratingTxt = document.createElement('span');
            ratingTxt.className = 'rating-text';
            ratingTxt.textContent = '0.0';
            ratingCont.appendChild(ratingTxt);
            
            // Create contact button with icon
            const btn = document.createElement('a');
            btn.href = '#';
            btn.className = 'custom-contact-btn';
            btn.innerHTML = '<i class="fas fa-envelope"></i> <span>تواصل</span>';
            btn.style.display = 'none';
            
            // Add elements to DOM based on device type
            const userMeta = comment.querySelector('.meta--user');
            
            if (userMeta) {
                if (isMobile()) {
                    // For mobile: Create a wrapper for better layout
                    let wrapper = comment.querySelector('.meta--user-mobile-wrapper');
                    
                    if (!wrapper) {
                        wrapper = document.createElement('div');
                        wrapper.className = 'meta--user-mobile-wrapper';
                        
                        // Create a row for the rating and contact button with space-between
                        const row = document.createElement('div');
                        row.className = 'meta--user-mobile-row';
                        
                        // Add rating to the right side (RTL: will appear on right)
                        row.appendChild(ratingCont);
                        
                        // Add button to the left side (RTL: will appear on left)
                        row.appendChild(btn);
                        
                        wrapper.appendChild(row);
                        userMeta.appendChild(wrapper);
                    }
                } else {
                    // Restructure the userMeta to be flex with space-between
                    userMeta.style.display = 'flex';
                    userMeta.style.justifyContent = 'space-between';
                    userMeta.style.width = '100%';
                    userMeta.style.alignItems = 'center';
                    
                    // Get the username element
                    const usernameEl = userMeta.querySelector('a.user');
                    if (usernameEl) {
                        // Move the username to the start
                        userMeta.insertBefore(usernameEl, userMeta.firstChild);
                    }
                    
                    // Add rating after username (will be in the middle)
                    userMeta.appendChild(ratingCont);
                    
                    // Add contact button at the end (will be on the left in RTL layout)
                    btn.classList.add('desktop-position');
                    userMeta.appendChild(btn);
                }
            }
            
            // Track if data has been loaded
            let loaded = false;
            let loading = false;
            
            // Handle click event
            comment.addEventListener('click', e => {
                // Ignore clicks on contact button or rating
                if (e.target.closest('.custom-contact-btn') || e.target.closest('.rating-container')) {
                    return;
                }
                
                if (!loaded && !loading) {
                    loading = true;
                    
                    // Show loading indicator
                    ratingCont.style.display = 'inline-flex';
                    stars.innerHTML = '<span class="rating-loading"></span>';
                    ratingTxt.textContent = 'جاري التحميل...';
                    
                    const username = userProfile.split('/').pop();
                    
                    // Fetch user data
                    fetch(`https://khamsat.com/user/${username}`, {
                        credentials: 'include'
                    })
                    .then(res => res.text())
                    .then(html => {
                        const doc = new DOMParser().parseFromString(html, 'text/html');
                        const firstService = doc.querySelector('.service-card a.url-product');
                        const reviewsEl = doc.querySelector('.list.col-6 .c-list--rating');
                        
                        if (firstService && reviewsEl) {
                            // Get user ID from first service URL
                            const userId = firstService.href.split('/').slice(-1)[0].split('-')[0];
                            const contactUrl = `https://khamsat.com/message/new/${userId}`;
                            
                            // Get rating information
                            const ratingStr = reviewsEl.getAttribute('title') || '';
                            const reviewsCount = reviewsEl.querySelector('.info')
                                ? reviewsEl.querySelector('.info').textContent.trim().replace(/[()]/g, '')
                                : '';
                            
                            // Update contact button
                            btn.href = contactUrl;
                            
                            // Update rating display
                            stars.innerHTML = '<i class="fas fa-star"></i>';
                            ratingTxt.textContent = ` ${ratingStr} (${reviewsCount})`;
                            
                            // Show elements
                            ratingCont.style.display = 'inline-flex';
                            btn.style.display = 'inline-flex';
                            
                            loaded = true;
                        } else {
                            // Hide if no data found
                            ratingCont.style.display = 'none';
                        }
                    })
                    .catch(err => {
                        console.error('Error:', err);
                        ratingCont.style.display = 'none';
                        loaded = false;
                    })
                    .finally(() => {
                        loading = false;
                    });
                } else if (loaded) {
                    // Show elements if data is already loaded
                    ratingCont.style.display = 'inline-flex';
                    btn.style.display = 'inline-flex';
                }
            });
            
            // Mark as processed
            comment.dataset.processed = 'true';
        }
    };

    // Initialize the script
    const initialize = () => {
        // Add custom styles
        addStyles();
        
        // Process existing comments
        document.querySelectorAll('.discussion-item.comment, .comment-item').forEach(processComment);
        
        // Set up observer for new comments
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.discussion-item.comment, .comment-item')) {
                            processComment(node);
                        }
                        // Also check for comments within added nodes
                        node.querySelectorAll('.discussion-item.comment, .comment-item').forEach(processComment);
                    }
                });
            });
        });
        
        // Observe the comments container
        const commentsContainer = document.querySelector('.comments, .discussion-list');
        if (commentsContainer) {
            observer.observe(commentsContainer, {
                childList: true,
                subtree: true
            });
        }
        
        // Re-check layout on window resize
        window.addEventListener('resize', () => {
            document.querySelectorAll('.discussion-item.comment, .comment-item').forEach(comment => {
                // Reset and reprocess on layout change
                if (comment.dataset.processed) {
                    const ratingCont = comment.querySelector('.rating-container');
                    const btn = comment.querySelector('.custom-contact-btn');
                    
                    if (ratingCont && btn) {
                        if (isMobile()) {
                            // Move to mobile layout if needed
                            let wrapper = comment.querySelector('.meta--user-mobile-wrapper');
                            if (!wrapper) {
                                const userMeta = comment.querySelector('.meta--user');
                                if (userMeta) {
                                    wrapper = document.createElement('div');
                                    wrapper.className = 'meta--user-mobile-wrapper';
                                    
                                    const row = document.createElement('div');
                                    row.className = 'meta--user-mobile-row';
                                    
                                    // Add rating to right side and button to left side
                                    row.appendChild(ratingCont);
                                    row.appendChild(btn);
                                    
                                    wrapper.appendChild(row);
                                    userMeta.appendChild(wrapper);
                                    
                                    // Remove desktop positioning class
                                    btn.classList.remove('desktop-position');
                                    
                                    // Reset desktop styling
                                    userMeta.style.display = '';
                                    userMeta.style.justifyContent = '';
                                    userMeta.style.width = '';
                                    userMeta.style.alignItems = '';
                                }
                            }
                        } else {
                            // Move to desktop layout if needed
                            const wrapper = comment.querySelector('.meta--user-mobile-wrapper');
                            if (wrapper) {
                                const userMeta = comment.querySelector('.meta--user');
                                
                                if (userMeta) {
                                    // Restructure for desktop layout
                                    userMeta.style.display = 'flex';
                                    userMeta.style.justifyContent = 'space-between';
                                    userMeta.style.width = '100%';
                                    userMeta.style.alignItems = 'center';
                                    
                                    // Get the username element
                                    const usernameEl = userMeta.querySelector('a.user');
                                    if (usernameEl) {
                                        // Move the username to the start
                                        userMeta.insertBefore(usernameEl, userMeta.firstChild);
                                    }
                                    
                                    userMeta.appendChild(ratingCont);
                                    
                                    // Add desktop positioning class
                                    btn.classList.add('desktop-position');
                                    userMeta.appendChild(btn);
                                    
                                    wrapper.remove();
                                }
                            }
                        }
                    }
                }
            });
        });
    };

    // Start script when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
