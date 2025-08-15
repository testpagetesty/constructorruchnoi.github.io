import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRouter } from 'next-connect';

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
    // Всегда сохраняем как hero.jpg
    cb(null, 'hero.jpg');
  }
});

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения разрешены!'), false);
  }
};

// Создаем middleware для загрузки
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Создаем роутер
const router = createRouter();

// Настраиваем обработку загрузки файла
router.use(upload.single('image'));

// Обработчик POST запроса
router.post((req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    res.status(200).json({ 
      message: 'Файл успешно загружен',
      path: '/images/hero/hero.jpg'
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
});

// Обработчик ошибок
router.handler({
  onError: (err, req, res) => {
    console.error('Ошибка:', err);
    res.status(500).json({ message: err.message || 'Внутренняя ошибка сервера' });
  },
  onNoMatch: (req, res) => {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
});

// Отключаем body parser для этого API route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Экспортируем обработчик
export default function handler(req, res) {
  return router.run(req, res);
} 