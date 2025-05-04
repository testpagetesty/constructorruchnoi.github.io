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
    // В multer данные формы ещё не распарсены полностью на этом этапе
    // Используем временный, уникальный идентификатор для имени файла
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = path.extname(file.originalname);
    cb(null, `section_${timestamp}_${randomStr}${fileExt}`);
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
      
      // После загрузки файла, теперь имеем доступ к данным формы
      const sectionId = req.body.sectionId || 'section';
      console.log(`Section ID: ${sectionId}`);
      
      // Если получили ID секции, переименуем файл
      if (sectionId !== 'section') {
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'sections');
        console.log(`Upload directory: ${uploadDir}`);
        
        const newFileName = `${sectionId}.jpg`; // Всегда сохраняем как jpg
        const newFilePath = path.join(uploadDir, newFileName);
        console.log(`New file path: ${newFilePath}`);
        
        // Обрабатываем сначала изображение и сохраняем в формате JPG
        console.log(`Processing image with sharp...`);
        try {
          // Создаем буфер из оригинального файла
          const inputBuffer = fs.readFileSync(filePath);
          console.log(`File read into buffer, size: ${inputBuffer.length} bytes`);
          
          // Обрабатываем и сохраняем в формате JPG
          const outputBuffer = await sharp(inputBuffer)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
            
          console.log(`Image processed to buffer, size: ${outputBuffer.length} bytes`);
          
          // Записываем буфер в файл
          fs.writeFileSync(newFilePath, outputBuffer);
          console.log(`Image successfully saved to ${newFilePath}, size: ${fs.statSync(newFilePath).size} bytes`);
          
        } catch (sharpError) {
          console.error(`Error processing image with sharp: ${sharpError.message}`);
          throw sharpError;
        }
        
        // Если файл с таким именем существует (кроме только что созданного) - удаляем старый
        if (fs.existsSync(filePath)) {
          console.log(`Removing original file: ${filePath}`);
          fs.unlinkSync(filePath);
          console.log(`Original file removed`);
        }
        
        // Обновляем путь к файлу
        req.file.filename = newFileName;
        console.log(`Updated filename: ${req.file.filename}`);
        
      } else {
        // Если нет нужды переименовывать, сохраняем как временный файл с jpg-расширением
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'sections');
        console.log(`Upload directory for generic section: ${uploadDir}`);
        
        const newFileName = `section_${Date.now()}.jpg`;
        const newFilePath = path.join(uploadDir, newFileName);
        console.log(`New file path for generic section: ${newFilePath}`);
        
        // Обрабатываем и сохраняем в формате JPG
        console.log(`Processing image with sharp...`);
        try {
          // Создаем буфер из оригинального файла
          const inputBuffer = fs.readFileSync(filePath);
          console.log(`File read into buffer, size: ${inputBuffer.length} bytes`);
          
          // Обрабатываем и сохраняем в формате JPG
          const outputBuffer = await sharp(inputBuffer)
            .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();
            
          console.log(`Image processed to buffer, size: ${outputBuffer.length} bytes`);
          
          // Записываем буфер в файл
          fs.writeFileSync(newFilePath, outputBuffer);
          console.log(`Image successfully saved to ${newFilePath}, size: ${fs.statSync(newFilePath).size} bytes`);
          
        } catch (sharpError) {
          console.error(`Error processing image with sharp: ${sharpError.message}`);
          throw sharpError;
        }
        
        // Удаляем оригинальный файл
        if (fs.existsSync(filePath)) {
          console.log(`Removing original file: ${filePath}`);
          fs.unlinkSync(filePath);
          console.log(`Original file removed`);
        }
        
        // Обновляем путь к файлу
        req.file.filename = newFileName;
        console.log(`Updated filename: ${req.file.filename}`);
      }

      // Формируем относительный путь для использования на фронтенде
      const relativePath = `/images/sections/${req.file.filename}`;
      console.log(`Final relative path: ${relativePath}`);
      
      res.status(200).json({ 
        message: 'Файл успешно загружен и обработан',
        path: relativePath
      });
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      res.status(500).json({ message: 'Ошибка при обработке изображения' });
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Отключаем встроенный парсер, так как multer сам обрабатывает formData
  },
}; 