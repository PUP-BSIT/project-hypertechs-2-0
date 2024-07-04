<?php
include '../db_config.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->title)) {
    $user_id = $data->user_id;
    $title = $data->title;
    $description = $data->description;
    $todo = $data->todo;
    $in_progress = $data->in_progress;
    $done = $data->done;

    $query = "INSERT INTO tasks (user_id, title, description, todo, in_progress, done, last_edited) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("isssss", $user_id, $title, $description, $todo, $in_progress, $done);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "task_id" => $stmt->insert_id, "message" => "Task saved successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to save task"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}

$conn->close();
