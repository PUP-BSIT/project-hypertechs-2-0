<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "scribe_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents("php://input"));

if (isset($data->task_id)) {
    $task_id = $data->task_id;
    $title = $data->title;
    $description = $data->description;
    $todo = $data->todo;
    $in_progress = $data->in_progress;
    $done = $data->done;

    $query = "UPDATE tasks SET title = ?, description = ?, todo = ?, in_progress = ?, done = ? WHERE task_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sssssi", $title, $description, $todo, $in_progress, $done, $task_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Task updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update task"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}

$conn->close();
