// ==UserScript==
// @name         Khamsat Categories Smart Filter
// @namespace    https://khamsat.com/
// @version      2.0
// @description  تصنيف ذكي لطلبات خمسات باستخدام نظام النقاط المتقدم
// @author       Smart Filter
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

    // Smart Categories configuration with scoring system
    const categories = {
        تصميم: {
            keywords: [
                {word: 'تصميم', score: 10},
                {word: 'لوغو', score: 10},
                {word: 'شعار', score: 10},
                {word: 'مصمم', score: 8},
                {word: 'مصممه', score: 8},
                {word: 'مصممين', score: 8},
                {word: 'جرافيك', score: 8},
                {word: 'هوية', score: 8},
                {word: 'canva', score: 6},
                {word: 'كانفا', score: 6},
                {word: 'شعارات', score: 6},
                {word: 'تصاميم', score: 6},
                {word: 'صور', score: 4},
                {word: 'صوره', score: 4},
                {word: 'صورة', score: 4},
                {word: 'بوستات', score: 4},
                {word: 'بوست', score: 4},
                {word: 'ui', score: 6},
                {word: 'ux', score: 6},
                {word: 'بوستر', score: 5},
                {word: 'غلاف', score: 5},
                {word: 'بروشور', score: 5},
                {word: 'بانر', score: 5},
                {word: 'انفوجرافيك', score: 7},
                {word: 'فوتوشوب', score: 6},
                {word: 'اليستريتور', score: 6}
            ],
            icon: 'fa-palette',
            color: '#17a2b8'
        },
        
        كتابة: {
            keywords: [
                {word: 'كتابة', score: 10},
                {word: 'لكتابة', score: 10},
                {word: 'لكتابه', score: 10},
                {word: 'كاتب', score: 8},
                {word: 'محتوى', score: 8},
                {word: 'مقالات', score: 8},
                {word: 'مقال', score: 8},
                {word: 'ترجمة', score: 9},
                {word: 'ترجمه', score: 9},
                {word: 'تفريغ', score: 7},
                {word: 'تأليف', score: 7},
                {word: 'مدونة', score: 6},
                {word: 'نص', score: 5},
                {word: 'سيناريو', score: 7},
                {word: 'سيو', score: 6},
                {word: 'تلخيص', score: 6},
                {word: 'سيرة ذاتية', score: 6},
                {word: 'بحث', score: 5},
                {word: 'تدقيق', score: 6},
                {word: 'تحرير', score: 6},
                {word: 'صياغة', score: 6}
            ],
            icon: 'fa-pen',
            color: '#6610f2'
        },
        
        تسويق: {
            keywords: [
                {word: 'تسويق', score: 10},
                {word: 'تسويقي', score: 10},
                {word: 'تسويقية', score: 10},
                {word: 'التسويق', score: 10},
                {word: 'للتسويق', score: 10},
                {word: 'اعلان', score: 8},
                {word: 'اعلانات', score: 8},
                {word: 'حملات', score: 8},
                {word: 'ads', score: 7},
                {word: 'marketing', score: 9},
                {word: 'فيسبوك', score: 6},
                {word: 'انستقرام', score: 6},
                {word: 'سناب', score: 6},
                {word: 'ادارة حسابات', score: 7},
                {word: 'مبيعات', score: 6},
                {word: 'ترويج', score: 6},
                {word: 'جوجل أدز', score: 7},
                {word: 'ادسنس', score: 6},
                {word: 'حملات ممولة', score: 8},
                {word: 'سوشيال ميديا', score: 7},
                {word: 'تيك توك', score: 5}
            ],
            icon: 'fa-bullhorn',
            color: '#ffc107'
        },
        
        برمجة: {
            keywords: [
                {word: 'برمجة', score: 10},
                {word: 'مبرمج', score: 10},
                {word: 'تطوير', score: 9},
                {word: 'تطبيق', score: 8},
                {word: 'تطبيقات', score: 8},
                {word: 'موقع', score: 8},
                {word: 'مواقع', score: 8},
                {word: 'ويب', score: 7},
                {word: 'اندرويد', score: 7},
                {word: 'ios', score: 7},
                {word: 'wordpress', score: 6},
                {word: 'بوت', score: 6},
                {word: 'php', score: 6},
                {word: 'javascript', score: 6},
                {word: 'js', score: 5},
                {word: 'html', score: 5},
                {word: 'css', score: 5},
                {word: 'بايثون', score: 6},
                {word: 'فلاتر', score: 6},
                {word: 'لارافل', score: 6},
                {word: 'api', score: 6},
                {word: 'تكويد', score: 7},
                {word: 'كود', score: 6},
                {word: 'متجر', score: 5}
            ],
            icon: 'fa-code',
            color: '#28a745'
        },
        
        فيديو: {
            keywords: [
                {word: 'فيديو', score: 10},
                {word: 'الفيديو', score: 10},
                {word: 'فيديوهات', score: 9},
                {word: 'الفيديوهات', score: 9},
                {word: 'مونتاج', score: 10},
                {word: 'مونتير', score: 9},
                {word: 'موشن', score: 8},
                {word: 'انيميشن', score: 8},
                {word: 'animation', score: 8},
                {word: 'فيلم', score: 7},
                {word: 'انترو', score: 7},
                {word: 'تحريك', score: 7},
                {word: 'edit', score: 6},
                {word: 'اخراج', score: 6},
                {word: 'تعديل ألوان', score: 6},
                {word: 'ترانزيشن', score: 5},
                {word: 'videographer', score: 7}
            ],
            icon: 'fa-video',
            color: '#dc3545'
        },
        
        هندسة: {
            keywords: [
                {word: 'هندسة', score: 10},
                {word: 'مهندس', score: 9},
                {word: 'معمار', score: 8},
                {word: 'معماري', score: 8},
                {word: 'مدني', score: 7},
                {word: 'خريطة', score: 6},
                {word: 'خرائط', score: 6},
                {word: 'مخطط', score: 7},
                {word: 'ميكانيكي', score: 7},
                {word: 'تصميم داخلي', score: 7},
                {word: 'ديكور', score: 6},
                {word: 'أوتوكاد', score: 7},
                {word: 'ريفيت', score: 7},
                {word: 'sketchup', score: 6},
                {word: '3ds max', score: 6}
            ],
            icon: 'fa-building',
            color: '#8e44ad'
        },
        
        أعمال: {
            keywords: [
                {word: 'اعمال', score: 8},
                {word: 'ادارة', score: 7},
                {word: 'محاسبة', score: 8},
                {word: 'مالية', score: 7},
                {word: 'قانونية', score: 7},
                {word: 'دراسة جدوى', score: 9},
                {word: 'خطة عمل', score: 8},
                {word: 'مشروع', score: 6},
                {word: 'موظف', score: 5},
                {word: 'موظفين', score: 5},
                {word: 'سكرتير', score: 6},
                {word: 'مندوب', score: 5},
                {word: 'تمويل', score: 6},
                {word: 'تسعير', score: 6},
                {word: 'موارد بشرية', score: 7}
            ],
            icon: 'fa-briefcase',
            color: '#fd7e14'
        },
        
        صوتيات: {
            keywords: [
                {word: 'صوت', score: 9},
                {word: 'صوتي', score: 9},
                {word: 'تعليق', score: 8},
                {word: 'فويس', score: 8},
                {word: 'موسيقى', score: 7},
                {word: 'هندسة صوت', score: 9},
                {word: 'تلحين', score: 7},
                {word: 'اغنية', score: 6},
                {word: 'إنشاد', score: 6},
                {word: 'انشودة', score: 6},
                {word: 'إلقاء', score: 6},
                {word: 'فويس أوفر', score: 8},
                {word: 'دبلجة', score: 7},
                {word: 'بودكاست', score: 7}
            ],
            icon: 'fa-microphone',
            color: '#FF80AB'
        },
        
        تعليم: {
            keywords: [
                {word: 'تعليم', score: 10},
                {word: 'التعليم', score: 10},
                {word: 'تعليمية', score: 9},
                {word: 'مدرس', score: 8},
                {word: 'معلم', score: 8},
                {word: 'معلمة', score: 8},
                {word: 'تدريب', score: 7},
                {word: 'تدريبية', score: 7},
                {word: 'دروس', score: 7},
                {word: 'كورس', score: 7},
                {word: 'دورات', score: 7},
                {word: 'شرح', score: 6},
                {word: 'تدريس', score: 7},
                {word: 'خصوصي', score: 6},
                {word: 'الواجب', score: 6},
                {word: 'حل واجبات', score: 7},
                {word: 'آيلتس', score: 6},
                {word: 'قرآن', score: 5}
            ],
            icon: 'fa-chalkboard-teacher',
            color: '#FA8072'
        },
        
        بيانات: {
            keywords: [
                {word: 'بيانات', score: 10},
                {word: 'البيانات', score: 10},
                {word: 'ادخال', score: 8},
                {word: 'تنظيف', score: 7},
                {word: 'تحليل', score: 8},
                {word: 'جمع', score: 6},
                {word: 'scraping', score: 8},
                {word: 'اكسل', score: 7},
                {word: 'إكسل', score: 7},
                {word: 'excel', score: 7},
                {word: 'pdf', score: 5},
                {word: 'sql', score: 7},
                {word: 'database', score: 8},
                {word: 'جوجل شيت', score: 6},
                {word: 'sharepoint', score: 6},
                {word: 'vba', score: 6},
                {word: 'pivot', score: 6},
                {word: 'csv', score: 5}
            ],
            icon: 'fa-database',
            color: '#FF6347'
        },
        
        'أسلوب حياة': {
            keywords: [
                {word: 'حياة', score: 7},
                {word: 'لياقة', score: 8},
                {word: 'ارشاد', score: 7},
                {word: 'استشارة', score: 7},
                {word: 'طبخ', score: 6},
                {word: 'صحة', score: 6},
                {word: 'هواية', score: 5},
                {word: 'ترفيه', score: 5},
                {word: 'شخصي', score: 5},
                {word: 'رشاقة', score: 6},
                {word: 'جمال', score: 5},
                {word: 'موضة', score: 5},
                {word: 'نصائح', score: 5},
                {word: 'عناية', score: 5},
                {word: 'وصفات طبخ', score: 6},
                {word: 'تخسيس', score: 6}
            ],
            icon: 'fa-heart',
            color: '#20B2AA'
        },
        
        أخرى: {
            keywords: [],
            icon: 'fa-folder-open',
            color: '#6c757d'
        }
    };

    // Smart categorization function using scoring system
    const calculateCategoryScore = (text) => {
        const scores = {};
        const lowerText = text.toLowerCase();
        
        Object.entries(categories).forEach(([categoryName, category]) => {
            scores[categoryName] = 0;
            
            category.keywords.forEach(keywordObj => {
                // Check for exact word match and partial matches
                if (lowerText.includes(keywordObj.word.toLowerCase())) {
                    scores[categoryName] += keywordObj.score;
                    
                    // Bonus points for exact word boundaries
                    const wordRegex = new RegExp(`\\b${keywordObj.word.toLowerCase()}\\b`, 'i');
                    if (wordRegex.test(lowerText)) {
                        scores[categoryName] += Math.floor(keywordObj.score * 0.3);
                    }
                }
            });
        });
        
        return scores;
    };

    // Get the best matching category
    const getBestCategory = (text) => {
        const scores = calculateCategoryScore(text);
        let bestCategory = 'أخرى';
        let highestScore = 0;
        
        Object.entries(scores).forEach(([category, score]) => {
            if (category !== 'أخرى' && score > highestScore) {
                highestScore = score;
                bestCategory = category;
            }
        });
        
        // Minimum score threshold to avoid false positives
        return highestScore >= 4 ? bestCategory : 'أخرى';
    };

    // Add category icons to requests with smart classification
    const addCategoryIcons = () => {
        document.querySelectorAll('#forums_table tr.forum_post:not([data-categorized])').forEach(row => {
            const link = row.querySelector('.details-td h3 a');
            if (!link) return;

            const text = link.textContent;
            const bestCategory = getBestCategory(text);
            const matchedCategories = [bestCategory];

            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'display:inline-flex;gap:5px;align-items:center;padding-right:5px';

            const category = categories[bestCategory];
            const icon = document.createElement('i');
            icon.className = `fas ${category.icon}`;
            icon.title = bestCategory;
            icon.style.cssText = `color:${category.color};font-size:14px`;
            iconSpan.appendChild(icon);

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
        
        if (name === 'الكل') {
            button.classList.add('active-cat');
        }
        
        return button;
    };

    // Add category filter buttons
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
                
                .details-td h3 a + span {
                    margin-top: 3px;
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

    // Add touch scroll support
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
            const walk = (x - startX) * 2;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

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

    // Scroll to active category
    const scrollToActiveCategory = () => {
        const scrollContainer = document.getElementById('cat-buttons-scroll');
        const activeButton = document.querySelector('.cat-btn.active-cat');
        
        if (scrollContainer && activeButton) {
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

    // Adapt UI to device
    const adaptUIToDevice = () => {
        const isMobile = window.innerWidth <= 767;
        
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
        
        document.body.classList.toggle('khamsat-mobile', isMobile);
    };

    // Initialize the script
    const initialize = () => {
        // Ensure Font Awesome is loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            document.head.appendChild(link);
        }

        addStyles();
        addCategoryButtons();
        addTouchScroll();
        adaptUIToDevice();
        window.addEventListener('resize', adaptUIToDevice);

        // Initial categorization
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

        // Handle category button clicks
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

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
