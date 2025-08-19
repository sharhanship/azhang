<?php
header('Content-Type: application/json; charset=utf-8');

// تنظیمات CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// بررسی درخواست POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// دریافت و اعتبارسنجی داده‌ها
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

// اعتبارسنجی فیلدها
$errors = [];

if (empty($name)) {
    $errors['name'] = 'نام الزامی است';
} elseif (strlen($name) < 2) {
    $errors['name'] = 'نام باید حداقل ۲ کاراکتر باشد';
} elseif (strlen($name) > 100) {
    $errors['name'] = 'نام نمی‌تواند بیش از ۱۰۰ کاراکتر باشد';
}

if (empty($phone)) {
    $errors['phone'] = 'شماره تماس الزامی است';
} elseif (!preg_match('/^09[0-9]{9}$/', $phone)) {
    $errors['phone'] = 'شماره تماس معتبر نیست (فرمت: 09123456789)';
}

if (empty($message)) {
    $errors['message'] = 'پیام الزامی است';
} elseif (strlen($message) < 10) {
    $errors['message'] = 'پیام باید حداقل ۱۰ کاراکتر باشد';
} elseif (strlen($message) > 1000) {
    $errors['message'] = 'پیام نمی‌تواند بیش از ۱۰۰۰ کاراکتر باشد';
}

// اگر خطایی وجود دارد
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'errors' => $errors]);
    exit;
}

// اتصال به دیتابیس و ذخیره داده‌ها
try {
    $host = 'localhost';
    $dbname = 'khaneazhang-db';
    $username = 'root'; // جایگزین کنید
    $password = ''; // جایگزین کنید

    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    // درج داده در دیتابیس
    $stmt = $pdo->prepare("INSERT INTO messages (name, phone, message) VALUES (?, ?, ?)");
    $stmt->execute([$name, $phone, $message]);

    echo json_encode(['status' => 'success', 'message' => 'پیام شما با موفقیت ارسال شد. با تشکر']);
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای سرور، لطفاً بعداً تلاش کنید']);
} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای ناشناخته']);
}
