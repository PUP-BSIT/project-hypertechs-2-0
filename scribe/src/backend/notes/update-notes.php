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

// Get the posted data and note ID
$postData = file_get_contents("php://input");
$request = json_decode($postData, true); // Ensure decoding as associative array

// Check if required fields are present and not null
if (
    !isset($request['id']) || !isset($request['title']) || !isset($request['content']) || !isset($request['lastEdited']) || !isset($request['user_id']) ||
    $request['title'] === null || $request['content'] === null || $request['lastEdited'] === null || $request['user_id'] === null
) {
    // Return an error response
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

// Sanitize input data
$id = mysqli_real_escape_string($conn, $request['id']);
$title = mysqli_real_escape_string($conn, $request['title']);
$content = mysqli_real_escape_string($conn, $request['content']);
$lastEdited = mysqli_real_escape_string($conn, $request['lastEdited']);
$user_id = intval($request['user_id']); // Make sure user_id is an integer

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