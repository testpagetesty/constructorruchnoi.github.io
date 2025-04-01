<?php
// Настройка отображения ошибок
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Функция для логирования
function writeLog($message, $type = 'info') {
    $logFile = $type === 'error' ? 'redirect_error.log' : 'redirect.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Функция для получения IP посетителя
function getVisitorIP() {
    $ipaddress = '';
    
    // Сначала проверяем REMOTE_ADDR
    if (isset($_SERVER['REMOTE_ADDR'])) {
        $ipaddress = $_SERVER['REMOTE_ADDR'];
        writeLog("IP from REMOTE_ADDR: $ipaddress");
    }
    
    // Если IP пустой или невалидный, проверяем другие заголовки
    if (empty($ipaddress) || filter_var($ipaddress, FILTER_VALIDATE_IP) === false) {
        $headers = array(
            'HTTP_CLIENT_IP',
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_FORWARDED',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED'
        );

        foreach ($headers as $header) {
            if (isset($_SERVER[$header])) {
                $ip = $_SERVER[$header];
                writeLog("Found IP in header $header: $ip");
                if (filter_var($ip, FILTER_VALIDATE_IP) !== false) {
                    $ipaddress = $ip;
                    writeLog("Valid IP found in header $header: $ipaddress");
                    break;
                }
            }
        }
    }

    if (empty($ipaddress) || filter_var($ipaddress, FILTER_VALIDATE_IP) === false) {
        writeLog("No valid IP found, using UNKNOWN", 'error');
        return 'UNKNOWN';
    }

    writeLog("Final IP address: $ipaddress");
    return $ipaddress;
}

// Функция для получения страны по IP
function getCountryFromIP($ip) {
    try {
        $url = "http://ip-api.com/json/{$ip}";
        
        // Используем cURL вместо file_get_contents
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            writeLog("Failed to get country for IP: $ip, HTTP Code: $httpCode", 'error');
            return 'UNKNOWN';
        }
        
        if ($response === false) {
            writeLog("Failed to get country for IP: $ip", 'error');
            return 'UNKNOWN';
        }

        $details = json_decode($response);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            writeLog("JSON decode error for IP: $ip", 'error');
            return 'UNKNOWN';
        }

        return $details->country ?? 'UNKNOWN';
    } catch (Exception $e) {
        writeLog("Exception while getting country for IP $ip: " . $e->getMessage(), 'error');
        return 'UNKNOWN';
    }
}

try {
    // Получаем IP
    $visitorIP = getVisitorIP();
    writeLog("Processing request for IP: $visitorIP");
    
    // Для тестирования всегда возвращаем немецкую версию
    $redirectUrl = "https://sladostivk.github.io/all/index..html";
    
    // Устанавливаем заголовки
    header('Content-Type: application/json');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Формируем ответ
    $response = [
        'success' => true,
        'ip' => $visitorIP,
        'country' => 'Germany', // Для теста всегда возвращаем Германию
        'redirect_url' => $redirectUrl,
        'timestamp' => date('Y-m-d H:i:s'),
        'debug_info' => [
            'server_vars' => $_SERVER,
            'headers' => getallheaders()
        ]
    ];
    
    writeLog("Sending response: " . json_encode($response));
    echo json_encode($response);
    
} catch (Exception $e) {
    writeLog("Error occurred: " . $e->getMessage(), 'error');
    
    header('Content-Type: application/json');
    header('HTTP/1.1 500 Internal Server Error');
    header('Access-Control-Allow-Origin: *');
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?> 
