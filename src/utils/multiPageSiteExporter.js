import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportCookieConsentData } from './cookieConsentExporter';
import { cleanHTML, cleanCSS, cleanJavaScript } from './codeCleanup';
import { generateLiveChatHTML, generateLiveChatCSS, generateLiveChatJS } from './liveChatExporter';
import { imageCacheService } from './imageCacheService';
// Импортируем функцию генерации HTML карточек из одностраничного экспорта
import { generateCardHTML } from './siteExporter';
// Импортируем функцию экспорта кешированных изображений
import { exportCachedImages } from './imageConverter';

// Экспорт многостраничного сайта (ручной режим)
export const exportMultiPageSite = async (siteData) => {
  console.log('🚀 Exporting multi-page site:', siteData);
  console.log('🎯 [MULTIPAGE EXPORT] Hero data in exportMultiPageSite:', siteData.heroData);
  
  const zip = new JSZip();
  
  // Создаем структуру папок
  const assetsDir = zip.folder('assets');
  const cssDir = assetsDir.folder('css');
  const jsDir = assetsDir.folder('js');
  const imagesDir = assetsDir.folder('images');
  
  // Добавляем placeholder изображение как SVG
  try {
    const placeholderSvg = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8f9fa" stroke="#dee2e6" stroke-width="1"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle">
        Изображение
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle">
        не найдено
      </text>
    </svg>`;
    imagesDir.file('placeholder.svg', placeholderSvg);
    console.log('✅ Placeholder SVG image added to export');
  } catch (error) {
    console.error('❌ Error adding placeholder image:', error);
  }
  
  // Добавляем общие стили
  cssDir.file('styles.css', generateCommonStyles());
  
  // Добавляем общий JavaScript
  jsDir.file('app.js', generateCommonJS(siteData));
  
  // Экспортируем все кешированные изображения (включая изображения секций и карточек)
  try {
    console.log('🔥EXPORT🔥 Starting multipage site image export...');
    const cachedImagesCount = await exportCachedImages(zip, assetsDir);
    console.log(`🔥EXPORT🔥 Multipage export completed: ${cachedImagesCount} images`);
  } catch (error) {
    console.error('🔥EXPORT🔥 Error exporting cached images:', error);
  }
  
  // 🔥 НОВОЕ: Экспортируем изображения карточек по образцу системы секций
  try {
    console.log('🔥CARD-EXPORT🔥 [multiPageSiteExporter] Starting card images export...');
    console.log('🔥CARD-EXPORT🔥 [multiPageSiteExporter] siteData.sectionsData:', siteData.sectionsData);
    const cardImagesCount = await exportCardImages(zip, assetsDir, siteData);
    console.log(`🔥CARD-EXPORT🔥 [multiPageSiteExporter] Card images export completed: ${cardImagesCount} images`);
  } catch (error) {
    console.error('🔥CARD-EXPORT🔥 [multiPageSiteExporter] Error exporting card images:', error);
  }
  
  // Создаем отдельные HTML страницы
  zip.file('index.html', await generateIndexPage(siteData));
  
  // Генерируем страницы для каждой секции (исключаем проверку возраста)
  for (const [sectionId, sectionData] of Object.entries(siteData.sectionsData || {})) {
    // Исключаем раздел проверки возраста из генерации отдельных страниц
    const isAgeVerification = sectionId === 'age-verification' || 
                             sectionId === 'проверка возраста' ||
                             sectionData.title?.toLowerCase().includes('подтверждение возраста') ||
                             sectionData.title?.toLowerCase().includes('проверка возраста') ||
                             sectionData.title?.toLowerCase().includes('age verification');
    
    if (!isAgeVerification) {
      const fileName = getSectionFileName(sectionId, sectionData);
      if (fileName) {
        zip.file(`${fileName}.html`, await generateSectionPage(siteData, sectionId, sectionData));
      }
    }
  }
  
  // Создаем страницу контактов
  if (siteData.contactData) {
    const contactFileName = getContactFileName(siteData.contactData);
    zip.file(`${contactFileName}.html`, generateContactPage(siteData));
  }
  
  // Создаем правовые документы
  if (siteData.legalDocuments) {
    if (siteData.legalDocuments.privacyPolicy?.content) {
      zip.file('privacy-policy.html', generateLegalPage(siteData, 'privacyPolicy'));
    }
    if (siteData.legalDocuments.termsOfService?.content) {
      zip.file('terms-of-service.html', generateLegalPage(siteData, 'termsOfService'));
    }
    if (siteData.legalDocuments.cookiePolicy?.content) {
      zip.file('cookie-policy.html', generateLegalPage(siteData, 'cookiePolicy'));
    }
  }
  
  // Создаем страницу благодарности
  zip.file('merci.html', generateMerciPage(siteData));
  

  
  // Добавляем hero изображение если есть
  const heroData = siteData.heroData || {};
  if (heroData.backgroundImage && heroData.backgroundType === 'image') {
    try {
      console.log('🖼️ Adding hero image to export...');
      console.log('🖼️ Hero backgroundImage:', heroData.backgroundImage);
      
      // Если это blob URL, конвертируем его в файл
      if (heroData.backgroundImage.startsWith('blob:')) {
        try {
          const response = await fetch(heroData.backgroundImage);
          const blob = await response.blob();
          const fileName = 'hero-background.jpg';
          imagesDir.file(fileName, blob);
          console.log('✅ Hero blob image converted and added to export:', fileName);
        } catch (error) {
          console.error('❌ Error converting blob image:', error);
        }
      } else {
        // Получаем метаданные hero изображения из IndexedDB
        const heroImageMetadata = await imageCacheService.getMetadata('heroImageMetadata') || {};
        if (heroImageMetadata.filename) {
          const blob = await imageCacheService.getImage(heroImageMetadata.filename);
          if (blob) {
            imagesDir.file(heroImageMetadata.filename, blob);
            console.log('✅ Hero image added to export:', heroImageMetadata.filename);
          } else {
            console.warn('⚠️ Hero image not found in cache');
          }
        } else {
          console.warn('⚠️ Hero image metadata not found');
        }
      }
    } catch (error) {
      console.error('❌ Error adding hero image to export:', error);
    }
  }
  
  // Создаем карту сайта
  zip.file('sitemap.xml', generateMultiPageSitemap(siteData));
  
  // Скачиваем архив
  const content = await zip.generateAsync({ type: 'blob' });
  const fileName = generateSafeFileName(siteData);
  saveAs(content, `${fileName}-multipage.zip`);
};

// Helper: resolve exported card image filename for given card/section
const resolveCardImageFileName = async (card, sectionId) => {
  try {
    if (!card) {
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - card is null/undefined`);
      return null;
    }
    console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName START for card ${card.id} in section ${sectionId}`);
    console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - card.fileName = "${card.fileName}"`);
    console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - card.exportImagePath = "${card.exportImagePath}"`);
    
    const cid = card.id;
    const sid = sectionId;
    
    // Способ 1: Проверяем свойство fileName напрямую (ПРИОРИТЕТ!)
    if (card.fileName && card.fileName.startsWith('card_')) {
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Using fileName directly: ${card.fileName}`);
      return card.fileName;
    } else {
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - No valid fileName found, checking other methods`);
    }
    
    // Способ 2: Проверяем свойство exportImagePath
    if (card.exportImagePath && card.exportImagePath.includes('assets/images/')) {
      const fileName = card.exportImagePath.replace('assets/images/', '');
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Found exportImagePath: ${fileName}`);
      return fileName;
    } else {
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - No exportImagePath found`);
    }
    
    // Способ 3: Ищем метаданные в IndexedDB
    if (cid && sid) {
      const metadataKey = `card_${cid}_${sid}_ImageMetadata`;
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Checking metadata key: ${metadataKey}`);
      try {
        const cardMetadata = await imageCacheService.getMetadata(metadataKey);
        console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Retrieved metadata:`, cardMetadata);
        if (cardMetadata && cardMetadata.filename) {
          console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Found filename in metadata: ${cardMetadata.filename}`);
          return cardMetadata.filename;
        } else {
          console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - No filename in metadata`);
        }
      } catch (error) {
        console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Failed to get metadata for ${metadataKey}:`, error);
      }
    } else {
      console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - No cid or sid for metadata lookup`);
    }
    
    // Способ 3: Проверяем imageUrl для blob URLs и пытаемся найти соответствующий файл
    if (card.imageUrl && card.imageUrl.startsWith('blob:')) {
      console.log(`🔍 Card has blob URL, searching for matching filename...`);
      
      // Пытаемся найти все файлы карточек в кеше
      try {
        const allMetadataKeys = await imageCacheService.getAllMetadataKeys();
        const cardKeys = allMetadataKeys.filter(key => 
          key.includes(`card_${cid}`) || key.includes(`${cid}_${sid}`)
        );
        
        if (cardKeys.length > 0) {
          console.log(`🔍 Found potential card keys:`, cardKeys);
          // Берем первый найденный ключ
          const firstKey = cardKeys[0];
          const metadata = await imageCacheService.getMetadata(firstKey);
          if (metadata && metadata.filename) {
            console.log(`✅ Found filename from cache search: ${metadata.filename}`);
            return metadata.filename;
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error searching cache for card image:`, error);
      }
      
      // Fallback: создаем имя файла
      const timestamp = Date.now();
      const fallbackFileName = `card_${sid}_${cid}_image_${timestamp}.jpg`;
      console.log(`⚠️ Using fallback filename: ${fallbackFileName}`);
      return fallbackFileName;
    }
    
    console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Could not resolve filename for card ${cid}, returning null`);
    return null;
  } catch (error) {
    console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Error resolving card image filename:`, error);
    console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName - Returning fallback: ${card?.fileName || null}`);
    return card?.fileName || null;
  }
};

// Функция для поиска раздела проверки возраста
const findAgeVerificationSection = (siteData) => {
  console.log('🔞 [findAgeVerificationSection] Called with siteData:', siteData);
  console.log('🔞 [findAgeVerificationSection] siteData.sectionsData:', siteData.sectionsData);
  console.log('🔞 [findAgeVerificationSection] sectionsData type:', typeof siteData.sectionsData);
  console.log('🔞 [findAgeVerificationSection] sectionsData isArray:', Array.isArray(siteData.sectionsData));
  
  if (!siteData.sectionsData) {
    console.log('🔞 [findAgeVerificationSection] No sectionsData found');
    return null;
  }
  
  // Если sectionsData - это массив
  if (Array.isArray(siteData.sectionsData)) {
    console.log('🔞 [findAgeVerificationSection] Processing as array, length:', siteData.sectionsData.length);
    
    for (let i = 0; i < siteData.sectionsData.length; i++) {
      const section = siteData.sectionsData[i];
      console.log(`🔞 [findAgeVerificationSection] Checking section ${i}:`, {
        id: section.id,
        title: section.title,
        description: section.description?.substring(0, 100) + '...'
      });
      
      // Проверяем по ID секции
      if (section.id === 'age-verification' || section.id === 'проверка возраста') {
        console.log('🔞 [findAgeVerificationSection] Found by ID:', section.id);
        return section;
      }
      
      // Проверяем по заголовку секции
      const title = section.title?.toLowerCase() || '';
      if (title.includes('подтверждение возраста') || 
          title.includes('проверка возраста') || 
          title.includes('age verification')) {
        console.log('🔞 [findAgeVerificationSection] Found by title:', section.title);
        return section;
      }
      
      // Проверяем по элементам секции
      if (section.elements) {
        const hasAgeElement = section.elements.some(element => 
          element.type === 'age-verification' || 
          element.data?.type === 'age-verification'
        );
        if (hasAgeElement) {
          console.log('🔞 [findAgeVerificationSection] Found by elements');
          return section;
        }
      }
      
      // Проверяем по полю ageVerificationData
      if (section.ageVerificationData) {
        console.log('🔞 [findAgeVerificationSection] Found by ageVerificationData field');
        return section;
      }
    }
    
    console.log('🔞 [findAgeVerificationSection] Not found in array');
    return null;
  }
  
  // Если sectionsData - это объект
  console.log('🔞 [findAgeVerificationSection] Processing as object, keys:', Object.keys(siteData.sectionsData));
  
  const sections = Object.values(siteData.sectionsData);
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    console.log(`🔞 [findAgeVerificationSection] Checking object section ${i}:`, {
      id: section.id,
      title: section.title,
      description: section.description?.substring(0, 100) + '...'
    });
    
    // Проверяем по ID секции
    if (section.id === 'age-verification' || section.id === 'проверка возраста') {
      console.log('🔞 [findAgeVerificationSection] Found by ID:', section.id);
      return section;
    }
    
    // Проверяем по заголовку секции
    const title = section.title?.toLowerCase() || '';
    if (title.includes('подтверждение возраста') || 
        title.includes('проверка возраста') || 
        title.includes('age verification')) {
      console.log('🔞 [findAgeVerificationSection] Found by title:', section.title);
      return section;
    }
    
    // Проверяем по элементам секции
    if (section.elements) {
      const hasAgeElement = section.elements.some(element => 
        element.type === 'age-verification' || 
        element.data?.type === 'age-verification'
      );
      if (hasAgeElement) {
        console.log('🔞 [findAgeVerificationSection] Found by elements');
        return section;
      }
    }
    
    // Проверяем по полю ageVerificationData
    if (section.ageVerificationData) {
      console.log('🔞 [findAgeVerificationSection] Found by ageVerificationData field');
      return section;
    }
  }
  
  console.log('🔞 [findAgeVerificationSection] Not found in object');
  return null;
};

// Функция для генерации модального окна проверки возраста
const generateAgeVerificationModal = (ageSection) => {
  console.log('🔞 [generateAgeVerificationModal] Called with ageSection:', ageSection);
  
  // Парсим данные из секции
  let title = 'Подтверждение возраста';
  let content = 'Этот сайт содержит контент, предназначенный только для лиц старше 18 лет.';
  let confirmText = 'Мне есть 18 лет';
  let rejectText = 'Мне нет 18 лет';
  let underageMessage = 'Доступ к сайту разрешен только лицам старше 18 лет.';
  
  // Извлекаем данные из секции
  if (ageSection.title) {
    title = ageSection.title;
    console.log('🔞 [generateAgeVerificationModal] Using title from section:', title);
  }
  
  if (ageSection.description) {
    console.log('🔞 [generateAgeVerificationModal] Parsing description:', ageSection.description);
    // Парсим описание, разделенное символом "*"
    const parts = ageSection.description.split('*').map(part => part.trim());
    console.log('🔞 [generateAgeVerificationModal] Parsed parts:', parts);
    
    if (parts.length >= 1) content = parts[0];
    if (parts.length >= 2) confirmText = parts[1];
    if (parts.length >= 3) rejectText = parts[2];
    if (parts.length >= 4) underageMessage = parts[3];
    
    console.log('🔞 [generateAgeVerificationModal] Final values:', {
      title, content, confirmText, rejectText, underageMessage
    });
  }
  
  // Если есть элементы, проверяем их тоже
  if (ageSection.elements && ageSection.elements.length > 0) {
    const ageElement = ageSection.elements.find(el => el.type === 'age-verification');
    if (ageElement && ageElement.data) {
      if (ageElement.data.title) title = ageElement.data.title;
      if (ageElement.data.content) content = ageElement.data.content;
      if (ageElement.data.confirmText) confirmText = ageElement.data.confirmText;
      if (ageElement.data.rejectText) rejectText = ageElement.data.rejectText;
      if (ageElement.data.underageMessage) underageMessage = ageElement.data.underageMessage;
    }
  }
  
  // Если есть поле ageVerificationData, используем его данные (ПРИОРИТЕТ)
  if (ageSection.ageVerificationData) {
    console.log('🔞 [generateAgeVerificationModal] Using ageVerificationData:', ageSection.ageVerificationData);
    const ageData = ageSection.ageVerificationData;
    
    // ВАЖНО: Используем данные из ageVerificationData как приоритетные
    if (ageData.title && ageData.title.trim()) title = ageData.title.trim();
    if (ageData.content && ageData.content.trim()) content = ageData.content.trim();
    if (ageData.confirmText && ageData.confirmText.trim()) confirmText = ageData.confirmText.trim();
    if (ageData.rejectText && ageData.rejectText.trim()) rejectText = ageData.rejectText.trim();
    if (ageData.underageMessage && ageData.underageMessage.trim()) underageMessage = ageData.underageMessage.trim();
    
    console.log('🔞 [generateAgeVerificationModal] Final values from ageVerificationData:', {
      title, content, confirmText, rejectText, underageMessage
    });
  }
  
  // Дополнительно: если в description есть правильно спарсенные данные, используем их
  if (ageSection.description && ageSection.description.includes('*')) {
    console.log('🔞 [generateAgeVerificationModal] Also parsing from description:', ageSection.description);
    const parts = ageSection.description.split('*').map(part => part.trim()).filter(part => part);
    console.log('🔞 [generateAgeVerificationModal] Description parts:', parts);
    
    // Используем только если данные из ageVerificationData не полные
    if (parts.length >= 1 && (!content || content.includes('Этот сайт содержит контент'))) {
      content = parts[0];
    }
    if (parts.length >= 2 && (!confirmText || confirmText === 'Мне есть 18 лет')) {
      confirmText = parts[1];
    }
    if (parts.length >= 3 && (!rejectText || rejectText === 'Мне нет 18 лет')) {
      rejectText = parts[2];
    }
    if (parts.length >= 4 && (!underageMessage || underageMessage.includes('Доступ к сайту разрешен'))) {
      underageMessage = parts[3];
    }
    
    console.log('🔞 [generateAgeVerificationModal] Updated values after description parsing:', {
      title, content, confirmText, rejectText, underageMessage
    });
  }

  // Извлекаем дополнительные поля для отказа
  let rejectionTitle = 'Access Denied';
  let leaveSiteText = 'Leave Site';

  if (ageSection.ageVerificationData) {
    if (ageSection.ageVerificationData.rejectionTitle) rejectionTitle = ageSection.ageVerificationData.rejectionTitle;
    if (ageSection.ageVerificationData.leaveSiteText) leaveSiteText = ageSection.ageVerificationData.leaveSiteText;
  }

  return `
    <!-- Age Verification Modal -->
    <div id="age-verification-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,40,0.95) 50%, rgba(0,0,0,0.9) 100%);
      backdrop-filter: blur(20px) saturate(180%);
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: fadeIn 0.6s ease-out;
    ">
      <div id="age-modal-content" style="
        background: linear-gradient(145deg, 
          rgba(255,255,255,0.95) 0%, 
          rgba(248,250,252,0.98) 25%, 
          rgba(255,255,255,0.95) 50%, 
          rgba(240,242,245,0.98) 75%, 
          rgba(255,255,255,0.95) 100%);
        border-radius: 32px;
        padding: 60px 50px;
        max-width: 600px;
        width: 90%;
        text-align: center;
        box-shadow: 
          0 40px 120px rgba(0,0,0,0.4),
          0 0 0 1px rgba(255,255,255,0.2),
          inset 0 2px 0 rgba(255,255,255,0.8),
          inset 0 -1px 0 rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
        animation: modalSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        border: 1px solid rgba(255,255,255,0.3);
      ">
        <!-- Modern gradient background -->
        <div style="
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg at 50% 50%, 
            rgba(99,102,241,0.1) 0deg,
            rgba(168,85,247,0.1) 60deg,
            rgba(236,72,153,0.1) 120deg,
            rgba(251,146,60,0.1) 180deg,
            rgba(34,197,94,0.1) 240deg,
            rgba(59,130,246,0.1) 300deg,
            rgba(99,102,241,0.1) 360deg);
          animation: rotate 30s linear infinite;
          pointer-events: none;
          opacity: 0.6;
        "></div>
        
        <!-- Additional glow effect -->
        <div style="
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(ellipse at center, 
            rgba(99,102,241,0.15) 0%, 
            rgba(168,85,247,0.1) 30%, 
            transparent 70%);
          border-radius: 40px;
          animation: pulse 4s ease-in-out infinite;
          pointer-events: none;
        "></div>
        
        <div style="
          position: relative;
          z-index: 2;
        ">
          <div style="
            font-size: 80px;
            margin-bottom: 30px;
            animation: bounce 2.5s ease-in-out infinite;
            filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L1 21h22L12 2z" fill="#ffdd00" stroke="#000000" stroke-width="1.5"/>
              <path d="M12 7v6" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="17" r="1" fill="#000000"/>
            </svg>
          </div>
          
          <h2 style="
            background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 30px;
            line-height: 1.2;
            text-shadow: 0 4px 8px rgba(0,0,0,0.1);
            animation: slideInFromTop 1s ease-out 0.3s both;
            letter-spacing: -0.5px;
          ">${title}</h2>
          
          <p style="
            color: #64748b;
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 40px;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
            animation: slideInFromTop 1s ease-out 0.5s both;
            font-weight: 500;
          ">${content}</p>
          
          <div style="
            display: flex;
            gap: 24px;
            justify-content: center;
            flex-wrap: wrap;
            animation: slideInFromBottom 1s ease-out 0.7s both;
          ">
            <button onclick="confirmAge()" style="
              background: linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%);
              color: white;
              border: none;
              padding: 18px 36px;
              border-radius: 60px;
              font-size: 16px;
              font-weight: 800;
              cursor: pointer;
              transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              box-shadow: 
                0 12px 40px rgba(16, 185, 129, 0.4),
                inset 0 2px 0 rgba(255,255,255,0.3),
                inset 0 -1px 0 rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
              min-width: 180px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: 1px solid rgba(255,255,255,0.2);
            " 
            onmouseover="
              this.style.transform='translateY(-4px) scale(1.08)'; 
              this.style.boxShadow='0 20px 60px rgba(16, 185, 129, 0.6), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)';
              this.style.background='linear-gradient(135deg, #059669 0%, #047857 25%, #065f46 50%, #064e3b 75%, #022c22 100%)';
            " 
            onmouseout="
              this.style.transform='translateY(0) scale(1)'; 
              this.style.boxShadow='0 12px 40px rgba(16, 185, 129, 0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)';
              this.style.background='linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 50%, #065f46 75%, #064e3b 100%)';
            "
            onmousedown="this.style.transform='translateY(-2px) scale(1.02)'"
            onmouseup="this.style.transform='translateY(-4px) scale(1.08)'"
            >${confirmText}</button>
            
            <button onclick="rejectAge()" style="
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 25%, #b91c1c 50%, #991b1b 75%, #7f1d1d 100%);
              color: white;
              border: none;
              padding: 18px 36px;
              border-radius: 60px;
              font-size: 16px;
              font-weight: 800;
              cursor: pointer;
              transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              box-shadow: 
                0 12px 40px rgba(239, 68, 68, 0.4),
                inset 0 2px 0 rgba(255,255,255,0.3),
                inset 0 -1px 0 rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
              min-width: 180px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: 1px solid rgba(255,255,255,0.2);
            " 
            onmouseover="
              this.style.transform='translateY(-4px) scale(1.08)'; 
              this.style.boxShadow='0 20px 60px rgba(239, 68, 68, 0.6), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)';
              this.style.background='linear-gradient(135deg, #dc2626 0%, #b91c1c 25%, #991b1b 50%, #7f1d1d 75%, #450a0a 100%)';
            " 
            onmouseout="
              this.style.transform='translateY(0) scale(1)'; 
              this.style.boxShadow='0 12px 40px rgba(239, 68, 68, 0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)';
              this.style.background='linear-gradient(135deg, #ef4444 0%, #dc2626 25%, #b91c1c 50%, #991b1b 75%, #7f1d1d 100%)';
            "
            onmousedown="this.style.transform='translateY(-2px) scale(1.02)'"
            onmouseup="this.style.transform='translateY(-4px) scale(1.08)'"
            >${rejectText}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Underage Message Modal -->
    <div id="underage-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(40,20,20,0.98) 50%, rgba(0,0,0,0.95) 100%);
      backdrop-filter: blur(25px) saturate(200%);
      z-index: 10001;
      display: none;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: fadeIn 0.6s ease-out;
    ">
      <div style="
        background: linear-gradient(145deg, 
          rgba(255,255,255,0.95) 0%, 
          rgba(254,242,242,0.98) 25%, 
          rgba(255,255,255,0.95) 50%, 
          rgba(252,231,243,0.98) 75%, 
          rgba(255,255,255,0.95) 100%);
        border-radius: 32px;
        padding: 60px 50px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 
          0 50px 150px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,255,255,0.2),
          inset 0 2px 0 rgba(255,255,255,0.8),
          inset 0 -1px 0 rgba(0,0,0,0.1);
        position: relative;
        overflow: hidden;
        animation: modalSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        border: 1px solid rgba(255,255,255,0.3);
      ">
        <!-- Modern gradient background -->
        <div style="
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg at 50% 50%, 
            rgba(239,68,68,0.1) 0deg,
            rgba(220,38,38,0.1) 60deg,
            rgba(185,28,28,0.1) 120deg,
            rgba(153,27,27,0.1) 180deg,
            rgba(127,29,29,0.1) 240deg,
            rgba(69,10,10,0.1) 300deg,
            rgba(239,68,68,0.1) 360deg);
          animation: rotate 25s linear infinite;
          pointer-events: none;
          opacity: 0.7;
        "></div>
        
        <!-- Additional glow effect -->
        <div style="
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          bottom: -20px;
          background: radial-gradient(ellipse at center, 
            rgba(239,68,68,0.2) 0%, 
            rgba(220,38,38,0.15) 30%, 
            transparent 70%);
          border-radius: 40px;
          animation: pulse 3s ease-in-out infinite;
          pointer-events: none;
        "></div>
        
        <div style="
          position: relative;
          z-index: 2;
        ">
          <div style="
            font-size: 90px;
            margin-bottom: 30px;
            animation: shake 1s ease-in-out;
            filter: drop-shadow(0 8px 20px rgba(239,68,68,0.4));
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          ">
            <svg width="90" height="90" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" fill="#ff0000"/>
              <rect x="4" y="10" width="16" height="4" fill="#ffffff"/>
            </svg>
          </div>
          
          <h2 style="
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 30px;
            line-height: 1.2;
            text-shadow: 0 4px 8px rgba(220,38,38,0.3);
            animation: slideInFromTop 1s ease-out 0.3s both;
            letter-spacing: -0.5px;
          ">${rejectionTitle}</h2>
          
          <p style="
            color: #64748b;
            font-size: 18px;
            line-height: 1.8;
            margin-bottom: 40px;
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            animation: slideInFromTop 1s ease-out 0.5s both;
            font-weight: 500;
          ">${underageMessage}</p>
          
          <div style="
            animation: slideInFromBottom 1s ease-out 0.7s both;
          ">
            <button onclick="window.close(); window.history.back();" style="
              background: linear-gradient(135deg, #6b7280 0%, #4b5563 25%, #374151 50%, #1f2937 75%, #111827 100%);
              color: white;
              border: none;
              padding: 18px 36px;
              border-radius: 60px;
              font-size: 16px;
              font-weight: 800;
              cursor: pointer;
              transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              box-shadow: 
                0 12px 40px rgba(107, 114, 128, 0.4),
                inset 0 2px 0 rgba(255,255,255,0.3),
                inset 0 -1px 0 rgba(0,0,0,0.1);
              position: relative;
              overflow: hidden;
              min-width: 200px;
              text-transform: uppercase;
              letter-spacing: 1px;
              border: 1px solid rgba(255,255,255,0.2);
            " 
            onmouseover="
              this.style.transform='translateY(-4px) scale(1.08)'; 
              this.style.boxShadow='0 20px 60px rgba(107, 114, 128, 0.6), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)';
              this.style.background='linear-gradient(135deg, #4b5563 0%, #374151 25%, #1f2937 50%, #111827 75%, #030712 100%)';
            " 
            onmouseout="
              this.style.transform='translateY(0) scale(1)'; 
              this.style.boxShadow='0 12px 40px rgba(107, 114, 128, 0.4), inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.1)';
              this.style.background='linear-gradient(135deg, #6b7280 0%, #4b5563 25%, #374151 50%, #1f2937 75%, #111827 100%)';
            "
            onmousedown="this.style.transform='translateY(-2px) scale(1.02)'"
            onmouseup="this.style.transform='translateY(-4px) scale(1.08)'"
            >${leaveSiteText}</button>
          </div>
        </div>
      </div>
    </div>
    
    <style>
    @keyframes fadeIn {
      from { 
        opacity: 0;
        backdrop-filter: blur(0px);
      }
      to { 
        opacity: 1;
        backdrop-filter: blur(20px) saturate(180%);
      }
    }
    
    @keyframes modalSlideIn {
      from { 
        opacity: 0;
        transform: translateY(-80px) scale(0.7) rotateX(15deg);
        filter: blur(10px);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1) rotateX(0deg);
        filter: blur(0px);
      }
    }
    
    @keyframes slideInFromTop {
      from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
        filter: blur(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0px);
      }
    }
    
    @keyframes slideInFromBottom {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
        filter: blur(5px);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0px);
      }
    }
    
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0) scale(1);
      }
      40% {
        transform: translateY(-15px) scale(1.1);
      }
      60% {
        transform: translateY(-8px) scale(1.05);
      }
    }
    
    @keyframes shake {
      0%, 100% { 
        transform: translateX(0) rotate(0deg); 
      }
      10%, 30%, 50%, 70%, 90% { 
        transform: translateX(-8px) rotate(-2deg); 
      }
      20%, 40%, 60%, 80% { 
        transform: translateX(8px) rotate(2deg); 
      }
    }
    
    @keyframes rotate {
      from { 
        transform: rotate(0deg) scale(1); 
      }
      50% { 
        transform: rotate(180deg) scale(1.1); 
      }
      to { 
        transform: rotate(360deg) scale(1); 
      }
    }
    
    @keyframes pulse {
      0% { 
        transform: scale(1);
        opacity: 0.6;
      }
      50% { 
        transform: scale(1.1);
        opacity: 0.8;
      }
      100% { 
        transform: scale(1);
        opacity: 0.6;
      }
    }
    
    /* Modern glassmorphism effects */
    #age-verification-modal::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        rgba(255,255,255,0.1) 0%, 
        transparent 50%, 
        rgba(255,255,255,0.05) 100%);
      pointer-events: none;
      animation: shimmer 3s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }
    
    /* Enhanced button effects */
    button {
      position: relative;
      overflow: hidden;
    }
    
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(255,255,255,0.3), 
        transparent);
      transition: left 0.6s ease;
    }
    
    button:hover::before {
      left: 100%;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      #age-verification-modal div[id="age-modal-content"] {
        padding: 50px 40px !important;
        margin: 20px !important;
        border-radius: 28px !important;
      }
      
      #age-verification-modal h2 {
        font-size: 28px !important;
      }
      
      #age-verification-modal p {
        font-size: 17px !important;
      }
      
      #age-verification-modal button {
        padding: 16px 32px !important;
        font-size: 15px !important;
        min-width: 160px !important;
      }
      
      #underage-modal div {
        padding: 50px 40px !important;
        margin: 20px !important;
        border-radius: 28px !important;
      }
      
      #underage-modal h2 {
        font-size: 26px !important;
      }
      
      #underage-modal button {
        padding: 16px 32px !important;
        font-size: 15px !important;
        min-width: 180px !important;
      }
    }
    
    @media (max-width: 480px) {
      #age-verification-modal div[id="age-modal-content"] {
        padding: 40px 30px !important;
        margin: 15px !important;
      }
      
      #age-verification-modal h2 {
        font-size: 24px !important;
      }
      
      #age-verification-modal p {
        font-size: 16px !important;
      }
      
      #age-verification-modal button {
        padding: 14px 28px !important;
        font-size: 14px !important;
        min-width: 140px !important;
      }
      
      #underage-modal div {
        padding: 40px 30px !important;
        margin: 15px !important;
      }
      
      #underage-modal h2 {
        font-size: 22px !important;
      }
      
      #underage-modal button {
        padding: 14px 28px !important;
        font-size: 14px !important;
        min-width: 160px !important;
      }
    }
    </style>
    
    <script>
    function confirmAge() {
      localStorage.setItem('ageVerified', 'true');
      localStorage.setItem('ageVerifiedDate', new Date().toISOString());
      document.getElementById('age-verification-modal').style.display = 'none';
      document.body.style.overflow = '';
    }
    
    function rejectAge() {
      document.getElementById('age-verification-modal').style.display = 'none';
      document.getElementById('underage-modal').style.display = 'flex';
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      const ageVerified = localStorage.getItem('ageVerified');
      const verificationDate = localStorage.getItem('ageVerifiedDate');
      
      let isVerificationValid = false;
      if (ageVerified === 'true' && verificationDate) {
        const verifiedDate = new Date(verificationDate);
        const now = new Date();
        const daysDiff = (now - verifiedDate) / (1000 * 60 * 60 * 24);
        isVerificationValid = daysDiff < 30;
      }
      
      if (!isVerificationValid) {
        document.getElementById('age-verification-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
    </script>
  `;
};

// Генерация главной страницы (index.html)
const generateIndexPage = async (siteData) => {
  console.log('🎯 [MULTIPAGE EXPORT] generateIndexPage called with siteData:', siteData);
  console.log('🔞 [AGE VERIFICATION] Checking for age verification section...');
  console.log('🔞 [AGE VERIFICATION] siteData.sectionsData:', siteData.sectionsData);
  
  // Проверяем наличие раздела проверки возраста
  const ageVerificationSection = findAgeVerificationSection(siteData);
  console.log('🔞 [AGE VERIFICATION] Found age verification section:', ageVerificationSection);
  
  const headerData = siteData.headerData || {};
  const heroData = siteData.heroData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  console.log('🎯 [MULTIPAGE EXPORT] Hero data in generateIndexPage:', heroData);
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteName}</title>
    <meta name="description" content="${headerData.description || 'Добро пожаловать на наш сайт'}">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/styles.css?v=${Date.now()}">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateHeroSection(siteData)}
        ${await generateFeaturedSection(siteData)}
        ${generateSectionsPreview(siteData)}
        ${generateContactPreview(siteData)}
    </main>
    
    ${generateCommonFooter(siteData)}
    
    ${(() => {
      // Проверяем наличие раздела проверки возраста
      const ageVerificationSection = findAgeVerificationSection(siteData);
      return ageVerificationSection ? generateAgeVerificationModal(ageVerificationSection) : '';
    })()}
    
    ${generateCookieConsentHTML(headerData.language || 'en')}
    
    <script src="assets/js/app.js"></script>
    <script>
      // Global function to toggle FAQ accordion
      window.toggleFAQ = function(index) {
        console.log('🔧 [toggleFAQ] Called with index:', index);
        
        const answer = document.getElementById('faq-answer-' + index);
        console.log('🔧 [toggleFAQ] Found answer element:', answer);
        
        const container = answer ? answer.parentElement : null;
        const icon = container ? container.querySelector('span') : null;
        console.log('🔧 [toggleFAQ] Found icon:', icon);
        
        if (answer) {
          const isVisible = answer.style.display !== 'none';
          console.log('🔧 [toggleFAQ] Is visible:', isVisible);
          
          answer.style.display = isVisible ? 'none' : 'block';
          
          // Обновляем иконку
          if (icon) {
            icon.textContent = isVisible ? '▼' : '▲';
            console.log('🔧 [toggleFAQ] Updated icon to:', icon.textContent);
          }
        } else {
          console.error('🔧 [toggleFAQ] Answer element not found for index:', index);
        }
      };
      
      // Re-initialize typewriter animations after page load
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
          if (window.reinitializeTypewriters) {
            window.reinitializeTypewriters();
          }
          // Re-initialize counter animations
          if (window.reinitializeCounters) {
            window.reinitializeCounters();
          }
        }, 500);
        
        // Additional initialization after 1 second to catch dynamically loaded content
        setTimeout(() => {
          if (window.reinitializeCounters) {
            window.reinitializeCounters();
          }
        }, 1000);
      });
    </script>
</body>
</html>`;
};

// Генерация страницы секции
const generateSectionPage = async (siteData, sectionId, sectionData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  const sectionTitle = sectionData.title || getSectionDisplayName(sectionId, sectionData);
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sectionTitle} - ${siteName}</title>
    <meta name="description" content="${sectionData.description || sectionTitle}">
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, sectionId, sectionData)}
        ${await generateSectionContent(sectionData, sectionId)}
    </main>
    
    ${generateCommonFooter(siteData)}
    
    ${(() => {
      // Проверяем наличие раздела проверки возраста
      const ageVerificationSection = findAgeVerificationSection(siteData);
      return ageVerificationSection ? generateAgeVerificationModal(ageVerificationSection) : '';
    })()}
    
    ${generateCookieConsentHTML(headerData.language || 'en')}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

