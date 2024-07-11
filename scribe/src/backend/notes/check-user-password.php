<?php
include '../db_config.php';

$data = json_decode(file_get_contents("php://input"));

$password = $data->password;
$userId = $data->userId;

$sql = "SELECT password FROM users WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $storedHash = $row['password'];
    $isCorrect = password_verify($password, $storedHash);
    echo json_encode(["success" => true, "isCorrect" => $isCorrect]);
} else {
    echo json_encode(["success" => false, "error" => "User not found"]);
}

$stmt->close();
$conn->close();