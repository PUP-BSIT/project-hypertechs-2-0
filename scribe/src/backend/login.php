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

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (isset($data['email']) && isset($data['password'])) {
        $email = $data['email'];
        $password = $data['password'];
        
        // SQL SELECT statement
        $stmt = $conn->prepare("SELECT username, password FROM users WHERE email = ?");
        
    } 

    $conn->close();
    
?>