// Генерация общего хедера для всех страниц
const generateCommonHeader = (siteData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  
  // Генерируем стили хедера из headerData (как в EditorPanel.jsx)
  const headerStyles = [];
  
  if (headerData.backgroundColor) {
    headerStyles.push(`--header-bg-color: ${headerData.backgroundColor}`);
  }
  if (headerData.titleColor) {
    headerStyles.push(`--header-title-color: ${headerData.titleColor}`);
  }
  if (headerData.linksColor) {
    headerStyles.push(`--header-link-color: ${headerData.linksColor}`);
  }
  
  // Генерируем навигационные ссылки из headerData.menuItems (если есть) или из секций
  let navigationLinks = '';
  
  if (headerData.menuItems && headerData.menuItems.length > 0) {
    // Используем menuItems из headerData
    navigationLinks = headerData.menuItems.map(item => {
      const url = item.url || '#';
      const text = item.text || item.title || '';
      return `<li><a href="${url}" class="nav-link">${text}</a></li>`;
    }).join('');
  } else {
    // Fallback: используем секции
    navigationLinks = generateNavigationLinks(siteData);
  }
  
  // Добавляем контакты в навигацию
  if (siteData.contactData) {
    const contactFileName = getContactFileName(siteData.contactData);
    const contactTitle = siteData.contactData?.title || 'Контакты';
    navigationLinks += `<li><a href="${contactFileName}.html" class="nav-link">${contactTitle}</a></li>`;
  }
  
  return `<header class="site-header" style="${headerStyles.join('; ')}">
    <div class="header-content">
      <div class="site-branding">
        <h1 class="site-title">
          <a href="index.html">${siteName}</a>
        </h1>
        <div class="site-domain" style="display: none;">${headerData.domain || ''}</div>
      </div>
      <nav class="site-nav">
        <button class="menu-toggle" aria-label="Открыть меню">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu">
          <li><a href="index.html" class="nav-link">Главная</a></li>
          ${navigationLinks}
        </ul>
      </nav>
    </div>
  </header>`;
};

// Генерация навигационных ссылок
const generateNavigationLinks = (siteData) => {
  const sectionsData = siteData.sectionsData || {};
  const links = [];
  
  Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
    // Исключаем раздел проверки возраста из навигации
    const isAgeVerification = sectionId === 'age-verification' || 
                             sectionId === 'проверка возраста' ||
                             sectionData.title?.toLowerCase().includes('подтверждение возраста') ||
                             sectionData.title?.toLowerCase().includes('проверка возраста') ||
                             sectionData.title?.toLowerCase().includes('age verification');
    
    if (!isAgeVerification) {
      const fileName = getSectionFileName(sectionId, sectionData);
      const displayName = getSectionDisplayName(sectionId, sectionData);
      if (fileName && displayName) {
        links.push(`<li><a href="${fileName}.html" class="nav-link">${displayName}</a></li>`);
      }
    }
  });
  
  // Добавляем ссылку на контакты
  if (siteData.contactData) {
    const contactFileName = getContactFileName(siteData.contactData);
    const contactDisplayName = siteData.contactData.title || 'Контакты';
    links.push(`<li><a href="${contactFileName}.html" class="nav-link">${contactDisplayName}</a></li>`);
  }
  
  return links.join('');
};

