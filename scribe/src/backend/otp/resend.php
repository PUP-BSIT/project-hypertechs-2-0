<?php
include '../db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


$input = file_get_contents("php://input");
$data = json_decode($input, true);
//$userId = isset($_REQUEST['user_id']) ? intval($_REQUEST['user_id']) : 0;
//echo $userId;
if (isset($data['user_id'])){
    $user_id = $data['user_id'];
    // Generate verification code
        $verification_code = random_int(100000, 999999);
        $message = "Your verification code is: $verification_code";
        $expiration_time = date("Y-m-d H:i:s", strtotime('+80 seconds'));

$stmt = $conn->prepare(
                "UPDATE verification_codes SET verification_code = ?, 
                    created_at = CURRENT_TIMESTAMP, expiration_time = ? 
                WHERE user_id = ?");

            $stmt->bind_param(
                "isi", $verification_code,
                 $expiration_time, 
                 $user_id);
if ($stmt->execute()) {

            $_SESSION['user_id'] = $user_id;
            $stmt = $conn->prepare(
            "SELECT email, firstname, lastname, password 
            FROM users WHERE user_id = ?");

        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($email, $firstname, $lastname, $hashed_password);
        $stmt->fetch();

            http_response_code(200);
            echo json_encode([
                'message' => 'Verification code sent.',
                'otp' =>$verification_code,
                'user_id'=> $user_id,
                'firstname'=>$firstname,
                'lastname'=>$lastname,
                'email'=>$email
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'error' => 'Internal server error: ' . $stmt->error
            ]);
        }
        $stmt->close();     
}
$conn->close();
?>
