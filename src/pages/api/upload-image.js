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
    // Определяем тип загрузки по имени поля
    const isFavicon = file.fieldname === 'favicon';
    const filename = isFavicon ? 'Favicon.png' : 'fon.jpg';
    cb(null, filename);
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
}).fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'background', maxCount: 1 }
]);

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

    if (!req.files) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    try {
      // Определяем тип загрузки по наличию файла в соответствующем поле
      const isFavicon = req.files.favicon && req.files.favicon[0];
      const file = isFavicon ? req.files.favicon[0] : req.files.background[0];
      const filePath = file.path;

      console.log('Начало обработки файла:', filePath);
      console.log('Тип файла:', isFavicon ? 'favicon' : 'background');

      if (isFavicon) {
        // Обработка favicon
        console.log('Обработка favicon...');
        
        // Сначала читаем файл
        const imageBuffer = await fs.promises.readFile(filePath);
        console.log('Файл прочитан, размер:', imageBuffer.length);

        // Обрабатываем изображение
        const processedImage = await sharp(imageBuffer)
          .resize(256, 256, { 
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .png({ quality: 100 })
          .toBuffer();
        
        console.log('Изображение обработано, новый размер:', processedImage.length);

        // Сохраняем обработанное изображение
        await fs.promises.writeFile(filePath, processedImage);
        console.log('Файл сохранен');

        // Проверяем размеры сохраненного файла
        const metadata = await sharp(filePath).metadata();
        console.log('Размеры сохраненного файла:', metadata.width, 'x', metadata.height);
      } else {
        // Обработка фонового изображения
        await sharp(filePath)
          .resize(1920, 1080, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(filePath);
      }

      // Возвращаем успешный ответ
      res.status(200).json({
        message: 'Изображение успешно загружено',
        filename: isFavicon ? 'Favicon.png' : 'fon.jpg'
      });
    } catch (error) {
      console.error('Ошибка обработки изображения:', error);
      // Даже если произошла ошибка, возвращаем успешный ответ, если файл был сохранен
      if (fs.existsSync(filePath)) {
        res.status(200).json({
          message: 'Изображение загружено, но произошла ошибка при обработке',
          filename: isFavicon ? 'Favicon.png' : 'fon.jpg'
        });
      } else {
        res.status(500).json({ message: 'Ошибка при обработке изображения' });
      }
    }
  });
}

// Отключаем встроенный парсинг тела запроса
export const config = {
  api: {
    bodyParser: false,
  },
};