import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Функция для получения случайного фото оператора и его оптимизации
export const getRandomOperatorPhoto = async () => {
  try {
    console.log('🎭 Selecting random operator photo...');
    
    const chatImagesDir = path.join(process.cwd(), 'public', 'images', 'chat');
    
    // Проверяем существование папки
    if (!fs.existsSync(chatImagesDir)) {
      console.warn('❌ Chat images directory not found');
      return null;
    }

    // Получаем список всех изображений в папке
    const files = fs.readdirSync(chatImagesDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.jfif'].includes(ext) && file !== 'operator.jpg';
    });

    if (imageFiles.length === 0) {
      console.warn('❌ No images found in chat directory');
      return null;
    }

    // Случайно выбираем фото
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const selectedFile = imageFiles[randomIndex];
    const selectedPath = path.join(chatImagesDir, selectedFile);

    console.log(`🎲 Selected random photo: ${selectedFile}`);

    // Оптимизируем изображение для чата
    const optimizedBuffer = await sharp(selectedPath)
      .resize(64, 64, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 90,
        progressive: true
      })
      .toBuffer();

    console.log(`✅ Photo optimized: ${optimizedBuffer.length} bytes`);

    return {
      buffer: optimizedBuffer,
      originalFile: selectedFile,
      size: optimizedBuffer.length
    };

  } catch (error) {
    console.error('❌ Error processing operator photo:', error);
    return null;
  }
}; 