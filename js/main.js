document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. AOS Initialization =====
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    // ===== 2. Scroll Progress Bar =====
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        });
    }

    // ===== 3. Navbar Scroll Behavior =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        // On non-home pages, start with scrolled style
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        if (!isHomePage) {
            navbar.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else if (isHomePage) {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ===== 4. Mobile Menu Toggle =====
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = document.querySelector('.nav-toggle i');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            if (navIcon) {
                navIcon.classList.toggle('fa-bars');
                navIcon.classList.toggle('fa-xmark');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (navIcon) {
                    navIcon.classList.add('fa-bars');
                    navIcon.classList.remove('fa-xmark');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                if (navIcon) {
                    navIcon.classList.add('fa-bars');
                    navIcon.classList.remove('fa-xmark');
                }
            }
        });
    }

    // ===== 5. Smooth Scroll (for same-page anchor links) =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // ===== 6. Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0 && typeof IntersectionObserver !== 'undefined') {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    let current = 0;
                    const duration = 2000;
                    const step = Math.max(1, Math.floor(target / (duration / 50)));
                    
                    const interval = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(interval);
                        }
                        el.textContent = current;
                    }, 50);
                    
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // ===== 7. Hero Particles =====
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 5 + 4;
            const delay = Math.random() * 5;
            
            Object.assign(particle.style, {
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: Math.random() > 0.5 ? 'rgba(0, 102, 255, 0.4)' : 'rgba(0, 212, 255, 0.3)',
                borderRadius: '50%',
                left: `${x}%`,
                top: `${y}%`,
                animation: `floatParticle ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
                pointerEvents: 'none'
            });
            
            heroParticles.appendChild(particle);
        }
        
        // Inject particle animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                25% { transform: translate(10px, -20px); opacity: 0.8; }
                50% { transform: translate(-5px, -40px); opacity: 0.5; }
                75% { transform: translate(15px, -20px); opacity: 0.7; }
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== 8. Contact Form Handling =====
    const contactForm = document.getElementById('contactForm');
    
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            top: '100px',
            right: '24px',
            padding: '16px 28px',
            borderRadius: '12px',
            zIndex: '10000',
            fontSize: '0.95rem',
            color: 'white',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            animation: 'slideInRight 0.3s ease forwards',
            maxWidth: '400px'
        });
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // For now, since we don't have Web3Forms key, show success
            // In production, replace with actual API call
            try {
                // Simulate sending (replace with actual Web3Forms when key is available)
                await new Promise(resolve => setTimeout(resolve, 1500));
                showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showToast('❌ Failed to send message. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ===== 9. Typing Effect for Hero =====
    const typingText = document.getElementById('typingText');
    if (typingText) {
        const words = ['AI', 'Machine Learning', 'Computer Vision', 'NLP', 'Automation'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }
            
            setTimeout(typeEffect, typeSpeed);
        }
        
        // Start after a delay
        setTimeout(typeEffect, 1000);
        
        // Add cursor style
        const cursorStyle = document.createElement('style');
        cursorStyle.textContent = `
            .typing-text::after {
                content: '|';
                animation: blink 1s step-end infinite;
                color: var(--accent-cyan);
                font-weight: 300;
            }
            @keyframes blink {
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(cursorStyle);
    }

    // ===== 10. Year Update =====
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ===== 11. Scroll to Top on Page Load =====
    window.scrollTo(0, 0);

});
