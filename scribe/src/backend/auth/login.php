<?php

require_once('config.php');
include '../db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT user_id, firstname, lastname, password, is_verified FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($user_id, $firstname, $lastname, $hashed_password, $is_verified);
        $stmt->fetch();

        if (password_verify($password, $hashed_password)) {
            // Password is correct, return a success message with user data
            echo json_encode([
                'message' => 'Login successful.',
                'user_id' => $user_id,
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $email,
                'is_verified' => $is_verified
            ]);
        } elseif(!$is_verified ===1){
            echo json_encode([
                'error' => 'Account not verified yet.',
            ]);

        }
        else {
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
