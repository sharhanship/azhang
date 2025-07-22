document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // منوی هامبورگر - انیمیشن دار
    // ======================
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav ul li a');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // انیمیشن برای لینک‌های منو
        if (mainNav.classList.contains('active')) {
            navLinks.forEach((link, index) => {
                link.style.animation = `fadeInRight 0.5s ease forwards ${index * 0.1 + 0.3}s`;
            });
        } else {
            navLinks.forEach(link => {
                link.style.animation = '';
            });
        }
    });
    
    // بستن منو هنگام کلیک روی لینک
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

       // تنظیمات ذرات با تم آبی تیره
//         particlesJS("particles-js", {
//             "particles": {
//                 "number": {
//                     "value": 80,
//                     "density": {
//                         "enable": true,
//                         "value_area": 800
//                     }
//                 },
//                 "color": {
//                     "value": "#64ffda" // رنگ آبی روشن برای کنتراست
//                 },
//                 "shape": {
//                     "type": "circle",
//                     "stroke": {
//                         "width": 0,
//                         "color": "#000000"
//                     }
//                 },
//                 "opacity": {
//                     "value": 0.5,
//                     "random": true,
//                     "anim": {
//                         "enable": true,
//                         "speed": 1,
//                         "opacity_min": 0.1,
//                         "sync": false
//                     }
//                 },
//                 "size": {
//                     "value": 3,
//                     "random": true,
//                     "anim": {
//                         "enable": true,
//                         "speed": 2,
//                         "size_min": 0.1,
//                         "sync": false
//                     }
//                 },
//                 "line_linked": {
//                     "enable": true,
//                     "distance": 150,
//                     "color": "#1e90ff", // رنگ آبی برای خطوط اتصال
//                     "opacity": 0.4,
//                     "width": 1
//                 },
//                 "move": {
//                     "enable": true,
//                     "speed": 3,
//                     "direction": "none",
//                     "random": true,
//                     "straight": false,
//                     "out_mode": "out",
//                     "bounce": false,
//                     "attract": {
//                         "enable": true,
//                         "rotateX": 600,
//                         "rotateY": 1200
//                     }
//                 }
//             },
//             "interactivity": {
//                 "detect_on": "canvas",
//                 "events": {
//                     "onhover": {
//                         "enable": true,
//                         "mode": "grab" // تغییر به حالت grab برای اثر جذاب‌تر
//                     },
//                     "onclick": {
//                         "enable": true,
//                         "mode": "push" // با کلیک ذرات جدید اضافه می‌شوند
//                     },
//                     "resize": true
//                 },
//                 "modes": {
//                     "grab": {
//                         "distance": 140,
//                         "line_linked": {
//                             "opacity": 1
//                         }
//                     },
//                     "push": {
//                         "particles_nb": 4
//                     }
//                 }
//             },
//             "retina_detect": true
//         });

//           // جلوگیری از کشیدن تصاویر
//   document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('dragstart', function(e) {
//       e.preventDefault();
//     });
//   });

    
    // ======================
    // اسلایدر بنرها
    // ======================
    const slider = {
        slides: document.querySelectorAll('.slide'),
        dotsContainer: document.querySelector('.slider-dots'),
        prevBtn: document.querySelector('.slider-prev'),
        nextBtn: document.querySelector('.slider-next'),
        currentIndex: 0,
        interval: null,
        duration: 9000,
        
        init() {
            // ایجاد نقاط اسلایدر
            this.slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.dotsContainer.appendChild(dot);
            });
            
            this.dots = document.querySelectorAll('.dot');
            
            // رویدادهای دکمه‌ها
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetInterval();
            });
            
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetInterval();
            });
            
            // شروع اسلایدر خودکار
            this.startInterval();
            
            // توقف اسلایدر هنگام هاور
            const sliderContainer = document.querySelector('.slider');
            sliderContainer.addEventListener('mouseenter', () => this.stopInterval());
            sliderContainer.addEventListener('mouseleave', () => this.startInterval());
        },
        
        showSlide(index) {
            // مخفی کردن همه اسلایدها
            this.slides.forEach(slide => {
                slide.classList.remove('active');
                slide.style.opacity = 0;
            });
            
            // مخفی کردن همه نقاط
            this.dots.forEach(dot => dot.classList.remove('active'));
            
            // نمایش اسلاید فعلی
            this.slides[index].classList.add('active');
            setTimeout(() => {
                this.slides[index].style.opacity = 1;
            });
            
            // فعال کردن نقطه مربوطه
            this.dots[index].classList.add('active');
            
            this.currentIndex = index;
        },
        
        nextSlide() {
            const nextIndex = (this.currentIndex + 1) % this.slides.length;
            this.showSlide(nextIndex);
        },
        
        prevSlide() {
            const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            this.showSlide(prevIndex);
        },
        
        goToSlide(index) {
            this.showSlide(index);
        },
        
        startInterval() {
            this.interval = setInterval(() => this.nextSlide(), this.duration);
        },
        
        stopInterval() {
            clearInterval(this.interval);
        },
        
        resetInterval() {
            this.stopInterval();
            this.startInterval();
        }
    };
    
    // راه‌اندازی اسلایدر
    slider.init();
    
    // ======================
    // اسکرول نرم برای لینک‌های منو
    // ======================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ======================
    // انیمیشن‌های اسکرول
    // ======================
    const animateOnScroll = function() {
        const animatedElements = document.querySelectorAll('.service-card, .course-card, .gallery-item, .about-content');
        
        animatedElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // تنظیم حالت اولیه برای عناصر متحرک
    const animatedElements = document.querySelectorAll('.service-card, .course-card, .gallery-item, .about-content');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
});