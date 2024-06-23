<?php
$expire = 864000; // One year duration (adjust as needed)

// Set session garbage collection
ini_set('session.cookie_lifetime', $expire);

// Start session
session_start();


