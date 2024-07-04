<?php
include '../db_config.php';

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
