<?php

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
// $username = "root";
// $password = "";
// $dbname = "scribe_db";

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
    $stmt = $conn->prepare("SELECT verification_code FROM verification_codes WHERE verification_code = ?");
    $stmt->bind_param("s", $receivedOtp);
    $stmt->execute();
    $stmt->bind_result($verificationCode);
    $stmt->fetch();
    $stmt->close();

    if ($receivedOtp === $verificationCode) {
        echo json_encode(['status' => 'success', 'otp' => $receivedOtp]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'OTP does not match']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing otp in request data']);
}
?>
