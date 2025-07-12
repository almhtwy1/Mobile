// ==UserScript==
// @name         Khamsat Categories Enhanced Mobile Friendly
// @namespace    https://khamsat.com/
// @version      2.5
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

    // Highly enhanced categories based on actual data analysis
    const categories = {
        تصميم: {
            exact: ['تصميم', 'مصمم', 'مصممه', 'مصممة', 'ديزاينر', 'جرافيك', 'شعار', 'لوغو', 'لوجو', 'هوية بصرية', 'ui', 'ux'],
            high: ['بوست', 'بوستات', 'منشورات', 'بنر', 'بنرات', 'بانر', 'غلاف', 'بروشور', 'كتالوج', 'انفوجرافيك', 'infographic'],
            medium: ['كانفا', 'canva', 'فوتوشوب', 'photoshop', 'اليستريتور', 'illustrator', 'فيجما', 'figma', 'بطاقة', 'كارت'],
            low: ['صور', 'صورة', 'ثمبنيل', 'thumbnail', 'مصغرة', 'بروفايل', 'profile', 'سوشيال ميديا', 'كولاج'],
            icon: 'fa-palette',
            color: '#17a2b8'
        },
        برمجة: {
            exact: ['برمجة', 'تطوير', 'مبرمج', 'مطور', 'developer', 'موقع', 'مواقع', 'تطبيق', 'تطبيقات', 'ابلكيشن', 'app'],
            high: ['بوت', 'bot', 'سكريبت', 'script', 'api', 'ووردبريس', 'wordpress', 'اندرويد', 'android', 'ios', 'ايفون'],
            medium: ['php', 'javascript', 'js', 'python', 'flutter', 'laravel', 'لارافل', 'nodejs', 'react', 'html', 'css'],
            low: ['ويب', 'web', 'متجر الكتروني', 'ecommerce', 'قاعدة بيانات', 'database', 'سيرفر', 'server', 'استضافة'],
            icon: 'fa-code',
            color: '#28a745'
        },
        تسويق: {
            exact: ['تسويق', 'مسوق', 'marketing', 'اعلان', 'اعلانات', 'اعلانية', 'ممول', 'ممولة', 'حملة', 'حملات'],
            high: ['فيسبوك', 'facebook', 'انستقرام', 'instagram', 'تيك توك', 'tiktok', 'سناب شات', 'snapchat', 'جوجل ادز', 'google ads'],
            medium: ['سيو', 'seo', 'ادارة حسابات', 'سوشيال ميديا', 'social media', 'ترويج', 'نشر', 'تفاعل', 'متابعين'],
            low: ['براند', 'brand', 'مبيعات', 'sales', 'استراتيجية', 'strategy', 'تحليل', 'analytics', 'محتوى تسويقي'],
            icon: 'fa-bullhorn',
            color: '#ffc107'
        },
        كتابة: {
            exact: ['كتابة', 'كاتب', 'كاتبة', 'محتوى', 'مقال', 'مقالات', 'ترجمة', 'مترجم', 'تأليف'],
            high: ['تفريغ', 'تدقيق', 'تحرير', 'صياغة', 'تلخيص', 'ملخص', 'ملخصات', 'سيرة ذاتية', 'cv'],
            medium: ['نص', 'نصوص', 'سيناريو', 'بحث', 'بحوث', 'أكاديمي', 'اكاديمي', 'مراجعة', 'تنسيق'],
            low: ['مدونة', 'blog', 'copywriting', 'محرر', 'editor', 'وصف منتجات', 'كتيب', 'دليل'],
            icon: 'fa-pen',
            color: '#6610f2'
        },
        فيديو: {
            exact: ['فيديو', 'فيديوهات', 'مونتاج', 'مونتير', 'تحرير فيديو', 'video editing', 'انيميشن', 'animation'],
            high: ['موشن جرافيك', 'motion graphics', 'موشن', 'انترو', 'intro', 'ريلز', 'reels', 'شورت', 'shorts'],
            medium: ['اخراج', 'تصوير', 'سينمائي', 'مقطع', 'كليب', 'clip', 'تعديل', 'edit', '3d animation'],
            low: ['يوتيوب', 'youtube', 'تيكتوك', 'اعلان مصور', 'برومو', 'promo', 'تشويقي', 'trailer'],
            icon: 'fa-video',
            color: '#dc3545'
        },
        صوتيات: {
            exact: ['صوت', 'صوتي', 'تعليق صوتي', 'فويس', 'voice', 'فويس اوفر', 'voice over', 'معلق'],
            high: ['موسيقى', 'music', 'تلحين', 'اغنية', 'انشودة', 'انشاد', 'دبلجة', 'dubbing'],
            medium: ['هندسة صوت', 'audio', 'تسجيل', 'recording', 'بودكاست', 'podcast', 'اذاعة', 'radio'],
            low: ['ميكس', 'mix', 'ماسترينغ', 'mastering', 'صوتيه', 'نطق', 'لهجة', 'dialect'],
            icon: 'fa-microphone',
            color: '#FF80AB'
        },
        بيانات: {
            exact: ['بيانات', 'ادخال بيانات', 'data entry', 'اكسل', 'excel', 'جدول', 'spreadsheet'],
            high: ['تنظيف بيانات', 'تحليل بيانات', 'data analysis', 'جمع بيانات', 'data collection', 'scraping'],
            medium: ['pdf', 'csv', 'جوجل شيت', 'google sheets', 'pivot', 'vba', 'قاعدة بيانات', 'database'],
            low: ['تنسيق', 'formatting', 'دمج', 'merge', 'تصدير', 'export', 'استخراج', 'extraction'],
            icon: 'fa-database',
            color: '#FF6347'
        },
        هندسة: {
            exact: ['هندسة', 'مهندس', 'معمار', 'معماري', 'اوتوكاد', 'autocad', 'مخطط'],
            high: ['تصميم داخلي', 'ديكور', 'interior design', 'ريفيت', 'revit', 'sketchup', 'سكتش اب'],
            medium: ['3ds max', 'رسم هندسي', 'technical drawing', 'مدني', 'civil', 'خريطة', 'map'],
            low: ['مشروع هندسي', 'بناء', 'construction', 'تخطيط', 'planning', 'مساحة', 'surveying'],
            icon: 'fa-building',
            color: '#8e44ad'
        },
        أعمال: {
            exact: ['اعمال', 'business', 'ادارة', 'management', 'محاسبة', 'accounting', 'مالية', 'financial'],
            high: ['دراسة جدوى', 'خطة عمل', 'business plan', 'استشارة', 'consulting', 'موارد بشرية', 'hr'],
            medium: ['مشروع', 'project', 'موظف', 'employee', 'سكرتير', 'secretary', 'تمويل', 'funding'],
            low: ['وظائف', 'jobs', 'مندوب', 'sales rep', 'تسعير', 'pricing', 'crm', 'إدارة مشاريع'],
            icon: 'fa-briefcase',
            color: '#fd7e14'
        },
        تعليم: {
            exact: ['تعليم', 'تدريب', 'training', 'مدرس', 'teacher', 'معلم', 'instructor', 'دروس', 'lessons'],
            high: ['كورس', 'course', 'دورة', 'دورات', 'شرح', 'explanation', 'تدريس', 'teaching'],
            medium: ['واجب', 'واجبات', 'homework', 'منصة تعليمية', 'اختبار', 'test', 'امتحان', 'exam'],
            low: ['قرآن', 'quran', 'آيلتس', 'ielts', 'انجليزي', 'english', 'خصوصي', 'private'],
            icon: 'fa-chalkboard-teacher',
            color: '#FA8072'
        },
        'أسلوب حياة': {
            exact: ['حياة', 'lifestyle', 'لياقة', 'fitness', 'ارشاد', 'guidance', 'استشارة نفسية', 'صحة'],
            high: ['طبخ', 'cooking', 'وصفات', 'recipes', 'تخسيس', 'diet', 'رشاقة', 'جمال', 'beauty'],
            medium: ['هواية', 'hobby', 'ترفيه', 'entertainment', 'موضة', 'fashion', 'عناية', 'care'],
            low: ['شخصي', 'personal', 'نصائح', 'tips', 'تطوير الذات', 'self development', 'نفسية', 'psychology'],
            icon: 'fa-heart',
            color: '#20B2AA'
        },
        أخرى: {
            exact: [],
            high: [],
            medium: [],
            low: [],
            icon: 'fa-folder-open',
            color: '#6c757d'
        }
    };

    // Advanced classification with exclusion rules
    const classifyText = (text) => {
        const normalizedText = text.toLowerCase();
        const scores = {};
        
        // Initialize scores
        Object.keys(categories).forEach(cat => {
            if (cat !== 'أخرى') scores[cat] = 0;
        });
        
        // Special exclusion rules to prevent misclassification
        const exclusionRules = {
            'تصميم': {
                'برمجة': ['موقع', 'تطبيق', 'برمجة', 'مبرمج', 'تطوير'],
                'فيديو': ['مونتاج', 'فيديو', 'انيميشن']
            },
            'تسويق': {
                'تصميم': ['بوست', 'منشورات'] // Allow if no marketing keywords
            }
        };
        
        // Scoring with weighted keywords
        Object.entries(categories).forEach(([categoryName, category]) => {
            if (categoryName === 'أخرى') return;
            
            // Exact match keywords (weight: 15)
            category.exact.forEach(keyword => {
                if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 15;
                }
            });
            
            // High priority keywords (weight: 10)
            category.high.forEach(keyword => {
                if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 10;
                }
            });
            
            // Medium priority keywords (weight: 6)
            category.medium.forEach(keyword => {
                if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 6;
                }
            });
            
            // Low priority keywords (weight: 3)
            category.low.forEach(keyword => {
                if (normalizedText.includes(keyword)) {
                    scores[categoryName] += 3;
                }
            });
        });
        
        // Apply exclusion rules
        Object.entries(exclusionRules).forEach(([category, rules]) => {
            Object.entries(rules).forEach(([excludeCategory, keywords]) => {
                const hasExclusionKeywords = keywords.some(keyword => 
                    normalizedText.includes(keyword));
                if (hasExclusionKeywords && scores[excludeCategory] > scores[category]) {
                    scores[category] = Math.min(scores[category], 3);
                }
            });
        });
        
        // Handle specific combinations
        if (normalizedText.includes('موشن جرافيك') || normalizedText.includes('motion')) {
            scores['فيديو'] += 10;
            scores['تصميم'] += 5;
        }
        
        if (normalizedText.includes('ui') || normalizedText.includes('ux')) {
            scores['تصميم'] += 12;
            scores['برمجة'] += 3;
        }
        
        // Boost specific categories for common terms
        if (normalizedText.includes('متجر') && normalizedText.includes('الكتروني')) {
            scores['برمجة'] += 8;
        }
        
        if (normalizedText.includes('اعلان') && normalizedText.includes('ممول')) {
            scores['تسويق'] += 12;
        }
        
        // Get best matches
        const sortedScores = Object.entries(scores)
            .filter(([_, score]) => score > 0)
            .sort(([,a], [,b]) => b - a);
        
        // Return categories with significant scores
        const threshold = Math.max(6, sortedScores[0]?.[1] * 0.3 || 0);
        const result = sortedScores
            .filter(([_, score]) => score >= threshold)
            .slice(0, 2) // Limit to max 2 categories for clarity
            .map(([cat, _]) => cat);
        
        return result.length > 0 ? result : ['أخرى'];
    };

    // Add category icons (optimized)
    const addCategoryIcons = () => {
        document.querySelectorAll('#forums_table tr.forum_post:not([data-categorized])').forEach(row => {
            const link = row.querySelector('.details-td h3 a');
            if (!link) return;

            const matchedCategories = classifyText(link.textContent);
            
            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'display:inline-flex;gap:4px;align-items:center;padding-right:6px;flex-wrap:wrap';

            matchedCategories.forEach(categoryName => {
                const category = categories[categoryName];
                const icon = document.createElement('i');
                icon.className = `fas ${category.icon}`;
                icon.title = categoryName;
                icon.style.cssText = `color:${category.color};font-size:13px;text-shadow:0 1px 1px rgba(0,0,0,0.2)`;
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

    // Create category buttons (unchanged)
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

    // Add category filter buttons (unchanged)
    const addCategoryButtons = () => {
        const container = document.createElement('div');
        container.id = 'cat-buttons-container';
        
        const scrollContainer = document.createElement('div');
        scrollContainer.id = 'cat-buttons-scroll';
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'cat-buttons';

        buttonsContainer.appendChild(
            createCategoryButton('الكل', 'fa-list', '#6c757d', () => filterPosts('الكل'))
        );

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

    // Styles (enhanced)
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
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            #cat-buttons-scroll {
                display: flex;
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: thin;
                padding: 10px 0;
            }
            #cat-buttons-scroll::-webkit-scrollbar {
                height: 4px;
                background-color: rgba(0,0,0,0.1);
                border-radius: 4px;
            }
            #cat-buttons-scroll::-webkit-scrollbar-thumb {
                background-color: rgba(0,0,0,0.3);
                border-radius: 4px;
            }
            #cat-buttons {
                display: flex;
                gap: 6px;
                min-width: max-content;
                padding: 0 4px;
            }
            .cat-btn {
                color: #fff;
                border: none;
                border-radius: 20px;
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 500;
                box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                transition: all 0.2s ease;
                white-space: nowrap;
                min-width: max-content;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                position: relative;
                overflow: hidden;
            }
            .cat-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            .cat-btn:hover::before {
                left: 100%;
            }
            .cat-btn.active-cat {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                filter: brightness(1.1);
            }
            .cat-btn.active-cat::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 60%;
                height: 2px;
                background-color: rgba(255,255,255,0.8);
                border-radius: 2px;
            }
            .cat-btn:hover {
                transform: translateY(-1px);
                filter: brightness(1.05);
            }
            .cat-btn:active {
                transform: translateY(0);
            }
            .cat-btn i {
                font-size: 12px;
                filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
            }
            .details-td h3 a + span i {
                filter: drop-shadow(0 1px 1px rgba(0,0,0,0.3));
            }
            @media screen and (max-width: 767px) {
                .cat-btn {
                    padding: 7px 12px;
                    font-size: 12px;
                }
                #cat-buttons-container {
                    margin: 8px 0;
                    padding: 0 8px;
                }
            }
            @media screen and (max-width: 480px) {
                .cat-btn .cat-text {
                    display: none;
                }
                .cat-btn {
                    padding: 8px;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Touch scroll support (unchanged)
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
            const walk = (x - startX) * 1.5;
            scrollContainer.scrollLeft = scrollLeft - walk;
        });

        // Touch events
        scrollContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        }, { passive: true });

        scrollContainer.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            scrollContainer.scrollLeft = scrollLeft - walk;
        }, { passive: true });
    };

    // Initialize everything
    const initialize = () => {
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

        const tableObserver = new MutationObserver(debounce(addCategoryIcons, 200));
        const forumTable = document.querySelector('#forums_table tbody');
        if (forumTable) {
            tableObserver.observe(forumTable, { childList: true, subtree: true });
        }

        const loadMoreButton = document.getElementById('community_loadmore_btn');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                setTimeout(() => {
                    addCategoryIcons();
                    filterPosts(currentCategory);
                }, 1500);
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
