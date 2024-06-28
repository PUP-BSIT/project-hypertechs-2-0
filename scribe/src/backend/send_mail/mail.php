<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-master/src/Exception.php';
require 'PHPMailer-master/src/PHPMailer.php';
require 'PHPMailer-master/src/SMTP.php';

function send_mail($recipient, $subject, $message)
{
    // Validate email format
    if (!filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
        return false; // Return false if email is invalid
    }

    /* comment out this for AbstractAPI validation
    Validate email using Abstract Email Validation API
    $validation_result = validate_email($recipient);
    if ($validation_result['status'] === 'error') {
        // Handle invalid email
        return false;
    } */

    // Email is valid, proceed to send mail
    $mail = new PHPMailer();
    $mail->IsSMTP();
    //$mail->SMTPDebug  = 2;  // Set this to 2 for detailed debugging output
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = "tls";
    $mail->Port       = 587;
    $mail->Host       = "smtp.gmail.com";
    $mail->Username   = "scribe.hypertechs2.0.team@gmail.com";
    $mail->Password   = "ncqk lguj bpnz essr";

    $mail->IsHTML(true);
    $mail->AddAddress($recipient, "recipient-name");
    $mail->SetFrom("scribe.hypertechs2.0.team@gmail.com", "Scribe");
    $mail->Subject = $subject;
    $content = $message;

    $mail->MsgHTML($content); 
    if(!$mail->Send()) {
        error_log("Mailer Error: " . $mail->ErrorInfo); // Log the error
        return false;
    } else {
        return true;
    }
}

/*
//comment out this for AbstractAPI validation
//Function to validate email using Abstract Email Validation API
function validate_email($email)
{
    // Validate email format
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        return ['status' => 'error', 'message' => 'Invalid email format'];
    }

    // Replace 'YOUR_UNIQUE_API_KEY' with your actual API key
    $api_key = "3bcecf8c549b4f0392a01098e4937d5b";

    // Set up cURL request to Abstract Email Validation API
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => "https://emailvalidation.abstractapi.com/v1?api_key=$api_key&email=$email",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    // Decode API response
    $data = json_decode($response, true);

    // Check deliverability status
    if ($data['deliverability'] === "UNDELIVERABLE") {
        return ['status' => 'error', 'message' => 'Email is undeliverable'];
    }

    // Check if email is disposable
    if ($data["is_disposable_email"]["value"] === true) {
        return ['status' => 'error', 'message' => 'Disposable email'];
    }

    // Email address is valid
    return ['status' => 'success', 'message' => 'Email address is valid'];
}
*/
?>