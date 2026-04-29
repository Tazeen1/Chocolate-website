document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header
    const header = document.getElementById('header');
    const scrollCb = () => {
        if (window.scrollY > 36) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', scrollCb, { passive: true });
    // Trigger on load
    scrollCb();

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 4. Subtle scroll animations using IntersectionObserver
    // Skip if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // 5. Add to Cart Mock Logic
    let cartCount = 0;
    const cartCountEl = document.querySelector('.cart-count');
    const toast = document.getElementById('toast');
    let toastTimeout;

    const showToast = (message) => {
        toast.textContent = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // In case it's inside an anchor somehow
            cartCount++;
            if (cartCountEl) {
                cartCountEl.textContent = cartCount;
            }
            const productName = btn.getAttribute('data-name') || 'Item';
            showToast(`${productName} added to cart!`);
        });
    });

    // 6. Handle forms (prevent default to keep it a static demo)
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you! Your message has been sent. Our team will reach out soon.');
        e.target.reset();
    });

    document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to MeltedLove updates!');
        e.target.reset();
    });

    // 7. Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
        });
    }

    // 8. Image Sequence Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReducedMotion) {
        const context = canvas.getContext('2d');
        const frameCount = 80;
        const currentFrame = index => (
            `./images/hero animation/Chocolate_unwrapping_exploding_i…_202604292127_${index.toString().padStart(3, '0')}.jpg`
        );

        const images = [];
        const preloadImages = () => {
            for (let i = 0; i < frameCount; i++) {
                images[i] = new Image();
                images[i].src = currentFrame(i);
            }
        };

        const img = new Image();
        img.src = currentFrame(0);
        
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderImage(img);
        };
        
        window.addEventListener('resize', setCanvasSize);

        const renderImage = (imgObj) => {
            if (!imgObj.complete) return;
            const hRatio = canvas.width / imgObj.width;
            const vRatio = canvas.height / imgObj.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - imgObj.width * ratio) / 2;
            const centerShift_y = (canvas.height - imgObj.height * ratio) / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(imgObj, 0, 0, imgObj.width, imgObj.height,
                              centerShift_x, centerShift_y, imgObj.width * ratio, imgObj.height * ratio);
        };

        img.onload = () => {
            setCanvasSize();
            preloadImages();
        };

        window.addEventListener('scroll', () => {
            const html = document.documentElement;
            const heroSection = document.querySelector('.hero-sequence');
            if (!heroSection) return;
            
            const scrollTop = html.scrollTop || window.scrollY;
            const maxScroll = heroSection.offsetHeight - window.innerHeight;
            
            let scrollFraction = scrollTop / maxScroll;
            if (scrollFraction < 0) scrollFraction = 0;
            if (scrollFraction > 1) scrollFraction = 1;

            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollFraction * frameCount)
            );
            
            const frameImg = images[frameIndex] || img;
            if (frameImg.complete) {
                requestAnimationFrame(() => renderImage(frameImg));
            }
        });
    } else if (canvas && prefersReducedMotion) {
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = `./images/hero animation/Chocolate_unwrapping_exploding_i…_202604292127_000.jpg`;
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if(img.complete) {
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, img.width, img.height,
                                  centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
            }
        };
        img.onload = setCanvasSize;
        window.addEventListener('resize', setCanvasSize);
    }

});
