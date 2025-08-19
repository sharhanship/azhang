<?php
header('Content-Type: application/json; charset=utf-8');

// غیرفعال کردن احراز هویت موقت
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
    $username = 'root'; // جایگزین کنید
    $password = ''; // جایگزین کنید
    
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
    // دریافت تصاویر گالری
    $pdo = getDBConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
        exit;
    }
    
    try {
        $stmt = $pdo->query("SELECT * FROM gallery ORDER BY created_at DESC");
        $images = $stmt->fetchAll();
        
        echo json_encode(['status' => 'success', 'images' => $images]);
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در دریافت تصاویر']);
    }
    
} elseif ($method === 'POST') {
    // آپلود تصویر جدید
    $pdo = getDBConnection();
    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای اتصال به دیتابیس']);
        exit;
    }
    
    $title = $_POST['title'] ?? '';
    $description = $_POST['description'] ?? '';
    
    if (empty($title)) {
        echo json_encode(['status' => 'error', 'message' => 'عنوان تصویر الزامی است']);
        exit;
    }
    
    // بررسی فایل آپلود شده
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'خطا در آپلود فایل']);
        exit;
    }
    
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $file_type = $_FILES['image']['type'];
    
    if (!in_array($file_type, $allowed_types)) {
        echo json_encode(['status' => 'error', 'message' => 'فرمت فایل مجاز نیست (فقط JPEG, PNG, GIF, WebP)']);
        exit;
    }
    
    // ایجاد پوشه uploads اگر وجود ندارد
    $upload_dir = '../uploads/gallery/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }
    
    // تولید نام فایل منحصر به فرد
    $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $file_name = uniqid() . '_' . time() . '.' . $file_extension;
    $file_path = $upload_dir . $file_name;
    
    // ذخیره فایل
    if (move_uploaded_file($_FILES['image']['tmp_name'], $file_path)) {
        try {
            // ذخیره اطلاعات در دیتابیس
            $stmt = $pdo->prepare("INSERT INTO gallery (title, description, image_path) VALUES (?, ?, ?)");
            $stmt->execute([$title, $description, $file_path]);
            
            $image_id = $pdo->lastInsertId();
            
            echo json_encode([
                'status' => 'success', 
                'message' => 'تصویر با موفقیت آپلود شد',
                'image' => [
                    'id' => $image_id,
                    'title' => $title,
                    'description' => $description,
                    'image_path' => $file_path
                ]
            ]);
            
        } catch (PDOException $e) {
            // حذف فایل آپلود شده در صورت خطای دیتابیس
            unlink($file_path);
            error_log("Database error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'خطای سرور در ذخیره اطلاعات']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'خطا در ذخیره فایل']);
    }
    
} elseif ($method === 'DELETE') {
    // حذف تصویر
    $data = json_decode(file_get_contents('php://input'), true);
    $imageId = $data['id'] ?? null;
    
    if (!$imageId) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'شناسه تصویر نامعتبر است']);
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
        $stmt = $pdo->prepare("SELECT image_path FROM gallery WHERE id = ?");
        $stmt->execute([$imageId]);
        $image = $stmt->fetch();
        
        if (!$image) {
            echo json_encode(['status' => 'error', 'message' => 'تصویر یافت نشد']);
            exit;
        }
        
        // حذف از دیتابیس
        $stmt = $pdo->prepare("DELETE FROM gallery WHERE id = ?");
        $stmt->execute([$imageId]);
        
        if ($stmt->rowCount() > 0) {
            // حذف فایل فیزیکی
            if (file_exists($image['image_path'])) {
                unlink($image['image_path']);
            }
            
            echo json_encode(['status' => 'success', 'message' => 'تصویر با موفقیت حذف شد']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'تصویر یافت نشد']);
        }
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'خطای سرور در حذف تصویر']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>