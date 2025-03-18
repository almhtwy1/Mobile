// ==UserScript==
// @name         Khamsat Comment Count Fast Updater - Live Update
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  تحديث مباشر لعدد التعليقات مع موضع ثابت في جميع أحجام الشاشات
// @author       Your Name
// @match        https://khamsat.com/community/requests*
// @grant        none
// ==/UserScript==

(async function () {
  'use strict';

  const cacheExpiry = 2 * 60 * 1000; // تقليل مدة التخزين المؤقت إلى دقيقتين

  // إضافة الأنماط لتحسين العرض
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .comments-count {
        color: rgb(255, 69, 0);
        font-weight: bold;
        margin-right: 5px;
        transition: all 0.3s ease;
        display: inline-block;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        background-color: rgba(255, 69, 0, 0.1);
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      .comments-count.updated {
        animation: pulse 1s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  };

  // تحديث عدد التعليقات في الرابط المحدد
  async function updateAnchor(anchor) {
    try {
      const href = anchor.getAttribute('href');
      const url = new URL(href, window.location.origin);
      const cacheKey = `comment_count_${url.pathname}`;
      const currentTime = Date.now();
      const cachedData = sessionStorage.getItem(cacheKey);
      const cacheTimestamp = parseInt(sessionStorage.getItem(`${cacheKey}_timestamp`) || '0');

      // تحديث إذا انتهت صلاحية التخزين المؤقت
      if (cachedData && (currentTime - cacheTimestamp < cacheExpiry)) {
        updateCountDisplay(anchor, cachedData);
        return;
      }

      const response = await fetch(url.href);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const header = doc.querySelector('div.card-header.bg-white h3');
      if (!header) return;

      const match = header.textContent.match(/\((\d+)/);
      if (match) {
        const count = match[1];
        updateCountDisplay(anchor, count, true);
        sessionStorage.setItem(cacheKey, count);
        sessionStorage.setItem(`${cacheKey}_timestamp`, currentTime.toString());
      }
    } catch (error) {
      console.error('Error updating anchor:', error);
    }
  }

  // تحديث عرض العدد في DOM
  function updateCountDisplay(anchor, count, isNewData = false) {
    const formatCount = (num) => (num > 99 ? '99+' : num);
    const row = anchor.closest('tr') || anchor.closest('.row');
    if (!row) return;

    const detailsList = row.querySelector('.details-list');
    if (!detailsList) return;

    let existingSpan = detailsList.querySelector('span.comments-count');
    if (existingSpan) {
      existingSpan.textContent = ` (${formatCount(count)} تعليقات)`;
      if (isNewData) {
        existingSpan.classList.remove('updated');
        void existingSpan.offsetWidth;
        existingSpan.classList.add('updated');
      }
    } else {
      const newSpan = document.createElement('span');
      newSpan.className = 'comments-count';
      newSpan.textContent = ` (${formatCount(count)} تعليقات)`;
      detailsList.appendChild(newSpan);
      if (isNewData) newSpan.classList.add('updated');
    }
  }

  // البحث عن جميع الروابط وتحديثها
  function processAnchors(root = document) {
    document.querySelectorAll('a.ajaxbtn:not([data-processed])').forEach(anchor => {
      anchor.setAttribute('data-processed', 'true');
      updateAnchor(anchor);
    });
  }

  // بدء التنفيذ
  function initialize() {
    addStyles();
    processAnchors();

    // تحديث تلقائي كل 30 ثانية
    setInterval(processAnchors, 30000);

    // مراقبة تغييرات الصفحة
    new MutationObserver(() => processAnchors()).observe(document.body, { childList: true, subtree: true });

    // تحديث بعد النقر على زر "عرض المواضيع الأقدم"
    document.getElementById('community_loadmore_btn')?.addEventListener('click', () => {
      setTimeout(processAnchors, 1000);
    });
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initialize) : initialize();
})();
