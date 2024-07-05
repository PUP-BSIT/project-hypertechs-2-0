<?php
<<<<<<< HEAD
include '../db_config.php';
=======
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
>>>>>>> c8242e713334eaa1044d1e5031cb66060ba15107

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;
$sort_by = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'lastEdited';

switch ($sort_by) {
    case 'dateCreated':
        $orderBy = 'last_edited ASC';
        break;
    case 'titleAsc':
        $orderBy = 'title ASC';
        break;
    case 'titleDesc':
        $orderBy = 'title DESC';
        break;
    case 'lastEdited':
    default:
        $orderBy = 'last_edited DESC';
        break;
}

$sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY $orderBy";
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
