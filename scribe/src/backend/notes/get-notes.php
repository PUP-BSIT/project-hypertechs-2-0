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

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$sortBy = isset($_GET['sort_by']) ? $_GET['sort_by'] : 'lastEdited';

if ($userId > 0) {
    switch ($sortBy) {
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

    $sql = "SELECT * FROM notes WHERE user_id = $userId ORDER BY $orderBy";
    $result = $conn->query($sql);

    $notes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $row['is_pinned'] = intval($row['is_pinned']);
            $notes[] = $row;
        }
    }

    echo json_encode($notes);
} else {
    echo json_encode(["error" => "Invalid user ID"]);
}

$conn->close();
