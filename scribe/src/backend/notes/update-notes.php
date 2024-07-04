<?php
include '../db_config.php';

$postData = file_get_contents("php://input");
$request = json_decode($postData, true);

if (
    !isset($request['id']) || !isset($request['title']) || !isset($request['content']) || !isset($request['lastEdited']) || !isset($request['user_id']) ||
    $request['title'] === null || $request['content'] === null || $request['lastEdited'] === null || $request['user_id'] === null
) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

// Sanitize input data
$id = mysqli_real_escape_string($conn, $request['id']);
$title = mysqli_real_escape_string($conn, $request['title']);
$content = mysqli_real_escape_string($conn, $request['content']);
$lastEdited = mysqli_real_escape_string($conn, $request['lastEdited']);
$user_id = intval($request['user_id']);
$isPinned = isset($request->is_pinned) ? intval($request->is_pinned) : 0;

// Convert the lastEdited timestamp to Philippine Standard Time
$dateTime = new DateTime($lastEdited, new DateTimeZone('UTC')); 
$dateTime->setTimezone(new DateTimeZone('Asia/Manila'));
$lastEditedFormatted = $dateTime->format('Y-m-d H:i:s');

// Update the note in the database only if it belongs to the user
$sql = "UPDATE notes SET title='$title', content='$content', last_edited='$lastEditedFormatted' WHERE id='$id' AND user_id=$user_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Note updated successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();