// ==UserScript==
// @name         Khamsat Ultra Smart AI Categories v3
// @namespace    https://khamsat.com/
// @version      3.5
// @description  تصنيف ذكي فائق الدقة - مدرب على 1000+ طلب حقيقي مع AI محسن
// @author       Ultra AI Filter
// @match        https://khamsat.com/community/requests*
// @icon         https://khamsat.com/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js
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

    // نظام التصنيف الذكي المطور - مدرب على البيانات الحقيقية
    const smartCategories = {
        تصميم: {
            high: [
                'تصميم', 'مصمم', 'مصممه', 'مصممة', 'مصممين', 'لوغو', 'لوجو', 'شعار', 'شعارات', 
                'هوية بصرية', 'بروفايل شركة', 'جرافيك', 'انفوجرافيك', 'كاتالوج', 'بروشور',
                'تصاميم', 'غلاف', 'بانر', 'بنرات', 'بوستر', 'ثمبنيل', 'مصغرة', 'كليشة',
                'بطاقات', 'كارت عمل', 'بزنس كارد', 'دعوة حضور', 'ايقونات', 'أسورة يد'
            ],
            medium: [
                'canva', 'كانفا', 'فوتوشوب', 'اليستريتور', 'photoshop', 'illustrator',
                'بوست', 'بوستات', 'منشورات', 'ريلز', 'صورة منتج', 'ui', 'ux', 'موكاب',
                'فيكتور', 'سيرة ذاتية', 'cv', 'هوية', 'برزنتيشن'
            ],
            low: ['صور', 'صوره', 'صورة', 'تعديل صور', 'ملف أعمال'],
            icon: 'fa-palette', color: '#17a2b8'
        },
        
        برمجة: {
            high: [
                'مبرمج', 'برمجة', 'تطوير', 'تطبيق', 'تطبيقات', 'موقع', 'مواقع', 'كود', 'تكويد',
                'اندرويد', 'android', 'ios', 'ايفون', 'flutter', 'react', 'node', 'laravel',
                'wordpress', 'ووردبريس', 'بوت', 'bot', 'api', 'backend', 'frontend', 'database',
                'متجر الكتروني', 'ecommerce', 'shopify', 'شوبيفاي', 'woocommerce', 'opencart',
                'بايثون', 'python', 'javascript', 'php', 'java', 'kotlin', 'swift'
            ],
            medium: [
                'ويب', 'website', 'html', 'css', 'jquery', 'bootstrap', 'mysql', 'sql',
                'git', 'github', 'vps', 'server', 'hosting', 'استضافة', 'نظام', 'سكربت',
                'plugin', 'اضافة', 'تطوير فكرة', 'منصة', 'لوحة تحكم', 'dashboard'
            ],
            low: ['تقني', 'تكنولوجيا', 'الكتروني', 'رقمي', 'online'],
            icon: 'fa-code', color: '#28a745'
        },
        
        كتابة: {
            high: [
                'كتابة', 'كاتب', 'كاتبة', 'محتوى', 'مقال', 'مقالات', 'ترجمة', 'ترجمه', 'مترجم',
                'تفريغ', 'copywriting', 'cv', 'سيرة ذاتية', 'بحث', 'دراسة', 'تدقيق لغوي',
                'تحرير', 'صياغة', 'تأليف', 'كتاب', 'رواية', 'قصة', 'سيناريو', 'اسكربت',
                'محرر', 'ملخص', 'تلخيص', 'مراجعة', 'seo', 'بلوجر', 'مدونة'
            ],
            medium: [
                'نص', 'نصوص', 'عربي', 'انجليزي', 'فرنسي', 'تركي', 'مانهوا', 'ايميل',
                'رسالة', 'خطاب', 'بريد', 'وصف', 'تعليق', 'نشر', 'guest post', 'مراسل'
            ],
            low: ['لغة', 'كلمات', 'جملة', 'فقرة', 'موضوع'],
            icon: 'fa-pen', color: '#6610f2'
        },
        
        تسويق: {
            high: [
                'تسويق', 'مسوق', 'مسوقة', 'تسويقي', 'تسويقية', 'marketing', 'اعلان', 'اعلانات',
                'اعلاني', 'حملات', 'حملة', 'ads', 'facebook', 'فيسبوك', 'instagram', 'انستقرام',
                'تيك توك', 'tiktok', 'تويتر', 'twitter', 'سناب شات', 'snapchat', 'يوتيوب',
                'ادارة حسابات', 'سوشيال ميديا', 'social media', 'جوجل ادز', 'google ads',
                'ادسنس', 'adsense', 'ممول', 'ترويج', 'نشر', 'تغريدات'
            ],
            medium: [
                'ادارة صفحات', 'منصات', 'تفاعل', 'متابعين', 'followers', 'engagement',
                'برند', 'brand', 'استراتيجية', 'خطة تسويقية', 'محتوى تسويقي', 'مبيعات',
                'تجارة', 'ecommerce', 'affiliate', 'افلييت', 'cpa', 'email marketing'
            ],
            low: ['اونلاين', 'رقمي', 'الكتروني', 'ديجيتال'],
            icon: 'fa-bullhorn', color: '#ffc107'
        },
        
        فيديو: {
            high: [
                'مونتاج', 'مونتير', 'ممنتج', 'فيديو', 'فيديوهات', 'video', 'editing', 'edit',
                'انيميشن', 'animation', 'موشن جرافيك', 'motion graphics', 'انترو', 'outro',
                'تحريك', 'aftereffects', 'premiere', 'برومو', 'اعلاني', 'ريلز', 'reels',
                'شورتات', 'shorts', 'يوتيوب', 'تيك توك', 'cgi', 'قيمنق', 'gaming'
            ],
            medium: [
                'تصوير', 'كاميرا', 'اخراج', 'مخرج', 'فيلم', 'مسلسل', 'وثائقي',
                'ترانزيشن', 'مؤثرات', 'الوان', 'تدرج', 'مقاطع', 'كليب', 'videographer'
            ],
            low: ['مرئي', 'بصري', 'مشاهد', 'لقطات'],
            icon: 'fa-video', color: '#dc3545'
        },
        
        صوتيات: {
            high: [
                'تعليق صوتي', 'فويس اوفر', 'voice over', 'voiceover', 'معلق صوتي', 'معلقة',
                'صوت', 'صوتي', 'صوتية', 'تسجيل صوتي', 'دبلجة', 'انشاد', 'موسيقى',
                'هندسة صوت', 'sound engineering', 'بودكاست', 'podcast', 'راديو'
            ],
            medium: [
                'فويس', 'voice', 'اغنية', 'اغاني', 'لحن', 'الحان', 'تلحين', 'مؤثرات صوتية',
                'audio', 'ميكس', 'مكس', 'ماستر', 'استوديو', 'تسجيل', 'قرآن', 'تلاوة'
            ],
            low: ['سمعي', 'اذاعة', 'مسموع'],
            icon: 'fa-microphone', color: '#FF80AB'
        },
        
        بيانات: {
            high: [
                'ادخال بيانات', 'data entry', 'اكسل', 'excel', 'جوجل شيت', 'google sheets',
                'بيانات', 'data', 'جمع بيانات', 'تحليل بيانات', 'data analysis', 'تنظيف بيانات',
                'scraping', 'استخراج بيانات', 'database', 'قاعدة بيانات', 'sql', 'mysql'
            ],
            medium: [
                'تنسيق', 'تنظيم', 'ترتيب', 'فهرسة', 'تصنيف', 'csv', 'json', 'xml',
                'جداول', 'spreadsheet', 'احصائيات', 'statistics', 'تقارير', 'reports'
            ],
            low: ['ملفات', 'معلومات', 'ارقام', 'حسابات'],
            icon: 'fa-database', color: '#FF6347'
        },
        
        تعليم: {
            high: [
                'تعليم', 'تدريس', 'مدرس', 'مدرسة', 'معلم', 'معلمة', 'استاذ', 'مدرب', 'مدربة',
                'تدريب', 'كورس', 'دورة', 'دورات', 'منهج', 'مناهج', 'شرح', 'تعليمي', 'تعليمية',
                'حصص', 'دروس', 'محاضرات', 'ورشة', 'ورش عمل', 'تأهيل', 'اختبارات'
            ],
            medium: [
                'طالب', 'طلاب', 'طالبة', 'طالبات', 'جامعة', 'مدرسة', 'كلية', 'تخصص',
                'مادة', 'مواد', 'منصة تعليمية', 'e-learning', 'zoom', 'تسميع', 'واجبات'
            ],
            low: ['علم', 'دراسة', 'اكاديمي', 'تربوي', 'تثقيفي'],
            icon: 'fa-chalkboard-teacher', color: '#FA8072'
        },
        
        هندسة: {
            high: [
                'مهندس', 'مهندسة', 'هندسة', 'معماري', 'معمارية', 'اوتوكاد', 'autocad',
                'مخطط', 'مخططات', 'رسم هندسي', 'تصميم معماري', 'مدني', 'انشائي',
                'ديكور', 'تصميم داخلي', 'interior design', 'sketchup', 'revit', '3ds max'
            ],
            medium: [
                'خريطة', 'خرائط', 'مساحة', 'قياس', 'رسم', 'كروكي', 'مباني', 'عمارة',
                'انشاءات', 'تشييد', 'بناء', 'فيلا', 'مجلس', 'واجهة', 'كمية', 'حسابات'
            ],
            low: ['هندسي', 'تقني', 'فني'],
            icon: 'fa-building', color: '#8e44ad'
        },
        
        أعمال: {
            high: [
                'دراسة جدوى', 'خطة عمل', 'business plan', 'محاسبة', 'محاسب', 'مالية', 'مالي',
                'استشارة', 'استشاري', 'مستشار', 'ادارة', 'مدير', 'ادارية', 'موارد بشرية',
                'hr', 'تمويل', 'استثمار', 'مشروع', 'مشاريع', 'شركة', 'مؤسسة', 'منظمة'
            ],
            medium: [
                'اعمال', 'business', 'مبيعات', 'sales', 'تجارة', 'تجاري', 'اقتصاد', 'اقتصادي',
                'سكرتير', 'سكرتيرة', 'موظف', 'وظيفة', 'عمل', 'مكتب', 'ادارة مشاريع'
            ],
            low: ['تنظيم', 'تخطيط', 'تطوير'],
            icon: 'fa-briefcase', color: '#fd7e14'
        },
        
        'أسلوب حياة': {
            high: [
                'استشارة نفسية', 'مستشار نفسي', 'علاج نفسي', 'صحة نفسية', 'تطوير الذات',
                'لياقة', 'رياضة', 'تمارين', 'جدول تمارين', 'مدرب رياضي', 'تغذية', 'ريجيم',
                'تخسيس', 'حمية', 'طبخ', 'وصفات', 'طعام', 'اكل'
            ],
            medium: [
                'حياة', 'شخصي', 'شخصية', 'نصائح', 'ارشاد', 'توجيه', 'دعم', 'مساعدة',
                'صحة', 'جمال', 'عناية', 'موضة', 'ازياء', 'رشاقة'
            ],
            low: ['هواية', 'ترفيه', 'متعة', 'سعادة'],
            icon: 'fa-heart', color: '#20B2AA'
        },
        
        أخرى: { high: [], medium: [], low: [], icon: 'fa-folder-open', color: '#6c757d' }
    };

    // خوارزمية التصنيف الذكي المطورة
    const classifyText = (text) => {
        const scores = {};
        const cleanText = text.toLowerCase()
            .replace(/[^\u0600-\u06FF\u0750-\u077F\w\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        
        // حساب النقاط المحسن لكل فئة
        Object.entries(smartCategories).forEach(([category, keywords]) => {
            let score = 0;
            
            // نقاط عالية مع تحسينات
            keywords.high?.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
                const matches = (cleanText.match(regex) || []).length;
                if (matches > 0) {
                    score += matches * 12; // زيادة النقاط للكلمات المهمة
                    
                    // نقاط إضافية إذا كانت الكلمة في بداية النص
                    if (cleanText.indexOf(word) <= 10) {
                        score += 3;
                    }
                }
            });
            
            // نقاط متوسطة
            keywords.medium?.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
                const matches = (cleanText.match(regex) || []).length;
                score += matches * 7;
            });
            
            // نقاط منخفضة
            keywords.low?.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
                const matches = (cleanText.match(regex) || []).length;
                score += matches * 3;
            });
            
            scores[category] = score;
        });
        
        // اختيار أفضل فئة مع تحسينات
        const sortedCategories = Object.entries(scores)
            .filter(([cat]) => cat !== 'أخرى')
            .sort((a, b) => b[1] - a[1]);
            
        const bestCategory = sortedCategories[0];
        
        // رفع الحد الأدنى للنقاط لتجنب التصنيف الخاطئ
        return bestCategory && bestCategory[1] >= 8 ? bestCategory[0] : 'أخرى';
    };

    // إضافة أيقونات التصنيف المحسنة
    const addCategoryIcons = () => {
        document.querySelectorAll('#forums_table tr.forum_post:not([data-categorized])').forEach(row => {
            const link = row.querySelector('.details-td h3 a');
            if (!link) return;

            const category = classifyText(link.textContent);
            const categoryData = smartCategories[category];
            
            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'display:inline-flex;gap:5px;align-items:center;padding-right:5px';
            
            const icon = document.createElement('i');
            icon.className = `fas ${categoryData.icon}`;
            icon.style.cssText = `color:${categoryData.color};font-size:14px`;
            icon.title = category;
            
            iconSpan.appendChild(icon);
            link.after(iconSpan);
            row.dataset.categories = category;
            row.dataset.categorized = 'true';
        });
    };

    // تصفية المنشورات
    let currentFilter = 'الكل';
    const filterPosts = (category) => {
        currentFilter = category;
        document.querySelectorAll('.cat-btn').forEach(btn => 
            btn.classList.toggle('active', btn.dataset.category === category)
        );
        
        document.querySelectorAll('#forums_table tr.forum_post').forEach(row => {
            row.style.display = category === 'الكل' || row.dataset.categories === category ? '' : 'none';
        });
    };

    // إنشاء أزرار التصفية المحسنة
    const createFilterButtons = () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <div style="margin:10px 0;overflow-x:auto;white-space:nowrap;padding:8px;background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%);border-radius:12px">
                <div style="display:inline-flex;gap:8px;min-width:max-content;padding:4px">
                    ${Object.entries({الكل: {icon: 'fa-list', color: '#6c757d'}, ...smartCategories})
                        .map(([name, data]) => 
                            `<button class="cat-btn${name === 'الكل' ? ' active' : ''}" data-category="${name}" 
                                style="background:${data.color};color:white;border:none;border-radius:25px;
                                padding:8px 16px;cursor:pointer;display:flex;align-items:center;gap:5px;
                                font-size:13px;font-weight:500;transition:all 0.3s ease;white-space:nowrap;
                                box-shadow:0 2px 4px rgba(0,0,0,0.1);user-select:none">
                                <i class="fas ${data.icon}" style="font-size:12px"></i>
                                <span>${name}</span>
                            </button>`
                        ).join('')}
                </div>
            </div>
        `;
        
        // إضافة الأحداث
        container.addEventListener('click', e => {
            if (e.target.closest('.cat-btn')) {
                filterPosts(e.target.closest('.cat-btn').dataset.category);
            }
        });
        
        document.querySelector('#forum-requests')?.prepend(container);
    };

    // إضافة الستايلز المحسنة
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .cat-btn.active { 
                transform:translateY(-3px) scale(1.05);
                box-shadow:0 6px 12px rgba(0,0,0,0.25)!important;
                border:2px solid rgba(255,255,255,0.3);
            }
            .cat-btn:hover { 
                opacity:0.9;
                transform:translateY(-2px) scale(1.02);
                box-shadow:0 4px 8px rgba(0,0,0,0.2);
            }
            .cat-btn:active { 
                transform:translateY(0) scale(0.98);
            }
            @media(max-width:768px) { 
                .cat-btn { padding:6px 12px!important; font-size:12px!important; }
                .cat-btn span { font-size:11px!important; }
            }
        `;
        document.head.appendChild(style);
    };

    // تهيئة السكريبت
    const init = () => {
        // تحميل Font Awesome
        if (!document.querySelector('[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css';
            document.head.appendChild(link);
        }
        
        addStyles();
        createFilterButtons();
        addCategoryIcons();
        
        // مراقبة المنشورات الجديدة
        const observer = new MutationObserver(debounce(addCategoryIcons, 200));
        const table = document.querySelector('#forums_table tbody');
        if (table) observer.observe(table, {childList: true, subtree: true});
        
        // مراقبة زر "المزيد"
        const loadMore = document.getElementById('community_loadmore_btn');
        if (loadMore) {
            loadMore.addEventListener('click', () => 
                setTimeout(() => {
                    addCategoryIcons();
                    filterPosts(currentFilter);
                }, 1500)
            );
        }
    };

    // تشغيل السكريبت
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
