// Утилита для очистки email от markdown-разметки
const cleanEmail = (text) => {
  if (!text) return text;
  // Убираем markdown-разметку для ссылок вида [email](mailto:email)
  const markdownLinkRegex = /\[(.*?)\]\(mailto:(.*?)\)/;
  const match = text.match(markdownLinkRegex);
  if (match) {
    return match[2]; // Возвращаем email из mailto:
  }
  return text;
};

// Функция для очистки всех email в тексте
const cleanEmailsInText = (text) => {
  if (!text) return text;
  return text.replace(/\[(.*?)\]\(mailto:(.*?)\)/g, '$2');
};

// Функция для очистки служебных полей из текста
const cleanServiceFields = (text) => {
  if (!text) return text;
  return text
    .replace(/^name page[:\s].*$/gmi, '') // Удаляем строки с NAME PAGE
    .replace(/^id[:\s].*$/gmi, '') // Удаляем строки с ID
    .replace(/^section name[:\s].*$/gmi, '') // Удаляем строки с SECTION NAME
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Убираем лишние пустые строки
    .trim();
};

// Ключевые слова для идентификации разделов в тексте
export const SECTION_KEYWORDS = {
  HERO: ['hero', 'главная', 'заголовок', 'главный экран', 'hero section'],
  SERVICES: ['услуги', 'сервисы', 'что мы делаем', 'services', 'what we do', 'our services'],
  FEATURES: ['преимущества', 'особенности', 'почему мы', 'features', 'advantages', 'why us'],
  ABOUT: ['о нас', 'о компании', 'кто мы', 'about us', 'about company', 'who we are'],
  TESTIMONIALS: ['отзывы', 'мнения клиентов', 'что говорят', 'testimonials', 'reviews', 'what people say'],
  FAQ: ['вопросы и ответы', 'часто задаваемые вопросы', 'faq', 'frequently asked questions', 'вопросы'],
  NEWS: ['новости', 'блог', 'события', 'news', 'blog', 'events'],
  CONTACTS: ['контакты', 'свяжитесь с нами', 'связаться', 'contacts', 'contact us', 'get in touch'],
  LEGAL: ['правовые документы', 'документы', 'политика', 'соглашение', 'legal documents', 'policy', 'terms'],
  MERCI: ['merci', 'благодарность', 'спасибо', 'thank you', 'thanks', 'сообщение благодарности'],
  UNIVERSAL: ['универсальная', 'дополнительная', 'универсальная секция', 'universal', 'additional', 'extra']
};

// Функция для определения типа раздела - создает разделы по порядку независимо от содержимого
export const detectSectionType = (sectionName, sectionContent = '', sectionIndex = 0) => {
  const lowerSectionName = sectionName.toLowerCase();
  const lowerContent = sectionContent.toLowerCase();
  
  // Специальные разделы - проверяем по названию (они должны работать по умолчанию)
  const specialSections = {
    'hero': 'HERO',
    'контакты': 'CONTACTS',
    'contacts': 'CONTACTS', 
    'merci': 'MERCI',
    'правовые документы': 'LEGAL',
    'legal documents': 'LEGAL'
  };
  
  // Проверяем специальные разделы по ключевым словам в названии
  for (const [key, type] of Object.entries(specialSections)) {
    if (lowerSectionName.includes(key)) {
      console.log(`🔒 Специальный раздел "${sectionName}" -> ${type}`);
      return type;
    }
  }
  
  // Проверяем специальные разделы по содержимому
  const specialContentIndicators = {
    HERO: ['название сайта', 'заголовок hero', 'главный заголовок', 'site name', 'первая строка - название сайта'],
    CONTACTS: ['телефон:', 'email:', 'адрес:', 'phone:', 'address:', '@', '+7', '+971', '+1'],
    LEGAL: ['политика конфиденциальности', 'пользовательское соглашение', 'privacy policy', 'terms of use', 'cookie policy'],
    MERCI: ['спасибо за обращение', 'благодарим', 'thank you for', 'thanks for', 'сообщение благодарности', 'текст кнопки']
  };
  
  for (const [sectionType, indicators] of Object.entries(specialContentIndicators)) {
    for (const indicator of indicators) {
      if (lowerContent.includes(indicator.toLowerCase())) {
        console.log(`🔒 Специальный раздел по содержимому "${sectionName}" -> ${sectionType}`);
        return sectionType;
      }
    }
  }
  
  // ДЛЯ ВСЕХ ОСТАЛЬНЫХ РАЗДЕЛОВ - АВТОМАТИЧЕСКОЕ РАСПРЕДЕЛЕНИЕ ПО ПОРЯДКУ
  // Каждый раздел получает тип в зависимости от его позиции, независимо от содержимого
  
  // Стандартная последовательность типов разделов (после HERO)
  const sectionTypeSequence = [
    'ABOUT',      // 1-й раздел после HERO
    'SERVICES',   // 2-й раздел после HERO  
    'FEATURES',   // 3-й раздел после HERO
    'TESTIMONIALS', // 4-й раздел после HERO
    'FAQ',        // 5-й раздел после HERO
    'NEWS',       // 6-й раздел после HERO
    'UNIVERSAL'   // Все остальные разделы
  ];
  
  // Определяем тип по индексу раздела
  let assignedType;
  if (sectionIndex < sectionTypeSequence.length) {
    assignedType = sectionTypeSequence[sectionIndex];
  } else {
    assignedType = 'UNIVERSAL';
  }
  
  console.log(`🎯 Автоматическое назначение раздела "${sectionName}" (позиция ${sectionIndex + 1}) -> ${assignedType}`);
  return assignedType;
};

// Функция для генерации случайного телефонного номера, сохраняя исходный формат
const generateRandomEmail = (siteName) => {
  const emailPrefixes = [
    'info', 'contact', 'office', 'hello', 'support', 'mail', 'team', 'admin',
    'service', 'sales', 'clients', 'help', 'legal', 'company', 'director',
    'manager', 'secretary', 'consulting', 'general', 'reception', 'inquiry', 
    'hr', 'jobs', 'career', 'business', 'partners', 'marketing', 'press',
    'welcome', 'connect', 'reach', 'assist', 'communicate', 'engage', 'relate'
  ];
  
  const universalDomains = [
    'businesscorp', 'globalgroup', 'proservice', 'expertteam', 'qualitywork',
    'professional', 'excellence', 'premium', 'worldwide', 'international',
    'consulting', 'solutions', 'services', 'company', 'corporation',
    'enterprise', 'business', 'group', 'team', 'expert', 'quality',
    'reliable', 'trusted', 'leading', 'advanced', 'innovative', 'modern',
    'digital', 'online', 'network', 'global', 'success', 'growth',
    'development', 'progress', 'achievement', 'performance', 'excellence',
    // Добавляем еще 50 универсальных доменов
    'smartbusiness', 'topcompany', 'bestservice', 'quicksolutions', 'fastwork',
    'easyaccess', 'perfectchoice', 'strongteam', 'brightfuture', 'newvision',
    'bigideas', 'freshstart', 'cleanwork', 'sharpfocus', 'deepknowledge',
    'widerange', 'fullservice', 'totalcare', 'maxresults', 'superb-co',
    'first-class', 'top-notch', 'high-end', 'next-level', 'cutting-edge',
    'state-of-art', 'world-class', 'industry-best', 'market-leader', 'trend-setter',
    'game-changer', 'breakthrough', 'milestone', 'benchmark', 'goldstandard',
    'platinum-group', 'diamond-corp', 'crystal-clear', 'rock-solid', 'iron-strong',
    'steel-works', 'titanium-co', 'silver-line', 'copper-solutions', 'bronze-level',
    'emerald-group', 'sapphire-corp', 'ruby-solutions', 'pearl-company', 'amber-works',
    'coral-group', 'jade-solutions', 'opal-corp', 'quartz-company', 'granite-group'
  ];
  
  const randomPrefix = emailPrefixes[Math.floor(Math.random() * emailPrefixes.length)];
  
  if (siteName) {
    // Пытаемся создать домен на основе названия сайта
    let domainName = siteName
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Транслитерация кириллицы
    domainName = domainName.replace(/[а-яё]/g, char => {
      const translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return translit[char] || char;
    });
    
    // Проверяем, остались ли неанглийские символы (китайский, арабский, японский и т.д.)
    const hasNonEnglish = /[^a-z0-9-]/.test(domainName);
    
    // Если остались неанглийские символы или домен слишком короткий/длинный
    if (hasNonEnglish || domainName.length < 2 || domainName.length > 25) {
      // Используем случайный универсальный домен
      const randomDomain = universalDomains[Math.floor(Math.random() * universalDomains.length)];
      return `${randomPrefix}@${randomDomain}.com`;
    } else {
      // Используем обработанное название сайта
      return `${randomPrefix}@${domainName}.com`;
    }
  } else {
    // Если нет названия сайта, используем случайный универсальный домен
    const randomDomain = universalDomains[Math.floor(Math.random() * universalDomains.length)];
    return `${randomPrefix}@${randomDomain}.com`;
  }
};

