// اسکریپت فیلتر کردن مقالات
      document.addEventListener("DOMContentLoaded", function () {
        const filterBtns = document.querySelectorAll(".filter-btn");
        const articleCards = document.querySelectorAll(".article-card");

        filterBtns.forEach((btn) => {
          btn.addEventListener("click", function () {
            // حذف کلاس active از همه دکمه‌ها
            filterBtns.forEach((b) => b.classList.remove("active"));
            // اضافه کردن کلاس active به دکمه کلیک شده
            this.classList.add("active");

            const filterValue = this.textContent.trim();

            // فیلتر کردن مقالات
            articleCards.forEach((card) => {
              if (filterValue === "همه مقالات") {
                card.style.display = "flex";
              } else {
                const badgeText = card
                  .querySelector(".article-badge")
                  .textContent.trim();
                if (badgeText === filterValue) {
                  card.style.display = "flex";
                } else {
                  card.style.display = "none";
                }
              }
            });
          });
        });

        // اسکریپت جستجو
        const searchInput = document.querySelector(".search-box input");
        searchInput.addEventListener("input", function () {
          const searchTerm = this.value.trim().toLowerCase();

          articleCards.forEach((card) => {
            const title = card
              .querySelector(".article-title")
              .textContent.toLowerCase();
            const excerpt = card
              .querySelector(".article-excerpt")
              .textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
              card.style.display = "flex";
            } else {
              card.style.display = "none";
            }
          });
        });

        // اسکریپت بازگشت به بالا
        const backToTopBtn = document.querySelector(".back-to-top");

        window.addEventListener("scroll", function () {
          if (window.pageYOffset > 300) {
            backToTopBtn.classList.add("active");
          } else {
            backToTopBtn.classList.remove("active");
          }
        });

        backToTopBtn.addEventListener("click", function () {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      });








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









      document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری مقالات
    loadArticles();
    
    // مدیریت فیلترها
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.textContent.trim() === 'همه مقالات' ? '' : this.textContent.trim();
            loadArticles(category);
        });
    });
    
    // مدیریت جستجو
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    searchBtn.addEventListener('click', performSearch);
    
    // تابع بارگذاری مقالات
    function loadArticles(category = '', searchTerm = '') {
        showLoading();
        
        let url = '../apis/get_articles.php';
        const params = new URLSearchParams();
        
        if (category) params.append('category', category);
        if (searchTerm) params.append('search', searchTerm);
        
        if (params.toString()) {
            url += '?' + params.toString();
        }
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderArticles(data.articles);
                } else {
                    showMessage('خطا در بارگذاری مقالات: ' + data.message, 'error');
                    renderEmptyState();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('خطا در ارتباط با سرور', 'error');
                renderEmptyState();
            })
            .finally(() => {
                hideLoading();
            });
    }
    
    // تابع انجام جستجو
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const activeCategory = document.querySelector('.filter-btn.active').textContent.trim();
        const category = activeCategory === 'همه مقالات' ? '' : activeCategory;
        
        loadArticles(category);
    }
    
    // تابع نمایش مقالات
    function renderArticles(articles) {
        const articlesGrid = document.querySelector('.articles-grid');
        if (!articlesGrid) return;
        
        articlesGrid.innerHTML = '';
        
        if (articles.length === 0) {
            renderEmptyState();
            return;
        }
        
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card glass-card';
            
            articleCard.innerHTML = `
                <div class="article-image">
                    <img 
                        src="${article.image_url}" 
                        alt="${article.title}" 
                        loading="lazy"
                        onerror="handleImageError(this)"
                    />
                    <div class="article-badge">${article.category_name}</div>
                </div>
                <div class="article-content">
                    <h3 class="article-title">${article.title}</h3>
                    <p class="article-excerpt">${article.excerpt}</p>
                    <div class="article-meta">
                        <span class="article-date">${formatDate(article.published_at)}</span>
                        <span class="article-views">${article.views || 0} بازدید</span>
                    </div>
                    <div class="article-footer">
                        <a href="../pages/article-detail.html?slug=${article.slug}" class="article-link">
                            مطالعه مقاله
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                    </div>
                </div>
            `;
            
            articlesGrid.appendChild(articleCard);
        });
    }
    
    // تابع نمایش حالت خالی
    function renderEmptyState() {
        const articlesGrid = document.querySelector('.articles-grid');
        if (!articlesGrid) return;
        
        articlesGrid.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ccc" stroke-width="2"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <h3>مقاله‌ای یافت نشد</h3>
                <p>هیچ مقاله‌ای با معیارهای جستجوی شما مطابقت ندارد</p>
            </div>
        `;
    }
    
    // تابع فرمت تاریخ
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR').format(date);
    }
    
    // توابع کمکی
    function showLoading() {
        // پیاده‌سازی نمایش لودینگ
    }
    
    function hideLoading() {
        // پیاده‌سازی پنهان کردن لودینگ
    }
    
    function showMessage(message, type) {
        // پیاده‌سازی نمایش پیام
    }
});

// تابع مدیریت خطای تصویر
window.handleImageError = function(imgElement) {
    imgElement.alt = 'تصویر در دسترس نیست';
    imgElement.style.backgroundColor = '#f5f5f5';
    imgElement.style.padding = '20px';
    imgElement.style.objectFit = 'contain';
};