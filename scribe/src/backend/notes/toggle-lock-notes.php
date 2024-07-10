<?php
include '../db_config.php';

$data = json_decode(file_get_contents("php://input"));

$noteId = $data->id;
$isLocked = $data->is_locked;
$password = isset($data->password) ? password_hash($data->password, PASSWORD_DEFAULT) : null;

$sql = "UPDATE notes SET is_locked = ?, password = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isi", $isLocked, $password, $noteId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}

$stmt->close();
$conn->close();