document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // نمایش اسپینر لودینگ
            showLoading();
            
            // جمع‌آوری داده‌های فرم
            const formData = new FormData(contactForm);
            
            // ارسال درخواست AJAX
            fetch('../apis/submit_contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showMessage(data.message, 'success');
                    contactForm.reset();
                } else if (data.status === 'error') {
                    if (data.errors) {
                        displayFormErrors(data.errors);
                    } else {
                        showMessage(data.message, 'error');
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('خطا در ارتباط با سرور', 'error');
            })
            .finally(() => {
                hideLoading();
            });
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
    
    // تابع نمایش خطاهای فرم
    function displayFormErrors(errors) {
        // حذف خطاهای قبلی
        const existingErrors = document.querySelectorAll('.error-text');
        existingErrors.forEach(error => error.remove());
        
        // حذف کلاس خطا از فیلدها
        const errorFields = document.querySelectorAll('.error-field');
        errorFields.forEach(field => field.classList.remove('error-field'));
        
        // نمایش خطاهای جدید
        for (const field in errors) {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                input.classList.add('error-field');
                
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-text';
                errorDiv.textContent = errors[field];
                errorDiv.style.cssText = `
                    color: #f44336;
                    font-size: 14px;
                    margin-top: 5px;
                    padding: 5px 10px;
                    background: rgba(244, 67, 54, 0.1);
                    border-radius: 5px;
                    border-right: 3px solid #f44336;
                `;
                
                input.parentNode.appendChild(errorDiv);
            }
        }
    }
    
    // توابع نمایش و پنهان کردن لودینگ
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
            
            // اضافه کردن استایل انیمیشن
            const style = document.createElement('style');
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
                .error-field {
                    border-color: #f44336 !important;
                    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
                }
            `;
            document.head.appendChild(style);
        }
        spinner.style.display = 'block';
    }
    
    function hideLoading() {
        const spinner = document.getElementById('formSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
});