const generateRandomPhone = (originalPhone) => {
  // Если номер не предоставлен, создаем стандартный российский формат
  if (!originalPhone) {
    const cityCodes = ['495', '499', '812', '383', '343', '831'];
    const cityCode = cityCodes[Math.floor(Math.random() * cityCodes.length)];
    
    // Генерируем 7 случайных цифр
    let digits = '';
    for (let i = 0; i < 7; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    
    return `+7 (${cityCode}) ${digits.substring(0, 3)}-${digits.substring(3, 5)}-${digits.substring(5, 7)}`;
  }
  
  // Извлекаем все цифры из исходного номера
  const allDigits = originalPhone.replace(/\D/g, '');
  
  // Определяем, сколько цифр нужно сохранить с начала (все кроме последних 7)
  const digitsToPersist = Math.max(0, allDigits.length - 7);
  const persistedPart = allDigits.substring(0, digitsToPersist);
  
  // Генерируем 7 случайных цифр для замены
  let randomDigits = '';
  for (let i = 0; i < 7; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }
  
  // Если оригинал содержит только цифры, то просто объединяем части
  if (originalPhone.match(/^\d+$/)) {
    return persistedPart + randomDigits;
  }
  
  // Для форматированных номеров - заменяем последние 7 цифр, сохраняя форматирование
  let result = originalPhone;
  let replacedCount = 0;
  
  // Заменяем цифры с конца, сохраняя форматирование
  for (let i = originalPhone.length - 1; i >= 0 && replacedCount < 7; i--) {
    if (/\d/.test(originalPhone[i])) {
      result = result.substring(0, i) + randomDigits[6 - replacedCount] + result.substring(i + 1);
      replacedCount++;
    }
  }
  
  return result;
};

// Функция для удаления инструкций из текста секции
const cleanSectionContent = (content) => {
  // Удаляем строки, которые похожи на инструкции
  return content
    .split('\n')
    .filter(line => {
      const trimmedLine = line.trim();
      // Фильтруем инструктивные строки и пустые строки
      return trimmedLine && 
        !trimmedLine.match(/^\d+\./) && // Строки вида "1.", "2."
        !trimmedLine.match(/^\[\d+-\d+/) && // Строки вида "[4-6"
        !trimmedLine.match(/^\[[^\]]+\]/) && // Строки в квадратных скобках
        !trimmedLine.match(/^\(/) && // Строки в круглых скобках
        // Убираем лишнюю фильтрацию по ID - пусть парсеры сами обрабатывают ID строки
        // !trimmedLine.match(/^ID[:\s]/i) && // "ID:" или "ID " с любой локализацией 
        trimmedLine !== 'О нас' && // Заголовки навигации
        trimmedLine !== 'Услуги' &&
        trimmedLine !== 'Преимущества' &&
        trimmedLine !== 'Отзывы' &&
        trimmedLine !== 'Вопросы и ответы' &&
        trimmedLine !== 'About Us' &&
        trimmedLine !== 'Services' &&
        trimmedLine !== 'Features' &&
        trimmedLine !== 'Testimonials' &&
        trimmedLine !== 'FAQ';
    })
    .join('\n');
};

export const cleanSectionId = (id) => {
  if (!id) return '';
  return id.toLowerCase()
    // Поддержка всех нужных символов:
    // - латиница, кириллица (a-zа-яё)
    // - китайский основной (\u4e00-\u9fff)
    // - китайский расширенный-A (\u3400-\u4DBF)
    // - китайский расширенный-B (\u20000-\u2A6DF)
    // - китайский совместимости (\uF900-\uFAFF)
    // - корейский хангыль (\uac00-\ud7af)
    // - корейский джамо (\u1100-\u11FF)
    // - корейский совместимости джамо (\u3130-\u318F)
    // - японская хирагана (\u3040-\u309F)
    // - японская катакана (\u30A0-\u30FF)
    // - японская катакана расширенная (\u31F0-\u31FF)
    // - японские пунктуация и символы (\u3000-\u303F)
    // - арабский основной (\u0600-\u06FF)
    // - арабский дополнительный (\u0750-\u077F)
    // - арабский расширенный-A (\u08A0-\u08FF)
    // - арабские формы представления-A (\uFB50-\uFDFF)
    // - арабские формы представления-B (\uFE70-\uFEFF)
    // - иврит (\u0590-\u05FF)
    // - иврит расширенный (\uFB1D-\uFB4F)
    // - хинди деванагари (\u0900-\u097F)
    // - деванагари расширенный (\uA8E0-\uA8FF)
    // - бенгальский (\u0980-\u09FF)
    // - гурмукхи (\u0A00-\u0A7F)
    // - гуджарати (\u0A80-\u0AFF)
    // - тамильский (\u0B80-\u0BFF)
    // - телугу (\u0C00-\u0C7F)
    // - каннада (\u0C80-\u0CFF)
    // - малаялам (\u0D00-\u0D7F)
    // - тайский (\u0E00-\u0E7F)
    // - тайский расширенный (\u0E80-\u0EFF)
    // - греческий и коптский (\u0370-\u03FF)
    // - греческий расширенный (\u1F00-\u1FFF)
    // - вьетнамский (\u0102-\u0103\u0110-\u0111\u0128-\u0129\u0168-\u0169\u01A0-\u01A1\u01AF-\u01B0\u1EA0-\u1EF9)
    // - все диакритические знаки для европейских языков (\u00C0-\u00FF\u0100-\u017F)
    .replace(/[^a-zа-яё0-9\u4e00-\u9fff\u3400-\u4DBF\u20000-\u2A6DF\uF900-\uFAFF\uac00-\ud7af\u1100-\u11FF\u3130-\u318F\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3000-\u303F\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF\uFB1D-\uFB4F\u0900-\u097F\uA8E0-\uA8FF\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0E80-\u0EFF\u0370-\u03FF\u1F00-\u1FFF\u0102-\u0103\u0110-\u0111\u0128-\u0129\u0168-\u0169\u01A0-\u01A1\u01AF-\u01B0\u1EA0-\u1EF9\u00C0-\u00FF\u0100-\u017F]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Функция для создания элемента по типу
const createElementByType = (type, titleParam, content, index, elementData = {}) => {
  const cleanContent = content ? content.replace(/\\+/g, '').trim() : '';
  const baseElement = {
    id: `service_${index + 1}`,
    type: type.toLowerCase(),
    title: titleParam || '',
    content: cleanContent,
    showTitle: true,
    titleColor: '#1976d2',
    contentColor: '#333333',
    borderColor: '#e0e0e0',
    backgroundType: 'solid',
    backgroundColor: '#ffffff'
  };

  // Специфичные настройки для разных типов
  switch (type.toLowerCase()) {
    case 'gradient-text':
      // Поддерживаем как упрощенный формат (только СОДЕРЖИМОЕ), так и расширенный (с ТЕКСТ, НАПРАВЛЕНИЕ, etc.)
      if (elementData.text) {
        // Расширенный формат с полными данными
        return {
          ...baseElement,
          text: elementData.text || 'Градиентный текст',
          direction: elementData.direction || 'to right',
          color1: elementData.color1 || '#ff6b6b',
          color2: elementData.color2 || '#4ecdc4',
          fontSize: parseInt(elementData.fontSize) || 24,
          fontWeight: elementData.fontWeight || 'bold'
        };
      } else {
        // Упрощенный формат: только текст из СОДЕРЖИМОЕ
        return {
          ...baseElement,
          text: cleanContent || 'Градиентный текст',
          direction: 'to right', // значения по умолчанию
          color1: '#ff6b6b',
          color2: '#4ecdc4',
          fontSize: 24,
          fontWeight: 'bold'
        };
      }

    case 'animated-counter':
      // Парсим формат: [число] * [единица измерения] * [описание]
      let counterValue = 0;
      let counterUnit = '';
      let counterDescription = '';
      
      if (cleanContent) {
        const parts = cleanContent.split('*').map(part => part.trim());
        if (parts.length >= 3) {
          // Извлекаем число из первой части
          const numberMatch = parts[0].match(/(\d+)/);
          counterValue = numberMatch ? parseInt(numberMatch[1]) : 0;
          
          // Единица измерения
          counterUnit = parts[1] || '';
          
          // Описание
          counterDescription = parts[2] || '';
        } else if (parts.length === 2) {
          // Если только два элемента: число и описание
          const numberMatch = parts[0].match(/(\d+)/);
          counterValue = numberMatch ? parseInt(numberMatch[1]) : 0;
          counterDescription = parts[1] || '';
        } else {
          // Если один элемент, пытаемся извлечь число
          const numberMatch = cleanContent.match(/(\d+)/);
          counterValue = numberMatch ? parseInt(numberMatch[1]) : 0;
          counterDescription = cleanContent.replace(/\d+/, '').trim();
        }
      }
      
      console.log('[createElementByType] Animated counter parsed:', { 
        counterValue, 
        counterUnit, 
        counterDescription, 
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        // Поля для компонента AnimatedCounter
        title: titleParam || 'Статистика',
        startValue: 0,
        endValue: counterValue,
        suffix: counterUnit,
        duration: 2000, // Длительность анимации в миллисекундах
        titleColor: '#333333',
        countColor: '#1976d2',
        // Дополнительные поля для совместимости
        value: counterValue,
        unit: counterUnit,
        description: counterDescription,
        prefix: '',
        decimals: 0,
        separator: ',', // Разделитель тысяч
        enableAnimation: true,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'list':
      let items = [];
      let listType = 'bulleted';
      let bulletStyle = 'circle';
      let numberStyle = 'decimal';
      let spacing = 'normal';
      let showIcons = false;
      let iconType = 'check';
      let customColors = false;
      let itemColor = '#333333';
      let accentColor = '#1976d2';
      
      // Обрабатываем специальный формат с параметрами
      // Формат: элемент * элемент | listType:numbered | bulletStyle:arrow | accentColor:#e91e63
      if (cleanContent && cleanContent.includes('|')) {
        const parts = cleanContent.split('|').map(part => part.trim());
        const itemsContent = parts[0]; // Первая часть - элементы списка
        
        // Извлекаем элементы списка
        if (itemsContent) {
          items = itemsContent.split('*').map(item => item.trim()).filter(item => item);
        }
        
        // Обрабатываем остальные части как параметры
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          // Обрабатываем как обычные двоеточия, так и экранированные \:
          if (part.includes(':') || part.includes('\\:')) {
            // Заменяем экранированные двоеточия на обычные для парсинга
            const normalizedPart = part.replace(/\\:/g, ':');
            const [key, value] = normalizedPart.split(':').map(s => s.trim());
            switch (key.toLowerCase()) {
              case 'listtype':
                listType = value;
                break;
              case 'bulletstyle':
                bulletStyle = value;
                break;
              case 'numberstyle':
                numberStyle = value;
                break;
              case 'spacing':
                spacing = value;
                break;
              case 'showicons':
                showIcons = value.toLowerCase() === 'true';
                break;
              case 'icontype':
                iconType = value;
                break;
              case 'customcolors':
                customColors = value.toLowerCase() === 'true';
                break;
              case 'itemcolor':
                itemColor = value;
                break;
              case 'accentcolor':
                accentColor = value;
                break;
            }
          }
        }
      } else {
        // Простой формат без параметров
        if (cleanContent) {
          items = cleanContent.split('*').map(item => item.trim()).filter(item => item);
        }
      }
      
      console.log('[createElementByType] List parsed:', { 
        items, 
        listType, 
        bulletStyle, 
        spacing,
        accentColor,
        originalContent: cleanContent 
      });
      
      return {
        id: `service_${index + 1}`,
        type: type.toLowerCase(),
        initialItems: items,
        listType: listType,
        bulletStyle: bulletStyle,
        numberStyle: numberStyle,
        spacing: spacing,
        showIcons: showIcons,
        iconType: iconType,
        customColors: customColors,
        itemColor: itemColor,
        accentColor: accentColor
      };
    case 'table':
      let headers = [];
      let rows = [];
      if (cleanContent) {
        // Поддерживаем несколько форматов таблиц
        if (cleanContent.includes('|')) {
          // Формат с | разделителями
          const lines = cleanContent.split('\n').filter(line => line.trim());
          
          lines.forEach(line => {
            if (line.includes('|')) {
              const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
              if (cells.length > 0 && !line.includes('---')) {
                if (headers.length === 0) {
                  headers.push(...cells);
                } else {
                  rows.push(cells);
                }
              }
            }
          });
        } else if (cleanContent.includes(' - ') && cleanContent.includes('*')) {
          // Формат "ключ - значение * ключ - значение"
          headers = ['Услуга', 'Стоимость'];
          const pairs = cleanContent.split('*').map(pair => pair.trim());
          pairs.forEach(pair => {
            const parts = pair.split(' - ');
            if (parts.length >= 2) {
              const key = parts[0].trim();
              const value = parts.slice(1).join(' - ').trim();
              rows.push([key, value]);
            }
          });
        }
      }
      
      return {
        ...baseElement,
        headers: headers,
        rows: rows
      };
    case 'chart':
      let chartData = [];
      console.log('[createElementByType] Processing chart with content:', cleanContent);
      if (cleanContent) {
        const items = cleanContent.split('*');
        console.log('[createElementByType] Split chart items:', items);
        items.forEach(item => {
          // Поддерживаем оба формата: "label - value" и "label: value"
          let parts;
          if (item.includes(' - ')) {
            // Новый формат: "label - value"
            parts = item.split(' - ');
            console.log('[createElementByType] Using new format (dash)');
          } else if (item.includes(':')) {
            // Старый формат: "label: value"
            parts = item.split(':');
            console.log('[createElementByType] Using old format (colon)');
          }
          
          if (parts && parts.length >= 2) {
            const label = parts[0].trim();
            const value = parseFloat(parts[1].replace(/[^\d.]/g, '')) || 0;
            console.log(`[createElementByType] Creating chart item: label="${label}", value=${value}`);
            chartData.push({ label, value });
          } else {
            console.log('[createElementByType] Could not parse chart item:', item);
          }
        });
      }
      console.log('[createElementByType] Final chart data:', chartData);
      return {
        ...baseElement,
        data: chartData,
        chartType: 'bar'
      };
    case 'blockquote':
      let quote = cleanContent;
      let author = '';
      let source = '';
      
      // Обрабатываем формат "цитата" * автор * источник или цитата \* автор \* источник
      if (cleanContent) {
        // Убираем экранированные символы \*
        const normalizedContent = cleanContent.replace(/\\?\*/g, '*');
        const parts = normalizedContent.split('*').map(part => part.trim());
        
        if (parts.length >= 2) {
          quote = parts[0].trim();
          author = parts[1].trim();
          
          // Если есть третья часть - это источник
          if (parts.length >= 3) {
            source = parts[2].trim();
          }
          
          // Убираем кавычки из цитаты, если они есть
          quote = quote.replace(/^[""](.*)[""]$/, '$1').replace(/^"(.*)"$/, '$1');
        }
      }
      
      console.log('[createElementByType] Blockquote parsed:', { quote, author, source, originalContent: cleanContent });
      
      return {
        ...baseElement,
        quote: quote,
        author: author,
        source: source
      };
    case 'accordion':
      let accordionItems = [];
      console.log('[createElementByType] Processing accordion with title:', titleParam, 'and content:', cleanContent);
      if (cleanContent) {
        // Новый формат: "Заголовок? Содержимое * Заголовок? Содержимое"
        const items = cleanContent.split('*').map(item => item.trim()).filter(item => item);
        console.log('[createElementByType] Split items:', items);
        
        items.forEach((item, index) => {
          // Ищем знак вопроса для разделения заголовка и содержимого
          const questionIndex = item.indexOf('?');
          console.log(`[createElementByType] Item ${index}: "${item}", questionIndex: ${questionIndex}`);
          if (questionIndex !== -1) {
            const question = item.substring(0, questionIndex).trim();
            const answer = item.substring(questionIndex + 1).trim();
            console.log(`[createElementByType] Creating accordion item: question="${question}", answer="${answer}"`);
            accordionItems.push({
              id: index + 1,
              title: question,
              content: answer
            });
          } else {
            // Если нет знака вопроса, создаем элемент с заголовком по умолчанию
            console.log(`[createElementByType] No question mark found, creating default item: "${item}"`);
            accordionItems.push({
              id: index + 1,
              title: `Элемент ${index + 1}`,
              content: item
            });
          }
        });
        
        // Если не удалось разделить, создаем один элемент
        if (accordionItems.length === 0) {
          console.log('[createElementByType] No items created, creating fallback item');
          accordionItems = [{
            id: 1,
            title: titleParam || 'Информация',
            content: cleanContent
          }];
        }
      }
      console.log('[createElementByType] Final accordion items:', accordionItems);
      return {
        ...baseElement,
        items: accordionItems,
        data: {
          title: titleParam || '',
          showTitle: !!titleParam
        }
      };
    case 'testimonial':
      // Синоним для testimonial-card, обрабатываем как простой отзыв
      return {
        ...baseElement,
        author: titleParam || 'Клиент',
        text: cleanContent,
        rating: 5,
        position: 'Клиент',
        company: '',
        type: 'testimonial-card' // Преобразуем в стандартный тип
      };
    case 'imagecard':
    case 'image-card':
      console.log(`🖼️ [createElementByType] Обрабатываем image-card с заголовком: "${titleParam}"`);
      return {
        ...baseElement,
        type: 'image-card',
        category: 'cardComponents',
        data: {
          title: titleParam || 'Карточка с изображением',
          content: cleanContent,
          description: cleanContent,
          imageUrl: 'https://via.placeholder.com/300x200?text=Изображение',
          imageAlt: titleParam || 'Изображение',
          buttonText: '',
          buttonLink: '',
          imagePosition: 'top',
          imageHeight: 200,
          variant: 'elevated',
          size: 'medium',
          alignment: 'left',
          showActions: false,
          gridSize: 'medium',
          animationSettings: {
            animationType: 'fadeIn',
            delay: 0,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          },
          customStyles: {
            backgroundColor: '#ffffff',
            borderColor: '#e0e0e0',
            borderWidth: 1,
            borderRadius: 8,
            textColor: '#333333',
            titleColor: '#1976d2',
            imageFilter: 'none',
            imageOpacity: 1,
            backgroundType: 'solid',
            gradientColor1: '#c41e3a',
            gradientColor2: '#ffd700',
            gradientDirection: 'to right'
          }
        },
        timestamp: new Date().toISOString()
      };
    case 'rich-text':
      // Парсер для богатого текста с поддержкой всех полей
      let richContent = cleanContent;
      let showTitle = true;
      let titleColor = '#1976d2';
      let textColor = '#333333';
      let backgroundColor = 'transparent';
      let padding = 0;
      let borderRadius = 0;
      
      // Обрабатываем специальный формат с параметрами стилизации
      // Формат: содержимое | titleColor:цвет | textColor:цвет | backgroundColor:цвет | showTitle:true/false
      if (cleanContent && cleanContent.includes('|')) {
        // Находим последний параметр стилизации, чтобы правильно разделить контент и параметры
        const lastParamIndex = cleanContent.lastIndexOf('|');
        const contentPart = cleanContent.substring(0, lastParamIndex).trim();
        const paramsPart = cleanContent.substring(lastParamIndex + 1).trim();
        
        // Извлекаем основной контент (все до последнего |)
        richContent = contentPart;
        
        // Обрабатываем параметры стилизации
        const params = [paramsPart];
        // Добавляем остальные параметры, если они есть
        const allParts = cleanContent.split('|').map(part => part.trim());
        for (let i = 1; i < allParts.length - 1; i++) {
          params.push(allParts[i]);
        }
        
        // Обрабатываем параметры стилизации
        for (let i = 0; i < params.length; i++) {
          const part = params[i];
          // Обрабатываем как обычные двоеточия, так и экранированные \:
          if (part.includes(':') || part.includes('\\:')) {
            // Заменяем экранированные двоеточия на обычные для парсинга
            const normalizedPart = part.replace(/\\:/g, ':');
            const [key, value] = normalizedPart.split(':').map(s => s.trim());
            switch (key.toLowerCase()) {
              case 'titlecolor':
                titleColor = value;
                break;
              case 'textcolor':
                textColor = value;
                break;
              case 'backgroundcolor':
                backgroundColor = value;
                break;
              case 'showtitle':
                showTitle = value.toLowerCase() === 'true';
                break;
              case 'padding':
                padding = parseInt(value) || 0;
                break;
              case 'borderradius':
                borderRadius = parseInt(value) || 0;
                break;
            }
          }
        }
      }
      
      console.log('[createElementByType] Rich-text parsed:', { 
        title: titleParam, 
        content: richContent, 
        showTitle, 
        titleColor, 
        textColor, 
        backgroundColor,
        padding,
        borderRadius,
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        title: titleParam,
        content: richContent,
        showTitle: showTitle,
        titleColor: titleColor,
        textColor: textColor,
        backgroundColor: backgroundColor,
        padding: padding,
        borderRadius: borderRadius
      };
    case 'typography':
      // Парсер для typography с поддержкой всех полей стилизации
      let typographyText = cleanContent;
      let variant = 'h2';
      let fontFamily = 'inherit';
      let fontSize = 'inherit';
      let fontWeight = 'normal';
      let fontStyle = 'normal';
      let textDecoration = 'none';
      let textAlign = 'inherit';
      let color = '#000000';
      let lineHeight = 1.5;
      let letterSpacing = 0;
      let textTransform = 'none';
      
      // Обрабатываем специальный формат с параметрами стилизации
      // Формат: текст | variant:h2 | color:#333 | textAlign:center | fontSize:24px
      if (cleanContent && cleanContent.includes('|')) {
        const parts = cleanContent.split('|').map(part => part.trim());
        typographyText = parts[0]; // Первая часть - основной текст
        
        // Обрабатываем остальные части как параметры
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          // Обрабатываем как обычные двоеточия, так и экранированные \:
          if (part.includes(':') || part.includes('\\:')) {
            // Заменяем экранированные двоеточия на обычные для парсинга
            const normalizedPart = part.replace(/\\:/g, ':');
            const [key, value] = normalizedPart.split(':').map(s => s.trim());
            switch (key.toLowerCase()) {
              case 'variant':
                variant = value;
                break;
              case 'fontfamily':
                fontFamily = value;
                break;
              case 'fontsize':
                fontSize = value;
                break;
              case 'fontweight':
                fontWeight = value;
                break;
              case 'fontstyle':
                fontStyle = value;
                break;
              case 'textdecoration':
                textDecoration = value;
                break;
              case 'textalign':
                textAlign = value;
                break;
              case 'color':
                color = value;
                break;
              case 'lineheight':
                lineHeight = parseFloat(value) || 1.5;
                break;
              case 'letterspacing':
                letterSpacing = parseInt(value) || 0;
                break;
              case 'texttransform':
                textTransform = value;
                break;
            }
          }
        }
      }
      
      console.log('[createElementByType] Typography parsed:', { 
        text: typographyText, 
        variant, 
        color, 
        textAlign,
        fontSize,
        fontFamily,
        fontWeight,
        originalContent: cleanContent 
      });
      
      return {
        id: `service_${index + 1}`,
        type: type.toLowerCase(),
        text: typographyText,
        variant: variant,
        customStyles: {
          fontFamily,
          fontSize,
          fontWeight,
          fontStyle,
          textDecoration,
          textAlign,
          color,
          lineHeight,
          letterSpacing,
          textTransform
        }
      };
    case 'codeblock':
      return {
        ...baseElement,
        code: cleanContent,
        language: 'javascript'
      };
    case 'callout':
      // Создаем выноску с пользовательским типом, используя ТИП_ВЫНОСКИ как имя типа
      return {
        id: `service_${index + 1}`,
        type: 'callout',
        title: titleParam || 'Информационный блок',
        content: cleanContent,
        calloutType: 'custom', // Тип выноски для компонента Callout
        showIcon: true,
        isCustomType: true,
        customTypeName: elementData.calloutType || 'Информация', // Используем ТИП_ВЫНОСКИ как имя типа
        backgroundColor: '#e3f2fd',
        borderColor: '#1976d2',
        textColor: '#0d47a1'
      };
    case 'typewriter-text':
      // Парсим тексты для эффекта печатной машинки
      let texts = ['Привет, мир!', 'Добро пожаловать', 'На наш сайт'];
      
      if (cleanContent) {
        // Сначала заменяем экранированные звездочки на обычные, затем разделяем
        const normalizedContent = cleanContent.replace(/\\\*/g, '*');
        texts = normalizedContent.split('*').map(text => text.trim()).filter(text => text);
        
        // Если текстов нет, используем содержимое как один текст
        if (texts.length === 0) {
          texts = [cleanContent];
        }
      }
      
      console.log('[createElementByType] Typewriter-text parsed:', { 
        texts, 
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        texts: texts,
        speed: 150,
        pauseTime: 2000,
        repeat: true,
        textColor: '#333333',
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
    case 'highlight-text':
      // Парсим текст для выделения
      let highlightText = cleanContent || 'Это важный текст с выделением';
      
      console.log('[createElementByType] Highlight-text parsed:', { 
        text: highlightText, 
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        text: highlightText,
        highlightColor: '#ffeb3b',
        textColor: '#333333',
        fontSize: 16,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'testimonial-card':
      // Парсим данные отзыва
      let name = 'Иван Иванов';
      let role = 'Генеральный директор';
      let company = 'ООО "Компания"';
      let content = 'Отличный сервис! Рекомендую всем.';
      let rating = 5;
      
      if (cleanContent) {
        // Сначала заменяем экранированные звездочки на обычные, затем разделяем
        const normalizedContent = cleanContent.replace(/\\\*/g, '*');
        const parts = normalizedContent.split('*').map(part => part.trim()).filter(part => part);
        
        if (parts.length >= 1) name = parts[0];
        if (parts.length >= 2) role = parts[1];
        if (parts.length >= 3) company = parts[2];
        if (parts.length >= 4) content = parts[3];
        if (parts.length >= 5) {
          const ratingValue = parseInt(parts[4]);
          rating = isNaN(ratingValue) ? 5 : Math.min(Math.max(ratingValue, 1), 5);
        }
      }
      
      console.log('[createElementByType] Testimonial-card parsed:', { 
        name, role, company, content, rating,
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        name: name,
        role: role,
        company: company,
        content: content,
        rating: rating,
        avatar: '',
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };



    case 'faq-section':
      // Парсим данные FAQ секции
      let faqItems = [];
      
      if (cleanContent) {
        // Сначала заменяем экранированные звездочки на обычные, затем разделяем
        const normalizedContent = cleanContent.replace(/\\\*/g, '*');
        const pairs = normalizedContent.split('*').map(pair => pair.trim()).filter(pair => pair);
        
        pairs.forEach((pair, index) => {
          // Разделяем вопрос и ответ по знаку вопроса "?"
          const questionMarkIndex = pair.indexOf('?');
          if (questionMarkIndex !== -1) {
            const question = pair.substring(0, questionMarkIndex).trim();
            const answer = pair.substring(questionMarkIndex + 1).trim();
            if (question && answer) {
              faqItems.push({
                id: index + 1,
                question: question,
                answer: answer
              });
            }
          } else {
            // Если нет разделителя ?, пробуем разделить по вертикальной черте (для обратной совместимости)
            const parts = pair.split('|').map(part => part.trim());
            if (parts.length >= 2) {
              const question = parts[0];
              const answer = parts[1];
              faqItems.push({
                id: index + 1,
                question: question,
                answer: answer
              });
            } else {
              // Если нет разделителя, создаем элемент с вопросом по умолчанию
              faqItems.push({
                id: index + 1,
                question: `Вопрос ${index + 1}`,
                answer: pair
              });
            }
          }
        });
      }
      
      // Если не удалось распарсить, создаем элемент по умолчанию
      if (faqItems.length === 0) {
        faqItems = [{
          id: 1,
          question: 'Часто задаваемый вопрос',
          answer: cleanContent || 'Ответ на вопрос'
        }];
      }
      
      console.log('[createElementByType] FAQ-section parsed:', { 
        faqItems,
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        items: faqItems,
        title: titleParam || 'Часто задаваемые вопросы',
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'qr-code':
      console.log('[createElementByType] QR-code parsed:', {
        title: titleParam,
        content: cleanContent,
        originalContent: cleanContent
      });
      return {
        ...baseElement,
        title: titleParam || 'QR код',
        qrData: cleanContent || 'https://example.com',
        size: 200,
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
    case 'rating':
      console.log('[createElementByType] Rating parsed:', {
        title: titleParam,
        content: cleanContent
      });
      // Парсим СОДЕРЖИМОЕ: [текущая оценка] * [подпись/описание]
      const ratingParts = cleanContent.split('*').map(part => part.trim());
      const currentRating = parseInt(ratingParts[0]) || 3;
      const caption = ratingParts[1] || 'Оцените наш сервис:';
      
      return {
        ...baseElement,
        title: titleParam || 'Рейтинг',
        currentRating: currentRating,
        maxRating: 5,
        caption: caption,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'progress-bars':
      console.log('[createElementByType] Progress-bars parsed:', {
        title: titleParam,
        content: cleanContent
      });
      // Парсим СОДЕРЖИМОЕ: [процент] * [описание прогресса]
      const progressParts = cleanContent.split('*').map(part => part.trim());
      const progress = parseInt(progressParts[0]) || 45;
      const progressCaption = progressParts[1] || 'Прогресс загрузки';
      
      return {
        ...baseElement,
        title: titleParam || 'Индикаторы прогресса',
        progress: progress,
        caption: progressCaption,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'timeline-component':
      // Парсим временную шкалу с новым форматом: [год] | [название события] | [описание события] | [статус]
      let timelineItems = [];
      console.log('[createElementByType] Processing timeline with content:', cleanContent);
      
      if (cleanContent) {
        // Разделяем события по звездочкам
        const events = cleanContent.split('*').map(event => event.trim()).filter(event => event);
        console.log('[createElementByType] Split timeline events:', events);
        
        events.forEach((event, index) => {
          // Разделяем поля события по вертикальным чертам
          const fields = event.split('|').map(field => field.trim()).filter(field => field);
          console.log(`[createElementByType] Event ${index} fields:`, fields);
          
          if (fields.length >= 4) {
            // Новый формат: [год] | [название события] | [описание события] | [статус]
            const [date, title, description, status] = fields;
            timelineItems.push({
              id: index + 1,
              date: date,
              title: title,
              description: description,
              status: status.toLowerCase() // Приводим к нижнему регистру для совместимости
            });
          } else if (fields.length >= 2) {
            // Старый формат: [год] [название события]
            const [date, ...titleParts] = fields;
            const title = titleParts.join(' ').trim();
            timelineItems.push({
              id: index + 1,
              date: date,
              title: title,
              description: '',
              status: 'pending' // Статус по умолчанию
            });
          }
        });
      }
      
      console.log('[createElementByType] Final timeline items:', timelineItems);
      
      return {
        ...baseElement,
        title: titleParam || 'Временная шкала',
        items: timelineItems,
        events: timelineItems // Для совместимости с существующим компонентом
      };

    case 'data-table':
      // Парсим таблицу данных с форматом: [колонка 1] | [колонка 2] | [колонка 3] * [значение 1] | [значение 2] | [значение 3]
      let tableHeaders = [];
      let tableRows = [];
      console.log('[createElementByType] Processing data-table with content:', cleanContent);
      
      if (cleanContent) {
        // Разделяем строки по звездочкам
        const rows = cleanContent.split('*').map(row => row.trim()).filter(row => row);
        console.log('[createElementByType] Split table rows:', rows);
        
        rows.forEach((row, index) => {
          // Разделяем колонки по вертикальным чертам
          const columns = row.split('|').map(column => column.trim()).filter(column => column);
          console.log(`[createElementByType] Row ${index} columns:`, columns);
          
          if (index === 0) {
            // Первая строка - заголовки колонок
            tableHeaders = columns.map((header, colIndex) => ({
              id: colIndex + 1,
              label: header,
              sortable: true // По умолчанию все колонки сортируемые
            }));
          } else {
            // Остальные строки - данные
            tableRows.push(columns);
          }
        });
      }
      
      console.log('[createElementByType] Final table headers:', tableHeaders);
      console.log('[createElementByType] Final table rows:', tableRows);
      
      return {
        ...baseElement,
        title: titleParam || 'Таблица данных',
        headers: tableHeaders,
        rows: tableRows,
        // Дополнительные настройки для совместимости с компонентом
        showSorting: true,
        showPagination: false,
        itemsPerPage: 10,
        searchable: false
      };

    case 'multiple-cards':
      // Парсим множественные карточки с форматом: [заголовок карточки 1] * [содержимое карточки 1] * [заголовок карточки 2] * [содержимое карточки 2]
      console.log('[createElementByType] Processing multiple-cards with content:', cleanContent);
      
      let cards = [];
      if (cleanContent) {
        // Убираем экранированные символы \* и разделяем элементы по звездочкам
        const normalizedContent = cleanContent.replace(/\\\*/g, '*');
        const cardItems = normalizedContent.split('*').map(item => item.trim()).filter(item => item);
        console.log('[createElementByType] Split card items:', cardItems);
        
        // Обрабатываем элементы парами: заголовок, содержимое, заголовок, содержимое...
        for (let i = 0; i < cardItems.length; i += 2) {
          if (i + 1 < cardItems.length) {
            const cardTitle = cardItems[i];
            const cardContent = cardItems[i + 1];
            
            cards.push({
              id: Date.now() + i,
              title: cardTitle,
              content: cardContent,
              imageUrl: '', // Изображение добавляется отдельно
              imageAlt: cardTitle,
              buttonText: 'Подробнее',
              buttonLink: '#',
              gridSize: 'medium',
              variant: 'elevated',
              size: 'medium',
              alignment: 'left',
              showActions: false,
              customStyles: {
                backgroundColor: '#ffffff',
                borderColor: '#e0e0e0',
                borderWidth: 1,
                borderRadius: 8,
                textColor: '#333333',
                titleColor: '#1976d2',
                backgroundType: 'solid',
                gradientColor1: '#c41e3a',
                gradientColor2: '#ffd700',
                gradientDirection: 'to right'
              },
              animationSettings: {
                animationType: 'fadeIn',
                delay: i * 0.1,
                triggerOnView: true,
                triggerOnce: true,
                threshold: 0.1,
                disabled: false
              }
            });
          }
        }
      }
      
      console.log('[createElementByType] Final multiple-cards:', cards);
      
      return {
        ...baseElement,
        title: titleParam || 'Множественные карточки',
        description: elementData?.description || 'Секция с несколькими карточками',
        cardType: 'image-card',
        gridSize: 'auto', // Автоматический расчет размера
        cards: cards,
        sectionStyles: {
          titleColor: '#1976d2',
          descriptionColor: '#666666',
          backgroundColor: 'transparent',
          backgroundType: 'transparent',
          gradientDirection: 'to right',
          gradientStartColor: '#1976d2',
          gradientEndColor: '#42a5f5',
          padding: '20px',
          borderRadius: '0px'
        }
      };

    case 'bar-chart':
      // Парсим столбчатую диаграмму с форматом: [Категория 1] - [100] * [Категория 2] - [200] * [Категория 3] - [150]
      console.log('[createElementByType] Processing bar-chart with content:', cleanContent);
      
      let barChartData = [];
      if (cleanContent) {
        // Разделяем данные по звездочкам
        const dataItems = cleanContent.split('*').map(item => item.trim()).filter(item => item);
        console.log('[createElementByType] Split bar-chart data items:', dataItems);
        
        dataItems.forEach((item, index) => {
          // Разделяем категорию и значение по дефису
          const dashIndex = item.lastIndexOf('-');
          if (dashIndex !== -1) {
            const category = item.substring(0, dashIndex).trim();
            const valueStr = item.substring(dashIndex + 1).trim();
            const value = parseInt(valueStr) || 0;
            
            // Генерируем цвет для каждого столбца
            const colors = ['#1976d2', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
            const color = colors[index % colors.length];
            
            barChartData.push({
              label: category,
              name: category, // Для совместимости
              value: value,
              color: color
            });
          } else {
            // Если нет дефиса, пытаемся извлечь число из строки
            const numberMatch = item.match(/(\d+)/);
            if (numberMatch) {
              const value = parseInt(numberMatch[1]);
              const category = item.replace(/\d+/, '').trim() || `Категория ${index + 1}`;
              const colors = ['#1976d2', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
              const color = colors[index % colors.length];
              
              barChartData.push({
                label: category,
                name: category,
                value: value,
                color: color
              });
            }
          }
        });
      }
      
      // Если данных нет, создаем примерные данные
      if (barChartData.length === 0) {
        barChartData = [
          { label: 'Январь', name: 'Январь', value: 65, color: '#1976d2' },
          { label: 'Февраль', name: 'Февраль', value: 45, color: '#2196f3' },
          { label: 'Март', name: 'Март', value: 80, color: '#03a9f4' },
          { label: 'Апрель', name: 'Апрель', value: 55, color: '#00bcd4' }
        ];
      }
      
      console.log('[createElementByType] Final bar-chart data:', barChartData);
      
      return {
        ...baseElement,
        title: titleParam || 'Столбчатая диаграмма',
        description: elementData.description || '', // Добавляем поле описания
        data: barChartData,
        showValues: true,
        showGrid: true,
        animate: true,
        orientation: 'vertical',
        height: 300,
        customStyles: {}, // Создаем пустой объект для пользовательских стилей
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'advanced-line-chart':
      // Парсим линейный график с форматом: [Категория] - [Значение1] - [Значение2] * [Категория] - [Значение1] - [Значение2]
      console.log('[createElementByType] Processing advanced-line-chart with content:', cleanContent);
      
      let lineChartData = [];
      if (cleanContent) {
        // Разделяем данные по звездочкам
        const dataItems = cleanContent.split('*').map(item => item.trim()).filter(item => item);
        console.log('[createElementByType] Split advanced-line-chart data items:', dataItems);
        
        dataItems.forEach((item, index) => {
          // Разделяем категорию и два значения по дефисам
          const parts = item.split('-').map(part => part.trim()).filter(part => part);
          
          if (parts.length >= 3) {
            const category = parts[0];
            const value1 = parseInt(parts[1]) || 0;
            const value2 = parseInt(parts[2]) || 0;
            
            lineChartData.push({
              name: category,
              value: value1,
              value2: value2
            });
          } else if (parts.length === 2) {
            // Если только два значения, используем первое как value, второе как value2
            const category = parts[0];
            const value = parseInt(parts[1]) || 0;
            
            lineChartData.push({
              name: category,
              value: value,
              value2: Math.floor(value * 0.8) // Генерируем второе значение как 80% от первого
            });
          } else if (parts.length === 1) {
            // Если только одно значение, генерируем второе
            const category = parts[0];
            const value = parseInt(category.match(/\d+/)?.[0]) || 50;
            
            lineChartData.push({
              name: category.replace(/\d+/, '').trim() || `Категория ${index + 1}`,
              value: value,
              value2: Math.floor(value * 0.8)
            });
          }
        });
      }
      
      // Если данных нет, создаем примерные данные
      if (lineChartData.length === 0) {
        lineChartData = [
          { name: 'Янв', value: 400, value2: 240 },
          { name: 'Фев', value: 300, value2: 456 },
          { name: 'Мар', value: 300, value2: 139 },
          { name: 'Апр', value: 200, value2: 980 },
          { name: 'Май', value: 278, value2: 390 },
          { name: 'Июн', value: 189, value2: 480 }
        ];
      }
      
      console.log('[createElementByType] Final advanced-line-chart data:', lineChartData);
      
      // Получаем названия линий из elementData или используем значения по умолчанию
      const line1Name = elementData?.line1Name || 'Линия 1';
      const line2Name = elementData?.line2Name || 'Линия 2';
      
      console.log('[createElementByType] Line names:', { line1Name, line2Name });
      
      return {
        ...baseElement,
        title: titleParam || 'Линейный график',
        description: elementData?.description || '',
        data: lineChartData,
        strokeWidth: 2,
        showGrid: true,
        showLegend: true,
        titleColor: '#1976d2',
        backgroundColor: '#ffffff',
        backgroundType: 'solid',
        gradientStart: '#f5f5f5',
        gradientEnd: '#e0e0e0',
        gradientDirection: 'to bottom',
        lineColors: ['#8884d8', '#82ca9d'],
        lineNames: [line1Name, line2Name],
        gridColor: '#e0e0e0',
        axisColor: '#666666',
        tooltipBg: '#ffffff',
        legendColor: '#333333',
        borderRadius: 8,
        padding: 24,
        chartHeight: 300,
        chartWidth: '100%',
        maxWidth: '100%',
        animationSettings: {
          type: 'fadeIn',
          duration: 0.8,
          delay: 0.2
        }
      };

    case 'advanced-pie-chart':
      // Парсим круговую диаграмму с форматом: [Сегмент] - [Значение] * [Сегмент] - [Значение]
      console.log('[createElementByType] Processing advanced-pie-chart with content:', cleanContent);
      
      let pieChartData = [];
      if (cleanContent) {
        // Очищаем контент от экранированных звездочек и других символов
        let cleanedContent = cleanContent
          .replace(/\\\*/g, '*')  // Заменяем \* на *
          .replace(/\\/g, '')     // Убираем оставшиеся обратные слеши
          .replace(/\s+/g, ' ')   // Нормализуем пробелы
          .trim();
        
        console.log('[createElementByType] Cleaned content for advanced-pie-chart:', cleanedContent);
        
        // Разделяем данные по звездочкам
        const dataItems = cleanedContent.split('*').map(item => item.trim()).filter(item => item);
        console.log('[createElementByType] Split advanced-pie-chart data items:', dataItems);
        
        dataItems.forEach((item, index) => {
          console.log(`[createElementByType] Processing pie chart item ${index}: "${item}"`);
          
          // Разделяем название сегмента и значение по дефису
          const dashIndex = item.lastIndexOf('-');
          if (dashIndex !== -1) {
            const segmentName = item.substring(0, dashIndex).trim();
            const valueStr = item.substring(dashIndex + 1).trim();
            const value = parseInt(valueStr) || 0;
            
            console.log(`[createElementByType] Parsed segment: name="${segmentName}", value=${value}`);
            
            pieChartData.push({
              name: segmentName,
              value: value
            });
          } else {
            // Если нет дефиса, пытаемся извлечь число из строки
            const numberMatch = item.match(/(\d+)/);
            if (numberMatch) {
              const value = parseInt(numberMatch[1]);
              const segmentName = item.replace(/\d+/, '').trim() || `Сегмент ${index + 1}`;
              
              console.log(`[createElementByType] Parsed segment (no dash): name="${segmentName}", value=${value}`);
              
              pieChartData.push({
                name: segmentName,
                value: value
              });
            } else {
              // Если не удалось извлечь число, создаем сегмент с названием и значением по умолчанию
              const segmentName = item.trim() || `Сегмент ${index + 1}`;
              const value = 10; // Значение по умолчанию
              
              console.log(`[createElementByType] Created default segment: name="${segmentName}", value=${value}`);
              
              pieChartData.push({
                name: segmentName,
                value: value
              });
            }
          }
        });
      }
      
      // Если данных нет, создаем примерные данные
      if (pieChartData.length === 0) {
        pieChartData = [
          { name: 'Группа A', value: 400 },
          { name: 'Группа B', value: 300 },
          { name: 'Группа C', value: 300 },
          { name: 'Группа D', value: 200 }
        ];
      }
      
      console.log('[createElementByType] Final advanced-pie-chart data:', pieChartData);
      
      return {
        ...baseElement,
        title: titleParam || 'Круговая диаграмма',
        data: pieChartData,
        showLabels: true,
        showPercentage: true,
        titleColor: '#1976d2',
        backgroundColor: '#ffffff',
        backgroundType: 'solid',
        gradientStart: '#f5f5f5',
        gradientEnd: '#e0e0e0',
        gradientDirection: 'to bottom',
        pieColors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'],
        tooltipBg: '#ffffff',
        legendColor: '#333333',
        borderRadius: 1,
        padding: 1,
        chartSize: 700,
        showLegend: true,
        customStyles: {},
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };

    case 'image-gallery':
      // Парсим галерею изображений с простым форматом: описание галереи
      console.log('[createElementByType] Processing image-gallery with content:', cleanContent);
      
      return {
        ...baseElement,
        title: titleParam || 'Галерея изображений',
        description: cleanContent || 'Просмотрите нашу коллекцию изображений', // Используем содержимое как описание
        images: [], // Изображения будут добавлены позже
        // Дополнительные настройки для совместимости с компонентом
        autoScroll: true,
        scrollInterval: 3000,
        position: 'center',
        maxHeight: 400,
        fillContainer: false
      };

    case 'chartjs-doughnut': {
      // Парсим пончиковую диаграмму с форматом: [Сегмент] - [Значение] * [Сегмент] - [Значение]
      console.log('[createElementByType] Processing chartjs-doughnut with content:', cleanContent);
      let labels = [];
      let data = [];
      let backgroundColor = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ];
      let borderColor = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 205, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ];
      let borderWidth = 2;
      if (cleanContent) {
        let cleanedContent = cleanContent
          .replace(/\\\*/g, '*')
          .replace(/\\/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        const dataItems = cleanedContent.split('*').map(item => item.trim()).filter(item => item);
        dataItems.forEach((item, idx) => {
          const dashIndex = item.lastIndexOf('-');
          if (dashIndex !== -1) {
            const label = item.substring(0, dashIndex).trim();
            const valueStr = item.substring(dashIndex + 1).trim();
            const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
            labels.push(label);
            data.push(value);
          } else {
            // Если нет дефиса, пытаемся извлечь число
            const numberMatch = item.match(/(\d+)/);
            if (numberMatch) {
              const value = parseFloat(numberMatch[1]);
              const label = item.replace(/\d+/, '').trim() || `Сегмент ${idx + 1}`;
              labels.push(label);
              data.push(value);
            } else {
              labels.push(item.trim() || `Сегмент ${idx + 1}`);
              data.push(10);
            }
          }
        });
      }
      // Если данных нет, создаем примерные данные
      if (labels.length === 0 || data.length === 0) {
        labels = ['Красный', 'Синий', 'Желтый', 'Зеленый', 'Фиолетовый', 'Оранжевый'];
        data = [12, 19, 3, 5, 2, 3];
      }
      const chartData = {
        labels,
        datasets: [
          {
            label: 'Количество голосов',
            data,
            backgroundColor: backgroundColor.slice(0, labels.length),
            borderColor: borderColor.slice(0, labels.length),
            borderWidth
          }
        ]
      };
      return {
        ...baseElement,
        title: titleParam || 'Пончиковая диаграмма',
        chartData: chartData, // Добавляем chartData для компонента ChartJSDoughnutChart
        data: {
          title: titleParam || 'Пончиковая диаграмма',
          data: chartData,
          showLegend: true,
          titleColor: '#1976d2',
          backgroundColor: '#ffffff',
          backgroundType: 'solid',
          gradientStart: '#f5f5f5',
          gradientEnd: '#e0e0e0',
          gradientDirection: 'to bottom',
          borderRadius: 8,
          padding: 24,
          chartSize: 400,
          cutout: '50%',
          centerText: '',
          showCenterText: false,
          animationSettings: {
            animationType: 'scaleIn',
            delay: 0,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        showLegend: true,
        titleColor: '#1976d2',
        backgroundColor: '#ffffff',
        backgroundType: 'solid',
        gradientStart: '#f5f5f5',
        gradientEnd: '#e0e0e0',
        gradientDirection: 'to bottom',
        borderRadius: 8,
        padding: 24,
        chartSize: 400,
        cutout: '50%',
        centerText: '',
        showCenterText: false,
        animationSettings: {
          animationType: 'scaleIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
    }

    case 'chartjs-bar': {
      // Парсим столбчатую диаграмму Chart.js с множественными наборами данных
      console.log('[createElementByType] Processing chartjs-bar with title:', titleParam);
      console.log('[createElementByType] Processing chartjs-bar with datasets:', elementData.dataset1, elementData.dataset2);
      console.log('[createElementByType] Processing chartjs-bar with labels:', elementData.labels);
      
      // Парсим метки оси X
      let labels = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'];
      if (elementData.labels) {
        // Поддерживаем как запятые, так и другие разделители
        labels = elementData.labels.split(/[,;]/).map(label => label.trim()).filter(label => label);
        console.log('[createElementByType] Parsed labels from МЕТКИ_ОСИ_X:', labels);
      }
      
      let datasets = [];
      
      // Конвертируем HEX цвет в rgba для Chart.js (выносим на уровень функции)
      const hexToRgba = (hex, alpha = 0.8) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      
      // Парсим первый набор данных
      if (elementData.dataset1) {
        console.log('[createElementByType] Parsing dataset1:', elementData.dataset1);
        const dataset1Parts = elementData.dataset1.split(' - ');
        const dataset1Name = dataset1Parts[0] || 'Набор 1';
        const dataset1Color = dataset1Parts[1] && dataset1Parts[1].startsWith('#') ? dataset1Parts[1] : '#1976d2';
        const dataset1Data = [];
        
        console.log('[createElementByType] Dataset1 name:', dataset1Name);
        console.log('[createElementByType] Dataset1 color:', dataset1Color);
        console.log('[createElementByType] Dataset1 parts:', dataset1Parts);
        
        if (dataset1Parts.length > 2) {
          const dataString = dataset1Parts.slice(2).join(' - ');
          console.log('[createElementByType] Dataset1 data string:', dataString);
          // Обрабатываем как обычные, так и экранированные звездочки
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          console.log('[createElementByType] Dataset1 data items:', dataItems);
          
          dataItems.forEach((item, idx) => {
            console.log(`[createElementByType] Processing dataset1 item ${idx}: "${item}"`);
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              console.log(`[createElementByType] Extracted value from "${item}": ${value}`);
              dataset1Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                const value = parseFloat(numberMatch[1]);
                console.log(`[createElementByType] Extracted value from "${item}" (no dash): ${value}`);
                dataset1Data.push(value);
              } else {
                console.log(`[createElementByType] No value found in "${item}", using 0`);
                dataset1Data.push(0);
              }
            }
          });
        }
        
        console.log('[createElementByType] Final dataset1 data:', dataset1Data);
        
        datasets.push({
          label: dataset1Name,
          data: dataset1Data,
          backgroundColor: hexToRgba(dataset1Color, 0.2),
          borderColor: hexToRgba(dataset1Color, 1),
          borderWidth: 1
        });
      }
      
      // Парсим второй набор данных
      if (elementData.dataset2) {
        console.log('[createElementByType] Parsing dataset2:', elementData.dataset2);
        const dataset2Parts = elementData.dataset2.split(' - ');
        const dataset2Name = dataset2Parts[0] || 'Набор 2';
        const dataset2Color = dataset2Parts[1] && dataset2Parts[1].startsWith('#') ? dataset2Parts[1] : '#ff6b6b';
        const dataset2Data = [];
        
        console.log('[createElementByType] Dataset2 name:', dataset2Name);
        console.log('[createElementByType] Dataset2 color:', dataset2Color);
        console.log('[createElementByType] Dataset2 parts:', dataset2Parts);
        
        if (dataset2Parts.length > 2) {
          const dataString = dataset2Parts.slice(2).join(' - ');
          console.log('[createElementByType] Dataset2 data string:', dataString);
          // Обрабатываем как обычные, так и экранированные звездочки
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          console.log('[createElementByType] Dataset2 data items:', dataItems);
          
          dataItems.forEach((item, idx) => {
            console.log(`[createElementByType] Processing dataset2 item ${idx}: "${item}"`);
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              console.log(`[createElementByType] Extracted value from "${item}": ${value}`);
              dataset2Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                const value = parseFloat(numberMatch[1]);
                console.log(`[createElementByType] Extracted value from "${item}" (no dash): ${value}`);
                dataset2Data.push(value);
              } else {
                console.log(`[createElementByType] No value found in "${item}", using 0`);
                dataset2Data.push(0);
              }
            }
          });
        }
        
        console.log('[createElementByType] Final dataset2 data:', dataset2Data);
        
        datasets.push({
          label: dataset2Name,
          data: dataset2Data,
          backgroundColor: hexToRgba(dataset2Color, 0.2),
          borderColor: hexToRgba(dataset2Color, 1),
          borderWidth: 1
        });
      }
      
      // Парсим третий набор данных
      if (elementData.dataset3) {
        console.log('[createElementByType] Parsing dataset3:', elementData.dataset3);
        const dataset3Parts = elementData.dataset3.split(' - ');
        const dataset3Name = dataset3Parts[0] || 'Набор 3';
        const dataset3Color = dataset3Parts[1] && dataset3Parts[1].startsWith('#') ? dataset3Parts[1] : '#4caf50';
        const dataset3Data = [];
        
        console.log('[createElementByType] Dataset3 name:', dataset3Name);
        console.log('[createElementByType] Dataset3 color:', dataset3Color);
        
        if (dataset3Parts.length > 2) {
          const dataString = dataset3Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              dataset3Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                dataset3Data.push(parseFloat(numberMatch[1]));
              } else {
                dataset3Data.push(0);
              }
            }
          });
        }
        
        datasets.push({
          label: dataset3Name,
          data: dataset3Data,
          backgroundColor: hexToRgba(dataset3Color, 0.2),
          borderColor: hexToRgba(dataset3Color, 1),
          borderWidth: 1
        });
      }
      
      // Парсим четвертый набор данных
      if (elementData.dataset4) {
        console.log('[createElementByType] Parsing dataset4:', elementData.dataset4);
        const dataset4Parts = elementData.dataset4.split(' - ');
        const dataset4Name = dataset4Parts[0] || 'Набор 4';
        const dataset4Color = dataset4Parts[1] && dataset4Parts[1].startsWith('#') ? dataset4Parts[1] : '#ff9800';
        const dataset4Data = [];
        
        console.log('[createElementByType] Dataset4 name:', dataset4Name);
        console.log('[createElementByType] Dataset4 color:', dataset4Color);
        
        if (dataset4Parts.length > 2) {
          const dataString = dataset4Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              dataset4Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                dataset4Data.push(parseFloat(numberMatch[1]));
              } else {
                dataset4Data.push(0);
              }
            }
          });
        }
        
        datasets.push({
          label: dataset4Name,
          data: dataset4Data,
          backgroundColor: hexToRgba(dataset4Color, 0.2),
          borderColor: hexToRgba(dataset4Color, 1),
          borderWidth: 1
        });
      }
      
      // Парсим пятый набор данных
      if (elementData.dataset5) {
        console.log('[createElementByType] Parsing dataset5:', elementData.dataset5);
        const dataset5Parts = elementData.dataset5.split(' - ');
        const dataset5Name = dataset5Parts[0] || 'Набор 5';
        const dataset5Color = dataset5Parts[1] && dataset5Parts[1].startsWith('#') ? dataset5Parts[1] : '#9c27b0';
        const dataset5Data = [];
        
        console.log('[createElementByType] Dataset5 name:', dataset5Name);
        console.log('[createElementByType] Dataset5 color:', dataset5Color);
        
        if (dataset5Parts.length > 2) {
          const dataString = dataset5Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              dataset5Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                dataset5Data.push(parseFloat(numberMatch[1]));
              } else {
                dataset5Data.push(0);
              }
            }
          });
        }
        
        datasets.push({
          label: dataset5Name,
          data: dataset5Data,
          backgroundColor: hexToRgba(dataset5Color, 0.2),
          borderColor: hexToRgba(dataset5Color, 1),
          borderWidth: 1
        });
      }
      
      // Если нет наборов данных, используем старый формат
      if (datasets.length === 0 && cleanContent) {
        let cleanedContent = cleanContent
          .replace(/\\\*/g, '*')
          .replace(/\\/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        const dataItems = cleanedContent.split('*').map(item => item.trim()).filter(item => item);
        const data = [];
        
        dataItems.forEach((item, idx) => {
          const dashIndex = item.lastIndexOf('-');
          if (dashIndex !== -1) {
            const valueStr = item.substring(dashIndex + 1).trim();
            const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
            data.push(value);
          } else {
            const numberMatch = item.match(/(\d+)/);
            if (numberMatch) {
              data.push(parseFloat(numberMatch[1]));
            } else {
              data.push(0);
            }
          }
        });
        
        datasets.push({
          label: titleParam || 'Данные',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        });
      }
      
      // Если все еще нет данных, создаем примерные
      if (datasets.length === 0) {
        datasets = [
          {
            label: 'Продажи',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Прибыль',
            data: [2, 3, 20, 5, 1, 4],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ];
      }
      
      console.log('[createElementByType] Final chart data:', { labels, datasets });
      
      const chartData = {
        labels,
        datasets
      };
      
      return {
        ...baseElement,
        title: titleParam || 'Столбчатая диаграмма Chart.js',
        chartData: chartData, // Добавляем chartData для компонента ChartJSBarChart
        data: {
          data: chartData,
          showLegend: true,
          titleColor: elementData.titleColor || '#1976d2',
          backgroundColor: elementData.backgroundColor || '#ffffff',
          backgroundType: elementData.backgroundType || 'solid',
          gradientStart: '#f5f5f5',
          gradientEnd: '#e0e0e0',
          gradientDirection: 'to bottom',
          borderRadius: 8,
          padding: 24,
          chartHeight: 500,
          chartWidth: '100%',
          centerChart: true,
          animationSettings: {
            animationType: 'fadeIn',
            delay: 0,
            triggerOnView: true,
            triggerOnce: true,
            threshold: 0.1,
            disabled: false
          }
        },
        showLegend: true,
        titleColor: elementData.titleColor || '#1976d2',
        backgroundColor: elementData.backgroundColor || '#ffffff',
        backgroundType: elementData.backgroundType || 'solid',
        gradientStart: '#f5f5f5',
        gradientEnd: '#e0e0e0',
        gradientDirection: 'to bottom',
        borderRadius: 8,
        padding: 24,
        chartHeight: 500,
        chartWidth: '100%',
        centerChart: true,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
    }

    case 'advanced-area-chart': {
      // Парсим диаграмму с областями с форматом: [Период] - [Значение1], [Значение2] * [Период] - [Значение1], [Значение2]
      console.log('🔍🔍🔍 [ADVANCED-AREA-CHART PARSER] START');
      console.log('[createElementByType] Processing advanced-area-chart with content:', cleanContent);
      console.log('[createElementByType] titleParam:', titleParam);
      console.log('[createElementByType] elementData:', elementData);
      let areaData = [];
      
      if (cleanContent) {
        let cleanedContent = cleanContent
          .replace(/\\\*/g, '*')
          .replace(/\\/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        console.log('🔧 [PARSER] cleanedContent:', cleanedContent);
        const dataItems = cleanedContent.split('*').map(item => item.trim()).filter(item => item);
        console.log('🔧 [PARSER] dataItems:', dataItems);
        
        dataItems.forEach((item, idx) => {
          console.log(`🔧 [PARSER] Processing item ${idx}:`, item);
          const dashIndex = item.lastIndexOf('-');
          if (dashIndex !== -1) {
            const name = item.substring(0, dashIndex).trim();
            const valuesStr = item.substring(dashIndex + 1).trim();
            const values = valuesStr.split(',').map(v => parseFloat(v.trim().replace(/[^\d.]/g, '')) || 0);
            
            console.log(`🔧 [PARSER] Item ${idx} - name:`, name, 'valuesStr:', valuesStr, 'values:', values);
            
            const dataPoint = {
              name: name || `Период ${idx + 1}`,
              value: values[0] || 0,
              value2: values[1] || 0
            };
            console.log(`🔧 [PARSER] Created dataPoint:`, dataPoint);
            areaData.push(dataPoint);
          } else {
            // Если нет дефиса, пытаемся извлечь числа
            const numberMatches = item.match(/(\d+)/g);
            if (numberMatches && numberMatches.length >= 2) {
              const value = parseFloat(numberMatches[0]);
              const value2 = parseFloat(numberMatches[1]);
              const name = item.replace(/\d+/g, '').trim() || `Период ${idx + 1}`;
              areaData.push({ name, value, value2 });
            } else {
              areaData.push({
                name: item.trim() || `Период ${idx + 1}`,
                value: 400,
                value2: 240
              });
            }
          }
        });
      }
      
      // Если данных нет, создаем примерные данные
      if (areaData.length === 0) {
        areaData = [
          { name: 'Янв', value: 400, value2: 240 },
          { name: 'Фев', value: 300, value2: 456 },
          { name: 'Мар', value: 300, value2: 139 },
          { name: 'Апр', value: 200, value2: 980 },
          { name: 'Май', value: 278, value2: 390 },
          { name: 'Июн', value: 189, value2: 480 }
        ];
      }
      
      console.log('🔧 [PARSER] Final areaData:', areaData);
      console.log('🔧 [PARSER] elementData.line1Name:', elementData.line1Name);
      console.log('🔧 [PARSER] elementData.line2Name:', elementData.line2Name);
      
      const result = {
        ...baseElement,
        title: titleParam || 'Диаграмма с областями',
        data: areaData,
        showGrid: true,
        showLegend: true,
        stacked: true,
        areaNames: [
          elementData.line1Name || 'Область 1',
          elementData.line2Name || 'Область 2'
        ],
        customStyles: {},
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
      
      console.log('🔍🔍🔍 [ADVANCED-AREA-CHART PARSER] RESULT:', result);
      return result;
    }

    case 'apex-line': {
      // Парсим линейную диаграмму ApexCharts с множественными сериями данных
      console.log('[createElementByType] Processing apex-line with series:', elementData.series1, elementData.series2);
      console.log('[createElementByType] Processing apex-line with labels:', elementData.apexLabels);
      
      // Парсим метки оси X
      let labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'];
      if (elementData.apexLabels) {
        labels = elementData.apexLabels.split(',').map(label => label.trim()).filter(label => label);
        console.log('[createElementByType] Parsed apex labels from prompt:', labels);
      }
      
      let series = [];
      
      // Конвертируем HEX цвет в rgba для ApexCharts
      const hexToRgba = (hex, alpha = 0.8) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };
      
      // Парсим первую серию данных
      if (elementData.series1) {
        console.log('[createElementByType] Parsing series1:', elementData.series1);
        const series1Parts = elementData.series1.split(' - ');
        const series1Name = series1Parts[0] || 'Серия 1';
        const series1Color = series1Parts[1] && series1Parts[1].startsWith('#') ? series1Parts[1] : '#1976d2';
        const series1Data = [];
        
        console.log('[createElementByType] Series1 name:', series1Name);
        console.log('[createElementByType] Series1 color:', series1Color);
        
        if (series1Parts.length > 2) {
          const dataString = series1Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              series1Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                series1Data.push(parseFloat(numberMatch[1]));
              } else {
                series1Data.push(0);
              }
            }
          });
        }
        
        series.push({
          name: series1Name,
          data: series1Data,
          color: series1Color
        });
      }
      
      // Парсим вторую серию данных
      if (elementData.series2) {
        console.log('[createElementByType] Parsing series2:', elementData.series2);
        const series2Parts = elementData.series2.split(' - ');
        const series2Name = series2Parts[0] || 'Серия 2';
        const series2Color = series2Parts[1] && series2Parts[1].startsWith('#') ? series2Parts[1] : '#ff6b6b';
        const series2Data = [];
        
        console.log('[createElementByType] Series2 name:', series2Name);
        console.log('[createElementByType] Series2 color:', series2Color);
        
        if (series2Parts.length > 2) {
          const dataString = series2Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              series2Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                series2Data.push(parseFloat(numberMatch[1]));
              } else {
                series2Data.push(0);
              }
            }
          });
        }
        
        series.push({
          name: series2Name,
          data: series2Data,
          color: series2Color
        });
      }
      
      // Парсим третью серию данных
      if (elementData.series3) {
        console.log('[createElementByType] Parsing series3:', elementData.series3);
        const series3Parts = elementData.series3.split(' - ');
        const series3Name = series3Parts[0] || 'Серия 3';
        const series3Color = series3Parts[1] && series3Parts[1].startsWith('#') ? series3Parts[1] : '#4caf50';
        const series3Data = [];
        
        if (series3Parts.length > 2) {
          const dataString = series3Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              series3Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                series3Data.push(parseFloat(numberMatch[1]));
              } else {
                series3Data.push(0);
              }
            }
          });
        }
        
        series.push({
          name: series3Name,
          data: series3Data,
          color: series3Color
        });
      }
      
      // Парсим четвертую серию данных
      if (elementData.series4) {
        console.log('[createElementByType] Parsing series4:', elementData.series4);
        const series4Parts = elementData.series4.split(' - ');
        const series4Name = series4Parts[0] || 'Серия 4';
        const series4Color = series4Parts[1] && series4Parts[1].startsWith('#') ? series4Parts[1] : '#ff9800';
        const series4Data = [];
        
        if (series4Parts.length > 2) {
          const dataString = series4Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              series4Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                series4Data.push(parseFloat(numberMatch[1]));
              } else {
                series4Data.push(0);
              }
            }
          });
        }
        
        series.push({
          name: series4Name,
          data: series4Data,
          color: series4Color
        });
      }
      
      // Парсим пятую серию данных
      if (elementData.series5) {
        console.log('[createElementByType] Parsing series5:', elementData.series5);
        const series5Parts = elementData.series5.split(' - ');
        const series5Name = series5Parts[0] || 'Серия 5';
        const series5Color = series5Parts[1] && series5Parts[1].startsWith('#') ? series5Parts[1] : '#9c27b0';
        const series5Data = [];
        
        if (series5Parts.length > 2) {
          const dataString = series5Parts.slice(2).join(' - ');
          const dataItems = dataString.replace(/\\\*/g, '*').split(' * ').map(item => item.trim()).filter(item => item);
          
          dataItems.forEach((item, idx) => {
            const dashIndex = item.lastIndexOf(' - ');
            if (dashIndex !== -1) {
              const valueStr = item.substring(dashIndex + 3).trim();
              const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
              series5Data.push(value);
            } else {
              const numberMatch = item.match(/(\d+)/);
              if (numberMatch) {
                series5Data.push(parseFloat(numberMatch[1]));
              } else {
                series5Data.push(0);
              }
            }
          });
        }
        
        series.push({
          name: series5Name,
          data: series5Data,
          color: series5Color
        });
      }
      
      // Если нет серий данных, используем старый формат
      if (series.length === 0 && cleanContent) {
        let cleanedContent = cleanContent
          .replace(/\\\*/g, '*')
          .replace(/\\/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        const dataItems = cleanedContent.split('*').map(item => item.trim()).filter(item => item);
        const data = [];
        
        dataItems.forEach((item, idx) => {
          const dashIndex = item.lastIndexOf('-');
          if (dashIndex !== -1) {
            const valueStr = item.substring(dashIndex + 1).trim();
            const value = parseFloat(valueStr.replace(/[^\d.]/g, '')) || 0;
            data.push(value);
          } else {
            const numberMatch = item.match(/(\d+)/);
            if (numberMatch) {
              data.push(parseFloat(numberMatch[1]));
            } else {
              data.push(0);
            }
          }
        });
        
        series.push({
          name: titleParam || 'Данные',
          data: data,
          color: '#1976d2'
        });
      }
      
      // Если все еще нет данных, создаем примерные
      if (series.length === 0) {
        series = [
          {
            name: 'Продажи',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
            color: '#1976d2'
          },
          {
            name: 'Прибыль',
            data: [5, 20, 18, 25, 24, 31, 35, 45, 74],
            color: '#ff6b6b'
          }
        ];
      }
      
      console.log('[createElementByType] Final apex-line data:', { labels, series });
      
      return {
        ...baseElement,
        title: titleParam || 'Линейная диаграмма ApexCharts',
        data: {
          labels,
          series
        },
        showLegend: true,
        titleColor: elementData.titleColor || '#1976d2',
        backgroundColor: elementData.backgroundColor || '#ffffff',
        backgroundType: elementData.backgroundType || 'solid',
        gradientStart: '#f5f5f5',
        gradientEnd: '#e0e0e0',
        gradientDirection: 'to bottom',
        borderRadius: 8,
        padding: 24,
        chartHeight: 300,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
    }

    case 'cta-section': {
      // Парсим CTA секцию: [описание] * [текст кнопки] * [целевая страница]
      let description = '';
      let buttonText = '';
      let targetPage = 'contact';
      
      if (cleanContent) {
        const parts = cleanContent.split('*').map(part => part.trim()).filter(part => part);
        if (parts.length >= 3) {
          description = parts[0];
          buttonText = parts[1];
          targetPage = parts[2];
        } else if (parts.length === 2) {
          description = parts[0];
          buttonText = parts[1];
        } else if (parts.length === 1) {
          description = parts[0];
          buttonText = 'Перейти';
        }
      }
      
      console.log('[createElementByType] CTA section parsed:', { 
        description, 
        buttonText, 
        targetPage, 
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        title: titleParam || 'Призыв к действию',
        description: description || 'Узнайте больше о наших услугах',
        buttonText: buttonText || 'Перейти',
        targetPage: targetPage || 'contact',
        alignment: 'center',
        backgroundType: 'solid',
        backgroundColor: '#1976d2',
        textColor: '#ffffff',
        titleColor: '#ffffff',
        descriptionColor: '#ffffff',
        buttonColor: '#ffd700',
        buttonTextColor: '#000000',
        borderRadius: 12,
        padding: 48,
        buttonBorderRadius: 8,
        showShadow: true,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        },
        colorSettings: {
          textFields: {
            title: '#ffffff',
            description: '#ffffff',
            background: '#1976d2',
            border: 'transparent',
            button: '#ffd700',
            buttonText: '#000000',
            buttonBorderRadius: 8
          },
          sectionBackground: {
            enabled: false,
            useGradient: false,
            solidColor: '#1976d2',
            gradientColor1: '#1976d2',
            gradientColor2: '#42a5f5',
            gradientDirection: 'to right'
          },
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 12,
          padding: 48,
          boxShadow: true
        }
      };
    }

    case 'advanced-contact-form': {
      // Парсим расширенную контактную форму: [метка имени] * [метка email] * [метка телефона] * [метка компании] * [метка темы] * [метка сообщения] * [текст кнопки отправки] * [текст кнопки при отправке] * [текст подписки] * [текст согласия] * [плейсхолдер имени] * [плейсхолдер email] * [плейсхолдер телефона] * [плейсхолдер компании] * [плейсхолдер сообщения] * [опция темы 1] * [опция темы 2] * [опция темы 3] * [опция темы 4]
      let fieldLabels = {
        name: 'Имя',
        email: 'Email',
        phone: 'Телефон',
        company: 'Компания',
        subject: 'Тема обращения',
        message: 'Сообщение',
        newsletter: 'Подписаться на новости',
        terms: 'Я согласен с условиями использования',
        submitButton: 'Отправить',
        submittingButton: 'Отправка...'
      };
      let placeholders = {
        name: 'Введите ваше имя',
        email: 'example@domain.com',
        phone: '+7 (999) 123-45-67',
        company: 'Название компании',
        message: 'Опишите ваш вопрос подробно...'
      };
      let subjectOptions = [
        { value: 'general', label: 'Общий вопрос' },
        { value: 'support', label: 'Техническая поддержка' },
        { value: 'sales', label: 'Отдел продаж' },
        { value: 'partnership', label: 'Партнерство' }
      ];
      
      if (cleanContent) {
        const parts = cleanContent.split('*').map(part => part.trim()).filter(part => part);
        console.log('[createElementByType] Advanced contact form parts:', parts);
        console.log('[createElementByType] Advanced contact form titleParam:', titleParam);
        
        // Ожидаем 19 полей (без заголовка формы в СОДЕРЖИМОЕ)
        if (parts.length >= 19) {
          fieldLabels.name = parts[0];
          fieldLabels.email = parts[1];
          fieldLabels.phone = parts[2];
          fieldLabels.company = parts[3];
          fieldLabels.subject = parts[4];
          fieldLabels.message = parts[5];
          fieldLabels.submitButton = parts[6];
          fieldLabels.submittingButton = parts[7];
          fieldLabels.newsletter = parts[8];
          fieldLabels.terms = parts[9];
          placeholders.name = parts[10];
          placeholders.email = parts[11];
          placeholders.phone = parts[12];
          placeholders.company = parts[13];
          placeholders.message = parts[14];
          subjectOptions[0].label = parts[15];
          subjectOptions[1].label = parts[16];
          subjectOptions[2].label = parts[17];
          subjectOptions[3].label = parts[18];
        } else if (parts.length >= 10) {
          fieldLabels.name = parts[0];
          fieldLabels.email = parts[1];
          fieldLabels.phone = parts[2];
          fieldLabels.company = parts[3];
          fieldLabels.subject = parts[4];
          fieldLabels.message = parts[5];
          fieldLabels.submitButton = parts[6];
          fieldLabels.submittingButton = parts[7];
          fieldLabels.newsletter = parts[8];
          if (parts[9]) fieldLabels.terms = parts[9];
        } else if (parts.length >= 4) {
          fieldLabels.name = parts[0];
          fieldLabels.email = parts[1];
          fieldLabels.phone = parts[2];
          if (parts[3]) fieldLabels.company = parts[3];
          if (parts[4]) fieldLabels.subject = parts[4];
          if (parts[5]) fieldLabels.message = parts[5];
          if (parts[6]) fieldLabels.submitButton = parts[6];
        }
      }
      
      console.log('[createElementByType] Advanced contact form parsed:', { 
        titleParam,
        fieldLabels, 
        placeholders, 
        subjectOptions,
        originalContent: cleanContent 
      });
      
      return {
        ...baseElement,
        title: titleParam || 'Контактная форма',
        formTitle: titleParam || 'Контактная форма',
        fieldLabels: fieldLabels,
        placeholders: placeholders,
        subjectOptions: subjectOptions,
        validationMessages: {
          nameRequired: 'Имя обязательно',
          emailRequired: 'Email обязателен',
          emailInvalid: 'Неверный формат email',
          phoneRequired: 'Телефон обязателен',
          phoneInvalid: 'Неверный формат телефона',
          subjectRequired: 'Выберите тему',
          messageRequired: 'Сообщение обязательно',
          termsRequired: 'Необходимо согласие с условиями'
        },
        alignment: 'center',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        textColor: '#333333',
        titleColor: '#1976d2',
        borderRadius: 12,
        padding: 32,
        showShadow: true,
        animationSettings: {
          animationType: 'fadeIn',
          delay: 0,
          triggerOnView: true,
          triggerOnce: true,
          threshold: 0.1,
          disabled: false
        }
      };
    }



    default:
      return baseElement;
  }
};

