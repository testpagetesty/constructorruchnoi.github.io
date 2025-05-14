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

// Ключевые слова для идентификации разделов в тексте
export const SECTION_KEYWORDS = {
  SERVICES: ['услуги', 'сервисы', 'что мы делаем', 'services', 'what we do', 'our services'],
  FEATURES: ['преимущества', 'особенности', 'почему мы', 'features', 'advantages', 'why us'],
  ABOUT: ['о нас', 'о компании', 'кто мы', 'about us', 'about company', 'who we are'],
  TESTIMONIALS: ['отзывы', 'мнения клиентов', 'что говорят', 'testimonials', 'reviews', 'what people say'],
  FAQ: ['вопросы и ответы', 'часто задаваемые вопросы', 'faq', 'frequently asked questions'],
  NEWS: ['новости', 'блог', 'события', 'news', 'blog', 'events'],
  CONTACTS: ['контакты', 'свяжитесь с нами', 'связаться', 'contacts', 'contact us', 'get in touch'],
  LEGAL: ['правовые документы', 'документы', 'политика', 'соглашение', 'legal documents', 'policy', 'terms']
};

// Функция для генерации случайного телефонного номера, сохраняя исходный формат
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
        !trimmedLine.match(/^ID[:\s]/i) && // "ID:" или "ID " с любой локализацией 
        trimmedLine !== 'О нас' && // Заголовки навигации
        trimmedLine !== 'Услуги' &&
        trimmedLine !== 'Преимущества' &&
        trimmedLine !== 'Отзывы' &&
        trimmedLine !== 'Вопросы и ответы';
    })
    .join('\n');
};

// Функции парсинга для разных типов контента
export const parseServices = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'услуги'; // Значение по умолчанию
    let sectionTitle = '';
    let sectionDescription = '';
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

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          // Удаляем все пробелы и специальные символы из ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '_') // Заменяем все специальные символы на _
            .replace(/_+/g, '_') // Заменяем множественные _ на один
            .replace(/^_|_$/g, ''); // Удаляем _ в начале и конце
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
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
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
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
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Юридические услуги',
      description: sectionDescription || '',
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
    console.error('Error parsing services:', error);
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
  try {
    const lines = content.split('\n');
    let sectionId = 'features'; // Default value
    let sectionTitle = '';
    let sectionDescription = '';
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

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
          isHeaderSection = false;
          continue;
        }
        continue;
      }

      // Process advantages cards
      if (!isHeaderSection) {
        // Если строка короткая (заголовок) или это первая карточка
        if (line.length < 100 || !currentCard) {
          // Сохраняем предыдущую карточку, если она есть
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          // Создаем новую карточку
          currentCard = {
            id: `advantage_${cards.length + 1}`,
            title: line,
            content: ''
          };
        } else if (currentCard) {
          // Добавляем контент к текущей карточке
          currentCard.content += (currentCard.content ? '\n' : '') + line;
        }
      }
    }

    // Add the last card if exists
    if (currentCard && currentCard.content) {
      cards.push(currentCard);
    }

    // Очищаем email в описаниях карточек
    const cleanedCards = cards.map(card => ({
      ...card,
      content: cleanEmailsInText(card.content)
    }));

    return {
      id: sectionId,
      title: sectionTitle || 'Наши преимущества',
      description: sectionDescription || 'Почему клиенты выбирают нас',
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
      titleColor: '#1976d2',
      descriptionColor: '#666666',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e0e0e0',
      shadowColor: 'rgba(0,0,0,0.1)',
      gradientStart: '#ffffff',
      gradientEnd: '#f5f5f5',
      gradientDirection: 'to right'
    };
  } catch (error) {
    console.error('Error parsing advantages:', error);
    return null;
  }
};

export const parseAboutSection = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'about'; // Значение по умолчанию
    let sectionTitle = '';
    let sectionDescription = '';
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

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
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
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
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
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'О нас',
      description: sectionDescription || 'Наша компания',
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
    console.error('Error parsing about section:', error);
    return null;
  }
};

export const parseTestimonials = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'отзывы'; // Значение по умолчанию
    let sectionTitle = '';
    let sectionDescription = '';
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

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        }
        isHeaderSection = true;
        continue;
      }

      // Обработка заголовка секции
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
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
      content: cleanEmailsInText(card.content)
    }));

    // Создаем структуру данных секции
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Отзывы клиентов',
      description: sectionDescription || '',
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
    console.error('Error parsing testimonials:', error);
    return null;
  }
};

