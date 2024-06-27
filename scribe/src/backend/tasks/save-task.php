<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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

if (isset($data->user_id) && isset($data->title)) {
    $user_id = $data->user_id;
    $title = $data->title;
    $description = $data->description;
    $todo = $data->todo;
    $in_progress = $data->in_progress;
    $done = $data->done;

    $query = "INSERT INTO tasks (user_id, title, description, todo, in_progress, done) VALUES (?, ?, ?, ?, ?, ?)";
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
