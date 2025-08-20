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

// دریافت slug مقاله از URL
$article_slug = $_GET['slug'] ?? '';

if (empty($article_slug)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'شناسه مقاله نامعتبر است']);
    exit;
}

$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
    exit;
}

try {
    // افزایش تعداد بازدیدها
    $stmt = $pdo->prepare("UPDATE articles SET views = views + 1 WHERE slug = ?");
    $stmt->execute([$article_slug]);
    
    // دریافت مقاله
    $stmt = $pdo->prepare("
        SELECT a.*, ac.name as category_name, ac.slug as category_slug 
        FROM articles a 
        LEFT JOIN article_categories ac ON a.category_id = ac.id 
        WHERE a.slug = ? AND a.is_published = TRUE
    ");
    $stmt->execute([$article_slug]);
    $article = $stmt->fetch();
    
    if (!$article) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'مقاله یافت نشد']);
        exit;
    }
    
    // تبدیل مسیر تصویر
    $baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/azhang/';
    if ($article['image_path']) {
        $article['image_url'] = $baseUrl . str_replace('../', '', $article['image_path']);
    } else {
        $article['image_url'] = $baseUrl . '#';
    }
    
    echo json_encode(['status' => 'success', 'article' => $article]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای سرور در دریافت مقاله']);
}
?>