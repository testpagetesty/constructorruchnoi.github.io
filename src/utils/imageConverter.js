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
    
    // Сначала проверяем hero изображение напрямую из IndexedDB
    console.log('🔥EXPORT🔥 Checking hero image in IndexedDB...');
    let heroFound = false;
    try {
      const heroMetadata = await imageCacheService.getMetadata('heroImageMetadata');
      console.log('🔥EXPORT🔥 Hero metadata from IndexedDB:', heroMetadata);
      
      if (heroMetadata && heroMetadata.filename) {
        console.log('🔥EXPORT🔥 Trying to get blob for filename:', heroMetadata.filename);
        const heroBlob = await imageCacheService.getImage(heroMetadata.filename);
        if (heroBlob) {
          images.push({
            fileName: heroMetadata.filename,
            url: URL.createObjectURL(heroBlob),
            metadata: heroMetadata
          });
          console.log(`🔥EXPORT🔥 Found hero image in IndexedDB: ${heroMetadata.filename}`);
          heroFound = true;
        } else {
          console.warn('🔥EXPORT🔥 Hero blob not found in IndexedDB for filename:', heroMetadata.filename);
        }
      } else {
        console.warn('🔥EXPORT🔥 Hero metadata found but no filename:', heroMetadata);
      }
    } catch (error) {
      console.warn('🔥EXPORT🔥 Error getting hero image from IndexedDB:', error);
    }
    
    // Если не нашли hero в IndexedDB, пробуем через localStorage
    if (!heroFound) {
      try {
        console.log('🔥EXPORT🔥 Trying to get hero image from localStorage...');
        const storageHero = localStorage.getItem('heroImageMetadata');
        if (storageHero) {
          const heroMetadata = JSON.parse(storageHero);
          if (heroMetadata && heroMetadata.filename) {
            const heroBlob = await imageCacheService.getImage(heroMetadata.filename);
            if (heroBlob) {
              images.push({
                fileName: heroMetadata.filename,
                url: URL.createObjectURL(heroBlob),
                metadata: heroMetadata
              });
              console.log(`🔥EXPORT🔥 Found hero image from localStorage: ${heroMetadata.filename}`);
              heroFound = true;
            }
          }
        }
        
        // Если blob не найден в кэше, попробуем получить через blob URL из localStorage
        if (!heroFound) {
          console.log('🔥EXPORT🔥 Trying to get hero blob URL from localStorage...');
          const blobUrl = localStorage.getItem('heroImageBlobUrl');
          if (blobUrl && blobUrl.startsWith('blob:')) {
            try {
              const response = await fetch(blobUrl);
              const blob = await response.blob();
              const heroMetadata = storageHero ? JSON.parse(storageHero) : { filename: 'hero.jpg' };
              
              images.push({
                fileName: heroMetadata.filename || 'hero.jpg',
                url: URL.createObjectURL(blob),
                metadata: heroMetadata
              });
              console.log(`🔥EXPORT🔥 Found hero image from blob URL: ${heroMetadata.filename}`);
              heroFound = true;
            } catch (error) {
              console.warn('🔥EXPORT🔥 Error fetching blob URL:', error);
            }
          }
        }
      } catch (error) {
        console.warn('🔥EXPORT🔥 Error getting hero image from localStorage:', error);
      }
    }
    
    console.log('🔥EXPORT🔥 Hero image lookup result:', heroFound ? 'FOUND' : 'NOT FOUND');
    
    // Затем сканируем localStorage для других изображений
    let keys = [];
    try {
      keys = Object.keys(localStorage);
      console.log(`🔥EXPORT🔥 Scanning localStorage keys: ${keys.length} total`);
    } catch (error) {
      console.warn('🔥EXPORT🔥 localStorage not available, skipping localStorage scan');
      return images;
    }
    
    let cardImageKeys = 0;
    let siteImageKeys = 0;
    
    for (const key of keys) {
      // Ищем как обычные метаданные изображений, так и метаданные карточек
      if (key.startsWith('site-images-metadata-')) {
        siteImageKeys++;
        const metadata = await imageCacheService.getMetadata(key);
        if (metadata) {
          const fileName = metadata.filename || metadata.fileName;
          if (fileName) {
            const blob = await imageCacheService.getImage(fileName);
            if (blob) {
              images.push({
                fileName: fileName,
                url: URL.createObjectURL(blob),
                metadata: metadata
              });
              console.log(`🔥EXPORT🔥 Found site image: ${fileName}`);
            }
          }
        }
      } else if (key.startsWith('card-image-metadata-')) {
        cardImageKeys++;
        const metadata = await imageCacheService.getMetadata(key);
        if (metadata) {
          const fileName = metadata.filename || metadata.fileName;
          if (fileName) {
            const blob = await imageCacheService.getImage(fileName);
            if (blob) {
              images.push({
                fileName: fileName,
                url: URL.createObjectURL(blob),
                metadata: metadata
              });
              console.log(`🔥EXPORT🔥 Found card image: ${fileName}`);
            } else {
              console.warn(`🔥EXPORT🔥 No blob for card image: ${fileName}`);
            }
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