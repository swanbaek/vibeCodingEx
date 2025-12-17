// 부드러운 스크롤 및 네비게이션 하이라이트
document.addEventListener('DOMContentLoaded', function() {
    // 현재 스크롤 위치에 따라 네비게이션 활성화
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // 애니메이션을 적용할 요소들
    const animatedElements = document.querySelectorAll(
        '.content-card, .personality-card, .timeline-item, .vision-card, .philosophy-content'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // visible 클래스가 추가되면 요소를 보이게 함
    const style = document.createElement('style');
    style.textContent = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 태그 호버 효과
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 비전 카드 클릭 효과
    const visionCards = document.querySelectorAll('.vision-card');
    visionCards.forEach(card => {
        card.addEventListener('click', function() {
            // 모든 카드의 featured 제거
            visionCards.forEach(c => c.classList.remove('clicked'));
            
            // 클릭된 카드에 효과 추가
            this.classList.add('clicked');
            
            // 잠시 후 제거
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 2000);
        });
    });

    // clicked 클래스 스타일 추가
    const clickedStyle = document.createElement('style');
    clickedStyle.textContent = `
        .vision-card.clicked {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4);
        }
    `;
    document.head.appendChild(clickedStyle);

    // 헤더 스크롤 효과
    let lastScroll = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.style.boxShadow = 'none';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // 성격 카드 호버 효과 개선
    const personalityCards = document.querySelectorAll('.personality-card');
    personalityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
    });

    // 타임라인 아이템 순차 애니메이션
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // 페이지 로드 시 인트로 애니메이션
    const introContent = document.querySelector('.intro-content');
    if (introContent) {
        setTimeout(() => {
            introContent.style.opacity = '1';
        }, 100);
    }

    // 동적 배경 효과 (선택사항)
    createParticles();
});

// 파티클 배경 효과 (선택사항 - 성능에 영향 줄 수 있음)
function createParticles() {
    const introSection = document.querySelector('.intro-section');
    if (!introSection) return;

    const particlesCount = 30;
    
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(99, 102, 241, 0.5);
            border-radius: 50%;
            left: ${posX}%;
            top: ${posY}%;
            animation: float ${duration}s infinite ease-in-out;
            animation-delay: ${delay}s;
            pointer-events: none;
        `;
        
        introSection.appendChild(particle);
    }

    // 파티클 애니메이션 스타일 추가
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            10% {
                opacity: 0.5;
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                opacity: 0.8;
            }
            90% {
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// 네비게이션 메뉴 모바일 토글 (선택사항)
function initMobileMenu() {
    const nav = document.querySelector('.nav');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.style.cssText = `
        display: none;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    `;

    if (window.innerWidth <= 768) {
        menuBtn.style.display = 'block';
        nav.insertBefore(menuBtn, nav.querySelector('.nav-menu'));

        menuBtn.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'rgba(15, 23, 42, 0.98)';
            navMenu.style.padding = '1rem';
        });
    }
}

window.addEventListener('resize', initMobileMenu);
initMobileMenu();

// 스크롤 진행바 (선택사항)
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        z-index: 9999;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createScrollProgress();
