// ==UserScript==
// @name         Khamsat Request Expander Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.1
// @description  توسيع تفاصيل طلبات خمسات مع إمكانية الرد السريع - مناسب للجوال
// @author       Your Name
// @match        https://khamsat.com/community/requests*
// @icon         https://khamsat.com/favicon.ico
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Add styles with mobile responsiveness
    const styleTxt = `
/* Base Styles */
.request-details-container { 
    width: 100%; 
    box-sizing: border-box; 
    padding: 10px; 
    background-color: #f8f9fa; 
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.request-content-wrapper { 
    display: flex; 
    flex-direction: row;
    gap: 20px; 
}

.request-details { 
    flex: 6; 
    text-align: right;
    overflow-wrap: break-word;
    word-wrap: break-word;
}

.request-details img {
    max-width: 100%;
    height: auto;
}

.request-comment-form { 
    flex: 4;
}

.request-comment-form textarea { 
    width: 100%; 
    height: 100px; 
    box-sizing: border-box; 
    resize: vertical; 
    border: 1px solid #ddd; 
    border-radius: 4px; 
    padding: 8px; 
    margin-bottom: 8px;
    font-family: inherit;
}

.request-comment-form button[type="submit"],
.request-comment-form input[type="submit"] {
    padding: 8px 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.request-comment-form button[type="submit"]:hover,
.request-comment-form input[type="submit"]:hover {
    background-color: #218838;
}

/* Highlight for expanded rows */
tr.forum_post.expanded {
    background-color: #f0f8ff !important;
}

/* Loading indicator */
.loading-indicator {
    text-align: center;
    padding: 20px;
    color: #666;
}

.loading-indicator i {
    margin-left: 10px;
    animation: spin 1s infinite linear;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Mobile styles */
@media screen and (max-width: 767px) {
    .request-content-wrapper {
        flex-direction: column;
        gap: 15px;
    }
    
    .request-details, 
    .request-comment-form {
        flex: 1;
        width: 100%;
    }
    
    .request-comment-form textarea {
        height: 80px;
    }
    
    /* Adjust form elements spacing for mobile */
    .request-comment-form .form-group {
        margin-bottom: 10px;
    }
    
    /* Make buttons easier to tap on mobile */
    .request-comment-form button[type="submit"],
    .request-comment-form input[type="submit"] {
        padding: 10px 16px;
        width: 100%;
        font-size: 16px;
    }
    
    /* Typography adjustments for mobile */
    .request-details {
        font-size: 14px;
        line-height: 1.4;
    }
    
    /* Enhance tap targets for checkboxes */
    .request-comment-form input[type="checkbox"] {
        transform: scale(1.2);
        margin-left: 5px;
    }
    
    /* Better layout for labels on mobile */
    .request-comment-form label {
        display: block;
        margin-bottom: 5px;
    }
}

/* Visual indicator for clickable rows */
tr.forum_post {
    position: relative;
    transition: background-color 0.2s ease;
}

tr.forum_post:hover {
    background-color: #f5f5f5;
}

tr.forum_post:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.5;
    pointer-events: none;
    transition: transform 0.3s ease;
}

tr.forum_post.expanded:after {
    transform: translateY(-50%) rotate(180deg);
}

/* Mobile-specific enhancements */
@media screen and (max-width: 480px) {
    tr.forum_post:after {
        left: 5px;
        width: 16px;
        height: 16px;
    }
    
    .request-details-container {
        padding: 8px;
    }
}
`;
    const sEl = document.createElement('style');
    sEl.textContent = styleTxt;
    document.head.appendChild(sEl);

    // Load request details
    const loadDetails = url =>
        new Promise((res, rej) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: ({ responseText }) => {
                    const doc = new DOMParser().parseFromString(responseText, 'text/html');
                    res({ 
                        body: doc.querySelector('.card-body article'), 
                        form: doc.querySelector('form#add_comment, #add_comment form') 
                    });
                },
                onerror: rej,
            });
        });

    // Create details row
    const createDetailsRow = (data, colspan) => {
        const row = document.createElement('tr');
        row.className = 'request-details-container';
        row.innerHTML = `<td colspan="${colspan}">
  <div class="request-content-wrapper">
    <div class="request-details">${data.body?.innerHTML || ''}</div>
    <div class="request-comment-form"></div>
  </div>
</td>`;
        if (data.form) {
            const fClone = data.form.cloneNode(true);
            fClone.querySelectorAll('.card-header, .c-form__hb').forEach(el => el.remove());
            
            // Improve mobile form layout
            const formGroups = fClone.querySelectorAll('.form-group, .mb-3, div > label');
            formGroups.forEach(group => {
                group.classList.add('mobile-form-group');
            });
            
            // Fix checkbox IDs to prevent conflicts
            const confirmInput = fClone.querySelector('input#confirm');
            if (confirmInput) {
                const newId = 'confirm_' + Date.now();
                confirmInput.id = newId;
                fClone.querySelector(`label[for="confirm"]`)?.setAttribute('for', newId);
            }
            
            // Add form submission handler
            fClone.querySelector('button[type="submit"], input[type="submit"]')?.addEventListener('click', async e => {
                e.preventDefault();
                
                // Get the submit button
                const submitBtn = e.target;
                const originalText = submitBtn.textContent || submitBtn.value;
                
                // Show loading state
                submitBtn.disabled = true;
                if (submitBtn.tagName === 'BUTTON') {
                    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> جاري الإرسال...';
                } else {
                    submitBtn.value = 'جاري الإرسال...';
                }
                
                try {
                    const formData = new URLSearchParams(new FormData(fClone)).toString();
                    await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: new URL(data.form.action, window.location.href).toString(),
                            data: formData,
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            onload: resolve,
                            onerror: reject
                        });
                    });
                    
                    // Reset form
                    fClone.querySelectorAll('textarea').forEach(ta => ta.value = '');
                    
                    // Show success message
                    const note = document.createElement('div');
                    note.textContent = 'تم إرسال التعليق بنجاح';
                    note.style.cssText = 'color: #28a745; margin-top: 10px; text-align: center; padding: 8px; background-color: #d4edda; border-radius: 4px;';
                    fClone.appendChild(note);
                    
                    // Remove success message after delay
                    setTimeout(() => note.remove(), 3000);
                } catch (error) {
                    console.error('Error in form submission', error);
                    
                    // Show error message
                    const errorNote = document.createElement('div');
                    errorNote.textContent = 'حدث خطأ أثناء إرسال التعليق';
                    errorNote.style.cssText = 'color: #721c24; margin-top: 10px; text-align: center; padding: 8px; background-color: #f8d7da; border-radius: 4px;';
                    fClone.appendChild(errorNote);
                    
                    // Remove error message after delay
                    setTimeout(() => errorNote.remove(), 3000);
                } finally {
                    // Restore button state
                    submitBtn.disabled = false;
                    if (submitBtn.tagName === 'BUTTON') {
                        submitBtn.textContent = originalText;
                    } else {
                        submitBtn.value = originalText;
                    }
                }
            });
            
            row.querySelector('.request-comment-form').appendChild(fClone);
        }
        return row;
    };

    // Create loading indicator
    const createLoadingIndicator = (colspan) => {
        const row = document.createElement('tr');
        row.className = 'loading-indicator';
        row.innerHTML = `<td colspan="${colspan}">جاري تحميل التفاصيل <i class="fas fa-spinner"></i></td>`;
        return row;
    };

    // Handle post click
    const handlePostClick = async e => {
        // Don't trigger expansion if clicking on links, buttons, etc.
        if (e.target.closest('a, button, input, textarea')) return;
        
        const post = e.currentTarget,
            link = post.querySelector('h3.details-head a.ajaxbtn');
        
        if (!link) return;
        
        // Toggle expanded state
        if (post.classList.toggle('expanded')) {
            // First add loading indicator
            const loadingRow = createLoadingIndicator(post.children.length);
            post.insertAdjacentElement('afterend', loadingRow);
            
            try {
                // Load the details
                const data = await loadDetails(link.href);
                
                // Replace loading indicator with content
                const detailsRow = createDetailsRow(data, post.children.length);
                loadingRow.replaceWith(detailsRow);
                
                // Scroll to show the details if not in view
                const isMobile = window.innerWidth <= 767;
                if (isMobile) {
                    // On mobile, scroll to the details
                    setTimeout(() => {
                        detailsRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                }
            } catch (error) {
                console.error(error);
                loadingRow.innerHTML = `<td colspan="${post.children.length}">حدث خطأ أثناء تحميل التفاصيل</td>`;
                loadingRow.style.color = '#721c24';
                loadingRow.style.backgroundColor = '#f8d7da';
                
                // Remove error message after delay
                setTimeout(() => {
                    post.classList.remove('expanded');
                    loadingRow.remove();
                }, 3000);
            }
        } else {
            // Remove details row
            post.nextElementSibling?.remove();
        }
    };

    // Add visual feedback for touch devices
    const addTouchFeedback = (element) => {
        element.addEventListener('touchstart', () => {
            element.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', () => {
            element.classList.remove('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchcancel', () => {
            element.classList.remove('touch-active');
        }, { passive: true });
    };

    // Attach listener to post
    const attachListener = post => {
        if (!post.dataset.listenerAttached) {
            post.style.cursor = 'pointer';
            post.addEventListener('click', handlePostClick);
            
            // Add touch feedback for mobile
            addTouchFeedback(post);
            
            post.dataset.listenerAttached = 'true';
        }
    };

    // Initialize mutation observer
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    node.matches('tr.forum_post') ? attachListener(node) : node.querySelectorAll('tr.forum_post').forEach(attachListener);
                }
            });
        });
    });

    // Load Font Awesome for icons
    const loadFontAwesome = () => {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            document.head.appendChild(link);
        }
    };

    // Initialize script
    const initialize = () => {
        // Load Font Awesome
        loadFontAwesome();
        
        // Attach listeners to existing posts
        document.querySelectorAll('tr.forum_post').forEach(attachListener);
        
        // Observe for new posts
        observer.observe(document.body, { childList: true, subtree: true });
        
        // No tooltip message - removed as requested
    };

    // Start script when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
