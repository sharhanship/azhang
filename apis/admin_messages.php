<?php
header('Content-Type: application/json; charset=utf-8');

// بررسی احراز هویت
// session_start();
// if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
//     http_response_code(401);
//     echo json_encode(['status' => 'error', 'message' => 'دسترسی غیرمجاز']);
//     exit;
// }

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

// بررسی نوع درخواست
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // دریافت پیام‌ها
    $pdo = getDBConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
        exit;
    }
    
    try {
        $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll();
        
        echo json_encode(['status' => 'success', 'messages' => $messages]);
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در دریافت پیام‌ها']);
    }
    
} elseif ($method === 'POST') {
    // حذف پیام
    $data = json_decode(file_get_contents('php://input'), true);
    $messageId = $data['id'] ?? null;
    
    if (!$messageId) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'شناسه پیام نامعتبر است']);
        exit;
    }
    
    $pdo = getDBConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
        exit;
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->execute([$messageId]);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success', 'message' => 'پیام با موفقیت حذف شد']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'پیام یافت نشد']);
        }
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در حذف پیام']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>