<?php
// Function to get visitor's IP address
function getVisitorIP() {
    $ipaddress = '';
    if (isset($_SERVER['HTTP_CLIENT_IP']))
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_X_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if(isset($_SERVER['HTTP_FORWARDED']))
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
    return $ipaddress;
}

// Function to get country from IP
function getCountryFromIP($ip) {
    $details = json_decode(file_get_contents("http://ip-api.com/json/{$ip}"));
    return $details->country ?? 'UNKNOWN';
}

try {
    $visitorIP = getVisitorIP();
    $country = getCountryFromIP($visitorIP);
    
    // Define your redirect URLs
    $germanURL = "https://sladostivk.github.io/all/index..html"; // Замените на URL для немецких пользователей
    $otherURL = "https://your-other-page.com";   // Замените на URL для остальных пользователей
    
    // Set response headers
    header('Content-Type: application/json');
    
    // Return JSON response with redirect information
    echo json_encode([
        'success' => true,
        'ip' => $visitorIP,
        'country' => $country,
        'redirect_url' => ($country === 'Germany') ? $germanURL : $otherURL
    ]);
    
} catch (Exception $e) {
    // Handle any errors
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?> 
