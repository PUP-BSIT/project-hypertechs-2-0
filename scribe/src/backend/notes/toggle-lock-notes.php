<?php
include '../db_config.php';

$data = json_decode(file_get_contents("php://input"));

$noteId = $data->id;
$isLocked = $data->is_locked;
$userId = $data->userId;

$sql = "UPDATE notes SET is_locked = ? WHERE id = ? AND user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $isLocked, $noteId, $userId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$stmt->close();
$conn->close();