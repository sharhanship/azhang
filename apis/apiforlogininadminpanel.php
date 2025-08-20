<?php
/**
 * فایل احراز هویت مدیریت (ورود ادمین)
 * 
 * این فایل مسئول بررسی اعتبار نام کاربری و رمز عبور ادمین
 * و ایجاد توکن امنیتی برای دسترسی به بخش مدیریت است.
 */

// شروع سشن برای ذخیره اطلاعات کاربر
session_start();

// تنظیم هدر برای پاسخ JSON
header('Content-Type: application/json');

// تنظیمات اتصال به پایگاه داده
$db_host = 'localhost'; // آدرس سرور دیتابیس
$db_name = 'khaneazhang-db'; // نام دیتابیس
$db_user = 'root'; // نام کاربری دیتابیس
$db_pass = ''; // رمز عبور دیتابیس

// ساختار پیش‌فرض پاسخ
$response = [
    'success' => false, // وضعیت عملیات
    'message' => '' // پیام پاسخ
];

try {
    // ایجاد اتصال به پایگاه داده با PDO
    // $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
        $pdo = new PDO('mysql:host=localhost;dbname=khaneazhang-db', 'root', '');
    // تنظیم حالت خطا به حالت استثنا
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // غیرفعال کردن شبیه‌سازی prepare برای امنیت بیشتر
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    // دریافت داده‌های فرم ورود
    $username = $_POST['username'] ?? ''; // نام کاربری از فرم POST
    $password = $_POST['password'] ?? ''; // رمز عبور از فرم POST

    /**
     * اعتبارسنجی اولیه ورودی‌ها
     * 
     * بررسی می‌کند که فیلدهای نام کاربری و رمز عبور خالی نباشند
     */
    if (empty($username) || empty($password)) {
        throw new Exception('نام کاربری و رمز عبور را وارد کنید');
    }

    /**
     * بررسی کاراکترهای خطرناک برای جلوگیری از حملات
     * 
     * این الگو کاراکترهای خاصی که ممکن است در حملات SQL Injection یا XSS استفاده شوند را بررسی می‌کند
     */
    if (preg_match('/[\'";<>()=*]|--|\/\*|\*\//', $username) || preg_match('/[\'";<>()=*]|--|\/\*|\*\//', $password)) {
        throw new Exception('کاراکترهای غیرمجاز در ورودی');
    }

    /**
     * جستجوی کاربر در پایگاه داده
     * 
     * استفاده از prepared statement برای جلوگیری از SQL Injection
     */
    $stmt = $pdo->prepare("SELECT id, password FROM `admin-users` WHERE username = ? LIMIT 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    // اگر کاربری با این نام کاربری وجود نداشت
    if (!$user) {
        throw new Exception('نام کاربری یا رمز عبور اشتباه است');
    }

    /**
     * بررسی تطابق رمز عبور
     * 
     * استفاده از تابع password_verify برای مقایسه رمز عبور ورودی با هش ذخیره شده
     */
    if (!password_verify($password, $user['password'])) {
        throw new Exception('نام کاربری یا رمز عبور اشتباه است');
    }

    /**
     * ایجاد توکن امنیتی برای احراز هویت
     * 
     * توکن تصادفی 32 بایتی ایجاد می‌شود و در سشن ذخیره می‌شود
     */
    $token = bin2hex(random_bytes(32));
    $_SESSION['admin_token'] = $token; // ذخیره توکن در سشن
    $_SESSION['admin_user_id'] = $user['id']; // ذخیره ID کاربر در سشن

    // تنظیم پاسخ موفقیت‌آمیز
    $response = [
        'success' => true,
        'message' => 'ورود موفقیت آمیز بود',
        'token' => $token // ارسال توکن به کلاینت
    ];

} catch (PDOException $e) {
    // مدیریت خطاهای پایگاه داده
    $response['message'] = 'خطای پایگاه داده';
    // ثبت خطا در لاگ سرور
    error_log("DB Error: " . $e->getMessage());
} catch (Exception $e) {
    // مدیریت سایر خطاها
    $response['message'] = $e->getMessage();
}

// ارسال پاسخ به صورت JSON
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>