// Функция парсинга AI элементов в новом формате
export const parseAIElements = (content) => {
  console.log('parseAIElements получил контент:', content);
  console.log('parseAIElements длина контента:', content.length);
  console.log('parseAIElements первые 200 символов:', content.substring(0, 200));
  const lines = content.split('\n');
  console.log('parseAIElements количество строк:', lines.length);
  const elements = [];
  let currentElement = null;
  let state = 'waiting'; // waiting, type, title, content
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().replace(/\\_/g, '_'); // Убираем экранирование подчеркиваний
    console.log(`🔍 Строка ${i}: "${line}"`);
    
    if (!line) {
      // Для элементов typography, list, gradient-text, typewriter-text, highlight-text, testimonial-card, share-buttons, faq-section, rating, progress-bars, timeline-component, data-table, image-gallery, multiple-cards, bar-chart, advanced-line-chart, advanced-pie-chart, apex-line, cta-section, advanced-contact-form, full-multipage-site заголовок не обязателен
      const requiresTitle = !['typography', 'list', 'gradient-text', 'typewriter-text', 'highlight-text', 'testimonial-card', 'share-buttons', 'faq-section', 'rating', 'progress-bars', 'timeline-component', 'data-table', 'image-gallery', 'multiple-cards', 'bar-chart', 'advanced-line-chart', 'advanced-pie-chart', 'apex-line', 'cta-section', 'advanced-contact-form', 'full-multipage-site'].includes(currentElement?.type?.toLowerCase());
      console.log(`🔍 Пустая строка - currentElement:`, currentElement, `requiresTitle:`, requiresTitle);
      if (currentElement && currentElement.type && (currentElement.title || !requiresTitle)) {
        console.log('🔚 Завершаем элемент на пустой строке:', currentElement);
        console.log('🔚 Содержимое элемента:', currentElement.content);
        elements.push(createElementByType(
          currentElement.type, 
          currentElement.title || '', 
          currentElement.content || '', 
          elements.length,
          currentElement
        ));
        currentElement = null;
        state = 'waiting';
      }
      continue;
    }
    
    if (line.match(/^ТИП:\s*(.+)$/i) || line.match(/^TYPE:\s*(.+)$/i)) {
      // Для элементов typography, list, gradient-text, typewriter-text, highlight-text, testimonial-card, share-buttons, faq-section, rating, progress-bars, timeline-component, data-table, image-gallery, multiple-cards, bar-chart, advanced-line-chart, advanced-pie-chart, advanced-area-chart, apex-line, cta-section, advanced-contact-form, full-multipage-site заголовок не обязателен
      const requiresTitle = !['typography', 'list', 'gradient-text', 'typewriter-text', 'highlight-text', 'testimonial-card', 'share-buttons', 'faq-section', 'rating', 'progress-bars', 'timeline-component', 'data-table', 'image-gallery', 'multiple-cards', 'bar-chart', 'advanced-line-chart', 'advanced-pie-chart', 'advanced-area-chart', 'apex-line', 'cta-section', 'advanced-contact-form', 'full-multipage-site'].includes(currentElement?.type?.toLowerCase());
      if (currentElement && currentElement.type && (currentElement.title || !requiresTitle)) {
        console.log('🔚 Завершаем предыдущий элемент:', currentElement);
        elements.push(createElementByType(
          currentElement.type, 
          currentElement.title || '', 
          currentElement.content || '', 
          elements.length,
          currentElement
        ));
      }
      
      const typeMatch = line.match(/^(?:ТИП|TYPE):\s*(.+)$/i);
      currentElement = {
        type: typeMatch[1].trim(),
        title: '',
        content: '',
        calloutType: '', // Для хранения типа выноски
        // Поля для gradient-text
        text: '',
        direction: '',
        color1: '',
        color2: '',
        fontSize: '',
        fontWeight: '',
        // Поля для advanced-line-chart
        line1Name: '',
        line2Name: '',
        // Поля для chartjs-bar
        dataset1: '',
        dataset2: '',
        dataset3: '',
        dataset4: '',
        dataset5: '',
        labels: '', // Поле для меток оси X
        // Поля для apex-line
        series1: '',
        series2: '',
        series3: '',
        series4: '',
        series5: '',
        apexLabels: '' // Поле для меток оси X в apex-line
      };
      console.log('Создан новый элемент типа:', currentElement.type);
      state = 'type';
      continue;
    }
    
    if (line.match(/^ТИП_ВЫНОСКИ:\s*(.+)$/i) || line.match(/^CALLOUT_TYPE:\s*(.+)$/i)) {
      if (currentElement) {
        const calloutTypeMatch = line.match(/^(?:ТИП_ВЫНОСКИ|CALLOUT_TYPE):\s*(.+)$/i);
        currentElement.calloutType = calloutTypeMatch[1].trim();
        console.log('⭐ Найден ТИП_ВЫНОСКИ:', currentElement.calloutType, 'в строке:', line);
      }
      continue;
    }

    // Поля для gradient-text
    if (line.match(/^ТЕКСТ:\s*(.+)$/i) || line.match(/^TEXT:\s*(.+)$/i)) {
      if (currentElement) {
        const textMatch = line.match(/^(?:ТЕКСТ|TEXT):\s*(.+)$/i);
        currentElement.text = textMatch[1].trim();
        console.log('⭐ Найден ТЕКСТ:', currentElement.text);
      }
      continue;
    }

    if (line.match(/^НАПРАВЛЕНИЕ:\s*(.+)$/i) || line.match(/^DIRECTION:\s*(.+)$/i)) {
      if (currentElement) {
        const directionMatch = line.match(/^(?:НАПРАВЛЕНИЕ|DIRECTION):\s*(.+)$/i);
        currentElement.direction = directionMatch[1].trim();
        console.log('⭐ Найдено НАПРАВЛЕНИЕ:', currentElement.direction);
      }
      continue;
    }

    if (line.match(/^ЦВЕТ1:\s*(.+)$/i) || line.match(/^COLOR1:\s*(.+)$/i)) {
      if (currentElement) {
        const color1Match = line.match(/^(?:ЦВЕТ1|COLOR1):\s*(.+)$/i);
        currentElement.color1 = color1Match[1].trim();
        console.log('⭐ Найден ЦВЕТ1:', currentElement.color1);
      }
      continue;
    }

    if (line.match(/^ЦВЕТ2:\s*(.+)$/i) || line.match(/^COLOR2:\s*(.+)$/i)) {
      if (currentElement) {
        const color2Match = line.match(/^(?:ЦВЕТ2|COLOR2):\s*(.+)$/i);
        currentElement.color2 = color2Match[1].trim();
        console.log('⭐ Найден ЦВЕТ2:', currentElement.color2);
      }
      continue;
    }

    if (line.match(/^РАЗМЕР_ШРИФТА:\s*(.+)$/i) || line.match(/^FONT_SIZE:\s*(.+)$/i)) {
      if (currentElement) {
        const fontSizeMatch = line.match(/^(?:РАЗМЕР_ШРИФТА|FONT_SIZE):\s*(.+)$/i);
        currentElement.fontSize = parseInt(fontSizeMatch[1].trim()) || 24;
        console.log('⭐ Найден РАЗМЕР_ШРИФТА:', currentElement.fontSize);
      }
      continue;
    }

    if (line.match(/^ТОЛЩИНА_ШРИФТА:\s*(.+)$/i) || line.match(/^FONT_WEIGHT:\s*(.+)$/i)) {
      if (currentElement) {
        const fontWeightMatch = line.match(/^(?:ТОЛЩИНА_ШРИФТА|FONT_WEIGHT):\s*(.+)$/i);
        currentElement.fontWeight = fontWeightMatch[1].trim();
        console.log('⭐ Найдена ТОЛЩИНА_ШРИФТА:', currentElement.fontWeight);
      }
      continue;
    }

    if (line.match(/^ЗАГОЛОВОК:\s*(.+)$/i) || line.match(/^TITLE:\s*(.+)$/i)) {
      if (currentElement) {
        const titleMatch = line.match(/^(?:ЗАГОЛОВОК|TITLE):\s*(.+)$/i);
        currentElement.title = titleMatch[1].trim();
        console.log('Установлен заголовок элемента:', currentElement.title);
        state = 'title';
      }
      continue;
    }
    
    // Поля для advanced-line-chart
    if (line.match(/^ЛИНИЯ_1:\s*(.+)$/i) || line.match(/^LINE_1:\s*(.+)$/i)) {
      if (currentElement) {
        const line1Match = line.match(/^(?:ЛИНИЯ_1|LINE_1):\s*(.+)$/i);
        currentElement.line1Name = line1Match[1].trim();
        console.log('📈 Найдено название ЛИНИЯ_1:', currentElement.line1Name);
      }
      continue;
    }
    
    if (line.match(/^ЛИНИЯ_2:\s*(.+)$/i) || line.match(/^LINE_2:\s*(.+)$/i)) {
      if (currentElement) {
        const line2Match = line.match(/^(?:ЛИНИЯ_2|LINE_2):\s*(.+)$/i);
        currentElement.line2Name = line2Match[1].trim();
        console.log('📈 Найдено название ЛИНИЯ_2:', currentElement.line2Name);
      }
      continue;
    }
    
    // Поля для chartjs-bar
    if (line.match(/^ЦВЕТ_ЗАГОЛОВКА:\s*(.+)$/i) || line.match(/^TITLE_COLOR:\s*(.+)$/i)) {
      if (currentElement) {
        const titleColorMatch = line.match(/^(?:ЦВЕТ_ЗАГОЛОВКА|TITLE_COLOR):\s*(.+)$/i);
        currentElement.titleColor = titleColorMatch[1].trim();
        console.log('🎨 Найден ЦВЕТ_ЗАГОЛОВКА:', currentElement.titleColor);
      }
      continue;
    }
    
    if (line.match(/^ЦВЕТ_ФОНА:\s*(.+)$/i) || line.match(/^BACKGROUND_COLOR:\s*(.+)$/i)) {
      if (currentElement) {
        const backgroundColorMatch = line.match(/^(?:ЦВЕТ_ФОНА|BACKGROUND_COLOR):\s*(.+)$/i);
        currentElement.backgroundColor = backgroundColorMatch[1].trim();
        console.log('🎨 Найден ЦВЕТ_ФОНА:', currentElement.backgroundColor);
      }
      continue;
    }
    
    if (line.match(/^ТИП_ФОНА:\s*(.+)$/i) || line.match(/^BACKGROUND_TYPE:\s*(.+)$/i)) {
      if (currentElement) {
        const backgroundTypeMatch = line.match(/^(?:ТИП_ФОНА|BACKGROUND_TYPE):\s*(.+)$/i);
        currentElement.backgroundType = backgroundTypeMatch[1].trim();
        console.log('🎨 Найден ТИП_ФОНА:', currentElement.backgroundType);
      }
      continue;
    }
    
    if (line.match(/^ПОКАЗАТЬ_ЗАГОЛОВОК:\s*(.+)$/i) || line.match(/^SHOW_TITLE:\s*(.+)$/i)) {
      if (currentElement) {
        const showTitleMatch = line.match(/^(?:ПОКАЗАТЬ_ЗАГОЛОВОК|SHOW_TITLE):\s*(.+)$/i);
        currentElement.showTitle = showTitleMatch[1].trim().toLowerCase() === 'да' || showTitleMatch[1].trim().toLowerCase() === 'yes';
        console.log('👁️ Найдено ПОКАЗАТЬ_ЗАГОЛОВОК:', currentElement.showTitle);
      }
      continue;
    }
    
    // Поля для chartjs-bar с множественными наборами данных
    if (line.match(/^НАБОР_ДАННЫХ_1:\s*(.+)$/i) || line.match(/^DATASET_1:\s*(.+)$/i)) {
      if (currentElement) {
        const dataset1Match = line.match(/^(?:НАБОР_ДАННЫХ_1|DATASET_1):\s*(.+)$/i);
        currentElement.dataset1 = dataset1Match[1].trim();
        console.log('📊 Найден НАБОР_ДАННЫХ_1:', currentElement.dataset1);
      }
      continue;
    }
    
    if (line.match(/^МЕТКИ_ОСИ_X:\s*(.+)$/i) || line.match(/^X_AXIS_LABELS:\s*(.+)$/i)) {
      if (currentElement) {
        const labelsMatch = line.match(/^(?:МЕТКИ_ОСИ_X|X_AXIS_LABELS):\s*(.+)$/i);
        currentElement.labels = labelsMatch[1].trim();
        console.log('📊 Найден МЕТКИ_ОСИ_X:', currentElement.labels);
      }
      continue;
    }
    
    if (line.match(/^НАБОР_ДАННЫХ_2:\s*(.+)$/i) || line.match(/^DATASET_2:\s*(.+)$/i)) {
      if (currentElement) {
        const dataset2Match = line.match(/^(?:НАБОР_ДАННЫХ_2|DATASET_2):\s*(.+)$/i);
        currentElement.dataset2 = dataset2Match[1].trim();
        console.log('📊 Найден НАБОР_ДАННЫХ_2:', currentElement.dataset2);
      }
      continue;
    }
    
    if (line.match(/^НАБОР_ДАННЫХ_3:\s*(.+)$/i) || line.match(/^DATASET_3:\s*(.+)$/i)) {
      if (currentElement) {
        const dataset3Match = line.match(/^(?:НАБОР_ДАННЫХ_3|DATASET_3):\s*(.+)$/i);
        currentElement.dataset3 = dataset3Match[1].trim();
        console.log('📊 Найден НАБОР_ДАННЫХ_3:', currentElement.dataset3);
      }
      continue;
    }
    
    if (line.match(/^НАБОР_ДАННЫХ_4:\s*(.+)$/i) || line.match(/^DATASET_4:\s*(.+)$/i)) {
      if (currentElement) {
        const dataset4Match = line.match(/^(?:НАБОР_ДАННЫХ_4|DATASET_4):\s*(.+)$/i);
        currentElement.dataset4 = dataset4Match[1].trim();
        console.log('📊 Найден НАБОР_ДАННЫХ_4:', currentElement.dataset4);
      }
      continue;
    }
    
    if (line.match(/^НАБОР_ДАННЫХ_5:\s*(.+)$/i) || line.match(/^DATASET_5:\s*(.+)$/i)) {
      if (currentElement) {
        const dataset5Match = line.match(/^(?:НАБОР_ДАННЫХ_5|DATASET_5):\s*(.+)$/i);
        currentElement.dataset5 = dataset5Match[1].trim();
        console.log('📊 Найден НАБОР_ДАННЫХ_5:', currentElement.dataset5);
      }
      continue;
    }
    
    // Парсинг для apex-line
    if (line.match(/^МЕТКИ_ОСИ_X:\s*(.+)$/i) || line.match(/^X_AXIS_LABELS:\s*(.+)$/i)) {
      if (currentElement && currentElement.type === 'apex-line') {
        const labelsMatch = line.match(/^(?:МЕТКИ_ОСИ_X|X_AXIS_LABELS):\s*(.+)$/i);
        currentElement.apexLabels = labelsMatch[1].trim();
        console.log('📊 Найден МЕТКИ_ОСИ_X для apex-line:', currentElement.apexLabels);
      }
      continue;
    }
    
    if (line.match(/^СЕРИЯ_1:\s*(.+)$/i) || line.match(/^SERIES_1:\s*(.+)$/i)) {
      if (currentElement && currentElement.type === 'apex-line') {
        const series1Match = line.match(/^(?:СЕРИЯ_1|SERIES_1):\s*(.+)$/i);
        currentElement.series1 = series1Match[1].trim();
        console.log('📊 Найден СЕРИЯ_1:', currentElement.series1);
      }
      continue;
    }
    
    if (line.match(/^СЕРИЯ_2:\s*(.+)$/i) || line.match(/^SERIES_2:\s*(.+)$/i)) {
      if (currentElement && currentElement.type === 'apex-line') {
        const series2Match = line.match(/^(?:СЕРИЯ_2|SERIES_2):\s*(.+)$/i);
        currentElement.series2 = series2Match[1].trim();
        console.log('📊 Найден СЕРИЯ_2:', currentElement.series2);
      }
      continue;
    }
    
    if (line.match(/^СЕРИЯ_3:\s*(.+)$/i) || line.match(/^SERIES_3:\s*(.+)$/i)) {
      if (currentElement && currentElement.type === 'apex-line') {
        const series3Match = line.match(/^(?:СЕРИЯ_3|SERIES_3):\s*(.+)$/i);
        currentElement.series3 = series3Match[1].trim();
        console.log('📊 Найден СЕРИЯ_3:', currentElement.series3);
      }
      continue;
    }
    
    if (line.match(/^СЕРИЯ_4:\s*(.+)$/i) || line.match(/^SERIES_4:\s*(.+)$/i)) {
      if (currentElement && currentElement.type === 'apex-line') {
        const series4Match = line.match(/^(?:СЕРИЯ_4|SERIES_4):\s*(.+)$/i);
        currentElement.series4 = series4Match[1].trim();
        console.log('📊 Найден СЕРИЯ_4:', currentElement.series4);
      }
      continue;
    }
    
    if (line.match(/^СЕРИЯ_5:\s*(.+)$/i) || line.match(/^SERIES_5:\s*(.+)$/i)) {
      if (currentElement && currentElement.type === 'apex-line') {
        const series5Match = line.match(/^(?:СЕРИЯ_5|SERIES_5):\s*(.+)$/i);
        currentElement.series5 = series5Match[1].trim();
        console.log('📊 Найден СЕРИЯ_5:', currentElement.series5);
      }
      continue;
    }
    
    if (line.match(/^СОДЕРЖИМОЕ:\s*(.*)$/i) || line.match(/^CONTENT:\s*(.*)$/i)) {
      if (currentElement) {
        const contentMatch = line.match(/^(?:СОДЕРЖИМОЕ|CONTENT):\s*(.*)$/i);
        let content = contentMatch[1].trim();
        
        // Очищаем контент от экранированных символов
        content = content
          .replace(/\\\*/g, '*')  // Заменяем \* на *
          .replace(/\\/g, '')     // Убираем оставшиеся обратные слеши
          .replace(/\s+/g, ' ')   // Нормализуем пробелы
          .trim();
        
        currentElement.content = content;
        console.log('📝 Установлено содержимое элемента:', currentElement.content);
        console.log('📝 Полный currentElement:', currentElement);
        state = 'content';
      }
      continue;
    }

    // Парсинг поля ОПИСАНИЕ (поддерживаем разные варианты написания)
    if (line.match(/^(?:ОПИСАНИЕ|Описание|описание|DESCRIPTION|Description|description):\s*(.*)$/i)) {
      if (currentElement) {
        const descriptionMatch = line.match(/^(?:ОПИСАНИЕ|Описание|описание|DESCRIPTION|Description|description):\s*(.*)$/i);
        let description = descriptionMatch[1].trim();
        
        // Очищаем описание от экранированных символов
        description = description
          .replace(/\\\*/g, '*')  // Заменяем \* на *
          .replace(/\\/g, '')     // Убираем оставшиеся обратные слеши
          .replace(/\s+/g, ' ')   // Нормализуем пробелы
          .trim();
        
        currentElement.description = description;
        console.log('📝 Установлено описание элемента:', currentElement.description);
        console.log('📝 Полный currentElement:', currentElement);
        state = 'description';
      }
      continue;
    }
    
    // Продолжение содержимого на следующих строках
    if (state === 'content' && currentElement) {
      // Проверяем, не начинается ли новый элемент
      if (!line.match(/^(?:ТИП|TYPE|ТИП_ВЫНОСКИ|CALLOUT_TYPE|ТЕКСТ|TEXT|НАПРАВЛЕНИЕ|DIRECTION|ЦВЕТ1|COLOR1|ЦВЕТ2|COLOR2|РАЗМЕР_ШРИФТА|FONT_SIZE|ТОЛЩИНА_ШРИФТА|FONT_WEIGHT|ЗАГОЛОВОК|TITLE|ЛИНИЯ_1|LINE_1|ЛИНИЯ_2|LINE_2|СОДЕРЖИМОЕ|CONTENT|ОПИСАНИЕ|Описание|описание|DESCRIPTION|Description|description):/i)) {
        currentElement.content += (currentElement.content ? '\n' : '') + line;
      } else {
        // Если встретили новый ключ, обрабатываем его на следующей итерации
        i--; // Возвращаемся на шаг назад
        continue;
      }
    }

    // Продолжение описания на следующих строках
    if (state === 'description' && currentElement) {
      // Проверяем, не начинается ли новый элемент
      if (!line.match(/^(?:ТИП|TYPE|ТИП_ВЫНОСКИ|CALLOUT_TYPE|ТЕКСТ|TEXT|НАПРАВЛЕНИЕ|DIRECTION|ЦВЕТ1|COLOR1|ЦВЕТ2|COLOR2|РАЗМЕР_ШРИФТА|FONT_SIZE|ТОЛЩИНА_ШРИФТА|FONT_WEIGHT|ЗАГОЛОВОК|TITLE|ЛИНИЯ_1|LINE_1|ЛИНИЯ_2|LINE_2|СОДЕРЖИМОЕ|CONTENT|ОПИСАНИЕ|Описание|описание|DESCRIPTION|Description|description):/i)) {
        currentElement.description += (currentElement.description ? ' ' : '') + line;
        console.log('📝 Продолжение описания:', line);
      } else {
        // Если встретили новый ключ, обрабатываем его на следующей итерации
        i--; // Возвращаемся на шаг назад
        continue;
      }
    }
  }
  
  // Добавляем последний элемент
  if (currentElement && currentElement.type) {
    // Для gradient-text создаем элемент даже без заголовка, если есть содержимое
    if (['gradient-text'].includes(currentElement.type.toLowerCase())) {
      // Для градиентного текста достаточно содержимого или текста
      if (currentElement.content || currentElement.text) {
        elements.push(createElementByType(
          currentElement.type, 
          currentElement.title || '', 
          currentElement.content || '', 
          elements.length,
          currentElement
        ));
      }
    } else {
      // Для других типов проверяем заголовок
      const requiresTitle = !['typography', 'list', 'gradient-text', 'typewriter-text', 'highlight-text', 'testimonial-card', 'share-buttons', 'faq-section', 'rating', 'progress-bars', 'timeline-component', 'data-table', 'image-gallery', 'multiple-cards', 'bar-chart', 'advanced-line-chart', 'advanced-pie-chart', 'advanced-area-chart', 'full-multipage-site'].includes(currentElement.type.toLowerCase());
      if (currentElement.title || !requiresTitle) {
        elements.push(createElementByType(
          currentElement.type, 
          currentElement.title || '', 
          currentElement.content || '', 
          elements.length,
          currentElement
        ));
      }
    }
  }
  
  console.log('parseAIElements завершен, найдено элементов:', elements.length);
  console.log('Элементы:', elements);
  console.log('parseAIElements детали элементов:');
  elements.forEach((element, index) => {
    console.log(`  Элемент ${index + 1}:`, {
      type: element.type,
      title: element.title,
      content: element.content?.substring(0, 100) + '...',
      hasContent: !!element.content,
      hasTitle: !!element.title
    });
  });
  return elements;
};

