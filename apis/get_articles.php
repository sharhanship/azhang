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

// دریافت پارامترهای فیلتر
$category = $_GET['category'] ?? '';
$search = $_GET['search'] ?? '';

$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
    exit;
}

try {
    // ساخت query بر اساس فیلترها
    $query = "
        SELECT a.*, ac.name as category_name, ac.slug as category_slug 
        FROM articles a 
        LEFT JOIN article_categories ac ON a.category_id = ac.id 
        WHERE a.is_published = TRUE
    ";
    
    $params = [];
    
    if (!empty($category)) {
        $query .= " AND ac.slug = ?";
        $params[] = $category;
    }
    
    if (!empty($search)) {
        $query .= " AND (a.title LIKE ? OR a.content LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $query .= " ORDER BY a.published_at DESC, a.created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $articles = $stmt->fetchAll();
    
    // تبدیل مسیرهای تصاویر
    $baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/azhang/';
    foreach ($articles as &$article) {
        if ($article['image_path']) {
            $article['image_url'] = $baseUrl . str_replace('../', '', $article['image_path']);
        } else {
            $article['image_url'] = $baseUrl . '#';
        }
        
        // ایجاد خلاصه متن
        $article['excerpt'] = mb_substr(strip_tags($article['content']), 0, 150) . '...';
    }
    
    echo json_encode(['status' => 'success', 'articles' => $articles]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'خطای سرور در دریافت مقالات']);
}
?>