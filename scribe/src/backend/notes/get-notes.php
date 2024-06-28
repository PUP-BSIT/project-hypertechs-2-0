<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId > 0) {
    $sql = "SELECT * FROM notes WHERE user_id = $userId ORDER BY last_edited DESC";
    $result = $conn->query($sql);

    $notes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
    }

    echo json_encode($notes);
} else {
    echo json_encode(["error" => "Invalid user ID"]);
}

$conn->close();
