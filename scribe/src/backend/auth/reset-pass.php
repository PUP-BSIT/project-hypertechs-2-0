<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['user_id']) && isset($data['password'])) {
    $user_id = $data['user_id'];
    $new_password = password_hash($data['password'], PASSWORD_DEFAULT);

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scribe_db";

    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and execute SQL statement
    $stmt = $conn->prepare(
        "UPDATE users 
        SET password = ? 
        WHERE user_id = ?");
    
    // Check if prepare() succeeded
    if ($stmt === false) {
        die('Prepare failed: ' . $conn->error);
    }
    
    // Bind parameters
    $stmt->bind_param("si", $new_password, $user_id);
    
    // Execute statement
    if ($stmt->execute()) {

        $stmt = $conn->prepare(
            "SELECT email, firstname, lastname, password 
            FROM users WHERE user_id = ?");

        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($email, $firstname, $lastname, $hashed_password);
        $stmt->fetch();

        echo json_encode([
            'status' => 'success', 
            'message' => 'Password reset successful', 
            'password' =>$new_password,
            'firstname'=>$firstname,
            'lastname'=>$lastname,
            'email'=>$email
        ]);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Execute failed: ' . $stmt->error]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user_id or 
        new_password in request data']);
}
?>
