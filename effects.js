/**
 * 炊烟袅袅 Wiki - 炫酷特效系统
 * 包含：点击粒子爆发、鼠标光晕、背景飘浮火星、卡片3D悬浮、
 *       滚动进度条、数字计数动画、按钮波纹、标题流光
 */
(function () {
    'use strict';

    // ===== 检测是否为触摸设备 =====
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var isMobile = window.innerWidth < 768;

    // ========================================
    // 1. 顶部滚动进度条
    // ========================================
    function initScrollProgress() {
        var bar = document.createElement('div');
        bar.className = 'scroll-progress';
        document.body.appendChild(bar);

        function update() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = Math.min(progress, 100) + '%';
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    // ========================================
    // 2. 鼠标光晕跟随
    // ========================================
    function initCursorGlow() {
        if (isTouchDevice || isMobile) return;

        var glow = document.createElement('div');
        glow.className = 'cursor-glow';
        document.body.appendChild(glow);

        var mouseX = 0, mouseY = 0;
        var glowX = 0, glowY = 0;
        var rafId = null;

        function animate() {
            glowX += (mouseX - glowX) * 0.15;
            glowY += (mouseY - glowY) * 0.15;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            rafId = requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!glow.classList.contains('active')) {
                glow.classList.add('active');
                animate();
            }
        });

        document.addEventListener('mouseleave', function () {
            glow.classList.remove('active');
            if (rafId) cancelAnimationFrame(rafId);
        });

        // 悬停在可交互元素上时光晕变大
        var hoverSelector = 'a, button, .feature-card, .series-card, .item-card, .item-card-small, ' +
            '.currency-card, .potion-card, .team-member, .cat-nav-item, .faq-question, .gallery-item, ' +
            '.roadmap-tag, .friend-tag, .step-card, .nav-logo, input';

        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(hoverSelector)) {
                glow.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(hoverSelector)) {
                glow.classList.remove('hovering');
            }
        });
    }

    // ========================================
    // 3. 点击粒子爆发（Canvas）
    // ========================================
    function initClickParticles() {
        var canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        var particles = [];
        var MAX_PARTICLES = 200;

        // 古风配色粒子（深色背景提亮版）
        var colors = [
            'rgba(224, 88, 96, 0.95)',   // 亮朱砂红
            'rgba(255, 200, 100, 0.95)', // 暖金
            'rgba(212, 176, 106, 0.9)',  // 古金
            'rgba(200, 64, 72, 0.9)',    // 朱砂红
            'rgba(255, 215, 130, 0.9)',  // 亮暖金
            'rgba(255, 150, 80, 0.85)'   // 橙红火星
        ];

        function createBurst(x, y, count) {
            for (var i = 0; i < count; i++) {
                if (particles.length >= MAX_PARTICLES) {
                    particles.shift();
                }
                var angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
                var speed = 2 + Math.random() * 6;
                var size = 2 + Math.random() * 4;
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: 0.015 + Math.random() * 0.02,
                    size: size,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    gravity: 0.08 + Math.random() * 0.06,
                    rotation: Math.random() * Math.PI * 2,
                    rotSpeed: (Math.random() - 0.5) * 0.2,
                    shape: Math.random() > 0.5 ? 'circle' : 'star'
                });
            }
        }

        function drawStar(ctx, x, y, size, rotation) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.beginPath();
            for (var i = 0; i < 5; i++) {
                var angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
                var r = i % 2 === 0 ? size : size * 0.4;
                ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (var i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.98;
                p.life -= p.decay;
                p.rotation += p.rotSpeed;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = p.color;

                if (p.shape === 'star') {
                    drawStar(ctx, p.x, p.y, p.size * p.life, p.rotation);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            requestAnimationFrame(animate);
        }
        animate();

        // 点击触发粒子爆发
        document.addEventListener('click', function (e) {
            // 不在输入框等元素上触发
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            var count = isMobile ? 12 : 20;
            createBurst(e.clientX, e.clientY, count);
        });

        // 悬浮卡片时偶尔散发小粒子
        var cardSelector = '.feature-card, .series-card, .item-card, .item-card-small, ' +
            '.currency-card, .potion-card, .step-card, .cat-nav-item';

        document.addEventListener('mousemove', function (e) {
            var card = e.target.closest(cardSelector);
            if (card && Math.random() > 0.97) {
                var rect = card.getBoundingClientRect();
                createBurst(
                    rect.left + rect.width * Math.random(),
                    rect.top + rect.height * Math.random(),
                    2
                );
            }
        });
    }

    // ========================================
    // 4. 背景飘浮火星（炊烟意境）
    // ========================================
    function initEmberParticles() {
        if (isMobile) return;

        var maxEmbers = 25;
        for (var i = 0; i < maxEmbers; i++) {
            createEmber(i * 800);
        }

        function createEmber(delay) {
            setTimeout(function () {
                var ember = document.createElement('div');
                ember.className = 'ember-particle';
                var size = 3 + Math.random() * 5;
                var startX = Math.random() * window.innerWidth;
                var drift = (Math.random() - 0.5) * 80;
                var duration = 8 + Math.random() * 12;

                ember.style.width = size + 'px';
                ember.style.height = size + 'px';
                ember.style.left = startX + 'px';
                ember.style.bottom = '-10px';
                ember.style.setProperty('--drift', drift + 'px');
                ember.style.animationDuration = duration + 's';

                document.body.appendChild(ember);

                setTimeout(function () {
                    ember.remove();
                    createEmber(Math.random() * 3000);
                }, duration * 1000);
            }, delay);
        }
    }

    // ========================================
    // 5. 卡片3D倾斜悬浮效果
    // ========================================
    function initCardTilt() {
        if (isTouchDevice || isMobile) return;

        var tiltSelector = '.feature-card, .series-card, .item-card, .item-card-small, ' +
            '.currency-card, .potion-card, .step-card, .cat-nav-item';

        var maxTilt = 6; // 最大倾斜角度

        document.querySelectorAll(tiltSelector).forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -maxTilt;
                var rotateY = ((x - centerX) / centerX) * maxTilt;

                card.style.transform =
                    'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    // ========================================
    // 6. 按钮波纹效果
    // ========================================
    function initRippleEffect() {
        var rippleSelector = '.btn, .btn-download, .btn-download-secondary, .series-back, .series-nav-back';

        document.addEventListener('click', function (e) {
            var btn = e.target.closest(rippleSelector);
            if (!btn) return;

            var rect = btn.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            var x = e.clientX - rect.left - size / 2;
            var y = e.clientY - rect.top - size / 2;

            var ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            btn.appendChild(ripple);
            setTimeout(function () { ripple.remove(); }, 600);
        });
    }

    // ========================================
    // 7. 数字计数器动画
    // ========================================
    function initCounterAnimation() {
        var counters = document.querySelectorAll('.stat-number, .char-stat-value');

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                if (entry.target.dataset.counted) return;
                entry.target.dataset.counted = '1';

                var el = entry.target;
                var text = el.textContent.trim();
                var match = text.match(/^(\d+)(.*)$/);
                if (!match) return;

                var target = parseInt(match[1], 10);
                var suffix = match[2] || '';
                var duration = 1200;
                var startTime = performance.now();

                function update(now) {
                    var elapsed = now - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    // easeOutExpo
                    var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                requestAnimationFrame(update);
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { observer.observe(c); });
    }

    // ========================================
    // 8. 滚动错落渐入（增强版）
    // ========================================
    function initStaggerReveal() {
        // 为同一容器内的多个 fade-in 添加延迟
        var groups = new Map();
        document.querySelectorAll('.fade-in').forEach(function (el) {
            var parent = el.parentElement;
            if (!groups.has(parent)) groups.set(parent, []);
            groups.get(parent).push(el);
        });

        groups.forEach(function (items) {
            items.forEach(function (el, i) {
                el.style.transitionDelay = (i * 0.08) + 's';
            });
        });

        // 也为特征卡片等添加自动 fade-in
        var autoFadeSelector = '.feature-card, .series-card, .detail-block, .faq-item, ' +
            '.step-card, .team-member, .copyright-card, .cat-nav-item, ' +
            '.item-card, .item-card-small, .currency-card, .potion-card';

        document.querySelectorAll(autoFadeSelector).forEach(function (el) {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
            }
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.fade-in').forEach(function (el) {
            observer.observe(el);
        });
    }

    // ========================================
    // 9. 导航栏当前章节高亮
    // ========================================
    function initNavHighlight() {
        var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        if (navLinks.length === 0) return;

        var sections = [];
        navLinks.forEach(function (link) {
            var id = link.getAttribute('href').substring(1);
            var section = document.getElementById(id);
            if (section) sections.push({ link: link, section: section });
        });

        window.addEventListener('scroll', function () {
            var scrollPos = window.scrollY + 120;
            var current = null;

            for (var i = sections.length - 1; i >= 0; i--) {
                if (scrollPos >= sections[i].section.offsetTop) {
                    current = sections[i];
                    break;
                }
            }

            navLinks.forEach(function (l) { l.style.color = ''; });
            if (current) {
                current.link.style.color = 'var(--color-primary)';
            }
        }, { passive: true });
    }

    // ========================================
    // 10. Hero 标题打字机效果（已禁用，改用 ::before/::after 古风装饰线 + 大字号静态展示，更震撼）
    // ========================================
    function initTypewriter() {
        // 保留函数但禁用执行 - 大字号更适合静态展示
        return;
    }

    // ========================================
    // 11. 搜索框粒子反馈
    // ========================================
    function initSearchFeedback() {
        var searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        if (!isMobile) return; // 只在移动端添加，桌面端已有光晕

        searchInput.addEventListener('focus', function () {
            var rect = searchInput.getBoundingClientRect();
            // 在搜索框周围喷发小粒子
            var event = new MouseEvent('click', {
                clientX: rect.left + rect.width / 2,
                clientY: rect.top + rect.height / 2
            });
            // 不触发，只是占位
        });
    }

    // ========================================
    // 12. 平滑滚动锚点增强
    // ========================================
    function initSmoothScroll() {
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href^="#"]');
            if (!link) return;
            var href = link.getAttribute('href');
            if (href === '#' || href === '#!') return;

            var target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            var offset = 80;
            var top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    }

    // ========================================
    // 初始化所有特效
    // ========================================
    function init() {
        initScrollProgress();
        initCursorGlow();
        initClickParticles();
        initEmberParticles();
        initCardTilt();
        initRippleEffect();
        initCounterAnimation();
        initStaggerReveal();
        initNavHighlight();
        initTypewriter();
        initSmoothScroll();

        console.log('%c炊烟袅袅 Wiki ✨ 特效系统已加载', 'color: #B73239; font-size: 14px; font-weight: bold;');
    }

    // DOM 就绪后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
