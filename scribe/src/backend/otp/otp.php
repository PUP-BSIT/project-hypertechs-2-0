<?php
session_start();
include '../db_config.php';
include '../send_mail/mail.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (isset($data['otp'])) {
    $receivedOtp = $data['otp'];

    // Query directly using the OTP
    $stmt = $conn->prepare(
        "SELECT verification_code, expiration_time, user_id 
        FROM verification_codes 
        WHERE verification_code = ?"
    );

    $stmt->bind_param("s", $receivedOtp);
    $stmt->execute();
    $stmt->bind_result($verificationCode, $expirationTime, $user_id);
    $stmt->fetch();
    $stmt->close();

    error_log("Received OTP: " . $receivedOtp);
    error_log("Fetched verification code: " . $verificationCode);

    if ($receivedOtp === $verificationCode) {

         $currentDateTime = new DateTime();
         $otpExpirationDateTime = new DateTime($expirationTime);

         if ($currentDateTime < $otpExpirationDateTime){

            $_SESSION['user_id'] = $user_id;


            $updateStmt = $conn->prepare(
                "UPDATE users 
                 SET is_verified = 1 
                 WHERE user_id = ?"
            );
            $updateStmt->bind_param("i", $user_id);
            $updateStmt->execute();
            $updateStmt->fetch();
            $updateStmt->close();

            $selectStmt = $conn->prepare(
                 "SELECT is_verified, lastname, firstname, email
                    FROM users 
                    WHERE user_id = ?"
            );
            $selectStmt->bind_param("i", $user_id);
            $selectStmt->execute();
            $selectStmt->bind_result($is_verified, $lastname, $firstname, $email);
            $selectStmt->fetch();
            $selectStmt->close();

            echo json_encode([
                'status' => 'success', 
                'otp' => $receivedOtp, 
                'id'=>$user_id, 
                'session'=>$_SESSION['user_id'],
                'verified'=>$is_verified,
                'lastname'=>$lastname,
                'firstname'=>$firstname,
                'email'=>$email
                ]);/*TODO for testing*/
        } else{
            echo json_encode([
                'status' => 'error', 
                'message'=> 'OTP has expired']);
        }  
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'OTP does not match', 
            'userid' => $user_id,
            'verification'=>$verificationCode, 
            'receivedOtp' => $receivedOtp]); /*TODO for testing*/
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing otp in request data']);
}
?>
