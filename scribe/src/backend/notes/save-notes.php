<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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

// Get the posted data
$postData = file_get_contents("php://input");
$request = json_decode($postData);

// Check if required fields are present and not null
if (
    !isset($request->title) || !isset($request->content) || !isset($request->lastEdited) ||
    $request->title === null || $request->content === null || $request->lastEdited === null
) {
    // Return an error response
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

// Sanitize input data
$title = mysqli_real_escape_string($conn, $request->title);
$content = mysqli_real_escape_string($conn, $request->content);
$lastEdited = mysqli_real_escape_string($conn, $request->lastEdited);

// Convert the lastEdited timestamp to Philippine Standard Time
$dateTime = new DateTime($lastEdited, new DateTimeZone('UTC')); 
$dateTime->setTimezone(new DateTimeZone('Asia/Manila'));
$lastEditedFormatted = $dateTime->format('Y-m-d H:i:s');

// Insert the note into the database
$sql = "INSERT INTO notes_test (title, content, last_edited) 
    VALUES ('$title', '$content', '$lastEditedFormatted')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Note saved successfully"]);
} else {
    echo json_encode(["error" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
