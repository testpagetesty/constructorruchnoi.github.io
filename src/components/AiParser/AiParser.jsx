import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Divider, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Collapse,
  ListItemText,
  List,
  ListItem,
  Chip,
  FormControlLabel,
  Checkbox,
  Grid
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import { CARD_TYPES } from '../../utils/configUtils';
import GlobalSettings, { WEBSITE_THEMES, LANGUAGES, CONTENT_STYLES } from './GlobalSettings';
import * as parsers from './parsingFunctions';

// Функция для удаления Markdown форматирования
const stripMarkdown = (text) => {
  if (!text) return '';
  
  // Удаляем форматирование жирным (**текст**)
  return text.replace(/\*\*(.*?)\*\*/g, '$1')
    // Удаляем форматирование курсивом (*текст*)
    .replace(/\*(.*?)\*/g, '$1')
    // Другие возможные форматирования Markdown
    .replace(/`(.*?)`/g, '$1') // код
    .replace(/__(.*?)__/g, '$1') // подчеркивание
    .replace(/_(.*?)_/g, '$1') // курсив через подчеркивание
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // ссылки
};

// Добавляем объект с предустановленными промптами
const DEFAULT_PROMPTS = {
  HERO: `Создайте контент для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка - название сайта
- Максимум 2 слова
- Связано с тематикой нашего сайта
- Легко запоминается
- Без специальных символов и форматирования
- Можно использовать слитное написание слов

2. Вторая строка - заголовок hero секции
- Должен быть убедительным и внушать доверие
- 4-7 слов
- Не должен повторять название сайта

3. Третья строка - описание для hero секции
- 15-25 слов
- Подчеркнуть выгоды для клиента
- Избегать юридических терминов

Пример структуры:
ПравоЩит

Надежная защита ваших интересов

Профессиональная юридическая поддержка для бизнеса и частных лиц. Решаем сложные правовые вопросы, гарантируя результат.

Важно:
- Не используйте форматирование или специальные символы
- Каждая часть должна начинаться с новой строки
- Текст должен быть понятным для всех клиентов`,

  ABOUT: `Создайте содержательный текст для раздела "О нас". Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID секции: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки "О нас", где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание
   - Между карточками ОДНА пустая строка

Пример на русском:
ID секции: о_нас
О нашей компании
Узнайте больше о нашей истории, достижениях и ценностях
О нас

История компании
Основанная в 2010 году, наша компания прошла путь от небольшой фирмы до одного из лидеров рынка. За это время мы успешно реализовали более 1000 проектов и помогли сотням клиентов.

Наша миссия
Мы стремимся сделать услуги доступными и понятными для каждого клиента. Наша цель - не просто решать вопросы, а создавать долгосрочные партнерские отношения.

Рекомендуемое количество карточек: 4-6`,

  SERVICES: `Создайте описание услуг для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID секции: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки услуг, где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание услуги
   - Между карточками ОДНА пустая строка

Пример на русском:
ID секции: услуги
Наши услуги
Профессиональная поддержка для вашего бизнеса и частных лиц
Услуги

Консультации
Предоставляем профессиональные консультации по всем вопросам. Наши специалисты помогут найти оптимальное решение для вашей ситуации.

Сопровождение
Полное сопровождение проектов от начала до успешного завершения. Берем на себя все организационные вопросы.

Рекомендуемое количество услуг: 4-6`,

  FEATURES: `Создайте описание преимуществ для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID секции: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки преимуществ, где:
   - Каждое преимущество начинается с краткого заголовка
   - После заголовка идет развернутое описание
   - Между преимуществами ОДНА пустая строка

Пример на русском:
ID секции: преимущества
Почему выбирают нас
Ключевые преимущества работы с нашей компанией
Преимущества

Профессионализм
Наши специалисты имеют более 15 лет опыта. Каждый эксперт регулярно проходит повышение квалификации.

Качество
Гарантируем высокое качество всех услуг. Работаем по международным стандартам.

Рекомендуемое количество преимуществ: 4-6`,

  TESTIMONIALS: `Создайте отзывы для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID секции: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки отзывов, где:
   - Первая строка каждой карточки - имя автора
   - Следующие строки - текст отзыва
   - Между карточками ОДНА пустая строка

Пример:
ID секции: отзывы
Отзывы наших клиентов
Узнайте, что говорят о нас клиенты, которые уже воспользовались нашими услугами
Отзывы

Анна Петрова
Обратилась в компанию по вопросу оформления документов. Все было сделано быстро и профессионально. Очень довольна качеством услуг.

Сергей Иванов
Благодарен за помощь в решении сложного вопроса. Специалисты компании проявили высокий профессионализм и внимание к деталям.

Важно:
- ОБЯЗАТЕЛЬНО начните с "ID секции: " и название секции на языке основного контента
- Заголовок и описание должны быть на том же языке
- Строго соблюдайте порядок элементов
- Используйте пустые строки только между карточками отзывов
- Не используйте нумерацию или маркеры списка
- Не добавляйте цвета и стили в текст
- Каждый отзыв должен иметь автора и текст отзыва
- Текст отзыва должен быть конкретным и убедительным

Рекомендуемое количество отзывов: 3-5`,

  FAQ: `Создайте раздел FAQ для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID секции: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - вопросы и ответы, где:
   - Каждый вопрос должен заканчиваться знаком "?"
   - После вопроса идет развернутый ответ
   - Между вопросами ОДНА пустая строка

Пример:
ID секции: вопросы
Часто задаваемые вопросы
Ответы на самые популярные вопросы наших клиентов
Вопросы и ответы

Как начать работу с вашей компанией?
Для начала работы с нашей компанией достаточно оставить заявку через форму на сайте или позвонить по указанному номеру телефона. Наш менеджер свяжется с вами в течение рабочего дня для обсуждения деталей сотрудничества.

Какие гарантии вы предоставляете?
Мы гарантируем высокое качество наших услуг и строго соблюдаем все договорные обязательства. Каждый проект сопровождается официальным договором, где прописаны все условия сотрудничества, сроки и гарантийные обязательства.

Важно:
- ОБЯЗАТЕЛЬНО начните с "ID секции: " и название секции на языке основного контента
- Заголовок и описание должны быть на том же языке
- Строго соблюдайте порядок элементов
- Используйте пустые строки только между вопросами
- Не используйте нумерацию или маркеры списка
- Не добавляйте цвета и стили в текст
- Каждый вопрос должен заканчиваться знаком "?"
- Ответы должны быть конкретными и информативными

Рекомендуемое количество вопросов: 4-6`,

  NEWS: `Создайте новости для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID секции: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки новостей о достижениях и событиях компании, где:
   - Каждая новость начинается с заголовка (до 100 символов)
   - После заголовка идет текст новости
   - В каждой новости упоминайте название компании или "наша компания"
   - Новости должны быть о реальных событиях: победы в судах, новые услуги, награды, расширение офиса
   - Между новостями ОДНА пустая строка

Пример:
ID секции: новости
Новости нашей компании
Следите за последними достижениями и важными событиями в жизни нашей компании
Новости

Успешное завершение крупного проекта
Наша компания одержала значимую победу в важном деле, защитив интересы крупного промышленного предприятия. Благодаря профессионализму наших специалистов, клиенту удалось отстоять свои права и сохранить активы стоимостью более 100 миллионов рублей.

Наши специалисты получили престижную награду
Ведущие специалисты нашей компании были отмечены в рейтинге "Лучшие профессионалы года". Это признание подтверждает высокий уровень экспертизы нашей команды и качество предоставляемых услуг.

Важно:
- ОБЯЗАТЕЛЬНО начните с "ID секции: " и название секции на языке основного контента
- Заголовок и описание должны быть на том же языке
- Каждая новость должна быть о конкретном достижении или событии компании
- Используйте реальные факты и цифры
- Подчеркивайте преимущества и профессионализм компании
- Упоминайте выгоды для клиентов
- Пишите в деловом стиле
- Не используйте рекламные преувеличения

Рекомендуемое количество новостей: 3-5`,

  CONTACTS: `Используй язык который указан для нашего промта

Создайте раздел контактов для сайта.

Требуемый формат:
1. Первая строка - заголовок "Контакты" (используется язык основного контента)
2. Вторая строка - пустая
3. Третья строка - описание в скобках
4. Четвертая строка - пустая
5. Далее контактные данные в строгом порядке:
   - Адрес
   - Телефон
   - Email

Пример структуры:
Контакты

(Мы ценим каждого клиента и готовы оказать профессиональную юридическую поддержку. Наши специалисты всегда на связи и оперативно ответят на все ваши вопросы)

Адрес
г. Москва, ул. Ленина, д. 10, офис 200

Телефон
+7 (495) 123-45-67

Email
info@your-law.com

Примечание: 
- Название компании будет автоматически синхронизировано с названием сайта из настроек шапки.
- Email адрес будет автоматически сформирован как info@[название-сайта].com, где [название-сайта] - это транслитерированное название сайта из настроек шапки.`,

  LEGAL: `Используй язык который указан для нашего промта из технического задания выше
Создайте три документа для Политика конфиденциальности Пользовательское соглашение Политика использования cookie для сайта
ВАЖНО! Каждый документ ДОЛЖЕН начинаться с заголовка в круглых скобках, например:
(Политика конфиденциальности)
[текст документа]

(Пользовательское соглашение)
[текст документа]

(Политика использования cookie)
[текст документа]

ПРАВИЛА ФОРМАТИРОВАНИЯ:
1. Каждый документ ОБЯЗАТЕЛЬНО начинается с заголовка в круглых скобках на отдельной строке
2. После заголовка в скобках сразу идет текст документа
3. Между документами оставляйте РОВНО две пустые строки
4. Внутри документа используйте обычное форматирование с разделами и подразделами

ВАЖНО! НЕ УКАЗЫВАТЬ В ДОКУМЕНТАХ:
- Не указывайте никакие контактные данные (адреса, телефоны, email)
- Не используйте конкретные названия сайтов или доменов
- Вместо конкретных данных используйте обобщенные формулировки, например:
  * "на нашем сайте" вместо конкретного названия сайта
  * "через форму обратной связи" вместо конкретных контактов
  * "администрация сайта" вместо конкретных имен

СТРУКТУРА ДОКУМЕНТОВ:

(Политика конфиденциальности)
1. Общие положения
[текст раздела]

2. Какую информацию мы собираем
[текст раздела]

[остальные разделы...]


(Пользовательское соглашение)
1. Общие положения и термины
[текст раздела]

2. Права и обязанности пользователя
[текст раздела]

[остальные разделы...]


(Политика использования cookie)
1. Что такое файлы cookie
[текст раздела]

2. Типы файлов cookie
[текст раздела]

[остальные разделы...]

ОБЯЗАТЕЛЬНОЕ СОДЕРЖАНИЕ ДОКУМЕНТОВ:

ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ должна включать разделы:
- Общие положения
- Какую информацию мы собираем
- Как мы используем информацию
- Защита данных и срок хранения
- Передача данных третьим лицам
- Использование файлов cookie
- Права пользователя
- Изменения в политике
- Согласие пользователя

ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ должно включать разделы:
- Общие положения и термины
- Права и обязанности пользователя
- Права и обязанности администрации
- Условия использования контента
- Интеллектуальная собственность
- Отказ от ответственности
- Регистрация и учетная запись
- Безопасность и конфиденциальность
- Порядок разрешения споров
- Заключительные положения

ПОЛИТИКА ИСПОЛЬЗОВАНИЯ COOKIE должна включать разделы:
- Что такое файлы cookie
- Типы файлов cookie
- Цели использования cookie
- Контроль файлов cookie
- Сторонние cookie-файлы
- Срок хранения cookie
- Как отключить cookie
- Обновления политики

ВАЖНЫЕ ТРЕБОВАНИЯ:
- Документы должны быть ПОЛНЫМИ (1500-2000 слов каждый)
- Соответствовать требованиям GDPR
- Быть универсальными для любой страны
- Использовать нейтральные формулировки
- СТРОГО ЗАПРЕЩЕНО добавлять пробелы в конце строк
- СТРОГО ЗАПРЕЩЕНО использовать двойные пробелы
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать символы форматирования`,
};

