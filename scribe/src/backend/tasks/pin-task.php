<?php
include '../db_config.php';

$data = json_decode(file_get_contents('php://input'), true);
$task_id = $data['task_id'];
$is_pinned = $data['is_pinned'] ? 1 : 0; // Convert boolean to 1 or 0 for database

$sql = "UPDATE tasks SET is_pinned = ? WHERE task_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $is_pinned, $task_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update task"]);
}

$stmt->close();
$conn->close();
?>
