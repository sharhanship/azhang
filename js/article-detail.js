document.addEventListener('DOMContentLoaded', function() {
    // دریافت slug از URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleSlug = urlParams.get('slug');
    
    if (!articleSlug) {
        showError('مقاله یافت نشد');
        return;
    }
    
    // بارگذاری مقاله
    loadArticle(articleSlug);
    
    // تابع بارگذاری مقاله
    function loadArticle(slug) {
        showLoading();
        
        fetch(`../apis/get_article.php?slug=${encodeURIComponent(slug)}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderArticle(data.article);
                } else {
                    showError('مقاله یافت نشد: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showError('خطا در ارتباط با سرور');
            })
            .finally(() => {
                hideLoading();
            });
    }
    
    // تابع نمایش مقاله
    function renderArticle(article) {
        // به روزرسانی title صفحه
        document.title = `${article.title} | خانه آژنگ`;
        
        // به روزرسانی breadcrumb
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <a href="../index.html">خانه</a>
                <span> / </span>
                <a href="../pages/explore-articles.html">مقالات</a>
                <span> / </span>
                <span>${article.title}</span>
            `;
        }
        
        // به روزرسانی هدر مقاله
        const articleHeader = document.querySelector('.article-header h1');
        if (articleHeader) {
            articleHeader.textContent = article.title;
        }
        
        // به روزرسانی محتوای مقاله
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.innerHTML = `
                <div class="article-image">
                    <img 
                        src="${article.image_url}" 
                        alt="${article.title}" 
                        loading="lazy"
                        onerror="handleImageError(this)"
                    />
                    <div class="article-meta">
                        <span class="category-badge">${article.category_name}</span>
                        <span class="article-date">${formatDate(article.published_at)}</span>
                        <span class="article-views">${article.views || 0} بازدید</span>
                    </div>
                </div>
                <div class="content">
                    ${article.content}
                </div>
            `;
        }
    }
    
    // تابع نمایش خطا
    function showError(message) {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.innerHTML = `
                <div class="error-state">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h3>خطا در بارگذاری مقاله</h3>
                    <p>${message}</p>
                    <a href="../pages/explore-articles.htm" class="btn btn-primary">بازگشت به مقالات</a>
                </div>
            `;
        }
    }
    
    // تابع فرمت تاریخ
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fa-IR').format(date);
    }
    
    // توابع کمکی
    function showLoading() {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            articleContent.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>در حال بارگذاری مقاله...</p>
                </div>
            `;
        }
    }
    
    function hideLoading() {
        // پنهان کردن لودینگ
    }
});

// تابع مدیریت خطای تصویر
window.handleImageError = function(imgElement) {
    imgElement.alt = 'تصویر در دسترس نیست';
    imgElement.style.backgroundColor = '#f5f5f5';
    imgElement.style.padding = '20px';
    imgElement.style.objectFit = 'contain';
};