<?php
error_reporting(E_ALL);

// Debugging - Print contents of $_REQUEST array
var_dump($_REQUEST);

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
echo json_encode($result);

?>