// Универсальная функция парсинга секций с AI элементами
export const parseUniversalSection = (content) => {
  console.log('parseUniversalSection вызвана с контентом:', content);
  try {
    const lines = content.split('\n');
    let sectionId = 'универсальный';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент формат с типами элементов
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    console.log('🔍 Обнаружен новый формат AI элементов:', hasNewFormat);
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов');
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        console.log(`📝 Обрабатываем строку ${i}: "${line}"`);
        console.log(`🔍 isHeaderSection: ${isHeaderSection}, contentStartIndex: ${contentStartIndex}`);
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
            console.log('✅ Установлен ID секции:', sectionId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('📋 Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle) {
            sectionDescription = line;
            console.log('📝 Найдено описание секции:', sectionDescription);
            isHeaderSection = false;
            continue;
          }
        }
        
        // Если заголовочная информация обработана, ищем ТИП:
        if (!isHeaderSection && line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
      }
      
      // Парсим элементы
      let elementsContent = '';
      if (contentStartIndex !== -1) {
        elementsContent = lines.slice(contentStartIndex).join('\n');
        console.log('🧩 Контент для парсинга элементов:', elementsContent);
      } else {
        // Если не нашли ТИП:, но есть контент, попробуем обработать весь контент
        console.log('⚠️ Не найден ТИП:, пробуем обработать весь контент');
        elementsContent = content;
      }
      
      const elements = parseAIElements(elementsContent);
      console.log('🎨 Распарсенные элементы:', elements);
      console.log('🔢 Количество элементов:', elements.length);
      
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'Новая секция',
        description: sectionDescription || 'Описание секции',
        pageName: pageName || '', // Имя страницы для экспорта
        menuName: sectionTitle || sectionId,
        cardType: 'ELEVATED',
        cards: [], // Пустой массив карточек, так как используем elements
        elements: elements, // Массив AI элементов (для совместимости со старой системой)
        contentElements: elements, // Массив AI элементов (для новой системы в index.jsx)
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('🏗️ Создана универсальная секция с элементами:', sectionData);
      console.log('📊 Итоговые элементы в секции:', sectionData.elements);
      console.log('📊 Итоговые contentElements в секции:', sectionData.contentElements);
      console.log('📊 Количество элементов:', sectionData.elements?.length || 0);
      console.log('📊 Количество contentElements:', sectionData.contentElements?.length || 0);
      return sectionData;
    }
    
    // Если не найден новый формат, возвращаем null
    console.log('❌ Не обнаружен формат AI элементов');
    return null;
    
  } catch (error) {
    console.error('💥 Ошибка при парсинге универсальной секции:', error);
    return null;
  }
};

