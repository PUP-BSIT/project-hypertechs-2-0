<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json; charset=utf-8'); 

    // Database connection details 
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "scribe_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    $conn->close();
    
?>
