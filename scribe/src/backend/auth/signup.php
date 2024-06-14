<?php
require_once('config.php');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

include '../send_mail/mail.php';

    $servername = "127.0.0.1:3306";
    $username = "u565642650_scribe_user";
    $password = "Hypertechs2.0_dbpass";
    $dbname = "u565642650_scribe_db";

    // $servername = "localhost";
    // $firstname = "root";
    // $password = "";
    // $dbname = "scribe_db";

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

if (isset($data['lastname']) && isset($data['firstname']) && isset($data['email']) && isset($data['password'])) {
    $lastname = $data['lastname'];
    $firstname = $data['firstname'];
    $email = $data['email']; // Retrieve email directly from the decoded JSON data
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

    //comment out this if you want to check if email is legit>>mail.php too
    $validation_result = validate_email($email);
    if ($validation_result['status'] === 'error') {
        // Handle invalid email
        echo json_encode(['error' => 'undeliverable.']);
        http_response_code(500);
        return false;
        $conn->close();
        exit();
    }

    // Prepare the SQL INSERT statement
    $stmt = $conn->prepare("INSERT INTO users (lastname, firstname, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $lastname, $firstname, $email, $hashed_password);

    if ($stmt->execute()) {
        $verification_code = random_int(100000, 999999);
        $message = "Your verification code is: $verification_code";
        $recipient = $email;

        if (!send_mail($recipient, "Verification Code", $message)) {
            http_response_code(500);
            echo json_encode(['error' => "You've undeliverable. Failed to register!"]);
            return false;
            $conn->close();
            exit();
        } 

        $_SESSION['otp'] = $verification_code; // Store the code in the session
            $_SESSION['email'] = $email;
            $_SESSION['firstname'] = $firstname; // Store the firstname in the session
            http_response_code(200);
            echo json_encode([
                'message' => 'User registered successfully.',
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $email,
                'otp' => $verification_code
            ]);

            // Prepare and execute the query to insert the verification code into the verification_codes table
            $stmt = $conn->prepare("INSERT INTO verification_codes (user_id, verification_code, created_at)
                                    SELECT user_id, ?, CURRENT_TIMESTAMP
                                    FROM users
                                    WHERE email = ?");
            $stmt->bind_param("ss", $verification_code, $email);
            $stmt->execute();  
        
    }

    $stmt->close();
} else {
    // Invalid request data
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data.']);
}

$conn->close();

?>
