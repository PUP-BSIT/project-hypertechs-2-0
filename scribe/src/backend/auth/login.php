<?php
    session_start();
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
        $stmt = $conn->prepare("SELECT firstname, password FROM users WHERE email = ?");

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($firstname, $hashed_password);
            $stmt->fetch();

            if (password_verify($password, $hashed_password)) {
                $_SESSION['firstname'] = $firstname;
                // Password is correct, return a success message with the firstname
                echo json_encode(['message' => 'Login successful.', 'firstname' => $firstname]);
                
            } else {
                // Password is incorrect, return an error message
                http_response_code(401);
                echo json_encode(['error' => 'Invalid email or password.']);
            }
        } else {
            // No user found with the provided email, return an error message
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password.']);
        }
        $stmt->close(); 
    } 
    $conn->close(); 
?>