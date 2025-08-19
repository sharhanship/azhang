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









document.addEventListener('DOMContentLoaded', function() {
    // تعریف تابع handleImageError در scope سراسری
    window.handleImageError = function(imgElement) {
        // فقط نمایش آیکون شکسته شدن تصویر
        imgElement.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik0xMC4yOSA0LjI5TDMuODIgMTAuNzFhMiAyIDAgMCAwLTEuMDMgMS43M2wtLjg4IDcuNDFBMiAyIDAgMCAwIDMuODkgMjFINDJhMiAyIDAgMCAwIDEuOTQtMS42NmwuODgtNy40MWEyIDIgMCAwIDAtMS4wMy0xLjczbC02LjQ3LTYuNDJhMiAyIDAgMCAwLTIuODIgMHoiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjE2IiByPSIxIj48L2NpcmNsZT48cGF0aCBkPSJNMTIgMTJ2LTJhMiAyIDAgMCAxIDIgMiI+PC9wYXRoPjwvc3ZnPg==';
        imgElement.alt = 'تصویر در دسترس نیست';
        imgElement.style.backgroundColor = '#f5f5f5';
        imgElement.style.padding = '20px';
        imgElement.style.objectFit = 'contain';
    };

    // بارگذاری تصاویر گالری
    loadGalleryImages();
    
    // تابع بارگذاری تصاویر گالری
    function loadGalleryImages() {
        fetch('./apis/get_gallery.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // تبدیل مسیرهای نسبی به absolute با در نظر گرفتن پوشه azhang
                    const baseUrl = window.location.origin + '/azhang/';
                    data.images.forEach(image => {
                        if (image.image_path) {
                            // حذف ../ از ابتدای مسیر و اضافه کردن به base URL
                            image.image_url = baseUrl + image.image_path.replace(/^\.\.\//, '');
                        } else {
                            image.image_url = '';
                        }
                    });
                    
                    renderGalleryImages(data.images);
                } else {
                    console.error('خطا در بارگذاری تصاویر:', data.message);
                    showEmptyMessage();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showEmptyMessage();
            });
    }
    
    // تابع نمایش تصاویر در گالری
    function renderGalleryImages(images) {
        const imagesGrid = document.querySelector('.images-grid');
        if (!imagesGrid) return;
        
        imagesGrid.innerHTML = '';
        
        if (images.length === 0) {
            showEmptyMessage();
            return;
        }
        
        images.forEach((image, index) => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-card';
            
            imageCard.innerHTML = `
                <div class="image-wrapper">
                    <img 
                        src="${image.image_url}" 
                        alt="${image.title || 'تصویر خانه آژنگ'}" 
                        loading="lazy"
                        onerror="handleImageError(this)"
                    />
                    <div class="image-overlay">
                        <h3>${image.title || 'خانه آژنگ'}</h3>
                        <p>${image.description || 'فعالیت‌های ادبی و فرهنگی'}</p>
                    </div>
                </div>
            `;
            
            imagesGrid.appendChild(imageCard);
        });
    }
    
    // تابع نمایش پیام خالی بودن گالری
    function showEmptyMessage() {
        const imagesGrid = document.querySelector('.images-grid');
        if (!imagesGrid) return;
        
        imagesGrid.innerHTML = `
            <div class="empty-gallery-message">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <h3>هیچ تصویری در گالری وجود ندارد</h3>
                <p>تصاویر به زودی اضافه خواهند شد</p>
            </div>
        `;
    }
});