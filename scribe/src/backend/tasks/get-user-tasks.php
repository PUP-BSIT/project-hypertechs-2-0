<?php
include '../db_config.php';

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
