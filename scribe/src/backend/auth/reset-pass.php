<?php
include '../db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['user_id']) && isset($data['password'])) {
    $user_id = $data['user_id'];
    $new_password = password_hash($data['password'], PASSWORD_DEFAULT);

    // Prepare and execute SQL statement
    $stmt = $conn->prepare(
        "UPDATE users 
        SET password = ? 
        WHERE user_id = ?"
    );

    // Check if prepare() succeeded
    if ($stmt === false) {
        die(json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]));
    }

    // Bind parameters
    $stmt->bind_param("si", $new_password, $user_id);

    // Execute statement
    if ($stmt->execute()) {
        $stmt = $conn->prepare(
            "SELECT email, firstname, lastname, password 
            FROM users WHERE user_id = ?"
        );

        if ($stmt === false) {
            die(json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]));
        }

        $stmt->bind_param("i", $user_id); // User ID is an integer, so use "i"
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($email, $firstname, $lastname, $hashed_password);
        $stmt->fetch();

        echo json_encode([
            'status' => 'success',
            'message' => 'Password reset successful',
            'firstname' => $firstname,
            'lastname' => $lastname,
            'email' => $email
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Execute failed: ' . $stmt->error
        ]);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user_id or password in request data']);
}
