<?php
$expire = 864000; // One year duration (adjust as needed)

// Set session garbage collection
ini_set('session.cookie_lifetime', $expire); 

// Start session (optional, can be called in other files)
session_start(); 
?>
