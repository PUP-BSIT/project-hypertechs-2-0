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

$user_id = $_GET['user_id'];

$sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY last_edited DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$tasks = array();
while ($row = $result->fetch_assoc()) {
    $tasks[] = $row;
}

echo json_encode($tasks);

$stmt->close();
$conn->close();
