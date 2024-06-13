<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); 
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8'); // Set content type to JSON

    $servername = "127.0.0.1:3306";
    $username = "u565642650_scribe_user";
    $password = "Hyperstechs2.0_dbpass";
    $dbname = "u565642650_scribe_db";

    // $servername = "localhost";
    // $firstname = "root";
    // $password = "";
    // $dbname = "scribe_db";

    // Create connection
    $conn = new mysqli($servername, $firstname, $password, $dbname);

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

    if (isset($data['lastname']) && isset($data['firstname']) && isset($data['email']) && isset($data['password'])) {
        $lastname = $data['lastname'];
        $firstname = $data['firstname'];
        $email = $data['email'];
        $password = $data['password'];

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        //Check if email exist
        $checkEmailStmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $checkEmailStmt->bind_param("s", $email);
        $checkEmailStmt->execute();
        $checkEmailStmt->store_result();

        if ($checkEmailStmt->num_rows > 0) {
            // Email already exists
            http_response_code(400);
            echo json_encode(['error' => 'User already exists.']);
        }$checkEmailStmt->close();

        // Prepare the SQL INSERT statement
        $stmt = $conn->prepare("INSERT INTO users (lastname, firstname, email, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $lastname, $firstname, $email, $hashed_password);

        if ($stmt->execute()) {

            $_SESSION['firstname'] = $firstname;

            // insert was successful, return a success message
            echo json_encode(['message' => 'User registered successfully.',
             'firstname' => $firstname,
             'lastname' => $lastname,
             'email' => $email
            
            ]);
        } 
        else {
            // error with the insert, return an error message
            http_response_code(500);
            echo json_encode(['error' => 'Failed to register user.']);
        }    
        $stmt->close(); 
    }
    $conn->close();        
?>