// Генерация Hero секции
export const generateHeroSection = (siteData) => {
  const heroData = siteData.heroData || {};
  
  console.log('🎯 [MULTIPAGE EXPORT] generateHeroSection called with heroData:', heroData);
  
  // Получаем настройки анимации
  const animationType = heroData.animationType || 'none';
  const backgroundType = heroData.backgroundType || 'solid';
  const enableOverlay = heroData.enableOverlay || false;
  const overlayOpacity = heroData.overlayOpacity || 50;
  const enableBlur = heroData.enableBlur || false;
  const blurAmount = heroData.blurAmount || 0;
  
  console.log('🎯 [MULTIPAGE EXPORT] Hero settings:', {
    animationType,
    backgroundType,
    enableOverlay,
    overlayOpacity,
    enableBlur,
    blurAmount
  });
  
  // Генерируем стили для hero секции
  let heroStyles = '';
  let backgroundElement = '';
  let overlayElement = '';
  
  // Базовые стили hero секции
  heroStyles = `
    position: relative;
    overflow: hidden;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  // Стили фона в зависимости от типа
  switch (backgroundType) {
    case 'solid':
      heroStyles += `background-color: ${heroData.backgroundColor || '#ffffff'};`;
      break;
    case 'gradient':
      heroStyles += `background: linear-gradient(${heroData.gradientDirection || 'to right'}, ${heroData.gradientColor1 || '#ffffff'}, ${heroData.gradientColor2 || '#f5f5f5'});`;
      break;
    case 'image':
      if (heroData.backgroundImage) {
        // Обрабатываем путь к изображению
        let imagePath = heroData.backgroundImage;
        
        // Если это blob URL, используем стандартное имя файла
        if (imagePath.startsWith('blob:')) {
          imagePath = 'assets/images/hero-background.jpg';
        } else {
          // Получаем имя файла из пути
          const fileName = imagePath.split('/').pop();
          imagePath = `assets/images/${fileName}`;
        }
        
        // Применяем размытие только к фоновому изображению
        const blurStyle = enableBlur ? `filter: blur(${blurAmount}px);` : '';
        
        // Добавляем элемент для анимации фонового изображения
        if (animationType === 'zoom' || animationType === 'pan') {
          backgroundElement = `<div class="hero-bg-animation" style="background-image: url('${imagePath}'); ${blurStyle}"></div>`;
          heroStyles += `background-image: none;`; // Убираем фоновое изображение с основного элемента
        } else {
          // Если нет анимации, но есть размытие, создаем отдельный элемент для фона с размытием
          if (enableBlur) {
            backgroundElement = `<div class="hero-bg-blur" style="background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; ${blurStyle}"></div>`;
            heroStyles += `background-image: none;`; // Убираем фоновое изображение с основного элемента
          } else {
            // Если нет размытия и нет анимации, используем обычный фон
            heroStyles += `background-image: url('${imagePath}'); background-size: cover; background-position: center; background-repeat: no-repeat;`;
          }
        }
      }
      break;
  }
  
  // Размытие не применяем к основному контейнеру - только к фоновому изображению
  
  // Добавляем оверлей если включен
  if (enableOverlay) {
    // Если размытие уже применено к фоновому изображению, не применяем его к оверлею
    const overlayBlur = (enableBlur && backgroundType === 'image') ? 'none' : (enableBlur ? `blur(${blurAmount}px)` : 'none');
    
    overlayElement = `
      <div class="hero-overlay" style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(rgba(0,0,0,${overlayOpacity / 100}), rgba(0,0,0,${overlayOpacity / 100}));
        backdrop-filter: ${overlayBlur};
        z-index: 2;
      "></div>
    `;
  }
  
  // Добавляем CSS классы для анимации
  let animationClass = '';
  if (animationType !== 'none') {
    animationClass = ` hero-animation-${animationType}`;
  }
  
  const result = `<section class="hero-section${animationClass}" style="${heroStyles}">
    ${backgroundElement}
    ${overlayElement}
    <div class="container">
      <div class="hero-content" style="
        position: relative;
        z-index: 3;
        text-align: center;
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      ">
        <div class="hero-text-wrapper" style="
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(0.1px);
          padding: 2rem 3rem;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 800px;
          margin: 0 auto;
        ">
          <h1 class="hero-title" style="
            color: ${heroData.titleColor || '#ffffff'};
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(255, 255, 255, 0.8), 1px 1px 2px rgba(255, 255, 255, 0.6), 0 0 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.3);
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
            filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.8));
            font-family: 'Montserrat', sans-serif;
          ">${heroData.title || 'Добро пожаловать'}</h1>
          <p class="hero-subtitle" style="
            color: ${heroData.subtitleColor || '#ffffff'};
            font-size: 1.5rem;
            font-weight: 300;
            margin-bottom: 1rem;
            opacity: 0.9;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9), -1px -1px 1px rgba(255, 255, 255, 0.7), 0 0 15px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 255, 255, 0.2);
            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.2);
            filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.7));
            font-family: 'Montserrat', sans-serif;
          ">${heroData.subtitle || 'На наш сайт'}</p>
          ${heroData.description ? `<p class="hero-description" style="
            color: ${heroData.subtitleColor || '#ffffff'};
            font-size: 1.2rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9), -1px -1px 1px rgba(255, 255, 255, 0.7), 0 0 15px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 255, 255, 0.2);
            -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.2);
            filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.7));
            font-family: 'Montserrat', sans-serif;
          ">${heroData.description}</p>` : ''}
          ${heroData.buttonText ? `<a href="${siteData.contactData ? getContactFileName(siteData.contactData) + '.html' : 'contact.html'}" class="hero-button" style="
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            text-transform: none;
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif;
            font-size: 1.1rem;
          " onmouseover="this.style.background='#0056b3'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#007bff'; this.style.transform='translateY(0)'">${heroData.buttonText}</a>` : ''}
        </div>
      </div>
    </div>
  </section>`;
  
  console.log('🎯 [MULTIPAGE EXPORT] Generated hero HTML:', result.substring(0, 200) + '...');
  
  return result;
};

// Генерация превью секций на главной
// Старая функция generateSectionsPreview удалена - заменена на новую версию с поддержкой режимов отображения

// Функция для генерации выделенного раздела
const generateFeaturedSection = async (siteData) => {
  const heroData = siteData.heroData || {};
  const homePageSettings = heroData.homePageSettings || {};
  
  // Проверяем, нужно ли показывать выделенный раздел
  if (!homePageSettings.showFeaturedSection || !homePageSettings.featuredSectionId) {
    return '';
  }
  
  const featuredSectionId = homePageSettings.featuredSectionId;
  
  // Преобразуем sectionsData в объект, если это массив
  let sectionsObject = siteData.sectionsData || {};
  if (Array.isArray(siteData.sectionsData)) {
    sectionsObject = siteData.sectionsData.reduce((acc, section) => {
      acc[section.id] = section;
      return acc;
    }, {});
  }
  
  const featuredSectionData = sectionsObject[featuredSectionId];
  
  if (!featuredSectionData) {
    console.warn(`Featured section ${featuredSectionId} not found`);
    return '';
  }
  
  const sectionTitle = featuredSectionData.title || getSectionDisplayName(featuredSectionId, featuredSectionData);
  const sectionDescription = featuredSectionData.description || '';
  
  // Получаем настройки цветов секции
  const sectionColorSettings = featuredSectionData.colorSettings || {};
  const titleColor = sectionColorSettings?.textFields?.title || '#1a237e';
  const descriptionColor = sectionColorSettings?.textFields?.description || '#455a64';
  const contentColor = sectionColorSettings?.textFields?.content || '#455a64';
  
  // Получаем изображения секции
  const hasImages = Array.isArray(featuredSectionData.images) && featuredSectionData.images.length > 0;
  const hasSingleImage = featuredSectionData.imagePath && !hasImages;
  
  let imagesHtml = '';
  if (hasImages) {
    imagesHtml = featuredSectionData.images.map((image, index) => `
      <div class="featured-image">
        <img src="${image.url || image}" alt="${image.alt || sectionTitle}" loading="lazy">
      </div>
    `).join('');
  } else if (hasSingleImage) {
    imagesHtml = `
      <div class="featured-image">
        <img src="${featuredSectionData.imagePath}" alt="${sectionTitle}" loading="lazy">
      </div>
    `;
  }
  
  // Генерируем контент элементов
  const elementsHtml = (await Promise.all((featuredSectionData.contentElements || featuredSectionData.elements || featuredSectionData.aiElements || []).map(async (element, index) => {
    return await generateContentElementHTML(element, featuredSectionData.id);
  }))).join('');
  
  return `
    <section class="featured-section" style="
      padding: 4rem 0;
      background: ${sectionColorSettings?.sectionBackground?.enabled ? 
        (sectionColorSettings.sectionBackground.useGradient ? 
          `linear-gradient(${sectionColorSettings.sectionBackground.gradientDirection}, ${sectionColorSettings.sectionBackground.gradientColor1}, ${sectionColorSettings.sectionBackground.gradientColor2})` :
          sectionColorSettings.sectionBackground.solidColor) : 
        'transparent'
      };
      margin: 0;
    ">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        <div class="featured-content" style="
          display: grid;
          grid-template-columns: ${imagesHtml ? '1fr 1fr' : '1fr'};
          gap: 3rem;
          align-items: center;
        ">
          <div class="featured-text">
            <h2 style="
              color: ${titleColor};
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 1.5rem;
              font-family: 'Montserrat', sans-serif;
            ">${sectionTitle}</h2>
            
            ${sectionDescription ? `
              <p style="
                color: ${descriptionColor};
                font-size: 1.2rem;
                line-height: 1.6;
                margin-bottom: 2rem;
                font-family: 'Montserrat', sans-serif;
              ">${sectionDescription}</p>
            ` : ''}
            
            <div class="featured-elements" style="
              color: ${contentColor};
              font-family: 'Montserrat', sans-serif;
            ">
              ${elementsHtml}
            </div>
            
            <div class="featured-actions" style="margin-top: 2rem;">
              <a href="${getSectionFileName(featuredSectionId, featuredSectionData)}.html" 
                 class="featured-button" 
                 style="
                   display: inline-block;
                   padding: 1rem 2rem;
                   background: #1976d2;
                   color: white;
                   text-decoration: none;
                   border-radius: 8px;
                   font-weight: 600;
                   transition: all 0.3s ease;
                 "
                 onmouseover="this.style.background='#1565c0'"
                 onmouseout="this.style.background='#1976d2'"
              >
                Подробнее о ${sectionTitle}
              </a>
            </div>
          </div>
          
          ${imagesHtml ? `
            <div class="featured-images">
              ${imagesHtml}
            </div>
          ` : ''}
        </div>
      </div>
    </section>
  `;
};

// Функция для генерации превью разделов с новыми режимами
const generateSectionsPreview = (siteData) => {
  const heroData = siteData.heroData || {};
  const homePageSettings = heroData.homePageSettings || {};
  
  // Проверяем, нужно ли показывать превью разделов
  if (!homePageSettings.showSectionsPreview) {
    return '';
  }
  
  const sectionsData = siteData.sectionsData || {};
  const maxSections = homePageSettings.maxSectionsToShow || 6;
  const displayMode = homePageSettings.sectionsDisplayMode || 'cards';
  
  // Преобразуем sectionsData в объект, если это массив
  let sectionsObject = sectionsData;
  if (Array.isArray(sectionsData)) {
    sectionsObject = sectionsData.reduce((acc, section) => {
      acc[section.id] = section;
      return acc;
    }, {});
  }
  
  // Фильтруем разделы (исключаем выделенный раздел)
  const filteredSections = Object.entries(sectionsObject).filter(([sectionId, sectionData]) => {
    return sectionId !== homePageSettings.featuredSectionId;
  }).slice(0, maxSections);
  
  if (filteredSections.length === 0) {
    return '';
  }
  
  const gridClass = 'preview-grid';
  
  const cardClass = 'preview-card';
  
  return `
    <section class="sections-preview mode-${displayMode}" style="padding: 4rem 0; background: transparent;">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        <h2 style="
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #2c3e50;
          font-family: 'Montserrat', sans-serif;
        ">Наши разделы</h2>
        
        <div class="${gridClass}">
          ${filteredSections.map(([sectionId, sectionData]) => {
    const fileName = getSectionFileName(sectionId, sectionData);
    const displayName = getSectionDisplayName(sectionId, sectionData);
    
            if (!fileName) return '';
            
            // Получаем изображение для карточки
            const cardImage = sectionData.imagePath || 
                             (Array.isArray(sectionData.images) && sectionData.images.length > 0 ? sectionData.images[0].url || sectionData.images[0] : '') ||
                             '';
            
            // Стандартный рендеринг для карточек
            return `
              <div class="${cardClass}">
                ${cardImage ? `
                  <div class="preview-image">
                    <img src="${cardImage}" alt="${displayName}" loading="lazy">
                  </div>
                ` : ''}
                <div class="preview-content">
                  <h3>${displayName}</h3>
                  <p>${sectionData.description || 'Узнайте больше в этом разделе'}</p>
                  <a href="${fileName}.html" class="preview-link">...</a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
};

// Функция для генерации превью контактов
const generateContactPreview = (siteData) => {
  const heroData = siteData.heroData || {};
  const homePageSettings = heroData.homePageSettings || {};
  
  // Проверяем, нужно ли показывать превью контактов
  if (!homePageSettings.showContactPreview || !siteData.contactData) {
    return '';
  }
  
  const contactData = siteData.contactData;
  const contactFileName = getContactFileName(contactData);
  
  return `
    <section class="contact-preview" style="padding: 4rem 0; background: transparent;">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem;">
        <div class="contact-preview-content" style="
          text-align: center;
          padding: 3rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          color: white;
        ">
          <h2 style="
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            font-family: 'Montserrat', sans-serif;
          ">${contactData.title || 'Свяжитесь с нами'}</h2>
          
          <p style="
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            font-family: 'Montserrat', sans-serif;
          ">${contactData.description || 'Мы всегда готовы ответить на ваши вопросы'}</p>
          
          <div class="contact-preview-info" style="
            display: flex;
            justify-content: center;
            gap: 3rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
          ">
            ${contactData.phone ? `
              <div class="contact-info-item">
                <strong>Телефон:</strong><br>
                <a href="tel:${contactData.phone}" style="color: white; text-decoration: none;">
                  ${contactData.phone}
                </a>
              </div>
            ` : ''}
            
            ${contactData.email ? `
              <div class="contact-info-item">
                <strong>Email:</strong><br>
                <a href="mailto:${contactData.email}" style="color: white; text-decoration: none;">
                  ${contactData.email}
                </a>
              </div>
            ` : ''}
          </div>
          
          <a href="${contactFileName}.html" 
             class="contact-preview-button" 
             style="
               display: inline-block;
               padding: 1rem 2rem;
               background: rgba(255,255,255,0.2);
               color: white;
               text-decoration: none;
               border-radius: 8px;
               font-weight: 600;
               border: 2px solid rgba(255,255,255,0.3);
               transition: all 0.3s ease;
             "
             onmouseover="this.style.background='rgba(255,255,255,0.3)'"
             onmouseout="this.style.background='rgba(255,255,255,0.2)'"
          >
            Перейти к контактам
          </a>
        </div>
      </div>
    </section>
  `;
};

// Генерация контента секции
const generateSectionContent = async (sectionData, sectionId) => {
  const title = sectionData.title || getSectionDisplayName(sectionId, sectionData);
  const description = sectionData.description || '';
  const elements = sectionData.elements || [];
  
  console.log('🎨 [SECTION EXPORT] sectionData:', sectionData);
  console.log('🎨 [SECTION EXPORT] elements:', elements);
  
  // 🔥 ИСПРАВЛЕНИЕ: Не применяем фон секции ко всей странице
  // Фон должен применяться только к конкретным элементам через их собственные настройки
  
  let html = `<section class="section-content" style="
    padding: 3rem 0;
    margin: 0;
    background: transparent;
  ">
    <div class="container" style="
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    ">
      <h1 class="section-title" style="
        color: #333333;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        text-align: center;
        font-family: 'Montserrat', sans-serif;
      ">${title}</h1>
      ${description ? `<p class="section-description" style="
        color: #666666;
        font-size: 1.2rem;
        line-height: 1.6;
        margin-bottom: 3rem;
        text-align: center;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
      ">${description}</p>` : ''}
      <div class="section-elements">`;
  
  // Генерируем элементы контента
  for (const element of elements) {
    html += await generateContentElementHTML(element, sectionId);
  }
  
  html += '</div></div></section>';
  return html;
};

// Новая функция для генерации HTML элементов контента с правильными стилями
const generateContentElementHTML = async (element, sectionId = null) => {
  const elementId = `element-${element.id}`;
  const elementData = element.data || element;
  
  console.log(`🔍 [generateContentElementHTML] Processing element:`, {
    type: element.type,
    id: element.id,
    hasData: !!element.data,
    elementKeys: Object.keys(element),
    dataKeys: element.data ? Object.keys(element.data) : null
  });
  
  // Функция для применения настроек цветов из ColorSettings
  const applyColorSettings = (colorSettings, defaultStyles = {}) => {
    let containerStyles = { ...defaultStyles };
    let styles = {};
    
    // Применяем настройки фона секции
    if (colorSettings?.sectionBackground?.enabled) {
      const { sectionBackground } = colorSettings;
      if (sectionBackground.useGradient) {
        containerStyles.background = `linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2})`;
      } else {
        containerStyles.backgroundColor = sectionBackground.solidColor;
      }
      containerStyles.opacity = sectionBackground.opacity || 1;
      containerStyles.border = `${colorSettings.borderWidth || 1}px solid ${colorSettings.borderColor || '#e0e0e0'}`;
      containerStyles.borderRadius = `${colorSettings.borderRadius || 8}px`;
      containerStyles.padding = `${colorSettings.padding || 16}px`;
      if (colorSettings.boxShadow) {
        containerStyles.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }
    }
    
    // 🔥 ИСПРАВЛЕНИЕ: Применяем настройки фона карточек
    if (colorSettings?.cardBackground?.enabled) {
      const { cardBackground } = colorSettings;
      if (cardBackground.useGradient) {
        styles.background = `linear-gradient(${cardBackground.gradientDirection}, ${cardBackground.gradientColor1}, ${cardBackground.gradientColor2})`;
      } else {
        styles.backgroundColor = cardBackground.solidColor;
      }
      styles.opacity = cardBackground.opacity || 1;
    }
    
    // Применяем цвета текстовых полей
    if (colorSettings?.textFields) {
      Object.keys(colorSettings.textFields).forEach(fieldName => {
        styles[`${fieldName}Color`] = colorSettings.textFields[fieldName];
      });
    }
    
    return { containerStyles, textStyles: styles };
  };
  
  switch (element.type) {
    case 'typography':
      const headingTag = elementData.headingType || 'h2';
      const { containerStyles: typographyContainerStyles, textStyles: typographyTextStyles } = applyColorSettings(elementData.colorSettings, {
        margin: '1rem 0'
      });
      
      const typographyTextColor = typographyTextStyles.textColor || elementData.textColor || '#333333';
      
      const typographyContent = `
        <${headingTag} style="
          color: ${typographyTextColor};
          text-align: ${elementData.textAlign || 'left'};
          font-family: ${elementData.fontFamily || 'inherit'};
          font-weight: ${elementData.fontWeight || 'normal'};
          font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : 'inherit'};
          margin: 0;
        ">${elementData.text || 'Заголовок или текст'}</${headingTag}>
      `;
      
      // Если есть настройки фона, оборачиваем в контейнер
      if (elementData.colorSettings?.sectionBackground?.enabled) {
        return `
          <div id="${elementId}" class="content-element typography" style="${Object.entries(typographyContainerStyles).map(([key, value]) => `${key}: ${value}`).join('; ')}">
            ${typographyContent}
          </div>
        `;
      }
      
      return `<div id="${elementId}" class="content-element typography" style="margin: 1rem 0;">${typographyContent}</div>`;

    case 'rich-text':
      const parseMarkdown = (text) => {
        if (!text) return '';
        return text
          .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
          .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>');
      };
      
      const { containerStyles: richContainerStyles, textStyles: richTextStyles } = applyColorSettings(elementData.colorSettings, {
        margin: '1.5rem 0',
        padding: elementData.padding ? `${elementData.padding}px` : '1rem',
        background: elementData.backgroundColor || '#fafafa',
        borderRadius: elementData.borderRadius ? `${elementData.borderRadius}px` : '8px',
        borderLeft: `4px solid ${elementData.borderColor || '#1976d2'}`
      });
      
      const richTitleColor = richTextStyles.titleColor || elementData.titleColor || '#1976d2';
      const richTextColor = richTextStyles.textColor || elementData.textColor || '#333333';
      
      const richTextContent = `
        ${elementData.showTitle !== false ? `
          <h3 style="
            color: ${richTitleColor};
            font-family: ${elementData.fontFamily || 'inherit'};
            font-size: ${elementData.titleFontSize ? elementData.titleFontSize + 'px' : '1.25rem'};
            margin: 0 0 1rem 0;
          ">${elementData.title || 'Богатый текст'}</h3>
        ` : ''}
        <div class="rich-content" style="
          color: ${richTextColor};
          font-family: ${elementData.fontFamily || 'inherit'};
          font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : '1rem'};
          text-align: ${elementData.textAlign || 'left'};
          line-height: 1.6;
        ">
          <p>${parseMarkdown(elementData.content || 'Текст с **жирным**, *курсивом*, ***жирным курсивом***\n\nВторой абзац с [ссылкой](https://example.com)')}</p>
        </div>
      `;
      
      return `
        <div id="${elementId}" class="content-element rich-text" style="${Object.entries(richContainerStyles).map(([key, value]) => `${key}: ${value}`).join('; ')}">
          ${richTextContent}
        </div>
      `;

    case 'blockquote':
      const borderClass = `border-${elementData.borderPosition || 'left'}`;
      const gradientStyle = elementData.useGradient ? 
        `background: linear-gradient(${elementData.gradientDirection || 'to right'}, ${elementData.gradientColor1 || '#f8f9fa'}, ${elementData.gradientColor2 || '#ffffff'});` : 
        `background: ${elementData.backgroundColor || '#f8f9fa'};`;
      
      return `
        <div id="${elementId}" class="content-element blockquote ${borderClass}" style="
          ${gradientStyle}
          border-color: ${elementData.borderColor || '#dee2e6'};
          border-width: ${elementData.borderWidth || 4}px;
          padding: ${elementData.padding || 20}px;
          text-align: ${elementData.textAlign || 'left'};
          font-family: ${elementData.fontFamily || 'Georgia'};
        ">
          <blockquote>
            ${elementData.showTitle && elementData.title ? `
              <div class="quote-title" style="color: ${elementData.titleColor || elementData.quoteColor || '#555555'};">${elementData.title}</div>
            ` : ''}
            <p class="quote-text" style="
              color: ${elementData.quoteColor || '#555555'};
              font-size: ${elementData.quoteFontSize || 18}px;
              font-style: ${elementData.italic !== false ? 'italic' : 'normal'};
            ">"${elementData.quote || 'Это цитата для демонстрации'}"</p>
            ${elementData.showAuthor && elementData.author ? `
              <footer class="quote-author" style="
                color: ${elementData.authorColor || '#888888'};
                font-size: ${elementData.authorFontSize || 14}px;
              ">
                — ${elementData.author}${elementData.showSource && elementData.source ? ', ' + elementData.source : ''}
              </footer>
            ` : ''}
          </blockquote>
        </div>
      `;

    case 'list':
      const listTag = elementData.listType === 'numbered' ? 'ol' : 'ul';
      const items = elementData.items || elementData.initialItems || ['Первый элемент', 'Второй элемент', 'Третий элемент'];
      const spacingClass = `spacing-${elementData.spacing || 'normal'}`;
      const bulletClass = elementData.listType === 'bulleted' ? `bullet-${elementData.bulletStyle || 'circle'}` : '';
      const numberClass = elementData.listType === 'numbered' ? `number-${elementData.numberStyle || 'decimal'}` : '';
      
      return `
        <div id="${elementId}" class="content-element list ${spacingClass} ${bulletClass} ${numberClass}">
          <${listTag} style="
            color: ${elementData.itemColor || '#333333'};
            font-family: ${elementData.fontFamily || 'inherit'};
            font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : 'inherit'};
          ">
            ${items.map(item => `<li style="
              ${elementData.customColors && elementData.accentColor ? `color: ${elementData.accentColor};` : ''}
            ">${item}</li>`).join('')}
          </${listTag}>
        </div>
      `;

    case 'callout':
      const calloutIcons = {
        info: 'ℹ️',
        warning: '⚠️',
        error: '❌',
        success: '✅',
        note: '📝',
        tip: '💡',
        question: '❓',
        important: '⭐',
        security: '🔒'
      };
      const calloutType = elementData.type || 'info';
      const icon = calloutIcons[calloutType] || 'ℹ️';
      
      return `
        <div id="${elementId}" class="content-element callout callout-${calloutType}" style="
          ${elementData.customColors && elementData.backgroundColor ? `background: ${elementData.backgroundColor};` : ''}
          ${elementData.customColors && elementData.borderColor ? `border-color: ${elementData.borderColor};` : ''}
          ${elementData.padding ? `padding: ${elementData.padding}px;` : ''}
        ">
          <div class="callout-header">
            ${elementData.showIcon !== false ? `
              <span class="callout-icon">${icon}</span>
            ` : ''}
            <div class="callout-content">
              <h4 class="callout-title" style="
                ${elementData.customColors && elementData.textColor ? `color: ${elementData.textColor};` : ''}
                font-family: ${elementData.fontFamily || 'inherit'};
                font-size: ${elementData.titleFontSize ? elementData.titleFontSize + 'px' : '1.1rem'};
              ">${elementData.title || 'Важная информация'}</h4>
              <p class="callout-text" style="
                ${elementData.customColors && elementData.textColor ? `color: ${elementData.textColor};` : ''}
                font-family: ${elementData.fontFamily || 'inherit'};
                font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : '0.95rem'};
              ">${elementData.content || 'Это важная информация, которую пользователи должны заметить.'}</p>
            </div>
          </div>
        </div>
      `;

    case 'code-block':
      const codeLines = (elementData.code || 'function hello() {\n  console.log("Hello, World!");\n}').split('\n');
      const showLineNumbers = elementData.showLineNumbers !== false;
      const lineNumbersClass = showLineNumbers ? 'show-line-numbers' : '';
      
      return `
        <div id="${elementId}" class="content-element code-block ${lineNumbersClass}">
          ${elementData.showTitle !== false ? `
            <div class="code-header">
              <span>📄</span>
              ${elementData.title || 'Блок кода'} (${elementData.language || 'javascript'})
            </div>
          ` : ''}
          <div class="code-content">
            ${showLineNumbers ? `
              <div class="line-numbers">
                ${codeLines.map((_, i) => `<div>${i + 1}</div>`).join('')}
              </div>
            ` : ''}
            <pre><code style="
              font-family: ${elementData.fontFamily || "'Courier New', Monaco, monospace"};
              font-size: ${elementData.fontSize ? elementData.fontSize + 'px' : '0.9rem'};
            ">${codeLines.join('\n')}</code></pre>
          </div>
        </div>
      `;

    case 'timeline-component':
      // Получаем данные из element.data если есть, иначе из element
      const timelineEvents = elementData.events || elementData.items || [
        { date: '2024', title: 'Запуск проекта', description: 'Начало разработки', status: 'completed' },
        { date: '2024', title: 'Тестирование', description: 'Проверка функций', status: 'in-progress' },
        { date: '2024', title: 'Релиз', description: 'Публикация', status: 'pending' }
      ];

      // Получаем цвета из colorSettings
      const timelineColorSettings = elementData.colorSettings || {};
      const timelineTitleColor = timelineColorSettings.textFields?.title || '#000000';
      const timelineDateColor = timelineColorSettings.textFields?.date || '#666666';
      const timelineTextColor = timelineColorSettings.textFields?.text || '#333333';
      const timelineLineColor = timelineColorSettings.textFields?.line || '#e0e0e0';
      const timelineCompletedColor = timelineColorSettings.textFields?.completed || '#4caf50';
      const timelineInProgressColor = timelineColorSettings.textFields?.inProgress || '#ff9800';
      const timelinePendingColor = timelineColorSettings.textFields?.pending || '#2196f3';

      // Функция для получения цвета статуса
      const getStatusColor = (status) => {
        switch (status) {
          case 'completed': return timelineCompletedColor;
          case 'in-progress': return timelineInProgressColor;
          case 'pending': return timelinePendingColor;
          default: return timelinePendingColor;
        }
      };

      // Функция для получения иконки статуса
      const getStatusIcon = (status) => {
        switch (status) {
          case 'completed': return '✓';
          case 'in-progress': return '⟳';
          case 'pending': return '○';
          default: return '○';
        }
      };

      // Стили контейнера из colorSettings
      let timelineContainerStyles = `
        margin: 2rem 0;
      `;

      // Применяем настройки фона из sectionBackground
      if (timelineColorSettings.sectionBackground?.enabled) {
        const { sectionBackground } = timelineColorSettings;
        if (sectionBackground.useGradient) {
          timelineContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
        } else {
          timelineContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
        }
        timelineContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
      }

      // Применяем настройки границы
      if (timelineColorSettings.borderColor) {
        timelineContainerStyles += ` border: ${timelineColorSettings.borderWidth || 1}px solid ${timelineColorSettings.borderColor};`;
      }

      // Применяем радиус углов
      if (timelineColorSettings.borderRadius !== undefined) {
        timelineContainerStyles += ` border-radius: ${timelineColorSettings.borderRadius}px;`;
      } else {
        timelineContainerStyles += ` border-radius: 8px;`;
      }

      // Применяем внутренние отступы
      if (timelineColorSettings.padding !== undefined) {
        timelineContainerStyles += ` padding: ${timelineColorSettings.padding}px;`;
      } else {
        timelineContainerStyles += ` padding: 16px;`;
      }

      // Применяем тень
      if (timelineColorSettings.boxShadow) {
        timelineContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }

      return `
        <div id="${elementId}" class="content-element timeline-component" style="${timelineContainerStyles}">
          <h4 style="
            margin-bottom: 24px;
            text-align: center;
            color: ${timelineTitleColor};
            font-size: 2rem;
          ">${elementData.title || 'Временная шкала'}</h4>
          <div style="position: relative;">
            ${timelineEvents.map((event, index) => `
              <div style="
                display: flex;
                margin-bottom: 24px;
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  margin-right: 16px;
                ">
                  <div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background-color: ${getStatusColor(event.status)};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 16px;
                  ">${getStatusIcon(event.status)}</div>
                  ${index < timelineEvents.length - 1 ? `
                    <div style="
                      width: 2px;
                      height: 40px;
                      background-color: ${timelineLineColor};
                      margin-top: 8px;
                    "></div>
                  ` : ''}
                </div>
                <div style="flex: 1;">
                  <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                  ">
                    <h6 style="
                      margin: 0;
                      margin-right: 8px;
                      color: ${timelineTextColor};
                      font-size: 1.25rem;
                    ">${event.title}</h6>
                    <span style="
                      background-color: ${getStatusColor(event.status)};
                      color: white;
                      padding: 4px 8px;
                      border-radius: 12px;
                      font-size: 12px;
                      font-weight: 500;
                    ">${event.status}</span>
                  </div>
                  <p style="
                    margin: 0 0 8px 0;
                    color: ${timelineDateColor};
                    font-size: 14px;
                  ">${event.date}</p>
                  <p style="
                    margin: 0;
                    color: ${timelineTextColor};
                    line-height: 1.5;
                  ">${event.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'data-table':
      console.log('[multiPageSiteExporter] DataTable element data:', { elementData, element });
      // Получаем данные из различных возможных источников
      let tableData = [];
      
      // Приоритет 1: rows из elementData
      if (elementData.rows && Array.isArray(elementData.rows)) {
        tableData = elementData.rows;
      }
      // Приоритет 2: data из elementData
      else if (elementData.data && Array.isArray(elementData.data)) {
        tableData = elementData.data;
      }
      // Приоритет 3: rows из element
      else if (element.rows && Array.isArray(element.rows)) {
        tableData = element.rows;
      }
      // Приоритет 4: data из element
      else if (element.data && Array.isArray(element.data)) {
        tableData = element.data;
      }
      // Приоритет 5: initialRows из elementData
      else if (elementData.initialRows && Array.isArray(elementData.initialRows)) {
        // Преобразуем initialRows в формат для таблицы
        const headers = elementData.initialColumns || elementData.columns || [
          { id: 'name', label: 'Название' },
          { id: 'value', label: 'Значение' },
          { id: 'description', label: 'Описание' }
        ];
        
        // Создаем заголовки
        const headerRow = headers.map(col => col.label);
        tableData = [headerRow];
        
        // Добавляем данные
        elementData.initialRows.forEach(row => {
          const dataRow = headers.map(col => row[col.id] || '');
          tableData.push(dataRow);
        });
      }
              // Fallback: дефолтные данные
        else {
          tableData = [
            ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'],
            ['Данные 1', 'Данные 2', 'Данные 3'],
            ['Данные 4', 'Данные 5', 'Данные 6']
          ];
        }
        
        console.log('[multiPageSiteExporter] DataTable final data:', tableData);
      
        // Получаем настройки таблицы
        const tableSettings = elementData.tableSettings || {};
        const isStriped = tableSettings.striped !== undefined ? tableSettings.striped : true;
        const isBordered = tableSettings.bordered !== undefined ? tableSettings.bordered : true;
        const isHover = tableSettings.hover !== undefined ? tableSettings.hover : true;
        const isDense = tableSettings.dense !== undefined ? tableSettings.dense : false;
        const isSortable = tableSettings.sortable !== undefined ? tableSettings.sortable : true;
        const sortConfig = tableSettings.sortConfig || { key: null, direction: 'asc' };

        // Получаем цвета из colorSettings
        const tableColorSettings = elementData.colorSettings || {};
      const tableStyles = elementData.customStyles || {};
      const tableBackgroundColor = tableColorSettings.textFields?.background || tableStyles.backgroundColor || 'white';
              const tableTitleColor = tableColorSettings.textFields?.title || tableColorSettings.textFields?.headerText || '#333333';
      const tableHeaderColor = tableColorSettings.textFields?.headerText || '#ffffff';
      const tableCellColor = tableColorSettings.textFields?.text || '#333333';
      const tableHeaderBg = tableColorSettings.textFields?.headerBg || '#1976d2';
      const tableBorderColor = tableColorSettings.textFields?.border || '#c41e3a';
      const tableHoverColor = tableColorSettings.textFields?.hover || 'rgba(196,30,58,0.15)';

      // Стили контейнера из colorSettings
      let tableContainerStyles = `
        margin: 2rem 0;
        max-width: 1000px;
        margin-left: auto;
        margin-right: auto;
      `;

      // Применяем настройки фона из sectionBackground
      if (tableColorSettings.sectionBackground?.enabled) {
        const { sectionBackground } = tableColorSettings;
        if (sectionBackground.useGradient) {
          tableContainerStyles += ` background: linear-gradient(${sectionBackground.gradientDirection}, ${sectionBackground.gradientColor1}, ${sectionBackground.gradientColor2});`;
        } else {
          tableContainerStyles += ` background-color: ${sectionBackground.solidColor};`;
        }
        tableContainerStyles += ` opacity: ${sectionBackground.opacity || 1};`;
      }

      // Применяем настройки границы
      if (tableColorSettings.borderColor) {
        tableContainerStyles += ` border: ${tableColorSettings.borderWidth || 1}px solid ${tableColorSettings.borderColor};`;
      }

      // Применяем радиус углов
      if (tableColorSettings.borderRadius !== undefined) {
        tableContainerStyles += ` border-radius: ${tableColorSettings.borderRadius}px;`;
      }

      // Применяем внутренние отступы
      if (tableColorSettings.padding !== undefined) {
        tableContainerStyles += ` padding: ${tableColorSettings.padding}px;`;
      } else {
        tableContainerStyles += ` padding: ${tableStyles.padding || 0}px;`;
      }

      // Применяем тень
      if (tableColorSettings.boxShadow) {
        tableContainerStyles += ` box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }

      return `
        <div id="${elementId}" class="content-element data-table" style="${tableContainerStyles}">
          ${(elementData.title || element.title || elementData.headers?.[0]?.label) ? `
            <h3 style="
              text-align: center;
              color: ${tableTitleColor};
              margin-bottom: 2rem;
              font-size: 1.5rem;
              font-weight: bold;
              font-family: 'Montserrat', sans-serif;
              background-color: ${tableColorSettings.textFields?.headerBg || 'transparent'};
              padding: 1rem;
              border-radius: 8px;
              border: ${tableColorSettings.textFields?.border ? `2px solid ${tableColorSettings.textFields.border}` : 'none'};
            ">${elementData.title || element.title || elementData.headers?.[0]?.label}</h3>
          ` : ''}
          <div style="
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            background: ${tableBackgroundColor};
            border: 1px solid ${tableBorderColor};
            max-width: 100%;
          ">
            <table id="${elementId}" style="
              width: 100%;
              min-width: 600px;
              border-collapse: collapse;
              background: ${tableBackgroundColor};
              font-family: 'Montserrat', sans-serif;
              table-layout: fixed;
            ">
              ${tableData.map((row, rowIndex) => `
                <tr style="
                  ${rowIndex === 0 ? `
                    background: ${tableHeaderBg};
                    background-image: linear-gradient(135deg, ${tableHeaderBg} 0%, ${tableHeaderBg}DD 100%);
                  ` : `
                    background: ${isStriped && rowIndex % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent'};
                  `}
                  border-bottom: ${isBordered ? (rowIndex === 0 ? `2px solid ${tableBorderColor}` : `1px solid ${tableBorderColor}40`) : 'none'};
                  transition: background-color 0.2s ease;
                " ${rowIndex > 0 && isHover ? `onmouseover="this.style.backgroundColor='${tableHoverColor}'" onmouseout="this.style.backgroundColor='${isStriped && rowIndex % 2 === 1 ? 'rgba(0,0,0,0.02)' : 'transparent'}'"` : ''}>
                  ${row.map((cell, cellIndex) => `
                    <${rowIndex === 0 ? 'th' : 'td'} style="
                      padding: ${rowIndex === 0 ? (isDense ? '12px 16px' : '16px 20px') : (isDense ? '8px 16px' : '14px 20px')};
                      text-align: ${rowIndex === 0 ? 'center' : 'left'};
                      color: ${rowIndex === 0 ? tableHeaderColor : tableCellColor};
                      font-weight: ${rowIndex === 0 ? 'bold' : 'normal'};
                      font-size: ${rowIndex === 0 ? (isDense ? '13px' : '14px') : (isDense ? '12px' : '13px')};
                      ${rowIndex === 0 ? 'text-transform: uppercase; letter-spacing: 0.5px;' : ''}
                      ${cellIndex === 0 && rowIndex > 0 ? 'font-weight: 500;' : ''}
                      border-right: ${isBordered && cellIndex < row.length - 1 ? `1px solid ${tableBorderColor}40` : 'none'};
                      ${rowIndex === 0 && isSortable ? 'cursor: pointer; user-select: none;' : ''}
                      word-wrap: break-word;
                      overflow-wrap: break-word;
                      max-width: 0;
                      white-space: normal;
                    " ${rowIndex === 0 && isSortable ? `onclick="sortTable('${elementId}', ${cellIndex})"` : ''}>${cell}${rowIndex === 0 && isSortable && cellIndex === 0 ? ' ↕' : ''}</${rowIndex === 0 ? 'th' : 'td'}>
                  `).join('')}
                </tr>
              `).join('')}
            </table>
          </div>
          
          <!-- Дополнительная информация удалена из экспорта -->
          
          <style>
            @media (max-width: 768px) {
              #${elementId} {
                min-width: 400px !important;
              }
              #${elementId} th,
              #${elementId} td {
                padding: 8px 12px !important;
                font-size: 12px !important;
              }
            }
            @media (max-width: 480px) {
              #${elementId} {
                min-width: 300px !important;
              }
              #${elementId} th,
              #${elementId} td {
                padding: 6px 8px !important;
                font-size: 11px !important;
              }
            }
          </style>
          
          ${isSortable ? `
          <script>
            // Функция сортировки таблицы
            function sortTable(tableId, columnIndex) {
              const table = document.getElementById(tableId);
              const tbody = table.querySelector('tbody') || table;
              const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // Пропускаем заголовок
              const headerRow = tbody.querySelector('tr');
              
              // Определяем направление сортировки (по умолчанию desc - обратный порядок)
              const currentDirection = table.getAttribute('data-sort-direction') || 'desc';
              const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
              
              // Сортируем строки
              rows.sort((a, b) => {
                const aValue = a.cells[columnIndex]?.textContent || '';
                const bValue = b.cells[columnIndex]?.textContent || '';
                
                // Пытаемся преобразовать в числа для числовой сортировки
                const aNum = parseFloat(aValue);
                const bNum = parseFloat(bValue);
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                  return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
                }
                
                // Строковая сортировка
                return newDirection === 'asc' 
                  ? aValue.localeCompare(bValue, 'ru') 
                  : bValue.localeCompare(aValue, 'ru');
              });
              
              // Обновляем таблицу
              rows.forEach(row => tbody.appendChild(row));
              table.setAttribute('data-sort-direction', newDirection);
              
              // Обновляем заголовки - стрелка переходит к активному столбцу
              const headers = headerRow.querySelectorAll('th');
              headers.forEach((header, index) => {
                const baseText = header.textContent.replace(/ [↑↓↕]/g, ''); // Убираем все стрелки
                if (index === columnIndex) {
                  // Активный столбец показывает направление сортировки
                  header.innerHTML = baseText + (newDirection === 'asc' ? ' ↑' : ' ↓');
                } else {
                  // Остальные столбцы без стрелок
                  header.innerHTML = baseText;
                }
              });
            }
            
            // Автоматическая сортировка при загрузке страницы
            document.addEventListener('DOMContentLoaded', function() {
              const table = document.getElementById('${elementId}');
              if (table) {
                // Автоматически сортируем по первому столбцу при загрузке
                setTimeout(() => sortTable('${elementId}', 0), 100);
              }
            });
          </script>
              const table = document.getElementById(tableId);
              const tbody = table.querySelector('tbody') || table;
              const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // Пропускаем заголовок
              const headerRow = tbody.querySelector('tr');
              
              // Определяем направление сортировки
              const currentDirection = table.getAttribute('data-sort-direction') || 'asc';
              const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
              
              // Сортируем строки
              rows.sort((a, b) => {
                const aValue = a.cells[columnIndex]?.textContent || '';
                const bValue = b.cells[columnIndex]?.textContent || '';
                
                // Пытаемся преобразовать в числа для числовой сортировки
                const aNum = parseFloat(aValue);
                const bNum = parseFloat(bValue);
                
                if (!isNaN(aNum) && !isNaN(bNum)) {
                  return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
                }
                
                // Строковая сортировка
                return newDirection === 'asc' 
                  ? aValue.localeCompare(bValue, 'ru') 
                  : bValue.localeCompare(aValue, 'ru');
              });
              
              // Обновляем таблицу
              rows.forEach(row => tbody.appendChild(row));
              table.setAttribute('data-sort-direction', newDirection);
              
              // Обновляем заголовки
              const headers = headerRow.querySelectorAll('th');
              headers.forEach((header, index) => {
                const baseText = header.textContent.replace(/ [↑↓↕]/g, ''); // Убираем все стрелки
                if (index === 0) { // Только первый столбец
                  if (index === columnIndex) {
                    header.innerHTML = baseText + (newDirection === 'asc' ? ' ↑' : ' ↓');
                  } else {
                    header.innerHTML = baseText + ' ↕'; // Возвращаем стрелку по умолчанию
                  }
                } else {
                  header.innerHTML = baseText; // Остальные столбцы без стрелок
                }
              });
            }
          </script>
          ` : ''}
        </div>
      `;

    case 'image-gallery':
      // Экспорт галереи изображений с поддержкой colorSettings
      const galleryImages = element.images || element.data?.images || [];
      
      // Получаем цвета из colorSettings
      const galleryColorSettings = element.data?.colorSettings || element.colorSettings || {};
      const galleryTitleColor = galleryColorSettings.textFields?.title || '#333333';
      const galleryDescriptionColor = galleryColorSettings.textFields?.description || '#666666';
      const galleryBackgroundColor = galleryColorSettings.textFields?.background || '#ffffff';
      const galleryBorderColor = galleryColorSettings.textFields?.border || '#e0e0e0';
      
      // Стили контейнера из colorSettings
      let galleryContainerStyles = `
        width: 100%;
        margin: 2rem 0;
        padding: 20px;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
      `;
      
      // Добавляем стили фона если включены
      if (galleryColorSettings.sectionBackground?.enabled) {
        if (galleryColorSettings.sectionBackground.useGradient) {
          galleryContainerStyles += `
            background: linear-gradient(${galleryColorSettings.sectionBackground.gradientDirection}, ${galleryColorSettings.sectionBackground.gradientColor1}, ${galleryColorSettings.sectionBackground.gradientColor2});
            opacity: ${galleryColorSettings.sectionBackground.opacity || 1};
          `;
        } else {
          galleryContainerStyles += `
            background-color: ${galleryColorSettings.sectionBackground.solidColor};
            opacity: ${galleryColorSettings.sectionBackground.opacity || 1};
          `;
        }
      } else {
        galleryContainerStyles += `background-color: ${galleryBackgroundColor};`;
      }
      
      // Добавляем стили границы и отступов
      if (galleryColorSettings.borderColor) {
        galleryContainerStyles += `
          border: ${galleryColorSettings.borderWidth || 1}px solid ${galleryColorSettings.borderColor};
          border-radius: ${galleryColorSettings.borderRadius || 8}px;
        `;
      } else {
        galleryContainerStyles += `border: 1px solid ${galleryBorderColor}; border-radius: 8px;`;
      }
      
      if (galleryColorSettings.padding !== undefined) {
        galleryContainerStyles += `padding: ${galleryColorSettings.padding}px;`;
      }
      
      if (galleryColorSettings.boxShadow) {
        galleryContainerStyles += `box-shadow: 0 2px 8px rgba(0,0,0,0.1);`;
      }
      
      return `
        <div id="${elementId}" class="content-element image-gallery" style="${galleryContainerStyles}">
          ${element.title ? `
            <h3 style="
              text-align: center;
              color: ${galleryTitleColor};
              margin-bottom: 1rem;
              font-size: 1.8rem;
              font-weight: bold;
            ">${element.title}</h3>
          ` : ''}
          ${element.description ? `
            <p style="
              text-align: center;
              color: ${galleryDescriptionColor};
              margin-bottom: 2rem;
              font-size: 1.1rem;
              line-height: 1.6;
            ">${element.description}</p>
          ` : ''}
          ${galleryImages.length > 0 ? `
            <div style="
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
            ">
              ${galleryImages.map((img, index) => `
                <div style="
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  transition: transform 0.3s ease;
                  background-color: ${galleryBackgroundColor};
                  border: 1px solid ${galleryBorderColor};
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                  <img src="${img.src || img.url || img}" alt="${img.alt || `Изображение ${index + 1}`}" style="
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                  ">
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f5f5f5;
              color: #666;
              font-style: italic;
              border-radius: 8px;
            ">
              📷 Пока нет изображений
            </div>
          `}
        </div>
      `;

    case 'gradient-text':
      const gradientDirection = elementData.gradientDirection || 'to right';
      const gradientColor1 = elementData.gradientColor1 || '#ff6b6b';
      const gradientColor2 = elementData.gradientColor2 || '#4ecdc4';
      const backgroundClip = elementData.backgroundClip !== false;
      
      return `
        <div id="${elementId}" class="content-element gradient-text" style="text-align: ${elementData.textAlign || 'center'}; margin: 2rem 0;">
          <h2 style="
            background: linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2});
            ${backgroundClip ? '-webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' : ''}
            font-size: ${elementData.fontSize || 48}px;
            font-weight: ${elementData.fontWeight || 'bold'};
            font-family: ${elementData.fontFamily || 'inherit'};
            margin: 0;
            ${!backgroundClip ? `color: ${gradientColor1};` : ''}
          ">${elementData.text || 'Градиентный текст'}</h2>
        </div>
      `;

    case 'animated-counter':
      return `
        <div id="${elementId}" class="content-element animated-counter" style="
          text-align: ${elementData.textAlign || 'center'};
          padding: ${elementData.padding || 20}px;
          margin: 2rem 0;
        ">
          ${elementData.title ? `
            <h3 style="
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 1rem;
            ">${elementData.title}</h3>
          ` : ''}
          <div class="counter" 
               data-start="${elementData.startValue || 0}" 
               data-end="${elementData.endValue || 100}" 
               data-duration="${elementData.duration || 2000}" 
               style="
                 color: ${elementData.numberColor || '#1976d2'};
                 font-size: ${elementData.numberFontSize || 48}px;
                 font-weight: ${elementData.numberFontWeight || 'bold'};
                 font-family: ${elementData.fontFamily || 'inherit'};
               ">${elementData.startValue || 0}</div>
          ${elementData.suffix ? `
            <span style="
              color: ${elementData.suffixColor || '#666666'};
              font-size: ${elementData.suffixFontSize || 16}px;
              margin-left: 8px;
            ">${elementData.suffix}</span>
          ` : ''}
          ${elementData.description ? `
            <p style="
              color: ${elementData.descriptionColor || '#666666'};
              font-size: ${elementData.descriptionFontSize || 16}px;
              margin-top: 1rem;
            ">${elementData.description}</p>
          ` : ''}
        </div>
      `;

    case 'typewriter-text':
      const texts = elementData.texts || ['Эффект печатной машинки'];
      return `
        <div id="${elementId}" class="content-element typewriter" 
             data-texts='${JSON.stringify(texts)}'
             data-speed="${elementData.speed || 150}"
             data-pause="${elementData.pauseTime || 2000}"
             data-repeat="${elementData.repeat !== false}"
             style="
               text-align: ${elementData.textAlign || 'center'};
               margin: 2rem 0;
               padding: ${elementData.padding || 20}px;
             ">
          <div class="typewriter-container">
            <span class="typewriter-text-content" style="
              color: ${elementData.textColor || '#333333'};
              font-size: ${elementData.fontSize || 32}px;
              font-weight: ${elementData.fontWeight || 'normal'};
              font-family: ${elementData.fontFamily || 'inherit'};
            "></span>
            <span class="typewriter-cursor" style="
              color: ${elementData.cursorColor || '#333333'};
              font-size: ${elementData.fontSize || 32}px;
              font-weight: ${elementData.fontWeight || 'normal'};
            ">|</span>
          </div>
        </div>
      `;

    case 'highlight-text':
      return `
        <div id="${elementId}" class="content-element highlight-text" style="
          text-align: ${elementData.textAlign || 'center'};
          margin: 2rem 0;
          padding: ${elementData.padding || 20}px;
        ">
          <p style="
            color: ${elementData.textColor || '#333333'};
            font-size: ${elementData.fontSize || 18}px;
            font-family: ${elementData.fontFamily || 'inherit'};
            line-height: 1.6;
          ">
            ${(elementData.text || 'Это текст с выделенными словами').replace(
              /\*\*(.*?)\*\*/g, 
              `<mark style="
                background-color: ${elementData.highlightColor || '#ffeb3b'};
                color: ${elementData.highlightTextColor || '#333333'};
                padding: 2px 4px;
                border-radius: 3px;
              ">$1</mark>`
            )}
          </p>
        </div>
      `;

    case 'testimonial-card':
      return `
        <div id="${elementId}" class="content-element testimonial-card" style="
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: ${elementData.backgroundColor || '#ffffff'};
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
        ">
          ${elementData.showQuotes !== false ? `
            <div style="
              font-size: 48px;
              color: ${elementData.quoteColor || '#e0e0e0'};
              line-height: 1;
              margin-bottom: 1rem;
            ">"</div>
          ` : ''}
          <blockquote style="
            color: ${elementData.textColor || '#333333'};
            font-size: ${elementData.textFontSize || 18}px;
            font-style: italic;
            margin: 0 0 1.5rem 0;
            line-height: 1.6;
          ">${elementData.text || 'Отличный отзыв о нашей работе. Очень довольны результатом!'}</blockquote>
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          ">
            ${elementData.avatar ? `
              <img src="${elementData.avatar}" alt="${elementData.name}" style="
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
              ">
            ` : ''}
            <div style="text-align: left;">
              <div style="
                color: ${elementData.nameColor || '#333333'};
                font-weight: bold;
                font-size: ${elementData.nameFontSize || 16}px;
              ">${elementData.name || 'Имя клиента'}</div>
              ${elementData.position ? `
                <div style="
                  color: ${elementData.positionColor || '#666666'};
                  font-size: ${elementData.positionFontSize || 14}px;
                ">${elementData.position}</div>
              ` : ''}
            </div>
          </div>
        </div>
      `;

    case 'faq-section':
      const faqItems = elementData.items || [
        { question: 'Вопрос 1', answer: 'Ответ на первый вопрос' },
        { question: 'Вопрос 2', answer: 'Ответ на второй вопрос' }
      ];
      
      return `
        <div id="${elementId}" class="content-element faq-section" style="
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
        ">
          ${elementData.title ? `
            <h3 style="
              text-align: center;
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 32}px;
              margin-bottom: 2rem;
            ">${elementData.title}</h3>
          ` : ''}
          ${faqItems.map((item, index) => `
            <div style="
              margin-bottom: 1rem;
              border: 1px solid ${elementData.borderColor || '#e0e0e0'};
              border-radius: 8px;
              overflow: hidden;
              background: ${elementData.questionBgColor || '#f5f5f5'};
            ">
              <div style="
                padding: 1rem;
                cursor: pointer;
                font-weight: ${elementData.questionFontWeight || 'bold'};
                color: ${elementData.questionColor || '#333333'};
                display: flex;
                justify-content: space-between;
                align-items: center;
              " onclick="toggleFAQ(${index})">
                ${item.question}
                <span style="color: ${elementData.iconColor || '#333333'}; font-size: 1.2rem;">▼</span>
              </div>
              <div id="faq-answer-${index}" style="
                padding: 1rem;
                background: ${elementData.answerBgColor || '#ffffff'};
                color: ${elementData.answerColor || '#666666'};
                line-height: 1.6;
                display: none;
                border-top: 1px solid ${elementData.borderColor || '#e0e0e0'};
              ">${item.answer}</div>
            </div>
          `).join('')}
        </div>
      `;

    case 'basic-card':
      return `
        <div id="${elementId}" class="content-element basic-card" style="
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          background: ${elementData.backgroundColor || '#ffffff'};
          border: 1px solid ${elementData.borderColor || '#e0e0e0'};
          border-radius: ${elementData.borderRadius || 8}px;
          box-shadow: ${elementData.showShadow !== false ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'};
          text-align: ${elementData.textAlign || 'center'};
        ">
          ${elementData.title ? `
            <h3 style="
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 1rem;
            ">${elementData.title}</h3>
          ` : ''}
          ${elementData.content ? `
            <p style="
              color: ${elementData.contentColor || '#666666'};
              font-size: ${elementData.contentFontSize || 16}px;
              line-height: 1.6;
              margin-bottom: ${elementData.buttonText ? '1.5rem' : '0'};
            ">${elementData.content}</p>
          ` : ''}
          ${elementData.buttonText ? `
            <a href="${elementData.buttonUrl || '#'}" style="
              display: inline-block;
              padding: 12px 24px;
              background: ${elementData.buttonBgColor || '#1976d2'};
              color: ${elementData.buttonTextColor || '#ffffff'};
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              transition: background-color 0.3s;
            " onmouseover="this.style.backgroundColor='${elementData.buttonHoverColor || '#1565c0'}'" 
               onmouseout="this.style.backgroundColor='${elementData.buttonBgColor || '#1976d2'}'">${elementData.buttonText}</a>
          ` : ''}
        </div>
      `;

    case 'image-card':
      // Используем экспортированное имя файла, если доступно
      {
        console.log(`🖼️ Processing image-card for export:`, elementData);
        console.log(`🖼️ Image-card element properties:`, {
          id: elementData.id,
          type: elementData.type,
          image: elementData.image,
          imageUrl: elementData.imageUrl,
          src: elementData.src,
          exportImagePath: elementData.exportImagePath,
          title: elementData.title,
          content: elementData.content
        });
        
        // Способ 1: Используем готовый путь exportImagePath
        let imgSrc = '';
        if (elementData.exportImagePath) {
          imgSrc = elementData.exportImagePath;
          console.log(`✅ Using exportImagePath: ${imgSrc}`);
        } else {
          // Способ 2: Резолвим имя файла
          const exportedFile = await resolveCardImageFileName(elementData, sectionId);
          if (exportedFile) {
            imgSrc = `assets/images/${exportedFile}`;
            console.log(`🔍 Resolved image path from cache: ${imgSrc}`);
          } else {
            // Способ 3: Fallback - используем оригинальные пути
            imgSrc = elementData.image || elementData.imageUrl || elementData.src || '';
            
            // Если это blob URL, попытаемся найти соответствующий файл по имени
            if (imgSrc && imgSrc.startsWith('blob:')) {
              console.log(`🔍 Found blob URL, trying to resolve to file path: ${imgSrc}`);
              // Попытка найти файл по ID элемента
              const possibleFileName = `card_${elementData.id}_image.jpg`;
              imgSrc = `assets/images/${possibleFileName}`;
              console.log(`🔍 Converted blob to potential file path: ${imgSrc}`);
            }
            
            console.log(`🔍 Using fallback image path: ${imgSrc}`);
          }
        }
        
        const title = elementData.title || '';
        const text = elementData.content || '';
        const btnText = elementData.buttonText || '';
        const btnUrl = elementData.buttonUrl || '#';
        const cardBg = elementData.backgroundColor || '#ffffff';
        const border = elementData.borderColor || '#e0e0e0';
        const radius = elementData.borderRadius || 8;
        const tColor = elementData.titleColor || '#333333';
        const cColor = elementData.contentColor || '#666666';
        
        console.log(`🖼️ Final image source for card: ${imgSrc}`);
        console.log(`🖼️ Image paths check:`, {
          exportImagePath: elementData.exportImagePath,
          imageUrl: elementData.imageUrl,
          image: elementData.image,
          src: elementData.src,
          finalImgSrc: imgSrc
        });
        
        // Проверяем, что imgSrc существует и не заглушка
        const isPlaceholder = imgSrc && (imgSrc.includes('placeholder') || imgSrc.includes('via.placeholder') || imgSrc.includes('text=Изображение'));
        const shouldShowImage = imgSrc && imgSrc.trim() && !isPlaceholder;
        console.log(`🖼️ Image decision: shouldShow=${shouldShowImage}, isPlaceholder=${isPlaceholder}, finalPath=${imgSrc || 'assets/images/placeholder.svg'}`);
        
      return `
          <div id="${elementId}" class="content-element">
            <div class="service-block" style="
              background:${cardBg};
              border:1px solid ${border};
              border-radius:${radius}px;
              padding:16px;
            ">
              <div class="service-image" style="height:160px;overflow:hidden;border-radius:${radius}px;margin-bottom:12px;">
                <img src="${imgSrc || 'assets/images/placeholder.svg'}" alt="${title}" style="width:100%;height:100%;object-fit:cover"/>
              </div>
              ${title ? `<h3 style="color:${tColor};margin:0 0 8px 0">${title}</h3>` : ''}
              ${text ? `<p style="color:${cColor};margin:0 0 12px 0">${text}</p>` : ''}
              ${btnText ? `<a href="${btnUrl}" class="btn">${btnText}</a>` : ''}
          </div>
        </div>
      `;
      }

    case 'multiple-cards':
      console.log('🔥🔥🔥 [MULTIPLE-CARDS EXPORT] НАЧАЛО ОБРАБОТКИ!');
      console.log('🔥🔥🔥 [MULTIPLE-CARDS EXPORT] elementData:', elementData);
      
      const cards = elementData.cards || [
        { title: 'Карточка 1', content: 'Описание первой карточки' },
        { title: 'Карточка 2', content: 'Описание второй карточки' },
        { title: 'Карточка 3', content: 'Описание третьей карточки' }
      ];
      
      // 🔥 ИСПРАВЛЕНИЕ: Применяем colorSettings для экспорта
      const multipleCardsColorSettings = elementData.colorSettings || elementData.data?.colorSettings || {};
      console.log('🎴🎴🎴 [MULTIPLE-CARDS EXPORT] colorSettings:', multipleCardsColorSettings);
      
      // Применяем настройки цветов из ColorSettings
      const { containerStyles: multipleCardsContainerStyles, textStyles: multipleCardsTextStyles } = applyColorSettings(multipleCardsColorSettings, {
        margin: '2rem 0',
        padding: '2rem',
        borderRadius: '8px'
      });

      // Определяем цвета с приоритетом ColorSettings
      const sectionTitleColor = multipleCardsColorSettings?.textFields?.title || multipleCardsTextStyles.titleColor || elementData.titleColor || '#1976d2';
      const sectionTextColor = multipleCardsColorSettings?.textFields?.text || multipleCardsColorSettings?.textFields?.description || multipleCardsTextStyles.textColor || elementData.descriptionColor || '#666666';
      const cardTitleColor = multipleCardsColorSettings?.textFields?.cardTitle || multipleCardsTextStyles.cardTitleColor || elementData.cardTitleColor || '#333333';
      const cardTextColor = multipleCardsColorSettings?.textFields?.cardText || multipleCardsColorSettings?.textFields?.cardContent || multipleCardsTextStyles.cardTextColor || elementData.cardContentColor || '#666666';
      const cardBorderColor = multipleCardsColorSettings?.textFields?.border || multipleCardsTextStyles.borderColor || elementData.borderColor || '#e0e0e0';
      
      // 🔥 ИСПРАВЛЕНИЕ: Фон карточек берется из cardBackground (настройки карточек)
      let cardBgColor = '#ffffff'; // Белый фон по умолчанию
      if (multipleCardsColorSettings?.cardBackground?.enabled) {
        if (multipleCardsColorSettings.cardBackground.useGradient) {
          const gradientDir = multipleCardsColorSettings.cardBackground.gradientDirection || 'to right';
          const color1 = multipleCardsColorSettings.cardBackground.gradientColor1 || '#ffffff';
          const color2 = multipleCardsColorSettings.cardBackground.gradientColor2 || '#f0f0f0';
          cardBgColor = `linear-gradient(${gradientDir}, ${color1}, ${color2})`;
        } else {
          cardBgColor = multipleCardsColorSettings.cardBackground.solidColor || '#ffffff';
        }
      } else {
        // Fallback на старые настройки
        cardBgColor = multipleCardsColorSettings?.textFields?.cardBackground || multipleCardsTextStyles.cardBackgroundColor || elementData.cardBgColor || '#ffffff';
      }
      
      // Прозрачность карточек
      const cardOpacity = multipleCardsColorSettings?.cardBackground?.opacity || 1;
      
      console.log('🎴🎴🎴 [MULTIPLE-CARDS EXPORT] Final colors:', { 
        sectionTitleColor, 
        sectionTextColor, 
        cardTitleColor, 
        cardTextColor, 
        cardBgColor 
      });
      
      console.log('🔥🔥🔥 [MULTIPLE-CARDS EXPORT] КОНЕЦ ОБРАБОТКИ!');

      // Конвертируем стили контейнера в строку
      const multipleCardsContainerStyleString = Object.entries(multipleCardsContainerStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');
      
      return `
        <div id="${elementId}" class="content-element multiple-cards" style="${multipleCardsContainerStyleString}">
          ${elementData.title ? `
            <h3 style="
              text-align: center;
              color: ${sectionTitleColor};
              font-size: ${elementData.titleFontSize || 32}px;
              margin-bottom: 2rem;
            ">${elementData.title}</h3>
          ` : ''}
          ${elementData.description ? `
            <p style="
              text-align: center;
              color: ${sectionTextColor};
              font-size: ${elementData.descriptionFontSize || 16}px;
              margin-bottom: 2rem;
            ">${elementData.description}</p>
          ` : ''}
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
          ">
            ${(await Promise.all(cards.map(async (card, index) => {
              console.log(`🔥🔥🔥 FILENAME-DEBUG: Processing card ${card.id} in section ${sectionId}`);
              console.log(`🔥🔥🔥 FILENAME-DEBUG: Card data:`, card);
              console.log(`🔥🔥🔥 FILENAME-DEBUG: card.fileName = "${card.fileName}"`);
              console.log(`🔥🔥🔥 FILENAME-DEBUG: card.imageUrl = "${card.imageUrl}"`);
              console.log(`🔥🔥🔥 FILENAME-DEBUG: card.image = "${card.image}"`);
              console.log(`🔥🔥🔥 FILENAME-DEBUG: card.src = "${card.src}"`);
              
              // Используем функцию resolveCardImageFileName которая теперь правильно приоритизирует fileName
              let imgSrc = '';
              const exportedFile = await resolveCardImageFileName(card, sectionId);
              console.log(`🔥🔥🔥 FILENAME-DEBUG: resolveCardImageFileName returned: "${exportedFile}"`);
              
              if (exportedFile) {
                imgSrc = `assets/images/${exportedFile}`;
                console.log(`🔥🔥🔥 FILENAME-DEBUG: FINAL imgSrc from resolved: ${imgSrc}`);
              } else {
                // Fallback к прямым свойствам карточки
                imgSrc = card.image || card.imageUrl || card.src || '';
                console.log(`🔥🔥🔥 FILENAME-DEBUG: Using fallback properties: ${imgSrc}`);
                
                // Если это blob URL, создаем простое имя файла
                if (imgSrc && imgSrc.startsWith('blob:')) {
                  console.log(`🔥🔥🔥 FILENAME-DEBUG: Found blob URL, clearing imgSrc`);
                  imgSrc = ''; // Не показываем изображение если не можем его найти
                }
                
                console.log(`🔥🔥🔥 FILENAME-DEBUG: FINAL imgSrc from fallback: ${imgSrc}`);
              }
              const title = card.title || '';
              const text = card.content || '';
              return `
                <div class="service-block" style="
                  background:${cardBgColor};
                  border:1px solid ${cardBorderColor};
                  border-radius:${elementData.borderRadius || 8}px;
                  padding:16px;
                ">
                  ${imgSrc && imgSrc.trim() && !imgSrc.includes('placeholder') ? `
                    <div class="service-image" style="height:160px;overflow:hidden;border-radius:${elementData.borderRadius || 8}px;margin-bottom:12px;">
                      <img src="${imgSrc}" alt="${title}" style="width:100%;height:100%;object-fit:cover"/>
                    </div>
                  ` : ''}
                  ${title ? `<h3 style=\"color:${cardTitleColor};margin:0 0 8px 0\">${title}</h3>` : ''}
                  ${text ? `<p style=\"color:${cardTextColor};margin:0 0 12px 0\">${text}</p>` : ''}
              </div>
              `;
            }))).join('')}
          </div>
        </div>
      `;

    case 'accordion':
      // Отладочная информация для аккордеона
      console.log('🎵 [ACCORDION EXPORT] elementData:', elementData);
      console.log('🎵 [ACCORDION EXPORT] colorSettings:', elementData.colorSettings);
      console.log('🎵 [ACCORDION EXPORT] data.colorSettings:', elementData.data?.colorSettings);
      
      // Получаем данные аккордеона с поддержкой разных форматов
      let accordionItems = elementData.accordionItems || elementData.items || elementData.initialPanels || [];
      
      // Если данные в content, парсим их
      if (accordionItems.length === 0 && elementData.content) {
        console.log('🎵 [ACCORDION EXPORT] Parsing content:', elementData.content);
        // Парсим контент для извлечения вопросов и ответов
        const contentLines = elementData.content.split('\n').filter(line => line.trim());
        const tempItems = [];
        let currentTitle = '';
        let currentContent = '';
        
        contentLines.forEach((line, index) => {
          if (line.includes('?') && !line.includes('*')) {
            // Это вопрос
            if (currentTitle && currentContent) {
              tempItems.push({ id: tempItems.length + 1, title: currentTitle.trim(), content: currentContent.trim() });
            }
            currentTitle = line.trim();
            currentContent = '';
          } else if (line.trim() && !line.includes('*')) {
            // Это ответ
            currentContent += (currentContent ? ' ' : '') + line.trim();
          }
        });
        
        // Добавляем последний элемент
        if (currentTitle && currentContent) {
          tempItems.push({ id: tempItems.length + 1, title: currentTitle.trim(), content: currentContent.trim() });
        }
        
        accordionItems = tempItems.length > 0 ? tempItems : [
          { id: 1, title: 'Секция 1', content: 'Содержимое первой секции' },
          { id: 2, title: 'Секция 2', content: 'Содержимое второй секции' },
          { id: 3, title: 'Секция 3', content: 'Содержимое третьей секции' }
        ];
      }
      
      console.log('🎵 [ACCORDION EXPORT] Final accordionItems:', accordionItems);

      // Получаем colorSettings из разных источников
      const finalColorSettings = elementData.colorSettings || elementData.data?.colorSettings || {};
      
      console.log('🎵 [ACCORDION EXPORT] finalColorSettings:', finalColorSettings);
      
      // Применяем настройки цветов из ColorSettings (как в базовой карточке)
      const { containerStyles, textStyles } = applyColorSettings(finalColorSettings, {
        maxWidth: '95%',
        width: '100%',
        margin: '2rem auto',
        borderRadius: '8px',
        overflow: 'hidden'
      });

      // Определяем цвета с приоритетом ColorSettings
      const titleColor = finalColorSettings?.textFields?.title || textStyles.titleColor || elementData.titleColor || '#ffd700';
      const textColor = finalColorSettings?.textFields?.text || textStyles.textColor || elementData.contentTextColor || '#ffffff';
      const backgroundColor = finalColorSettings?.textFields?.background || containerStyles.backgroundColor || elementData.contentBgColor || 'rgba(0,0,0,0.85)';
      const borderColor = finalColorSettings?.textFields?.border || textStyles.borderColor || elementData.borderColor || '#c41e3a';
      const headerBgColor = elementData.headerBgColor || backgroundColor;
      
      console.log('🎵 [ACCORDION EXPORT] Final colors:', { titleColor, textColor, backgroundColor, borderColor });

      // Конвертируем стили контейнера в строку
      const containerStyleString = Object.entries(containerStyles)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
        .join('; ');

      return `
        <div id="${elementId}" class="content-element accordion" style="
          width: 100%;
          max-width: 100%;
          margin: 2rem 0;
          padding: 0;
        ">
          ${(elementData.showTitle !== false && elementData.title) ? `
            <div style="
              text-align: center;
              padding: 0 0 2rem 0;
              margin-bottom: 2rem;
            ">
              <h3 style="
                color: ${titleColor};
                font-size: 24px;
                font-weight: bold;
                margin: 0;
                line-height: 1.4;
              ">${elementData.title}</h3>
            </div>
          ` : ''}
          
          <div style="
            display: flex; 
            flex-direction: column; 
            gap: 2px;
            width: 100%;
          ">
            ${accordionItems.map((item, index) => `
              <details ${elementData.allowMultiple === false && index === 0 ? 'open' : ''} class="accordion-item-${elementId}" style="
                width: 100%;
                background: ${backgroundColor};
                border: 1px solid ${borderColor};
                border-radius: 8px;
                overflow: hidden;
                transition: all 0.3s ease;
                margin: 0;
              ">
                <summary class="accordion-summary-${elementId}" style="
                  padding: 16px 24px;
                  background: ${backgroundColor};
                  color: ${titleColor};
                  font-weight: bold;
                  cursor: pointer;
                  outline: none;
                  list-style: none;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  user-select: none;
                  transition: all 0.3s ease;
                  width: 100%;
                  box-sizing: border-box;
                  font-size: 16px;
                  min-height: 56px;
                ">
                  <span style="font-weight: bold;">${item.title}</span>
                  <span class="accordion-icon-${elementId}" style="
                    transition: transform 0.3s ease;
                    color: ${titleColor};
                    font-size: 18px;
                    font-weight: bold;
                    margin-left: 16px;
                  ">▼</span>
                </summary>
                <div style="
                  padding: 16px 24px;
                  background: ${backgroundColor};
                  color: ${textColor};
                  line-height: 1.6;
                  white-space: pre-wrap;
                  font-size: 14px;
                  border-top: 1px solid ${borderColor};
                  box-sizing: border-box;
                ">${item.content}</div>
              </details>
            `).join('')}
          </div>
          
          <!-- Индикатор -->
          <div style="
            margin-top: 16px;
            display: flex;
            justify-content: center;
          ">
            <span style="
              font-size: 10px;
              color: ${textColor};
              background: transparent;
              border: 1px solid ${borderColor};
              border-radius: 12px;
              padding: 4px 8px;
              opacity: 0.7;
            ">Аккордеон • ${accordionItems.length} панели</span>
          </div>
        </div>
        
        <style>
          /* Стили для аккордеона ${elementId} */
          #${elementId} {
            width: 100% !important;
            max-width: none !important;
          }
          
          #${elementId} .accordion-item-${elementId} {
            transition: all 0.3s ease;
            width: 100% !important;
          }
          
          #${elementId} .accordion-item-${elementId}:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          
          #${elementId} .accordion-summary-${elementId} {
            transition: all 0.3s ease !important;
            background: ${backgroundColor} !important;
          }
          
          #${elementId} .accordion-summary-${elementId}:hover {
            background: rgba(196,30,58,0.15) !important;
            color: ${titleColor} !important;
          }
          
          #${elementId} .accordion-icon-${elementId} {
            transition: transform 0.3s ease;
          }
          
          #${elementId} details[open] .accordion-icon-${elementId} {
            transform: rotate(180deg);
          }
          
          #${elementId} details summary::-webkit-details-marker {
            display: none;
          }
          
          #${elementId} details summary::marker {
            content: '';
          }
          
          #${elementId} details summary {
            list-style: none;
          }
          
          #${elementId} details summary::-webkit-details-marker {
            display: none;
          }
          
          /* Анимация для содержимого */
          #${elementId} details[open] div {
            animation: accordion-slide-down-${elementId} 0.3s ease-out;
          }
          
          @keyframes accordion-slide-down-${elementId} {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Адаптивность */
          @media (max-width: 768px) {
            #${elementId} .accordion-summary-${elementId} {
              padding: 12px 16px !important;
              font-size: 14px !important;
            }
            
            #${elementId} details div {
              padding: 16px !important;
              font-size: 13px !important;
            }
          }
        </style>
      `;

    case 'qr-code':
      const qrValue = elementData.value || elementData.text || 'https://example.com';
      return `
        <div id="${elementId}" class="content-element qr-code" style="
          text-align: center;
          padding: 2rem;
          margin: 2rem 0;
        ">
          ${elementData.title ? `
            <h3 style="
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 1rem;
            ">${elementData.title}</h3>
          ` : ''}
          <div style="
            display: inline-block;
            padding: 1rem;
            background: ${elementData.backgroundColor || '#ffffff'};
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <div id="qr-${elementId}" style="
              width: ${elementData.size || 200}px;
              height: ${elementData.size || 200}px;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #666;
            ">QR: ${qrValue}</div>
          </div>
          ${elementData.description ? `
            <p style="
              color: ${elementData.descriptionColor || '#666666'};
              font-size: ${elementData.descriptionFontSize || 14}px;
              margin-top: 1rem;
              max-width: 300px;
              margin-left: auto;
              margin-right: auto;
            ">${elementData.description}</p>
          ` : ''}
        </div>
      `;

    case 'rating':
      const rating = Math.max(0, Math.min(5, elementData.rating || 4));
      const maxStars = elementData.maxStars || 5;
      
      return `
        <div id="${elementId}" class="content-element rating" style="
          text-align: ${elementData.textAlign || 'center'};
          padding: 1.5rem;
          margin: 2rem 0;
        ">
          ${elementData.title ? `
            <h3 style="
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 1rem;
            ">${elementData.title}</h3>
          ` : ''}
          <div style="
            display: inline-flex;
            gap: 4px;
            margin-bottom: ${elementData.showValue || elementData.description ? '1rem' : '0'};
          ">
            ${Array.from({ length: maxStars }, (_, i) => `
              <span style="
                color: ${i < rating ? (elementData.activeColor || '#ffc107') : (elementData.inactiveColor || '#e0e0e0')};
                font-size: ${elementData.size || 32}px;
                cursor: ${elementData.interactive !== false ? 'pointer' : 'default'};
              ">★</span>
            `).join('')}
          </div>
          ${elementData.showValue !== false ? `
            <div style="
              color: ${elementData.valueColor || '#666666'};
              font-size: ${elementData.valueFontSize || 18}px;
              font-weight: bold;
              margin-bottom: ${elementData.description ? '0.5rem' : '0'};
            ">${rating.toFixed(1)} / ${maxStars}</div>
          ` : ''}
          ${elementData.description ? `
            <p style="
              color: ${elementData.descriptionColor || '#666666'};
              font-size: ${elementData.descriptionFontSize || 14}px;
              margin: 0;
            ">${elementData.description}</p>
          ` : ''}
        </div>
      `;

    case 'progress-bars':
      const progressItems = elementData.items || [
        { label: 'Прогресс 1', value: 75, color: '#1976d2' },
        { label: 'Прогресс 2', value: 90, color: '#4caf50' },
        { label: 'Прогресс 3', value: 60, color: '#ff9800' }
      ];
      
      return `
        <div id="${elementId}" class="content-element progress-bars" style="
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
        ">
          ${elementData.title ? `
            <h3 style="
              text-align: center;
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 2rem;
            ">${elementData.title}</h3>
          ` : ''}
          ${progressItems.map((item, index) => `
            <div style="margin-bottom: ${index < progressItems.length - 1 ? '1.5rem' : '0'};">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
              ">
                <span style="
                  color: ${elementData.labelColor || '#333333'};
                  font-size: ${elementData.labelFontSize || 16}px;
                  font-weight: ${elementData.labelFontWeight || 'normal'};
                ">${item.label}</span>
                ${elementData.showValue !== false ? `
                  <span style="
                    color: ${elementData.valueColor || '#666666'};
                    font-size: ${elementData.valueFontSize || 14}px;
                  ">${item.value}%</span>
                ` : ''}
              </div>
              <div style="
                width: 100%;
                height: ${elementData.barHeight || 8}px;
                background: ${elementData.trackColor || '#e0e0e0'};
                border-radius: ${elementData.borderRadius || 4}px;
                overflow: hidden;
              ">
                <div style="
                  height: 100%;
                  width: ${Math.max(0, Math.min(100, item.value))}%;
                  background: ${item.color || elementData.barColor || '#1976d2'};
                  transition: width 0.8s ease;
                  border-radius: ${elementData.borderRadius || 4}px;
                "></div>
              </div>
            </div>
          `).join('')}
        </div>
      `;

    case 'bar-chart':
      // Получаем данные столбчатой диаграммы
      const barData = (element.data && element.data.data && Array.isArray(element.data.data.data)) ? element.data.data.data :
                     (element.data && Array.isArray(element.data.data)) ? element.data.data :
                     Array.isArray(elementData.data) ? elementData.data :
                     Array.isArray(element.data) ? element.data : [
        { label: 'Январь', value: 65, color: '#1976d2' },
        { label: 'Февраль', value: 45, color: '#2196f3' },
        { label: 'Март', value: 80, color: '#03a9f4' },
        { label: 'Апрель', value: 55, color: '#00bcd4' }
      ];

      const maxBarValue = Math.max(...barData.map(d => d.value));
      const minBarValue = Math.min(...barData.map(d => d.value));
      
      // Приоритет: element.colorSettings > element.data.colorSettings > element.data.data.colorSettings > fallback
      const deepColorSettings = (element.data && element.data.data && element.data.data.colorSettings) || {};
      const dataColorSettings = (element.data && element.data.colorSettings) || {};
      const elementColorSettings = element.colorSettings || {};
      const colorSettings = { ...elementColorSettings, ...dataColorSettings, ...deepColorSettings };
      
      // Получаем цвета из новой системы colorSettings
      const chartBackgroundColor = colorSettings.sectionBackground?.enabled 
        ? (colorSettings.sectionBackground.useGradient 
            ? `linear-gradient(${colorSettings.sectionBackground.gradientDirection}, ${colorSettings.sectionBackground.gradientColor1}, ${colorSettings.sectionBackground.gradientColor2})`
            : colorSettings.sectionBackground.solidColor)
        : '#ffffff';
      const chartTitleColor = colorSettings.textFields?.title || '#1976d2';
      const descriptionColor = colorSettings.textFields?.legendText || colorSettings.textFields?.legend || '#666666';
      
      const showValues = (element.data && element.data.data && element.data.data.showValues !== undefined) ? element.data.data.showValues :
                        (element.data && element.data.showValues !== undefined) ? element.data.showValues : 
                        (elementData.showValues !== undefined ? elementData.showValues : 
                        (element.showValues !== undefined ? element.showValues : true));
      const showGrid = (element.data && element.data.data && element.data.data.showGrid !== undefined) ? element.data.data.showGrid :
                      (element.data && element.data.showGrid !== undefined) ? element.data.showGrid : 
                      (elementData.showGrid !== undefined ? elementData.showGrid : 
                      (element.showGrid !== undefined ? element.showGrid : true));

      return `
        <style>
          @keyframes barChartAnimation-${elementId} {
            from { height: 0; opacity: 0; }
            to { height: var(--bar-height); opacity: 1; }
          }
          .bar-chart-bar-${elementId} {
            animation: barChartAnimation-${elementId} 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: calc(var(--bar-index) * 0.1s);
          }
          
          /* Мобильная адаптация для столбчатой диаграммы */
          @media (max-width: 768px) {
            #${elementId} .bar-chart-container {
              overflow-x: auto !important;
              padding: 20px 10px !important;
              gap: 8px !important;
              justify-content: flex-start !important;
              max-width: calc(4 * 60px + 3 * 8px + 40px) !important;
              min-width: 100% !important;
            }
            
            #${elementId} .bar-chart-container > div {
              flex-shrink: 0 !important;
              min-width: 50px !important;
              max-width: 60px !important;
            }
            
            #${elementId} .bar-chart-container .bar-chart-bar-${elementId} {
              width: 50px !important;
            }
            
            /* Скрываем названия столбцов в мобильной версии */
            #${elementId} .bar-chart-container > div > div:last-child {
              display: none !important;
            }
          }
        </style>

        <div id="${elementId}" class="content-element chart-component" style="
          margin: 2rem 0;
          padding: ${colorSettings.padding || 24}px;
          background: ${chartBackgroundColor};
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          max-width: 100%;
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        ">
          ${(element.data && element.data.data && element.data.data.title) || (element.data && element.data.title) || elementData.title || element.title ? `
            <h3 style="
              margin-bottom: 2rem;
              color: ${chartTitleColor};
              font-size: 1.5rem;
              font-weight: bold;
              text-align: center;
              font-family: 'Montserrat', sans-serif;
            ">${(element.data && element.data.data && element.data.data.title) || (element.data && element.data.title) || elementData.title || element.title}</h3>
          ` : ''}
          
          ${(element.data && element.data.data && element.data.data.description) || (element.data && element.data.description) || elementData.description || element.description ? `
            <p style="
              color: ${descriptionColor || '#666666'};
              font-size: 1rem;
              line-height: 1.5;
              margin-bottom: 24px;
              text-align: center;
              font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
            ">${(element.data && element.data.data && element.data.data.description) || (element.data && element.data.description) || elementData.description || element.description}</p>
          ` : ''}
          
          <div class="bar-chart-container" style="
            position: relative;
            height: 400px;
            padding: 20px;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            gap: 20px;
            background: ${colorSettings.sectionBackground?.enabled && colorSettings.sectionBackground.useGradient 
              ? `linear-gradient(${colorSettings.sectionBackground.gradientDirection}, ${colorSettings.sectionBackground.gradientColor1}, ${colorSettings.sectionBackground.gradientColor2})`
              : colorSettings.sectionBackground?.enabled 
                ? colorSettings.sectionBackground.solidColor 
                : 'rgba(0,0,0,0.02)'};
            opacity: ${colorSettings.sectionBackground?.enabled ? (colorSettings.sectionBackground.opacity || 1) : 1};
            border-radius: 8px;
            border: 1px solid rgba(0,0,0,0.1);
            overflow: hidden;
            width: 100%;
            max-width: 100%;
          ">
            ${showGrid ? `
              <!-- Сетка -->
              <div style="
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 60px;
                pointer-events: none;
                z-index: 0;
              ">
                <!-- Горизонтальные линии сетки -->
                <div style="position: absolute; left: 0; right: 0; bottom: 25%; height: 1px; background: ${colorSettings.textFields?.grid || 'rgba(0,0,0,0.1)'}; opacity: 0.3;"></div>
                <div style="position: absolute; left: 0; right: 0; bottom: 50%; height: 1px; background: ${colorSettings.textFields?.grid || 'rgba(0,0,0,0.1)'}; opacity: 0.3;"></div>
                <div style="position: absolute; left: 0; right: 0; bottom: 75%; height: 1px; background: ${colorSettings.textFields?.grid || 'rgba(0,0,0,0.1)'}; opacity: 0.3;"></div>
              </div>
            ` : ''}
            
            ${barData.map((item, index) => {
              const maxValue = Math.max(...barData.map(d => d.value));
              const minValue = Math.min(...barData.map(d => d.value));
              const range = maxValue - minValue;
              
              let barHeight;
              if (range === 0) {
                barHeight = 200; // Если все одинаковые
              } else {
                // Для малых диапазонов делаем больше разницы
                const relativeValue = (item.value - minValue) / range;
                barHeight = 50 + (relativeValue * 300); // От 50px до 350px
              }
              
              // Автоматическая ширина в зависимости от количества столбцов
              const availableWidth = 700;
              const gapSize = Math.max(8, Math.min(12, 700 / barData.length - 30));
              const totalGap = gapSize * (barData.length - 1);
              const widthPerColumn = (availableWidth - totalGap - 30) / barData.length;
              const autoWidth = Math.max(20, Math.min(100, widthPerColumn));

              return `
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 8px;
                  position: relative;
                  height: 100%;
                  justify-content: flex-end;
                ">
                  <!-- Столбец -->
                  <div class="bar-chart-bar-${elementId}" style="
                    background: linear-gradient(180deg, ${item.color || '#1976d2'} 0%, ${item.color ? item.color + 'DD' : '#1976d2DD'} 100%);
                    border-radius: 0;
                    width: ${autoWidth}px;
                    height: ${barHeight}px;
                    min-height: 40px;
                    cursor: pointer;
                    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
                    border: 1px solid rgba(0,0,0,0.2);
                    border-bottom: 2px solid rgba(0,0,0,0.3);
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    --bar-height: ${barHeight}px;
                    --bar-index: ${index};
                  " onmouseover="this.style.opacity='0.9'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'; this.style.filter='brightness(1.1)';" onmouseout="this.style.opacity='1'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'; this.style.filter='brightness(1)';">
                    <!-- Значение на столбце -->
                    ${showValues ? `
                      <div style="
                        color: #ffffff;
                        font-size: 14px;
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                        z-index: 10;
                      ">${item.value}</div>
                    ` : ''}
                  </div>
                  
                  <!-- Подпись -->
                  <div style="
                    color: ${item.color || '#1976d2'};
                    font-size: 12px;
                    font-weight: 500;
                    text-align: center;
                    word-wrap: break-word;
                    max-width: ${autoWidth + 20}px;
                    line-height: 1.2;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  ">${item.name || item.label || 'Данные'}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

    case 'chartjs-bar':
    case 'chartjs-doughnut':
      const chartJSData = elementData.datasets || [
        { label: 'Набор данных 1', data: [10, 20, 30, 40, 50], backgroundColor: '#1976d2' }
      ];
      const chartJSLabels = elementData.labels || ['Янв', 'Фев', 'Мар', 'Апр', 'Май'];
      
      return `
        <div id="${elementId}" class="content-element ${element.type}" style="
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: ${elementData.backgroundColor || '#ffffff'};
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          ${elementData.title ? `
            <h3 style="
              text-align: center;
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 2rem;
            ">${elementData.title}</h3>
          ` : ''}
          <canvas id="chart-${elementId}" style="max-height: ${elementData.height || 400}px;"></canvas>
          <script>
            // Chart.js инициализация
            if (typeof Chart !== 'undefined') {
              const ctx = document.getElementById('chart-${elementId}');
              if (ctx) {
                new Chart(ctx, {
                  type: '${element.type === 'chartjs-bar' ? 'bar' : 'doughnut'}',
                  data: {
                    labels: ${JSON.stringify(chartJSLabels)},
                    datasets: ${JSON.stringify(chartJSData)}
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false
                  }
                });
              }
            }
          </script>
        </div>
      `;

    case 'apexcharts-line':
      const apexData = elementData.series || [
        { name: 'Серия 1', data: [10, 20, 30, 40, 50] }
      ];
      const apexCategories = elementData.categories || ['Янв', 'Фев', 'Мар', 'Апр', 'Май'];
      
      return `
        <div id="${elementId}" class="content-element apexcharts-line" style="
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem;
          background: ${elementData.backgroundColor || '#ffffff'};
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          ${elementData.title ? `
            <h3 style="
              text-align: center;
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 24}px;
              margin-bottom: 2rem;
            ">${elementData.title}</h3>
          ` : ''}
          <div id="apex-${elementId}" style="height: ${elementData.height || 400}px;"></div>
          <script>
            // ApexCharts инициализация
            if (typeof ApexCharts !== 'undefined') {
              const options = {
                chart: {
                  type: 'line',
                  height: ${elementData.height || 400}
                },
                series: ${JSON.stringify(apexData)},
                xaxis: {
                  categories: ${JSON.stringify(apexCategories)}
                }
              };
              const chart = new ApexCharts(document.querySelector('#apex-${elementId}'), options);
              chart.render();
            }
          </script>
        </div>
      `;

    case 'advanced-contact-form':
      const formFields = elementData.fields || [
        { type: 'text', name: 'name', label: 'Имя', required: true },
        { type: 'email', name: 'email', label: 'Email', required: true },
        { type: 'textarea', name: 'message', label: 'Сообщение', required: true }
      ];
      
      return `
        <div id="${elementId}" class="content-element advanced-contact-form" style="
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: ${elementData.backgroundColor || '#ffffff'};
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          ${elementData.title ? `
            <h3 style="
              text-align: center;
              color: ${elementData.titleColor || '#333333'};
              font-size: ${elementData.titleFontSize || 28}px;
              margin-bottom: 2rem;
            ">${elementData.title}</h3>
          ` : ''}
          <form action="${elementData.action || '/submit'}" method="POST" style="
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          ">
            ${formFields.map(field => `
              <div>
                <label style="
                  display: block;
                  color: ${elementData.labelColor || '#333333'};
                  font-weight: 500;
                  margin-bottom: 0.5rem;
                ">${field.label}${field.required ? ' *' : ''}</label>
                ${field.type === 'textarea' ? `
                  <textarea
                    name="${field.name}"
                    ${field.required ? 'required' : ''}
                    rows="4"
                    style="
                      width: 100%;
                      padding: 12px;
                      border: 1px solid ${elementData.borderColor || '#ddd'};
                      border-radius: 6px;
                      font-family: inherit;
                      font-size: 14px;
                      resize: vertical;
                    "
                    placeholder="${field.placeholder || ''}"></textarea>
                ` : `
                  <input
                    type="${field.type}"
                    name="${field.name}"
                    ${field.required ? 'required' : ''}
                    style="
                      width: 100%;
                      padding: 12px;
                      border: 1px solid ${elementData.borderColor || '#ddd'};
                      border-radius: 6px;
                      font-family: inherit;
                      font-size: 14px;
                    "
                    placeholder="${field.placeholder || ''}"
                  >
                `}
              </div>
            `).join('')}
            <button type="submit" style="
              padding: 14px 28px;
              background: ${elementData.buttonBgColor || '#1976d2'};
              color: ${elementData.buttonTextColor || '#ffffff'};
              border: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.3s;
            " onmouseover="this.style.backgroundColor='${elementData.buttonHoverColor || '#1565c0'}'" 
               onmouseout="this.style.backgroundColor='${elementData.buttonBgColor || '#1976d2'}'"
            >${elementData.buttonText || 'Отправить'}</button>
          </form>
        </div>
      `;

    case 'cta-section':
      return `
        <div id="${elementId}" class="content-element cta-section" style="
          text-align: center;
          padding: 4rem 2rem;
          margin: 2rem 0;
          background: ${elementData.useGradient ? 
            `linear-gradient(${elementData.gradientDirection || 'to right'}, ${elementData.gradientColor1 || '#1976d2'}, ${elementData.gradientColor2 || '#1565c0'})` : 
            (elementData.backgroundColor || '#1976d2')
          };
          color: ${elementData.textColor || '#ffffff'};
          border-radius: ${elementData.borderRadius || 12}px;
        ">
          ${elementData.title ? `
            <h2 style="
              font-size: ${elementData.titleFontSize || 48}px;
              font-weight: ${elementData.titleFontWeight || 'bold'};
              margin-bottom: 1rem;
              color: inherit;
            ">${elementData.title}</h2>
          ` : ''}
          ${elementData.subtitle ? `
            <p style="
              font-size: ${elementData.subtitleFontSize || 20}px;
              margin-bottom: 2rem;
              opacity: 0.9;
              max-width: 600px;
              margin-left: auto;
              margin-right: auto;
            ">${elementData.subtitle}</p>
          ` : ''}
          <div style="
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          ">
            ${elementData.primaryButton ? `
              <a href="${elementData.primaryButton.url || '#'}" style="
                display: inline-block;
                padding: 16px 32px;
                background: ${elementData.primaryButton.bgColor || '#ffffff'};
                color: ${elementData.primaryButton.textColor || '#1976d2'};
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 18px;
                transition: all 0.3s;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" 
                 onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'"
              >${elementData.primaryButton.text || 'Главная кнопка'}</a>
            ` : ''}
            ${elementData.secondaryButton ? `
              <a href="${elementData.secondaryButton.url || '#'}" style="
                display: inline-block;
                padding: 16px 32px;
                background: transparent;
                color: ${elementData.secondaryButton.textColor || '#ffffff'};
                text-decoration: none;
                border: 2px solid ${elementData.secondaryButton.borderColor || '#ffffff'};
                border-radius: 8px;
                font-weight: 600;
                font-size: 18px;
                transition: all 0.3s;
              " onmouseover="this.style.backgroundColor='${elementData.secondaryButton.hoverBgColor || 'rgba(255,255,255,0.1)'}'" 
                 onmouseout="this.style.backgroundColor='transparent'"
              >${elementData.secondaryButton.text || 'Вторая кнопка'}</a>
            ` : ''}
          </div>
        </div>
      `;

    case 'advanced-line-chart':
      // Получаем данные для линейного графика
      const chartLineData = element.data || elementData.data || [
        { name: 'Янв', value: 400, value2: 240 },
        { name: 'Фев', value: 300, value2: 456 },
        { name: 'Мар', value: 300, value2: 139 },
        { name: 'Апр', value: 200, value2: 980 },
        { name: 'Май', value: 278, value2: 390 },
        { name: 'Июн', value: 189, value2: 480 }
      ];
      
      // Получаем настройки цветов
      const chartLineColorSettings = element.colorSettings || elementData.colorSettings || {};
      const chartLineStyles = element.customStyles || elementData.customStyles || {};
      
      // Получаем цвета из новой системы colorSettings с fallback на старые
      const chartLineBackgroundColor = chartLineColorSettings.sectionBackground?.enabled 
        ? (chartLineColorSettings.sectionBackground.useGradient 
            ? `linear-gradient(${chartLineColorSettings.sectionBackground.gradientDirection}, ${chartLineColorSettings.sectionBackground.gradientColor1}, ${chartLineColorSettings.sectionBackground.gradientColor2})`
            : chartLineColorSettings.sectionBackground.solidColor)
        : (chartLineStyles.backgroundColor || 'rgba(0, 0, 0, 0.8)');
      const chartLineTextColor = chartLineColorSettings.textFields?.axis || chartLineStyles.textColor || '#ffffff';
      const chartLineTitleColor = chartLineColorSettings.textFields?.title || chartLineStyles.titleColor || '#ffffff';
      
      // Извлекаем настройки линий
      const chartStrokeColor = element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.strokeColor || elementData.lineColors?.[0] || '#8884d8';
      const chartFillColor = elementData.fillColor || 'rgba(136, 132, 216, 0.3)';
      const chartGridColor = chartLineColorSettings.textFields?.grid || element.data?.gridColor || element.gridColor || elementData.gridColor || 'rgba(255,255,255,0.1)';
      
      // Получаем дополнительные настройки стилей
      const chartLineBorderColor = chartLineColorSettings.borderColor || element.data?.borderColor || element.borderColor || elementData.borderColor || '#e0e0e0';
      const chartLineBorderWidth = chartLineColorSettings.borderWidth || element.data?.borderWidth || element.borderWidth || elementData.borderWidth || 1;
      const chartLineBorderRadius = chartLineColorSettings.borderRadius || element.data?.borderRadius || element.borderRadius || elementData.borderRadius || 8;
      const chartLinePadding = chartLineColorSettings.padding || element.data?.padding || element.padding || elementData.padding || 24;
      const chartLineBoxShadow = chartLineColorSettings.boxShadow || element.data?.boxShadow || element.boxShadow || elementData.boxShadow || false;
      
      const maxChartLineValue = Math.max(...chartLineData.map(d => d.value));
      const minChartLineValue = Math.min(...chartLineData.map(d => d.value));
      const chartLineRange = maxChartLineValue - minChartLineValue;
      
              return `
          <div id="${elementId}" class="content-element chart-component" style="
            margin: 2rem 0;
            padding: ${chartLinePadding}px;
            background: ${chartLineBackgroundColor};
            border-radius: ${chartLineBorderRadius}px;
            box-shadow: ${chartLineBoxShadow ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'};
            max-width: ${element.data?.maxWidth || element.maxWidth || elementData.maxWidth || '100%'};
            width: ${element.data?.chartWidth || element.chartWidth || elementData.chartWidth || '100%'};
            margin-left: auto;
            margin-right: auto;
            position: relative;
            ${chartLineBorderWidth ? `border: ${chartLineBorderWidth}px solid ${chartLineBorderColor};` : ''}
          ">
            <h3 style="
              margin-bottom: ${element.data?.description || element.description || elementData.description ? '1rem' : '2rem'};
              color: ${chartLineTitleColor};
              font-size: 1.25rem;
              font-weight: bold;
              text-align: center;
              font-family: 'Montserrat', sans-serif;
            ">${element.data?.title || element.title || elementData.title || 'Линейный график'}</h3>
            
            ${element.data?.description || element.description || elementData.description ? `
              <p style="
                margin-bottom: 2rem;
                color: ${chartLineColorSettings.textFields?.legend || chartLineStyles.legendColor || '#333333'};
                font-size: 0.9rem;
                line-height: 1.5;
                text-align: center;
                max-width: 800px;
                margin-left: auto;
                margin-right: auto;
                font-family: 'Montserrat', sans-serif;
              ">${element.data?.description || element.description || elementData.description}</p>
            ` : ''}
          
          <div style="
            position: relative;
            height: 450px;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.1);
          ">
            <svg width="100%" height="100%" viewBox="0 0 800 400" style="overflow: visible;">
                          <!-- Сетка -->
            <defs>
              <pattern id="grid-${elementId}" width="80" height="70" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 70" fill="none" stroke="${chartGridColor}" stroke-width="1" opacity="0.3"/>
              </pattern>
            </defs>
              <rect width="100%" height="100%" fill="url(#grid-${elementId})" />
              
              <!-- Область под линией -->
              <defs>
                <linearGradient id="areaGradient-${elementId}" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:${chartFillColor};stop-opacity:0.8" />
                  <stop offset="100%" style="stop-color:${chartFillColor};stop-opacity:0.1" />
                </linearGradient>
              </defs>
              
              ${(() => {
                // Получаем цвета линий
                const lineColors = [
                  chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8',
                  chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'
                ];
                const lineNames = element.data?.lineNames || element.lineNames || elementData.lineNames || ['Линия 1', 'Линия 2'];
                
                // Вычисляем общий диапазон для всех значений (начиная от 0)
                const allValues = [];
                chartLineData.forEach(item => {
                  if (typeof item.value === 'number') allValues.push(item.value);
                  if (typeof item.value2 === 'number') allValues.push(item.value2);
                });
                const globalMin = 0; // Всегда начинаем от 0
                const globalMax = Math.max(...allValues);
                const globalRange = globalMax - globalMin;
                
                // Создаем точки для первой линии
                const points1 = chartLineData.map((item, index) => {
                  const x = 80 + (index * (640 / (chartLineData.length - 1)));
                  const normalizedValue = globalRange === 0 ? 0.5 : (item.value - globalMin) / globalRange;
                  const y = 280 - (normalizedValue * 240);
                  return { x, y, value: item.value, name: item.name };
                });
                
                // Создаем точки для второй линии (если есть value2)
                const hasSecondLine = chartLineData.some(item => typeof item.value2 === 'number');
                const points2 = hasSecondLine ? chartLineData.map((item, index) => {
                  const x = 80 + (index * (640 / (chartLineData.length - 1)));
                  const normalizedValue = globalRange === 0 ? 0.5 : ((item.value2 || 0) - globalMin) / globalRange;
                  const y = 280 - (normalizedValue * 240);
                  return { x, y, value: item.value2 || 0, name: item.name };
                }) : [];
                
                // Создаем пути для линий
                const pathData1 = points1.map((point, index) => 
                  index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                ).join(' ');
                
                const pathData2 = hasSecondLine ? points2.map((point, index) => 
                  index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
                ).join(' ') : '';
                
                // Создаем область заливки для первой линии
                const areaPath = `M 80 280 L ${points1.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points1[points1.length - 1].x} 280 Z`;
                
                // Генерируем шкалу Y
                const yAxisSteps = 5;
                const yAxisLabels = [];
                for (let i = 0; i <= yAxisSteps; i++) {
                  const value = globalMin + (globalRange * i / yAxisSteps);
                  const y = 280 - (i * 240 / yAxisSteps);
                  yAxisLabels.push({ y, value: Math.round(value) });
                }
                
                return `
                  <!-- Ось Y -->
                  <line x1="50" y1="40" x2="50" y2="280" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.5"/>
                  
                  <!-- Шкала Y -->
                  ${yAxisLabels.map(label => `
                    <line x1="45" y1="${label.y}" x2="55" y2="${label.y}" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.5"/>
                    <text x="40" y="${label.y + 4}" text-anchor="end" fill="${chartLineTextColor}" font-size="10" font-family="Montserrat">
                      ${label.value}
                    </text>
                  `).join('')}
                  
                  <!-- Горизонтальные линии сетки -->
                  ${yAxisLabels.map(label => `
                    <line x1="80" y1="${label.y}" x2="750" y2="${label.y}" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.1" stroke-dasharray="3,3"/>
                  `).join('')}
                  
                  <!-- Ось X -->
                  <line x1="50" y1="280" x2="750" y2="280" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.5"/>
                  
                  <!-- Вертикальные линии сетки для месяцев -->
                  ${points1.map(point => `
                    <line x1="${point.x}" y1="40" x2="${point.x}" y2="280" stroke="${chartLineTextColor}" stroke-width="1" opacity="0.1" stroke-dasharray="3,3"/>
                  `).join('')}
                  
                  <!-- Область заливки для первой линии -->
                  <path d="${areaPath}" fill="url(#areaGradient-${elementId})" />
                  
                  <!-- Первая линия -->
                  <path d="${pathData1}" fill="none" stroke="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                  
                                       <!-- Точки первой линии -->
                     ${points1.map((point, index) => {
                       const secondLinePoint = points2[index];
                       const secondLineValue = secondLinePoint ? secondLinePoint.value : null;
                       const tooltipText = secondLineValue 
                         ? `${point.name}\n${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}: ${point.value}\n${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}: ${secondLineValue}`
                         : `${point.name}\n${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}: ${point.value}`;
                       
                       return `
                         <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}" stroke="white" stroke-width="2" />
                         <circle cx="${point.x}" cy="${point.y}" r="8" fill="transparent" stroke="transparent" stroke-width="6" class="chart-point-1" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${secondLineValue || ''}">
                         </circle>
                         <!-- Невидимая область для лучшего взаимодействия с tooltip -->
                         <rect x="${point.x - 15}" y="${point.y - 15}" width="30" height="30" fill="transparent" class="chart-point-1" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${secondLineValue || ''}">
                         </rect>
                       `;
                     }).join('')}
                  
                                      ${hasSecondLine ? `
                      <!-- Вторая линия -->
                      <path d="${pathData2}" fill="none" stroke="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                      
                      <!-- Точки второй линии -->
                      ${points2.map((point, index) => {
                        const firstLinePoint = points1[index];
                        const firstLineValue = firstLinePoint ? firstLinePoint.value : null;
                        const tooltipText = firstLineValue 
                          ? `${point.name}\n${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}: ${firstLineValue}\n${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}: ${point.value}`
                          : `${point.name}\n${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}: ${point.value}`;
                        
                        return `
                          <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'}" stroke="white" stroke-width="2" />
                          <circle cx="${point.x}" cy="${point.y}" r="8" fill="transparent" stroke="transparent" stroke-width="6" class="chart-point-2" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${firstLineValue || ''}">
                          </circle>
                          <!-- Невидимая область для лучшего взаимодействия с tooltip -->
                          <rect x="${point.x - 15}" y="${point.y - 15}" width="30" height="30" fill="transparent" class="chart-point-2" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${firstLineValue || ''}">
                          </rect>
                        `;
                      }).join('')}
                    ` : ''}
                  
                  <!-- Подписи оси X -->
                  ${points1.map((point, index) => `
                    <text x="${point.x}" y="300" text-anchor="middle" fill="${chartLineTextColor}" font-size="12" font-family="Montserrat">
                      ${point.name}
                    </text>
                  `).join('')}
                  
                  <!-- Легенда внизу (вертикально) -->
                  <g transform="translate(80, 320)">
                    <!-- Первая линия -->
                    <rect x="0" y="0" width="15" height="3" fill="${chartLineColorSettings.lineColors?.line1 || element.data?.lineColors?.[0] || element.lineColors?.[0] || elementData.lineColors?.[0] || '#8884d8'}"/>
                    <text x="20" y="8" fill="${chartLineTextColor}" font-size="12" font-family="Montserrat">${element.data?.lineNames?.[0] || element.lineNames?.[0] || elementData.lineNames?.[0] || 'Линия 1'}</text>
                    ${hasSecondLine ? `
                      <!-- Вторая линия (под первой) -->
                      <rect x="0" y="20" width="15" height="3" fill="${chartLineColorSettings.lineColors?.line2 || element.data?.lineColors?.[1] || element.lineColors?.[1] || elementData.lineColors?.[1] || '#82ca9d'}"/>
                      <text x="20" y="28" fill="${chartLineTextColor}" font-size="12" font-family="Montserrat">${element.data?.lineNames?.[1] || element.lineNames?.[1] || elementData.lineNames?.[1] || 'Линия 2'}</text>
                    ` : ''}
                  </g>
                `;
              })()}
            </svg>
          </div>
        </div>
      `;

    case 'advanced-area-chart':
      // Получаем данные для диаграммы с областями
      const chartAreaData = element.data || elementData.data || [
        { name: 'Янв', value: 400, value2: 240 },
        { name: 'Фев', value: 300, value2: 456 },
        { name: 'Мар', value: 300, value2: 139 },
        { name: 'Апр', value: 200, value2: 980 },
        { name: 'Май', value: 278, value2: 390 },
        { name: 'Июн', value: 189, value2: 480 }
      ];
      
      // Получаем настройки цветов
      const chartAreaColorSettings = element.colorSettings || elementData.colorSettings || {};
      const chartAreaStyles = element.customStyles || elementData.customStyles || {};
      
      // Отладочная информация
      console.log('🔍 [EXPORT] advanced-area-chart colorSettings:', chartAreaColorSettings);
      console.log('🔍 [EXPORT] advanced-area-chart element.colorSettings:', element.colorSettings);
      console.log('🔍 [EXPORT] advanced-area-chart elementData.colorSettings:', elementData.colorSettings);
      console.log('🔍 [EXPORT] advanced-area-chart element:', element);
      console.log('🔍 [EXPORT] advanced-area-chart elementData:', elementData);
      
      // Получаем цвета из новой системы colorSettings с fallback на старые
      const chartAreaBackgroundColor = chartAreaColorSettings.sectionBackground?.enabled 
        ? (chartAreaColorSettings.sectionBackground.useGradient 
            ? `linear-gradient(${chartAreaColorSettings.sectionBackground.gradientDirection}, ${chartAreaColorSettings.sectionBackground.gradientColor1}, ${chartAreaColorSettings.sectionBackground.gradientColor2})`
            : chartAreaColorSettings.sectionBackground.solidColor)
        : (chartAreaStyles.backgroundColor || 'rgba(0, 0, 0, 0.8)');
      const chartAreaTextColor = chartAreaColorSettings.textFields?.axis || chartAreaStyles.textColor || '#ffffff';
      const chartAreaTitleColor = chartAreaColorSettings.textFields?.title || chartAreaStyles.titleColor || '#ffffff';
      
      // Извлекаем настройки областей
      const chartAreaColor1 = chartAreaColorSettings.areaColors?.area1 || element.data?.areaColors?.[0] || element.areaColors?.[0] || elementData.areaColors?.[0] || '#8884d8';
      const chartAreaColor2 = chartAreaColorSettings.areaColors?.area2 || element.data?.areaColors?.[1] || element.areaColors?.[1] || elementData.areaColors?.[1] || '#82ca9d';
      
      // Отладочная информация для цветов областей
      console.log('🔍 [EXPORT] advanced-area-chart chartAreaColor1:', chartAreaColor1, 'from:', {
        'colorSettings.areaColors.area1': chartAreaColorSettings.areaColors?.area1,
        'element.data.areaColors[0]': element.data?.areaColors?.[0],
        'element.areaColors[0]': element.areaColors?.[0],
        'elementData.areaColors[0]': elementData.areaColors?.[0]
      });
      console.log('🔍 [EXPORT] advanced-area-chart chartAreaColor2:', chartAreaColor2, 'from:', {
        'colorSettings.areaColors.area2': chartAreaColorSettings.areaColors?.area2,
        'element.data.areaColors[1]': element.data?.areaColors?.[1],
        'element.areaColors[1]': element.areaColors?.[1],
        'elementData.areaColors[1]': elementData.areaColors?.[1]
      });
      const chartAreaGridColor = chartAreaColorSettings.textFields?.grid || element.data?.gridColor || element.gridColor || elementData.gridColor || 'rgba(255,255,255,0.1)';
      const chartLegendColor = chartAreaColorSettings.textFields?.legend || chartAreaStyles.legendColor || '#333333';
      
      // Получаем дополнительные настройки стилей
      const chartAreaBorderColor = chartAreaColorSettings.borderColor || element.data?.borderColor || element.borderColor || elementData.borderColor || '#e0e0e0';
      const chartAreaBorderWidth = chartAreaColorSettings.borderWidth || element.data?.borderWidth || element.borderWidth || elementData.borderWidth || 1;
      const chartAreaBorderRadius = chartAreaColorSettings.borderRadius || element.data?.borderRadius || element.borderRadius || elementData.borderRadius || 8;
      const chartAreaPadding = chartAreaColorSettings.padding || element.data?.padding || element.padding || elementData.padding || 24;
      const chartAreaBoxShadow = chartAreaColorSettings.boxShadow || element.data?.boxShadow || element.boxShadow || elementData.boxShadow || false;
      
      const maxChartAreaValue = Math.max(...chartAreaData.map(d => Math.max(d.value || 0, d.value2 || 0)));
      const minChartAreaValue = 0; // Для областей всегда начинаем от 0
      const chartAreaRange = maxChartAreaValue - minChartAreaValue;
      
      return `
        <div id="${elementId}" class="content-element chart-component" style="
          margin: 2rem 0;
          padding: ${chartAreaPadding}px;
          background: ${chartAreaBackgroundColor};
          border-radius: ${chartAreaBorderRadius}px;
          box-shadow: ${chartAreaBoxShadow ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'};
          max-width: ${element.data?.maxWidth || element.maxWidth || elementData.maxWidth || '100%'};
          width: ${element.data?.chartWidth || element.chartWidth || elementData.chartWidth || '100%'};
          margin-left: auto;
          margin-right: auto;
          position: relative;
          ${chartAreaBorderWidth ? `border: ${chartAreaBorderWidth}px solid ${chartAreaBorderColor};` : ''}
        ">
          <h3 style="
            margin-bottom: ${element.data?.description || element.description || elementData.description ? '1rem' : '2rem'};
            color: ${chartAreaTitleColor};
            font-size: 1.25rem;
            font-weight: bold;
            text-align: center;
            font-family: 'Montserrat', sans-serif;
          ">${element.data?.title || element.title || elementData.title || 'Диаграмма с областями'}</h3>
          
          ${element.data?.description || element.description || elementData.description ? `
            <p style="
              margin-bottom: 2rem;
              color: ${chartLegendColor};
              font-size: 0.9rem;
              line-height: 1.5;
              text-align: center;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
              font-family: 'Montserrat', sans-serif;
            ">${element.data?.description || element.description || elementData.description}</p>
          ` : ''}
        
        <div style="
          position: relative;
          height: 450px;
          padding: 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
        ">
          <svg width="100%" height="100%" viewBox="0 0 800 400" style="overflow: visible;">
            <!-- Сетка -->
            <defs>
              <pattern id="grid-${elementId}" width="80" height="70" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 70" fill="none" stroke="${chartAreaGridColor}" stroke-width="1" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-${elementId})" />
            
            <!-- Градиенты для областей -->
            <defs>
              <linearGradient id="areaGradient1-${elementId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${chartAreaColor1};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${chartAreaColor1};stop-opacity:0.1" />
              </linearGradient>
              <linearGradient id="areaGradient2-${elementId}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:${chartAreaColor2};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${chartAreaColor2};stop-opacity:0.1" />
              </linearGradient>
            </defs>
            
                          ${(() => {
                // Получаем названия областей
                const areaNames = element.data?.areaNames || element.areaNames || elementData.areaNames || ['Область 1', 'Область 2'];
                
                // Отладочная информация для названий областей
                console.log('🔍 [EXPORT] advanced-area-chart areaNames:', areaNames, 'from:', {
                  'element.data.areaNames': element.data?.areaNames,
                  'element.areaNames': element.areaNames,
                  'elementData.areaNames': elementData.areaNames
                });
              const stacked = element.data?.stacked !== undefined ? element.data.stacked : (element.stacked !== undefined ? element.stacked : elementData.stacked !== undefined ? elementData.stacked : true);
              
              // Вычисляем общий диапазон для всех значений (начиная от 0)
              const allValues = [];
              chartAreaData.forEach(item => {
                if (typeof item.value === 'number') allValues.push(item.value);
                if (typeof item.value2 === 'number') allValues.push(item.value2);
              });
              const globalMin = 0; // Всегда начинаем от 0
              const globalMax = Math.max(...allValues);
              const globalRange = globalMax - globalMin;
              
              // Создаем точки для первой области
              const points1 = chartAreaData.map((item, index) => {
                const x = 80 + (index * (640 / (chartAreaData.length - 1)));
                const normalizedValue = globalRange === 0 ? 0.5 : (item.value - globalMin) / globalRange;
                const y = 280 - (normalizedValue * 240);
                return { x, y, value: item.value, name: item.name };
              });
              
              // Создаем точки для второй области (если есть value2)
              const hasSecondArea = chartAreaData.some(item => typeof item.value2 === 'number');
              const points2 = hasSecondArea ? chartAreaData.map((item, index) => {
                const x = 80 + (index * (chartAreaData.length - 1));
                const normalizedValue = globalRange === 0 ? 0.5 : ((item.value2 || 0) - globalMin) / globalRange;
                const y = 280 - (normalizedValue * 240);
                return { x, y, value: item.value2 || 0, name: item.name };
              }) : [];
              
              // Создаем пути для областей
              const areaPath1 = `M 80 280 L ${points1.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points1[points1.length - 1].x} 280 Z`;
              
              let areaPath2 = '';
              if (hasSecondArea && stacked) {
                // Для наложенных областей вторая область рисуется поверх первой
                areaPath2 = `M 80 280 L ${points2.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points2[points2.length - 1].x} 280 Z`;
              } else if (hasSecondArea && !stacked) {
                // Для раздельных областей вторая область рисуется отдельно
                areaPath2 = `M 80 280 L ${points2.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points2[points2.length - 1].x} 280 Z`;
              }
              
              // Генерируем шкалу Y
              const yAxisSteps = 5;
              const yAxisLabels = [];
              for (let i = 0; i <= yAxisSteps; i++) {
                const value = globalMin + (globalRange * i / yAxisSteps);
                const y = 280 - (i * 240 / yAxisSteps);
                yAxisLabels.push({ y, value: Math.round(value) });
              }
              
              return `
                <!-- Ось Y -->
                <line x1="50" y1="40" x2="50" y2="280" stroke="${chartAreaTextColor}" stroke-width="1" opacity="0.5"/>
                
                <!-- Шкала Y -->
                ${yAxisLabels.map(label => `
                  <line x1="45" y1="${label.y}" x2="55" y2="${label.y}" stroke="${chartAreaTextColor}" stroke-width="1" opacity="0.5"/>
                  <text x="40" y="${label.y + 4}" text-anchor="end" fill="${chartAreaTextColor}" font-size="10" font-family="Montserrat">
                    ${label.value}
                  </text>
                `).join('')}
                
                <!-- Горизонтальные линии сетки -->
                ${yAxisLabels.map(label => `
                  <line x1="80" y1="${label.y}" x2="750" y2="${label.y}" stroke="${chartAreaTextColor}" stroke-width="1" opacity="0.1" stroke-dasharray="3,3"/>
                `).join('')}
                
                <!-- Ось X -->
                <line x1="50" y1="280" x2="750" y2="280" stroke="${chartAreaTextColor}" stroke-width="1" opacity="0.5"/>
                
                <!-- Вертикальные линии сетки для месяцев -->
                ${points1.map(point => `
                  <line x1="${point.x}" y1="40" x2="${point.x}" y2="280" stroke="${chartAreaTextColor}" stroke-width="1" opacity="0.1" stroke-dasharray="3,3"/>
                `).join('')}
                
                <!-- Первая область -->
                <path d="${areaPath1}" fill="url(#areaGradient1-${elementId})" />
                <path d="${areaPath1}" fill="none" stroke="${chartAreaColor1}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                
                ${hasSecondArea ? `
                  <!-- Вторая область -->
                  <path d="${areaPath2}" fill="url(#areaGradient2-${elementId})" />
                  <path d="${areaPath2}" fill="none" stroke="${chartAreaColor2}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                ` : ''}
                
                <!-- Точки первой области -->
                ${points1.map((point, index) => {
                  const secondAreaPoint = points2[index];
                  const secondAreaValue = secondAreaPoint ? secondAreaPoint.value : null;
                  const tooltipText = secondAreaValue 
                    ? `${point.name}\n${areaNames[0]}: ${point.value}\n${areaNames[1]}: ${secondAreaValue}`
                    : `${point.name}\n${areaNames[0]}: ${point.value}`;
                  
                  return `
                    <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chartAreaColor1}" stroke="white" stroke-width="2" />
                    <circle cx="${point.x}" cy="${point.y}" r="8" fill="transparent" stroke="transparent" stroke-width="6" class="chart-point-1" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${secondAreaValue || ''}">
                    </circle>
                    <!-- Невидимая область для лучшего взаимодействия с tooltip -->
                    <rect x="${point.x - 15}" y="${point.y - 15}" width="30" height="30" fill="transparent" class="chart-point-1" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${secondAreaValue || ''}">
                    </rect>
                  `;
                }).join('')}
                
                ${hasSecondArea ? `
                  <!-- Точки второй области -->
                  ${points2.map((point, index) => {
                    const firstAreaPoint = points1[index];
                    const firstAreaValue = firstAreaPoint ? firstAreaPoint.value : null;
                    const tooltipText = firstAreaValue 
                      ? `${point.name}\n${areaNames[0]}: ${firstAreaValue}\n${areaNames[1]}: ${point.value}`
                      : `${point.name}\n${areaNames[1]}: ${point.value}`;
                    
                    return `
                      <circle cx="${point.x}" cy="${point.y}" r="4" fill="${chartAreaColor2}" stroke="white" stroke-width="2" />
                      <circle cx="${point.x}" cy="${point.y}" r="8" fill="transparent" stroke="transparent" stroke-width="6" class="chart-point-2" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${firstAreaValue || ''}">
                      </circle>
                      <!-- Невидимая область для лучшего взаимодействия с tooltip -->
                      <rect x="${point.x - 15}" y="${point.y - 15}" width="30" height="30" fill="transparent" class="chart-point-2" data-index="${index}" data-name="${point.name}" data-value="${point.value}" data-value2="${firstAreaValue || ''}">
                      </rect>
                    `;
                  }).join('')}
                ` : ''}
                
                <!-- Подписи оси X -->
                ${points1.map((point, index) => `
                  <text x="${point.x}" y="300" text-anchor="middle" fill="${chartAreaTextColor}" font-size="12" font-family="Montserrat">
                    ${point.name}
                  </text>
                `).join('')}
                
                <!-- Легенда внизу -->
                <g transform="translate(80, 320)">
                  <!-- Первая область -->
                  <rect x="0" y="0" width="15" height="15" fill="url(#areaGradient1-${elementId})" stroke="${chartAreaColor1}" stroke-width="1"/>
                  <text x="20" y="12" fill="${chartAreaColor1}" font-size="12" font-family="Montserrat" font-weight="500" style="color: ${chartAreaColor1} !important;">${areaNames[0]}</text>
                  ${hasSecondArea ? `
                    <!-- Вторая область -->
                    <rect x="0" y="25" width="15" height="15" fill="url(#areaGradient2-${elementId})" stroke="${chartAreaColor2}" stroke-width="1"/>
                    <text x="20" y="37" fill="${chartAreaColor2}" font-size="12" font-family="Montserrat" font-weight="500" style="color: ${chartAreaColor2} !important;">${areaNames[1]}</text>
                  ` : ''}
                </g>
              `;
            })()}
          </svg>
        </div>
      </div>
    `;

    case 'advanced-pie-chart':
      // Получаем данные для круговой диаграммы
      const chartPieData = element.data || elementData.data || [
        { name: 'Группа A', value: 400 },
        { name: 'Группа B', value: 300 },
        { name: 'Группа C', value: 300 },
        { name: 'Группа D', value: 200 }
      ];
      
      // Получаем настройки цветов
      const chartPieColorSettings = element.colorSettings || elementData.colorSettings || {};
      const chartPieStyles = element.customStyles || elementData.customStyles || {};
      
      // Получаем цвета из новой системы colorSettings с fallback на старые
      const chartPieBackgroundColor = chartPieColorSettings.sectionBackground?.enabled 
        ? (chartPieColorSettings.sectionBackground.useGradient 
            ? `linear-gradient(${chartPieColorSettings.sectionBackground.gradientDirection}, ${chartPieColorSettings.sectionBackground.gradientColor1}, ${chartPieColorSettings.sectionBackground.gradientColor2})`
            : chartPieColorSettings.sectionBackground.solidColor)
        : (chartPieStyles.backgroundColor || 'rgba(0, 0, 0, 0.8)');
      const chartPieTextColor = chartPieColorSettings.textFields?.axis || chartPieStyles.textColor || '#ffffff';
      const chartPieTitleColor = chartPieColorSettings.textFields?.title || chartPieStyles.titleColor || '#ffffff';
      const chartPieLegendColor = chartPieColorSettings.textFields?.legend || chartPieStyles.legendColor || '#333333';
      
      // Извлекаем цвета сегментов
      const segmentColors = chartPieColorSettings.segmentColors || {};
      const defaultColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];
      
      // Вычисляем общую сумму значений
      const totalValue = chartPieData.reduce((sum, item) => sum + (item.value || 0), 0);
      
      return `
        <div id="${elementId}" class="content-element chart-component" style="
          margin: 2rem 0;
          padding: ${chartPieStyles.padding || 24}px;
          background: ${chartPieBackgroundColor};
          border-radius: ${chartPieColorSettings.borderRadius || 8}px;
          box-shadow: ${chartPieColorSettings.boxShadow ? '0 4px 20px rgba(0,0,0,0.15)' : 'none'};
          max-width: ${element.data?.maxWidth || element.maxWidth || elementData.maxWidth || '100%'};
          width: ${element.data?.chartWidth || element.chartWidth || elementData.chartWidth || '100%'};
          margin-left: auto;
          margin-right: auto;
          position: relative;
          ${chartPieColorSettings.borderWidth ? `border: ${chartPieColorSettings.borderWidth}px solid ${chartPieColorSettings.borderColor || 'transparent'};` : ''}
        ">
          <h3 style="
            margin-bottom: ${element.data?.description || element.description || elementData.description ? '1rem' : '2rem'};
            color: ${chartPieTitleColor};
            font-size: 1.25rem;
            font-weight: bold;
            text-align: center;
            font-family: 'Montserrat', sans-serif;
          ">${element.data?.title || element.title || elementData.title || 'Круговая диаграмма'}</h3>
          
          ${element.data?.description || element.description || elementData.description ? `
            <p style="
              margin-bottom: 2rem;
              color: ${chartPieLegendColor};
              font-size: 0.9rem;
              line-height: 1.5;
              text-align: center;
              max-width: 800px;
              margin-left: auto;
              margin-right: auto;
              font-family: 'Montserrat', sans-serif;
            ">${element.data?.description || element.description || elementData.description}</p>
          ` : ''}
        
        <div style="
          position: relative;
          height: 450px;
          padding: 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="400" height="400" viewBox="0 0 400 400" style="overflow: visible;">
            ${(() => {
              const centerX = 200;
              const centerY = 200;
              const radius = 150;
              let currentAngle = 0;
              
              return chartPieData.map((item, index) => {
                const value = item.value || 0;
                const percentage = totalValue > 0 ? value / totalValue : 0;
                const angle = percentage * 2 * Math.PI;
                const endAngle = currentAngle + angle;
                
                // Получаем цвет сегмента
                const segmentColor = segmentColors[`segment${index + 1}`] || defaultColors[index % defaultColors.length];
                
                // Создаем путь для сегмента
                const x1 = centerX + radius * Math.cos(currentAngle);
                const y1 = centerY + radius * Math.sin(currentAngle);
                const x2 = centerX + radius * Math.cos(endAngle);
                const y2 = centerY + radius * Math.sin(endAngle);
                
                const largeArcFlag = angle > Math.PI ? 1 : 0;
                
                const pathData = [
                  `M ${centerX} ${centerY}`,
                  `L ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  'Z'
                ].join(' ');
                
                // Создаем градиент для сегмента
                const gradientId = `pieGradient${index}-${elementId}`;
                
                // Вычисляем позицию для подписи
                const labelAngle = currentAngle + angle / 2;
                const labelRadius = radius + 30;
                const labelX = centerX + labelRadius * Math.cos(labelAngle);
                const labelY = centerY + labelRadius * Math.sin(labelAngle);
                
                // Вычисляем позицию для значения
                const valueRadius = radius * 0.7;
                const valueX = centerX + valueRadius * Math.cos(labelAngle);
                const valueY = centerY + valueRadius * Math.sin(labelAngle);
                
                currentAngle = endAngle;
                
                return `
                  <!-- Градиент для сегмента ${index + 1} -->
                  <defs>
                    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:${segmentColor};stop-opacity:0.9" />
                      <stop offset="100%" style="stop-color:${segmentColor};stop-opacity:0.7" />
                    </linearGradient>
                  </defs>
                  
                  <!-- Сегмент ${index + 1} -->
                  <path d="${pathData}" fill="url(#${gradientId})" stroke="white" stroke-width="2" />
                  
                  <!-- Значение в центре сегмента -->
                  <text x="${valueX}" y="${valueY}" text-anchor="middle" fill="white" font-size="14" font-weight="bold" font-family="Montserrat">
                    ${Math.round(percentage * 100)}%
                  </text>
                  
                  <!-- Подпись сегмента -->
                  <text x="${labelX}" y="${labelY}" text-anchor="middle" fill="${chartPieTextColor}" font-size="12" font-family="Montserrat">
                    ${item.name}
                  </text>
                  
                  <!-- Линия к подписи -->
                  <line x1="${centerX + (radius + 10) * Math.cos(labelAngle)}" y1="${centerY + (radius + 10) * Math.sin(labelAngle)}" 
                        x2="${labelX}" y2="${labelY}" 
                        stroke="${chartPieTextColor}" stroke-width="1" opacity="0.5" />
                `;
              }).join('');
            })()}
            
            <!-- Центральная точка -->
            <circle cx="200" cy="200" r="5" fill="white" />
          </svg>
          
          <!-- Легенда справа -->
          <div style="
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid rgba(255,255,255,0.2);
          ">
            ${chartPieData.map((item, index) => {
              const segmentColor = segmentColors[`segment${index + 1}`] || defaultColors[index % defaultColors.length];
              const percentage = totalValue > 0 ? Math.round((item.value || 0) / totalValue * 100) : 0;
              
              return `
                <div style="
                  display: flex;
                  align-items: center;
                  margin-bottom: ${index < chartPieData.length - 1 ? '12px' : '0'};
                ">
                  <div style="
                    width: 16px;
                    height: 16px;
                    background: ${segmentColor};
                    border-radius: 50%;
                    margin-right: 8px;
                    border: 2px solid white;
                  "></div>
                  <div style="
                    color: ${segmentColor};
                    font-size: 12px;
                    font-family: Montserrat;
                  ">
                    <div style="font-weight: bold;">${item.name}</div>
                    <div style="opacity: 0.8;">${item.value} (${percentage}%)</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    default:
      console.warn(`❌ [generateContentElementHTML] Unknown element type: ${element.type}`, element);
      return `<div id="${elementId}" class="content-element">Неизвестный тип элемента: ${element.type}</div>`;
  }
};

// Генерация страницы контактов
const generateContactPage = (siteData) => {
  const headerData = siteData.headerData || {};
  let contactData = siteData.contactData;
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  console.log('🔍 generateContactPage called with siteData keys:', Object.keys(siteData));
  console.log('🔍 Full contactData structure:', JSON.stringify(contactData, null, 2));
  
  if (!contactData || !contactData.title) {
    console.log('❌ No contact data or title found, checking alternative locations...');
    
    // Проверяем альтернативные места где могут храниться данные контактов
    if (siteData.contact) {
      console.log('🔍 Found contact data in siteData.contact:', siteData.contact);
      contactData = siteData.contact;
    } else if (siteData.contactSection) {
      console.log('🔍 Found contact data in siteData.contactSection:', siteData.contactSection);
      contactData = siteData.contactSection;
    }
    
    if (!contactData || !contactData.title) {
      console.log('❌ Still no contact data found, returning empty contact page');
      contactData = {
        title: 'Свяжитесь с нами',
        description: 'Оставьте свои контактные данные, и мы свяжемся с вами в ближайшее время'
      };
    }
  }

  // Создаем inline стили для контактной секции на основе contactData (как в одностраничном экспорте)
  const sectionStyles = [];
  
  console.log('🎨 Checking background styles in contactData...');
  console.log('🔍 backgroundType:', contactData.backgroundType);
  console.log('🔍 gradientColor1:', contactData.gradientColor1);
  console.log('🔍 gradientColor2:', contactData.gradientColor2);
  console.log('🔍 backgroundColor:', contactData.backgroundColor);
  
  // Улучшенная логика для фонов - проверяем разные варианты хранения данных
  if (contactData.backgroundType === 'gradient') {
    if (contactData.gradientColor1 && contactData.gradientColor2) {
      sectionStyles.push(`background: linear-gradient(${contactData.gradientDirection || 'to bottom'}, ${contactData.gradientColor1}, ${contactData.gradientColor2})`);
      console.log('✅ Applied gradient background:', contactData.gradientColor1, contactData.gradientColor2);
    }
  } else if (contactData.backgroundColor) {
    sectionStyles.push(`background-color: ${contactData.backgroundColor}`);
    console.log('✅ Applied solid background:', contactData.backgroundColor);
  }
  
  // Проверяем альтернативные названия полей для фонов
  if (!sectionStyles.length) {
    console.log('❌ No primary background found, checking alternatives...');
    
    const possibleBgFields = [
      'sectionBackgroundColor', 'bgColor', 'background', 'bg',
      'primaryColor', 'mainColor', 'themeColor'
    ];
    
    for (const field of possibleBgFields) {
      if (contactData[field]) {
        sectionStyles.push(`background-color: ${contactData[field]}`);
        console.log(`✅ Applied ${field}:`, contactData[field]);
        break;
      }
    }
    
    // Проверяем градиенты в альтернативных полях
    const possibleGradientFields = [
      ['gradientStart', 'gradientEnd'],
      ['gradient1', 'gradient2'],
      ['color1', 'color2'],
      ['startColor', 'endColor']
    ];
    
    for (const [field1, field2] of possibleGradientFields) {
      if (contactData[field1] && contactData[field2]) {
        sectionStyles.push(`background: linear-gradient(to bottom, ${contactData[field1]}, ${contactData[field2]})`);
        console.log(`✅ Applied gradient ${field1}/${field2}:`, contactData[field1], contactData[field2]);
        break;
      }
    }
  }
  
  // Стили для форм и информационных блоков
  const formStyles = [];
  const infoStyles = [];
  
  if (contactData.formBackgroundColor) {
    formStyles.push(`background-color: ${contactData.formBackgroundColor}`);
  }
  if (contactData.formBorderColor) {
    formStyles.push(`border: 1px solid ${contactData.formBorderColor}`);
  }
  
  if (contactData.infoBackgroundColor) {
    infoStyles.push(`background-color: ${contactData.infoBackgroundColor}`);
  }
  if (contactData.infoBorderColor) {
    infoStyles.push(`border: 1px solid ${contactData.infoBorderColor}`);
  }

  console.log('🎨 Final section styles:', sectionStyles);
  console.log('📋 Form styles:', formStyles);
  console.log('ℹ️ Info styles:', infoStyles);

  // 🗺️ Генерируем Google карту с адресом (улучшенная версия)
  const generateMapSection = () => {
    // Приоритет 1: Если есть mapUrl (как в одностраничном экспорте)
    if (contactData.showMap && contactData.mapUrl) {
      return `
        <div class="contact-map-container" style="
          margin-top: 3rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        ">
          <div style="position: relative; width: 100%; height: 400px;">
            <iframe
              src="${contactData.mapUrl}"
              width="100%"
              height="100%"
              style="border: 0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Карта: ${contactData.address || 'Адрес'}">
            </iframe>
            ${contactData.address ? `
              <div style="
                position: absolute;
                bottom: 10px;
                left: 10px;
                background: rgba(255, 255, 255, 0.9);
                padding: 8px 12px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: #333;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              ">
                <span style="color: #1976d2;">📍</span>
                <span>${contactData.address}${contactData.city ? `, ${contactData.city}` : ''}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }
    // Приоритет 2: Если есть адрес, генерируем Google Maps
    else if (contactData.address) {
      const fullAddress = `${contactData.address}${contactData.city ? `, ${contactData.city}` : ''}`;
      const encodedAddress = encodeURIComponent(fullAddress);
      
      return `
        <div class="contact-map-container" style="
          margin-top: 3rem;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        ">
          <div style="position: relative; width: 100%; height: 400px;">
            <iframe
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedAddress}&language=ru"
              width="100%"
              height="100%"
              style="border: 0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Карта: ${fullAddress}">
            </iframe>
            <div style="
              position: absolute;
              bottom: 10px;
              left: 10px;
              background: rgba(255, 255, 255, 0.9);
              padding: 8px 12px;
              border-radius: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #333;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            ">
              <span style="color: #1976d2;">📍</span>
              <span>${fullAddress}</span>
            </div>
          </div>
        </div>
      `;
    }
    return '';
  };
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${contactData.title || 'Контакты'} - ${siteName}</title>
    <meta name="description" content="${contactData.description || 'Свяжитесь с нами'}">
    <link rel="stylesheet" href="assets/css/styles.css">
    
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, 'contact')}
        
        <!-- Применяем точно такую же структуру как в одностраничном экспорте -->
        <section id="contact" class="contact-section" style="${sectionStyles.join('; ')}">
          <div class="contact-container">
            <div class="contact-header">
              <h2 class="contact-title" style="color: ${contactData.titleColor || '#1976d2'}">${contactData.title}</h2>
              ${contactData.description ? `<p class="contact-description" style="color: ${contactData.descriptionColor || '#666666'}">${contactData.description}</p>` : ''}
            </div>
            
            <div class="contact-content">
              ${contactData.showContactForm !== false ? `
                <div class="contact-form-container" style="${formStyles.join('; ')}">
                  <h3 style="color: ${contactData.titleColor || '#1976d2'}">Свяжитесь с нами</h3>
                  <form class="contact-form" action="merci.html" method="post">
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Имя</label>
                      <input type="text" name="name" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};">
                    </div>
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Email</label>
                      <input type="email" name="email" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'};">
                    </div>
                    <div class="form-group">
                      <label style="color: ${contactData.labelColor || '#333333'}">Сообщение</label>
                      <textarea name="message" required style="background-color: ${contactData.inputBackgroundColor || '#f5f9ff'}; color: ${contactData.inputTextColor || '#1a1a1a'}; min-height: 100px;"></textarea>
                    </div>
                    <button type="submit" style="background-color: ${contactData.buttonColor || '#1976d2'}; color: ${contactData.buttonTextColor || '#ffffff'};">
                      Отправить
                    </button>
                  </form>
                </div>
              ` : ''}
              
              ${contactData.showCompanyInfo !== false ? `
                <div class="contact-info-container" style="${infoStyles.join('; ')}">
                  <h3 class="info-title" style="color: ${contactData.infoTitleColor || contactData.titleColor || '#1976d2'}">Контактная информация</h3>
                  <div class="contact-info">
                    ${contactData.companyName ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Компания:</strong> ${contactData.companyName}</p>` : ''}
                    ${contactData.phone ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Телефон:</strong> ${contactData.phone}</p>` : ''}
                    ${contactData.email ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Email:</strong> ${contactData.email}</p>` : ''}
                    ${contactData.address ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Адрес:</strong> ${contactData.address}</p>` : ''}
                    ${contactData.workingHours ? `<p style="color: ${contactData.companyInfoColor || '#333333'}"><strong>Часы работы:</strong> ${contactData.workingHours}</p>` : ''}
                  </div>
                </div>
              ` : ''}
            </div>
            
            ${generateMapSection()}
          </div>
        </section>
    </main>
    
    ${generateCommonFooter(siteData)}
    
    ${(() => {
      // Проверяем наличие раздела проверки возраста
      const ageVerificationSection = findAgeVerificationSection(siteData);
      return ageVerificationSection ? generateAgeVerificationModal(ageVerificationSection) : '';
    })()}
    
    ${generateCookieConsentHTML(headerData.language || 'en')}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

// Утилиты - убираем жесткую привязку к названиям
const getSectionFileName = (sectionId, sectionData = null) => {
  // Приоритет 1: Используем pageName из AI парсера (всегда на английском)
  if (sectionData?.pageName && sectionData.pageName.trim()) {
    console.log('✅ multiPageSiteExporter using pageName:', sectionData.pageName);
    return sectionData.pageName.toString().toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')  // Только латиница, цифры и дефисы
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Приоритет 2: Используем ID секции как fallback
  if (!sectionId) return null;
  console.log('⚠️ multiPageSiteExporter using sectionId fallback:', sectionId);
  return sectionId.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')  // заменяем специальные символы на дефисы
    .replace(/-+/g, '-')         // убираем повторяющиеся дефисы
    .replace(/^-|-$/g, '');      // убираем дефисы в начале и конце
};

const getContactFileName = (contactData = null) => {
  console.log('🔍 getContactFileName called with contactData:', contactData);
  console.log('🔍 contactData.pageName:', contactData?.pageName);
  
  // Приоритет 1: Используем pageName из AI парсера (всегда на английском)
  if (contactData?.pageName && contactData.pageName.trim()) {
    console.log('✅ multiPageSiteExporter using contact pageName:', contactData.pageName);
    return contactData.pageName.toString().toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')  // Только латиница, цифры и дефисы
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Приоритет 2: Используем стандартное название как fallback
  console.log('⚠️ multiPageSiteExporter using contact fallback: contact');
  return 'contact';
};

const getSectionDisplayName = (sectionId, sectionData) => {
  // Используем заголовок секции или ID как fallback
  const displayName = sectionData?.title || sectionId || 'Раздел';
  
  // Очищаем отображение от подчеркиваний - заменяем на пробелы
  return displayName.replace(/_/g, ' ');
};

// Простые заглушки для остальных функций
const generateBreadcrumbs = (siteData, currentSection, sectionData = null) => {
  let displayName = 'Контакты';
  if (currentSection === 'contact') {
    displayName = 'Контакты';
  } else if (sectionData) {
    displayName = getSectionDisplayName(currentSection, sectionData);
  } else {
    displayName = currentSection;
  }
  
  return `<nav class="breadcrumbs" style="
    position: relative;
    z-index: 10;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 8px 12px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
  "><div class="container">
    <a href="index.html" style="color: #1976d2; text-decoration: none;">Главная</a> > <span>${displayName}</span>
  </div></nav>`;
};

const generateCommonFooter = (siteData) => {
  const footerData = siteData.footerData || {};
  const headerData = siteData.headerData || {};
  const currentYear = new Date().getFullYear();
  
  // Определяем стили футера на основе предустановленных стилей
  let footerStyles = [];
  let textColor = '#ffffff'; // По умолчанию белый текст
  
  if (headerData.siteBackgroundType === 'gradient') {
    // Для градиентного фона используем более темный вариант
    const gradientColor1 = headerData.siteGradientColor1 || '#ffffff';
    const gradientColor2 = headerData.siteGradientColor2 || '#f5f5f5';
    
    // Создаем более темный градиент для футера
    footerStyles.push(`background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
      ${darkenColor(gradientColor1, 20)}, 
      ${darkenColor(gradientColor2, 20)})`);
    
    // Определяем цвет текста на основе яркости фона
    textColor = getContrastColor(gradientColor1);
  } else if (headerData.siteBackgroundType === 'solid') {
    const bgColor = headerData.siteBackgroundColor || '#ffffff';
    footerStyles.push(`background-color: ${darkenColor(bgColor, 20)}`);
    textColor = getContrastColor(bgColor);
  } else {
    // По умолчанию используем темный фон
    footerStyles.push(`background: linear-gradient(135deg, #2c3e50, #34495e)`);
    textColor = '#ffffff';
  }
  
  return `
    <footer class="site-footer" style="${footerStyles.join('; ')}">
      <div class="footer-container" style="color: ${textColor};">
        <div class="footer-content">
          <div class="footer-info">
            <h3>${headerData.siteName || 'My Site'}</h3>
            ${siteData.contactData?.address ? `<p>📍 ${siteData.contactData.address}</p>` : ''}
            ${siteData.contactData?.phone ? `<p>📞 ${siteData.contactData.phone}</p>` : ''}
            ${siteData.contactData?.email ? `<p>✉️ ${siteData.contactData.email}</p>` : ''}
          </div>
          ${footerData.showLinks !== false ? `
            <div class="footer-links">
              <h4>Menu</h4>
              <ul>
                ${(headerData.menuItems || []).map(item => `
                  <li><a href="${item.url || '#'}" style="color: ${textColor};">${item.text || item.title}</a></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
          <div class="footer-contact">
            <h4>Legal Information</h4>
            <ul>
              <li><a href="privacy-policy.html" style="color: ${textColor};">Privacy Policy</a></li>
              <li><a href="terms-of-service.html" style="color: ${textColor};">Terms of Service</a></li>
              <li><a href="cookie-policy.html" style="color: ${textColor};">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${currentYear} ${headerData.siteName || 'My Site'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
};

// Вспомогательная функция для затемнения цвета
const darkenColor = (color, percent) => {
  if (!color || color === '#ffffff') return '#2c3e50';
  
  // Простое затемнение для hex цветов
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
  
  return '#2c3e50';
};

// Вспомогательная функция для определения контрастного цвета текста
const getContrastColor = (hexColor) => {
  if (!hexColor || hexColor === '#ffffff') return '#000000';
  
  if (hexColor.startsWith('#')) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Вычисляем яркость
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness > 128 ? '#000000' : '#ffffff';
  }
  
  return '#ffffff';
};

const generateLegalPage = (siteData, docType) => {
  const doc = siteData.legalDocuments[docType];
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${doc.title} - ${siteName}</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${headerData.siteBackgroundType === 'image' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('assets/images/fon.jpg');
      background-size: cover;
      background-position: center;
      filter: ${headerData.siteBackgroundBlur ? `blur(${headerData.siteBackgroundBlur}px)` : 'none'};
      z-index: -2;
    "></div>
    ${headerData.siteBackgroundDarkness ? `
    <div class="site-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, ${headerData.siteBackgroundDarkness / 100});
      z-index: -1;
    "></div>
    ` : ''}
    ` : headerData.siteBackgroundType === 'gradient' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(${headerData.siteGradientDirection || 'to right'}, 
        ${headerData.siteGradientColor1 || '#ffffff'}, 
        ${headerData.siteGradientColor2 || '#f5f5f5'});
      z-index: -2;
    "></div>
    ` : headerData.siteBackgroundType === 'solid' ? `
    <div class="background-image" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${headerData.siteBackgroundColor || '#ffffff'};
      z-index: -2;
    "></div>
    ` : ''}
    
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, docType)}
        <section class="legal-section">
          <div class="container">
            <h1>${doc.title}</h1>
            <div class="legal-content">
              ${doc.content}
            </div>
          </div>
        </section>
    </main>
    
    ${generateCommonFooter(siteData)}
    
    ${(() => {
      // Проверяем наличие раздела проверки возраста
      const ageVerificationSection = findAgeVerificationSection(siteData);
      return ageVerificationSection ? generateAgeVerificationModal(ageVerificationSection) : '';
    })()}
    
    ${generateCookieConsentHTML(headerData.language || 'en')}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

const generateMerciPage = (siteData) => {
  const headerData = siteData.headerData || {};
  const siteName = headerData.siteName || 'My Site';
  const languageCode = headerData.language || 'ru';
  
  return `<!DOCTYPE html>
<html lang="${languageCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Спасибо - ${siteName}</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    
    <!-- React и основные библиотеки -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Material-UI -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <script src="https://unpkg.com/@mui/material@5.15.10/umd/material-ui.production.min.js"></script>
    <script src="https://unpkg.com/@emotion/react@11.14.0/dist/emotion-react.umd.min.js"></script>
    <script src="https://unpkg.com/@emotion/styled@11.14.1/dist/emotion-styled.umd.min.js"></script>
    
    <!-- Дополнительные библиотеки для элементов -->
    <script src="https://unpkg.com/framer-motion@12.23.0/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/react-countup@6.5.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-confetti@6.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/qrcode.react@4.2.0/lib/index.umd.js"></script>
    <script src="https://unpkg.com/react-player@3.1.0/dist/ReactPlayer.js"></script>
    <script src="https://unpkg.com/react-rating-stars-component@2.2.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-text-transition@3.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-share@5.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-copy-to-clipboard@5.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-color@2.19.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-datepicker@8.4.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-select@5.10.1/dist/react-select.umd.js"></script>
    <script src="https://unpkg.com/react-scroll@1.9.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-rnd@10.5.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-image-crop@11.0.10/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-markdown@9.0.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-plotly.js@2.6.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-apexcharts@1.7.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/react-chartjs-2@5.3.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/recharts@3.0.2/lib/index.umd.js"></script>
    <script src="https://unpkg.com/apexcharts@4.7.0/dist/apexcharts.min.js"></script>
    <script src="https://unpkg.com/chart.js@4.5.0/dist/chart.umd.js"></script>
    <script src="https://unpkg.com/plotly.js@3.0.1/dist/plotly.min.js"></script>
    <script src="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/swiper@11.2.10/swiper-bundle.min.css" />
    <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
    <script src="https://unpkg.com/dayjs@1.11.13/dayjs.min.js"></script>
    <script src="https://unpkg.com/marked@15.0.10/marked.min.js"></script>
    <script src="https://unpkg.com/uuid@11.1.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/browser-image-compression@2.0.2/dist/browser-image-compression.umd.js"></script>
    <script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
    <script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="https://unpkg.com/formik@2.4.6/dist/formik.umd.min.js"></script>
    <script src="https://unpkg.com/yup@1.6.1/dist/yup.umd.min.js"></script>
    <script src="https://unpkg.com/react-hook-form@7.59.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@hookform/resolvers@5.1.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate@0.117.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-react@0.117.3/dist/index.umd.js"></script>
    <script src="https://unpkg.com/slate-history@0.113.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/react@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/starter-kit@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-color@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-highlight@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-image@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-link@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-table@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-text-align@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@tiptap/extension-underline@2.25.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/core@6.3.1/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/sortable@10.0.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@dnd-kit/utilities@3.2.2/dist/index.umd.js"></script>
    <script src="https://unpkg.com/@visx/visx@3.12.0/dist/index.umd.js"></script>
    <script src="https://unpkg.com/victory@37.3.6/dist/index.umd.js"></script>
    <script src="https://unpkg.com/zustand@5.0.6/umd/index.production.min.js"></script>
</head>
<body>
    ${generateCommonHeader(siteData)}
    
    <main>
        ${generateBreadcrumbs(siteData, 'merci')}
        <section class="merci-section">
          <div class="container">
            <h1>Спасибо за ваше обращение!</h1>
            <p>Мы свяжемся с вами в ближайшее время.</p>
          </div>
        </section>
    </main>
    
    ${generateCommonFooter(siteData)}
    
    ${(() => {
      // Проверяем наличие раздела проверки возраста
      const ageVerificationSection = findAgeVerificationSection(siteData);
      return ageVerificationSection ? generateAgeVerificationModal(ageVerificationSection) : '';
    })()}
    
    ${generateCookieConsentHTML(headerData.language || 'en')}
    
    <script src="assets/js/app.js"></script>
</body>
</html>`;
};

const generateCommonStyles = () => `/* Базовые стили для многостраничного сайта */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { 
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
  line-height: 1.6; 
  overflow-x: hidden;
  background: #fff;
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Стили хедера с поддержкой CSS переменных */
.site-header { 
  background: var(--header-bg-color, #fff); 
  padding: 1rem 2rem; 
  border-bottom: 1px solid #eee; 
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.site-branding {
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
  flex-shrink: 1;
  min-width: 0;
}

.site-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.site-title a {
  color: var(--header-title-color, #333);
  text-decoration: none;
  transition: color 0.3s ease;
}

.site-title a:hover {
  color: var(--header-title-color, #333);
  opacity: 0.8;
}

.site-domain {
  font-size: 0.9rem;
  color: var(--header-title-color, #666);
  opacity: 0.8;
  margin-top: 4px;
}

.site-nav {
  position: relative;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: var(--header-link-color, #333);
  margin: 3px 0;
  transition: 0.3s;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.nav-menu li {
  margin: 0;
  list-style: none;
}

.nav-menu li a {
  all: unset;
  cursor: pointer;
}

.nav-menu a,
.nav-link {
  color: var(--header-link-color, #333) !important;
  text-decoration: none !important;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.3rem 0.6rem;
  white-space: nowrap;
  border-radius: 4px;
  background: transparent !important;
  display: inline-block;
  border: none !important;
  box-shadow: none !important;
  font-size: 1rem;
  line-height: 1.5;
}

.nav-menu a:hover,
.nav-menu a.active,
.nav-link:hover,
.nav-link.active {
  color: var(--header-link-color, #1976d2) !important;
  background: rgba(0, 0, 0, 0.05) !important;
  opacity: 1;
  transform: none !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  .site-header {
    padding: 1rem;
  }
  
  .menu-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--header-bg-color, #fff);
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: none;
    gap: 0.5rem;
  }
  
  .nav-menu.active {
    display: flex;
  }
  
  .header-content {
    flex-wrap: nowrap;
  }
  
  .site-branding {
    margin-right: 0.5rem;
    flex-shrink: 1;
    min-width: 0;
  }
}

@media (max-width: 1024px) {
  .nav-menu {
    gap: 0.3rem;
    flex-wrap: wrap;
  }
  
  .nav-menu a,
  .nav-link {
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .header-content {
    flex-wrap: wrap;
  }
}
/* Hero Section Styles */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.hero-bg-animation {
  position: absolute;
  top: -5%;
  left: -5%;
  width: 110%;
  height: 110%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  animation: heroBackgroundZoom 15s ease-in-out infinite;
}

.hero-bg-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-text-wrapper {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(0.1px);
  padding: 2rem 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  opacity: 0.9;
  font-family: 'Montserrat', sans-serif;
}

.hero-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-family: 'Montserrat', sans-serif;
}

.hero-button {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  text-transform: none;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
}

.hero-button:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Hero Animations */
@keyframes heroBackgroundZoom {
  0% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.05);
  }
  100% { 
    transform: scale(1);
  }
}

@keyframes heroBackgroundPan {
  0% { 
    background-position: 0% 0%;
  }
  50% { 
    background-position: 100% 100%;
  }
  100% { 
    background-position: 0% 0%;
  }
}

@keyframes heroFade {
  from { 
    opacity: 0.8;
  }
  to { 
    opacity: 1;
  }
}

@keyframes heroPulse {
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.02);
    opacity: 0.9;
  }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
}

/* Animation classes */
.hero-animation-zoom .hero-bg-animation {
  animation: heroBackgroundZoom 20s infinite alternate;
}

.hero-animation-pan .hero-bg-animation {
  animation: heroBackgroundPan 30s infinite alternate;
}

.hero-animation-fade {
  animation: heroFade 5s infinite alternate;
}

.hero-animation-pulse {
  animation: heroPulse 10s infinite ease-in-out;
}

/* Responsive Hero */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-text-wrapper {
    padding: 1.5rem 2rem;
    margin: 0 1rem;
  }
}
.section-content { padding: 3rem 0; }
.cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
.card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
/* Footer styles */
.site-footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 3rem 2rem 1rem;
  font-family: 'Montserrat', sans-serif;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-info h3,
.footer-links h4,
.footer-contact h4 {
  margin-bottom: 1rem;
  color: #3498db;
  font-weight: 600;
}

.footer-info p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #3498db;
}

.footer-contact p {
  margin-bottom: 0.5rem;
}

.footer-contact ul {
  list-style: none;
  padding: 0;
}

.footer-contact li {
  margin-bottom: 0.5rem;
}

.footer-contact a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-contact a:hover {
  color: #3498db;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  text-align: center;
}

.footer-bottom p {
  margin: 0;
  color: #95a5a6;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .site-footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* ===========================================
   СТИЛИ ДЛЯ ТЕКСТОВЫХ ЭЛЕМЕНТОВ КОНТЕНТА
   =========================================== */

/* Стили для Typography элементов */
.content-element.typography {
  margin: 1rem 0;
}
.content-element.typography h1,
.content-element.typography h2,
.content-element.typography h3,
.content-element.typography h4,
.content-element.typography h5,
.content-element.typography h6 {
  margin: 0;
  line-height: 1.2;
  font-weight: 600;
}

/* Стили для Rich Text элементов */
.content-element.rich-text {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}
.content-element.rich-text h3 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}
.content-element.rich-text .rich-content {
  line-height: 1.6;
  font-size: 1rem;
}
.content-element.rich-text .rich-content strong {
  font-weight: 600;
}
.content-element.rich-text .rich-content em {
  font-style: italic;
}
.content-element.rich-text .rich-content a {
  color: #1976d2;
  text-decoration: none;
}
.content-element.rich-text .rich-content a:hover {
  text-decoration: underline;
}
.content-element.rich-text .rich-content code {
  background: #f4f4f4;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

/* Стили для Blockquote элементов */
.content-element.blockquote {
  margin: 1.5rem 0;
  padding: 1.5rem 2rem;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.content-element.blockquote.border-left {
  border-left: 4px solid #dee2e6;
}
.content-element.blockquote.border-right {
  border-right: 4px solid #dee2e6;
}
.content-element.blockquote.border-top {
  border-top: 4px solid #dee2e6;
}
.content-element.blockquote.border-bottom {
  border-bottom: 4px solid #dee2e6;
}
.content-element.blockquote.border-around {
  border: 4px solid #dee2e6;
}
.content-element.blockquote blockquote {
  margin: 0;
  position: relative;
}
.content-element.blockquote .quote-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}
.content-element.blockquote .quote-author {
  font-size: 0.9rem;
  text-align: right;
  opacity: 0.8;
}
.content-element.blockquote .quote-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Стили для List элементов */
.content-element.list {
  margin: 1.5rem 0;
}
.content-element.list ul,
.content-element.list ol {
  line-height: 1.6;
  padding-left: 2rem;
}
.content-element.list.spacing-compact li {
  margin-bottom: 0.25rem;
}
.content-element.list.spacing-normal li {
  margin-bottom: 0.5rem;
}
.content-element.list.spacing-relaxed li {
  margin-bottom: 1rem;
}
.content-element.list.spacing-loose li {
  margin-bottom: 1.5rem;
}
.content-element.list.bullet-circle ul {
  list-style-type: disc;
}
.content-element.list.bullet-square ul {
  list-style-type: square;
}
.content-element.list.bullet-arrow ul {
  list-style: none;
}
.content-element.list.bullet-arrow ul li:before {
  content: "→";
  margin-right: 0.5rem;
  color: #1976d2;
}
.content-element.list.bullet-dash ul {
  list-style: none;
}
.content-element.list.bullet-dash ul li:before {
  content: "–";
  margin-right: 0.5rem;
  color: #666;
}
.content-element.list.bullet-dot ul {
  list-style: none;
}
.content-element.list.bullet-dot ul li:before {
  content: "•";
  margin-right: 0.5rem;
  color: #1976d2;
}
.content-element.list.number-decimal ol {
  list-style-type: decimal;
}
.content-element.list.number-alpha-lower ol {
  list-style-type: lower-alpha;
}
.content-element.list.number-alpha-upper ol {
  list-style-type: upper-alpha;
}
.content-element.list.number-roman-lower ol {
  list-style-type: lower-roman;
}
.content-element.list.number-roman-upper ol {
  list-style-type: upper-roman;
}

/* Стили для Callout элементов */
.content-element.callout {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.content-element.callout .callout-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.content-element.callout .callout-icon {
  font-size: 1.25rem;
  margin-top: 0.1rem;
  flex-shrink: 0;
}
.content-element.callout .callout-content {
  flex: 1;
}
.content-element.callout .callout-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}
.content-element.callout .callout-text {
  margin: 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

/* Callout типы */
.content-element.callout.callout-info {
  background: #e3f2fd;
  border-color: #1976d2;
}
.content-element.callout.callout-info .callout-title {
  color: #1976d2;
}
.content-element.callout.callout-warning {
  background: #fff3e0;
  border-color: #f57c00;
}
.content-element.callout.callout-warning .callout-title {
  color: #f57c00;
}
.content-element.callout.callout-error {
  background: #ffebee;
  border-color: #d32f2f;
}
.content-element.callout.callout-error .callout-title {
  color: #d32f2f;
}
.content-element.callout.callout-success {
  background: #e8f5e8;
  border-color: #388e3c;
}
.content-element.callout.callout-success .callout-title {
  color: #388e3c;
}
.content-element.callout.callout-note {
  background: #f3e5f5;
  border-color: #7b1fa2;
}
.content-element.callout.callout-note .callout-title {
  color: #7b1fa2;
}
.content-element.callout.callout-tip {
  background: #e8f8f5;
  border-color: #00796b;
}
.content-element.callout.callout-tip .callout-title {
  color: #00796b;
}

/* Стили для Code Block элементов */
.content-element.code-block {
  margin: 1.5rem 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.content-element.code-block .code-header {
  background: #333333;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.content-element.code-block .code-content {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  font-family: 'Courier New', Monaco, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-x: auto;
  position: relative;
}
.content-element.code-block .line-numbers {
  position: absolute;
  left: 0;
  top: 1rem;
  bottom: 1rem;
  width: 2.5rem;
  background: #1a1a1a;
  color: #666;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  text-align: right;
  line-height: 1.5;
  border-right: 1px solid #444;
}
.content-element.code-block pre {
  margin: 0;
  padding: 0;
  color: #f8f8f2;
  background: transparent;
}
.content-element.code-block.show-line-numbers pre {
  padding-left: 3rem;
}

/* Стили для элементов typewriter */
.typewriter-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.typewriter-text-content {
  white-space: nowrap;
  overflow: hidden;
}

.typewriter-cursor {
  animation: blink 1s infinite;
  margin-left: 2px;
  user-select: none;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Responsive design для текстовых элементов */
@media (max-width: 768px) {
  .content-element.blockquote {
    padding: 1rem;
  }
  .content-element.rich-text {
    padding: 0.75rem;
  }
  .content-element.callout {
    padding: 0.75rem 1rem;
  }
  .content-element.code-block .code-header {
    padding: 0.5rem 0.75rem;
  }
  .content-element.code-block .code-content {
    padding: 0.75rem;
  }
}

/* ===========================================
   СТИЛИ ДЛЯ ЛИНЕЙНОГО ГРАФИКА
   =========================================== */

.content-element.chart-component {
  margin: 2rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.content-element.chart-component svg {
  width: 100%;
  height: 100%;
}

.content-element.chart-component .chart-point-1,
.content-element.chart-component .chart-point-2 {
  cursor: pointer;
  transition: all 0.2s ease;
}

.content-element.chart-component .chart-point-1:hover,
.content-element.chart-component .chart-point-2:hover {
  transform: scale(1.1);
}

/* Стили для невидимых областей */
.content-element.chart-component rect[class*="chart-point"] {
  cursor: pointer;
}

/* Улучшение линий сетки */
.content-element.chart-component line[stroke-dasharray="3,3"] {
  pointer-events: none;
}

/* Стили для кастомных tooltip'ов */
.chart-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  pointer-events: none;
  z-index: 10000;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.2);
  min-width: 160px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  white-space: pre-line;
  animation: tooltipFadeIn 0.2s ease-out;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hover эффекты для точек графика */
.content-element.chart-component .chart-point-1:hover,
.content-element.chart-component .chart-point-2:hover {
  stroke: rgba(255,255,255,0.3) !important;
  stroke-width: 8 !important;
  filter: drop-shadow(0 0 4px rgba(255,255,255,0.5));
}

/* Responsive design для графиков */
@media (max-width: 768px) {
  .content-element.chart-component {
    padding: 16px !important;
  }
  
  .content-element.chart-component svg {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .content-element.chart-component svg {
    height: 300px;
  }

  /* Стили для выделенного раздела */
  .featured-section {
    position: relative;
    overflow: hidden;
  }

  .featured-content {
    position: relative;
    z-index: 2;
  }

  .featured-image {
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  }

  .featured-image img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }

  .featured-image:hover img {
    transform: scale(1.05);
  }

  .featured-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
  }

  /* Стили для разных режимов отображения разделов */
  .sections-preview.mode-cards .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }



  /* Стили для превью контактов */
  .contact-preview {
    position: relative;
    overflow: hidden;
  }

  .contact-preview-content {
    position: relative;
    z-index: 2;
  }

  .contact-preview-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255,255,255,0.2);
  }

  /* Адаптивность для новых режимов */
  @media (max-width: 768px) {
    .featured-content {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }

    .featured-section .container {
      padding: 0 1rem !important;
    }

    .featured-text h2 {
      font-size: 2rem !important;
      text-align: center !important;
    }

    .featured-text p {
      font-size: 1.1rem !important;
      text-align: center !important;
    }

    .featured-elements {
      text-align: center !important;
    }

    .featured-actions {
      text-align: center !important;
    }

    .sections-preview.mode-cards .preview-grid {
      grid-template-columns: 1fr;
    }

    .contact-preview-content {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }


    .contact-preview-info {
      flex-direction: column;
      gap: 1rem;
    }
  }

/* ===========================================
   СТИЛИ ДЛЯ КОНТАКТНЫХ ФОРМ И СЕКЦИЙ
   =========================================== */

/* Базовые стили для контактных секций */
.contact-section {
  padding: 4rem 0;
  position: relative;
  z-index: 2;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: 'Montserrat', sans-serif;
}

.contact-description {
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Montserrat', sans-serif;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Стили для контейнеров формы и информации */
.contact-form-container,
.contact-info-container {
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease-in-out;
  background-color: #ffffff;
}

.contact-form-container:hover,
.contact-info-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

/* Стили для форм */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f5f9ff;
  color: #1a1a1a;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.submit-button {
  background-color: #1976d2;
  color: #ffffff;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.submit-button:hover {
  background-color: #1565c0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Стили для контактной информации */
.info-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1976d2;
}

.contact-info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  padding: 8px 0;
}

.contact-info-item .icon {
  color: #1976d2;
  font-size: 1.2rem;
}

.contact-info-item span {
  color: #424242;
}

/* Стили для карты */
.contact-map-container {
  margin-top: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.contact-map-container iframe {
  border-radius: 12px;
}

/* Адаптивность для контактов */
@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .contact-title {
    font-size: 2rem;
  }
  
  .contact-description {
    font-size: 1rem;
  }
  
  .contact-container {
    padding: 0 1rem;
  }
  
  .contact-form-container,
  .contact-info-container {
    padding: 1.5rem;
  }
}

/* Анимации */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-form-container,
.contact-info-container {
  animation: fadeInUp 0.6s ease-out;
}

/* Стили для карточек с изображениями */
.service-block {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.service-image {
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 12px;
  position: relative;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-image:hover img {
  transform: scale(1.05);
}
}`;

const generateCommonJS = (siteData) => `// Общий JavaScript для многостраничного сайта
console.log('Multi-page site loaded');

// Инициализация React компонентов
document.addEventListener('DOMContentLoaded', function() {
  console.log('React libraries loaded for multi-page site');
  
  // Глобальные переменные для доступа к библиотекам
  window.React = React;
  window.ReactDOM = ReactDOM;
  window.MaterialUI = MaterialUI;
  window.FramerMotion = FramerMotion;
  window.ReactCountUp = ReactCountUp;
  window.ReactConfetti = ReactConfetti;
  window.QRCodeReact = QRCodeReact;
  window.ReactPlayer = ReactPlayer;
  window.ReactRatingStarsComponent = ReactRatingStarsComponent;
  window.ReactTextTransition = ReactTextTransition;
  window.ReactShare = ReactShare;
  window.ReactCopyToClipboard = ReactCopyToClipboard;
  window.ReactColor = ReactColor;
  window.ReactDatepicker = ReactDatepicker;
  window.ReactSelect = ReactSelect;
  window.ReactScroll = ReactScroll;
  window.ReactRnd = ReactRnd;
  window.ReactImageCrop = ReactImageCrop;
  window.ReactMarkdown = ReactMarkdown;
  window.ReactPlotly = ReactPlotly;
  window.ReactApexcharts = ReactApexcharts;
  window.ReactChartjs2 = ReactChartjs2;
  window.Recharts = Recharts;
  window.ApexCharts = ApexCharts;
  window.Chart = Chart;
  window.Plotly = Plotly;
  window.Swiper = Swiper;
  window.axios = axios;
  window.dayjs = dayjs;
  window.marked = marked;
  window.uuid = uuid;
  window.browserImageCompression = browserImageCompression;
  window.FileSaver = FileSaver;
  window.JSZip = JSZip;
  window.Formik = Formik;
  window.yup = yup;
  window.ReactHookForm = ReactHookForm;
  window.HookformResolvers = HookformResolvers;
  window.Slate = Slate;
  window.SlateReact = SlateReact;
  window.SlateHistory = SlateHistory;
  window.TipTapReact = TipTapReact;
  window.TipTapStarterKit = TipTapStarterKit;
  window.TipTapExtensionColor = TipTapExtensionColor;
  window.TipTapExtensionHighlight = TipTapExtensionHighlight;
  window.TipTapExtensionImage = TipTapExtensionImage;
  window.TipTapExtensionLink = TipTapExtensionLink;
  window.TipTapExtensionTable = TipTapExtensionTable;
  window.TipTapExtensionTextAlign = TipTapExtensionTextAlign;
  window.TipTapExtensionUnderline = TipTapExtensionUnderline;
  window.DndKitCore = DndKitCore;
  window.DndKitSortable = DndKitSortable;
  window.DndKitUtilities = DndKitUtilities;
  window.Visx = Visx;
  window.Victory = Victory;
  window.Zustand = Zustand;
  
  console.log('All React libraries initialized successfully');
  
  // Initialize content elements
  initContentElements();
  
  // Also initialize counters specifically
  if (window.reinitializeCounters) {
    window.reinitializeCounters();
  }
  
  // Also initialize FAQ functionality
  console.log('🔧 [initContentElements] Initializing FAQ functionality...');
  const faqElements = document.querySelectorAll('.faq-section');
  console.log('🔧 [initContentElements] Found FAQ elements:', faqElements.length);
});

// Function to initialize content elements
function initContentElements() {
  // Initialize animated counters
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const start = parseInt(counter.dataset.start) || 0;
        const end = parseInt(counter.dataset.end) || 100;
        const duration = parseInt(counter.dataset.duration) || 2000;
        
        animateCounter(counter, start, end, duration);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
  
  // Initialize typewriter text
  const typewriters = document.querySelectorAll('.typewriter');
  typewriters.forEach(initTypewriter);
  
  // Re-initialize typewriter text after a short delay to catch dynamically loaded content
  setTimeout(() => {
    const newTypewriters = document.querySelectorAll('.typewriter:not([data-initialized])');
    newTypewriters.forEach(element => {
      element.setAttribute('data-initialized', 'true');
      initTypewriter(element);
    });
  }, 100);
}

// Function to animate counters
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const difference = end - start;
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (difference * easeOut));
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Function to initialize typewriter effect
function initTypewriter(element) {
  const texts = JSON.parse(element.dataset.texts || '["Default text"]');
  const speed = parseInt(element.dataset.speed) || 150;
  const pauseTime = parseInt(element.dataset.pause) || 2000;
  const repeat = element.dataset.repeat !== 'false';
  
  // Find the text content span
  const textContentSpan = element.querySelector('.typewriter-text-content');
  if (!textContentSpan) {
    console.error('Typewriter text content span not found');
    return;
  }
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function typeText() {
    const fullText = texts[textIndex];
    let displayText = '';
    
    if (isDeleting) {
      displayText = fullText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      displayText = fullText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    // Update only the text content, cursor stays separate
    textContentSpan.textContent = displayText;
    
    let typeSpeed = speed;
    
    if (isDeleting) {
      typeSpeed = speed / 2;
    }
    
    if (!isDeleting && charIndex === fullText.length) {
      // Finished typing, pause before deleting
      typeSpeed = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next text
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      
      // If not repeating and we've gone through all texts, stop
      if (!repeat && textIndex === 0) {
        // Show final text and dim cursor
        textContentSpan.textContent = texts[0];
        const cursor = element.querySelector('.typewriter-cursor');
        if (cursor) cursor.style.opacity = '0.3';
        return;
      }
      
      typeSpeed = speed;
    }
    
  setTimeout(typeText, typeSpeed);
}

// Start the typewriter effect
typeText();
}

// Global function to re-initialize typewriter animations
window.reinitializeTypewriters = function() {
  const typewriters = document.querySelectorAll('.typewriter:not([data-initialized])');
  typewriters.forEach(element => {
    element.setAttribute('data-initialized', 'true');
    initTypewriter(element);
  });
};

// Global function to re-initialize counter animations
window.reinitializeCounters = function() {
  const counters = document.querySelectorAll('.counter:not([data-counter-initialized])');
  counters.forEach(counter => {
    counter.setAttribute('data-counter-initialized', 'true');
    
    const start = parseInt(counter.dataset.start) || 0;
    const end = parseInt(counter.dataset.end) || 100;
    const duration = parseInt(counter.dataset.duration) || 2000;
    
    // Create intersection observer for this specific counter
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate counter
          const startTime = performance.now();
          const difference = end - start;
          
          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (difference * easeOut));
            
            counter.textContent = current;
            
            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }
          
          requestAnimationFrame(updateCounter);
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(counter);
  });
};

// Global function to toggle FAQ accordion
window.toggleFAQ = function(index) {
  console.log('🔧 [toggleFAQ] Called with index:', index);
  
  const answer = document.getElementById('faq-answer-' + index);
  console.log('🔧 [toggleFAQ] Found answer element:', answer);
  
  const container = answer ? answer.parentElement : null;
  const icon = container ? container.querySelector('span') : null;
  console.log('🔧 [toggleFAQ] Found icon:', icon);
  
  if (answer) {
    const isVisible = answer.style.display !== 'none';
    console.log('🔧 [toggleFAQ] Is visible:', isVisible);
    
    answer.style.display = isVisible ? 'none' : 'block';
    
    // Обновляем иконку
    if (icon) {
      icon.textContent = isVisible ? '▼' : '▲';
      console.log('🔧 [toggleFAQ] Updated icon to:', icon.textContent);
    }
  } else {
    console.error('🔧 [toggleFAQ] Answer element not found for index:', index);
  }
};
}

// ===========================================
// ФУНКЦИИ ДЛЯ ВСПЛЫВАЮЩИХ ПОДСКАЗОК ГРАФИКОВ
// ===========================================

// Инициализация tooltip'ов для всех графиков на странице
function initChartTooltips() {
  try {
    console.log('🔍 initChartTooltips: Начинаем инициализацию tooltip\'ов');
    const chartComponents = document.querySelectorAll('.chart-component');
    console.log('🔍 Найдено графиков:', chartComponents.length);
  
  chartComponents.forEach((chartContainer, chartIndex) => {
    console.log('🔍 Обрабатываем график', chartIndex);
    const svg = chartContainer.querySelector('svg');
    if (!svg) {
      console.log('❌ SVG не найден в графике', chartIndex);
      return;
    }
    
    let tooltip = null;
    let tooltipTimeout = null;
    let isTooltipVisible = false;
    
    // Получаем данные для tooltip'ов из data-атрибутов
    const chartData = getChartDataFromElement(chartContainer);
    const lineNames = getLineNamesFromElement(chartContainer);
    const lineColors = getLineColorsFromElement(chartContainer);
    
    console.log('🔍 Данные графика:', chartData);
    console.log('🔍 Названия линий:', lineNames);
    console.log('🔍 Цвета линий:', lineColors);
    
    // Функция для создания tooltip
    function createTooltip() {
      if (tooltip) return;
      
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      document.body.appendChild(tooltip);
    }
    
    // Функция для определения ближайшей точки
    function findNearestPoint(mouseX, mouseY) {
      const chartRect = svg.getBoundingClientRect();
      const relativeX = mouseX - chartRect.left;
      const relativeY = mouseY - chartRect.top;
      
      // Получаем все точки графика
      const points1 = Array.from(svg.querySelectorAll('.chart-point-1')).map((point, index) => {
        const cx = parseFloat(point.getAttribute('cx') || '0');
        const cy = parseFloat(point.getAttribute('cy') || '0');
        return { x: cx, y: cy, index, line: 1 };
      });
      
      const points2 = Array.from(svg.querySelectorAll('.chart-point-2')).map((point, index) => {
        const cx = parseFloat(point.getAttribute('cx') || '0');
        const cy = parseFloat(point.getAttribute('cy') || '0');
        return { x: cx, y: cy, index, line: 2 };
      });
      
      const allPoints = [...points1, ...points2];
      
      console.log('🔍 Найдено точек:', allPoints.length);
      console.log('🔍 Координаты мыши (относительно графика):', { x: relativeX, y: relativeY });
      
      // Находим ближайшую точку с учетом радиуса взаимодействия
      let nearestPoint = null;
      let minDistance = Infinity;
      const interactionRadius = 25;
      
      allPoints.forEach(point => {
        const distance = Math.sqrt(
          Math.pow(relativeX - point.x, 2) + 
          Math.pow(relativeY - point.y, 2)
        );
        
        if (distance <= interactionRadius && distance < minDistance) {
          minDistance = distance;
          nearestPoint = point;
        }
      });
      
      // Если не нашли точку в радиусе, ищем ближайшую в пределах большего радиуса
      if (!nearestPoint) {
        const extendedRadius = 40;
        allPoints.forEach(point => {
          const distance = Math.sqrt(
            Math.pow(relativeX - point.x, 2) + 
            Math.pow(relativeY - point.y, 2)
          );
          
          if (distance <= extendedRadius && distance < minDistance) {
            minDistance = distance;
            nearestPoint = point;
          }
        });
      }
      
      console.log('🔍 Ближайшая точка:', nearestPoint, 'расстояние:', minDistance);
      return nearestPoint;
    }
    
    // Функция для показа tooltip
    function showTooltip(mouseX, mouseY) {
      console.log('🔍 showTooltip вызван для координат:', { x: mouseX, y: mouseY });
      const nearestPoint = findNearestPoint(mouseX, mouseY);
      if (!nearestPoint) {
        console.log('❌ Ближайшая точка не найдена');
        return;
      }
      
      createTooltip();
      
      // Получаем данные для tooltip
      const pointData = chartData[nearestPoint.index];
      if (!pointData) {
        console.log('❌ Данные для точки не найдены, индекс:', nearestPoint.index);
        return;
      }
      
      console.log('🔍 Данные точки:', pointData);
      
      // Формируем содержимое tooltip с улучшенным форматированием
      let tooltipContent = '<strong>' + pointData.name + '</strong>';
      
      // Добавляем данные первой линии
      if (pointData.value !== undefined) {
        tooltipContent += '\n<span style="color: ' + lineColors[0] + '">●</span> ' + lineNames[0] + ': <strong>' + pointData.value + '</strong>';
      }
      
      // Добавляем данные второй линии (если есть)
      if (pointData.value2 !== undefined) {
        tooltipContent += '\n<span style="color: ' + lineColors[1] + '">●</span> ' + lineNames[1] + ': <strong>' + pointData.value2 + '</strong>';
      }
      
      // Добавляем процентное соотношение (если есть вторая линия)
      if (pointData.value2 !== undefined && pointData.value > 0) {
        const percentage = ((pointData.value2 / pointData.value) * 100).toFixed(1);
        tooltipContent += '\n<span style="opacity: 0.8; font-size: 11px;">⚖ ' + percentage + '%</span>';
      }
      
      tooltip.innerHTML = tooltipContent;
      
      // Позиционируем tooltip с учетом границ экрана
      let left = mouseX + 15;
      let top = mouseY - tooltip.offsetHeight / 2;
      
      // Проверяем правую границу
      if (left + tooltip.offsetWidth > window.innerWidth) {
        left = mouseX - tooltip.offsetWidth - 15;
      }
      
      // Проверяем верхнюю границу
      if (top < 0) top = 10;
      
      // Проверяем нижнюю границу
      if (top + tooltip.offsetHeight > window.innerHeight) {
        top = window.innerHeight - tooltip.offsetHeight - 10;
      }
      
      // Проверяем левую границу
      if (left < 0) left = 10;
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    }
    
    // Функция для скрытия tooltip
    function hideTooltip() {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
        isTooltipVisible = false;
      }
    }
    
    // Обработчики событий для SVG с throttling для производительности
    svg.addEventListener('mousemove', function(e) {
      if (tooltipTimeout) return;
      
      tooltipTimeout = setTimeout(() => {
        if (!isTooltipVisible || 
            Math.abs(e.clientX - (tooltip?.lastMouseX || 0)) > 5 || 
            Math.abs(e.clientY - (tooltip?.lastMouseY || 0)) > 5) {
          showTooltip(e.clientX, e.clientY);
          isTooltipVisible = true;
          if (tooltip) {
            tooltip.lastMouseX = e.clientX;
            tooltip.lastMouseY = e.clientY;
          }
        }
        
        tooltipTimeout = null;
      }, 20);
    });
    
    svg.addEventListener('mouseleave', function() {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
      }
      hideTooltip();
      isTooltipVisible = false;
    });
    
    // Обработчики для точек графика и невидимых областей
    const chartPoints = svg.querySelectorAll('.chart-point-1, .chart-point-2');
    const invisibleRects = svg.querySelectorAll('rect[class*="chart-point"]');
    
    const allInteractiveElements = [...chartPoints, ...invisibleRects];
    
    allInteractiveElements.forEach(element => {
      element.addEventListener('mouseenter', function(e) {
        if (tooltipTimeout) {
          clearTimeout(tooltipTimeout);
          tooltipTimeout = null;
        }
        showTooltip(e.clientX, e.clientY);
        isTooltipVisible = true;
      });
      
      element.addEventListener('mouseleave', function() {
        hideTooltip();
        isTooltipVisible = false;
      });
    });
  });
  } catch (error) {
    console.error('❌ Ошибка при инициализации tooltip\'ов:', error);
  }
}

// Вспомогательные функции для извлечения данных из элементов
function getChartDataFromElement(chartContainer) {
  try {
    console.log('🔍 getChartDataFromElement: Начинаем извлечение данных');
    // Пытаемся извлечь данные из data-атрибутов точек графика
  const chartPoints = chartContainer.querySelectorAll('.chart-point-1, .chart-point-2');
  console.log('🔍 Найдено точек с классами chart-point:', chartPoints.length);
  
  if (chartPoints.length > 0) {
    // Собираем уникальные точки по индексу
    const dataMap = new Map();
    
    chartPoints.forEach((point, i) => {
      const index = parseInt(point.getAttribute('data-index') || '0');
      const name = point.getAttribute('data-name') || '';
      const value = parseFloat(point.getAttribute('data-value') || '0');
      const value2 = parseFloat(point.getAttribute('data-value2') || '0');
      
      console.log('🔍 Точка', i, ':', { index, name, value, value2, class: point.className });
      
      if (!dataMap.has(index)) {
        dataMap.set(index, { name, value, value2: value2 || undefined });
      } else {
        // Если уже есть точка с таким индексом, обновляем value2
        const existing = dataMap.get(index);
        if (value2 && value2 > 0) {
          existing.value2 = value2;
        }
      }
    });
    
    // Сортируем по индексу и возвращаем массив
    const sortedData = Array.from(dataMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([index, data]) => data);
    
    console.log('🔍 Собранные данные:', sortedData);
    
    if (sortedData.length > 0) {
      return sortedData;
    }
  }
  
  // Fallback: пытаемся извлечь данные из заголовка
  const titleElement = chartContainer.querySelector('h3');
  if (titleElement) {
    const title = titleElement.textContent;
    
    // Определяем тип графика по заголовку и генерируем тестовые данные
    if (title.includes('продаж') || title.includes('доход') || title.includes('рост')) {
      return [
        { name: 'Январь', value: 120, value2: 80 },
        { name: 'Февраль', value: 160, value2: 120 },
        { name: 'Март', value: 200, value2: 160 },
        { name: 'Апрель', value: 240, value2: 200 },
        { name: 'Май', value: 280, value2: 240 },
        { name: 'Июнь', value: 320, value2: 280 }
      ];
    } else if (title.includes('статистик') || title.includes('анализ')) {
      return [
        { name: 'Q1', value: 85, value2: 65 },
        { name: 'Q2', value: 92, value2: 78 },
        { name: 'Q3', value: 88, value2: 72 },
        { name: 'Q4', value: 95, value2: 82 }
      ];
    } else {
      // Универсальные данные по умолчанию
      return [
        { name: 'Пункт 1', value: 100, value2: 60 },
        { name: 'Пункт 2', value: 150, value2: 90 },
        { name: 'Пункт 3', value: 200, value2: 120 },
        { name: 'Пункт 4', value: 180, value2: 110 },
        { name: 'Пункт 5', value: 250, value2: 150 }
      ];
    }
  }
  
  return [];
  } catch (error) {
    console.error('❌ Ошибка при извлечении данных графика:', error);
    return [];
  }
}

function getLineNamesFromElement(chartContainer) {
  try {
    console.log('🔍 getLineNamesFromElement: Извлекаем названия линий');
    const titleElement = chartContainer.querySelector('h3');
  if (titleElement) {
    const title = titleElement.textContent;
    console.log('🔍 Заголовок графика:', title);
    
    if (title.includes('продаж') || title.includes('доход')) {
      const names = ['Продажи', 'Доходы'];
      console.log('🔍 Определены названия по ключевым словам:', names);
      return names;
    } else if (title.includes('статистик') || title.includes('анализ')) {
      const names = ['Показатель 1', 'Показатель 2'];
      console.log('🔍 Определены названия по ключевым словам:', names);
      return names;
    } else {
      const names = ['Линия 1', 'Линия 2'];
      console.log('🔍 Используем названия по умолчанию:', names);
      return names;
    }
  }
  
  const names = ['Линия 1', 'Линия 2'];
  console.log('🔍 Заголовок не найден, используем названия по умолчанию:', names);
  return names;
  } catch (error) {
    console.error('❌ Ошибка при извлечении названий линий:', error);
    return ['Линия 1', 'Линия 2'];
  }
}

function getLineColorsFromElement(chartContainer) {
  try {
    console.log('🔍 getLineColorsFromElement: Извлекаем цвета линий');
    // Извлекаем цвета из SVG элементов
  const firstLine = chartContainer.querySelector('path[stroke]');
  const secondLine = chartContainer.querySelectorAll('path[stroke]')[1];
  
  const color1 = firstLine ? firstLine.getAttribute('stroke') : '#8884d8';
  const color2 = secondLine ? secondLine.getAttribute('stroke') : '#82ca9d';
  
  console.log('🔍 Цвета линий:', { color1, color2, firstLine: !!firstLine, secondLine: !!secondLine });
  
  return [color1, color2];
  } catch (error) {
    console.error('❌ Ошибка при извлечении цветов линий:', error);
    return ['#8884d8', '#82ca9d'];
  }
}

// Инициализируем tooltip'ы после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 DOM загружен, планируем инициализацию tooltip\'ов');
  // Небольшая задержка для полной загрузки всех элементов
  setTimeout(() => {
    console.log('🔍 Запускаем инициализацию tooltip\'ов');
    initChartTooltips();
  }, 100);
  
  // Инициализация мобильного меню
  initMobileMenu();
  
  // Автоматическое отображение домена
  autoDisplayDomain();
}

// Функция для инициализации мобильного меню
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Анимация гамбургер-меню
      const spans = menuToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
}

