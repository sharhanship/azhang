document.addEventListener('DOMContentLoaded', function () {

    // Theme Toggle
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
        }
    });

    // اصلاح بخش منوی موبایل
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-overlay';
    document.body.appendChild(mobileOverlay);

    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    mobileOverlay.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        this.classList.remove('active');
        document.body.style.overflow = '';
    });

    // بستن منو هنگام کلیک روی لینک‌ها
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    let sections = document.querySelectorAll('section');
    let navlinks = document.querySelectorAll('header nav-links a');

    window.onscroll = () => {
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            const offset = 100;
            if (
                rect.top <= offset &&
                rect.bottom >= offset
            ) {
                const id = sec.getAttribute('id');
                navlinks.forEach(link => {
                    link.classList.remove('active');
                });
                const correspondingLink = document.querySelector(`header nav a[href="#${id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });

        let header = document.querySelector('header');
        header.classList.toggle('sticky', window.scrollY > 100);
    }

    // Initialize courses slider
    const coursesSlider = document.querySelector('.courses-slider');
    if (coursesSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        coursesSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - coursesSlider.offsetLeft;
            scrollLeft = coursesSlider.scrollLeft;
        });

        coursesSlider.addEventListener('mouseleave', () => {
            isDown = false;
        });

        coursesSlider.addEventListener('mouseup', () => {
            isDown = false;
        });

        coursesSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - coursesSlider.offsetLeft;
            const walk = (x - startX) * 2;
            coursesSlider.scrollLeft = scrollLeft - walk;
        });
    }

    // Initialize testimonials slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    if (testimonialsSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialsSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialsSlider.offsetLeft;
            scrollLeft = testimonialsSlider.scrollLeft;
        });

        testimonialsSlider.addEventListener('mouseleave', () => {
            isDown = false;
        });

        testimonialsSlider.addEventListener('mouseup', () => {
            isDown = false;
        });

        testimonialsSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsSlider.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsSlider.scrollLeft = scrollLeft - walk;
        });
    }

});
