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

      // Parse section ID from "ID секции: ..."
      if (line.toLowerCase().startsWith('id секции:')) {
        const customId = line.split(':')[1].trim();
        if (customId) {
          // Удаляем все пробелы и специальные символы из ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9]/g, '_') // Заменяем все специальные символы на _
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
        if (line.length < 100 && (!currentCard || (currentCard && currentCard.content))) {
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
    const lines = content.split('\n').filter(line => line.trim());
    const heroData = {
      siteName: '',
      title: '',
      description: ''
    };
    
    // Проверяем, содержит ли текст структуру примера
    const exampleIndex = lines.findIndex(line => line.includes('Пример структуры:'));
    
    if (exampleIndex !== -1) {
      // Если есть пример структуры, берем данные из него
      if (lines.length > exampleIndex + 1) heroData.siteName = lines[exampleIndex + 1].trim();
      if (lines.length > exampleIndex + 3) heroData.title = lines[exampleIndex + 3].trim();
      if (lines.length > exampleIndex + 5) heroData.description = lines[exampleIndex + 5].trim();
    } else {
      // Если нет примера структуры, берем первые три непустые строки
      if (lines.length >= 1) heroData.siteName = lines[0].trim();
      if (lines.length >= 2) heroData.title = lines[1].trim();
      if (lines.length >= 3) heroData.description = lines[2].trim();
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

      // Parse section ID from "ID секции: ..."
      if (line.toLowerCase().startsWith('id секции:')) {
        const customId = line.split(':')[1].trim();
        if (customId) {
          // Remove all spaces and special characters from ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9]/g, '_')
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

      // Process advantages cards
      if (sectionDescription && !isHeaderSection) {
        if (line.length < 100 && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `advantage_${cards.length + 1}`,
            title: line,
            content: '',
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
      cards: cleanedCards,
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

      // Parse section ID from "ID секции: ..."
      if (line.toLowerCase().startsWith('id секции:')) {
        const customId = line.split(':')[1].trim();
        if (customId) {
          // Удаляем все пробелы и специальные символы из ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9]/g, '_')
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
        if (line.length < 100 && (!currentCard || (currentCard && currentCard.content))) {
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

      // Parse section ID from "ID секции: ..."
      if (line.toLowerCase().startsWith('id секции:')) {
        const customId = line.split(':')[1].trim();
        if (customId) {
          // Удаляем все пробелы и специальные символы из ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9]/g, '_')
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

      // Parse section ID from "ID секции: ..."
      if (line.toLowerCase().startsWith('id секции:')) {
        const customId = line.split(':')[1].trim();
        if (customId) {
          // Remove all spaces and special characters from ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9]/g, '_')
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
        if (line.endsWith('?') && (!currentCard || (currentCard && currentCard.content))) {
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
    const lines = content.split('\n');
    let sectionId = 'news'; // Default value
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

      // Parse section ID from "ID секции: ..."
      if (line.toLowerCase().startsWith('id секции:')) {
        const customId = line.split(':')[1].trim();
        if (customId) {
          // Remove all spaces and special characters from ID
          sectionId = customId.toLowerCase()
            .replace(/[^a-zа-яё0-9]/g, '_')
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

      // Process news cards
      if (sectionDescription && !isHeaderSection) {
        if (line.length < 100 && (!currentCard || (currentCard && currentCard.content))) {
          if (currentCard && currentCard.content) {
            cards.push(currentCard);
          }
          currentCard = {
            id: `news_${cards.length + 1}`,
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
    let currentIndex = 2; // Начинаем с 3-го блока (индекс 2)
    
    // Перебираем оставшиеся блоки и распределяем их по полям
    for (let i = currentIndex; i < blocks.length; i++) {
      const block = blocks[i];
      const lines = block.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length >= 2) {
        // Первая строка - это заголовок поля, вторая и последующие - значение
        const fieldValue = lines.slice(1).join('\n');
        
        // Определяем, куда записать значение на основе позиции блока
        if (i === currentIndex && !contactData.address) {
          contactData.address = cleanEmailsInText(fieldValue);
        } else if (i === currentIndex + 1 && !contactData.phone) {
          const phoneValue = cleanEmailsInText(fieldValue);
          
          // Всегда генерируем случайный телефонный номер с сохранением формата
          contactData.phone = generateRandomPhone(phoneValue);
        } else if (i === currentIndex + 2 && !contactData.email) {
          // Всегда генерируем стандартный email на основе названия сайта
          if (headerData?.siteName) {
            // Создаем email из названия сайта
            const domainName = headerData.siteName
              .toLowerCase()
              .replace(/[^a-zа-яё0-9]/g, '-') // Заменяем все специальные символы на дефисы
              .replace(/-+/g, '-') // Убираем множественные дефисы
              .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
              .replace(/[а-яё]/g, char => { // Транслитерация русских букв
                const translit = {
                  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
                  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
                  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
                  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
                  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
                };
                return translit[char] || char;
              });
            
            // Выбираем случайный префикс для email из списка возможных вариантов
            const emailPrefixes = [
              'info', 'contact', 'office', 'hello', 'support', 'mail', 'team', 'admin',
              'service', 'sales', 'clients', 'help', 'legal', 'company', 'director',
              'manager', 'secretary', 'consulting', 'general', 'reception', 'inquiry', 
              'hr', 'jobs', 'career', 'business', 'partners', 'marketing', 'press'
            ];
            const randomPrefix = emailPrefixes[Math.floor(Math.random() * emailPrefixes.length)];
            
            // Всегда используем .com в конце
            contactData.email = `${randomPrefix}@${domainName}.com`;
          } else {
            // Если название сайта не определено, используем стандартный адрес
            contactData.email = 'info@example.com';
          }
        }
      }
    }
    
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

    // Регулярное выражение для поиска заголовков в скобках и последующего текста
    const documentPattern = /\(([^)]+)\)([\s\S]*?)(?=\([^)]+\)|$)/g;
    
    // Массив типов документов в порядке их следования
    const documentTypes = ['privacyPolicy', 'termsOfService', 'cookiePolicy'];
    let documentIndex = 0;
    
    let match;
    while ((match = documentPattern.exec(normalizedContent)) !== null) {
      const title = match[1].trim();
      let documentContent = match[2].trim();

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

