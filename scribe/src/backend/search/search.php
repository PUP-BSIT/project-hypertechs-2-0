<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');
    
    // Database connection credentials
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
    
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
    
    // Retrieve search term from Angular
    $searchTerm = isset($_REQUEST['searchTerm']) ? $_REQUEST['searchTerm'] : '';
    $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    $sql = "SELECT * FROM notes WHERE user_id = ? AND is_deleted = 0 AND (title LIKE ? OR content LIKE ?)";

    // Prepare statement
    $stmt = $conn->prepare($sql);

    // Bind parameters
    $searchTerm = "%$searchTerm%";
    $stmt->bind_param('iss', $userId, $searchTerm, $searchTerm);

    // Execute statement
    $stmt->execute();

    // Get result
    $result = $stmt->get_result();

    // Check if results exist
    if ($result->num_rows > 0) {
        $notes = [];
         while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
        echo json_encode($notes);
    } else {
        echo json_encode(["message" => "No notes found"]);
    }

    $stmt->close();
    $conn->close();
?>