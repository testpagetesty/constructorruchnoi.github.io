import { imageCacheService } from './imageCacheService';

// Функция генерации улучшенного имени файла для карточки
export const generateEnhancedCardImageFileName = (cardData, sectionData, file) => {
  const sectionId = sectionData.id || 'section';
  const cardId = cardData.id || Date.now();
  const cardTitle = cardData.title || `card_${cardId}`;
  
  // Очищаем название от специальных символов и ограничиваем длину
  const sanitizedSectionId = sectionId.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 20);
  const sanitizedCardTitle = cardTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 30);
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  
  // 🔥 НОВЫЙ ФОРМАТ: card_[секция]_[ID_карточки]_[название]_[timestamp]_[random].jpg
  return `card_${sanitizedSectionId}_${cardId}_${sanitizedCardTitle}_${timestamp}_${randomId}.jpg`;
};

// Функция валидации изображения
const validateImageFile = (file) => {
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

// Функция сжатия и конвертации изображения
const compressAndConvertImage = (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Оптимальные размеры для карточек: 600x400
      const maxWidth = 600;
      const maxHeight = 400;
      
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
      
      // Конвертируем в JPG с качеством 85%
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({
            blob,
            width,
            height,
            size: blob.size
          });
        } else {
          reject(new Error('Не удалось конвертировать изображение'));
        }
      }, 'image/jpeg', 0.85);
    };
    
    img.onerror = () => reject(new Error('Не удалось загрузить изображение'));
    
    // Загружаем изображение из файла
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.readAsDataURL(file);
  });
};

// Основная функция обработки изображения карточки
export const processCardImage = async (file, cardData, sectionData) => {
  try {
    console.log(`🖼️ Processing image for card ${cardData.id} in section ${sectionData.id}`);
    console.log(`🖼️ File details:`, { name: file.name, size: file.size, type: file.type });
    
    // ✅ ВАЛИДАЦИЯ ФАЙЛА
    console.log(`🔍 Validating file...`);
    const validation = validateImageFile(file);
    console.log(`🔍 Validation result:`, validation);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // ✅ СЖАТИЕ И КОНВЕРТАЦИЯ
    console.log(`🔧 Compressing and converting image...`);
    const processedResult = await compressAndConvertImage(file);
    console.log(`🔧 Compression result:`, { width: processedResult.width, height: processedResult.height, size: processedResult.size });
    
    // ✅ ГЕНЕРАЦИЯ УНИКАЛЬНОГО ИМЕНИ
    console.log(`📝 Generating filename...`);
    const fileName = generateEnhancedCardImageFileName(cardData, sectionData, file);
    console.log(`📝 Generated filename:`, fileName);
    
    // ✅ СОЗДАНИЕ BLOB URL
    console.log(`🔗 Creating blob URL...`);
    const url = URL.createObjectURL(processedResult.blob);
    console.log(`🔗 Blob URL created:`, url);
    
    // ✅ СОХРАНЕНИЕ В КЕШЕ
    console.log(`💾 Saving to IndexedDB cache...`);
    await imageCacheService.saveImage(fileName, processedResult.blob);
    console.log(`💾 Saved to cache successfully`);
    
    // ✅ СОХРАНЕНИЕ РАСШИРЕННЫХ МЕТАДАННЫХ
    const metadata = {
      fileName,
      originalName: file.name,
      originalType: file.type,
      cardId: cardData.id,
      cardTitle: cardData.title,
      sectionId: sectionData.id,
      sectionTitle: sectionData.title,
      size: processedResult.size,
      width: processedResult.width,
      height: processedResult.height,
      uploadDate: new Date().toISOString(),
      processed: true,
      format: 'jpg',
      // Дополнительные метаданные для многостраничного сайта
      pageContext: {
        isMultiPage: true,
        sectionPage: `${sectionData.id}.html`,
        cardIndex: cardData.index || 0
      }
    };
    
    await imageCacheService.saveMetadata(`card-image-metadata-${fileName}`, metadata);
    
    console.log(`✅ Card image processed successfully: ${fileName}`);
    console.log(`📊 Image details: ${processedResult.width}x${processedResult.height}, ${Math.round(processedResult.size/1024)}KB`);
    
    return { 
      fileName, 
      url, 
      blob: processedResult.blob, 
      metadata,
      success: true 
    };
    
  } catch (error) {
    console.error('❌ Error processing card image:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Функция получения всех изображений карточек из кеша
export const getAllCardImages = async () => {
  try {
    const allMetadata = imageCacheService.getAllMetadata();
    const cardImages = [];
    
    for (const [key, metadata] of Object.entries(allMetadata)) {
      if (key.startsWith('card-image-metadata-') && metadata.cardId) {
        const blob = await imageCacheService.getImage(metadata.fileName);
        if (blob) {
          cardImages.push({
            fileName: metadata.fileName,
            url: URL.createObjectURL(blob),
            metadata: metadata,
            blob: blob
          });
        }
      }
    }
    
    console.log(`📊 Found ${cardImages.length} card images in cache`);
    return cardImages;
    
  } catch (error) {
    console.error('❌ Error getting card images from cache:', error);
    return [];
  }
};

// Функция очистки изображений карточки
export const clearCardImages = async (cardId) => {
  try {
    const allMetadata = imageCacheService.getAllMetadata();
    let deletedCount = 0;
    
    for (const [key, metadata] of Object.entries(allMetadata)) {
      if (key.startsWith('card-image-metadata-') && metadata.cardId === cardId) {
        // Удаляем изображение из кеша
        await imageCacheService.deleteImage(metadata.fileName);
        // Удаляем метаданные
        imageCacheService.deleteMetadata(key);
        deletedCount++;
        console.log(`🗑️ Deleted card image: ${metadata.fileName}`);
      }
    }
    
    console.log(`✅ Cleared ${deletedCount} images for card ${cardId}`);
    return deletedCount;
    
  } catch (error) {
    console.error('❌ Error clearing card images:', error);
    return 0;
  }
};