// Функции парсинга для разных типов контента
export const parseServices = (content) => {
  console.log('parseServices вызвана с контентом:', content);
  try {
    const lines = content.split('\n');
    let sectionId = 'services';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент новый формат с типами
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов в услугах');
      console.log('Полный контент:', content);
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let mainContent = '';
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle && line && line.trim() !== '') {
            sectionDescription = line;
            console.log('Найдено описание секции:', sectionDescription);
            continue;
          }
        }
      }
      
      // Если нашли начало контента, берем все от этого места
      if (contentStartIndex >= 0) {
        mainContent = lines.slice(contentStartIndex).join('\n');
      } else {
        // Если не нашли ТИП:, попробуем найти по другим ключевым словам
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].match(/^(?:ЗАГОЛОВОК|TITLE|СОДЕРЖИМОЕ|CONTENT):/i)) {
            mainContent = lines.slice(i).join('\n');
            break;
          }
        }
      }
      
      // Парсим элементы
      console.log('mainContent для парсинга:', mainContent);
      const elements = parseAIElements(mainContent);
      
      // Создаем структуру данных секции с элементами
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'Услуги',
        description: sectionDescription || '',
        pageName: pageName || '', // Имя страницы для экспорта
        cardType: 'ELEVATED',
        elements: elements, // Новые элементы
        contentElements: elements, // Для совместимости с MultiPagePreview
        cards: [], // Пустой массив для обратной совместимости
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('Создана секция услуг с элементами:', sectionData);
      console.log('Количество elements в секции:', sectionData.elements.length);
      console.log('Возвращаем sectionData:', JSON.stringify(sectionData, null, 2));
      return sectionData;
    }
    
    // Старая логика для обратной совместимости
    const cards = [];
    let currentCard = null;
    let isProcessingContacts = false;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Обработка пустых строк
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Проверяем, не начинается ли секция контактной информации
      if (line.toLowerCase().includes('контактная информация')) {
        isProcessingContacts = true;
        if (currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }

      // Пропускаем обработку контактной информации
      if (isProcessingContacts || 
          line.toLowerCase().includes('телефон:') || 
          line.toLowerCase().includes('email:') || 
          line.toLowerCase().includes('адрес:') ||
          line.toLowerCase().includes('мы готовы')) {
        continue;
      }

      // Parse NAME PAGE from line starting with "NAME PAGE:"
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        if (customPageName) {
          pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы услуг:', pageName);
        }
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции услуг:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = cleanServiceFields(line);
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = cleanServiceFields(line);
          isHeaderSection = false;
          continue;
        }
      }

      // Обработка карточек услуг
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `service_${cards.length + 1}`,
            title: cleanServiceFields(line),
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + cleanServiceFields(line);
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanServiceFields(cleanEmailsInText(card.content))
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Юридические услуги',
      description: sectionDescription || '',
      pageName: pageName || '', // Имя страницы для экспорта
      cardType: 'ELEVATED',
      elements: [], // Пустой массив элементов
      contentElements: [], // Пустой массив для совместимости
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff'
      })),
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
  } catch (error) {
    console.error('Ошибка при парсинге секции услуг:', error);
    return null;
  }
};

