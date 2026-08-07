/* ========================================
   古代宫灯悬浮按钮 - 炊烟袅袅 Wiki
   ======================================== */

(function() {
    'use strict';

    // 防止重复注入
    if (document.getElementById('palace-lamp-container')) return;

    // 创建容器
    var container = document.createElement('div');
    container.id = 'palace-lamp-container';

    // SVG 宫灯 - 精细设计
    var svgLamp = `
    <svg id="palace-lamp-svg" viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- 烛光渐变 -->
            <radialGradient id="lampGlow" cx="50%" cy="55%" r="50%">
                <stop offset="0%" stop-color="#FFD966" stop-opacity="0"/>
                <stop offset="0%" stop-color="#FFD966" stop-opacity="0" class="glow-stop-1"/>
                <stop offset="50%" stop-color="#E8941A" stop-opacity="0" class="glow-stop-2"/>
                <stop offset="100%" stop-color="#B73239" stop-opacity="0" class="glow-stop-3"/>
            </radialGradient>
            <!-- 灯身渐变（暗态） -->
            <linearGradient id="lampBodyDark" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3A2A1A"/>
                <stop offset="50%" stop-color="#2A1E14"/>
                <stop offset="100%" stop-color="#1E140E"/>
            </linearGradient>
            <!-- 灯身渐变（亮态） -->
            <linearGradient id="lampBodyLit" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#FF8C42"/>
                <stop offset="30%" stop-color="#FFB347"/>
                <stop offset="60%" stop-color="#FFD966"/>
                <stop offset="100%" stop-color="#E8941A"/>
            </linearGradient>
            <!-- 屋顶渐变 -->
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#D4B06A"/>
                <stop offset="100%" stop-color="#8B6B3A"/>
            </linearGradient>
            <!-- 滤镜：发光 -->
            <filter id="lampBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <filter id="flameGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        <!-- 外层光晕（亮态显示） -->
        <circle id="lamp-aura" cx="60" cy="85" r="55" fill="url(#lampGlow)" opacity="0" class="lamp-aura"/>

        <!-- 挂绳 -->
        <line x1="60" y1="0" x2="60" y2="15" stroke="#8B6B3A" stroke-width="1.5" opacity="0.6"/>

        <!-- 屋顶（宫殿飞檐） -->
        <g class="lamp-roof">
            <!-- 屋脊 -->
            <path d="M 25 28 Q 60 12 95 28 Q 90 32 85 30 Q 60 20 35 30 Q 30 32 25 28 Z" 
                  fill="url(#roofGrad)" stroke="#6B4E20" stroke-width="0.5"/>
            <!-- 飞檐左翘角 -->
            <path d="M 25 28 Q 18 26 14 30 Q 16 32 22 31 Q 24 30 25 28 Z" 
                  fill="url(#roofGrad)" stroke="#6B4E20" stroke-width="0.3"/>
            <!-- 飞檐右翘角 -->
            <path d="M 95 28 Q 102 26 106 30 Q 104 32 98 31 Q 96 30 95 28 Z" 
                  fill="url(#roofGrad)" stroke="#6B4E20" stroke-width="0.3"/>
            <!-- 屋顶宝顶 -->
            <circle cx="60" cy="14" r="2.5" fill="#D4B06A" stroke="#8B6B3A" stroke-width="0.3"/>
            <line x1="60" y1="11.5" x2="60" y2="9" stroke="#D4B06A" stroke-width="0.8"/>
            <circle cx="60" cy="8.5" r="1.2" fill="#D4B06A"/>
        </g>

        <!-- 灯身主体（六角形） -->
        <g class="lamp-body-group">
            <!-- 灯身外框 -->
            <path id="lamp-body" 
                  d="M 35 32 L 85 32 L 92 50 L 92 95 L 85 113 L 35 113 L 28 95 L 28 50 Z" 
                  fill="url(#lampBodyDark)" 
                  stroke="#8B6B3A" stroke-width="1" 
                  class="lamp-body-shape"/>

            <!-- 窗棂格子（中式传统纹样） -->
            <g class="lamp-window" opacity="0.5">
                <!-- 竖向格子 -->
                <line x1="42" y1="35" x2="42" y2="110" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="52" y1="35" x2="52" y2="110" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="60" y1="35" x2="60" y2="110" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="68" y1="35" x2="68" y2="110" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="78" y1="35" x2="78" y2="110" stroke="#6B4E20" stroke-width="0.6"/>
                <!-- 横向格子 -->
                <line x1="30" y1="48" x2="90" y2="48" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="29" y1="62" x2="91" y2="62" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="28" y1="76" x2="92" y2="76" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="29" y1="90" x2="91" y2="90" stroke="#6B4E20" stroke-width="0.6"/>
                <line x1="30" y1="104" x2="90" y2="104" stroke="#6B4E20" stroke-width="0.6"/>
                <!-- 对角装饰 -->
                <line x1="42" y1="48" x2="78" y2="76" stroke="#6B4E20" stroke-width="0.3" opacity="0.5"/>
                <line x1="78" y1="48" x2="42" y2="76" stroke="#6B4E20" stroke-width="0.3" opacity="0.5"/>
                <line x1="42" y1="76" x2="78" y2="104" stroke="#6B4E20" stroke-width="0.3" opacity="0.5"/>
                <line x1="78" y1="76" x2="42" y2="104" stroke="#6B4E20" stroke-width="0.3" opacity="0.5"/>
            </g>

            <!-- 灯芯烛光（亮态显示） -->
            <g id="lamp-flame" opacity="0" class="lamp-flame-group">
                <!-- 外焰光晕 -->
                <ellipse cx="60" cy="72" rx="18" ry="28" fill="#FFD966" opacity="0.25" filter="url(#lampBlur)"/>
                <!-- 内焰 -->
                <ellipse cx="60" cy="75" rx="10" ry="18" fill="#FFB347" opacity="0.5" filter="url(#lampBlur)"/>
                <!-- 火焰主体 -->
                <path class="flame-shape"
                      d="M 60 58 Q 64 66 63 74 Q 62 82 60 86 Q 58 82 57 74 Q 56 66 60 58 Z"
                      fill="#FF8C42" filter="url(#flameGlow)"/>
                <!-- 火焰核心 -->
                <path class="flame-core"
                      d="M 60 64 Q 62 70 61 76 Q 60 80 59 76 Q 58 70 60 64 Z"
                      fill="#FFE599" opacity="0.9"/>
                <!-- 灯芯 -->
                <line x1="60" y1="82" x2="60" y2="88" stroke="#3A2010" stroke-width="1"/>
            </g>

            <!-- 窗棂透光（亮态显示） -->
            <g id="lamp-window-glow" opacity="0" class="lamp-window-glow">
                <rect x="38" y="36" width="44" height="72" fill="#FFB347" opacity="0.12" rx="2"/>
            </g>
        </g>

        <!-- 底盘 -->
        <g class="lamp-base">
            <path d="M 35 113 L 85 113 L 80 120 L 40 120 Z" fill="url(#roofGrad)" stroke="#6B4E20" stroke-width="0.5"/>
            <ellipse cx="60" cy="120" rx="22" ry="3" fill="#8B6B3A" opacity="0.6"/>
        </g>

        <!-- 流苏 -->
        <g class="lamp-tassel">
            <line x1="60" y1="120" x2="60" y2="128" stroke="#B73239" stroke-width="1"/>
            <path d="M 54 128 L 54 150 M 57 128 L 57 153 M 60 128 L 60 155 M 63 128 L 63 153 M 66 128 L 66 150" 
                  stroke="#C84048" stroke-width="0.8" opacity="0.8"/>
            <!-- 流苏结 -->
            <circle cx="60" cy="126" r="2.5" fill="#B73239"/>
            <!-- 流苏顶饰 -->
            <rect x="56" y="122" width="8" height="4" rx="1" fill="#D4B06A" stroke="#8B6B3A" stroke-width="0.3"/>
        </g>

        <!-- 灯笼字（亮态显示） -->
        <text id="lamp-text" x="60" y="80" text-anchor="middle" 
              font-family="KaiTi, STKaiti, serif" font-size="14" font-weight="bold"
              fill="#FFE599" opacity="0" class="lamp-text">公</text>
    </svg>
    `;

    // 古风信笺面板
    var panelHTML = `
    <div id="lamp-panel" class="lamp-panel">
        <div class="lamp-panel-inner">
            <!-- 卷轴顶部 -->
            <div class="scroll-top">
                <div class="scroll-rod-left"></div>
                <div class="scroll-rod-right"></div>
            </div>
            <!-- 信笺主体 -->
            <div class="scroll-body">
                <div class="scroll-header">
                    <span class="scroll-seal">公告</span>
                </div>
                <div class="scroll-content">
                    <p class="scroll-title">维护须知</p>
                    <div class="scroll-divider"></div>
                    <p class="scroll-text">
                        本网站维护与更新内容<br/>
                        请联系QQ群管理
                    </p>
                    <div class="qq-highlight">
                        <span class="qq-icon">QQ</span>
                        <span class="qq-number">477</span>
                    </div>
                    <div class="scroll-divider"></div>
                    <p class="scroll-footer">—— 炊烟袅袅 Wiki 运营组 ——</p>
                </div>
            </div>
            <!-- 卷轴底部 -->
            <div class="scroll-bottom">
                <div class="scroll-rod-left"></div>
                <div class="scroll-rod-right"></div>
            </div>
            <!-- 关闭按钮 -->
            <button class="lamp-close" onclick="document.getElementById('palace-lamp-container').classList.remove('lamp-lit')" aria-label="关闭">
                <svg viewBox="0 0 24 24" width="14" height="14">
                    <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                </svg>
            </button>
        </div>
    </div>
    `;

    container.innerHTML = svgLamp + panelHTML;
    document.body.appendChild(container);

    // 注入样式
    var style = document.createElement('style');
    style.textContent = `
    /* ===== 宫灯悬浮按钮 ===== */
    #palace-lamp-container {
        position: fixed;
        right: 28px;
        bottom: 28px;
        z-index: 99999;
        width: 80px;
        height: 120px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }

    #palace-lamp-svg {
        width: 100%;
        height: 100%;
        overflow: visible;
        filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        transition: filter 0.4s ease;
        animation: lampFloat 4s ease-in-out infinite;
    }

    @keyframes lampFloat {
        0%, 100% { transform: translateY(0) rotate(-1deg); }
        50% { transform: translateY(-8px) rotate(1deg); }
    }

    /* 悬停效果 */
    #palace-lamp-container:hover #palace-lamp-svg {
        filter: drop-shadow(0 6px 20px rgba(212, 176, 106, 0.3));
    }

    #palace-lamp-container:hover .lamp-aura {
        opacity: 0.3 !important;
        transition: opacity 0.3s ease;
    }

    /* 亮态样式 */
    #palace-lamp-container.lamp-lit #palace-lamp-svg {
        filter: drop-shadow(0 0 25px rgba(255, 179, 71, 0.6)) drop-shadow(0 0 50px rgba(255, 140, 66, 0.3));
        animation: lampFloatLit 3s ease-in-out infinite;
    }

    @keyframes lampFloatLit {
        0%, 100% { transform: translateY(0) rotate(-0.5deg); }
        50% { transform: translateY(-6px) rotate(0.5deg); }
    }

    /* 亮态光晕 */
    #palace-lamp-container.lamp-lit .lamp-aura {
        opacity: 0.6 !important;
        animation: auraPulse 2s ease-in-out infinite;
    }

    @keyframes auraPulse {
        0%, 100% { opacity: 0.4; transform: scale(0.95); transform-origin: 60px 85px; }
        50% { opacity: 0.7; transform: scale(1.1); transform-origin: 60px 85px; }
    }

    /* 亮态灯身 */
    #palace-lamp-container.lamp-lit .lamp-body-shape {
        fill: url(#lampBodyLit) !important;
        stroke: #FFB347 !important;
        transition: all 0.6s ease;
    }

    /* 亮态窗棂 */
    #palace-lamp-container.lamp-lit .lamp-window {
        opacity: 0.8 !important;
        stroke: #8B3A10 !important;
        transition: all 0.6s ease;
    }

    #palace-lamp-container.lamp-lit .lamp-window line {
        stroke: #E8941A !important;
        transition: stroke 0.6s ease;
    }

    /* 亮态窗棂透光 */
    #palace-lamp-container.lamp-lit .lamp-window-glow {
        opacity: 1 !important;
        animation: windowFlicker 3s ease-in-out infinite;
    }

    @keyframes windowFlicker {
        0%, 100% { opacity: 0.8; }
        30% { opacity: 1; }
        60% { opacity: 0.9; }
        80% { opacity: 1; }
    }

    /* 亮态烛光 */
    #palace-lamp-container.lamp-lit .lamp-flame-group {
        opacity: 1 !important;
        transition: opacity 0.5s ease 0.2s;
    }

    #palace-lamp-container.lamp-lit .flame-shape {
        animation: flameFlicker 0.4s ease-in-out infinite alternate;
        transform-origin: 60px 86px;
    }

    @keyframes flameFlicker {
        0% { transform: scaleY(1) scaleX(1) skewX(0deg); }
        50% { transform: scaleY(1.08) scaleX(0.95) skewX(-2deg); }
        100% { transform: scaleY(0.95) scaleX(1.05) skewX(2deg); }
    }

    #palace-lamp-container.lamp-lit .flame-core {
        animation: coreFlicker 0.3s ease-in-out infinite alternate;
    }

    @keyframes coreFlicker {
        0% { opacity: 0.7; }
        100% { opacity: 1; }
    }

    /* 亮态灯字 */
    #palace-lamp-container.lamp-lit .lamp-text {
        opacity: 0.9 !important;
        animation: textGlow 2s ease-in-out infinite;
    }

    @keyframes textGlow {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }

    /* 亮态流苏 */
    #palace-lamp-container.lamp-lit .lamp-tassel path {
        stroke: #E05860 !important;
        opacity: 1 !important;
        transition: all 0.6s ease;
    }

    /* ===== 信笺面板 ===== */
    .lamp-panel {
        position: absolute;
        bottom: 130px;
        right: -10px;
        width: 300px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px) scale(0.85);
        transform-origin: bottom right;
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
    }

    #palace-lamp-container.lamp-lit .lamp-panel {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
        pointer-events: auto;
        transition-delay: 0.3s;
    }

    .lamp-panel-inner {
        position: relative;
        background: linear-gradient(135deg, #1E1612 0%, #2A1E14 100%);
        border: 1px solid rgba(212, 176, 106, 0.4);
        border-radius: 4px;
        box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(183, 50, 57, 0.15),
            inset 0 1px 0 rgba(212, 176, 106, 0.1);
        overflow: hidden;
    }

    /* 卷轴杆 */
    .scroll-top, .scroll-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 8px;
        background: linear-gradient(to bottom, #3A2A1A, #2A1E14);
        border-bottom: 1px solid rgba(212, 176, 106, 0.2);
        position: relative;
    }

    .scroll-bottom {
        border-bottom: none;
        border-top: 1px solid rgba(212, 176, 106, 0.2);
    }

    .scroll-rod-left, .scroll-rod-right {
        width: 6px;
        height: 14px;
        background: linear-gradient(to right, #8B6B3A, #D4B06A, #8B6B3A);
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        position: absolute;
        top: -3px;
    }

    .scroll-rod-left { left: -3px; }
    .scroll-rod-right { right: -3px; }

    /* 信笺头部 */
    .scroll-header {
        text-align: center;
        padding: 18px 20px 8px;
        position: relative;
    }

    .scroll-seal {
        display: inline-block;
        background: linear-gradient(135deg, #B73239, #9B2A30);
        color: #FFE599;
        font-family: "STKaiti", "KaiTi", "楷体", serif;
        font-size: 15px;
        font-weight: bold;
        padding: 6px 20px;
        border-radius: 3px;
        letter-spacing: 6px;
        text-indent: 6px;
        box-shadow: 
            0 2px 8px rgba(183, 50, 57, 0.4),
            inset 0 1px 0 rgba(255, 229, 153, 0.2);
        border: 1px solid rgba(255, 229, 153, 0.15);
    }

    /* 信笺内容 */
    .scroll-body {
        padding: 0;
    }

    .scroll-content {
        padding: 12px 24px 16px;
        text-align: center;
    }

    .scroll-title {
        font-family: "STKaiti", "KaiTi", "楷体", serif;
        font-size: 18px;
        font-weight: bold;
        color: #E8D9B8;
        letter-spacing: 4px;
        text-indent: 4px;
        margin-bottom: 4px;
        text-shadow: 0 0 12px rgba(212, 176, 106, 0.3);
    }

    .scroll-divider {
        width: 60%;
        height: 1px;
        margin: 10px auto;
        background: linear-gradient(to right, transparent, rgba(212, 176, 106, 0.4), transparent);
        position: relative;
    }

    .scroll-divider::after {
        content: '❀';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(183, 50, 57, 0.5);
        font-size: 10px;
        background: #1E1612;
        padding: 0 6px;
    }

    .scroll-text {
        font-family: "STKaiti", "KaiTi", "楷体", serif;
        font-size: 14px;
        color: #C8B89A;
        line-height: 2;
        letter-spacing: 2px;
        margin: 8px 0;
    }

    /* QQ号高亮区 */
    .qq-highlight {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        margin: 12px 0 4px;
        padding: 10px 24px;
        background: linear-gradient(135deg, rgba(183, 50, 57, 0.15), rgba(212, 176, 106, 0.1));
        border: 1px solid rgba(212, 176, 106, 0.3);
        border-radius: 8px;
        box-shadow: 
            0 2px 12px rgba(183, 50, 57, 0.15),
            inset 0 1px 0 rgba(212, 176, 106, 0.1);
        animation: qqGlow 3s ease-in-out infinite;
    }

    @keyframes qqGlow {
        0%, 100% { box-shadow: 0 2px 12px rgba(183, 50, 57, 0.15), inset 0 1px 0 rgba(212, 176, 106, 0.1); }
        50% { box-shadow: 0 4px 20px rgba(183, 50, 57, 0.3), inset 0 1px 0 rgba(212, 176, 106, 0.15); }
    }

    .qq-icon {
        background: linear-gradient(135deg, #B73239, #E05860);
        color: #FFE599;
        font-size: 11px;
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 4px;
        letter-spacing: 1px;
    }

    .qq-number {
        font-family: "STKaiti", "KaiTi", "楷体", serif;
        font-size: 24px;
        font-weight: bold;
        color: #FFD966;
        text-shadow: 0 0 16px rgba(255, 217, 102, 0.5);
        letter-spacing: 2px;
    }

    .scroll-footer {
        font-family: "STKaiti", "KaiTi", "楷体", serif;
        font-size: 11px;
        color: #9A8B75;
        letter-spacing: 3px;
        margin-top: 8px;
        opacity: 0.8;
    }

    /* 关闭按钮 */
    .lamp-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
        border: 1px solid rgba(212, 176, 106, 0.3);
        background: rgba(30, 22, 18, 0.8);
        color: #C8B89A;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        padding: 0;
    }

    .lamp-close:hover {
        background: rgba(183, 50, 57, 0.4);
        border-color: #C84048;
        color: #FFE599;
        transform: rotate(90deg);
    }

    /* 信笺装饰角花 */
    .lamp-panel-inner::before,
    .lamp-panel-inner::after {
        content: '';
        position: absolute;
        width: 24px;
        height: 24px;
        pointer-events: none;
    }

    .lamp-panel-inner::before {
        top: 12px;
        left: 12px;
        border-top: 1px solid rgba(212, 176, 106, 0.25);
        border-left: 1px solid rgba(212, 176, 106, 0.25);
        border-top-left-radius: 4px;
    }

    .lamp-panel-inner::after {
        bottom: 12px;
        right: 12px;
        border-bottom: 1px solid rgba(212, 176, 106, 0.25);
        border-right: 1px solid rgba(212, 176, 106, 0.25);
        border-bottom-right-radius: 4px;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
        #palace-lamp-container {
            right: 16px;
            bottom: 16px;
            width: 60px;
            height: 90px;
        }

        .lamp-panel {
            width: 260px;
            right: -20px;
        }

        .scroll-title { font-size: 16px; }
        .scroll-text { font-size: 13px; }
        .qq-number { font-size: 20px; }
    }
    `;
    document.head.appendChild(style);

    // 点击交互
    container.addEventListener('click', function(e) {
        // 如果点击的是关闭按钮，不切换
        if (e.target.closest('.lamp-close')) return;
        // 如果点击的是面板内部，不切换
        if (e.target.closest('.lamp-panel-inner')) return;

        container.classList.toggle('lamp-lit');

        // 如果点亮了，添加点燃粒子效果
        if (container.classList.contains('lamp-lit')) {
            createSparkParticles();
        }
    });

    // 点燃粒子效果
    function createSparkParticles() {
        var rect = container.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height * 0.45;

        for (var i = 0; i < 12; i++) {
            var particle = document.createElement('div');
            particle.style.cssText = 
                'position:fixed;' +
                'left:' + cx + 'px;' +
                'top:' + cy + 'px;' +
                'width:4px;' +
                'height:4px;' +
                'border-radius:50%;' +
                'background:#FFD966;' +
                'box-shadow:0 0 8px #FF8C42, 0 0 16px #FFB347;' +
                'pointer-events:none;' +
                'z-index:99998;' +
                'transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);';

            document.body.appendChild(particle);

            var angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
            var dist = 30 + Math.random() * 40;
            var dx = Math.cos(angle) * dist;
            var dy = Math.sin(angle) * dist - 20;

            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    particle.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) scale(0)';
                    particle.style.opacity = '0';
                });
            });

            (function(p) {
                setTimeout(function() {
                    if (p.parentNode) p.parentNode.removeChild(p);
                }, 900);
            })(particle);
        }
    }

    // 点击其他地方关闭
    document.addEventListener('click', function(e) {
        if (!container.contains(e.target) && container.classList.contains('lamp-lit')) {
            container.classList.remove('lamp-lit');
        }
    });

    console.log('%c🏮 古代宫灯已点亮，点击灯笼查看公告', 'color: #FFD966; font-size: 14px; font-weight: bold;');
})();
