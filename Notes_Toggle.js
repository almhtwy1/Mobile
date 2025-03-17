// ==UserScript==
// @name         Khamsat Notes Toggle with Auto-Save Mobile Friendly
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  عرض جزء الملاحظات مع الحفظ التلقائي وتجربة محسنة للجوال
// @author       Your Name
// @match        https://khamsat.com/community/requests/*
// @match        https://khamsat.com/community/requests
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
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
      /* Base styles for notes card */
      .notes-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        margin-bottom: 20px;
        overflow: hidden;
        border: 1px solid #e9ecef;
        transition: all 0.3s ease;
      }
      
      .notes-card-header {
        display: flex;
        align-items: center;
        padding: 12px 15px;
        background-color: #f8f9fa;
        color: #333;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        border-bottom: 1px solid #e9ecef;
        position: relative;
      }
      
      .notes-card-header:hover {
        background-color: #f1f3f5;
      }
      
      .notes-indicator {
        color: #28a745;
        margin-right: 8px;
        font-size: 11px;
      }
      
      .notes-icon {
        margin-left: 10px;
        color: #0984e3;
      }
      
      .notes-title {
        flex-grow: 1;
      }
      
      .notes-toggle {
        transition: transform 0.3s ease;
      }
      
      .notes-card-body {
        padding: 15px;
        transition: max-height 0.3s ease;
      }
      
      .notes-textarea {
        width: 100%;
        min-height: 150px;
        resize: vertical;
        padding: 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-family: inherit;
        transition: border-color 0.3s ease;
        direction: rtl;
      }
      
      .notes-textarea:focus {
        outline: none;
        border-color: #0984e3;
        box-shadow: 0 0 0 2px rgba(9, 132, 227, 0.25);
      }
      
      .notes-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
      }
      
      .save-notification {
        display: none;
        align-items: center;
        color: #28a745;
        font-size: 13px;
        padding: 4px 10px;
        border-radius: 4px;
        background-color: rgba(40, 167, 69, 0.1);
        animation: fadeIn 0.3s ease;
      }
      
      .save-notification i {
        margin-left: 5px;
      }
      
      /* List view styles for note icons */
      .note-icon-container {
        position: relative;
      }
      
      .note-icon svg {
        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
        transition: transform 0.3s ease;
      }
      
      .note-tooltip {
        position: absolute;
        background: #333;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 14px;
        min-width: 200px;
        max-width: 350px;
        width: max-content;
        word-wrap: break-word;
        white-space: pre-wrap;
        line-height: 1.5;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      /* Scroll behavior for FAB */
      .mobile-notes-fab.hidden {
        transform: translateY(100px);
        opacity: 0;
      }
      
      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      
      /* Mobile specific styles */
      @media screen and (max-width: 767px) {
        .notes-card {
          margin-bottom: 15px;
          border-radius: 6px;
        }
        
        .notes-card-header {
          padding: 10px 12px;
        }
        
        .notes-card-body {
          padding: 12px;
        }
        
        .notes-textarea {
          min-height: 120px;
          font-size: 16px; /* Better for touch input */
          padding: 8px;
        }
        
        /* Fix tooltip position for mobile */
        .note-tooltip {
          right: 30px;
          left: auto;
          max-width: 250px;
          font-size: 13px;
          padding: 8px 12px;
        }
        
        /* Floating action button style for mobile */
        .mobile-notes-fab {
          position: fixed;
          bottom: 80px; /* increased to stay above bottom nav */
          left: 20px; /* changed from right to left */
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #0984e3;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          z-index: 1010; /* increased to stay above other elements */
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease;
        }
        
        .mobile-notes-fab:active {
          transform: scale(0.95);
        }
        
        .mobile-notes-fab.has-notes {
          background-color: #28a745;
        }
        
        .mobile-notes-fab.has-notes i {
          animation: bounce 1s ease infinite;
        }
        
        /* Mobile note modal */
        .mobile-notes-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          z-index: 1011; /* higher than FAB */
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        
        .mobile-notes-modal.visible {
          opacity: 1;
          visibility: visible;
        }
        
        .mobile-notes-content {
          width: 90%;
          max-width: 500px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }
        
        .mobile-notes-modal.visible .mobile-notes-content {
          transform: translateY(0);
        }
        
        .mobile-notes-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 15px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .mobile-notes-title {
          font-weight: bold;
          color: #333;
        }
        
        .mobile-notes-close {
          color: #666;
          font-size: 18px;
          padding: 5px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // Create mobile FAB (Floating Action Button) for notes
  const createMobileFab = (hasNotes) => {
    // Check if we're on the requests list page and not on a specific request page
    const isRequestListPage = window.location.pathname === '/community/requests';
    
    // Don't create FAB on the requests list page
    if (isRequestListPage) {
      return null;
    }
    
    // Remove existing FAB if any
    const existingFab = document.querySelector('.mobile-notes-fab');
    if (existingFab) {
      existingFab.remove();
    }
    
    // Create FAB
    const fab = document.createElement('div');
    fab.className = `mobile-notes-fab ${hasNotes ? 'has-notes' : ''}`;
    fab.innerHTML = `<i class="fas fa-sticky-note"></i>`;
    
    // Add click handler
    fab.addEventListener('click', () => {
      showMobileNotesModal();
    });
    
    // Add to body
    document.body.appendChild(fab);
    
    // Set up scroll behavior
    let lastScrollPosition = window.scrollY;
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      
      // Show when scrolling down, hide when scrolling up
      if (currentScrollPosition > lastScrollPosition) {
        // Scrolling down - show the button
        fab.classList.remove('hidden');
      } else {
        // Scrolling up - hide the button
        fab.classList.add('hidden');
      }
      
      lastScrollPosition = currentScrollPosition;
    };
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return fab;
  };
  
  // Create and show mobile notes modal
  const showMobileNotesModal = () => {
    // Remove existing modal if any
    const existingModal = document.querySelector('.mobile-notes-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Get request ID
    let requestId = 'default';
    try {
      const match = window.location.pathname.match(/\/community\/requests\/(\d+)-/);
      if (match && match[1]) {
        requestId = match[1];
      }
    } catch (err) {
      console.error('خطأ أثناء استخراج رقم الطلب:', err);
    }
    const storageKey = 'khamsat_note_' + requestId;
    
    // Get saved note
    const savedNote = localStorage.getItem(storageKey) || '';
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'mobile-notes-modal';
    
    modal.innerHTML = `
      <div class="mobile-notes-content">
        <div class="mobile-notes-header">
          <div class="mobile-notes-title">
            <i class="fas fa-sticky-note notes-icon"></i>
            الملاحظات
          </div>
          <div class="mobile-notes-close">
            <i class="fas fa-times"></i>
          </div>
        </div>
        <div class="notes-card-body">
          <textarea id="mobileNoteTextarea" class="notes-textarea" placeholder="اكتب ملاحظاتك هنا...">${savedNote}</textarea>
          <div class="notes-footer">
            <div id="mobileSaveNotification" class="save-notification">
              <i class="fas fa-check-circle"></i>
              تم الحفظ
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to body
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('visible');
    }, 10);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.mobile-notes-close');
    const textarea = modal.querySelector('#mobileNoteTextarea');
    const saveNotification = modal.querySelector('#mobileSaveNotification');
    
    // Close modal
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.remove();
      }, 300);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('visible');
        setTimeout(() => {
          modal.remove();
        }, 300);
      }
    });
    
    // Auto-save logic
    let saveTimeout;
    textarea.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        localStorage.setItem(storageKey, textarea.value);
        saveNotification.style.display = 'flex';
        setTimeout(() => {
          saveNotification.style.display = 'none';
        }, 2000);
        
        // Update FAB state
        const fab = document.querySelector('.mobile-notes-fab');
        if (fab) {
          if (textarea.value.trim() !== '') {
            fab.classList.add('has-notes');
          } else {
            fab.classList.remove('has-notes');
          }
        }
        
        updateRequestListIcons();
      }, 500);
    });
  };

  // Initialize note feature for desktop
  const initDesktopNotes = () => {
    const communitySidebar = document.querySelector('#community_sidebar');
    if (!communitySidebar) return null;
    
    let lastActivityCard = null;
    const cards = communitySidebar.querySelectorAll('.card');
    cards.forEach((card) => {
      const header = card.querySelector('.card-header');
      if (header && header.textContent.includes('آخر المساهمات')) {
        lastActivityCard = card;
      }
    });
    
    if (!lastActivityCard) return null;
    
    // Get request ID
    let requestId = 'default';
    try {
      const match = window.location.pathname.match(/\/community\/requests\/(\d+)-/);
      if (match && match[1]) {
        requestId = match[1];
      }
    } catch (err) {
      console.error('خطأ أثناء استخراج رقم الطلب:', err);
    }
    const storageKey = 'khamsat_note_' + requestId;
    
    // Get saved note
    const savedNote = localStorage.getItem(storageKey) || '';
    
    // Create note card
    const noteCard = document.createElement('div');
    noteCard.className = 'notes-card';
    noteCard.innerHTML = `
      <div class="notes-card-header" id="toggleNote">
        <i class="fas fa-sticky-note notes-icon"></i>
        <span class="notes-title">الملاحظات</span>
        <span id="noteIndicator" class="notes-indicator" style="display: none;">●</span>
        <i class="fas fa-chevron-down notes-toggle"></i>
      </div>
      <div class="notes-card-body" style="display: none;">
        <textarea id="noteTextarea" class="notes-textarea" placeholder="اكتب ملاحظاتك هنا...">${savedNote}</textarea>
        <div class="notes-footer">
          <div id="saveNotification" class="save-notification">
            <i class="fas fa-check-circle"></i>
            تم الحفظ
          </div>
        </div>
      </div>
    `;
    
    // Insert before last activity card
    communitySidebar.insertBefore(noteCard, lastActivityCard);
    
    // Get elements
    const noteTextarea = noteCard.querySelector('#noteTextarea');
    const noteIndicator = noteCard.querySelector('#noteIndicator');
    const saveNotification = noteCard.querySelector('#saveNotification');
    const toggleBtn = noteCard.querySelector('#toggleNote');
    const chevron = noteCard.querySelector('.notes-toggle');
    
    // Show indicator if there are notes
    if (savedNote.trim() !== '') {
      noteIndicator.style.display = 'inline';
    }
    
    // Toggle note card
    toggleBtn.addEventListener('click', () => {
      const cardBody = noteCard.querySelector('.notes-card-body');
      const isVisible = cardBody.style.display !== 'none';
      
      // Toggle display
      cardBody.style.display = isVisible ? 'none' : 'block';
      
      // Rotate chevron
      chevron.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    });
    
    // Auto-save logic
    let saveTimeout;
    noteTextarea.addEventListener('input', () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        localStorage.setItem(storageKey, noteTextarea.value);
        saveNotification.style.display = 'flex';
        setTimeout(() => {
          saveNotification.style.display = 'none';
        }, 2000);
        
        noteIndicator.style.display = noteTextarea.value.trim() !== '' ? 'inline' : 'none';
        updateRequestListIcons();
      }, 500);
    });
    
    return noteCard;
  };

  // Update note icons in request list
  const updateRequestListIcons = () => {
    const requestLinks = document.querySelectorAll('a.ajaxbtn[href^="/community/requests/"]');
    requestLinks.forEach(link => {
      const match = link.getAttribute('href').match(/\/community\/requests\/(\d+)-/);
      if (match && match[1]) {
        const requestId = match[1];
        const note = localStorage.getItem('khamsat_note_' + requestId);
        
        if (note && note.trim() !== '') {
          if (!link.closest('td').querySelector('.note-icon-container')) {
            // Create icon container
            const iconContainer = document.createElement('div');
            iconContainer.className = 'note-icon-container';
            
            // Position at the far left in any view (RTL-friendly)
            iconContainer.style.cssText = 'position: absolute; left: 5px; top: 50%; transform: translateY(-50%);';
            
            // Create note icon
            const noteIcon = document.createElement('div');
            noteIcon.className = 'note-icon';
            noteIcon.innerHTML = '<svg style="color: #FFD700; font-size: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18px" height="18px"><path d="M4 2h14a2 2 0 012 2v14l-4-4H4a2 2 0 01-2-2V4a2 2 0 012-2z"/></svg>';
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'note-tooltip';
            
            // Position tooltip
            tooltip.style.left = '30px';
            tooltip.style.top = '50%';
            tooltip.style.transform = 'translateY(-50%)';
            
            tooltip.textContent = note;
            
            // Add hover events
            iconContainer.addEventListener('mouseenter', () => {
              tooltip.style.opacity = '1';
              tooltip.style.visibility = 'visible';
            });
            
            iconContainer.addEventListener('mouseleave', () => {
              tooltip.style.opacity = '0';
              tooltip.style.visibility = 'hidden';
            });
            
            // Touch events for mobile
            iconContainer.addEventListener('touchstart', (e) => {
              e.stopPropagation();
              tooltip.style.opacity = '1';
              tooltip.style.visibility = 'visible';
            });
            
            document.addEventListener('touchstart', (e) => {
              if (!iconContainer.contains(e.target)) {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
              }
            });
            
            // Assemble elements
            iconContainer.appendChild(noteIcon);
            iconContainer.appendChild(tooltip);
            
            // Add to DOM
            const parentTd = link.closest('td');
            parentTd.style.position = 'relative';
            parentTd.appendChild(iconContainer);
          }
        }
      }
    });
  };

  // Check if bottom navigation is present and adjust FAB position if needed
  const adjustFabPositionIfNeeded = () => {
    const bottomNav = document.querySelector('.hsoub-tabs-list');
    const fab = document.querySelector('.mobile-notes-fab');
    
    if (bottomNav && fab) {
      // Ensure FAB is above the bottom navigation
      const bottomNavHeight = bottomNav.offsetHeight;
      fab.style.bottom = (bottomNavHeight + 15) + 'px';
    }
  };

  // Main init function
  const initNoteFeature = async () => {
    try {
      // Add styles first
      addStyles();
      
      // Initialize based on device type
      if (isMobile()) {
        // Get request ID
        let requestId = 'default';
        try {
          const match = window.location.pathname.match(/\/community\/requests\/(\d+)-/);
          if (match && match[1]) {
            requestId = match[1];
          }
        } catch (err) {
          console.error('خطأ أثناء استخراج رقم الطلب:', err);
        }
        
        // Check if we have notes
        const storageKey = 'khamsat_note_' + requestId;
        const savedNote = localStorage.getItem(storageKey) || '';
        const hasNotes = savedNote.trim() !== '';
        
        // Create FAB
        createMobileFab(hasNotes);
        
        // Adjust position based on bottom navigation
        setTimeout(adjustFabPositionIfNeeded, 500);
        
        // Re-adjust on scroll to handle possible dynamic elements
        window.addEventListener('scroll', () => {
          adjustFabPositionIfNeeded();
        });
      } else {
        // Desktop version
        initDesktopNotes();
      }
      
      // Update list icons for both versions
      updateRequestListIcons();
      
      // Handle resize events
      window.addEventListener('resize', () => {
        const wasMobile = document.querySelector('.mobile-notes-fab') !== null;
        const isMobileNow = isMobile();
        
        if (wasMobile && !isMobileNow) {
          // Switching to desktop
          document.querySelector('.mobile-notes-fab')?.remove();
          document.querySelector('.mobile-notes-modal')?.remove();
          initDesktopNotes();
        } else if (!wasMobile && isMobileNow) {
          // Switching to mobile
          const noteCard = document.querySelector('.notes-card');
          if (noteCard) noteCard.remove();
          
          // Get request ID
          let requestId = 'default';
          try {
            const match = window.location.pathname.match(/\/community\/requests\/(\d+)-/);
            if (match && match[1]) {
              requestId = match[1];
            }
          } catch (err) {
            console.error('خطأ أثناء استخراج رقم الطلب:', err);
          }
          
          // Check if we have notes
          const storageKey = 'khamsat_note_' + requestId;
          const savedNote = localStorage.getItem(storageKey) || '';
          const hasNotes = savedNote.trim() !== '';
          
          // Create FAB
          createMobileFab(hasNotes);
          
          // Adjust position
          setTimeout(adjustFabPositionIfNeeded, 500);
        }
      });

    } catch (error) {
      console.error('خطأ في سكريبت الملاحظات:', error);
    }
  };

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNoteFeature);
  } else {
    initNoteFeature();
  }
})();
