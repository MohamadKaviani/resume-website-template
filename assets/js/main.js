const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // بستن منو با کلیک روی لینک
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });

        // ====== سوییچ دارک مود / لایت مود ======
        const htmlEl = document.documentElement;
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');

        // بازیابی تم ذخیره‌شده کاربر (در صورت وجود)، در غیر این‌صورت پیش‌فرض دارک باقی می‌ماند
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            htmlEl.classList.remove('dark');
        } else if (savedTheme === 'dark') {
            htmlEl.classList.add('dark');
        }

        function applyThemeToggle() {
            htmlEl.classList.toggle('dark');
            localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
        }

        const themePrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let themeTransitionInProgress = false; // جلوگیری از کلیک‌های همزمان حین اجرای افکت
        const GLITCH_DURATION = 180; // ms — باید با مدت انیمیشن‌های glitch-* در CSS هماهنگ باشد

        // مرحله ۲: تغییر واقعی و سینمایی Theme (Circular Reveal) پس از پایان مرحله Glitch
        function runCircularReveal(btn) {
            // تعیین مرکز و شعاع افکت دایره‌ای بر اساس محل کلیک روی دکمه سوییچ تم
            const rect = btn.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const maxRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );
            htmlEl.style.setProperty('--theme-toggle-x', `${x}px`);
            htmlEl.style.setProperty('--theme-toggle-y', `${y}px`);
            htmlEl.style.setProperty('--theme-toggle-r', `${maxRadius}px`);

            htmlEl.classList.add('theme-reveal');

            const transition = document.startViewTransition(() => {
                applyThemeToggle();
            });

            transition.finished.finally(() => {
                htmlEl.classList.remove('theme-reveal');
                themeTransitionInProgress = false;
                window.dispatchEvent(new Event('theme-transition-end'));
            });
        }

        function toggleTheme(event) {
            if (themeTransitionInProgress) return; // جلوگیری از کلیک همزمان حین اجرای افکت

            // کاربرانی که حرکت کاهش‌یافته را ترجیح می‌دهند: تغییر فوری و بدون افکت
            if (themePrefersReducedMotion) {
                applyThemeToggle();
                return;
            }

            const btn = event.currentTarget;
            themeTransitionInProgress = true;

            // موقتاً انیمیشن پس‌زمینه Canvas را متوقف می‌کنیم تا در کل مدت افکت (Glitch + Reveal)
            // با Snapshotِ گرفته‌شده توسط مرورگر ناهماهنگ نشود (هم رفع Flicker، هم صرفه‌جویی در Performance)
            window.dispatchEvent(new Event('theme-transition-start'));

            // مرحله ۱: افکت کوتاه Glitch / پارازیت دیجیتال، پیش از تغییر واقعی Theme
            htmlEl.classList.add('theme-glitching');

            window.setTimeout(() => {
                htmlEl.classList.remove('theme-glitching');

                if (document.startViewTransition) {
                    runCircularReveal(btn);
                } else {
                    // مرورگرهای بدون پشتیبانی از View Transitions: بعد از Glitch، تغییر ساده انجام می‌شود
                    applyThemeToggle();
                    themeTransitionInProgress = false;
                    window.dispatchEvent(new Event('theme-transition-end'));
                }
            }, GLITCH_DURATION);
        }

        themeToggleBtn.addEventListener('click', toggleTheme);
        themeToggleBtnMobile.addEventListener('click', toggleTheme);

        // ====== افکت شیشه‌ای نوبار هنگام اسکرول ======
        const navInner = document.getElementById('nav-inner');
        function onNavScroll() {
            if (window.scrollY > 20) {
                navInner.classList.add('bg-white/80', 'dark:bg-zinc-950/80', 'backdrop-blur-md', 'border-zinc-200', 'dark:border-zinc-800', 'shadow-lg', 'shadow-black/5');
            } else {
                navInner.classList.remove('bg-white/80', 'dark:bg-zinc-950/80', 'backdrop-blur-md', 'border-zinc-200', 'dark:border-zinc-800', 'shadow-lg', 'shadow-black/5');
            }
        }
        document.addEventListener('scroll', onNavScroll);
        onNavScroll();

        // ====== انیمیشن ورود عناصر هنگام اسکرول (Reveal on Scroll) ======
        const revealPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const revealEls = document.querySelectorAll('.reveal');

        function fillSkillBar(el) {
            const bar = el.querySelector ? el.querySelector('.skill-bar') : null;
            if (bar) bar.style.width = bar.dataset.level + '%';
        }

        if (revealPrefersReducedMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach(el => {
                el.classList.add('is-visible');
                fillSkillBar(el);
            });
        } else {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        fillSkillBar(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

            revealEls.forEach(el => revealObserver.observe(el));
        }

        // ====== دکمه شناور بازگشت به بالا (Back to Top) ======
        const backToTopBtn = document.getElementById('back-to-top-btn');
        function onBackToTopScroll() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        }
        backToTopBtn.addEventListener('click', () => {
            if (window.__lenis) {
                window.__lenis.scrollTo(0, { duration: 1.6 });
            } else {
                window.scrollTo({ top: 0, behavior: revealPrefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
        document.addEventListener('scroll', onBackToTopScroll);
        onBackToTopScroll();
