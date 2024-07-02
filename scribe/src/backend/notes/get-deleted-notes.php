<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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

$user_id = intval($_GET['user_id']);
$sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'lastEdited';

switch ($sort_by) {
    case 'dateCreated':
        $order_by = 'last_edited ASC';
        break;
    case 'titleAsc':
        $order_by = 'title ASC';
        break;
    case 'titleDesc':
        $order_by = 'title DESC';
        break;
    case 'lastEdited':
    default:
        $order_by = 'last_edited DESC';
        break;
}

$sql = "SELECT * FROM notes WHERE user_id = $user_id AND 
    is_deleted = 1 ORDER BY $order_by";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    echo json_encode($notes);
} else {
    echo json_encode([]);
}

$conn->close();
