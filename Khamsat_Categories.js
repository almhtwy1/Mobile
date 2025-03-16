// ==UserScript==
// @name         Khamsat Categories Mobile Friendly
// @namespace    https://khamsat.com/
// @version      1.1
// @description  تصنيف طلبات خمسات تلقائياً مع إمكانية التصفية حسب الفئة (نسخة محسنة للجوال)
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
            keywords: ['بيانات', 'البيانات', 'ادخال', 'تنظيف', 'تحليل', 'جمع', 'scraping', 'اكسل',
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

    // Prepare regex patterns for each category
    Object.values(categories).forEach(category => {
        if (category.keywords.length) {
            category.regex = new RegExp(
                `(?:^|\\s)(${category.keywords
                    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
                    .join('|')})(?:\\s|$)`,
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

        // No filter status indicator to update - removed as requested
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

        // Scrollable inner container for buttons
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

        // Add scroll buttons for better mobile navigation
        const leftScrollBtn = document.createElement('button');
        leftScrollBtn.id = 'scroll-left';
        leftScrollBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        leftScrollBtn.onclick = () => {
            scrollContainer.scrollBy({ left: -100, behavior: 'smooth' });
        };

        const rightScrollBtn = document.createElement('button');
        rightScrollBtn.id = 'scroll-right';
        rightScrollBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        rightScrollBtn.onclick = () => {
            scrollContainer.scrollBy({ left: 100, behavior: 'smooth' });
        };

        // No active filter indicator - removed as requested

        // Assemble the components
        scrollContainer.appendChild(buttonsContainer);
        container.appendChild(leftScrollBtn);
        container.appendChild(scrollContainer);
        container.appendChild(rightScrollBtn);

        // Add everything to the page
        const forumElement = document.querySelector('#forum-requests');
        if (forumElement) {
            forumElement.prepend(container);
        }

        // Check for scroll buttons visibility
        const checkScrollButtons = () => {
            const hasOverflow = scrollContainer.scrollWidth > scrollContainer.clientWidth;
            leftScrollBtn.style.display = hasOverflow ? 'flex' : 'none';
            rightScrollBtn.style.display = hasOverflow ? 'flex' : 'none';

            // Hide left button when scrolled to start
            if (scrollContainer.scrollLeft <= 0) {
                leftScrollBtn.style.opacity = '0.5';
            } else {
                leftScrollBtn.style.opacity = '1';
            }

            // Hide right button when scrolled to end
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 5) {
                rightScrollBtn.style.opacity = '0.5';
            } else {
                rightScrollBtn.style.opacity = '1';
            }
        };

        // Initialize scroll buttons state
        setTimeout(checkScrollButtons, 100);

        // Update scroll buttons on scroll
        scrollContainer.addEventListener('scroll', checkScrollButtons);

        // Update on window resize
        window.addEventListener('resize', checkScrollButtons);
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
            }

            #cat-buttons-scroll {
                display: flex;
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none; /* Firefox */
                padding: 5px 0;
                position: relative;
            }

            #cat-buttons-scroll::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Edge */
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
                padding: 6px 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 13px;
                box-shadow: 0 2px 3px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                white-space: nowrap;
                min-width: max-content;
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

            .cat-btn i {
                font-size: 12px;
            }

            #scroll-left, #scroll-right {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                background-color: rgba(255, 255, 255, 0.9);
                border: 1px solid #ddd;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                position: absolute;
                z-index: 5;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            #scroll-left:hover, #scroll-right:hover {
                background-color: #f0f0f0;
            }

            #scroll-left {
                left: 5px;
            }

            #scroll-right {
                right: 5px;
            }

            /* Filter indicator styles removed as requested */

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
            }

            /* Filter indicator media query removed as requested */
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

    // Detect device and adapt UI accordingly
    const adaptUIToDevice = () => {
        const isMobile = window.innerWidth <= 767;

        // Show only icons on very small screens
        if (window.innerWidth < 480) {
            document.querySelectorAll('.cat-btn .cat-text').forEach(text => {
                text.style.display = 'none';
            });

            document.querySelectorAll('.cat-btn').forEach(btn => {
                btn.style.padding = '6px 8px';
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
