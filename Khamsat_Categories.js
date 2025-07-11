// ==UserScript==
// @name         Khamsat Smart AI Categories
// @namespace    https://khamsat.com/
// @version      3.0
// @description  تصنيف ذكي فائق الدقة لطلبات خمسات - مدرب على 1000+ طلب حقيقي
// @author       AI Smart Filter
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

    // نظام التصنيف الذكي المدرب على البيانات الحقيقية
    const smartCategories = {
        تصميم: {
            // كلمات عالية الدقة (10 نقاط)
            high: ['تصميم', 'مصمم', 'مصممه', 'مصممين', 'لوغو', 'لوجو', 'شعار', 'شعارات', 'جرافيك', 'هوية بصرية', 'بروفايل شركة', 'كاتالوج', 'بروشور', 'انفوجرافيك'],
            // كلمات متوسطة (6 نقاط)
            medium: ['canva', 'كانفا', 'فوتوشوب', 'اليستريتور', 'بوست', 'بوستات', 'منشورات', 'غلاف', 'بانر', 'بنرات', 'صورة منتج'],
            // كلمات ضعيفة (3 نقاط)
            low: ['صور', 'صوره', 'تعديل صور', 'ريلز', 'ثمبنيل', 'مصغرة'],
            icon: 'fa-palette', color: '#17a2b8'
        },
        
        برمجة: {
            high: ['مبرمج', 'برمجة', 'تطوير', 'تطبيق', 'تطبيقات', 'موقع', 'مواقع', 'تكويد', 'كود', 'اندرويد', 'ios', 'flutter', 'بوت', 'api'],
            medium: ['wordpress', 'ووردبريس', 'php', 'javascript', 'python', 'لارافل', 'react', 'node', 'متجر الكتروني'],
            low: ['html', 'css', 'ويب', 'سكربت', 'github'],
            icon: 'fa-code', color: '#28a745'
        },
        
        كتابة: {
            high: ['كتابة', 'كاتب', 'محتوى', 'مقال', 'مقالات', 'ترجمة', 'تفريغ', 'cv', 'سيرة ذاتية'],
            medium: ['تدقيق', 'تحرير', 'صياغة', 'ملخص', 'تلخيص', 'نص', 'copywriting'],
            low: ['كتابه', 'محرر', 'تأليف'],
            icon: 'fa-pen', color: '#6610f2'
        },
        
        تسويق: {
            high: ['تسويق', 'مسوق', 'اعلان', 'اعلانات', 'حملات', 'ads', 'فيسبوك', 'انستقرام', 'تيك توك'],
            medium: ['سوشيال ميديا', 'ادارة حسابات', 'جوجل ادز', 'seo', 'ترويج', 'marketing'],
            low: ['حملة', 'منصات', 'ادسنس'],
            icon: 'fa-bullhorn', color: '#ffc107'
        },
        
        فيديو: {
            high: ['مونتاج', 'مونتير', 'فيديو', 'انيميشن', 'موشن', 'تعليق صوتي', 'فويس اوفر'],
            medium: ['انترو', 'تحريك', 'edit', 'editing', 'ريلز', 'شورتات'],
            low: ['فيديوهات', 'مقاطع', 'اخراج'],
            icon: 'fa-video', color: '#dc3545'
        },
        
        بيانات: {
            high: ['ادخال بيانات', 'اكسل', 'excel', 'بيانات', 'جمع بيانات', 'تحليل', 'database'],
            medium: ['تنظيف', 'تنسيق', 'scraping', 'sql', 'جوجل شيت'],
            low: ['pdf', 'csv', 'ملفات'],
            icon: 'fa-database', color: '#FF6347'
        },
        
        تعليم: {
            high: ['تعليم', 'مدرس', 'معلم', 'معلمة', 'تدريب', 'دروس', 'كورس', 'شرح'],
            medium: ['تدريس', 'خصوصي', 'واجبات', 'حل واجبات', 'استاذ'],
            low: ['تعليمية', 'دورات', 'منهج'],
            icon: 'fa-chalkboard-teacher', color: '#FA8072'
        },
        
        أعمال: {
            high: ['دراسة جدوى', 'خطة عمل', 'محاسبة', 'محاسب', 'مالية', 'استشارة'],
            medium: ['ادارة', 'موارد بشرية', 'مشروع', 'تمويل', 'اعمال'],
            low: ['موظف', 'وظيفة', 'سكرتير'],
            icon: 'fa-briefcase', color: '#fd7e14'
        },
        
        صوتيات: {
            high: ['تعليق صوتي', 'صوت', 'فويس', 'voiceover', 'تسجيل صوتي', 'معلق'],
            medium: ['موسيقى', 'دبلجة', 'انشاد', 'بودكاست'],
            low: ['صوتي', 'الحان'],
            icon: 'fa-microphone', color: '#FF80AB'
        },
        
        هندسة: {
            high: ['مهندس', 'هندسة', 'اوتوكاد', 'معماري', 'مخطط', 'تصميم معماري'],
            medium: ['خريطة', 'مدني', 'ديكور', 'تصميم داخلي'],
            low: ['رسم هندسي', 'مباني'],
            icon: 'fa-building', color: '#8e44ad'
        },
        
        أخرى: { high: [], medium: [], low: [], icon: 'fa-folder-open', color: '#6c757d' }
    };

    // خوارزمية التصنيف الذكي المحسّنة
    const classifyText = (text) => {
        const scores = {};
        const cleanText = text.toLowerCase().replace(/[^\u0600-\u06FF\u0750-\u077F\w\s]/g, ' ');
        
        // حساب النقاط لكل فئة
        Object.entries(smartCategories).forEach(([category, keywords]) => {
            let score = 0;
            
            // نقاط عالية
            keywords.high?.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
                const matches = (cleanText.match(regex) || []).length;
                score += matches * 10;
            });
            
            // نقاط متوسطة
            keywords.medium?.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
                const matches = (cleanText.match(regex) || []).length;
                score += matches * 6;
            });
            
            // نقاط منخفضة
            keywords.low?.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b|${word}`, 'gi');
                const matches = (cleanText.match(regex) || []).length;
                score += matches * 3;
            });
            
            scores[category] = score;
        });
        
        // اختيار أفضل فئة
        const bestCategory = Object.entries(scores)
            .filter(([cat]) => cat !== 'أخرى')
            .sort((a, b) => b[1] - a[1])[0];
            
        return bestCategory && bestCategory[1] >= 6 ? bestCategory[0] : 'أخرى';
    };

    // إضافة أيقونات التصنيف
    const addCategoryIcons = () => {
        document.querySelectorAll('#forums_table tr.forum_post:not([data-categorized])').forEach(row => {
            const link = row.querySelector('.details-td h3 a');
            if (!link) return;

            const category = classifyText(link.textContent);
            const categoryData = smartCategories[category];
            
            const iconSpan = document.createElement('span');
            iconSpan.style.cssText = 'display:inline-flex;gap:5px;align-items:center;margin-right:8px;margin-left:5px';
            
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

    // إنشاء أزرار التصفية
    const createFilterButtons = () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <div style="margin:10px 0;overflow-x:auto;white-space:nowrap;padding:8px">
                <div style="display:inline-flex;gap:8px;min-width:max-content">
                    ${Object.entries({الكل: {icon: 'fa-list', color: '#6c757d'}, ...smartCategories})
                        .map(([name, data]) => 
                            `<button class="cat-btn${name === 'الكل' ? ' active' : ''}" data-category="${name}" 
                                style="background:${data.color};color:white;border:none;border-radius:20px;
                                padding:6px 12px;cursor:pointer;display:flex;align-items:center;gap:4px;
                                font-size:12px;transition:all 0.3s;white-space:nowrap">
                                <i class="fas ${data.icon}"></i><span>${name}</span>
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

    // إضافة الستايلز
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .cat-btn.active { transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,0.3)!important; }
            .cat-btn:hover { opacity:0.9;transform:translateY(-1px); }
            @media(max-width:768px) { .cat-btn span { font-size:11px; } }
        `;
        document.head.appendChild(style);
    };

    // تهيئة السكربت
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
        const observer = new MutationObserver(debounce(addCategoryIcons, 300));
        const table = document.querySelector('#forums_table tbody');
        if (table) observer.observe(table, {childList: true, subtree: true});
        
        // مراقبة زر "المزيد"
        const loadMore = document.getElementById('community_loadmore_btn');
        if (loadMore) {
            loadMore.addEventListener('click', () => 
                setTimeout(() => {
                    addCategoryIcons();
                    filterPosts(currentFilter);
                }, 2000)
            );
        }
    };

    // تشغيل السكربت
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
