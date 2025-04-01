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
    $headers = array(
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'REMOTE_ADDR'
    );

    foreach ($headers as $header) {
        if (isset($_SERVER[$header])) {
            $ipaddress = $_SERVER[$header];
            break;
        }
    }

    // Проверка на валидность IP
    if (filter_var($ipaddress, FILTER_VALIDATE_IP) === false) {
        writeLog("Invalid IP detected: $ipaddress", 'error');
        return 'UNKNOWN';
    }

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
    writeLog("Visitor IP: $visitorIP");
    
    // Определяем URL для редиректа (для теста всегда возвращаем немецкую версию)
    $redirectUrl = "https://sladostivk.github.io/all/index..html";
    
    // Устанавливаем заголовки
    header('Content-Type: application/json');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Логируем информацию о запросе
    writeLog("Request - IP: {$visitorIP}, Redirect URL: {$redirectUrl}");
    
    // Формируем ответ
    $response = [
        'success' => true,
        'ip' => $visitorIP,
        'country' => 'Germany', // Для теста всегда возвращаем Германию
        'redirect_url' => $redirectUrl,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    // Отправляем ответ
    echo json_encode($response);
    
} catch (Exception $e) {
    // Обработка ошибок
    header('Content-Type: application/json');
    header('HTTP/1.1 500 Internal Server Error');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    writeLog("Error: " . $e->getMessage(), 'error');
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?> 
