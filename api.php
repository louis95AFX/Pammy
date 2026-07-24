<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$db_name = "pammy_stock";
$username = "pammy_stock";
$password = "EVp8UyuJJq7gpDcSMQyP";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// --- GET ALL PRODUCTS ---
if ($method === 'GET' && $action === 'get_products') {
    try {
        // Fetch all products
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
        $products = $stmt->fetchAll();

        // Attach variants to each product
        foreach ($products as &$product) {
            $vStmt = $pdo->prepare("SELECT color, img FROM product_variants WHERE product_id = ?");
            $vStmt->execute([$product['id']]);
            $product['variants'] = $vStmt->fetchAll();
            $product['price'] = (float)$product['price'];
            $product['id'] = (int)$product['id'];
        }

        echo json_encode($products);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// --- CREATE OR UPDATE PRODUCT ---
elseif ($method === 'POST' && $action === 'save_product') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || empty($data['name']) || empty($data['price']) || empty($data['category']) || empty($data['variants'])) {
        echo json_encode(["error" => "Invalid or incomplete product data."]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $productId = $data['id'] ?? null;

        if ($productId) {
            // UPDATE existing product
            $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, category = ? WHERE id = ?");
            $stmt->execute([$data['name'], $data['price'], $data['category'], $productId]);

            // Clear old variants
            $delStmt = $pdo->prepare("DELETE FROM product_variants WHERE product_id = ?");
            $delStmt->execute([$productId]);
        } else {
            // INSERT new product
            $stmt = $pdo->prepare("INSERT INTO products (name, price, category) VALUES (?, ?, ?)");
            $stmt->execute([$data['name'], $data['price'], $data['category']]);
            $productId = $pdo->lastInsertId();
        }

        // Insert new/updated variants
        $varStmt = $pdo->prepare("INSERT INTO product_variants (product_id, color, img) VALUES (?, ?, ?)");
        foreach ($data['variants'] as $variant) {
            $varStmt->execute([$productId, $variant['color'], $variant['img']]);
        }

        $pdo->commit();
        echo json_encode(["success" => true, "id" => $productId]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// --- DELETE PRODUCT ---
elseif ($method === 'DELETE' && $action === 'delete_product') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(["error" => "No product ID provided."]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid endpoint or request method."]);
}
?>