import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Путь к звуковому файлу
    const soundPath = path.join(process.cwd(), 'public', '1.mp3');
    
    console.log('🔊 API: Trying to read sound file from:', soundPath);
    
    // Проверяем существование файла
    if (!fs.existsSync(soundPath)) {
      console.error('❌ API: Sound file not found at:', soundPath);
      return res.status(404).json({ 
        error: 'Sound file not found',
        path: soundPath
      });
    }

    // Читаем файл
    const soundBuffer = fs.readFileSync(soundPath);
    const stats = fs.statSync(soundPath);
    
    console.log(`✅ API: Sound file loaded successfully, size: ${stats.size} bytes`);
    
    // Устанавливаем заголовки
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('X-File-Size', stats.size.toString());
    
    // Отправляем файл
    res.status(200).send(soundBuffer);
    
  } catch (error) {
    console.error('❌ API: Error reading sound file:', error);
    res.status(500).json({ 
      error: 'Failed to read sound file',
      details: error.message 
    });
  }
} 