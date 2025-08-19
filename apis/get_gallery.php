<?php
header('Content-Type: application/json; charset=utf-8');

// اتصال به دیتابیس
function getDBConnection() {
    $host = 'localhost';
    $dbname = 'khaneazhang-db';
    $username = 'root';
    $password = '';
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database connection error: " . $e->getMessage());
        return null;
    }
}

// دریافت تصاویر فعال از گالری
$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT id, title, description, image_path 
        FROM gallery 
        WHERE is_active = TRUE 
        ORDER BY created_at DESC 
        LIMIT 4
    ");
    $images = $stmt->fetchAll();
    
    // تغییر مسیرها برای تطبیق با ساختار پوشه azhang
    foreach ($images as &$image) {
        if ($image['image_path']) {
            // تغییر مسیر از ../uploads/ به uploads/ (حذف ../)
            $image['image_path'] = str_replace('../', '', $image['image_path']);
            
            // بررسی وجود فایل در مسیر جدید
            $file_path = $_SERVER['DOCUMENT_ROOT'] . '/azhang/' . $image['image_path'];
            if (!file_exists($file_path)) {
                $image['image_path'] = ''; // مسیر خالی اگر فایل وجود ندارد
            }
        }
    }
    
    echo json_encode(['status' => 'success', 'images' => $images]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای سرور در دریافت تصاویر']);
}
?>