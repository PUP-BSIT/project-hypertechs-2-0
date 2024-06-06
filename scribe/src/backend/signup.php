<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); 
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8'); // Set content type to JSON

    $servername = "localhost";
    $firstname = "root";
    $password = "";
    $dbname = "skibidi";

    // Create connection
    $conn = new mysqli($servername, $firstname, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    
    
?>