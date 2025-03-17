(function () {
  'use strict';

  // إضافة أنماط CSS معدلة لحل المشكلة
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      @media screen and (max-width: 767px) {
        .note-icon-container {
          position: absolute;
          left: 10px; /* تحريكها بعيدًا عن السهم */
          top: 50%;
          transform: translateY(-50%);
          z-index: 10; /* تأكد أنها فوق العناصر الأخرى */
        }
        
        .note-tooltip {
          left: 40px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          max-width: 200px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  // تحديث أيقونات الملاحظات في القائمة
  const updateRequestListIcons = () => {
    const requestLinks = document.querySelectorAll('a.ajaxbtn[href^="/community/requests/"]');
    requestLinks.forEach(link => {
      const match = link.getAttribute('href').match(/\/community\/requests\/(\d+)-/);
      if (match && match[1]) {
        const requestId = match[1];
        const note = localStorage.getItem('khamsat_note_' + requestId);
        
        if (note && note.trim() !== '') {
          let iconContainer = link.closest('td').querySelector('.note-icon-container');
          if (!iconContainer) {
            // إنشاء الأيقونة فقط إذا لم تكن موجودة
            iconContainer = document.createElement('div');
            iconContainer.className = 'note-icon-container';
            
            const noteIcon = document.createElement('div');
            noteIcon.className = 'note-icon';
            noteIcon.innerHTML = '<svg style="color: #FFD700; font-size: 18px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18px" height="18px"><path d="M4 2h14a2 2 0 012 2v14l-4-4H4a2 2 0 01-2-2V4a2 2 0 012-2z"/></svg>';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'note-tooltip';
            tooltip.textContent = note;
            
            iconContainer.appendChild(noteIcon);
            iconContainer.appendChild(tooltip);
            
            // إضافة الأيقونة إلى الجدول
            const parentTd = link.closest('td');
            parentTd.style.position = 'relative';
            parentTd.appendChild(iconContainer);
          }
        }
      }
    });
  };

  // تهيئة السكريبت عند تحميل الصفحة
  const initNoteFeature = () => {
    addStyles();
    updateRequestListIcons();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNoteFeature);
  } else {
    initNoteFeature();
  }
})();
