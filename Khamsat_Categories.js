// ==UserScript==
// @name         Khamsat Categories Enhanced Mobile Friendly
// @namespace    https://khamsat.com/
// @version      2.0
// @description  تصنيف طلبات خمسات تلقائياً محسن مع دقة أعلى (نسخة محسنة للجوال)
// @author       Enhanced Version
// @match        https://khamsat.com/community/requests*
// @icon         https://khamsat.com/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Debounce utility
    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    // Enhanced categories with better keywords and scoring
    const categories = {
        تصميم: {
            primary: ['تصميم', 'مصمم', 'مصممه', 'لوغو', 'شعار', 'هوية', 'جرافيك', 'ui', 'ux', 'canva', 'كانفا'],
            secondary: ['بوست', 'بوستات', 'بانر', 'غلاف', 'بروشور', 'انفوجرافيك', 'موشن', 'فوتوشوب', 'اليستريتور', 'بوربوينت'],
            context: ['صور', 'صورة', 'تيكتوك', 'سوشيال', 'بروفايل', 'مخطط', 'ثلاثي الابعاد', '3d'],
            icon: 'fa-palette',
            color: '#17a2b8'
        },
        برمجة: {
            primary: ['برمجة', 'تطوير', 'موقع', 'مواقع', 'تطبيق', 'تطبيقات', 'مبرمج', 'بوت'],
            secondary: ['اندرويد', 'ios', 'wordpress', 'php', 'js', 'python', 'flutter', 'api', 'سكريبت'],
            context: ['متجر', 'ويب', 'chrome', 'extension', 'html', 'css', 'لارافل', 'nodejs', 'قاعدة بيانات'],
            icon: 'fa-code',
            color: '#28a745'
        },
        تسويق: {
            primary: ['تسويق', 'اعلان', 'اعلانات', 'حملات', 'marketing', 'ads', 'سيو', 'seo'],
            secondary: ['فيسبوك', 'انستقرام', 'سناب', 'تيك توك', 'جوجل ادز', 'ممول', 'ممولة'],
            context: ['ترويج', 'مبيعات', 'براند', 'استراتيجية', 'تفاعل', 'متابعين', 'حسابات'],
            icon: 'fa-bullhorn',
            color: '#ffc107'
        },
        كتابة: {
            primary: ['كتابة', 'كاتب', 'ترجمة', 'محتوى', 'مقال', 'مقالات', 'تأليف'],
            secondary: ['تفريغ', 'تلخيص', 'تدقيق', 'تحرير', 'صياغة', 'سيرة ذاتية', 'cv'],
            context: ['نص', 'سيناريو', 'بحث', 'مدونة', 'مراجعة', 'اكاديمي', 'ملخصات'],
            icon: 'fa-pen',
            color: '#6610f2'
        },
        فيديو: {
            primary: ['فيديو', 'مونتاج', 'مونتير', 'انيميشن', 'موشن جرافيك'],
            secondary: ['انترو', 'تحريك', 'animation', 'edit', 'اخراج', 'ريلز', 'شورت'],
            context: ['يوتيوب', 'تيكتوك', 'الفيديو', 'فيديوهات', 'مقطع', 'تعديل ألوان'],
            icon: 'fa-video',
            color: '#dc3545'
        },
        صوتيات: {
            primary: ['صوت', 'تعليق', 'فويس', 'صوتي', 'معلق'],
            secondary: ['موسيقى', 'هندسة صوت', 'تلحين', 'اغنية', 'انشودة', 'دبلجة'],
            context: ['بودكاست', 'إلقاء', 'فويس أوفر', 'تسجيل', 'صوتيه'],
            icon: 'fa-microphone',
            color: '#FF80AB'
        },
        بيانات: {
            primary: ['بيانات', 'ادخال', 'اكسل', 'excel', 'جدول', 'داتا'],
            secondary: ['تنظيف', 'تحليل', 'جمع', 'scraping', 'pdf', 'csv', 'database'],
            context: ['جوجل شيت', 'pivot', 'تنسيق', 'دمج', 'إحصائي', 'vba'],
            icon: 'fa-database',
            color: '#FF6347'
        },
        هندسة: {
            primary: ['هندسة', 'معمار', 'مهندس', 'اوتوكاد', 'autocad'],
            secondary: ['مخطط', 'خريطة', 'ديكور', 'تصميم داخلي', 'ريفيت', 'sketchup'],
            context: ['مدني', 'معماري', 'مشروع هندسي', '3ds max', 'رسم'],
            icon: 'fa-building',
            color: '#8e44ad'
        },
        أعمال: {
            primary: ['اعمال', 'ادارة', 'محاسبة', 'مالية', 'دراسة جدوى'],
            secondary: ['خطة عمل', 'مشروع', 'موظف', 'سكرتير', 'تمويل', 'موارد بشرية'],
            context: ['وظائف', 'مندوب', 'تسعير', 'إدارة مشاريع', 'crm', 'استشارة'],
            icon: 'fa-briefcase',
            color: '#fd7e14'
        },
        تعليم: {
            primary: ['تعليم', 'تدريب', 'مدرس', 'معلم', 'دروس', 'كورس'],
            secondary: ['واجب', 'واجبات', 'شرح', 'تدريس', 'دورات', 'منصة تعليمية'],
            context: ['قرآن', 'آيلتس', 'خصوصي', 'اختبارات', 'أكاديمي', 'تعليمية'],
            icon: 'fa-chalkboard-teacher',
            color: '#FA8072'
        },
        'أسلوب حياة': {
            primary: ['حياة', 'لياقة', 'ارشاد', 'استشارة', 'صحة'],
            secondary: ['طبخ', 'هواية', 'ترفيه', 'رشاقة', 'جمال', 'موضة'],
            context: ['شخصي', 'نصائح', 'عناية', 'وصفات', 'تخسيس', 'نفسية'],
            icon: 'fa-heart',
            color: '#20B2AA'
        },
        أخرى: {
            primary: [],
            secondary: [],
            context: [],
            icon: 'fa-folder-open',
            color: '#6c757d'
        }
    };

    // Enhanced classification algorithm
    const classifyText = (text) => {
        const normalizedText = text.toLowerCase();
        const scores = {};
        
        // Initialize scores
        Object.keys(categories).forEach(cat => {
            if (cat !== 'أخرى') scores[cat] = 0;
        });
        
        // Scoring system
        Object.entries(categories).forEach(([categoryName, category]) => {
            if (categoryName === 'أخرى') return;
            
            // Primary keywords (highest weight)
            category.primary.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    scores[categoryName] += 10;
                } else if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 7;
                }
            });
            
            // Secondary keywords (medium weight)
            category.secondary.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    scores[categoryName] += 6;
                } else if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 4;
                }
            });
            
            // Context keywords (lower weight)
            category.context.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                if (regex.test(normalizedText)) {
                    scores[categoryName] += 3;
                } else if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 2;
                }
            });
        });
        
        // Get best matches
        const sortedScores = Object.entries(scores)
            .filter(([_, score]) => score > 0)
            .sort(([,a], [,b]) => b - a);
        
        // Return categories with scores above threshold
        const result = sortedScores
            .filter(([_, score]) => score >= 3)
            .slice(0, 3)
            .map(([cat, _]) => cat);
        
        return result.length > 0 ? result : ['أخرى'];
    };

    // Add category icons (simplified)
    const addCategoryIcons = () => {
        document.querySelectorAll('#forums_table tr.forum_post:not([data-categorized])').forEach(row => {
            const link = row.querySelector('.details-td h3 a');
            if (!link) return;

            const matchedCategories = classifyText(link.textContent);
            
            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'display:inline-flex;gap:5px;align-items:center;padding-right:5px';

            matchedCategories.slice(0, 3).forEach(categoryName => {
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

    // Filter functionality (unchanged)
    let currentCategory = 'الكل';
    const filterPosts = (category) => {
        currentCategory = category;
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.classList.toggle('active-cat', btn.getAttribute('data-category') === category);
        });
        document.querySelectorAll('#forums_table tr.forum_post').forEach(row => {
            row.style.display = category === 'الكل' || 
                (row.dataset.categories && row.dataset.categories.includes(category)) ? '' : 'none';
        });
    };

    // Create category buttons (simplified)
    const createCategoryButton = (name, icon, color, onClick) => {
        const button = document.createElement('button');
        button.className = 'cat-btn';
        button.setAttribute('data-category', name);
        button.innerHTML = `<i class="fas ${icon}"></i> <span class="cat-text">${name}</span>`;
        button.style.backgroundColor = color;
        button.onclick = onClick;
        if (name === 'الكل') button.classList.add('active-cat');
        return button;
    };

    // Add category filter buttons (unchanged structure)
    const addCategoryButtons = () => {
        const container = document.createElement('div');
        container.id = 'cat-buttons-container';
        
        const scrollContainer = document.createElement('div');
        scrollContainer.id = 'cat-buttons-scroll';
        
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

        scrollContainer.appendChild(buttonsContainer);
        container.appendChild(scrollContainer);

        const forumElement = document.querySelector('#forum-requests');
        if (forumElement) forumElement.prepend(container);
    };

    // Styles (unchanged)
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
            }
            #cat-buttons-scroll::-webkit-scrollbar {
                height: 4px;
                background-color: #f1f1f1;
                border-radius: 4px;
            }
            #cat-buttons-scroll::-webkit-scrollbar-thumb {
                background-color: #888;
                border-radius: 4px;
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
            @media screen and (max-width: 767px) {
                .details-td h3 {
                    font-size: 14px;
                    line-height: 1.3;
                    margin-bottom: 5px;
                }
                .cat-btn {
                    padding: 8px 14px;
                }
            }
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

    // Touch scroll support (simplified)
    const addTouchScroll = () => {
        const scrollContainer = document.getElementById('cat-buttons-scroll');
        if (!scrollContainer) return;

        let isDown = false, startX, scrollLeft;

        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });

        scrollContainer.addEventListener('mouseleave', () => isDown = false);
        scrollContainer.addEventListener('mouseup', () => isDown = false);

        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
    };

    // Initialize everything
    const initialize = () => {
        // Load Font Awesome if not present
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            document.head.appendChild(link);
        }

        addStyles();
        addCategoryButtons();
        addTouchScroll();
        addCategoryIcons();

        // Observer for new posts
        const tableObserver = new MutationObserver(debounce(addCategoryIcons, 300));
        const forumTable = document.querySelector('#forums_table tbody');
        if (forumTable) {
            tableObserver.observe(forumTable, { childList: true, subtree: true });
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

    // Start when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
