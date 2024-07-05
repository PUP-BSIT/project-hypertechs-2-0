<?php
    require_once('../auth/config.php');

    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8');

    include '../send_mail/mail.php';

    $servername = "127.0.0.1";
    $username = "u565642650_scribe_user";
    $password = "Hypertechs2.0_dbpass";
    $dbname = "u565642650_scribe_db";

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

    if (isset($data['email'])) {
        $email = $data['email'];

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            $conn->close();
            exit();
        }

        // Check if the email exists in the users table
        $checkStmt = $conn->prepare(
            "SELECT user_id 
            FROM users 
            WHERE email = ?"
        );

        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows == 0) {
            // Email does not exist in users table
            http_response_code(404);
            echo json_encode([
                'error' => 'Email does not exist! 
                    Please enter your registered email account.']);
            $conn->close();
            exit();
        }

        // Fetch the user_id
        $checkStmt->bind_result($user_id);
        $checkStmt->fetch();
        $checkStmt->close();

        // Generate verification code
        $verification_code = random_int(100000, 999999);
        $message = "Your verification code is: $verification_code";
        $expiration_time = date("Y-m-d H:i:s", strtotime('+80 seconds'));

        // Send verification code to the email
        if (!send_mail($email, "Verification Code", $message)) {
            http_response_code(500);
            echo json_encode(['error' => "Failed to send verification code."]);
            $conn->close();
            exit();
        }

        //Update existing verification code
            $stmt = $conn->prepare(
                "UPDATE verification_codes SET verification_code = ?, 
                    created_at = CURRENT_TIMESTAMP, expiration_time = ? 
                WHERE user_id = ?");

            $stmt->bind_param(
                "isi", $verification_code,
                 $expiration_time, 
                 $user_id);

        if ($stmt->execute()) {

            $_SESSION['email'] = $email;
            $_SESSION['user_id'] = $user_id;

            http_response_code(200);
            echo json_encode([
                'message' => 'Verification code sent.',
                'email' => $email,
                'otp' =>$verification_code,
                'user_id'=> $user_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'error' => 'Internal server error: ' . $stmt->error
            ]);
        }      
        $stmt->close();
    } else {
        // Invalid request data
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request data.']);
    }

    $conn->close();
?>
