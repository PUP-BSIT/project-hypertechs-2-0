<?php
include '../db_config.php';

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (!isset($request->id) || $request->id === null) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

$id = intval($request->id);

$sql = "UPDATE notes SET is_deleted = 1 WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Note deleted successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