export const parseHero = (content) => {
  try {
    // Очищаем текст от инструкций
    const cleanedContent = cleanSectionContent(content);
    
    const lines = cleanedContent.split('\n').filter(line => line.trim());
    
    const heroData = {
      siteName: '',
      title: '',
      description: ''
    };
    
    // Берем первые три непустые строки после фильтрации
    if (lines.length >= 1) heroData.siteName = lines[0].trim();
    if (lines.length >= 2) heroData.title = lines[1].trim();
    if (lines.length >= 3) heroData.description = lines[2].trim();
    
    // Проверяем, что данные не пусты
    if (!heroData.siteName || !heroData.title || !heroData.description) {
      console.warn('parseHero: Incomplete hero data', heroData);
    }
    
    return heroData;
  } catch (error) {
    console.error('Error parsing hero section:', error);
    return null;
  }
};

export const parseAdvantagesSection = (content) => {
  console.log('parseAdvantagesSection вызвана с контентом:', content);
  try {
    const lines = content.split('\n');
    let sectionId = 'преимущества';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент формат с типами элементов
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    console.log('🔍 Обнаружен новый формат AI элементов в разделе ПРЕИМУЩЕСТВА:', hasNewFormat);
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов в разделе ПРЕИМУЩЕСТВА');
      console.log('Полный контент:', content);
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        if (!line) continue;
        
        console.log(`📝 Обрабатываем строку ${i}: "${line}"`);
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
            console.log('✅ Установлен ID секции:', sectionId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('📋 Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle) {
            sectionDescription = line;
            console.log('📝 Найдено описание секции:', sectionDescription);
            isHeaderSection = false;
            continue;
          }
        }
        
        // Если заголовочная информация обработана, ищем ТИП:
        if (!isHeaderSection && line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
      }
      
      // Парсим элементы
      let mainContent = '';
      if (contentStartIndex !== -1) {
        mainContent = lines.slice(contentStartIndex).join('\n');
        console.log('🧩 Контент для парсинга элементов:', mainContent);
      } else {
        // Если не нашли ТИП:, но есть контент, попробуем обработать весь контент
        console.log('⚠️ Не найден ТИП:, пробуем обработать весь контент');
        mainContent = content;
      }
      
      console.log('mainContent для парсинга:', mainContent);
      
      const elements = parseAIElements(mainContent);
      console.log('🎨 Распарсенные элементы:', elements);
      console.log('🔢 Количество элементов:', elements.length);
      
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'Наши преимущества',
        description: sectionDescription || 'Описание преимуществ',
        pageName: pageName || '', // Имя страницы для экспорта
        cardType: 'ELEVATED',
        cards: [], // Пустой массив карточек, так как используем elements
        elements: elements, // Массив AI элементов
        contentElements: elements, // Массив AI элементов (для совместимости)
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('Создана секция ПРЕИМУЩЕСТВА с элементами:', sectionData);
      console.log('Количество elements в секции:', elements.length);
      return sectionData;
    } else {
      // Старый формат - парсим как карточки
    let menuText = '';
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Handle empty lines
      if (!line) {
        emptyLineCount++;
        if (emptyLineCount >= 2 && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse NAME PAGE from line starting with "NAME PAGE:"
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        if (customPageName) {
          pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы преимуществ:', pageName);
        }
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции преимуществ:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = cleanServiceFields(line);
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = cleanServiceFields(line);
          isHeaderSection = false;
          continue;
        }
        continue;
      }

      // Обработка карточек преимуществ
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `feature_${cards.length + 1}`,
            title: cleanServiceFields(line),
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + cleanServiceFields(line);
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanServiceFields(cleanEmailsInText(card.content))
    }));

      // Создаем структуру данных секции (старый формат)
    return {
      id: sectionId,
      title: sectionTitle || 'Наши преимущества',
      description: sectionDescription || '',
      pageName: pageName || '', // Имя страницы для экспорта
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff'
      })),
        elements: [], // Пустой массив элементов для старого формата
        contentElements: [], // Пустой массив элементов для старого формата
        titleColor: '#1976d2',
        descriptionColor: '#666666',
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };
    }
  } catch (error) {
    console.error('Error parsing advantages:', error);
    return null;
  }
};

