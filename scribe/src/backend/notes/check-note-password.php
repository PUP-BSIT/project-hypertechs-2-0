<?php
include '../db_config.php';

$data = json_decode(file_get_contents("php://input"));

$noteId = $data->id;
$password = $data->password;

$sql = "SELECT password FROM notes WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $noteId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $isCorrect = password_verify($password, $row['password']);
    echo json_encode(["success" => true, "isCorrect" => $isCorrect]);
} else {
    echo json_encode(["success" => false, "error" => "Note not found"]);
}

$stmt->close();
$conn->close();