// ==UserScript==
// @name         Khamsat Categories Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.2
// @description  تصنيف طلبات خمسات تلقائياً مع إمكانية التصفية حسب الفئة (نسخة محسنة للجوال بدون أسهم)
// @author       Your Name
// @match        https://khamsat.com/community/requests*
// @icon         https://khamsat.com/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// ==/UserScript==
(function() {
    'use strict';
    // Utility function for debouncing
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };
    // Categories configuration
    const categories = {
        تصميم: {
            keywords: ['تصميم', 'مصممه', 'مصمم', 'لوغو', 'canva', 'شعارات', 'هوية', 'جرافيك', 'شعار', 'تصاميم',
                      'صور', 'صوره', 'صورة', 'تيكتوك', 'بوستات', 'بوست', 'مسوقين', 'مسوق', 'سوشيال', 'مصممين',
                      'كانفا', 'ui', 'ux', 'بوستر', 'غلاف', 'بروشور', 'بانر', 'هوية بصرية', 'انفوجرافيك',
                      'بروفايل', 'اليستريتور', 'فوتوشوب', 'عرض بوربوينت', 'بوث', 'مخطط مفاهيم', 'مصمم ويب'],
            icon: 'fa-palette',
            color: '#17a2b8'
        },
        كتابة: {
            keywords: ['كتابة', 'لكتابة', 'لكتابه', 'ترجمة', 'ترجمه', 'محتوى', 'مقالات', 'كتيب', 'مجلة', 'مقال', 'تفريغ', 'كاتب', 'تأليف', 'مدونة',
                      'نص', 'سيناريو', 'سيو', 'تلخيص', 'سيرة ذاتية', 'بحث', 'تدقيق', 'تحرير', 'صياغة',
                      'تنسيق', 'بحث أكاديمي', 'مراجعة'],
            icon: 'fa-pen',
            color: '#6610f2'
        },
        تسويق: {
            keywords: ['تسويق', 'تسويقي', 'تسويقية', 'اعلان', 'اعلانات', 'حملات', 'ads', 'seo', 'marketing',
                      'فيسبوك', 'انستقرام', 'سناب', 'التسويق', 'الإعلانية', 'للتسويق', 'ادارة حسابات',
                      'براند', 'مبيعات', 'ترويج', 'جوجل أدز', 'ادسنس', 'حملات ممولة', 'cpa', 'bing',
                      'استراتيجية', 'guest post', 'تسويق عقاري', 'سوشيال ميديا', 'تيك توك'],
            icon: 'fa-bullhorn',
            color: '#ffc107'
        },
        برمجة: {
            keywords: ['برمجة', 'تطوير', 'موقع', 'مواقع', 'تطبيق', 'تطبيقات', 'tabby', 'متجر', 'اندرويد',
                      'ios', 'wordpress', 'بوت', 'مبرمج', 'php', 'ويب', 'فايرفوكس', 'قوقل', 'متصفح',
                      'ايفون', 'أيفون', 'chrome', 'extension', 'بايثون', 'js', 'تكويد', 'فلاتر', 'لارافل',
                      'HTML', 'CSS', 'JavaScript', 'Objective-C', 'Xcode', 'Websocket', 'API', 'Frontend',
                      'Backend', 'SQL', 'VB.NET', 'Postgres', 'Supabase', 'ريسكين', 'Figma'],
            icon: 'fa-code',
            color: '#28a745'
        },
        فيديو: {
            keywords: ['فيديو', 'موشن', 'مونتاج', 'انيميشن', 'فيلم', 'الفيديو', 'الفيديوهات', 'فيديوهات',
                      'فديوهات', 'انترو', 'تحريك', 'animation', 'edit', 'اخراج', 'مونتير', 'تعديل ألوان',
                      'Video', 'فلاتر', 'ترانزيشن', 'إخراج سينمائي', 'تحرير فيديو', 'إعلان مصوَّر',
                      'Videographer'],
            icon: 'fa-video',
            color: '#dc3545'
        },
        هندسة: {
            keywords: ['هندسة', 'معمار', 'مدني', 'خريطة', 'ميكانيكي', 'معماري', 'مخطط', 'مهندس',
                      'مشروع هندسي', 'خرائط', 'تصميم داخلي', 'ديكور', 'أوتوكاد', 'ريفيت', '3ds Max',
                      'SketchUp', 'مخطط سلامة', 'ديناميكا حرارية', 'هندسي'],
            icon: 'fa-building',
            color: '#8e44ad'
        },
        أعمال: {
            keywords: ['اعمال', 'ادارة', 'محاسبة', 'مالية', 'قانونية', 'دراسة جدوى', 'خطة عمل',
                      'مشروع', 'وظائف', 'موظف', 'سكرتير', 'موظفين', 'مندوب', 'تمويل', 'تسعير',
                      'مبيعات', 'إدارة مشاريع', 'موارد بشرية'],
            icon: 'fa-briefcase',
            color: '#fd7e14'
        },
        صوتيات: {
            keywords: ['صوت', 'تعليق', 'موسيقى', 'هندسة صوت', 'تلحين', 'فويس', 'اغنية', 'إنشاد',
                      'إنشودة', 'انشودة', 'إلقاء', 'فويس أوفر', 'صوتي', 'دبلجة', 'بودكاست'],
            icon: 'fa-microphone',
            color: '#FF80AB'
        },
        تعليم: {
            keywords: ['تعليم', 'الواجب', 'تدريب', 'تعليمية', 'دروس', 'مدرس', 'تدريبية', 'حل واجبات', 'صوتيه', 'كورس', 'معلم',
                      'قرآن', 'دورات', 'شرح', 'آيلتس', 'تدريس', 'خصوصي', 'منصة تعليمية', 'التعلم',
                      'معلمة', 'تعليم', 'اختبارات', 'مساعدة واجبات', 'أكاديمي'],
            icon: 'fa-chalkboard-teacher',
            color: '#FA8072'
        },
        بيانات: {
            keywords: ['بيانات', 'البيانات', 'ادخال', 'تنظيف', 'تحليل', 'جمع', 'scraping', 'اكسل', 'إكسل',
                       'pdf', 'sql', 'database', 'جوجل شيت', 'SharePoint', 'VBA', 'جدول ديناميكي',
                       'تنسيق ملفات', 'دمج بيانات', 'Pivot', 'CSV'],
            icon: 'fa-database',
            color: '#FF6347'
        },
        'أسلوب حياة': {
            keywords: ['حياة', 'لياقة', 'ارشاد', 'استشارة', 'طبخ', 'صحة', 'هواية', 'ترفيه',
                      'شخصي', 'رشاقة', 'جمال', 'موضة', 'نصائح', 'عناية', 'وصفات طبخ', 'تخسيس'],
            icon: 'fa-heart',
            color: '#20B2AA'
        },
        أخرى: {
            keywords: [],
            icon: 'fa-folder-open',
            color: '#6c757d'
        }
    };
    // Prepare regex patterns for each category (supports prefixes like "ب", "لل", "في")
    Object.values(categories).forEach(category => {
        if (category.keywords.length) {
            category.regex = new RegExp(
                `(?:^|\\s|\\b)(?:ب|لل|في)?(${category.keywords
                    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                    .join('|')})(?:\\b|\\s|$)`,
                'i'
            );
        }
    });
    // Add category icons to requests
    const addCategoryIcons = () => {
        document.querySelectorAll('#forums_table tr.forum_post:not([data-categorized])').forEach(row => {
            const link = row.querySelector('.details-td h3 a');
            if (!link) return;
            const text = link.textContent.toLowerCase();
            const matchedCategories = Object.entries(categories)
                .filter(([name, cat]) => name !== 'أخرى' && cat.regex?.test(text))
                .map(([name]) => name);
            if (!matchedCategories.length) {
                matchedCategories.push('أخرى');
            }
            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'display:inline-flex;gap:5px;align-items:center;padding-right:5px';
            // Limit to max 3 categories for better mobile display
            const displayCategories = matchedCategories.slice(0, 3);
            displayCategories.forEach(categoryName => {
                const category = categories[categoryName];
                const icon = document.createElement('i');
                icon.className = `fas ${category.icon}`;
                icon.title = categoryName;
                icon.style.cssText = `color:${category.color};font-size:14px`;
                iconSpan.appendChild(icon);
            });
            link.after(iconSpan);
            row.dataset.categories = matchedCategories.join(',');
            row.dataset.categorized = 'true';
        });
    };
    // Filter posts by category
    let currentCategory = 'الكل';
    const filterPosts = (category) => {
        currentCategory = category;
        // Update active state on buttons
        document.querySelectorAll('.cat-btn').forEach(btn => {
            if (btn.getAttribute('data-category') === category) {
                btn.classList.add('active-cat');
            } else {
                btn.classList.remove('active-cat');
            }
        });
        document.querySelectorAll('#forums_table tr.forum_post').forEach(row => {
            row.style.display = category === 'الكل' ||
                (row.dataset.categories && row.dataset.categories.includes(category))
                ? ''
                : 'none';
        });
    };
    // Create category filter button
    const createCategoryButton = (name, icon, color, onClick) => {
        const button = document.createElement('button');
        button.className = 'cat-btn';
        button.setAttribute('data-category', name);
        button.innerHTML = `<i class="fas ${icon}"></i> <span class="cat-text">${name}</span>`;
        button.style.backgroundColor = color;
        button.onclick = onClick;
        // Set first button (الكل) as active by default
        if (name === 'الكل') {
            button.classList.add('active-cat');
        }
        return button;
    };
    // Add category filter buttons in a scrollable container
    const addCategoryButtons = () => {
        const container = document.createElement('div');
        container.id = 'cat-buttons-container';
        // Scrollable container for buttons (full width without scroll arrows)
        const scrollContainer = document.createElement('div');
        scrollContainer.id = 'cat-buttons-scroll';
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'cat-buttons';
        // Add "All" button
        buttonsContainer.appendChild(
            createCategoryButton('الكل', 'fa-list', '#6c757d', () => filterPosts('الكل'))
        );
        // Add category buttons
        Object.entries(categories).forEach(([name, category]) => {
            buttonsContainer.appendChild(
                createCategoryButton(name, category.icon, category.color, () => filterPosts(name))
            );
        });
        // Assemble the components - no scroll buttons
        scrollContainer.appendChild(buttonsContainer);
        container.appendChild(scrollContainer);
        // Add everything to the page
        const forumElement = document.querySelector('#forum-requests');
        if (forumElement) {
            forumElement.prepend(container);
        }
    };
    // Add styles for mobile-friendly layout
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            #cat-buttons-container {
                margin: 10px 0;
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                direction: rtl;
                padding: 0 10px;
            }
            #cat-buttons-scroll {
                display: flex;
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                padding: 8px 0;
                position: relative;
            }
            /* Customize scrollbar for webkit browsers */
            #cat-buttons-scroll::-webkit-scrollbar {
                height: 4px;
                background-color: #f1f1f1;
                border-radius: 4px;
            }
            #cat-buttons-scroll::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 4px;
            }
            #cat-buttons-scroll::-webkit-scrollbar-thumb:hover {
                background-color: #555;
            }
            #cat-buttons {
                display: flex;
                gap: 8px;
                min-width: max-content;
                padding: 0 4px;
            }
            .cat-btn {
                color: #fff;
                border: none;
                border-radius: 25px;
                padding: 6px 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 13px;
                box-shadow: 0 2px 3px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                white-space: nowrap;
                min-width: max-content;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
            .cat-btn.active-cat {
                transform: translateY(-2px);
                box-shadow: 0 4px 6px rgba(0,0,0,0.25);
                position: relative;
            }
            .cat-btn.active-cat::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 30%;
                height: 3px;
                background-color: currentColor;
                border-radius: 3px;
            }
            .cat-btn:hover {
                transform: translateY(-1px);
                opacity: 0.9;
            }
            .cat-btn:active {
                transform: translateY(0);
                opacity: 0.8;
            }
            .cat-btn i {
                font-size: 12px;
            }
            /* Fix the post details display for mobile */
            @media screen and (max-width: 767px) {
                .details-td h3 {
                    font-size: 14px;
                    line-height: 1.3;
                    margin-bottom: 5px;
                }
                .details-td .date {
                    font-size: 11px;
                }
                .author-td {
                    padding: 5px !important;
                }
                .author-td .author {
                    font-size: 12px;
                }
                /* Fix for icons on mobile */
                .details-td h3 a + span {
                    margin-top: 3px;
                }
                
                /* Make buttons more touch-friendly on small screens */
                .cat-btn {
                    padding: 8px 14px;
                }
            }
            /* For very small screens - show only icons */
            @media screen and (max-width: 480px) {
                .cat-btn {
                    padding: 8px 12px;
                }
                
                .cat-btn .cat-text {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    };
    // Add touch scroll support for the category filters
    const addTouchScroll = () => {
        const scrollContainer = document.getElementById('cat-buttons-scroll');
        if (!scrollContainer) return;
        let isDown = false;
        let startX;
        let scrollLeft;
        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.classList.add('active');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.classList.remove('active');
        });
        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.classList.remove('active');
        });
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
        // For touch devices
        scrollContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        }, { passive: true });
        scrollContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    };
    // Scroll to active category to ensure it's visible
    const scrollToActiveCategory = () => {
        const scrollContainer = document.getElementById('cat-buttons-scroll');
        const activeButton = document.querySelector('.cat-btn.active-cat');
        
        if (scrollContainer && activeButton) {
            // Calculate position to center the active button
            const containerWidth = scrollContainer.offsetWidth;
            const buttonLeft = activeButton.offsetLeft;
            const buttonWidth = activeButton.offsetWidth;
            
            const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
            scrollContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    };
    // Detect device and adapt UI accordingly
    const adaptUIToDevice = () => {
        const isMobile = window.innerWidth <= 767;
        // Show only icons on very small screens
        if (window.innerWidth < 400) {
            document.querySelectorAll('.cat-btn .cat-text').forEach(text => {
                text.style.display = 'none';
            });
            document.querySelectorAll('.cat-btn').forEach(btn => {
                btn.style.padding = '8px 10px';
            });
        } else {
            document.querySelectorAll('.cat-btn .cat-text').forEach(text => {
                text.style.display = '';
            });
        }
        // Add a class to body for additional CSS targeting
        document.body.classList.toggle('khamsat-mobile', isMobile);
    };
    // Initialize observers and event listeners
    const initialize = () => {
        // Ensure Font Awesome is loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            document.head.appendChild(link);
        }
        // Add styles
        addStyles();
        // Add category buttons
        addCategoryButtons();
        // Add touch scroll support
        addTouchScroll();
        // Adapt UI to device
        adaptUIToDevice();
        window.addEventListener('resize', adaptUIToDevice);
        // Initial categorization of existing posts
        addCategoryIcons();
        // Observe table for new posts
        const tableObserver = new MutationObserver(() => {
            debounce(addCategoryIcons, 300)();
        });
        const forumTable = document.querySelector('#forums_table tbody');
        if (forumTable) {
            tableObserver.observe(forumTable, {
                childList: true,
                subtree: true
            });
        }
        // Observe filter changes and scroll to active category
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cat-btn')) {
                setTimeout(scrollToActiveCategory, 100);
            }
        });
        // Handle "Load More" button
        const loadMoreButton = document.getElementById('community_loadmore_btn');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                setTimeout(() => {
                    addCategoryIcons();
                    filterPosts(currentCategory);
                }, 2000);
            });
        }
    };
    // Start script when page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

عندي سكريبت هذا الملف جزء منه 
وظيفته هي فرز العناوين 
ولكن ابي فرز ذكي وادق بشكل كبير وبسيط جداً وغير معقد 
وش تنصحني فيه .؟ باختصار وبوضوح وببساطة
