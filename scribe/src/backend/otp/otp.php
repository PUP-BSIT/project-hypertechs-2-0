<?php
session_start();
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

            echo json_encode([
                'status' => 'success', 
                'otp' => $receivedOtp, 
                'id'=>$user_id, 
                'session'=>$_SESSION['user_id']]);/*TODO for testing*/
        } else{
            echo json_encode([
                'status' => 'error', 
                'message'=> 'OTP has expired']);
        }  
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'OTP does not match', 
            'verification'=>$verificationCode, 
            'receivedOtp' => $receivedOtp]); /*TODO for testing*/
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing otp in request data']);
}
?>
