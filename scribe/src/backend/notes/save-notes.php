<?php
include '../db_config.php';

$postData = file_get_contents("php://input");
$request = json_decode($postData);

// Check if required fields are present and not null
if (
    !isset($request->title) || !isset($request->content) || !isset($request->lastEdited) || !isset($request->user_id) ||
    $request->title === null || $request->content === null || $request->lastEdited === null || $request->user_id === null
) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

// Sanitize input data
$title = mysqli_real_escape_string($conn, $request->title);
$content = mysqli_real_escape_string($conn, $request->content);
$lastEdited = mysqli_real_escape_string($conn, $request->lastEdited);
$user_id = intval($request->user_id);
$themeColor = mysqli_real_escape_string($conn, $request->theme_color);
$isPinned = isset($request->is_pinned) ? intval($request->is_pinned) : 0;

// Convert the lastEdited timestamp to Philippine Standard Time
$dateTime = new DateTime($lastEdited, new DateTimeZone('UTC'));
$dateTime->setTimezone(new DateTimeZone('Asia/Manila'));
$lastEditedFormatted = $dateTime->format('Y-m-d H:i:s');

$sql = "INSERT INTO notes (title, content, last_edited, user_id, theme_color) 
    VALUES ('$title', '$content', '$lastEditedFormatted', $user_id, '$themeColor')";

if ($conn->query($sql) === TRUE) {
    $newNoteId = $conn->insert_id; // Get the ID of the newly created note
    echo json_encode(["id" => $newNoteId, "message" => "Note saved successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