export const parseFaq = (content) => {
  try {
    const lines = content.split('\n');
    let sectionId = 'faq'; // Default value
    let sectionTitle = '';
    let sectionDescription = '';
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

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
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
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
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

    // Create section data structure
    const sectionData = {
      id: sectionId,
      title: sectionTitle || 'Часто задаваемые вопросы',
      description: sectionDescription || 'Ответы на популярные вопросы наших клиентов',
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
    console.error('Error parsing FAQ:', error);
    return null;
  }
};

export const parseNews = (content) => {
  try {
    console.log('Начинаем парсинг новостей, содержимое:', content.substring(0, 100) + '...');
    
    const lines = content.split('\n');
    let sectionId = 'новости'; // Значение по умолчанию
    let sectionTitle = '';
    let sectionDescription = '';
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

      // Parse section ID from line starting with "ID:"
      if (line.toLowerCase().match(/^id[:\s]/i)) {
        const customId = line.split(/[:]/)[1].trim();
        if (customId) {
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
          
          console.log('Найден ID секции новостей:', sectionId);
        }
        isHeaderSection = true;
        continue;
      }

      // Process section header
      if (isHeaderSection) {
        if (!sectionTitle) {
          sectionTitle = line;
          continue;
        }
        if (!sectionDescription && sectionTitle) {
          sectionDescription = line;
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
            title: line,
            content: ''
          };
        } else if (currentCard) {
          currentCard.content += (currentCard.content ? '\n' : '') + line;
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

    // Create section data structure
    return {
      id: sectionId,
      title: sectionTitle || 'Новости и события',
      description: sectionDescription || 'Актуальные новости и события нашей компании',
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
      }))
    };
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
          // Генерируем email на основе названия сайта
          if (headerData?.siteName) {
            const domainName = headerData.siteName
              .toLowerCase()
              .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
              .replace(/[а-яё]/g, char => {
                const translit = {
                  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
                  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                };
                return translit[char] || char;
              });
            
            const emailPrefixes = [
              'info', 'contact', 'office', 'hello', 'support', 'mail', 'team', 'admin',
              'service', 'sales', 'clients', 'help', 'legal', 'company', 'director',
              'manager', 'secretary', 'consulting', 'general', 'reception', 'inquiry', 
              'hr', 'jobs', 'career', 'business', 'partners', 'marketing', 'press'
            ];
            const randomPrefix = emailPrefixes[Math.floor(Math.random() * emailPrefixes.length)];
            contactData.email = `${randomPrefix}@${domainName}.com`;
          } else {
            contactData.email = 'info@example.com';
          }
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

export const parseFullSite = (content, headerData = {}) => {
  try {
    // Очищаем начальный текст от инструкций
    let cleanedContent = content;
    // Удаляем всё от начала до первого === РАЗДЕЛ: если это нужно
    const firstSectionIndex = content.indexOf('=== РАЗДЕЛ:');
    if (firstSectionIndex > 0) {
      cleanedContent = content.substring(firstSectionIndex);
    }
    
    const sections = {};
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
    for (const section of allSections) {
      const sectionName = section.name;
      const sectionContent = section.content;
      
      console.log(`Обрабатываем раздел: ${sectionName}, длина контента: ${sectionContent.length}`);

      switch (sectionName) {
        case 'HERO':
          sections.hero = parseHero(sectionContent);
          console.log('Результат парсинга Hero:', sections.hero);
          break;
        case 'УСЛУГИ':
          sections.services = parseServices(sectionContent);
          break;
        case 'О НАС':
          sections.about = parseAboutSection(sectionContent);
          break;
        case 'ПРЕИМУЩЕСТВА':
          sections.features = parseAdvantagesSection(sectionContent);
          break;
        case 'ОТЗЫВЫ':
          sections.testimonials = parseTestimonials(sectionContent);
          break;
        case 'ВОПРОСЫ':
          sections.faq = parseFaq(sectionContent);
          break;
        case 'НОВОСТИ':
          sections.news = parseNews(sectionContent);
          console.log('Результат парсинга новостей в полном сайте:', sections.news);
          break;
        case 'КОНТАКТЫ':
          sections.contacts = parseContactsFull(sectionContent, headerData);
          break;
        default:
          console.log(`Неизвестный раздел: ${sectionName}`);
      }
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
          // Генерируем email на основе названия сайта
          if (headerData?.siteName) {
            const domainName = headerData.siteName
              .toLowerCase()
              .replace(/[^a-zа-яё0-9\u0600-\u06FF]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
              .replace(/[а-яё]/g, char => {
                const translit = {
                  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
                  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                };
                return translit[char] || char;
              });
            
            const emailPrefixes = [
              'info', 'contact', 'office', 'hello', 'support', 'mail', 'team', 'admin',
              'service', 'sales', 'clients', 'help', 'legal', 'company', 'director',
              'manager', 'secretary', 'consulting', 'general', 'reception', 'inquiry', 
              'hr', 'jobs', 'career', 'business', 'partners', 'marketing', 'press'
            ];
            const randomPrefix = emailPrefixes[Math.floor(Math.random() * emailPrefixes.length)];
            contactData.email = `${randomPrefix}@${domainName}.com`;
          } else {
            contactData.email = 'info@example.com';
          }
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
    console.error('Error parsing contacts from full site structure:', error);
    return null;
  }
}; 