// Функция для автоматического отображения домена (как в одностраничном экспорте)
function autoDisplayDomain() {
  // Получаем текущий домен из браузера
  const currentDomain = window.location.hostname;
  
  // Пропускаем localhost или IP-адреса
  if (currentDomain === 'localhost' || 
      currentDomain === '127.0.0.1' || 
      currentDomain.includes('192.168.') ||
      currentDomain.includes('10.0.') ||
      /^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(currentDomain)) {
    console.log('Пропускаем отображение домена для localhost/IP');
    return;
  }
  
  console.log('Автоматическое отображение домена:', currentDomain);
  
  // Находим элемент отображения домена в хедере
  const domainElement = document.querySelector('.site-domain');
  
  if (domainElement) {
    // Обновляем существующий элемент домена
    domainElement.textContent = currentDomain;
    domainElement.style.display = 'block';
    console.log('Обновлен элемент домена в хедере');
  }
  
  // Обновляем любые другие ссылки на домен на странице
  const domainPlaceholders = document.querySelectorAll('[data-auto-domain]');
  domainPlaceholders.forEach(element => {
    element.textContent = currentDomain;
  });
  
  // Обновляем контактные email, если они содержат placeholder домен
  const emailElements = document.querySelectorAll('a[href*="@"], [data-email]');
  emailElements.forEach(element => {
    const href = element.getAttribute('href') || '';
    const text = element.textContent || '';
    
    if (href.includes('@example.com') || text.includes('@example.com')) {
      const newHref = href.replace('@example.com', \`@\${currentDomain}\`);
      const newText = text.replace('@example.com', \`@\${currentDomain}\`);
      
      if (href !== newHref) element.setAttribute('href', newHref);
      if (text !== newText) element.textContent = newText;
    }
  });
}`;

const generateMultiPageSitemap = (siteData) => {
  const domain = siteData.headerData?.domain || 'example.com';
  const baseUrl = domain.startsWith('http') ? domain : `https://${domain}`;
  const currentDate = new Date().toISOString().replace('Z', '+00:00');
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/index.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Добавляем страницы секций
  const sectionsData = siteData.sectionsData || {};
  Object.entries(sectionsData).forEach(([sectionId, sectionData]) => {
    // Исключаем раздел проверки возраста из sitemap
    const isAgeVerification = sectionId === 'age-verification' || 
                             sectionId === 'проверка возраста' ||
                             sectionData.title?.toLowerCase().includes('подтверждение возраста') ||
                             sectionData.title?.toLowerCase().includes('проверка возраста') ||
                             sectionData.title?.toLowerCase().includes('age verification');
    
    if (!isAgeVerification) {
      const fileName = getSectionFileName(sectionId, sectionData);
      if (fileName) {
        sitemap += `
  <url>
    <loc>${baseUrl}/${fileName}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }
  });

  // Добавляем страницу контактов
  if (siteData.contactData) {
    const contactFileName = getContactFileName(siteData.contactData);
    sitemap += `
  <url>
    <loc>${baseUrl}/${contactFileName}.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }

  // Добавляем правовые документы
  if (siteData.legalDocuments) {
    if (siteData.legalDocuments.privacyPolicy?.content) {
      sitemap += `
  <url>
    <loc>${baseUrl}/privacy-policy.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    }
    if (siteData.legalDocuments.termsOfService?.content) {
      sitemap += `
  <url>
    <loc>${baseUrl}/terms-of-service.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    }
    if (siteData.legalDocuments.cookiePolicy?.content) {
      sitemap += `
  <url>
    <loc>${baseUrl}/cookie-policy.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    }
  }

  // Добавляем страницу благодарности
  sitemap += `
  <url>
    <loc>${baseUrl}/merci.html</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  return sitemap;
};



const generateSafeFileName = (siteData) => {
  const siteName = siteData.headerData?.siteName || 'my-site';
  return siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
}; 

// 🔥 НОВАЯ ФУНКЦИЯ: Экспорт изображений карточек по образцу системы секций
const exportCardImages = async (zip, assetsDir, siteData) => {
  const imagesDir = assetsDir.folder('images');
  // Используем прямо imagesDir без подпапки cards
  let exportedCount = 0;
  
  console.log('🔥CARD-EXPORT🔥 Starting card images export...');
  
  try {
    // Проходим по всем секциям и ищем карточки - ТОЧНО КАК В СИСТЕМЕ СЕКЦИЙ
    const sections = Object.entries(siteData.sectionsData || {});
    
    for (const [sectionId, sectionData] of sections) {
      console.log(`🔥CARD-EXPORT🔥 Processing section: ${sectionId}`);
      
      // Проверяем все возможные массивы карточек
      const cardArrays = [
        sectionData.elements || [],
        sectionData.contentElements || [],
        sectionData.cards || []
      ];
      
      for (const cards of cardArrays) {
        for (const card of cards) {
          // Обрабатываем элемент типа multiple-cards
          if (card.type === 'multiple-cards' && card.data?.cards) {
            console.log(`🔥CARD-EXPORT🔥 Found multiple-cards element in section ${sectionId}:`, card);
            
            // Экспортируем изображения из всех карточек внутри multiple-cards
            for (const innerCard of card.data.cards) {
              if (innerCard.id && innerCard.fileName && innerCard.fileName.startsWith('card_')) {
                console.log(`🔥CARD-EXPORT🔥 Processing inner card ${innerCard.id} with fileName: ${innerCard.fileName}`);
                
                try {
                  const blob = await imageCacheService.getImage(innerCard.fileName);
                  if (blob) {
                    console.log(`🔥CARD-EXPORT🔥 ✅ Found blob for inner card fileName: ${innerCard.fileName}, size: ${blob.size}`);
                    imagesDir.file(innerCard.fileName, blob);
                    exportedCount++;
                    console.log(`🔥CARD-EXPORT🔥 ✅ Inner card image exported: ${innerCard.fileName}`);
                  } else {
                    console.warn(`🔥CARD-EXPORT🔥 ❌ No blob found for inner card fileName: ${innerCard.fileName}`);
                  }
                } catch (error) {
                  console.warn(`🔥CARD-EXPORT🔥 Failed to get blob for inner card fileName: ${innerCard.fileName}`, error);
                }
              } else {
                console.log(`🔥CARD-EXPORT🔥 Skipping inner card without fileName: ${innerCard.id}`);
              }
            }
          }
          // Обрабатываем обычные карточки
          else if ((card.type === 'image-card' || card.type === 'card') && card.id) {
            console.log(`🔥CARD-EXPORT🔥 Checking card ${card.id} in section ${sectionId}`, card);
            
            let imageExported = false;
            
            // Способ 1: Используем fileName из данных карточки
            if (card.fileName && card.fileName.startsWith('card_')) {
              console.log(`🔥CARD-EXPORT🔥 Found fileName in card data: ${card.fileName}`);
              try {
                const blob = await imageCacheService.getImage(card.fileName);
                if (blob) {
                  console.log(`🔥CARD-EXPORT🔥 ✅ Found blob for fileName: ${card.fileName}, size: ${blob.size}`);
                  imagesDir.file(card.fileName, blob);
                  exportedCount++;
                  imageExported = true;
                  console.log(`🔥CARD-EXPORT🔥 ✅ Card image exported from fileName: ${card.fileName}`);
                }
              } catch (error) {
                console.warn(`🔥CARD-EXPORT🔥 Failed to get blob for fileName: ${card.fileName}`, error);
              }
            }
            
            // Способ 2: Ищем метаданные по ключу (только если не экспортировано выше)
            if (!imageExported) {
              const metadataKey = `card_${card.id}_${sectionId}_ImageMetadata`;
              console.log(`🔥CARD-EXPORT🔥 Looking for metadata key: ${metadataKey}`);
              
              try {
                const cardImageMetadata = await imageCacheService.getMetadata(metadataKey) || {};
                console.log(`🔥CARD-EXPORT🔥 Found metadata:`, cardImageMetadata);
                
                if (cardImageMetadata.filename) {
                  // ТОЧНО КАК В СИСТЕМЕ СЕКЦИЙ: получаем blob из кеша
                  console.log(`🔥CARD-EXPORT🔥 Trying to get blob for: ${cardImageMetadata.filename}`);
                  const blob = await imageCacheService.getImage(cardImageMetadata.filename);
                  
                  if (blob) {
                    console.log(`🔥CARD-EXPORT🔥 ✅ Card image found in cache: ${cardImageMetadata.filename}, size: ${blob.size}`);
                    imagesDir.file(cardImageMetadata.filename, blob);
                    exportedCount++;
                    imageExported = true;
                    console.log(`🔥CARD-EXPORT🔥 ✅ Card image successfully added to zip: ${cardImageMetadata.filename}`);
                  } else {
                    console.warn(`🔥CARD-EXPORT🔥 ❌ Card image not found in cache: ${cardImageMetadata.filename}`);
                  
                  // ТОЧНО КАК В СИСТЕМЕ СЕКЦИЙ: пытаемся загрузить по originalPath
                  if (cardImageMetadata.originalPath) {
                    console.log(`🔥CARD-EXPORT🔥 Trying originalPath: ${cardImageMetadata.originalPath}`);
                    try {
                      const response = await fetch(cardImageMetadata.originalPath);
                      if (response.ok) {
                        const fetchedBlob = await response.blob();
                        console.log(`🔥CARD-EXPORT🔥 ✅ Fetched from URL, size: ${fetchedBlob.size}`);
                        imagesDir.file(cardImageMetadata.filename, fetchedBlob);
                        exportedCount++;
                        console.log(`🔥CARD-EXPORT🔥 ✅ Card image successfully fetched from URL and added to zip: ${cardImageMetadata.filename}`);
                      } else {
                        console.warn(`🔥CARD-EXPORT🔥 ❌ Failed to fetch from URL, status: ${response.status}`);
                      }
                    } catch (fetchError) {
                      console.error(`🔥CARD-EXPORT🔥 ❌ Error fetching card image from URL:`, fetchError);
                    }
                  } else {
                    console.warn(`🔥CARD-EXPORT🔥 ❌ No originalPath available`);
                  }
                }
              } else {
                console.warn(`🔥CARD-EXPORT🔥 ❌ No filename in metadata for card ${card.id}`);
              }
              } catch (error) {
                console.error(`🔥CARD-EXPORT🔥 Error parsing metadata for card ${card.id}:`, error);
              }
            }
            
            if (!imageExported) {
              console.warn(`🔥CARD-EXPORT🔥 ⚠️ No image exported for card ${card.id} in section ${sectionId}`);
            }
          }
        }
      }
    }
    
    console.log(`🔥CARD-EXPORT🔥 Card images export completed: ${exportedCount} images exported`);
    return exportedCount;
  } catch (error) {
    console.error('🔥CARD-EXPORT🔥 Error in exportCardImages:', error);
    return 0;
  }
};
