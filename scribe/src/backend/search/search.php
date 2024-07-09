<?php
include '../db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Retrieve search term from Angular (sanitize input as needed)
$searchTerm = isset($_REQUEST['searchTerm']) ? $_REQUEST['searchTerm'] : '';
$searchTerm = '%' . $searchTerm . '%';  // Prepare for LIKE clause

$userId = isset($_REQUEST['user_id']) ? intval($_REQUEST['user_id']) : 0;

// SQL query for notes table
$notes_sql = "SELECT * FROM notes 
              WHERE user_id = ? 
              AND is_deleted = 0 
              AND (title LIKE ? 
                   OR content LIKE ?)";

// SQL query for tasks table
$tasks_sql = "SELECT * FROM tasks 
              WHERE user_id = ? 
              AND (title LIKE ? 
                   OR description LIKE ? 
                   OR todo LIKE ? 
                   OR in_progress LIKE ? 
                   OR done LIKE ?)";

// Prepare and execute the query for notes
$notes_stmt = $conn->prepare($notes_sql);
$notes_stmt->bind_param("iss", $userId, $searchTerm, $searchTerm);
$notes_stmt->execute();
$notes_result = $notes_stmt->get_result();

// Prepare and execute the query for tasks
$tasks_stmt = $conn->prepare($tasks_sql);
$tasks_stmt->bind_param("isssss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
$tasks_stmt->execute();
$tasks_result = $tasks_stmt->get_result();

// Combine the results
$combined_results = array_merge($notes_result->fetch_all(MYSQLI_ASSOC), $tasks_result->fetch_all(MYSQLI_ASSOC));

// Output of combined results as JSON
echo json_encode($combined_results);

// Close statement and connection
$notes_stmt->close();
$tasks_stmt->close();
$conn->close();
