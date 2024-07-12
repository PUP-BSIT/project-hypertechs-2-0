<?php

include '../db_config.php';
include '../send_mail/mail.php';

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read input data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['user_id'])) {
    $user_id = $data['user_id'];

    // Generate verification code
    $verification_code = random_int(100000, 999999);
    $expiration_time = date("Y-m-d H:i:s", strtotime('+120 seconds'));

    // Fetch user details
    $stmt = $conn->prepare(
        "SELECT email, firstname, lastname 
        FROM users WHERE user_id = ?"
    );
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($email, $firstname, $lastname);
    $stmt->fetch();

    // Send the verification code via email
    if (send_mail($email, "Verification Code",  $verification_code, $firstname, $lastname)) {
        $expiration_time = date("Y-m-d H:i:s", strtotime('+80 seconds'));

        // Update the verification code in the database
        $stmt = $conn->prepare(
            "UPDATE verification_codes SET verification_code = ?, 
                created_at = CURRENT_TIMESTAMP, expiration_time = ? 
            WHERE user_id = ?"
        );
        $stmt->bind_param("isi", $verification_code, $expiration_time, $user_id);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                'message' => 'Verification code sent.',
                'otp' => $verification_code,
                'user_id' => $user_id,
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $email
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'error' => 'Internal server error: ' . $stmt->error
            ]);
        }

        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send verification email.']);
    }
} else {
    // Invalid request data
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request data.']);
}

$conn->close();
?>
