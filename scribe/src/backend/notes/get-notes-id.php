<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "scribe_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the note ID from query parameters
$noteId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($noteId > 0) {
    $sql = "SELECT * FROM notes_test WHERE id = $noteId";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $note = $result->fetch_assoc();
        echo json_encode($note);
    } else {
        echo json_encode(["message" => "Note not found"]);
    }
} else {
    echo json_encode(["error" => "Invalid note ID"]);
}

$conn->close();
