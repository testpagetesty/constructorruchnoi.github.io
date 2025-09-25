import { imageCacheService } from './imageCacheService';

// Утилита для конвертации изображений в JPG с уникальными именами
export const convertImageToJPG = (file, cardId, cardTitle) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Устанавливаем размеры canvas
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Рисуем изображение на canvas
      ctx.drawImage(img, 0, 0);
      
      // Конвертируем в JPG с качеством 0.9
      canvas.toBlob((blob) => {
        // Генерируем уникальное имя файла с привязкой к cardId
        const sanitizedTitle = (cardTitle || 'image').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        // Важно! Имя файла ДОЛЖНО содержать точный cardId
        const uniqueFileName = `img_${cardId}_${sanitizedTitle}_${timestamp}_${randomId}.jpg`;
        
        // Создаем новый File объект с уникальным именем
        const jpgFile = new File([blob], uniqueFileName, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        resolve({
          file: jpgFile,
          fileName: uniqueFileName,
          originalName: file.name,
          originalType: file.type,
          size: blob.size,
          width: img.width,
          height: img.height,
          cardId: cardId // Добавляем cardId в результат
        });
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => {
      reject(new Error('Не удалось загрузить изображение'));
    };
    
    // Загружаем изображение из файла
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'));
    };
    reader.readAsDataURL(file);
  });
};

import { v4 as uuidv4 } from 'uuid';

// Функция для создания уникального ID карточки
export const generateCardId = (baseId, title) => {
  // Используем UUID для абсолютной уникальности
  const uuid = uuidv4();
  const timestamp = Date.now();
  // Ограничиваем длину заголовка до 20 символов
  const sanitizedTitle = (title || 'card').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 20);
  return `card_${sanitizedTitle}_${timestamp}_${uuid.substring(0, 8)}`;
};

// Функция для валидации изображения
export const validateImage = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
  
  if (!file) {
    return { valid: false, error: 'Файл не выбран' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Неподдерживаемый формат файла. Разрешены: JPG, PNG, GIF, WebP, BMP' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Размер файла превышает 10MB' };
  }
  
  return { valid: true };
};

// Функция для оптимизации размера изображения
export const optimizeImageSize = (file, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      
      // Вычисляем новые размеры с сохранением пропорций
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Рисуем изображение с новыми размерами
      ctx.drawImage(img, 0, 0, width, height);
      
      // Конвертируем в blob
      canvas.toBlob((blob) => {
        const optimizedFile = new File([blob], file.name, {
          type: file.type,
          lastModified: Date.now()
        });
        resolve(optimizedFile);
      }, file.type, 0.9);
    };
    
    img.onerror = () => {
      reject(new Error('Не удалось загрузить изображение для оптимизации'));
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл для оптимизации'));
    };
    reader.readAsDataURL(file);
  });
};

// Основная функция для обработки загрузки изображения
export const processImageUpload = async (file, cardId, cardTitle) => {
  try {
    // Валидируем файл
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // Оптимизируем размер если нужно
    let processedFile = file;
    if (file.size > 2 * 1024 * 1024) { // Если больше 2MB
      processedFile = await optimizeImageSize(file);
    }
    
    // Конвертируем в JPG с уникальным именем
    const result = await convertImageToJPG(processedFile, cardId, cardTitle);
    
    return {
      success: true,
      ...result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Функция для генерации имени файла на основе секции
export const generateImageFileName = (sectionName, index = 0) => {
  const cleanName = sectionName
    .replace(/[^а-яёa-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  
  const timestamp = Date.now();
  return `${cleanName}-${timestamp}${index > 0 ? `-${index}` : ''}.jpg`;
};

// Функция для загрузки и сохранения изображения
export const uploadAndSaveImage = async (file, sectionName, index = 0) => {
  try {
    // Конвертируем в JPG
    const jpgBlob = await convertImageToJpg(file);
    
    // Генерируем имя файла
    const fileName = generateImageFileName(sectionName, index);
    
    // Сохраняем в кеш
    await imageCacheService.saveImage(fileName, jpgBlob);
    
    // Сохраняем метаданные
    const metadata = {
      originalName: file.name,
      originalSize: file.size,
      originalType: file.type,
      convertedSize: jpgBlob.size,
      sectionName: sectionName,
      uploadDate: new Date().toISOString(),
      fileName: fileName
    };
    
    await imageCacheService.saveMetadata(fileName, metadata);
    
    // Возвращаем URL для отображения
    const imageUrl = URL.createObjectURL(jpgBlob);
    
    return {
      url: imageUrl,
      fileName: fileName,
      metadata: metadata
    };
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
};

// Функция для получения всех изображений из кеша
export const getAllCachedImages = async () => {
  try {
    const images = [];
    const keys = Object.keys(localStorage);
    
    console.log(`🔥EXPORT🔥 Scanning localStorage keys: ${keys.length} total`);
    
    let cardImageKeys = 0;
    let siteImageKeys = 0;
    
    for (const key of keys) {
      // Ищем как обычные метаданные изображений, так и метаданные карточек
      if (key.startsWith('site-images-metadata-')) {
        siteImageKeys++;
        const metadata = imageCacheService.getMetadata(key);
        if (metadata) {
          const blob = await imageCacheService.getImage(metadata.fileName);
          if (blob) {
            images.push({
              fileName: metadata.fileName,
              url: URL.createObjectURL(blob),
              metadata: metadata
            });
            console.log(`🔥EXPORT🔥 Found site image: ${metadata.fileName}`);
          }
        }
      } else if (key.startsWith('card-image-metadata-')) {
        cardImageKeys++;
        const metadata = imageCacheService.getMetadata(key);
        if (metadata) {
          const blob = await imageCacheService.getImage(metadata.fileName);
          if (blob) {
            images.push({
              fileName: metadata.fileName,
              url: URL.createObjectURL(blob),
              metadata: metadata
            });
            console.log(`🔥EXPORT🔥 Found card image: ${metadata.fileName}`);
          } else {
            console.warn(`🔥EXPORT🔥 No blob for card image: ${metadata.fileName}`);
          }
        }
      }
    }
    
    console.log(`🔥EXPORT🔥 Scan complete: ${siteImageKeys} site images, ${cardImageKeys} card images, ${images.length} total found`);
    
    return images;
  } catch (error) {
    console.error('Ошибка при получении изображений из кеша:', error);
    return [];
  }
};

// Функция для экспорта изображений в ZIP
export const exportCachedImages = async (zip, assetsDir) => {
  try {
    const images = await getAllCachedImages();
    console.log(`🔥EXPORT🔥 Found ${images.length} cached images to export`);
    
    let exportedCount = 0;
    
    for (const image of images) {
      const blob = await imageCacheService.getImage(image.fileName);
      if (blob) {
        // Добавляем в папку assets/images
        assetsDir.file(`images/${image.fileName}`, blob);
        
        // Также добавляем в корень assets для совместимости
        assetsDir.file(image.fileName, blob);
        
        console.log(`🔥EXPORT🔥 Added image: ${image.fileName}`);
        exportedCount++;
      } else {
        console.warn(`🔥EXPORT🔥 No blob found for: ${image.fileName}`);
      }
    }
    
    console.log(`🔥EXPORT🔥 Successfully exported ${exportedCount} images`);
    return exportedCount;
  } catch (error) {
    console.error('Ошибка при экспорте изображений:', error);
    return 0;
  }
}; 