export const parseAboutSection = (content) => {
  console.log('parseAboutSection вызвана с контентом:', content);
  try {
    const lines = content.split('\n');
    let sectionId = 'about';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент формат с типами элементов
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    console.log('🔍 Обнаружен новый формат AI элементов в разделе О НАС:', hasNewFormat);
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов в разделе О НАС');
      console.log('Полный контент:', content);
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        if (!line) continue;
        
        console.log(`📝 Обрабатываем строку ${i}: "${line}"`);
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
            console.log('✅ Установлен ID секции:', sectionId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('📋 Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle) {
            sectionDescription = line;
            console.log('📝 Найдено описание секции:', sectionDescription);
            isHeaderSection = false;
            continue;
          }
        }
        
        // Если заголовочная информация обработана, ищем ТИП:
        if (!isHeaderSection && line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
      }
      
      // Парсим элементы
      let mainContent = '';
      if (contentStartIndex !== -1) {
        mainContent = lines.slice(contentStartIndex).join('\n');
        console.log('🧩 Контент для парсинга элементов:', mainContent);
      } else {
        // Если не нашли ТИП:, но есть контент, попробуем обработать весь контент
        console.log('⚠️ Не найден ТИП:, пробуем обработать весь контент');
        mainContent = content;
      }
      
      console.log('mainContent для парсинга:', mainContent);
      
      const elements = parseAIElements(mainContent);
      console.log('🎨 Распарсенные элементы:', elements);
      console.log('🔢 Количество элементов:', elements.length);
      
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'О нас',
        description: sectionDescription || 'Наша компания',
        pageName: pageName || '', // Имя страницы для экспорта
        cardType: 'ELEVATED',
        cards: [], // Пустой массив карточек, так как используем elements
        elements: elements, // Массив AI элементов
        contentElements: elements, // Массив AI элементов (для совместимости)
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('Создана секция О НАС с элементами:', sectionData);
      console.log('Количество elements в секции:', sectionData.elements.length);
      
      return sectionData;
    }
    
    // СТАРАЯ ЛОГИКА для обратной совместимости
    console.log('Используем старую логику парсинга карточек для раздела О НАС');
    
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Обработка пустых строк
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse NAME PAGE from line starting with "NAME PAGE:"
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        if (customPageName) {
          pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы о нас:', pageName);
        }
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции о нас:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = cleanServiceFields(line);
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = cleanServiceFields(line);
          isHeaderSection = false;
          continue;
        }
      }

      // Обработка карточек "О нас" - используем тот же подход, что и в parseServices
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `about_${cards.length + 1}`,
            title: cleanServiceFields(line),
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + cleanServiceFields(line);
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanServiceFields(cleanEmailsInText(card.content))
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'О нас',
      description: sectionDescription || 'Наша компания',
      pageName: pageName || '', // Имя страницы для экспорта
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      })),
      elements: [], // Пустой массив элементов для старой логики
      contentElements: [], // Пустой массив элементов для совместимости
      link: `#${sectionId}`,
      imagePath: '/images/about.jpg',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
  } catch (error) {
    console.error('Ошибка при парсинге секции о нас:', error);
    return null;
  }
};

export const parseTestimonials = (content) => {
  console.log('parseTestimonials вызвана с контентом:', content);
  try {
    const lines = content.split('\n');
    let sectionId = 'отзывы';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент формат с типами элементов
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    console.log('🔍 Обнаружен новый формат AI элементов в разделе ОТЗЫВЫ:', hasNewFormat);
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов в разделе ОТЗЫВЫ');
      console.log('Полный контент:', content);
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        if (!line) continue;
        
        console.log(`📝 Обрабатываем строку ${i}: "${line}"`);
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
            console.log('✅ Установлен ID секции:', sectionId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('📋 Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle) {
            sectionDescription = line;
            console.log('📝 Найдено описание секции:', sectionDescription);
            isHeaderSection = false;
            continue;
          }
        }
        
        // Если заголовочная информация обработана, ищем ТИП:
        if (!isHeaderSection && line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
      }
      
      // Парсим элементы
      let mainContent = '';
      if (contentStartIndex !== -1) {
        mainContent = lines.slice(contentStartIndex).join('\n');
        console.log('🧩 Контент для парсинга элементов:', mainContent);
      } else {
        // Если не нашли ТИП:, но есть контент, попробуем обработать весь контент
        console.log('⚠️ Не найден ТИП:, пробуем обработать весь контент');
        mainContent = content;
      }
      
      console.log('mainContent для парсинга:', mainContent);
      
      const elements = parseAIElements(mainContent);
      console.log('🎨 Распарсенные элементы:', elements);
      console.log('🔢 Количество элементов:', elements.length);
      
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'Отзывы клиентов',
        description: sectionDescription || 'Что говорят наши клиенты',
        pageName: pageName || '', // Имя страницы для экспорта
        cardType: 'ELEVATED',
        cards: [], // Пустой массив карточек, так как используем elements
        elements: elements, // Массив AI элементов
        contentElements: elements, // Массив AI элементов (для совместимости)
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('Создана секция ОТЗЫВЫ с элементами:', sectionData);
      console.log('Количество elements в секции:', elements.length);
      return sectionData;
    } else {
      // Старый формат - парсим как карточки
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Обработка пустых строк
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse NAME PAGE from line starting with "NAME PAGE:"
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        if (customPageName) {
          pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы отзывов:', pageName);
        }
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции отзывов:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = cleanServiceFields(line);
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = cleanServiceFields(line);
          isHeaderSection = false;
          continue;
        }
      }

      // Обработка карточек отзывов
      if (sectionDescription && !isHeaderSection) {
        // Если это имя автора (короткая строка)
        if (line.length < 50 && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `testimonial_${cards.length + 1}`,
            author: line,
            content: ''
          };
        } else if (currentCard) {
          // Добавляем текст отзыва
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Добавляем последнюю карточку, если она есть
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в отзывах
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanServiceFields(cleanEmailsInText(card.content))
    }));

      // Создаем структуру данных секции (старый формат)
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Отзывы клиентов',
      description: sectionDescription || '',
      pageName: pageName || '', // Имя страницы для экспорта
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        title: card.author, // Используем имя автора как заголовок карточки
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      })),
        elements: [], // Пустой массив элементов для старого формата
        contentElements: [], // Пустой массив элементов для старого формата
        titleColor: '#1976d2',
        descriptionColor: '#666666',
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
    }
  } catch (error) {
    console.error('Error parsing testimonials:', error);
    return null;
  }
};

export const parseFaq = (content) => {
  console.log('parseFaq вызвана с контентом:', content);
  try {
    const lines = content.split('\n');
    let sectionId = 'вопросы';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент формат с типами элементов
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    console.log('🔍 Обнаружен новый формат AI элементов в разделе ВОПРОСЫ:', hasNewFormat);
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов в разделе ВОПРОСЫ');
      console.log('Полный контент:', content);
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        if (!line) continue;
        
        console.log(`📝 Обрабатываем строку ${i}: "${line}"`);
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
            console.log('✅ Установлен ID секции:', sectionId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('📋 Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle) {
            sectionDescription = line;
            console.log('📝 Найдено описание секции:', sectionDescription);
            isHeaderSection = false;
            continue;
          }
        }
        
        // Если заголовочная информация обработана, ищем ТИП:
        if (!isHeaderSection && line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
      }
      
      // Парсим элементы
      let mainContent = '';
      if (contentStartIndex !== -1) {
        mainContent = lines.slice(contentStartIndex).join('\n');
        console.log('🧩 Контент для парсинга элементов:', mainContent);
      } else {
        // Если не нашли ТИП:, но есть контент, попробуем обработать весь контент
        console.log('⚠️ Не найден ТИП:, пробуем обработать весь контент');
        mainContent = content;
      }
      
      console.log('mainContent для парсинга:', mainContent);
      
      const elements = parseAIElements(mainContent);
      console.log('🎨 Распарсенные элементы:', elements);
      console.log('🔢 Количество элементов:', elements.length);
      
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'Часто задаваемые вопросы',
        description: sectionDescription || 'Ответы на популярные вопросы',
        pageName: pageName || '', // Имя страницы для экспорта
        cardType: 'ACCENT',
        cards: [], // Пустой массив карточек, так как используем elements
        elements: elements, // Массив AI элементов
        contentElements: elements, // Массив AI элементов (для совместимости)
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('Создана секция ВОПРОСЫ с элементами:', sectionData);
      console.log('Количество elements в секции:', elements.length);
      return sectionData;
    } else {
      // Старый формат - парсим как карточки
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Handle empty lines
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse NAME PAGE from line starting with "NAME PAGE:"
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        if (customPageName) {
          pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы вопросов:', pageName);
        }
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Установлен ID секции вопросов и ответов:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = cleanServiceFields(line);
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = cleanServiceFields(line);
          isHeaderSection = false;
          continue;
        }
      }

      // Process FAQ cards
      if (sectionDescription && !isHeaderSection) {
        if ((line.endsWith('?') || line.endsWith('؟') || line.length < 100) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `faq_${cards.length + 1}`,
            title: cleanServiceFields(line),
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + cleanServiceFields(line);
        }
      }
    }

    // Add the last card if exists
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в вопросах и ответах
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content),
      title: cleanEmailsInText(card.title)
    }));

      // Create section data structure (старый формат)
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Часто задаваемые вопросы',
      description: sectionDescription || 'Ответы на популярные вопросы наших клиентов',
      pageName: pageName || '', // Имя страницы для экспорта
      cardType: 'ACCENT',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      })),
        elements: [], // Пустой массив элементов для старого формата
        contentElements: [], // Пустой массив элементов для старого формата
        titleColor: '#1976d2',
        descriptionColor: '#666666',
      link: `#${sectionId}`,
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };

    return sectionData;
    }
  } catch (error) {
    console.error('Error parsing FAQ:', error);
    return null;
  }
};

