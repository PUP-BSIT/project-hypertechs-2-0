<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
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

$postData = file_get_contents("php://input");
$request = json_decode($postData);

if (!isset($request->id) || $request->id === null) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

$id = intval($request->id);

$sql = "UPDATE notes SET is_deleted = 0 WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Note restored successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();