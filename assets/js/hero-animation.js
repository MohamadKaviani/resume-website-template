 (() => {
            const canvas = document.getElementById('hero-code-canvas');
            if (!canvas || !canvas.getContext) return;

            const heroSection = canvas.closest('section');
            const ctx = canvas.getContext('2d');
            const htmlEl = document.documentElement;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            const CODE_GLYPHS = ['</>', '{ }', '( )', '=>', ';', '[ ]', '#', '&&', '01', '10'];

            let width = 0, height = 0, dpr = 1;
            let nodes = [];
            let tokens = [];
            let isDark = htmlEl.classList.contains('dark');
            let running = false;
            let rafId = null;
            let lastTokenSpawn = 0;

            function getPalette() {
                return isDark
                    ? {
                        node: 'rgba(163, 230, 53, 0.55)',
                        line: 'rgba(163, 230, 53, 0.16)',
                        glyph: 'rgba(190, 242, 100, 0.55)',
                        glow: 'rgba(132, 204, 22, 0.9)'
                    }
                    : {
                        node: 'rgba(63, 98, 18, 0.85)',
                        line: 'rgba(77, 124, 15, 0.45)',
                        glyph: 'rgba(54, 83, 20, 0.8)',
                        glow: 'rgba(132, 204, 22, 0.6)'
                    };
            }

            function initNodes() {
                const density = Math.min(55, Math.max(20, Math.floor((width * height) / 22000)));
                nodes = Array.from({ length: density }, () => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.25,
                    vy: (Math.random() - 0.5) * 0.25,
                    r: Math.random() * 1.5 + 0.8
                }));
            }

            function resize() {
                const rect = heroSection.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                initNodes();
            }

            function spawnToken(timestamp) {
                if (tokens.length >= 12 || timestamp - lastTokenSpawn < 900) return;
                lastTokenSpawn = timestamp;
                tokens.push({
                    x: Math.random() * width,
                    y: height + 20,
                    vy: 0.25 + Math.random() * 0.35,
                    char: CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)],
                    size: 12 + Math.random() * 10,
                    life: 0,
                    maxLife: 500 + Math.random() * 300,
                    drift: (Math.random() - 0.5) * 0.15
                });
            }

            function draw(timestamp) {
                if (!running) return;
                const palette = getPalette();
                ctx.clearRect(0, 0, width, height);

                for (let i = 0; i < nodes.length; i++) {
                    const a = nodes[i];
                    a.x += a.vx;
                    a.y += a.vy;
                    if (a.x < 0 || a.x > width) a.vx *= -1;
                    if (a.y < 0 || a.y > height) a.vy *= -1;

                    for (let j = i + 1; j < nodes.length; j++) {
                        const b = nodes[j];
                        const dx = a.x - b.x, dy = a.y - b.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 120) {
                            ctx.strokeStyle = palette.line;
                            ctx.globalAlpha = 1 - dist / 120;
                            ctx.lineWidth = isDark ? 1 : 1.4;
                            ctx.beginPath();
                            ctx.moveTo(a.x, a.y);
                            ctx.lineTo(b.x, b.y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.globalAlpha = 1;

                ctx.fillStyle = palette.node;
                nodes.forEach(n => {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                    ctx.fill();
                });

                spawnToken(timestamp);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                tokens = tokens.filter(t => t.life < t.maxLife && t.y > -30);
                tokens.forEach(t => {
                    t.y -= t.vy;
                    t.x += t.drift;
                    t.life++;
                    const progress = t.life / t.maxLife;
                    const fade = progress < 0.15 ? progress / 0.15 : progress > 0.8 ? (1 - progress) / 0.2 : 1;
                    ctx.font = `600 ${t.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
                    ctx.fillStyle = palette.glyph;
                    ctx.shadowColor = palette.glow;
                    ctx.shadowBlur = isDark ? 8 : 6;
                    ctx.globalAlpha = Math.max(0, fade) * 0.7;
                    ctx.fillText(t.char, t.x, t.y);
                });
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;

                rafId = requestAnimationFrame(draw);
            }

            function start() {
                if (running) return;
                running = true;
                lastTokenSpawn = 0;
                rafId = requestAnimationFrame(draw);
            }

            function stop() {
                running = false;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            }

            function drawStaticFrame() {
                const palette = getPalette();
                ctx.clearRect(0, 0, width, height);
                ctx.fillStyle = palette.node;
                nodes.forEach(n => {
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            const resizeObserver = new ResizeObserver(() => {
                resize();
                if (prefersReducedMotion) drawStaticFrame();
            });
            resizeObserver.observe(heroSection);

            // خارج از دید بودن Hero یعنی توقف انیمیشن برای صرفه‌جویی در منابع
            const intersectionObserver = new IntersectionObserver(entries => {
                if (prefersReducedMotion) return;
                entries.forEach(entry => {
                    if (entry.isIntersecting) start();
                    else stop();
                });
            }, { threshold: 0.05 });
            intersectionObserver.observe(heroSection);

            // هماهنگی رنگ‌ها با سوییچ دارک/لایت مود سایت
            const themeObserver = new MutationObserver(() => {
                isDark = htmlEl.classList.contains('dark');
                if (prefersReducedMotion) drawStaticFrame();
            });
            themeObserver.observe(htmlEl, { attributes: true, attributeFilter: ['class'] });

            // در حین اجرای افکت دایره‌ای تغییر تم، رندر Canvas موقتاً متوقف می‌شود تا
            // Snapshot گرفته‌شده توسط مرورگر با فریم درحال تغییر رنگ ناهماهنگ نشود
            let wasRunningBeforeThemeTransition = false;
            window.addEventListener('theme-transition-start', () => {
                wasRunningBeforeThemeTransition = running;
                stop();
            });
            window.addEventListener('theme-transition-end', () => {
                if (wasRunningBeforeThemeTransition && !prefersReducedMotion) start();
                else drawStaticFrame();
            });

            resize();
            if (prefersReducedMotion) {
                drawStaticFrame();
            } else {
                start();
            }
        })();
