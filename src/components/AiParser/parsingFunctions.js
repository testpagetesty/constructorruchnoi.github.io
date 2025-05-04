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
          contactData.phone = cleanEmailsInText(fieldValue);
        } else if (i === currentIndex + 2 && !contactData.email) {
          contactData.email = cleanEmail(fieldValue);
        }
      }
    }
    
    return contactData;
  } catch (error) {
    console.error('Error parsing contacts:', error);
    return null;
  }
};

export const parseLegalDocuments = (content) => {
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

    // Предварительная обработка текста: нормализуем переносы строк
    const normalizedContent = content.replace(/\n{3,}/g, '\n\n\n');
    
    // Разделяем на документы (блоки, разделенные тройными переносами строк)
    const docBlocks = normalizedContent.split('\n\n\n').filter(block => block.trim());
    
    const documentKeys = ['privacyPolicy', 'termsOfService', 'cookiePolicy'];
    
    // Распределяем блоки по документам
    docBlocks.forEach((block, index) => {
      if (index < 3) {
        // Весь текст блока идет в content, title оставляем пустым
        documents[documentKeys[index]].content = block.trim();
      }
    });
    
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

