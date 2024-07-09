<?php
include '../db_config.php';

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (!isset($request->id) || !isset($request->is_pinned)) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

$id = intval($request->id);
$isPinned = intval($request->is_pinned);

$sql = "UPDATE notes SET is_pinned=$isPinned WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Note pin status updated successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
