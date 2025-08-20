// Theme Toggle
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;

// Check for saved theme preference
if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-mode");
  themeSwitch.checked = true;
}

themeSwitch.addEventListener("change", function () {
  if (this.checked) {
    body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }
});

// اصلاح بخش منوی موبایل
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const mobileOverlay = document.createElement("div");
mobileOverlay.className = "mobile-overlay";
document.body.appendChild(mobileOverlay);

hamburger.addEventListener("click", function () {
  this.classList.toggle("active");
  navLinks.classList.toggle("active");
  mobileOverlay.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("active")
    ? "hidden"
    : "";
});

mobileOverlay.addEventListener("click", function () {
  hamburger.classList.remove("active");
  navLinks.classList.remove("active");
  this.classList.remove("active");
  document.body.style.overflow = "";
});

// بستن منو هنگام کلیک روی لینک‌ها
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    mobileOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Back to Top Button
const backToTop = document.querySelector(".back-to-top");

window.addEventListener("scroll", function () {
  if (window.pageYOffset > 300) {
    backToTop.classList.add("active");
  } else {
    backToTop.classList.remove("active");
  }
});

backToTop.addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

// مدیریت مقالات
document.addEventListener('DOMContentLoaded', function() {
    // بارگذاری مقالات
    loadArticles();
    
    // مدیریت فیلترها
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // استفاده از data-category برای فیلتر کردن
            const category = this.getAttribute('data-category') || '';
            loadArticles(category);
        });
    });
    
    // مدیریت جستجو - جستجوی لحظه‌ای هنگام تایپ
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch();
        }, 500); // تاخیر 500 میلی‌ثانیه برای جستجوی لحظه‌ای
    });
    
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('خطا در پاسخ سرور: ' + response.status);
                }
                return response.json();
            })
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
                showMessage('خطا در ارتباط با سرور: ' + error.message, 'error');
                renderEmptyState();
            })
            .finally(() => {
                hideLoading();
            });
    }
    
    // تابع انجام جستجو
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category') || '';
        
        loadArticles(activeCategory, searchTerm);
    }

  // تابع نمایش مقالات
  function renderArticles(articles) {
    const articlesGrid = document.querySelector(".articles-grid");
    if (!articlesGrid) return;

    articlesGrid.innerHTML = "";

    if (articles.length === 0) {
      renderEmptyState();
      return;
    }

    articles.forEach((article) => {
      const articleCard = document.createElement("div");
      articleCard.className = "article-card glass-card";

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
                        <span class="article-date">${formatDate(
                          article.published_at
                        )}</span>
                        <span class="article-views">${
                          article.views || 0
                        } بازدید</span>
                    </div>
                    <div class="article-footer">
                        <a href="../pages/article-detail.html?slug=${
                          article.slug
                        }" class="article-link">
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
    const articlesGrid = document.querySelector(".articles-grid");
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
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR").format(date);
    } catch (e) {
      return dateString;
    }
  }

  // توابع کمکی
  function showLoading() {
    const articlesGrid = document.querySelector(".articles-grid");
    if (!articlesGrid) return;

    articlesGrid.innerHTML = `
            <div class="loading-state" style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px;">
                <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #7c3aed; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;"></div>
                <p>در حال بارگذاری مقالات...</p>
            </div>
        `;
  }

  function hideLoading() {
    // این تابع فقط زمانی استفاده می‌شود که نیاز به پنهان کردن لودینگ باشد
  }

  function showMessage(message, type) {
    // ایجاد یک پیام موقت برای کاربر
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            color: white;
            background-color: ${type === "error" ? "#f44336" : "#4CAF50"};
        `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      if (document.body.contains(messageDiv)) {
        document.body.removeChild(messageDiv);
      }
    }, 3000);
  }
});

// تابع مدیریت خطای تصویر
window.handleImageError = function (imgElement) {
  imgElement.src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGNUY1RjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjODg4Ij7imLFpbiDYp9mE2YTYs9in2YTYqCDYp9mE2K/Ys9in2KzYp9ipPC90ZXh0Pjwvc3ZnPg==";
  imgElement.alt = "تصویر در دسترس نیست";
  imgElement.style.objectFit = "cover";
};

// اضافه کردن استایل انیمیشن برای اسپینر
const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
