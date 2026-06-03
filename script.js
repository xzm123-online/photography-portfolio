// 导航栏滚动效果
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// 滚动监听
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 活跃导航项高亮
    updateActiveNav();
});

// 移动端菜单切换
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 点击导航链接关闭移动菜单
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// 更新活跃导航项
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ===== 图片占位生成 =====
// 使用 canvas 生成高质量占位图片
function generatePlaceholderImage(width, height, text, category, index) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // 深色背景渐变
    const gradients = {
        wilderness: [
            ['#1a1a2e', '#16213e'],
            ['#0f3460', '#1a1a2e'],
            ['#1e3a5f', '#0d1b2a'],
            ['#2c3e50', '#1a252f'],
            ['#1b2838', '#0f1a2c'],
            ['#1e3c58', '#15283a']
        ],
        architecture: [
            ['#2d2d2d', '#1a1a1a'],
            ['#333333', '#1e1e1e'],
            ['#262626', '#141414'],
            ['#3a3a3a', '#222222'],
            ['#2f2f2f', '#1c1c1c'],
            ['#353535', '#202020']
        ],
        life: [
            ['#3d2e1e', '#2a1f14'],
            ['#4a3525', '#332416'],
            ['#3e2f20', '#281d12'],
            ['#453525', '#2f2116'],
            ['#3c2c1c', '#251a10'],
            ['#4e3828', '#362418']
        ],
        portrait: [
            ['#2a1f2e', '#1a1220'],
            ['#332535', '#201828'],
            ['#2d2235', '#1c1522'],
            ['#352a38', '#221c25'],
            ['#2e2430', '#1d1620'],
            ['#382c3d', '#241e28']
        ]
    };

    const catGradients = gradients[category] || gradients.architecture;
    const grad = catGradients[index % catGradients.length];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, grad[0]);
    gradient.addColorStop(1, grad[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 纹理效果 - 颗粒感
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    // 装饰性几何图形
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    // 随机矩形
    for (let i = 0; i < 3; i++) {
        const rx = Math.random() * width * 0.8;
        const ry = Math.random() * height * 0.8;
        const rw = 80 + Math.random() * 200;
        const rh = 60 + Math.random() * 150;
        ctx.strokeRect(rx, ry, rw, rh);
    }

    // 圆形
    for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        const r = 30 + Math.random() * 100;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // 文字标签
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.font = `300 ${Math.floor(width / 15)}px "Noto Sans SC", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const labels = {
        wilderness: ['晨曦山脊', '云海翻涌', '荒原落日', '草甸之风', '远山呼唤', '寂静山谷'],
        architecture: ['都市剪影', '几何之光', '玻璃幻境', '钢铁森林', '空间韵律', '城市脉动'],
        life: ['街角咖啡', '雨后倒影', '窗台光影', '午后静谧', '市井烟火', '时光切片'],
        portrait: ['回眸一瞬', '光影之间', '沉静如海', '微笑的温度', '灵魂凝视', '风中姿态']
    };

    const labelText = (labels[category] || ['摄影作品'])[index] || '摄影作品';
    ctx.fillText(labelText, width / 2, height / 2);

    // 小字
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.font = `${Math.floor(width / 40)}px "Inter", sans-serif`;
    ctx.fillText(`${text} · ${String(index + 1).padStart(2, '0')}`, width / 2, height / 2 + height / 10);

    return canvas.toDataURL('image/jpeg', 0.9);
}

// 生成头像
function generateAvatar() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // 深色渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 640, 800);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#2d2d3f');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 800);

    // 抽象人像轮廓
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    // 头部
    ctx.arc(320, 220, 100, 0, Math.PI * 2);
    ctx.fill();
    // 身体
    ctx.beginPath();
    ctx.moveTo(200, 340);
    ctx.quadraticCurveTo(320, 300, 440, 340);
    ctx.quadraticCurveTo(440, 600, 320, 650);
    ctx.quadraticCurveTo(200, 600, 200, 340);
    ctx.fill();

    // 装饰性线条
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        const y = 50 + i * 50;
        ctx.moveTo(0, y);
        ctx.lineTo(640, y);
        ctx.stroke();
    }

    // 文字
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '300 48px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('山岚。', 320, 720);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '300 18px "Inter", sans-serif';
    ctx.fillText('ARCHITECT / PHOTOGRAPHER', 320, 755);

    return canvas.toDataURL('image/jpeg', 0.9);
}

// 生成 Hero 背景图
function generateHeroBg() {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // 天空渐变
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 1080);
    skyGrad.addColorStop(0, '#0a0a14');
    skyGrad.addColorStop(0.3, '#1a1a3e');
    skyGrad.addColorStop(0.5, '#2d1f3d');
    skyGrad.addColorStop(0.7, '#3d2a2a');
    skyGrad.addColorStop(1, '#1a1510');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 1920, 1080);

    // 远山轮廓
    ctx.fillStyle = '#0d0d1a';
    ctx.beginPath();
    ctx.moveTo(0, 900);
    for (let x = 0; x <= 1920; x += 10) {
        const y = 700 + Math.sin(x * 0.003) * 100 + Math.sin(x * 0.007) * 60 + Math.sin(x * 0.015) * 40;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(1920, 1080);
    ctx.lineTo(0, 1080);
    ctx.fill();

    // 第二层山
    ctx.fillStyle = '#111122';
    ctx.beginPath();
    ctx.moveTo(0, 950);
    for (let x = 0; x <= 1920; x += 10) {
        const y = 780 + Math.sin(x * 0.004 + 1) * 80 + Math.sin(x * 0.01) * 50;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(1920, 1080);
    ctx.lineTo(0, 1080);
    ctx.fill();

    // 水面倒影区域
    ctx.fillStyle = '#0f0f18';
    ctx.fillRect(0, 820, 1920, 260);

    // 光线效果
    const lightGrad = ctx.createRadialGradient(1400, 400, 0, 1400, 400, 800);
    lightGrad.addColorStop(0, 'rgba(255, 200, 150, 0.06)');
    lightGrad.addColorStop(0.5, 'rgba(255, 150, 100, 0.02)');
    lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lightGrad;
    ctx.fillRect(0, 0, 1920, 1080);

    // 星光/颗粒
    for (let i = 0; i < 200; i++) {
        const sx = Math.random() * 1920;
        const sy = Math.random() * 600;
        const sr = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
    }

    // 薄雾
    for (let i = 0; i < 5; i++) {
        const fogGrad = ctx.createRadialGradient(
            Math.random() * 1920, 500 + Math.random() * 400,
            0,
            Math.random() * 1920, 500 + Math.random() * 400,
            400 + Math.random() * 300
        );
        fogGrad.addColorStop(0, 'rgba(255, 255, 255, 0.015)');
        fogGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, 1920, 1080);
    }

    return canvas.toDataURL('image/jpeg', 0.9);
}

// ===== 渲染所有图片 =====
function renderAllImages() {
    const categories = ['wilderness', 'architecture', 'life', 'portrait'];
    const categoryNames = {
        wilderness: '旷野遐想',
        architecture: '建筑光影',
        life: '生活碎片',
        portrait: '人像诗篇'
    };

    categories.forEach(cat => {
        const grid = document.getElementById(`grid-${cat}`);
        if (!grid) return;

        for (let i = 0; i < 6; i++) {
            const dataUrl = generatePlaceholderImage(800, 1000, categoryNames[cat], cat, i);

            const div = document.createElement('div');
            div.className = 'grid-item';
            const img = document.createElement('img');
            img.src = dataUrl;
            img.alt = `${categoryNames[cat]} - ${i + 1}`;
            img.loading = 'lazy';
            img.onload = () => img.classList.add('loaded');
            // 立即标记为已加载（因为dataUrl不需要网络请求）
            img.classList.add('loaded');
            div.appendChild(img);

            // 点击查看大图
            div.addEventListener('click', () => openLightbox(dataUrl));

            grid.appendChild(div);
        }
    });

    // 设置 Hero 背景
    const heroBg = generateHeroBg();
    document.querySelector('.hero').style.backgroundImage = `url(${heroBg})`;

    // 设置头像
    const avatar = generateAvatar();
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg) {
        avatarImg.src = avatar;
    }
}

// ===== Lightbox 功能 =====
function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '✕';
    closeBtn.addEventListener('click', closeLightbox);

    const img = document.createElement('img');
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('img');
    img.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== 表单提交 =====
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = '消息已发送 ✓';
            submitBtn.style.borderColor = '#4ade80';
            submitBtn.style.color = '#4ade80';

            form.reset();

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.borderColor = '';
                submitBtn.style.color = '';
                submitBtn.disabled = false;
            }, 3000);
        }, 1000);
    });
}

// ===== 滚动动画 =====
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-header, .project-grid, .about-content, .contact-form, .contact-info').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    createLightbox();
    renderAllImages();
    setupContactForm();
    setupScrollAnimations();
    updateActiveNav();
});
