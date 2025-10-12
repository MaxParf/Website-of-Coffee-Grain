<?php
header('Content-Type: application/json; charset=utf-8');

// Получаем JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['name'], $data['phone'], $data['comment'])) {
    echo json_encode(['success' => false]);
    exit;
}

$name = htmlspecialchars($data['name']);
$phone = htmlspecialchars($data['phone']);
$comment = htmlspecialchars($data['comment']);

// === TELEGRAM ===
$token = "ВАШ_ТОКЕН_БОТА";
$chat_id = "@ParMaxAlx";

$txt = "☕ Новое бронирование:\n\n👤 Имя: $name\n📞 Телефон: $phone\n💬 Комментарий: $comment";

@file_get_contents("https://api.telegram.org/bot$token/sendMessage?chat_id=$chat_id&text=" . urlencode($txt));

// === EMAIL ===
$to = "maxpar.fed@gmail.com";
$subject = "Новое бронирование";
$message = nl2br($txt);
$headers = "Content-type: text/html; charset=utf-8\r\n";

@mail($to, $subject, $message, $headers);

echo json_encode(['success' => true]);
?>