export const parseNews = (content) => {
  console.log('parseNews вызвана с контентом:', content);
  try {
    console.log('Начинаем парсинг новостей, содержимое:', content.substring(0, 100) + '...');
    
    const lines = content.split('\n');
    let sectionId = 'новости';
    let sectionTitle = '';
    let sectionDescription = '';
    let pageName = '';
    
    // Проверяем, содержит ли контент формат с типами элементов
    const hasNewFormat = content.includes('ТИП:') || content.includes('TYPE:') || 
                         content.includes('ЗАГОЛОВОК:') || content.includes('TITLE:') ||
                         content.includes('СОДЕРЖИМОЕ:') || content.includes('CONTENT:');
    
    console.log('🔍 Обнаружен новый формат AI элементов в разделе НОВОСТИ:', hasNewFormat);
    
    if (hasNewFormat) {
      console.log('Обнаружен новый формат AI элементов в разделе НОВОСТИ');
      console.log('Полный контент:', content);
      
      // Парсим заголовочную информацию
      let isHeaderSection = true;
      let contentStartIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        const line = cleanEmailsInText(lines[i].trim());
        if (!line) continue;
        
        console.log(`📝 Обрабатываем строку ${i}: "${line}"`);
        
        if (line.toLowerCase().match(/^name page[:\s]/i)) {
          const customPageName = line.split(/[:]/)[1].trim();
          if (customPageName) {
            pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            console.log('✅ Установлено имя страницы:', pageName);
          }
          continue;
        }
        
        if (line.toLowerCase().match(/^id[:\s]/i)) {
          const customId = line.split(/[:]/)[1].trim();
          if (customId) {
            sectionId = cleanSectionId(customId);
            console.log('✅ Установлен ID секции:', sectionId);
          }
          continue;
        }
        
        // Если встретили первый ТИП: - значит заголовки закончились
        if (line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
        
        if (isHeaderSection) {
          if (!sectionTitle && line && line.trim() !== '') {
            sectionTitle = line;
            console.log('📋 Найден заголовок секции:', sectionTitle);
            continue;
          }
          if (!sectionDescription && sectionTitle) {
            sectionDescription = line;
            console.log('📝 Найдено описание секции:', sectionDescription);
            isHeaderSection = false;
            continue;
          }
        }
        
        // Если заголовочная информация обработана, ищем ТИП:
        if (!isHeaderSection && line.match(/^(?:ТИП|TYPE):/i)) {
          contentStartIndex = i;
          console.log('🎯 Найден первый ТИП на строке:', i);
          break;
        }
      }
      
      // Парсим элементы
      let mainContent = '';
      if (contentStartIndex !== -1) {
        mainContent = lines.slice(contentStartIndex).join('\n');
        console.log('🧩 Контент для парсинга элементов:', mainContent);
      } else {
        // Если не нашли ТИП:, но есть контент, попробуем обработать весь контент
        console.log('⚠️ Не найден ТИП:, пробуем обработать весь контент');
        mainContent = content;
      }
      
      console.log('mainContent для парсинга:', mainContent);
      
      const elements = parseAIElements(mainContent);
      console.log('🎨 Распарсенные элементы:', elements);
      console.log('🔢 Количество элементов:', elements.length);
      
      const sectionData = {
        id: sectionId,
        title: sectionTitle || 'Новости и события',
        description: sectionDescription || 'Актуальные новости компании',
        pageName: pageName || '', // Имя страницы для экспорта
        cardType: 'ELEVATED',
        cards: [], // Пустой массив карточек, так как используем elements
        elements: elements, // Массив AI элементов
        contentElements: elements, // Массив AI элементов (для совместимости)
        titleColor: '#1976d2',
        descriptionColor: '#666666',
        link: `#${sectionId}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e0e0e0',
        shadowColor: 'rgba(0,0,0,0.1)',
        gradientStart: '#ffffff',
        gradientEnd: '#f5f5f5',
        gradientDirection: 'to right'
      };
      
      console.log('Создана секция НОВОСТИ с элементами:', sectionData);
      console.log('Количество elements в секции:', elements.length);
      return sectionData;
    } else {
      // Старый формат - парсим как карточки
    const cards = [];
    let currentCard = null;
    let isHeaderSection = true;
    let emptyLineCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = cleanEmailsInText(lines[i].trim());

      // Handle empty lines
      if (!line) {
        emptyLineCount++;
        if ((emptyLineCount >= 2 || i === lines.length - 1) && currentCard && currentCard.content) {
          cards.push(currentCard);
          currentCard = null;
        }
        continue;
      }
      emptyLineCount = 0;

      // Parse NAME PAGE from line starting with "NAME PAGE:"
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        if (customPageName) {
          pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы новостей:', pageName);
        }
        continue;
      }

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = cleanSectionId(customId);
          console.log('Найден ID секции новостей:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = cleanServiceFields(line);
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = cleanServiceFields(line);
          isHeaderSection = false;
          continue;
        }
      }

      // Process news cards
      if (sectionDescription && !isHeaderSection) {
        if ((line.length < 100 || line.includes(':')) && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `${sectionId}_${cards.length + 1}`,
            title: cleanServiceFields(line),
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + cleanServiceFields(line);
        }
      }
    }

    // Add the last card if exists
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в новостях
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content),
      title: cleanEmailsInText(card.title)
    }));

    console.log('Результат парсинга новостей:', { id: sectionId, title: sectionTitle, cards: cleanedCards });

      // Create section data structure (старый формат)
    return {
      id: sectionId,
      title: sectionTitle || 'Новости и события',
      description: sectionDescription || 'Актуальные новости и события нашей компании',
      pageName: pageName || '', // Имя страницы для экспорта
      cardType: 'ELEVATED',
      cards: cleanedCards.map(card => ({
        ...card,
        showTitle: true,
        titleColor: '#1976d2',
        contentColor: '#333333',
        borderColor: '#e0e0e0',
        backgroundType: 'solid',
        backgroundColor: '#ffffff',
        style: {
          borderRadius: '15px',
          shadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
        })),
        elements: [], // Пустой массив элементов для старого формата
        contentElements: [], // Пустой массив элементов для старого формата
        titleColor: '#1976d2',
        descriptionColor: '#666666'
    };
    }
  } catch (error) {
    console.error('Error parsing news:', error);
    return null;
  }
};

export const parseContacts = (content, headerData = {}) => {
  try {
    // Разбиваем текст на блоки, разделенные пустыми строками
    const blocks = content.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
    
    const contactData = {
      title: '',
      description: '',
      companyName: headerData?.siteName || '', // Используем название сайта из headerData
      address: '',
      phone: '',
      email: ''
    };
    
    // Обрабатываем по позициям блоков, а не по ключевым словам
    if (blocks.length >= 1) {
      contactData.title = cleanEmailsInText(blocks[0]);
    }
    
    if (blocks.length >= 2) {
      // Проверяем, если описание в скобках
      const description = blocks[1];
      if (description.startsWith('(') && description.endsWith(')')) {
        contactData.description = cleanEmailsInText(description.slice(1, -1).trim());
      } else {
        contactData.description = cleanEmailsInText(description);
      }
    }
    
    // Оставшиеся блоки обрабатываем как информационные поля в порядке:
    // адрес, телефон, email
    let currentIndex = 2;
    
    // Перебираем оставшиеся блоки и распределяем их по полям
    for (let i = currentIndex; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length >= 1) {
        const line = lines[0];
        
        // Определяем тип информации по содержимому строки
        if (line.toLowerCase().includes('телефон:') || line.match(/\+[\d\s()-]+/)) {
          // Получаем исходный телефон
          let originalPhone = line;
          const phoneRegex = /телефон:?\s*([+\d\s()-]+)/i;
          const phoneMatch = originalPhone.match(phoneRegex);
          if (phoneMatch) {
            originalPhone = phoneMatch[1].trim();
          }
          // Всегда генерируем случайный телефонный номер с сохранением формата
          contactData.phone = generateRandomPhone(originalPhone);
        } else if (line.toLowerCase().includes('email:') || line.includes('@')) {
          // Генерируем email с улучшенной логикой
          contactData.email = generateRandomEmail(headerData?.siteName);
        } else if (!contactData.address) {
          // Если это не телефон и не email, считаем это адресом
          contactData.address = cleanEmailsInText(line);
        }
      }
    }
    
    // Если название компании не было установлено из headerData, используем первую строку
    if (!contactData.companyName && blocks.length > 2) {
      contactData.companyName = cleanEmailsInText(blocks[2]);
    }
    
    console.log('Результат парсинга контактов:', contactData);
    return contactData;
  } catch (error) {
    console.error('Error parsing contacts:', error);
    return null;
  }
};

export const parseLegalDocuments = (content, contactData = {}) => {
  try {
    const documents = {
      privacyPolicy: {
        title: '',
        content: ''
      },
      termsOfService: {
        title: '',
        content: ''
      },
      cookiePolicy: {
        title: '',
        content: ''
      }
    };

    // Нормализуем переносы строк
    const normalizedContent = content.replace(/\r\n/g, '\n');

    // Регулярное выражение для поиска заголовков в скобках в начале строки и последующего текста
    // (?:^|\n) - начало строки или новая строка
    // \s* - возможные пробелы в начале строки
    // \(([^)]+)\) - заголовок в скобках
    // [\s\S]*? - любой текст до следующего заголовка или конца текста
    const documentPattern = /(?:^|\n)\s*\(([^)]+)\)([\s\S]*?)(?=(?:^|\n)\s*\([^)]+\)|$)/g;
    
    // Массив типов документов в порядке их следования
    const documentTypes = ['privacyPolicy', 'termsOfService', 'cookiePolicy'];
    let documentIndex = 0;
    
    let match;
    while ((match = documentPattern.exec(normalizedContent)) !== null) {
      const title = match[1].trim();
      let documentContent = match[2].trim();

      console.log(`Найден документ: ${title}`);

      // Определяем тип документа по порядку следования
      const documentType = documentTypes[documentIndex];
      
      if (documentType && documents[documentType]) {
        // Добавляем заголовок как первую строку контента
        documents[documentType].content = title + '\n\n' + documentContent;
      }
      
      documentIndex++;
    }

    // Добавляем контактную информацию в конец каждого документа, если она доступна
    if (contactData && Object.keys(contactData).length > 0) {
      Object.keys(documents).forEach(docType => {
        if (documents[docType].content && !documents[docType].content.toLowerCase().includes('📞') && 
            !documents[docType].content.toLowerCase().includes('📍') && 
            !documents[docType].content.toLowerCase().includes('📧')) {
          
          let contactBlock = '\n\n';
          
          if (contactData.companyName) {
            contactBlock += `🏢 ${contactData.companyName}\n`;
          }
          
          if (contactData.address) {
            contactBlock += `📍 ${contactData.address}\n`;
          }
          
          if (contactData.phone) {
            contactBlock += `📞 ${contactData.phone}\n`;
          }
          
          if (contactData.email) {
            contactBlock += `📧 ${contactData.email}\n`;
          }
          
          documents[docType].content += contactBlock;
        }
      });
    }

    return documents;
  } catch (error) {
    console.error('Error parsing legal documents:', error);
    return null;
  }
};

export const autoDetectSectionType = (content) => {
  const lowerContent = content.toLowerCase();
  
  for (const [type, keywords] of Object.entries(SECTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword.toLowerCase())) {
        return type;
      }
    }
  }
  
  return 'AUTO';
};

export const parseMerci = (content) => {
  try {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    return {
      message: lines[0] || 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      closeButtonText: lines[1] || 'Закрыть'
    };
  } catch (error) {
    console.error('Error parsing merci section:', error);
    return {
      message: 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.',
      closeButtonText: 'Закрыть'
    };
  }
};

export const parseFullSite = (content, headerData = {}, contactData = {}) => {
  try {
    // Очищаем начальный текст от инструкций и символов экранирования
    let cleanedContent = content;
    
    // Удаляем символы экранирования из разделителей
    cleanedContent = cleanedContent.replace(/\\===/g, '===');
    
    // Удаляем всё от начала до первого === РАЗДЕЛ: если это нужно
    const firstSectionIndex = cleanedContent.indexOf('=== РАЗДЕЛ:');
    if (firstSectionIndex > 0) {
      cleanedContent = cleanedContent.substring(firstSectionIndex);
    }
    
    const sections = {};
    // Стандартный regex для обработки уже очищенного контента
    const sectionRegex = /=== РАЗДЕЛ: ([^=]+) ===([\s\S]*?)=== КОНЕЦ РАЗДЕЛА ===/g;
    let match;

    console.log('Начинаем парсинг полного сайта, количество символов:', cleanedContent.length);

    // Ищем все разделы в контенте
    const allSections = [];
    while ((match = sectionRegex.exec(cleanedContent)) !== null) {
      const sectionName = match[1].trim();
      const sectionContent = match[2].trim();
      allSections.push({ name: sectionName, content: sectionContent });
    }
    
    console.log('Найдены разделы:', allSections.map(s => s.name));

    // Обрабатываем каждый раздел
    let nonSpecialSectionIndex = 0; // Счетчик для обычных разделов (не HERO, CONTACTS, MERCI, LEGAL)
    
    for (let i = 0; i < allSections.length; i++) {
      const section = allSections[i];
      const sectionName = section.name;
      const sectionContent = section.content;
      
      console.log(`Обрабатываем раздел: ${sectionName}, длина контента: ${sectionContent.length}`);
      console.log(`Содержимое раздела ${sectionName}:`, sectionContent.substring(0, 200) + '...');

      try {
        // Определяем тип раздела с помощью умной функции
        const sectionType = detectSectionType(sectionName, sectionContent, nonSpecialSectionIndex);
        console.log(`🔍 Определен тип раздела "${sectionName}" -> ${sectionType}`);
        
        // Увеличиваем счетчик только для обычных разделов
        if (!['HERO', 'CONTACTS', 'MERCI', 'LEGAL'].includes(sectionType)) {
          nonSpecialSectionIndex++;
        }
        
        switch (sectionType) {
          case 'HERO':
            sections.hero = parseHero(sectionContent);
            console.log('Результат парсинга Hero:', sections.hero);
            if (!sections.hero) {
              console.error('parseHero вернул null для раздела', sectionName);
            }
            break;
          case 'SERVICES':
            sections.services = parseServices(sectionContent);
            console.log('Результат парсинга Services:', sections.services);
            if (!sections.services) {
              console.error('parseServices вернул null для раздела', sectionName);
            }
            break;
          case 'ABOUT':
            sections.about = parseAboutSection(sectionContent);
            console.log('Результат парсинга About:', sections.about);
            if (!sections.about) {
              console.error('parseAboutSection вернул null для раздела', sectionName);
            }
            break;
          case 'FEATURES':
            sections.features = parseAdvantagesSection(sectionContent);
            console.log('Результат парсинга Features:', sections.features);
            if (!sections.features) {
              console.error('parseAdvantagesSection вернул null для раздела', sectionName);
            }
            break;
          case 'TESTIMONIALS':
            sections.testimonials = parseTestimonials(sectionContent);
            console.log('Результат парсинга Testimonials:', sections.testimonials);
            if (!sections.testimonials) {
              console.error('parseTestimonials вернул null для раздела', sectionName);
            }
            break;
          case 'FAQ':
            sections.faq = parseFaq(sectionContent);
            console.log('Результат парсинга FAQ:', sections.faq);
            if (!sections.faq) {
              console.error('parseFaq вернул null для раздела', sectionName);
            }
            break;
          case 'NEWS':
            sections.news = parseNews(sectionContent);
            console.log('Результат парсинга новостей в полном сайте:', sections.news);
            if (!sections.news) {
              console.error('parseNews вернул null для раздела', sectionName);
            }
            break;
          case 'CONTACTS':
            sections.contacts = parseContactsFull(sectionContent, headerData);
            console.log('Результат парсинга Contacts:', sections.contacts);
            if (!sections.contacts) {
              console.error('parseContactsFull вернул null для раздела', sectionName);
            }
            break;
          case 'MERCI':
            sections.merci = parseMerci(sectionContent);
            console.log('Результат парсинга Merci:', sections.merci);
            if (!sections.merci) {
              console.error('parseMerci вернул null для раздела', sectionName);
            }
            break;
          case 'LEGAL':
            sections.legalDocuments = parseLegalDocuments(sectionContent, contactData);
            console.log('Результат парсинга Legal Documents:', sections.legalDocuments);
            if (!sections.legalDocuments) {
              console.error('parseLegalDocuments вернул null для раздела', sectionName);
            }
            break;
          case 'UNIVERSAL':
            sections.universal = parseUniversalSection(sectionContent);
            console.log('Результат парсинга Universal Section:', sections.universal);
            if (!sections.universal) {
              console.error('parseUniversalSection вернул null для раздела', sectionName);
            }
            break;
          default:
            console.log(`❌ Неизвестный тип раздела: ${sectionType} для "${sectionName}"`);
            // Попробуем обработать как универсальную секцию
            sections.universal = parseUniversalSection(sectionContent);
            console.log('Обработан как универсальная секция:', sections.universal);
        }
      } catch (sectionError) {
        console.error(`Ошибка при парсинге раздела ${sectionName}:`, sectionError);
      }
    }

    console.log('Итоговые результаты парсинга:', sections);
    if (sections.services) {
      console.log('Секция services в итоговом результате:', sections.services);
      console.log('Элементы в services:', sections.services.elements ? sections.services.elements.length : 'нет поля elements');
    }
    return sections;
  } catch (error) {
    console.error('Error parsing full site content:', error);
    return null;
  }
};

// Специальная функция для обработки контактов в полном формате сайта
export const parseContactsFull = (content, headerData = {}) => {
  try {
    // Разбиваем текст на блоки, разделенные пустыми строками
    const blocks = content.split(/\n\s*\n/).map(block => block.trim()).filter(block => block);
    
    const contactData = {
      title: '',
      description: '',
      companyName: headerData?.siteName || '', // Используем название сайта из headerData
      address: '',
      phone: '',
      email: '',
      pageName: '' // Добавляем поле pageName
    };
    
    // Обрабатываем строки для поиска NAME PAGE
    const lines = content.split('\n');
    console.log('🔍 parseContactsFull: Обрабатываем контент контактов:', content);
    for (const line of lines) {
      console.log('🔍 parseContactsFull: Проверяем строку:', line);
      if (line.toLowerCase().match(/^name page[:\s]/i)) {
        const customPageName = line.split(/[:]/)[1].trim();
        console.log('🔍 parseContactsFull: Найдено NAME PAGE:', customPageName);
        if (customPageName) {
          contactData.pageName = customPageName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          console.log('✅ Установлено имя страницы контактов:', contactData.pageName);
        }
        break;
      }
    }
    
    // Обрабатываем по позициям блоков, а не по ключевым словам
    if (blocks.length >= 1) {
      contactData.title = cleanServiceFields(cleanEmailsInText(blocks[0]));
    }
    
    if (blocks.length >= 2) {
      // Проверяем, если описание в скобках
      const description = blocks[1];
      if (description.startsWith('(') && description.endsWith(')')) {
        contactData.description = cleanServiceFields(cleanEmailsInText(description.slice(1, -1).trim()));
      } else {
        contactData.description = cleanServiceFields(cleanEmailsInText(description));
      }
    }
    
    // Оставшиеся блоки обрабатываем как информационные поля в порядке:
    // адрес, телефон, email
    let currentIndex = 2;
    
    // Перебираем оставшиеся блоки и распределяем их по полям
    for (let i = currentIndex; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length >= 1) {
        const line = lines[0];
        
        // Определяем тип информации по содержимому строки
        if (line.toLowerCase().includes('телефон:') || line.match(/\+[\d\s()-]+/)) {
          // Получаем исходный телефон
          let originalPhone = line;
          const phoneRegex = /телефон:?\s*([+\d\s()-]+)/i;
          const phoneMatch = originalPhone.match(phoneRegex);
          if (phoneMatch) {
            originalPhone = phoneMatch[1].trim();
          }
          // Всегда генерируем случайный телефонный номер с сохранением формата
          contactData.phone = generateRandomPhone(originalPhone);
        } else if (line.toLowerCase().includes('email:') || line.includes('@')) {
          // Генерируем email с улучшенной логикой
          contactData.email = generateRandomEmail(headerData?.siteName);
        } else if (!contactData.address) {
          // Если это не телефон и не email, считаем это адресом
          contactData.address = cleanEmailsInText(line);
        }
      }
    }
    
    // Если название компании не было установлено из headerData, используем первую строку
    if (!contactData.companyName && blocks.length > 2) {
      contactData.companyName = cleanEmailsInText(blocks[2]);
    }
    
    console.log('Результат парсинга контактов:', contactData);
    console.log('✅ pageName в результате парсинга контактов:', contactData.pageName);
    return contactData;
  } catch (error) {
    console.error('Error parsing contacts from full site structure:', error);
    return null;
  }
}; 



