     // Tab Switching
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Message Modal
        const viewMessageBtns = document.querySelectorAll('.view-message-btn');
        const messageModal = document.getElementById('messageModal');
        const fullMessageText = document.getElementById('fullMessageText');
        const closeModal = document.getElementById('closeModal');
        
        viewMessageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.getAttribute('data-message');
                fullMessageText.textContent = message;
                messageModal.style.display = 'flex';
            });
        });
        
        closeModal.addEventListener('click', () => {
            messageModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === messageModal) {
                messageModal.style.display = 'none';
            }
        });

document.addEventListener("DOMContentLoaded", function () {
  // مدیریت تب‌ها
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");

      // غیرفعال کردن همه تب‌ها
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));

      // فعال کردن تب انتخاب شده
      tab.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // دکمه بازگشت به خانه
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "../index.html";
    });
  }

  // بارگذاری پیام‌ها از سرور
  loadMessages();

  // تابع بارگذاری پیام‌ها
  function loadMessages() {
    showLoading();

    fetch("../apis/admin_messages.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          renderMessages(data.messages);
        } else {
          showMessage("خطا در بارگذاری پیام‌ها: " + data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage("خطا در ارتباط با سرور", "error");
      })
      .finally(() => {
        hideLoading();
      });
  }

  // تابع نمایش پیام‌ها در جدول
  function renderMessages(messages) {
    const tbody = document.querySelector(".messages-table tbody");
    tbody.innerHTML = "";

    if (messages.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        هیچ پیامی یافت نشد
                    </td>
                </tr>
            `;
      return;
    }

    messages.forEach((message, index) => {
      const tr = document.createElement("tr");

      // کوتاه کردن متن پیام اگر طولانی باشد
      const shortMessage =
        message.message.length > 50
          ? message.message.substring(0, 50) + "..."
          : message.message;

      // فرمت تاریخ
      const messageDate = new Date(message.created_at);
      const formattedDate = messageDate.toLocaleDateString("fa-IR");

      tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHtml(message.name)}</td>
                <td>${escapeHtml(message.phone)}</td>
                <td>${escapeHtml(shortMessage)}</td>
                <td class="action-btns">
                    <button class="btn btn-primary view-message-btn" data-message="${escapeHtml(
                      message.message
                    )}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        مشاهده
                    </button>
                    <button class="btn btn-danger delete-message-btn" data-id="${
                      message.id
                    }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        حذف
                    </button>
                </td>
            `;

      tbody.appendChild(tr);
    });

    // اضافه کردن event listener برای دکمه‌های مشاهده
    document.querySelectorAll(".view-message-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const message = e.target
          .closest(".view-message-btn")
          .getAttribute("data-message");
        showFullMessage(message);
      });
    });

    // اضافه کردن event listener برای دکمه‌های حذف
    document.querySelectorAll(".delete-message-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const messageId = e.target
          .closest(".delete-message-btn")
          .getAttribute("data-id");
        deleteMessage(messageId);
      });
    });
  }

  // تابع نمایش پیام کامل در مودال
  function showFullMessage(message) {
    if (fullMessageText) {
      fullMessageText.textContent = message;
      messageModal.style.display = "block";
    }
  }

  // تابع حذف پیام
  function deleteMessage(messageId) {
    if (!confirm("آیا از حذف این پیام اطمینان دارید؟")) {
      return;
    }

    showLoading();

    fetch("../apis/admin_messages.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: messageId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          showMessage(data.message, "success");
          // بارگذاری مجدد پیام‌ها
          loadMessages();
        } else {
          showMessage("خطا در حذف پیام: " + data.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage("خطا در ارتباط با سرور", "error");
      })
      .finally(() => {
        hideLoading();
      });
  }

  // تابع نمایش پیام
  function showMessage(message, type) {
    // حذف پیام‌های قبلی
    const existingMessages = document.querySelectorAll(".custom-message");
    existingMessages.forEach((msg) => msg.remove());

    // ایجاد پیام جدید
    const messageDiv = document.createElement("div");
    messageDiv.className = `custom-message ${type}`;
    messageDiv.textContent = message;

    // استایل‌دهی به پیام
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 50%;
            transform: translateX(50%);
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            animation: slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
        `;

    if (type === "success") {
      messageDiv.style.background = "rgba(76, 175, 80, 0.8)";
      messageDiv.style.border = "1px solid rgba(76, 175, 80, 0.3)";
    } else {
      messageDiv.style.background = "rgba(244, 67, 54, 0.8)";
      messageDiv.style.border = "1px solid rgba(244, 67, 54, 0.3)";
    }

    document.body.appendChild(messageDiv);

    // حذف خودکار پس از 5 ثانیه
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 5000);
  }

  // تابع نمایش لودینگ
  function showLoading() {
    let spinner = document.getElementById("formSpinner");
    if (!spinner) {
      spinner = document.createElement("div");
      spinner.id = "formSpinner";
      spinner.innerHTML = `
                <div style="
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #FF6B35;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
            `;
      spinner.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 15px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            `;
      document.body.appendChild(spinner);

      // اضافه کردن استایل انیمیشن
      const style = document.createElement("style");
      style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes slideIn {
                    from { top: -100px; opacity: 0; }
                    to { top: 20px; opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; visibility: hidden; }
                }
            `;
      document.head.appendChild(style);
    }
    spinner.style.display = "block";
  }

  // تابع پنهان کردن لودینگ
  function hideLoading() {
    const spinner = document.getElementById("formSpinner");
    if (spinner) {
      spinner.style.display = "none";
    }
  }

  // تابع escape HTML برای جلوگیری از XSS
  function escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }
});















document.addEventListener('DOMContentLoaded', function() {
    // مدیریت فرم افزودن تصویر
    const addImageForm = document.getElementById('addImageForm');
    if (addImageForm) {
        addImageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('title', document.getElementById('imageTitle').value);
            formData.append('description', document.getElementById('imageDescription').value);
            formData.append('image', document.getElementById('imageFile').files[0]);
            
            uploadImage(formData);
        });
    }
    
    // بارگذاری تصاویر گالری
    loadGalleryImages();
    
    // تابع آپلود تصویر
    function uploadImage(formData) {
        showLoading();
        
        fetch('../apis/admin_gallery.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showMessage(data.message, 'success');
                addImageForm.reset();
                // افزودن تصویر جدید به گالری
                addImageToGallery(data.image);
            } else {
                showMessage('خطا در آپلود تصویر: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        })
        .finally(() => {
            hideLoading();
        });
    }
    
    // تابع بارگذاری تصاویر گالری
    function loadGalleryImages() {
        showLoading();
        
        fetch('../apis/admin_gallery.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderGalleryImages(data.images);
                } else {
                    showMessage('خطا در بارگذاری تصاویر: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('خطا در ارتباط با سرور', 'error');
            })
            .finally(() => {
                hideLoading();
            });
    }
    
    // تابع نمایش تصاویر در گالری
    function renderGalleryImages(images) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        galleryGrid.innerHTML = '';
        
        if (images.length === 0) {
            galleryGrid.innerHTML = `
                <div class="no-images">
                    <p>هیچ تصویری در گالری وجود ندارد</p>
                </div>
            `;
            return;
        }
        
        images.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${image.image_path}" alt="${image.title}" onerror="this.src='../content/image/placeholder.jpg'">
                <div class="gallery-item-overlay">
                    <h4>${escapeHtml(image.title)}</h4>
                    ${image.description ? `<p>${escapeHtml(image.description)}</p>` : ''}
                    <button class="btn btn-danger btn-sm delete-image-btn" data-id="${image.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;
            
            galleryGrid.appendChild(galleryItem);
        });
        
        // اضافه کردن event listener برای دکمه‌های حذف
        document.querySelectorAll('.delete-image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const imageId = e.target.closest('.delete-image-btn').getAttribute('data-id');
                deleteImage(imageId);
            });
        });
    }
    
    // تابع افزودن تصویر جدید به گالری
    function addImageToGallery(image) {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        // حذف پیام "هیچ تصویری وجود ندارد"
        if (galleryGrid.querySelector('.no-images')) {
            galleryGrid.innerHTML = '';
        }
        
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image.image_path}" alt="${image.title}" onerror="this.src='../content/image/placeholder.jpg'">
            <div class="gallery-item-overlay">
                <h4>${escapeHtml(image.title)}</h4>
                ${image.description ? `<p>${escapeHtml(image.description)}</p>` : ''}
                <button class="btn btn-danger btn-sm delete-image-btn" data-id="${image.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        
        galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
        
        // اضافه کردن event listener برای دکمه حذف
        const deleteBtn = galleryItem.querySelector('.delete-image-btn');
        deleteBtn.addEventListener('click', (e) => {
            const imageId = e.target.closest('.delete-image-btn').getAttribute('data-id');
            deleteImage(imageId);
        });
    }
    
    // تابع حذف تصویر
    function deleteImage(imageId) {
        if (!confirm('آیا از حذف این تصویر اطمینان دارید؟')) {
            return;
        }
        
        showLoading();
        
        fetch('../apis/admin_gallery.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: imageId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showMessage(data.message, 'success');
                // حذف تصویر از نمایش
                const imageElement = document.querySelector(`.delete-image-btn[data-id="${imageId}"]`);
                if (imageElement) {
                    imageElement.closest('.gallery-item').remove();
                }
                
                // اگر هیچ تصویری نمانده، پیام نمایش داده شود
                const galleryGrid = document.querySelector('.gallery-grid');
                if (galleryGrid && galleryGrid.children.length === 0) {
                    galleryGrid.innerHTML = `
                        <div class="no-images">
                            <p>هیچ تصویری در گالری وجود ندارد</p>
                        </div>
                    `;
                }
            } else {
                showMessage('خطا در حذف تصویر: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        })
        .finally(() => {
            hideLoading();
        });
    }
    
    // تابع نمایش پیام
    function showMessage(message, type) {
        // حذف پیام‌های قبلی
        const existingMessages = document.querySelectorAll('.custom-message');
        existingMessages.forEach(msg => msg.remove());
        
        // ایجاد پیام جدید
        const messageDiv = document.createElement('div');
        messageDiv.className = `custom-message ${type}`;
        messageDiv.textContent = message;
        
        // استایل‌دهی به پیام
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 50%;
            transform: translateX(50%);
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            animation: slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
        `;
        
        if (type === 'success') {
            messageDiv.style.background = 'rgba(76, 175, 80, 0.8)';
            messageDiv.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        } else {
            messageDiv.style.background = 'rgba(244, 67, 54, 0.8)';
            messageDiv.style.border = '1px solid rgba(244, 67, 54, 0.3)';
        }
        
        document.body.appendChild(messageDiv);
        
        // حذف خودکار پس از 5 ثانیه
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
    
    // تابع نمایش لودینگ
    function showLoading() {
        let spinner = document.getElementById('formSpinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'formSpinner';
            spinner.innerHTML = `
                <div style="
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #FF6B35;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
            `;
            spinner.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 15px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            `;
            document.body.appendChild(spinner);
        }
        spinner.style.display = 'block';
    }
    
    // تابع پنهان کردن لودینگ
    function hideLoading() {
        const spinner = document.getElementById('formSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
    
    // تابع escape HTML برای جلوگیری از XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});





















document.addEventListener('DOMContentLoaded', function() {
    // مدیریت فرم افزودن مقاله
    const addArticleForm = document.getElementById('addArticleForm');
    if (addArticleForm) {
        addArticleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('title', document.getElementById('articleTitle').value);
            formData.append('category_id', document.getElementById('articleCategory').value);
            formData.append('content', document.getElementById('articleContent').value);
            
            const imageFile = document.getElementById('articleImage').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }
            
            addArticle(formData);
        });
    }
    
    // بارگذاری مقالات
    loadArticles();
    
    // تابع افزودن مقاله
    function addArticle(formData) {
        showLoading();
        
        fetch('../apis/admin_articles.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showMessage(data.message, 'success');
                addArticleForm.reset();
                // افزودن مقاله جدید به لیست
                addArticleToList(data.article);
            } else {
                showMessage('خطا در ایجاد مقاله: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        })
        .finally(() => {
            hideLoading();
        });
    }
    
    // تابع بارگذاری مقالات
    function loadArticles() {
        showLoading();
        
        fetch('../apis/admin_articles.php')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderArticles(data.articles);
                } else {
                    showMessage('خطا در بارگذاری مقالات: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('خطا در ارتباط با سرور', 'error');
            })
            .finally(() => {
                hideLoading();
            });
    }
    
    // تابع نمایش مقالات در لیست
    function renderArticles(articles) {
        const articlesList = document.querySelector('.articles-list');
        if (!articlesList) return;
        
        articlesList.innerHTML = '';
        
        if (articles.length === 0) {
            articlesList.innerHTML = `
                <div class="no-articles">
                    <p>هیچ مقاله‌ای وجود ندارد</p>
                </div>
            `;
            return;
        }
        
        articles.forEach(article => {
            const articleItem = document.createElement('div');
            articleItem.className = 'article-item';
            articleItem.innerHTML = `
                <div class="article-info">
                    <h3>${escapeHtml(article.title)}</h3>
                    <p>دسته‌بندی: ${escapeHtml(article.category_name)} | تاریخ انتشار: ${formatDate(article.created_at)}</p>
                    ${article.views ? `<p>تعداد بازدید: ${article.views}</p>` : ''}
                </div>
                <div class="action-btns">
                    <button class="btn btn-danger delete-article-btn" data-id="${article.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        حذف
                    </button>
                </div>
            `;
            
            articlesList.appendChild(articleItem);
        });
        
        // اضافه کردن event listener برای دکمه‌های حذف
        document.querySelectorAll('.delete-article-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const articleId = e.target.closest('.delete-article-btn').getAttribute('data-id');
                deleteArticle(articleId);
            });
        });
    }
    
    // تابع افزودن مقاله جدید به لیست
    function addArticleToList(article) {
        const articlesList = document.querySelector('.articles-list');
        if (!articlesList) return;
        
        // حذف پیام "هیچ مقاله‌ای وجود ندارد"
        if (articlesList.querySelector('.no-articles')) {
            articlesList.innerHTML = '';
        }
        
        const articleItem = document.createElement('div');
        articleItem.className = 'article-item';
        articleItem.innerHTML = `
            <div class="article-info">
                <h3>${escapeHtml(article.title)}</h3>
                <p>دسته‌بندی: ${escapeHtml(article.category_name)} | تاریخ انتشار: ${formatDate(article.created_at)}</p>
                ${article.views ? `<p>تعداد بازدید: ${article.views}</p>` : ''}
            </div>
            <div class="action-btns">
                <button class="btn btn-danger delete-article-btn" data-id="${article.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    حذف
                </button>
            </div>
        `;
        
        articlesList.insertBefore(articleItem, articlesList.firstChild);
        
        // اضافه کردن event listener برای دکمه حذف
        const deleteBtn = articleItem.querySelector('.delete-article-btn');
        deleteBtn.addEventListener('click', (e) => {
            const articleId = e.target.closest('.delete-article-btn').getAttribute('data-id');
            deleteArticle(articleId);
        });
    }
    
    // تابع حذف مقاله
    function deleteArticle(articleId) {
        if (!confirm('آیا از حذف این مقاله اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
            return;
        }
        
        showLoading();
        
        fetch('../apis/admin_articles.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: articleId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showMessage(data.message, 'success');
                // حذف مقاله از نمایش
                const articleElement = document.querySelector(`.delete-article-btn[data-id="${articleId}"]`);
                if (articleElement) {
                    articleElement.closest('.article-item').remove();
                }
                
                // اگر هیچ مقاله‌ای نمانده، پیام نمایش داده شود
                const articlesList = document.querySelector('.articles-list');
                if (articlesList && articlesList.children.length === 0) {
                    articlesList.innerHTML = `
                        <div class="no-articles">
                            <p>هیچ مقاله‌ای وجود ندارد</p>
                        </div>
                    `;
                }
            } else {
                showMessage('خطا در حذف مقاله: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('خطا در ارتباط با سرور', 'error');
        })
        .finally(() => {
            hideLoading();
        });
    }
    
    // تابع فرمت تاریخ
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fa-IR');
    }
    
    // تابع نمایش پیام
    function showMessage(message, type) {
        // حذف پیام‌های قبلی
        const existingMessages = document.querySelectorAll('.custom-message');
        existingMessages.forEach(msg => msg.remove());
        
        // ایجاد پیام جدید
        const messageDiv = document.createElement('div');
        messageDiv.className = `custom-message ${type}`;
        messageDiv.textContent = message;
        
        // استایل‌دهی به پیام
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 50%;
            transform: translateX(50%);
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            animation: slideIn 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
        `;
        
        if (type === 'success') {
            messageDiv.style.background = 'rgba(76, 175, 80, 0.8)';
            messageDiv.style.border = '1px solid rgba(76, 175, 80, 0.3)';
        } else {
            messageDiv.style.background = 'rgba(244, 67, 54, 0.8)';
            messageDiv.style.border = '1px solid rgba(244, 67, 54, 0.3)';
        }
        
        document.body.appendChild(messageDiv);
        
        // حذف خودکار پس از 5 ثانیه
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
    
    // تابع نمایش لودینگ
    function showLoading() {
        let spinner = document.getElementById('formSpinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'formSpinner';
            spinner.innerHTML = `
                <div style="
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #FF6B35;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto;
                "></div>
            `;
            spinner.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                padding: 20px;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 15px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            `;
            document.body.appendChild(spinner);
        }
        spinner.style.display = 'block';
    }
    
    // تابع پنهان کردن لودینگ
    function hideLoading() {
        const spinner = document.getElementById('formSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
    
    // تابع escape HTML برای جلوگیری از XSS
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
});