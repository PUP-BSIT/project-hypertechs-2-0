<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

$servername = "127.0.0.1";
$username = "u565642650_scribe_user";
$password = "Hypertechs2.0_dbpass";
$dbname = "u565642650_scribe_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

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
