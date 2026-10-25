(() => {
            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReduced) return; // کاربرانی که حرکت کمتر می‌خواهند: اسکرول و افکت‌ها دست‌نخورده

            const root = document.documentElement;
            const heroContent = document.getElementById('hero-content');
            const heroCanvas = document.getElementById('hero-code-canvas');
            const heroSection = heroCanvas ? heroCanvas.closest('section') : null;

            let vh = window.innerHeight;
            let heroH = heroSection ? heroSection.offsetHeight : vh;
            window.addEventListener('resize', () => {
                vh = window.innerHeight;
                heroH = heroSection ? heroSection.offsetHeight : vh;
            });

            const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

            // اعمال افکت‌ها بر اساس مقدار اسکرول (y)
            function applyScrollEffects(y) {
                // Parallax بخش Hero: محتوا کندتر حرکت می‌کند، کوچک و محو می‌شود؛ پس‌زمینه عمق می‌گیرد
                if (!heroContent || y > heroH * 1.2) return;
                const p = clamp(y / (heroH * 0.8), 0, 1);
                heroContent.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${1 - p * 0.06})`;
                heroContent.style.opacity = String(clamp(1 - p * 1.15, 0, 1));
                heroCanvas.style.transform = `translate3d(0, ${y * 0.2}px, 0)`;
            }

            // اگر کتابخانه لود نشد (مثلاً آفلاین): اسکرول نرمِ ساده مرورگر + همین افکت‌ها
            if (typeof Lenis === 'undefined') {
                root.style.scrollBehavior = 'smooth';
                document.addEventListener('scroll', () => applyScrollEffects(window.scrollY), { passive: true });
                applyScrollEffects(window.scrollY);
                return;
            }

            const lenis = new Lenis({
                duration: 1.25,                                          // مدت «لغزیدن» بعد از هر اسکرول (ثانیه)
                easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // شروع سریع، توقف خیلی نرم
                wheelMultiplier: 0.9,
                anchors: true,                                           // کلیک روی لینک‌های #about و #skills ... هم نرم اسکرول شوند
                autoRaf: true
            });
            window.__lenis = lenis;

            lenis.on('scroll', ({ scroll }) => applyScrollEffects(scroll));
            applyScrollEffects(window.scrollY);
        })();
