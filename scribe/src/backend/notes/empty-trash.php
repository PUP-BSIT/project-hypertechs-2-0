<?php
include '../db_config.php';

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (!isset($request->user_id) || $request->user_id === null) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

$user_id = intval($request->user_id);

$sql = "DELETE FROM notes WHERE user_id = $user_id AND is_deleted = 1";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Trash emptied successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
