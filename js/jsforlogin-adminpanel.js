

document.addEventListener('DOMContentLoaded', function() {
    // استایل های سفارشی برای پیام خطا
    const style = document.createElement('style');
    style.textContent = `
    .error-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: #ff4444;
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        animation: slideIn 0.3s, fadeOut 0.5s 2.5s forwards;
    }
    .error-message i {
        margin-left: 10px;
    }
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; display: none; }
    }
    `;
    document.head.appendChild(style);

    // بررسی ورودی فارسی و کاراکترهای خطرناک
    function validateInput(input) {
        // بررسی فارسی بودن متن
        const persianRegex = /[\u0600-\u06FF]/;
        if (persianRegex.test(input.value)) {
            showError('ورودی فارسی مجاز نیست. لطفا انگلیسی تایپ کنید.');
            input.value = input.value.replace(/[\u0600-\u06FF]/g, '');
            return false;
        }
        
        // بررسی کاراکترهای خطرناک برای SQL Injection
        const dangerousChars = /['"\\;<>()=*]/;
        if (dangerousChars.test(input.value)) {
            showError('کاراکترهای خاص مجاز نیستند.');
            input.value = input.value.replace(dangerousChars, '');
            return false;
        }
        
        return true;
    }

    // تابع نمایش پیام خطا
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // حذف پیام‌های قبلی
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }

    // مدیریت فرم لاگین
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username');
        const password = document.getElementById('password');
        
        // اعتبارسنجی ورودی ها
        if (!validateInput(username) || !validateInput(password)) {
            return;
        }

        try {
            // نمایش حالت لودینگ
            const submitBtn = document.querySelector('.login-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال بررسی...';

            // ارسال درخواست به سرور
            const formData = new FormData();
            formData.append('username', username.value.trim());
            formData.append('password', password.value.trim());

            const response = await fetch('../apis/apiforlogininadminpanel.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            // بازگرداندن حالت عادی دکمه
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'ورود به پنل';

            if (data.success) {
                // ذخیره توکن در localStorage
                localStorage.setItem('admin_token', data.token);
                // انتقال به صفحه ادمین
                window.location.href = '../security/admin-panel.html?token=' + data.token;
            } else {
                showError(data.message || 'خطا در ورود به سیستم');
            }
        } catch (error) {
            showError('خطا در ارتباط با سرور');
            console.error('Error:', error);
        }
    });

    // جلوگیری از تایپ فارسی
    document.getElementById('username').addEventListener('input', function(e) {
        validateInput(e.target);
    });

    document.getElementById('password').addEventListener('input', function(e) {
        validateInput(e.target);
    });
});