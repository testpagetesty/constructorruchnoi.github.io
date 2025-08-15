import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { NextApiRequest, NextApiResponse } from 'next';

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'hero');
    // Создаем директорию, если она не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Всегда сохраняем как Favicon.png
    cb(null, 'Favicon.png');
  }
});

// Настройка загрузчика
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Проверяем, что это изображение
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Только изображения разрешены'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 // 1MB
  }
}).single('image');

// Обработчик загрузки
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  upload(req, res, async function (err) {
    if (err) {
      console.error('Ошибка загрузки:', err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    try {
      // Конвертируем изображение в PNG и изменяем размер
      const filePath = req.file.path;
      await sharp(filePath)
        .resize(32, 32) // Стандартный размер favicon
        .png() // Конвертируем в PNG
        .toFile(filePath);

      // Возвращаем успешный ответ
      res.status(200).json({
        message: 'Favicon успешно загружен',
        filename: 'Favicon.png'
      });
    } catch (error) {
      console.error('Ошибка обработки изображения:', error);
      res.status(500).json({ message: 'Ошибка при обработке изображения' });
    }
  });
}

// Отключаем встроенный парсинг тела запроса
export const config = {
  api: {
    bodyParser: false,
  },
}; 