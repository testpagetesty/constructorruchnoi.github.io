import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'sections');
    // Создаем директорию, если она не существует
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Всегда сохраняем как about.jpg (с маленькой буквы)
    cb(null, 'about.jpg');
  }
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения могут быть загружены!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Хэндлер для обработки ошибок multer
export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    // Используем multer middleware
    await new Promise((resolve, reject) => {
      upload.single('image')(req, {}, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (!req.file) {
      return res.status(400).json({ error: 'Изображение не выбрано' });
    }

    // Путь к загруженному файлу
    const uploadedFilePath = req.file.path;
    
    // Путь для сохранения оптимизированного изображения
    const optimizedFilePath = path.join(process.cwd(), 'public', 'images', 'sections', 'about.jpg');

    // Обработка и оптимизация изображения (изменение размера, сжатие)
    try {
      const metadata = await sharp(uploadedFilePath).metadata();
      let sharpInstance = sharp(uploadedFilePath);
      
      if (metadata.width > 1920) {
        sharpInstance = sharpInstance.resize({ width: 1920 });
      }
      
      // Если это JPEG, сохраняем как JPEG с качеством 80%
      if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
        await sharpInstance.jpeg({ quality: 80 }).toFile(optimizedFilePath);
      } else {
        // Иначе конвертируем в JPEG
        await sharpInstance.jpeg({ quality: 80 }).toFile(optimizedFilePath);
      }

      // Удаляем оригинальный файл
      fs.unlinkSync(uploadedFilePath);
      
      // Возвращаем относительный путь к изображению
      const relativePath = `/images/sections/about.jpg`;
      return res.status(200).json({ path: relativePath });
    } catch (err) {
      console.error('Ошибка при обработке изображения:', err);
      return res.status(500).json({ error: 'Ошибка при обработке изображения' });
    }
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    return res.status(500).json({ error: 'Ошибка при загрузке изображения' });
  }
} 