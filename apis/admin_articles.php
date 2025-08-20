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

// بررسی نوع درخواست
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // دریافت مقالات
    $pdo = getDBConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
        exit;
    }
    
    try {
        $stmt = $pdo->query("
            SELECT a.*, ac.name as category_name 
            FROM articles a 
            LEFT JOIN article_categories ac ON a.category_id = ac.id 
            ORDER BY a.created_at DESC
        ");
        $articles = $stmt->fetchAll();
        
        // اصلاح مسیر تصاویر برای نمایش صحیح
        foreach ($articles as &$article) {
            if (!empty($article['image_path'])) {
                $article['image_url'] = str_replace('../', '', $article['image_path']);
            }
        }
        
        echo json_encode(['status' => 'success', 'articles' => $articles]);
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در دریافت مقالات']);
    }
    
} elseif ($method === 'POST') {
    // افزودن مقاله جدید
    $pdo = getDBConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
        exit;
    }
    
    $title = $_POST['title'] ?? '';
    $category_id = $_POST['category_id'] ?? '';
    $content = $_POST['content'] ?? '';
    
    if (empty($title) || empty($category_id) || empty($content)) {
        echo json_encode(['status' => 'error', 'message' => 'تمامی فیلدهای ضروری باید پر شوند']);
        exit;
    }
    
    // تولید slug از عنوان و بررسی تکراری نبودن - همیشه از تابع یکتا استفاده می‌کنیم
    $slug = generateUniqueSlug($pdo, $title);
    
    // بررسی فایل آپلود شده
    $image_path = null;
    $image_url = null;
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $file_type = $_FILES['image']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(['status' => 'error', 'message' => 'فرمت فایل مجاز نیست (فقط JPEG, PNG, GIF, WebP)']);
            exit;
        }
        
        // ایجاد پوشه uploads اگر وجود ندارد
        $upload_dir = '../uploads/articles/';
        if (!file_exists($upload_dir)) {
            if (!mkdir($upload_dir, 0755, true)) {
                echo json_encode(['status' => 'error', 'message' => 'خطا در ایجاد پوشه آپلود']);
                exit;
            }
        }
        
        // بررسی قابل نوشتن بودن پوشه
        if (!is_writable($upload_dir)) {
            echo json_encode(['status' => 'error', 'message' => 'پوشه آپلود قابل نوشتن نیست']);
            exit;
        }
        
        // تولید نام فایل منحصر به فرد
        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid() . '_' . time() . '.' . $file_extension;
        $image_path = $upload_dir . $file_name;
        $image_url = 'uploads/articles/' . $file_name; // مسیر نسبی برای دسترسی وب
        
        // ذخیره فایل
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $image_path)) {
            echo json_encode(['status' => 'error', 'message' => 'خطا در ذخیره فایل']);
            exit;
        }
    }
    
    try {
        // ذخیره اطلاعات در دیتابیس
        $stmt = $pdo->prepare("
            INSERT INTO articles (title, slug, category_id, image_path, content, published_at) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([$title, $slug, $category_id, $image_url, $content]);
        
        $article_id = $pdo->lastInsertId();
        
        // دریافت مقاله ایجاد شده
        $stmt = $pdo->prepare("
            SELECT a.*, ac.name as category_name 
            FROM articles a 
            LEFT JOIN article_categories ac ON a.category_id = ac.id 
            WHERE a.id = ?
        ");
        $stmt->execute([$article_id]);
        $article = $stmt->fetch();
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'مقاله با موفقیت ایجاد شد',
            'article' => $article
        ]);
        
    } catch (PDOException $e) {
        // حذف فایل آپلود شده در صورت خطای دیتابیس
        if ($image_path && file_exists($image_path)) {
            unlink($image_path);
        }
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در ذخیره اطلاعات: ' . $e->getMessage()]);
    }
    
} elseif ($method === 'DELETE') {
    // حذف مقاله
    $data = json_decode(file_get_contents('php://input'), true);
    $articleId = $data['id'] ?? null;
    
    if (!$articleId) {
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
        // دریافت مسیر فایل قبل از حذف
        $stmt = $pdo->prepare("SELECT image_path FROM articles WHERE id = ?");
        $stmt->execute([$articleId]);
        $article = $stmt->fetch();
        
        if (!$article) {
            echo json_encode(['status' => 'error', 'message' => 'مقاله یافت نشد']);
            exit;
        }
        
        // حذف از دیتابیس
        $stmt = $pdo->prepare("DELETE FROM articles WHERE id = ?");
        $stmt->execute([$articleId]);
        
        if ($stmt->rowCount() > 0) {
            // حذف فایل فیزیکی (تبدیل مسیر وب به مسیر فیزیکی)
            if (!empty($article['image_path'])) {
                $physical_path = '../' . $article['image_path'];
                if (file_exists($physical_path)) {
                    unlink($physical_path);
                }
            }
            
            echo json_encode(['status' => 'success', 'message' => 'مقاله با موفقیت حذف شد']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'مقاله یافت نشد']);
        }
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در حذف مقاله']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}

// تابع تولید slug از عنوان
function generateSlug($text) {
    // حذف فاصله‌ها از ابتدا و انتها
    $text = trim($text);
    // تبدیل به حروف کوچک
    $text = mb_strtolower($text, 'UTF-8');
    // جایگزینی فاصله با خط تیره
    $text = preg_replace('/\s+/', '-', $text);
    // حذف کاراکترهای غیر مجاز
    $text = preg_replace('/[^a-z0-9\-]/', '', $text);
    // حذف خط تیره‌های تکراری
    $text = preg_replace('/-+/', '-', $text);
    // حذف خط تیره از ابتدا و انتها
    $text = trim($text, '-');
    
    return $text;
}

// تابع تولید slug یکتا
function generateUniqueSlug($pdo, $title, $counter = 0) {
    $base_slug = generateSlug($title);
    $slug = $base_slug;
    
    if ($counter > 0) {
        $slug = $base_slug . '-' . $counter;
    }
    
    // بررسی وجود slug در دیتابیس
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM articles WHERE slug = ?");
    $stmt->execute([$slug]);
    $result = $stmt->fetch();
    
    if ($result['count'] > 0) {
        return generateUniqueSlug($pdo, $title, $counter + 1);
    }
    
    return $slug;
}
?>