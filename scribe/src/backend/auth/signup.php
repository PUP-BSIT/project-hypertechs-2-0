<?php

require_once('config.php');

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

include '../send_mail/mail.php';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "scribe_db";

$conn = new mysqli($servername, $username, $password, $dbname);

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

    // Check if email exists
    $checkEmailStmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $checkEmailStmt->bind_param("s", $email);
    $checkEmailStmt->execute();
    $checkEmailStmt->store_result();

    if ($checkEmailStmt->num_rows > 0) {
        // Email already exists
        http_response_code(400);
        echo json_encode(['error' => 'User already exists.']);
        $checkEmailStmt->close();
        $conn->close();
        exit();
    }
    $checkEmailStmt->close();

    /*TODO for testing*/
    // Comment out this if you want to check if email is legit>>mail.php too
    // $validation_result = validate_email($email);
    // if ($validation_result['status'] === 'error') {
    //     // Handle invalid email
    //     echo json_encode(['error' => 'undeliverable.']);
    //     http_response_code(500);
    //     $conn->close();
    //     exit();
    // }

    // Prepare the SQL INSERT statement
    $stmt = $conn->prepare("INSERT INTO users (lastname, firstname, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $lastname, $firstname, $email, $hashed_password);

    if ($stmt->execute()) {
        // Retrieve the last inserted ID
        $user_id = $stmt->insert_id;

        $verification_code = random_int(100000, 999999);
        $message = "Your verification code is: $verification_code";
        $expiration_time = date("Y-m-d H:i:s", strtotime('+80 seconds'));
        $recipient = $email;

        if (!send_mail($recipient, "Verification Code", $message)) {
            http_response_code(500);
            echo json_encode(['error' => "You've undeliverable. Failed to register!"]);
            $conn->close();
            exit();
        }

        $_SESSION['otp'] = $verification_code; /*TODO for testing*/
        $_SESSION['email'] = $email; /*TODO for testing*/
        $_SESSION['firstname'] = $firstname;  /*TODO for testing*/
        $_SESSION['user_id'] = $user_id;

        http_response_code(200);
        echo json_encode([
            'message' => 'User registered successfully.',
            'user_id' => $user_id,
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email,
            'otp' => $verification_code
        ]);

        // Prepare and execute the query to insert the verification code into the verification_codes table
        $stmt = $conn->prepare("INSERT INTO verification_codes (user_id, verification_code, created_at, expiration_time)
                                VALUES (?, ?, CURRENT_TIMESTAMP,?)");
        $stmt->bind_param("iss", $user_id, $verification_code, $expiration_time);
        $stmt->execute();
    } else {
        // Failed to insert user
        http_response_code(500);
        echo json_encode(['error' => 'Failed to register user.']);
    }

    $stmt->close();
} else {
    // Invalid request data
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data.']);
}

$conn->close();

?>
