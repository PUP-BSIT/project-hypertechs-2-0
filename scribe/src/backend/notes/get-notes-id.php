<?php
include '../db_config.php';

$noteId = isset($_GET['id']) ? intval($_GET['id']) : 0;
$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($noteId > 0 && $userId > 0) {
    $sql = "SELECT * FROM notes WHERE id = $noteId AND user_id = $userId";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $note = $result->fetch_assoc();
        $note['is_pinned'] = intval($note['is_pinned']);
        $note['is_locked'] = intval($note['is_locked']);
        echo json_encode($note);
    } else {
        echo json_encode(["message" => "Note not found"]);
    }
} else {
    echo json_encode(["error" => "Invalid note ID or user ID"]);
}

$conn->close();
