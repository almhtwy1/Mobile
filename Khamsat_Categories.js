// ==UserScript==
// @name         Khamsat Categories Enhanced v3.1
// @namespace    https://khamsat.com/
// @version      3.1
// @description  تصنيف طلبات خمسات محسن مع دقة عالية وحل مشاكل فئة "أخرى"
// @author       Enhanced Version v3.1
// @match        https://khamsat.com/community/requests*
// @icon         https://khamsat.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const debounce = (fn, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    };

    const categories = {
        تصميم: {
            exact: ['تصميم', 'مصمم', 'مصممة', 'ديزاينر', 'جرافيك', 'شعار', 'لوغو', 'لوجو', 'هوية بصرية', 'ui', 'ux', 'بروفايل'],
            high: ['بوست', 'بوستات', 'منشورات', 'بنر', 'بنرات', 'غلاف', 'بروشور', 'كتالوج', 'انفوجرافيك', 'بروفايل شركة', 'صور مصغرة', 'ثمبنيل'],
            medium: ['كانفا', 'canva', 'فوتوشوب', 'اليستريتور', 'فيجما', 'figma', 'بطاقة', 'تعديل صور'],
            low: ['صور', 'thumbnail', 'مصغرة', 'سوشيال ميديا', 'كولاج'],
            icon: 'fa-palette', color: '#17a2b8'
        },
        برمجة: {
            exact: ['برمجة', 'تطوير', 'مبرمج', 'مطور', 'developer', 'موقع', 'مواقع', 'تطبيق', 'تطبيقات', 'app', 'صفحة هبوط', 'landing page'],
            high: ['بوت', 'bot', 'سكريبت', 'script', 'api', 'ووردبريس', 'wordpress', 'اندرويد', 'android', 'ios', 'متجر الكتروني', 'رفع تطبيق'],
            medium: ['php', 'javascript', 'python', 'flutter', 'laravel', 'nodejs', 'react', 'html', 'css', 'قاعدة بيانات'],
            low: ['ويب', 'web', 'database', 'سيرفر', 'استضافة', 'backend'],
            icon: 'fa-code', color: '#28a745'
        },
        تسويق: {
            exact: ['تسويق', 'مسوق', 'اعلان', 'اعلانات', 'ممول', 'حملة', 'حملات', 'ادسنس', 'adsense', 'seo', 'تحسين محركات', 'تحسين ظهور'],
            high: ['فيسبوك', 'facebook', 'انستقرام', 'instagram', 'تيك توك', 'tiktok', 'سناب شات', 'جوجل ادز', 'ظهور في جوجل', 'زيادة تفاعل', 'قبول ادسنس'],
            medium: ['ادارة حسابات', 'سوشيال ميديا', 'ترويج', 'نشر', 'تفاعل', 'متابعين', 'استشارة تسويقية', 'خطة تسويق', 'نشر اعلان'],
            low: ['براند', 'brand', 'مبيعات', 'sales', 'استراتيجية', 'تحليل', 'analytics'],
            icon: 'fa-bullhorn', color: '#ffc107'
        },
        كتابة: {
            exact: ['كتابة', 'كاتب', 'كاتبة', 'محتوى', 'مقال', 'مقالات', 'ترجمة', 'مترجم', 'تأليف', 'سيرة ذاتية', 'cv', 'تدقيق لغوي'],
            high: ['تفريغ', 'تدقيق', 'تحرير', 'صياغة', 'تلخيص', 'ملخص', 'copywriting', 'كتابة محتوى', 'محتوى تسويقي', 'بحث علمي'],
            medium: ['نص', 'نصوص', 'سيناريو', 'بحث', 'بحوث', 'أكاديمي', 'مراجعة', 'ملخصات'],
            low: ['مدونة', 'blog', 'محرر', 'editor', 'وصف منتجات', 'مراجعات'],
            icon: 'fa-pen', color: '#6610f2'
        },
        فيديو: {
            exact: ['فيديو', 'فيديوهات', 'مونتاج', 'مونتير', 'تحرير فيديو', 'انيميشن', 'animation', 'موشن جرافيك', 'motion graphics'],
            high: ['موشن', 'انترو', 'intro', 'ريلز', 'reels', 'شورت', 'shorts', 'تعديل فيديو', 'تعديل على لوقو'],
            medium: ['اخراج', 'تصوير', 'مقطع', 'كليب', 'clip', 'تعديل', 'edit', 'cgi'],
            low: ['يوتيوب', 'youtube', 'تيكتوك', 'اعلان مصور', 'برومو', 'promo'],
            icon: 'fa-video', color: '#dc3545'
        },
        صوتيات: {
            exact: ['صوت', 'صوتي', 'تعليق صوتي', 'فويس', 'voice', 'فويس اوفر', 'معلق', 'تفريغ صوتي', 'معلق صوتي'],
            high: ['موسيقى', 'music', 'تلحين', 'اغنية', 'انشودة', 'دبلجة', 'dubbing', 'بودكاست', 'podcast', 'هندسة صوت'],
            medium: ['audio', 'تسجيل', 'recording', 'اذاعة', 'تعديل صوت'],
            low: ['ميكس', 'mix', 'ماسترينغ', 'نطق', 'لهجة'],
            icon: 'fa-microphone', color: '#FF80AB'
        },
        بيانات: {
            exact: ['بيانات', 'ادخال بيانات', 'data entry', 'اكسل', 'excel', 'جدول', 'تحويل ملف', 'pdf to word', 'pdf الى word', 'تحويل صور'],
            high: ['تحليل بيانات', 'جمع بيانات', 'scraping', 'تحويل', 'استخراج', 'تنسيق ملف', 'ملف اكسل', 'استخراج بيانات', 'تنسيق متجر'],
            medium: ['pdf', 'csv', 'جوجل شيت', 'google sheets', 'قاعدة بيانات', 'معالجة بيانات', 'تنسيق ملفات'],
            low: ['تنسيق', 'formatting', 'دمج', 'تصدير', 'export'],
            icon: 'fa-database', color: '#FF6347'
        },
        'خدمات رقمية': {
            exact: ['خدمة عملاء', 'مساعد افتراضي', 'مساعد شخصي', 'سكرتير', 'سكرتيرة', 'خدمات عملاء', 'خدمة زبائن'],
            high: ['ادارة حسابات', 'نشر اعلانات', 'رد على العملاء', 'support', 'استقبال', 'مساعد لتنظيم'],
            medium: ['تشغيل', 'ادارة صفحات', 'متابعة', 'رد', 'تواصل', 'عمل داشبورد'],
            low: ['عن بعد', 'remote', 'اونلاين', 'افتراضي', 'virtual'],
            icon: 'fa-headset', color: '#6f42c1'
        },
        استشارات: {
            exact: ['استشارة', 'استشاري', 'مستشار', 'consulting', 'قانونية', 'محامي', 'قانوني', 'استشارة قانونية', 'خبير', 'استشارة تقنية'],
            high: ['legal', 'نفسية', 'دراسة جدوى', 'خطة عمل', 'business plan', 'تقييم مشروع', 'استشارة احترافية', 'خبير سيو'],
            medium: ['تحليل', 'تقييم', 'مراجعة', 'تجارية', 'مالية', 'استشارات', 'شهادات مهنية'],
            low: ['شخصية', 'حياتية', 'مهنية', 'تطوير الذات'],
            icon: 'fa-user-tie', color: '#e83e8c'
        },
        'خدمات تقنية': {
            exact: ['صيانة', 'اصلاح', 'حل مشكلة', 'مشاكل تقنية', 'دعم تقني', 'مشكل', 'دعم فني', 'مشكلة برمجية', 'حل مشكل'],
            high: ['رفع تطبيق', 'نشر تطبيق', 'اعداد', 'تثبيت', 'install', 'setup', 'تكوين', 'اعداد تقني', 'مشكلة تفعيل'],
            medium: ['سيرفر', 'server', 'استضافة', 'hosting', 'امان', 'security', 'backup', 'vps', 'ssl'],
            low: ['فحص', 'اختبار', 'test', 'debug', 'maintenance', 'تحديث'],
            icon: 'fa-tools', color: '#fd7e14'
        },
        تعليم: {
            exact: ['تعليم', 'تدريب', 'مدرس', 'teacher', 'معلم', 'معلمة', 'استاذ', 'مدرب', 'دروس', 'تدريس', 'شرح', 'تأسيس طالب'],
            high: ['كورس', 'course', 'دورة', 'دورات', 'دروس خصوصية', 'حصص', 'لغة انجليزية', 'انجليزي', 'منصة تعليمية'],
            medium: ['واجب', 'اختبار', 'test', 'امتحان', 'exam', 'منهج', 'شرح مادة', 'اعداد عروض', 'تعليمي'],
            low: ['قرآن', 'quran', 'آيلتس', 'ielts', 'english', 'خصوصي', 'شروحات'],
            icon: 'fa-chalkboard-teacher', color: '#FA8072'
        },
        أعمال: {
            exact: ['اعمال', 'business', 'ادارة', 'management', 'محاسبة', 'accounting', 'مالية', 'محاسب', 'حسابات', 'ادارة حساب'],
            high: ['موارد بشرية', 'hr', 'وظائف', 'jobs', 'توظيف', 'موظف', 'ادارة مالية', 'حساب الأداء', 'موظف مبيعات'],
            medium: ['مشروع', 'project', 'تمويل', 'مبيعات', 'sales', 'تجارة', 'commerce', 'ادارة متجر'],
            low: ['تسعير', 'pricing', 'crm', 'إدارة مشاريع', 'عقود', 'contracts'],
            icon: 'fa-briefcase', color: '#20c997'
        },
        أخرى: { exact: [], high: [], medium: [], low: [], icon: 'fa-folder-open', color: '#6c757d' }
    };

    const classifyText = (text) => {
        const normalizedText = text.toLowerCase();
        const scores = {};
        
        Object.keys(categories).forEach(cat => {
            if (cat !== 'أخرى') scores[cat] = 0;
        });
        
        // ENHANCED RESCUE PATTERNS - حل مشاكل فئة "أخرى"
        const enhancedRescuePatterns = {
            // مشاكل رئيسية في فئة أخرى
            'رفع ابلكيشن|رفع تطبيق|نشر تطبيق|جوجل بلاي': 'خدمات تقنية',
            'محامي|قانوني|استشارة قانونية|مذكرة رد|دعوى': 'استشارات',
            'صفحة هبوط|landing page|صفحات هبوط': 'برمجة',
            'تحويل ملف|pdf to word|pdf الى word': 'بيانات',
            'معلم|مدرس|استاذ|تدريس|دروس|شرح': 'تعليم',
            'محاسب|محاسبة|حسابات مالية|مالي': 'أعمال',
            'دعم فني|حل مشكلة|مشكل تقني|صيانة': 'خدمات تقنية',
            'بروفايل شركة|ملف شركة|بروفايل|معرض أعمال': 'تصميم',
            'تعديل على لوقو|تحسين شعار|اعادة تصميم': 'تصميم',
            'عرض بوربوينت|بوربوينت|powerpoint|عرض تقديمي': 'تصميم',
            'برنامج كاشير|برنامج ادارة|نظام ادارة': 'أعمال',
            'ترقية اضافة|اضافة منتجات|plugin': 'خدمات تقنية',
            'استبيان|عمل استبيان|ملء استبيان': 'بيانات',
            'زيارات لمدونتي|زيادة زيارات|ترويج موقع': 'تسويق',
            'شخص يرسل رسائل|ارسال رسائل|رسائل بريد': 'خدمات رقمية',
            'حساب قيمة|حساب كميات|عمل نوتة': 'أعمال',
            'مساعده في بايثون|برنامج python|كود python': 'برمجة',
            'تعديل بسيط في برامج|تعديل برنامج': 'برمجة',
            'load balancer|سيرفر|استضافة': 'خدمات تقنية',
            'نموذج بحثي|بحث علمي|دراسة بحثية': 'كتابة',
            'صانع محتوي|منتج محترف|كاتب محتوى': 'كتابة',
            'اسم براند|اسم تجاري|اقتراح اسم': 'تسويق',
            'شراء نطاق|استضافة بريد|نطاق': 'خدمات تقنية',
            'خبير بالإكسل|محترف اكسل|ملف اكسل': 'بيانات',
            'برامج ارشفه|ارشفة|باك لينك': 'تسويق',
            'خدمة shop drawing|رسم technical|رسم': 'تصميم'
        };

        // Apply enhanced rescue patterns first
        for (const [pattern, category] of Object.entries(enhancedRescuePatterns)) {
            const keywords = pattern.split('|');
            if (keywords.some(keyword => normalizedText.includes(keyword))) {
                scores[category] += 25;
            }
        }
        
        // CRITICAL FIX: Handle "تصميم موقع/تطبيق"
        if ((normalizedText.includes('تصميم') || normalizedText.includes('design')) && 
            (normalizedText.includes('موقع') || normalizedText.includes('تطبيق') || 
             normalizedText.includes('متجر') || normalizedText.includes('website') || 
             normalizedText.includes('app'))) {
            scores['برمجة'] += 25;
            scores['تصميم'] = Math.max(0, scores['تصميم'] - 15);
        }

        // Enhanced context rules
        if (/ui|ux|واجهات|تجربة مستخدم/.test(normalizedText)) {
            scores['تصميم'] += 15; scores['برمجة'] += 8;
        }
        if (/موشن جرافيك|motion graphics|موشن/.test(normalizedText)) {
            scores['فيديو'] += 18; scores['تصميم'] += 8;
        }
        if (/تفريغ.*صوتي|تفريغ.*فيديو/.test(normalizedText)) {
            scores['صوتيات'] += 15; scores['كتابة'] += 5;
        }
        if (/seo|ادسنس|adsense|تحسين محركات|ظهور.*جوجل|قبول.*ادسنس/.test(normalizedText)) {
            scores['تسويق'] += 18;
        }
        if (/صفحة هبوط|landing page/.test(normalizedText)) {
            scores['برمجة'] += 20; scores['تصميم'] += 5;
        }
        if (/رفع.*تطبيق|نشر.*تطبيق|جوجل بلاي|app store/.test(normalizedText)) {
            scores['خدمات تقنية'] += 18;
        }

        // Standard scoring
        Object.entries(categories).forEach(([categoryName, category]) => {
            if (categoryName === 'أخرى') return;
            
            category.exact.forEach(keyword => {
                if (normalizedText.includes(keyword)) scores[categoryName] += 20;
            });
            category.high.forEach(keyword => {
                if (normalizedText.includes(keyword)) scores[categoryName] += 12;
            });
            category.medium.forEach(keyword => {
                if (normalizedText.includes(keyword)) scores[categoryName] += 6;
            });
            category.low.forEach(keyword => {
                if (normalizedText.includes(keyword)) scores[categoryName] += 2;
            });
        });
        
        const sortedScores = Object.entries(scores).filter(([_, score]) => score > 0).sort(([,a], [,b]) => b - a);
        const threshold = Math.max(12, sortedScores[0]?.[1] * 0.4 || 0);
        let result = sortedScores.filter(([_, score]) => score >= threshold).slice(0, 1).map(([cat, _]) => cat);
        
        if (result.length === 0 && sortedScores.length > 0) {
            result = [sortedScores[0][0]];
        }
        
        return result.length > 0 ? result : ['أخرى'];
    };

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

    const addCategoryButtons = () => {
        const container = document.createElement('div');
        container.id = 'cat-buttons-container';
        const scrollContainer = document.createElement('div');
        scrollContainer.id = 'cat-buttons-scroll';
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'cat-buttons';

        buttonsContainer.appendChild(createCategoryButton('الكل', 'fa-list', '#6c757d', () => filterPosts('الكل')));
        Object.entries(categories).forEach(([name, category]) => {
            buttonsContainer.appendChild(createCategoryButton(name, category.icon, category.color, () => filterPosts(name)));
        });

        scrollContainer.appendChild(buttonsContainer);
        container.appendChild(scrollContainer);
        const forumElement = document.querySelector('#forum-requests');
        if (forumElement) forumElement.prepend(container);
    };

    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            #cat-buttons-container {margin:10px 0;position:relative;display:flex;align-items:center;width:100%;direction:rtl;padding:0 10px}
            #cat-buttons-scroll {display:flex;width:100%;overflow-x:auto;overflow-y:hidden;scroll-behavior:smooth;-webkit-overflow-scrolling:touch;scrollbar-width:thin;padding:8px 0;position:relative}
            #cat-buttons-scroll::-webkit-scrollbar {height:4px;background-color:#f1f1f1;border-radius:4px}
            #cat-buttons-scroll::-webkit-scrollbar-thumb {background-color:#888;border-radius:4px}
            #cat-buttons-scroll::-webkit-scrollbar-thumb:hover {background-color:#555}
            #cat-buttons {display:flex;gap:8px;min-width:max-content;padding:0 4px}
            .cat-btn {color:#fff;border:none;border-radius:25px;padding:6px 14px;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:13px;box-shadow:0 2px 3px rgba(0,0,0,0.2);transition:all 0.3s ease;white-space:nowrap;min-width:max-content;user-select:none;-webkit-tap-highlight-color:transparent}
            .cat-btn.active-cat {transform:translateY(-2px);box-shadow:0 4px 6px rgba(0,0,0,0.25);position:relative}
            .cat-btn.active-cat::after {content:'';position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);width:30%;height:3px;background-color:currentColor;border-radius:3px}
            .cat-btn:hover {transform:translateY(-1px);opacity:0.9}
            .cat-btn:active {transform:translateY(0);opacity:0.8}
            .cat-btn i {font-size:12px}
            @media screen and (max-width:767px) {
                .details-td h3 {font-size:14px;line-height:1.3;margin-bottom:5px}
                .details-td .date {font-size:11px}
                .author-td {padding:5px !important}
                .author-td .author {font-size:12px}
                .details-td h3 a + span {margin-top:3px}
                .cat-btn {padding:8px 14px}
            }
            @media screen and (max-width:480px) {
                .cat-btn {padding:8px 12px}
                .cat-btn .cat-text {font-size:12px}
            }
        `;
        document.head.appendChild(style);
    };

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