const AiParser = ({ 
  sectionsData = {}, 
  onSectionsChange, 
  headerData, 
  onHeaderChange, 
  contactData, 
  onContactChange, 
  legalDocuments, 
  onLegalDocumentsChange, 
  heroData, 
  onHeroChange 
}) => {
  // Добавляем ref для текстового поля
  const textareaRef = useRef(null);

  // Существующие состояния
  const [customDelimiter, setCustomDelimiter] = useState('\\n\\n');
  const [customTitleContentDelimiter, setCustomTitleContentDelimiter] = useState(':');
  const [showSettings, setShowSettings] = useState(false);
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [targetSection, setTargetSection] = useState('AUTO');
  const [parserMessage, setParserMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [editingPromptType, setEditingPromptType] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  
  // Добавляем состояния для глобальных настроек
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    theme: 'LAW',
    customTheme: '',
    language: 'RU',
    contentStyle: 'PROFESSIONAL',
    additionalKeywords: '',
    usePrice: false,
    usePromotions: false,
    useContacts: false,
    useSocial: false,
    customInstructions: '',
    customLanguage: ''
  });

  // Функция для применения глобальных настроек к промпту
  const applyGlobalSettings = (promptText) => {
    const theme = globalSettings.theme === 'CUSTOM' 
      ? globalSettings.customTheme 
      : WEBSITE_THEMES[globalSettings.theme];

    // Определение языка для промпта
    let language;
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      language = `языке с кодом ISO ${globalSettings.customLanguage}`;
    } else {
      language = LANGUAGES[globalSettings.language].split(' ')[0]; // Берем только название языка без кода
    }

    let enhancedPrompt = `Создайте контент для сайта "${theme}" на ${language}.\n`;
    enhancedPrompt += `Стиль контента: ${CONTENT_STYLES[globalSettings.contentStyle]}.\n`;
    enhancedPrompt += `ВАЖНО: Не используйте никакого форматирования (Markdown, HTML). Не используйте символы **, ---, ###, _ или другие специальные символы для форматирования. Выдавайте чистый текст.\n`;

    if (globalSettings.additionalKeywords) {
      enhancedPrompt += `Ключевые особенности: ${globalSettings.additionalKeywords}\n`;
    }

    const features = [];
    if (globalSettings.usePrice) features.push('указывать цены');
    if (globalSettings.usePromotions) features.push('включать акции и спецпредложения');
    if (globalSettings.useContacts) features.push('добавлять контактную информацию');
    if (globalSettings.useSocial) features.push('упоминать социальные сети');

    if (features.length > 0) {
      enhancedPrompt += `Дополнительно: ${features.join(', ')}.\n`;
    }

    if (globalSettings.customInstructions) {
      enhancedPrompt += `Особые требования: ${globalSettings.customInstructions}\n`;
    }

    enhancedPrompt += '\nФормат ответа:\n';
    enhancedPrompt += '1. Используйте обычный текст без специальных символов форматирования\n';
    enhancedPrompt += '2. Разделяйте секции с помощью пустых строк\n';
    enhancedPrompt += '3. Цены и акции указывайте в обычном тексте, например: "Цена: 10000 рублей"\n\n';

    enhancedPrompt += promptText;

    return enhancedPrompt;
  };

  // Модифицируем функцию копирования промпта
  const copyPromptToClipboard = () => {
    const prompt = prompts[targetSection] || `Сгенерируйте для меня ${
      targetSection === 'FEATURES' ? 'преимущества' : 
      targetSection === 'ABOUT' ? 'информацию о' :
      'раздел'} для сайта.`;
    
    const enhancedPrompt = applyGlobalSettings(prompt);
    
    navigator.clipboard.writeText(enhancedPrompt)
      .then(() => {
        setParserMessage('Промпт с глобальными настройками скопирован в буфер обмена.');
        // Очищаем текстовое поле после копирования
        handleClearText();
      })
      .catch(() => {
        setParserMessage('Не удалось скопировать промпт.');
      });
  };

  // Добавляем функцию для обновления кода языка в headerData при изменении языка в глобальных настройках
  const handleGlobalSettingsChange = (newSettings) => {
    setGlobalSettings(newSettings);
    
    // Получаем код языка ISO 639-1
    let languageCode = '';
    
    if (newSettings.language === 'CUSTOM') {
      // Если выбран "Другой язык", используем значение из поля ввода
      languageCode = newSettings.customLanguage || '';
    } else {
      // Извлекаем код языка из строки, например "Русский (ru)" -> "ru"
      const languageString = LANGUAGES[newSettings.language] || '';
      const match = languageString.match(/\(([a-z]{2})\)/i);
      languageCode = match ? match[1].toLowerCase() : '';
    }
    
    // Обновляем код языка в настройках шапки, если он отличается
    if (languageCode && (headerData.language !== languageCode)) {
      onHeaderChange({
        ...headerData,
        language: languageCode
      });
    }
  };

  // Обработка изменения текста
  const handleTextChange = (e) => {
    // Нормализуем переносы строк
    const normalizedText = e.target.value.replace(/\r\n/g, '\n');
    setContent(normalizedText);
  };

  // Очищаем Markdown при вставке текста и нормализуем переносы строк
  const handleTextPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    
    // Нормализуем переносы строк в вставленном тексте
    const normalizedText = pastedText
      .replace(/\r\n/g, '\n')  // Заменяем CRLF на LF
      .replace(/\r/g, '\n');   // Заменяем CR на LF
    
    setContent(normalizedText);
    
    // Эмулируем изменение для правильной обработки разделителей
    if (textareaRef.current) {
      const event = new Event('input', { bubbles: true });
      textareaRef.current.value = normalizedText;
      textareaRef.current.dispatchEvent(event);
    }
  };

  const handleClearText = () => {
    setContent('');
    setResult(null);
    setParserMessage('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Функция для сохранения отредактированного промпта
  const handleSavePrompt = () => {
    if (editingPromptType) {
      setPrompts(prev => ({
        ...prev,
        [editingPromptType]: editingPromptText
      }));
    }
    setShowPromptEditor(false);
    setEditingPromptType(null);
    setEditingPromptText('');
  };

  // Обработка парсинга
  const handleParse = () => {
    try {
      setParserMessage('');
      setResult(null);
      
      if (!content.trim()) {
        setParserMessage('Введите текст для парсинга.');
        return;
      }
      
      // If no target section is selected or it's AUTO, try to detect the type
      if (!targetSection || targetSection === 'AUTO') {
        const detectedType = parsers.autoDetectSectionType(content);
        if (detectedType === 'AUTO') {
          setParserMessage('Не удалось автоматически определить тип контента. Пожалуйста, выберите раздел вручную.');
          return;
        }
        setTargetSection(detectedType);
      }

      let parsedData = null;
      
      switch (targetSection) {
        case 'SERVICES':
          parsedData = parsers.parseServices(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Создаем новый пункт меню, используя id для текста меню
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData с новым или обновленным пунктом меню
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция успешно обновлена.');
            } else {
              setParserMessage('Секция успешно добавлена в меню.');
            }
          }
          break;
        case 'FEATURES':
          parsedData = parsers.parseAdvantagesSection(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: `#${parsedData.id}`,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Create new menu item
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: `#${parsedData.id}`,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Update headerData with new or updated menu item
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Create or update section
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: parsedData.titleColor,
              descriptionColor: parsedData.descriptionColor
            };
            
            // Update sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция преимуществ успешно обновлена.');
            } else {
              setParserMessage('Секция преимуществ успешно добавлена в меню.');
            }
          }
          break;
        case 'ABOUT':
          parsedData = parsers.parseAboutSection(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Создаем новый пункт меню
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData с новым или обновленным пунктом меню
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция "О нас" успешно обновлена.');
            } else {
              setParserMessage('Секция "О нас" успешно добавлена в меню.');
            }
          }
          break;
        case 'TESTIMONIALS':
          parsedData = parsers.parseTestimonials(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Создаем новый пункт меню
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData с новым или обновленным пунктом меню
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция отзывов успешно обновлена.');
            } else {
              setParserMessage('Секция отзывов успешно добавлена в меню.');
            }
          }
          break;
        case 'FAQ':
          parsedData = parsers.parseFaq(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id,
                      link: parsedData.link,
                      backgroundColor: parsedData.backgroundColor,
                      textColor: parsedData.textColor,
                      borderColor: parsedData.borderColor,
                      shadowColor: parsedData.shadowColor,
                      gradientStart: parsedData.gradientStart,
                      gradientEnd: parsedData.gradientEnd,
                      gradientDirection: parsedData.gradientDirection
                    }
                  : item
              );
            } else {
              // Create new menu item
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: parsedData.link,
                backgroundColor: parsedData.backgroundColor,
                textColor: parsedData.textColor,
                borderColor: parsedData.borderColor,
                shadowColor: parsedData.shadowColor,
                gradientStart: parsedData.gradientStart,
                gradientEnd: parsedData.gradientEnd,
                gradientDirection: parsedData.gradientDirection
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Update headerData with new or updated menu item
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Create or update section
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType,
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Update sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция FAQ успешно обновлена.');
            } else {
              setParserMessage('Секция FAQ успешно добавлена в меню.');
            }
          }
          break;
        case 'NEWS':
          parsedData = parsers.parseNews(content);
          if (parsedData) {
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.id, 
                      link: `#${parsedData.id}`,
                      backgroundColor: '#ffffff',
                      textColor: '#000000',
                      borderColor: '#e0e0e0',
                      shadowColor: 'rgba(0,0,0,0.1)',
                      gradientStart: '#ffffff',
                      gradientEnd: '#f5f5f5',
                      gradientDirection: 'to right'
                    }
                  : item
              );
            } else {
              // Create new menu item
              const menuItem = {
                id: parsedData.id,
                text: parsedData.id, 
                link: `#${parsedData.id}`,
                backgroundColor: '#ffffff',
                textColor: '#000000',
                borderColor: '#e0e0e0',
                shadowColor: 'rgba(0,0,0,0.1)',
                gradientStart: '#ffffff',
                gradientEnd: '#f5f5f5',
                gradientDirection: 'to right'
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Update headerData with new or updated menu item
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Create or update section
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: 'ELEVATED',
              cards: parsedData.cards,
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Update sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage('Секция новостей успешно обновлена.');
            } else {
              setParserMessage('Секция новостей успешно добавлена в меню.');
            }
          }
          break;
        case 'CONTACTS':
          parsedData = parsers.parseContacts(content, headerData);
          if (parsedData) {
            onContactChange(parsedData);
            setParserMessage('Контактные данные успешно обновлены.');
          }
          break;
        case 'LEGAL':
          parsedData = parsers.parseLegalDocuments(content, contactData);
          if (parsedData) {
            onLegalDocumentsChange(parsedData);
            setParserMessage('Правовые документы успешно обновлены.');
          }
          break;
        case 'HERO':
          parsedData = parsers.parseHero(content);
          if (parsedData) {
            // Обновляем название сайта в headerData
            if (parsedData.siteName) {
              onHeaderChange({
                ...headerData,
                siteName: parsedData.siteName
              });
            }
            // Обновляем hero секцию
            onHeroChange({
              ...heroData,
              title: parsedData.title,
              subtitle: parsedData.description
            });
            setParserMessage('Данные для главной секции успешно обновлены.');
          }
          break;
        default:
          setParserMessage('Выберите тип раздела для парсинга.');
          return;
      }

      if (parsedData) {
        setResult(parsedData);
      } else {
        setParserMessage('Не удалось обработать текст. Проверьте формат и попробуйте снова.');
      }
    } catch (error) {
      console.error('Error in handleParse:', error);
      setParserMessage('Произошла ошибка при обработке текста. Проверьте формат и попробуйте снова.');
    }
  };

  const handleOpenPromptEditor = (sectionType) => {
    setEditingPromptType(sectionType);
    setEditingPromptText(prompts[sectionType] || '');
    setShowPromptEditor(true);
  };

  return (
    <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
      <AccordionSummary 
        expandIcon={<ExpandMoreIcon />} 
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Typography variant="h6" sx={{ color: '#e53935' }}>
          AI Парсер контента
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Paper sx={{ boxShadow: 'none' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>  
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowSettings(true)}
                startIcon={<SettingsIcon />}
              >
                Настройки парсера
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowGlobalSettings(true)}
                startIcon={<TuneIcon />}
              >
                Настройки контента
              </Button>
            </Box>
          </Box>

          {/* Добавляем компонент глобальных настроек с новой функцией */}
          <GlobalSettings
            open={showGlobalSettings}
            onClose={() => setShowGlobalSettings(false)}
            settings={globalSettings}
            onSettingsChange={handleGlobalSettingsChange}
          />
            
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="section-select-label">Выберите раздел для заполнения</InputLabel>
              <Select
                labelId="section-select-label"
                value={targetSection}
                label="Выберите раздел для заполнения"
                onChange={(e) => setTargetSection(e.target.value)}
              >
                <MenuItem value="AUTO">Автоопределение</MenuItem>
                <MenuItem value="HERO">Hero секция</MenuItem>
                <MenuItem value="ABOUT">О нас</MenuItem>
                <MenuItem value="FEATURES">Преимущества</MenuItem>
                <MenuItem value="SERVICES">Услуги</MenuItem>
                <MenuItem value="TESTIMONIALS">Отзывы</MenuItem>
                <MenuItem value="FAQ">Вопросы и ответы</MenuItem>
                <MenuItem value="NEWS">Новости</MenuItem>
                <MenuItem value="CONTACTS">Свяжитесь с нами</MenuItem>
                <MenuItem value="LEGAL">Правовые документы</MenuItem>
              </Select>
            </FormControl>
              
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mb: 2,
              '& .MuiButton-root': {
                minWidth: '120px',
                height: '32px',
                borderRadius: '4px',
                textTransform: 'none',
                fontSize: '0.8125rem',
                padding: '4px 12px',
                fontWeight: 500,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                  transform: 'translateY(-1px)'
                }
              }
            }}>
              <Tooltip title="Скопировать шаблон промпта" arrow placement="top">
                <span>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={copyPromptToClipboard}
                    startIcon={<ContentCopyIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={!targetSection || targetSection === 'AUTO'}
                    sx={{
                      borderWidth: '1px',
                      '&:hover': {
                        borderWidth: '1px'
                      }
                    }}
                  >
                    Копировать
                </Button>
                </span>
              </Tooltip>
              <Tooltip title="Настроить шаблон промпта" arrow placement="top">
                <span>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenPromptEditor(targetSection)}
                    startIcon={<EditIcon sx={{ fontSize: '0.9rem' }} />}
                    disabled={!targetSection || targetSection === 'AUTO'}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                      }
                    }}
                  >
                    Изменить
                  </Button>
                </span>
              </Tooltip>
              </Box>
              
              <TextField
                multiline
                rows={10}
                fullWidth
              value={content}
                onChange={handleTextChange}
                onPaste={handleTextPaste}
                inputRef={textareaRef}
              placeholder="Вставьте сюда текст от AI для обработки..."
              />
              
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleParse}
                disabled={!content.trim()}
                >
                  Обработать и заполнить
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleClearText}
                >
                  Очистить
                </Button>
              </Box>
              
              {parserMessage && (
              <Alert severity="info" sx={{ mt: 2 }}>
                  {parserMessage}
                </Alert>
              )}
              
              {result && (
                <Accordion 
                  sx={{ mt: 2 }} 
                  defaultExpanded={false}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">
                      Данные JSON:
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>
              )}
          </Box>

          {/* Диалог редактирования промпта */}
          <Dialog 
            open={showPromptEditor} 
            onClose={() => setShowPromptEditor(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Редактирование промпта для раздела {editingPromptType}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={20}
                value={editingPromptText}
                onChange={(e) => setEditingPromptText(e.target.value)}
                margin="dense"
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPromptEditor(false)}>Отмена</Button>
              <Button onClick={handleSavePrompt} variant="contained" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>

          {/* Диалог настроек */}
          <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
            <DialogTitle>Настройки парсера</DialogTitle>
            <DialogContent>
              <TextField
                label="Разделитель между элементами"
                fullWidth
                margin="dense"
                value={customDelimiter}
                onChange={(e) => setCustomDelimiter(e.target.value)}
                placeholder="\n\n"
                helperText="По умолчанию: двойной перенос строки"
              />
              
              <TextField
                label="Разделитель между заголовком и содержимым"
                fullWidth
                margin="dense"
                value={customTitleContentDelimiter}
                onChange={(e) => setCustomTitleContentDelimiter(e.target.value)}
                placeholder="\n"
                helperText="По умолчанию: одинарный перенос строки"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSettings(false)}>Закрыть</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default AiParser; 