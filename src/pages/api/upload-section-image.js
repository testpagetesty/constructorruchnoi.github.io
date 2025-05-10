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
    // Получаем ID секции из запроса
    // Используем временное имя с меткой времени, позже переименуем
    const timestamp = Date.now();
    cb(null, `temp_${timestamp}.jpg`);
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

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Метод не разрешен' });
  }

  upload.single('image')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Ошибка загрузки файла: ' + err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    try {
      // Конвертируем изображение и оптимизируем
      let filePath = req.file.path;
      console.log(`Uploaded file path: ${filePath}, mimetype: ${req.file.mimetype}, originalname: ${req.file.originalname}`);
      
      // После загрузки файла получаем ID секции
      const sectionId = req.body.sectionId;
      if (!sectionId) {
        throw new Error('ID секции не указан');
      }
      console.log(`Section ID: ${sectionId}`);
      
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'sections');
      // Используем тот же формат имени файла, что и в превью
      const newFileName = `${sectionId}.jpg`;
      const newFilePath = path.join(uploadDir, newFileName);
      
      // Обрабатываем изображение и сохраняем в формате JPG
      try {
        const inputBuffer = fs.readFileSync(filePath);
        const outputBuffer = await sharp(inputBuffer)
          .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
        
        // Записываем буфер в файл
        fs.writeFileSync(newFilePath, outputBuffer);
        
        // Удаляем временный файл
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        
        // Формируем относительный путь для фронтенда
        const relativePath = `/images/sections/${newFileName}`;
        
        res.status(200).json({ 
          message: 'Файл успешно загружен и обработан',
          path: relativePath
        });
      } catch (sharpError) {
        console.error('Ошибка при обработке изображения:', sharpError);
        throw sharpError;
      }
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      res.status(500).json({ message: error.message || 'Ошибка при обработке изображения' });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 