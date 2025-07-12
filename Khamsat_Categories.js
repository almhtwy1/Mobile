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

    // Enhanced categories with new additions based on data analysis
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
            exact: ['تسويق', 'مسوق', 'marketing', 'اعلان', 'اعلانات', 'اعلانية', 'ممول', 'ممولة', 'حملة', 'حملات', 'ادسنس', 'adsense'],
            high: ['فيسبوك', 'facebook', 'انستقرام', 'instagram', 'تيك توك', 'tiktok', 'سناب شات', 'snapchat', 'جوجل ادز', 'google ads', 'تحسين محركات'],
            medium: ['سيو', 'seo', 'ادارة حسابات', 'سوشيال ميديا', 'social media', 'ترويج', 'نشر', 'تفاعل', 'متابعين', 'زيادة تفاعل'],
            low: ['براند', 'brand', 'مبيعات', 'sales', 'استراتيجية', 'strategy', 'تحليل', 'analytics', 'محتوى تسويقي', 'ظهور في جوجل'],
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
            exact: ['فيديو', 'فيديوهات', 'مونتاج', 'مونتير', 'تحرير فيديو', 'video editing', 'انيميشن', 'animation', 'video editor'],
            high: ['موشن جرافيك', 'motion graphics', 'موشن', 'انترو', 'intro', 'ريلز', 'reels', 'شورت', 'shorts', 'مونتير محترف'],
            medium: ['اخراج', 'تصوير', 'سينمائي', 'مقطع', 'كليب', 'clip', 'تعديل', 'edit', '3d animation', 'تحرير'],
            low: ['يوتيوب', 'youtube', 'تيكتوك', 'اعلان مصور', 'برومو', 'promo', 'تشويقي', 'trailer', 'مقاطع'],
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
            exact: ['بيانات', 'ادخال بيانات', 'data entry', 'اكسل', 'excel', 'جدول', 'spreadsheet', 'تحويل ملف', 'pdf to word'],
            high: ['تنظيف بيانات', 'تحليل بيانات', 'data analysis', 'جمع بيانات', 'data collection', 'scraping', 'تحويل', 'استخراج'],
            medium: ['pdf', 'csv', 'جوجل شيت', 'google sheets', 'pivot', 'vba', 'قاعدة بيانات', 'database', 'تنسيق ملفات'],
            low: ['تنسيق', 'formatting', 'دمج', 'merge', 'تصدير', 'export', 'معالجة ملفات', 'تحويل صور'],
            icon: 'fa-database',
            color: '#FF6347'
        },
        'خدمات رقمية': {
            exact: ['خدمة عملاء', 'دعم فني', 'مساعد افتراضي', 'مساعد شخصي', 'سكرتير', 'سكرتيرة'],
            high: ['ادارة حسابات', 'نشر اعلانات', 'رد على العملاء', 'خدمات عملاء', 'support', 'استقبال'],
            medium: ['تشغيل', 'ادارة صفحات', 'متابعة', 'رد', 'اجابة', 'تواصل', 'موظف خدمة'],
            low: ['عن بعد', 'remote', 'اونلاين', 'online', 'افتراضي', 'virtual', 'chat'],
            icon: 'fa-headset',
            color: '#6f42c1'
        },
        استشارات: {
            exact: ['استشارة', 'استشاري', 'مستشار', 'consulting', 'مشورة', 'قانونية', 'محامي'],
            high: ['قانوني', 'legal', 'نفسية', 'دراسة جدوى', 'خطة عمل', 'business plan'],
            medium: ['تحليل', 'تقييم', 'مراجعة', 'تجارية', 'مالية', 'استشارات'],
            low: ['شخصية', 'حياتية', 'مهنية', 'تطوير الذات', 'ارشاد', 'توجيه'],
            icon: 'fa-user-tie',
            color: '#e83e8c'
        },
        'خدمات تقنية': {
            exact: ['صيانة', 'اصلاح', 'حل مشكلة', 'مشاكل تقنية', 'دعم تقني', 'تقني', 'مشكل'],
            high: ['رفع تطبيق', 'نشر تطبيق', 'اعداد', 'تثبيت', 'install', 'setup', 'تكوين', 'إعداد'],
            medium: ['سيرفر', 'server', 'استضافة', 'hosting', 'امان', 'security', 'backup', 'vps', 'ssl'],
            low: ['فحص', 'اختبار', 'test', 'debug', 'troubleshooting', 'maintenance', 'تحديث', 'upgrade'],
            icon: 'fa-tools',
            color: '#fd7e14'
        },
        تعليم: {
            exact: ['تعليم', 'تدريب', 'training', 'مدرس', 'teacher', 'معلم', 'instructor', 'دروس', 'lessons', 'اختبار القدرات'],
            high: ['كورس', 'course', 'دورة', 'دورات', 'شرح', 'explanation', 'تدريس', 'teaching', 'تأسيس طالب', 'دروس خصوصية'],
            medium: ['واجب', 'واجبات', 'homework', 'منصة تعليمية', 'اختبار', 'test', 'امتحان', 'exam', 'اكاديمي', 'لغة انجليزية'],
            low: ['قرآن', 'quran', 'آيلتس', 'ielts', 'انجليزي', 'english', 'خصوصي', 'private', 'تعليمي', 'شروحات'],
            icon: 'fa-chalkboard-teacher',
            color: '#FA8072'
        },
        أعمال: {
            exact: ['اعمال', 'business', 'ادارة', 'management', 'محاسبة', 'accounting', 'مالية', 'financial', 'محاسب'],
            high: ['موارد بشرية', 'hr', 'وظائف', 'jobs', 'توظيف', 'recruitment', 'موظف', 'employee', 'ادارة مالية', 'تقارير مالية'],
            medium: ['مشروع', 'project', 'تمويل', 'funding', 'مبيعات', 'sales', 'تجارة', 'commerce', 'حسابات', 'مدير مالي'],
            low: ['تسعير', 'pricing', 'crm', 'إدارة مشاريع', 'عقود', 'contracts', 'حساب الأداء', 'أداء مالي'],
            icon: 'fa-briefcase',
            color: '#20c997'
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
        
        // Handle specific combinations and exclusions
        if (normalizedText.includes('موشن جرافيك') || normalizedText.includes('motion')) {
            scores['فيديو'] += 12;
            scores['تصميم'] += 5;
        }
        
        if (normalizedText.includes('ui') || normalizedText.includes('ux')) {
            scores['تصميم'] += 12;
            scores['برمجة'] += 3;
        }
        
        // Enhanced rules for better classification
        
        // Fix "تصميم موقع" issue - should be برمجة not تصميم
        if ((normalizedText.includes('تصميم موقع') || normalizedText.includes('تصميم تطبيق')) && 
            !normalizedText.includes('شعار') && !normalizedText.includes('لوجو')) {
            scores['برمجة'] += 15;
            scores['تصميم'] = Math.max(0, scores['تصميم'] - 8);
        }
        
        // Handle موشن جرافيك properly
        if (normalizedText.includes('موشن جرافيك') || normalizedText.includes('motion')) {
            scores['فيديو'] += 12;
            scores['تصميم'] += 5;
        }
        
        if (normalizedText.includes('ui') || normalizedText.includes('ux')) {
            scores['تصميم'] += 12;
            scores['برمجة'] += 3;
        }
        
        // Technical issues and setup should be خدمات تقنية not خدمات رقمية
        if (normalizedText.includes('مشكل') || normalizedText.includes('مشكلة') || 
            normalizedText.includes('اعداد') || normalizedText.includes('تثبيت')) {
            scores['خدمات تقنية'] += 8;
            scores['خدمات رقمية'] = Math.max(0, scores['خدمات رقمية'] - 5);
        }
        
        // File conversion should be بيانات
        if ((normalizedText.includes('تحويل') && (normalizedText.includes('ملف') || 
            normalizedText.includes('pdf') || normalizedText.includes('word'))) ||
            normalizedText.includes('pdf to word') || normalizedText.includes('تحويل صور')) {
            scores['بيانات'] += 12;
            scores['أخرى'] = 0; // Remove from أخرى
        }
        
        // Logo editing should be تصميم
        if (normalizedText.includes('تعديل') && (normalizedText.includes('لوجو') || 
            normalizedText.includes('شعار') || normalizedText.includes('logo'))) {
            scores['تصميم'] += 10;
        }
        
        // Boost specific categories for common terms
        if (normalizedText.includes('متجر') && normalizedText.includes('الكتروني')) {
            scores['برمجة'] += 8;
        }
        
        if (normalizedText.includes('اعلان') && normalizedText.includes('ممول')) {
            scores['تسويق'] += 12;
        }
        
        // AdSense and SEO should be تسويق
        if (normalizedText.includes('ادسنس') || normalizedText.includes('adsense') ||
            (normalizedText.includes('تحسين') && normalizedText.includes('محركات')) ||
            normalizedText.includes('تفاعل')) {
            scores['تسويق'] += 10;
        }
        
        // Accounting should be أعمال
        if (normalizedText.includes('محاسب') || normalizedText.includes('محاسبة') ||
            normalizedText.includes('حسابات') || normalizedText.includes('مالي')) {
            scores['أعمال'] += 10;
        }
        
        // Data analysis should be بيانات not استشارات
        if (normalizedText.includes('تحليل') && (normalizedText.includes('بيانات') || 
            normalizedText.includes('احصائي') || normalizedText.includes('اكسل'))) {
            scores['بيانات'] += 10;
            scores['استشارات'] = Math.max(0, scores['استشارات'] - 3);
        }
        
        // Get best matches
        const sortedScores = Object.entries(scores)
            .filter(([_, score]) => score > 0)
            .sort(([,a], [,b]) => b - a);
        
        // Return single category for clarity (max 1 instead of 2)
        const threshold = Math.max(8, sortedScores[0]?.[1] * 0.4 || 0);
        const result = sortedScores
            .filter(([_, score]) => score >= threshold)
            .slice(0, 1) // Single category only for better precision
            .map(([cat, _]) => cat);
        
        return result.length > 0 ? result : ['أخرى'];
    };

    // Add category icons (restored to original design)
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

    // Styles (restored to original with improvements)
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
