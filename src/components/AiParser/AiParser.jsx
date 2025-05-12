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
  Grid,
  Slider,
  Switch
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import StyleIcon from '@mui/icons-material/Style';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { CARD_TYPES } from '../../utils/configUtils';
import GlobalSettings, { WEBSITE_THEMES, LANGUAGES, CONTENT_STYLES } from './GlobalSettings';
import SiteStyleManager from '../SiteStyleSettings/SiteStyleManager';
import * as parsers from './parsingFunctions';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';
import { contactPresets } from '../../utils/contactPresets';

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
  FULL_SITE: `Создайте полный контент для сайта. Строго следуйте формату ниже.

ВАЖНО: Каждый раздел должен начинаться с "=== РАЗДЕЛ: ИМЯ_РАЗДЕЛА ===" и заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="

=== РАЗДЕЛ: HERO ===
1. Первая строка - название сайта (максимум 2 слова)
2. Вторая строка - заголовок hero секции (4-7 слов)
3. Третья строка - описание (15-25 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: О НАС ===
ID: о_нас (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[4-6 карточек в формате:]
Заголовок карточки
Описание (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: УСЛУГИ ===
ID: услуги (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[4-6 карточек услуг в формате:]
Название услуги
Описание услуги (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: ПРЕИМУЩЕСТВА ===
ID: преимущества (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[4-6 преимуществ в формате:]
Заголовок преимущества
Описание преимущества (30-50 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: НОВОСТИ ===
ID: новости (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[3-5 новостей в формате:]
Заголовок новости
Текст новости (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: ВОПРОСЫ ===
ID: вопросы (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[4-6 вопросов в формате:]
Вопрос?
Ответ (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: ОТЗЫВЫ ===
ID: отзывы (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[3-5 отзывов в формате:]
Имя автора
Текст отзыва (50-80 слов)
=== КОНЕЦ РАЗДЕЛА ===

=== РАЗДЕЛ: КОНТАКТЫ ===
Заголовок раздела (например, "Контакты")
Название компании
Адрес компании
Телефон: +7 XXX XXX XX XX
Email: example@example.com
=== КОНЕЦ РАЗДЕЛА ===

Важные требования:
1. Укажите "ID:" на необходимом языке (например, "ID: новости" для русского или "ID: news" для английского)
2. После "ID:" укажите название раздела на том же языке, на котором вы создаете контент
3. Весь контент должен быть на одном языке
4. Каждый раздел должен быть отделен разделителями === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===
5. Не использовать специальные символы и форматирование
6. Каждый элемент должен начинаться с новой строки
7. Между карточками/пунктами оставлять ОДНУ пустую строку`,

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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки "О нас", где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: о_нас
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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки услуг, где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание услуги
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: услуги
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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки преимуществ, где:
   - Каждое преимущество начинается с краткого заголовка
   - После заголовка идет развернутое описание
   - Между преимуществами ОДНА пустая строка

Пример на русском:
ID: преимущества
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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки отзывов, где:
   - Первая строка каждой карточки - имя автора
   - Следующие строки - текст отзыва
   - Между карточками ОДНА пустая строка

Пример:
ID: отзывы
Отзывы наших клиентов
Узнайте, что говорят о нас клиенты, которые уже воспользовались нашими услугами
Отзывы

Анна Петрова
Обратилась в компанию по вопросу оформления документов. Все было сделано быстро и профессионально. Очень довольна качеством услуг.

Сергей Иванов
Благодарен за помощь в решении сложного вопроса. Специалисты компании проявили высокий профессионализм и внимание к деталям.

Важно:
- ОБЯЗАТЕЛЬНО начните с "ID: " и название секции на языке основного контента
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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента
2. Вторая строка - заголовок раздела
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - вопросы и ответы, где:
   - Каждый вопрос должен заканчиваться знаком "?"
   - После вопроса идет развернутый ответ
   - Между вопросами ОДНА пустая строка

Пример:
ID: вопросы
Часто задаваемые вопросы
Ответы на самые популярные вопросы наших клиентов
Вопросы и ответы

Как начать работу с вашей компанией?
Для начала работы с нашей компанией достаточно оставить заявку через форму на сайте или позвонить по указанному номеру телефона. Наш менеджер свяжется с вами в течение рабочего дня для обсуждения деталей сотрудничества.

Какие гарантии вы предоставляете?
Мы гарантируем высокое качество наших услуг и строго соблюдаем все договорные обязательства. Каждый проект сопровождается официальным договором, где прописаны все условия сотрудничества, сроки и гарантийные обязательства.

Важно:
- ОБЯЗАТЕЛЬНО начните с "ID: " и название секции на языке основного контента
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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента
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
ID: новости
Новости нашей компании
Следите за последними достижениями и важными событиями в жизни нашей компании
Новости

Успешное завершение крупного проекта
Наша компания одержала значимую победу в важном деле, защитив интересы крупного промышленного предприятия. Благодаря профессионализму наших специалистов, клиенту удалось отстоять свои права и сохранить активы стоимостью более 100 миллионов рублей.

Наши специалисты получили престижную награду
Ведущие специалисты нашей компании были отмечены в рейтинге "Лучшие профессионалы года". Это признание подтверждает высокий уровень экспертизы нашей команды и качество предоставляемых услуг.

Важно:
- ОБЯЗАТЕЛЬНО начните с "ID: " и название секции на языке основного контента
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
   - Адрес (ОЧЕНЬ ВАЖНО: формат адреса должен строго соответствовать международным стандартам для выбранной страны)
   - Телефон (используйте правильный формат номера для выбранной страны)
   - Email

КРИТИЧНО ВАЖНО О ФОРМАТЕ АДРЕСА:
- Используйте ТОЛЬКО международный формат адреса, принятый в конкретной стране
- Указывайте адрес в формате, который принимают Google Maps для данной страны
- Адрес должен содержать: название улицы, номер дома, район (если применимо), город, индекс (почтовый код)
- Обязательно укажите район города и почтовый индекс
- Формат адреса и порядок элементов ДОЛЖЕН соответствовать стандартам выбранной страны
- Не используйте сокращения (пр. ул., д., кв.) - пишите полностью (улица, дом, квартира)

Примеры правильных форматов адресов для разных стран:
- Россия: 119435, Москва, Большой Саввинский переулок, 12 строение 6
- США: 350 5th Ave, New York, NY 10118, USA
- Великобритания: 10 Downing Street, London, SW1A 2AA, UK 
- Германия: Friedrichstraße 123, 10117 Berlin, Germany
- Турция: Bağdat Caddesi 123, Kadıköy, 34710 İstanbul, Turkey
- Франция: 8 Avenue des Champs-Élysées, 75008 Paris, France
- Испания: Calle de Alcalá 20, 28014 Madrid, España
- Италия: Via del Corso 12, 00186 Roma, Italia
- Китай: 100006, 北京市东城区王府井大街1号, Beijing, China
- Япония: 〒100-0005 東京都千代田区丸の内1-1-1, Tokyo, Japan
- ОАЭ: Al Maktoum Street, Deira, P.O. Box 12345, Dubai, UAE
- Канада: 150 Bloor Street West, Toronto, ON M5S 1M4, Canada
- Австралия: 200 George Street, Sydney NSW 2000, Australia
- Бразилия: Avenida Paulista 1000, Bela Vista, São Paulo - SP, 01310-100, Brasil
- Индия: Plot No.1, Sector 42, Gurugram, Haryana 122002, India
- Нидерланды: Prinsengracht 263-267, 1016 GV Amsterdam, Netherlands
- Швеция: Drottninggatan 71A, 111 36 Stockholm, Sweden
- Южная Корея: 29 Seolleung-ro 152-gil, Gangnam-gu, Seoul 06792, South Korea
- Мексика: Paseo de la Reforma 222, Juárez, 06600 Ciudad de México, CDMX, Mexico
- Польша: ul. Nowy Świat 6/12, 00-400 Warszawa, Poland
- Израиль: HaYarkon Street 99, Tel Aviv-Yafo, 6340133, Israel

Пример структуры:
Контакты

(Мы ценим каждого клиента и готовы оказать профессиональную поддержку. Наши специалисты всегда на связи и оперативно ответят на все ваши вопросы)

Адрес
119019, Москва, Гоголевский бульвар 3-7, офис 107

Телефон
+7 (495) 123-45-67

Email
info@your-law.com

Примечание: 
- Название компании будет автоматически синхронизировано с названием сайта из настроек шапки.
- Email адрес будет автоматически сформирован как info@[название-сайта].com, где [название-сайта] - это транслитерированное название сайта из настроек шапки.`,

  LEGAL: `ВАЖНО: Создайте все документы ИСКЛЮЧИТЕЛЬНО на выбранном языке.

Создайте три юридических документа для сайта:
- Политика конфиденциальности (Privacy Policy)
- Пользовательское соглашение (Terms of Use)
- Политика использования cookie (Cookie Policy)

ФОРМАТ ДОКУМЕНТОВ:
1. Каждый документ должен начинаться с заголовка в круглых скобках на отдельной строке НА ВЫБРАННОМ ЯЗЫКЕ
2. После заголовка сразу идет текст документа
3. Между документами оставляйте РОВНО две пустые строки
4. Внутри документа используйте обычное форматирование с разделами

Примеры заголовков на разных языках:
- Русский: (Политика конфиденциальности), (Пользовательское соглашение), (Политика использования cookie)
- Английский: (Privacy Policy), (Terms of Use), (Cookie Policy)
- Испанский: (Política de Privacidad), (Términos de Uso), (Política de Cookies)
- Немецкий: (Datenschutzrichtlinie), (Nutzungsbedingungen), (Cookie-Richtlinie)
- Французский: (Politique de Confidentialité), (Conditions d'Utilisation), (Politique des Cookies)

ВАЖНО! НЕ УКАЗЫВАТЬ В ДОКУМЕНТАХ:
- Никакие контактные данные (адреса, телефоны, email)
- Конкретные названия сайтов или доменов
- Используйте обобщенные формулировки на выбранном языке, например:
  * "на нашем сайте" вместо конкретного названия
  * "через форму обратной связи" вместо конкретных контактов
  * "администрация сайта" вместо конкретных имен

СТРУКТУРА ДОКУМЕНТОВ (названия разделов должны быть на ВЫБРАННОМ ЯЗЫКЕ):

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
- Использовать нейтральные формулировки на ВЫБРАННОМ ЯЗЫКЕ
- СТРОГО ЗАПРЕЩЕНО добавлять пробелы в конце строк
- СТРОГО ЗАПРЕЩЕНО использовать двойные пробелы
- КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать символы форматирования

СТРОГОЕ ПРАВИЛО: НЕ ДОБАВЛЯЙТЕ НИКАКОГО ТЕКСТА ПОСЛЕ ЗАКЛЮЧИТЕЛЬНОГО РАЗДЕЛА ПОСЛЕДНЕГО ДОКУМЕНТА. 
НЕ ЗАДАВАЙТЕ ВОПРОСЫ. НЕ ПРЕДЛАГАЙТЕ ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ.
НЕ ПИШИТЕ "Надеюсь, это вам поможет" ИЛИ ПОДОБНЫЕ ФРАЗЫ.
ОТВЕТ ДОЛЖЕН СОДЕРЖАТЬ ТОЛЬКО ТРИ ДОКУМЕНТА БЕЗ КАКИХ-ЛИБО ДОПОЛНИТЕЛЬНЫХ КОММЕНТАРИЕВ.

ПРОВЕРКА: Убедитесь, что ВСЕ заголовки и ВЕСЬ текст написаны ТОЛЬКО на выбранном языке. Не смешивайте языки. Если выбран не русский язык, НЕ используйте русский текст нигде в документах.`,
};

// Добавляем компонент настройки промпта полного сайта
const FullSitePromptSettings = ({ open, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState(initialSettings || {
    includedSections: {
      HERO: true,
      ABOUT: true,
      SERVICES: true,
      FEATURES: true,
      NEWS: true,
      FAQ: true,
      TESTIMONIALS: true,
      CONTACTS: true
    },
    cardCounts: {
      ABOUT: 4,
      SERVICES: 4,
      FEATURES: 4,
      NEWS: 3,
      FAQ: 4,
      TESTIMONIALS: 3
    }
  });

  const handleSectionToggle = (section) => {
    setSettings(prev => ({
      ...prev,
      includedSections: {
        ...prev.includedSections,
        [section]: !prev.includedSections[section]
      }
    }));
  };

  const handleCardCountChange = (section, value) => {
    setSettings(prev => ({
      ...prev,
      cardCounts: {
        ...prev.cardCounts,
        [section]: value
      }
    }));
  };

  // Добавляем функцию для рандомизации количества карточек
  const handleRandomizeCardCounts = () => {
    const newCardCounts = { ...settings.cardCounts };
    
    // Рандомизируем количество карточек для каждого раздела, 
    // учитывая ограничение для услуг (минимум 4)
    Object.keys(newCardCounts).forEach(section => {
      if (section === 'SERVICES') {
        // Для услуг минимум 4 карточки, максимум 8
        newCardCounts[section] = Math.floor(Math.random() * 5) + 4; // 4-8
      } else {
        // Для остальных разделов от 2 до 7 карточек
        newCardCounts[section] = Math.floor(Math.random() * 6) + 2; // 2-7
      }
    });
    
    setSettings(prev => ({
      ...prev,
      cardCounts: newCardCounts
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const sectionLabels = {
    HERO: 'Hero секция',
    ABOUT: 'О нас',
    SERVICES: 'Услуги',
    FEATURES: 'Преимущества',
    NEWS: 'Новости',
    FAQ: 'Вопросы и ответы',
    TESTIMONIALS: 'Отзывы',
    CONTACTS: 'Контакты'
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Настройка промпта полного сайта
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Выберите разделы для включения в промпт:
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(settings.includedSections).map((section) => (
              <Grid item xs={6} sm={4} key={section}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={settings.includedSections[section]}
                      onChange={() => handleSectionToggle(section)}
                      disabled={section === 'HERO'} // Hero секция всегда включена
                    />
                  }
                  label={sectionLabels[section]}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Количество карточек в каждом разделе:
          </Typography>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="small" 
            onClick={handleRandomizeCardCounts}
            startIcon={<TuneIcon />}
          >
            Случайное кол-во
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {Object.keys(settings.cardCounts).map((section) => (
            settings.includedSections[section] && (
              <Grid item xs={12} sm={6} key={section}>
                <Typography id={`${section}-slider-label`}>
                  {sectionLabels[section]}: {settings.cardCounts[section]}
                </Typography>
                <Slider
                  value={settings.cardCounts[section]}
                  onChange={(e, newValue) => handleCardCountChange(section, newValue)}
                  aria-labelledby={`${section}-slider-label`}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={section === 'SERVICES' ? 4 : 1} // Минимум 4 для услуг, 1 для остальных
                  max={8}
                  sx={{ width: '90%' }}
                />
              </Grid>
            )
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Применить настройки
        </Button>
      </DialogActions>
    </Dialog>
  );
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
  
  // Добавляем состояние для настроек промпта полного сайта
  const [showFullSiteSettings, setShowFullSiteSettings] = useState(false);
  const [fullSiteSettings, setFullSiteSettings] = useState({
    includedSections: {
      HERO: true,
      ABOUT: true,
      SERVICES: true,
      FEATURES: true,
      NEWS: true,
      FAQ: true,
      TESTIMONIALS: true,
      CONTACTS: true
    },
    cardCounts: {
      ABOUT: 4,
      SERVICES: 4,
      FEATURES: 4,
      NEWS: 3,
      FAQ: 4,
      TESTIMONIALS: 3
    }
  });
  
  // Добавляем состояние для управления стилями сайта
  const [showStyleManager, setShowStyleManager] = useState(false);
  
  // Добавляем состояние для переключателя стилей
  const [singleStyleMode, setSingleStyleMode] = useState(true);
  
  // Функция для генерации промпта полного сайта с учетом настроек
  const generateFullSitePrompt = (settings) => {
    let sectionsPrompt = `Создайте полный контент для сайта. Строго следуйте формату ниже.

ВАЖНО: Каждый раздел должен начинаться с "=== РАЗДЕЛ: ИМЯ_РАЗДЕЛА ===" и заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="\n\n`;

    if (settings.includedSections.HERO) {
      sectionsPrompt += `=== РАЗДЕЛ: HERO ===
1. Первая строка - название сайта (максимум 2 слова)
2. Вторая строка - заголовок hero секции (4-7 слов)
3. Третья строка - описание (15-25 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.ABOUT) {
      sectionsPrompt += `=== РАЗДЕЛ: О НАС ===
ID: о_нас (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[${settings.cardCounts.ABOUT} карточек в формате:]
Заголовок карточки
Описание (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.SERVICES) {
      sectionsPrompt += `=== РАЗДЕЛ: УСЛУГИ ===
ID: услуги (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[${settings.cardCounts.SERVICES} карточек услуг в формате:]
Название услуги
Описание услуги (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FEATURES) {
      sectionsPrompt += `=== РАЗДЕЛ: ПРЕИМУЩЕСТВА ===
ID: преимущества (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[${settings.cardCounts.FEATURES} преимуществ в формате:]
Заголовок преимущества
Описание преимущества (30-50 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.NEWS) {
      sectionsPrompt += `=== РАЗДЕЛ: НОВОСТИ ===
ID: новости (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[${settings.cardCounts.NEWS} новостей в формате:]
Заголовок новости
Текст новости (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FAQ) {
      sectionsPrompt += `=== РАЗДЕЛ: ВОПРОСЫ ===
ID: вопросы (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[${settings.cardCounts.FAQ} вопросов в формате:]
Вопрос?
Ответ (50-100 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      sectionsPrompt += `=== РАЗДЕЛ: ОТЗЫВЫ ===
ID: отзывы (укажите ID на вашем языке)
Заголовок раздела
Описание раздела (20-30 слов)
Название для меню навигации

[${settings.cardCounts.TESTIMONIALS} отзывов в формате:]
Имя автора
Текст отзыва (50-80 слов)
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: КОНТАКТЫ ===
Заголовок раздела (например, "Контакты")
Название компании
Адрес компании
Телефон: +7 XXX XXX XX XX
Email: example@example.com
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    sectionsPrompt += `Важные требования:
1. Укажите "ID:" на необходимом языке (например, "ID: новости" для русского или "ID: news" для английского)
2. После "ID:" укажите название раздела на том же языке, на котором вы создаете контент
3. Весь контент должен быть на одном языке
4. Каждый раздел должен быть отделен разделителями === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===
5. Не использовать специальные символы и форматирование
6. Каждый элемент должен начинаться с новой строки
7. Между карточками/пунктами оставлять ОДНУ пустую строку`;

    return sectionsPrompt;
  };

  // Модифицируем функцию копирования промпта
  const copyPromptToClipboard = () => {
    // Для полного сайта показываем диалог настроек
    if (targetSection === 'FULL_SITE') {
      setShowFullSiteSettings(true);
      return;
    }
    
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
  
  // Функция для обработки сохранения настроек промпта полного сайта
  const handleFullSiteSettingsSave = (settings) => {
    setFullSiteSettings(settings);
    
    // Генерируем промпт на основе настроек
    const fullSitePrompt = generateFullSitePrompt(settings);
    
    // Применяем глобальные настройки
    const enhancedPrompt = applyGlobalSettings(fullSitePrompt);
    
    // Копируем промпт в буфер обмена
    navigator.clipboard.writeText(enhancedPrompt)
      .then(() => {
        setParserMessage('Настроенный промпт полного сайта скопирован в буфер обмена.');
        // Очищаем текстовое поле после копирования
        handleClearText();
      })
      .catch(() => {
        setParserMessage('Не удалось скопировать промпт.');
      });
  };

  // Функция для применения глобальных настроек к промпту
  const applyGlobalSettings = (promptText) => {
    const theme = globalSettings.theme === 'CUSTOM' 
      ? globalSettings.customTheme 
      : WEBSITE_THEMES[globalSettings.theme];

    // Определение языка для промпта
    let language;
    let languageCode = '';
    let languageName = '';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageCode = globalSettings.customLanguage;
      language = `языке с кодом ISO ${globalSettings.customLanguage}`;
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else {
      const langString = LANGUAGES[globalSettings.language] || '';
      // Извлекаем название языка и код
      languageName = langString.split(' ')[0]; // Берем только название языка без кода
      language = languageName;
      
      // Извлекаем код языка из строки в формате "Русский (ru)"
      const codeMatch = langString.match(/\(([a-z]{2})\)/i);
      languageCode = codeMatch ? codeMatch[1].toLowerCase() : '';
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

    // Специальная обработка для промпта правовых документов
    if (targetSection === 'LEGAL') {
      // Добавляем дополнительное указание перед промптом для лучшего понимания AI
      enhancedPrompt = `Создайте юридические документы для сайта "${theme}" СТРОГО на ${language}.\n`;
      enhancedPrompt += `Код языка: ${languageCode || 'не указан'}\n`;
      enhancedPrompt += `ВАЖНО: Весь текст документов ОБЯЗАТЕЛЬНО должен быть только на ${language}.\n`;
      enhancedPrompt += `Стиль: ${CONTENT_STYLES[globalSettings.contentStyle]}.\n\n`;
      
      if (globalSettings.customInstructions) {
        enhancedPrompt += `Дополнительные требования: ${globalSettings.customInstructions}\n\n`;
      }

      enhancedPrompt += promptText;
      
      // Добавляем финальную проверку с более строгими правилами
      enhancedPrompt += `\n\nФИНАЛЬНАЯ ПРОВЕРКА: 
1. Убедитесь, что ВСЕ документы написаны ПОЛНОСТЬЮ на ${language}, включая ВСЕ заголовки.
2. ПОЛНОСТЬЮ УДАЛИТЕ любые дополнительные комментарии, вопросы или предложения после последнего документа.
3. НЕ ДОБАВЛЯЙТЕ фразы типа "Надеюсь, это помогло", "Нужно ли еще что-то" или любые другие завершающие комментарии.
4. Ответ должен заканчиваться последним разделом последнего документа БЕЗ каких-либо добавлений.`;
      
      return enhancedPrompt;
    }

    // Стандартная обработка для других типов промптов
    enhancedPrompt += promptText;
    return enhancedPrompt;
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
      
      if (targetSection) {
        let parsedData = null;
        
        switch (targetSection) {
          case 'FULL_SITE':
            parsedData = parsers.parseFullSite(content, headerData);
            if (parsedData) {
              console.log('Результаты парсинга полного сайта:', parsedData);
              
              // Создаем новый объект для всех секций
              const updatedSections = { ...sectionsData };
              
              // Обновляем Hero секцию и заголовок сайта
              if (parsedData.hero) {
                console.log('Обрабатываем Hero секцию:', parsedData.hero);
                
                // Обновляем данные hero-секции
                const updatedHeroData = { ...heroData };
                
                if (parsedData.hero.title) {
                  updatedHeroData.title = parsedData.hero.title;
                }
                
                if (parsedData.hero.description) {
                  updatedHeroData.subtitle = parsedData.hero.description;
                }
                
                // Применяем обновления hero
                onHeroChange(updatedHeroData);
                
                // Обновляем название сайта в headerData
                if (parsedData.hero.siteName) {
                  // Создаем копию headerData для обновления
                  const updatedHeaderData = { 
                    ...headerData,
                    siteName: parsedData.hero.siteName
                  };
                  onHeaderChange(updatedHeaderData);
                }
              }
              
              // Определяем порядок секций для меню: О нас, Услуги, Преимущества, Новости, FAQ, Отзывы
              const sectionOrder = ['about', 'services', 'features', 'news', 'faq', 'testimonials'];

              // Создаем список пунктов меню, сохраняя нужный порядок
              const processOrderedSections = () => {
                // Создаем список секций в нужном порядке
                const orderedMenuItems = [];
                
                console.log('Доступные секции в parsedData:', Object.keys(parsedData));
                
                // Обрабатываем каждую секцию
                for (const sectionId of sectionOrder) {
                  console.log(`Обрабатываем секцию ${sectionId}`);
                  
                  // Получаем заголовок секции из parsedData
                  let section = null;
                  
                  switch (sectionId) {
                    case 'about':
                      section = parsedData.about;
                      break;
                    case 'services':
                      section = parsedData.services;
                      break;
                    case 'features':
                      section = parsedData.features;
                      break;
                    case 'news':
                      section = parsedData.news;
                      console.log('Секция новостей:', section);
                      break;
                    case 'faq':
                      section = parsedData.faq;
                      break;
                    case 'testimonials':
                      section = parsedData.testimonials;
                      break;
                  }
                  
                  if (section) {
                    console.log(`Секция ${sectionId} найдена:`, section);
                    
                    // ВАЖНОЕ ИЗМЕНЕНИЕ: 
                    // 1. Сохраняем секцию по её ID, а не по ключу массива
                    // 2. Явно указываем все важные поля, включая заголовок и описание 
                    updatedSections[section.id] = {
                      id: section.id,
                      title: section.title,
                      description: section.description,
                      cardType: section.cardType || 'ELEVATED',
                      cards: section.cards || [],
                      titleColor: section.titleColor || '#1976d2',
                      descriptionColor: section.descriptionColor || '#666666'
                    };
                    
                    console.log(`Обновлена секция ${section.id}:`, updatedSections[section.id]);
                    
                    // Используем заголовок секции для названия в меню
                    let menuText = section.id;
                    let menuId = section.id;

                    if (sectionId === 'news') {
                      console.log('Обрабатываем раздел новостей, ID из контента:', section.id);
                    }
                    
                    // Проверяем существование пункта меню
                    const existingMenuItem = headerData.menuItems.find(item => item.id === menuId);
                    
                    if (existingMenuItem) {
                      // Обновляем существующий пункт меню
                      orderedMenuItems.push({
                        ...existingMenuItem,
                        text: menuText,
                        link: `#${menuId}`
                      });
                    } else {
                      // Добавляем новый пункт меню
                      orderedMenuItems.push({
                        id: menuId,
                        text: menuText,
                        link: `#${menuId}`,
                        backgroundColor: '#ffffff',
                        textColor: '#000000',
                        borderColor: '#e0e0e0',
                        shadowColor: 'rgba(0,0,0,0.1)',
                        gradientStart: '#ffffff',
                        gradientEnd: '#f5f5f5',
                        gradientDirection: 'to right'
                      });
                    }
                  }
                }
                
                return orderedMenuItems;
              };

              // Заменяем существующий код создания menuItems этой функцией
              const menuItems = processOrderedSections();
              
              console.log('Обновленные секции перед применением:', updatedSections);

              // Обновляем все секции за один вызов
              onSectionsChange(updatedSections);

              // Обновляем меню с правильным порядком секций
              const finalHeaderData = {
                ...headerData,
                menuItems: menuItems
              };

              // Проверим, был ли обновлен заголовок сайта через hero
              if (parsedData.hero && parsedData.hero.siteName) {
                finalHeaderData.siteName = parsedData.hero.siteName;
              }

              // Теперь применяем все обновления к headerData
              onHeaderChange(finalHeaderData);
              
              // Обновляем контакты
              if (parsedData.contacts) {
                // Проверяем, что данные контактов заполнены правильно
                const contactsData = {
                  title: parsedData.contacts.title || 'Контакты',
                  description: parsedData.contacts.description || '',
                  companyName: parsedData.contacts.companyName || headerData.siteName || '',
                  address: parsedData.contacts.address || '',
                  phone: parsedData.contacts.phone || '',
                  email: parsedData.contacts.email || ''
                };
                onContactChange(contactsData);
              }
              
              // Добавляем принудительное обновление для гарантии применения всех изменений
              setTimeout(() => {
                console.log('Принудительное обновление страницы для применения изменений');
                // Повторно применяем обновления всех секций
                onSectionsChange({...updatedSections});
              }, 100);
              
              setParserMessage('Все разделы сайта успешно обновлены');
            }
            break;
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
            // Применяем функцию renderFeatureCards для исправления перепутанных заголовков и контента
            if (parsedData.cards && Array.isArray(parsedData.cards)) {
              parsedData.cards = renderFeatureCards(parsedData.cards);
            }
                    
            // Проверяем, существует ли уже пункт меню с таким ID
            const existingFeatureMenuItem = headerData.menuItems.find(item => item.id === parsedData.id);
                    
            // Обновляем пункт меню, если он существует
            if (existingFeatureMenuItem) {
              // Находим индекс существующего пункта меню
              const featureMenuIndex = headerData.menuItems.findIndex(item => item.id === parsedData.id);
                        
              // Создаем обновленный список пунктов меню
              const updatedFeatureMenuItems = [...headerData.menuItems];
              updatedFeatureMenuItems[featureMenuIndex] = {
                ...existingFeatureMenuItem,
                text: parsedData.id,
                link: `#${parsedData.id}`
              };
                        
              // Обновляем headerData
              onHeaderChange({
                ...headerData,
                menuItems: updatedFeatureMenuItems
              });
            } else {
              // Создаем новый пункт меню
              const newFeatureMenuItem = {
                id: parsedData.id,
                text: parsedData.id,
                link: `#${parsedData.id}`
              };
                        
              // Обновляем headerData
              onHeaderChange({
                ...headerData,
                menuItems: [...headerData.menuItems, newFeatureMenuItem]
              });
            }
                    
            // Сохраняем обновленные данные
            onSectionsChange({
              ...sectionsData,
              [parsedData.id]: parsedData
            });
                    
            setParserMessage('Данные раздела "Преимущества" успешно обновлены.');
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
              console.log('Результат обработки новостей:', parsedData);
              
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

  // Обработчик для применения стиля ко всему сайту
  const handleApplyWholeWebsiteStyle = (styleName, stylePreset) => {
    console.log(`Применяем стиль ${styleName} ко всему сайту`);
    
    // Применяем стиль к шапке сайта
    if (onHeaderChange && headerData) {
      onHeaderChange({
        ...headerData,
        titleColor: stylePreset.titleColor,
        backgroundColor: stylePreset.backgroundColor,
        borderColor: stylePreset.borderColor,
        // Добавляем свойства фона сайта
        siteBackgroundType: stylePreset.siteBackgroundType || 'solid',
        ...((!stylePreset.siteBackgroundType || stylePreset.siteBackgroundType === 'solid') && {
          siteBackgroundColor: stylePreset.siteBackgroundColor || stylePreset.backgroundColor || '#ffffff'
        }),
        ...(stylePreset.siteBackgroundType === 'gradient' && {
          siteGradientColor1: stylePreset.siteGradientColor1 || stylePreset.backgroundColor || '#ffffff',
          siteGradientColor2: stylePreset.siteGradientColor2 || stylePreset.cardBackgroundColor || '#f5f5f5',
          siteGradientDirection: stylePreset.siteGradientDirection || 'to bottom'
        })
      });
    }

    // Применяем стиль к разделам
    if (onSectionsChange && sectionsData) {
      const updatedSections = {};
      
      // Применяем стиль к каждой секции независимо от её ID
      Object.keys(sectionsData).forEach(sectionId => {
        const section = sectionsData[sectionId];
        
        // Обновляем свойства секции
        updatedSections[sectionId] = {
          ...section,
          titleColor: stylePreset.titleColor,
          descriptionColor: stylePreset.descriptionColor,
          backgroundColor: stylePreset.backgroundColor,
          borderColor: stylePreset.borderColor,
          cardType: stylePreset.cardType || section.cardType,
          
          // Обновляем свойства карточек внутри секции
          cards: (section.cards || []).map(card => ({
            ...card,
            titleColor: stylePreset.cardTitleColor,
            contentColor: stylePreset.cardContentColor,
            backgroundColor: stylePreset.cardBackgroundColor,
            borderColor: stylePreset.cardBorderColor,
            backgroundType: stylePreset.cardBackgroundType,
            gradientColor1: stylePreset.cardGradientColor1,
            gradientColor2: stylePreset.cardGradientColor2,
            gradientDirection: stylePreset.cardGradientDirection,
            style: {
              ...card.style,
              shadow: stylePreset.style?.shadow || '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: stylePreset.style?.borderRadius || '8px'
            }
          }))
        };
      });
      
      // Применяем все изменения за один раз
      onSectionsChange(updatedSections);
    }

    // Применяем соответствующий стиль к контактной форме из contactPresets
    if (onContactChange && contactData) {
      // Пытаемся найти подходящий стиль контактов
      let matchingContactStyle = null;
      
      // Ищем стиль контактов с тем же названием
      if (contactPresets[styleName]) {
        matchingContactStyle = contactPresets[styleName];
      } else {
        // Или находим стиль, который лучше всего соответствует цветовой схеме
        const matchingStyles = Object.entries(contactPresets).filter(([key, preset]) => {
          return (
            preset.titleColor === stylePreset.titleColor ||
            preset.formBackgroundColor === stylePreset.backgroundColor ||
            preset.buttonColor === stylePreset.titleColor
          );
        });
        
        if (matchingStyles.length > 0) {
          // Берем первый подходящий стиль
          matchingContactStyle = matchingStyles[0][1];
        } else {
          // Или ищем стиль, который близок по цветовой гамме
          const styleFirstWord = styleName.split('_')[0].toLowerCase();
          const matchByName = Object.entries(contactPresets).find(([key, preset]) => 
            key.toLowerCase().includes(styleFirstWord) || 
            (preset.name && preset.name.toLowerCase().includes(styleFirstWord))
          );
          
          if (matchByName) {
            matchingContactStyle = matchByName[1];
          }
        }
      }
      
      // Если нашли подходящий стиль, применяем его
      if (matchingContactStyle) {
        console.log('Применяем соответствующий стиль контактов:', matchingContactStyle.name || 'без имени');
        
        onContactChange({
          ...contactData,
          titleColor: matchingContactStyle.titleColor,
          descriptionColor: matchingContactStyle.descriptionColor,
          companyInfoColor: matchingContactStyle.companyInfoColor,
          formVariant: matchingContactStyle.formVariant,
          infoVariant: matchingContactStyle.infoVariant,
          formBackgroundColor: matchingContactStyle.formBackgroundColor,
          infoBackgroundColor: matchingContactStyle.infoBackgroundColor,
          formBorderColor: matchingContactStyle.formBorderColor,
          infoBorderColor: matchingContactStyle.infoBorderColor,
          labelColor: matchingContactStyle.labelColor,
          inputBackgroundColor: matchingContactStyle.inputBackgroundColor,
          inputTextColor: matchingContactStyle.inputTextColor,
          buttonColor: matchingContactStyle.buttonColor,
          buttonTextColor: matchingContactStyle.buttonTextColor,
          iconColor: matchingContactStyle.iconColor,
          infoTitleColor: matchingContactStyle.infoTitleColor,
          infoTextColor: matchingContactStyle.infoTextColor
        });
      } else {
        // Если не нашли, используем базовые цвета из выбранного стиля
        console.log('Используем базовые цвета для контактов из выбранного стиля сайта');
        
        onContactChange({
          ...contactData,
          titleColor: stylePreset.titleColor,
          descriptionColor: stylePreset.descriptionColor,
          buttonColor: stylePreset.titleColor,
          buttonTextColor: stylePreset.cardBackgroundColor,
          formBorderColor: stylePreset.borderColor,
          infoTitleColor: stylePreset.titleColor,
          infoTextColor: stylePreset.descriptionColor
        });
      }
    }

    // Применяем стиль к герою
    if (onHeroChange && heroData) {
      onHeroChange({
        ...heroData,
        titleColor: stylePreset.titleColor,
        descriptionColor: stylePreset.descriptionColor,
        backgroundColor: stylePreset.backgroundColor,
        borderColor: stylePreset.borderColor,
      });
    }
  };

  // Модифицируем функцию для применения случайного стиля
  const applyRandomStyle = () => {
    // Получаем все доступные стили из STYLE_PRESETS
    const styleNames = Object.keys(STYLE_PRESETS);
    
    if (singleStyleMode) {
      // Применяем один и тот же стиль ко всем разделам
      const randomStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const randomStylePreset = STYLE_PRESETS[randomStyleName];
      
      console.log(`Применяем один случайный стиль ко всем разделам: ${randomStyleName}`);
      handleApplyWholeWebsiteStyle(randomStyleName, randomStylePreset);
    } else {
      // Применяем разные случайные стили к каждому разделу
      console.log('Применяем разные случайные стили к каждому разделу');
      
      // Применяем случайный стиль к шапке
      const headerStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const headerStylePreset = STYLE_PRESETS[headerStyleName];
      
      if (onHeaderChange && headerData) {
        onHeaderChange({
          ...headerData,
          titleColor: headerStylePreset.titleColor,
          backgroundColor: headerStylePreset.backgroundColor,
          borderColor: headerStylePreset.borderColor,
          // Добавляем свойства фона сайта
          siteBackgroundType: headerStylePreset.siteBackgroundType || 'solid',
          ...((!headerStylePreset.siteBackgroundType || headerStylePreset.siteBackgroundType === 'solid') && {
            siteBackgroundColor: headerStylePreset.siteBackgroundColor || headerStylePreset.backgroundColor || '#ffffff'
          }),
          ...(headerStylePreset.siteBackgroundType === 'gradient' && {
            siteGradientColor1: headerStylePreset.siteGradientColor1 || headerStylePreset.backgroundColor || '#ffffff',
            siteGradientColor2: headerStylePreset.siteGradientColor2 || headerStylePreset.cardBackgroundColor || '#f5f5f5',
            siteGradientDirection: headerStylePreset.siteGradientDirection || 'to bottom'
          })
        });
      }
      
      // Применяем случайные стили к каждой секции
      if (onSectionsChange && sectionsData) {
        const updatedSections = {};
        
        Object.keys(sectionsData).forEach(sectionId => {
          const section = sectionsData[sectionId];
          const sectionStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
          const sectionStylePreset = STYLE_PRESETS[sectionStyleName];
          
          updatedSections[sectionId] = {
            ...section,
            titleColor: sectionStylePreset.titleColor,
            descriptionColor: sectionStylePreset.descriptionColor,
            backgroundColor: sectionStylePreset.backgroundColor,
            borderColor: sectionStylePreset.borderColor,
            cardType: sectionStylePreset.cardType || section.cardType,
            
            cards: (section.cards || []).map(card => ({
              ...card,
              titleColor: sectionStylePreset.cardTitleColor,
              contentColor: sectionStylePreset.cardContentColor,
              backgroundColor: sectionStylePreset.cardBackgroundColor,
              borderColor: sectionStylePreset.cardBorderColor,
              backgroundType: sectionStylePreset.cardBackgroundType,
              gradientColor1: sectionStylePreset.cardGradientColor1,
              gradientColor2: sectionStylePreset.cardGradientColor2,
              gradientDirection: sectionStylePreset.cardGradientDirection,
              style: {
                ...card.style,
                shadow: sectionStylePreset.style?.shadow || '0 2px 4px rgba(0,0,0,0.1)',
                borderRadius: sectionStylePreset.style?.borderRadius || '8px'
              }
            }))
          };
        });
        
        onSectionsChange(updatedSections);
      }
      
      // Применяем случайный стиль к hero
      const heroStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const heroStylePreset = STYLE_PRESETS[heroStyleName];
      
      if (onHeroChange && heroData) {
        onHeroChange({
          ...heroData,
          titleColor: heroStylePreset.titleColor,
          descriptionColor: heroStylePreset.descriptionColor,
          backgroundColor: heroStylePreset.backgroundColor,
          borderColor: heroStylePreset.borderColor,
        });
      }
      
      // Применяем случайный стиль к контактам
      const contactStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const contactStylePreset = STYLE_PRESETS[contactStyleName];
      
      if (onContactChange && contactData) {
        onContactChange({
          ...contactData,
          titleColor: contactStylePreset.titleColor,
          descriptionColor: contactStylePreset.descriptionColor,
          buttonColor: contactStylePreset.titleColor,
          buttonTextColor: contactStylePreset.cardBackgroundColor,
          formBorderColor: contactStylePreset.borderColor,
          infoTitleColor: contactStylePreset.titleColor,
          infoTextColor: contactStylePreset.descriptionColor
        });
      }
    }
  };

  // Функция для исправления карточек с перепутанными полями title и content
  function renderFeatureCards(cards) {
    // Проверка входных данных
    if (!cards || !Array.isArray(cards)) {
      return [];
    }
    
    // Создаем новый массив с исправленными карточками
    return cards.map(card => {
      // Проверяем условия для перестановки полей
      const titleIsTooLong = card.title && card.title.length > 50;
      const contentIsShort = !card.content || card.content.length < 30 || card.content === '\\';
      
      // Если заголовок длинный, а содержимое короткое, меняем их местами
      if (titleIsTooLong && contentIsShort) {
        return {
          ...card,
          title: card.content,
          content: card.title
        };
      }
      
      // Иначе возвращаем карточку без изменений
      return card;
    });
  }

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
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              {/* Скрываем кнопку "НАСТРОЙКИ ПАРСЕРА", но сохраняем функционал */}
              {false && (
                <Button
                  variant="outlined"
                  onClick={() => setShowSettings(true)}
                  sx={{
                    color: '#0288d1',
                    borderColor: '#0288d1',
                    '&:hover': {
                      borderColor: '#0277bd',
                      backgroundColor: 'rgba(2, 136, 209, 0.04)'
                    },
                    textTransform: 'none',
                    fontSize: '0.9rem'
                  }}
                  startIcon={
                    <Box sx={{ color: '#0288d1', display: 'flex', alignItems: 'center' }}>
                      <SettingsIcon />
                    </Box>
                  }
                >
                  НАСТРОЙКИ ПАРСЕРА
                </Button>
              )}
              <Button
                variant="outlined"
                onClick={() => setShowGlobalSettings(true)}
                sx={{
                  color: '#e91e63',
                  borderColor: '#e91e63',
                  '&:hover': {
                    borderColor: '#d81b60',
                    backgroundColor: 'rgba(233, 30, 99, 0.04)'
                  },
                  textTransform: 'none',
                  fontSize: '0.9rem'
                }}
                startIcon={
                  <Box sx={{ color: '#e91e63', display: 'flex', alignItems: 'center' }}>
                    <TuneIcon />
                  </Box>
                }
              >
                НАСТРОЙКИ КОНТЕНТА
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 1 }}>
              <Button
                variant="outlined"
                onClick={() => setShowStyleManager(true)}
                sx={{
                  color: '#4caf50',
                  borderColor: '#4caf50',
                  '&:hover': {
                    borderColor: '#43a047',
                    backgroundColor: 'rgba(76, 175, 80, 0.04)'
                  },
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  mr: 1
                }}
                startIcon={
                  <Box sx={{ color: '#4caf50', display: 'flex', alignItems: 'center' }}>
                    <StyleIcon />
                  </Box>
                }
              >
                СТИЛИ САЙТА
              </Button>
              
              <Tooltip title="Применить случайный стиль ко всему сайту" placement="top">
                <IconButton 
                  onClick={applyRandomStyle}
                  size="small"
                  sx={{
                    color: '#4caf50',
                    border: '1px solid #4caf50',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.04)'
                    },
                    width: 34,
                    height: 34
                  }}
                >
                  <ShuffleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                <Typography variant="caption" sx={{ mr: 0.5, fontSize: '0.7rem', color: singleStyleMode ? '#bdbdbd' : '#4caf50' }}>
                  ALL
                </Typography>
                <Switch
                  checked={singleStyleMode}
                  onChange={(e) => setSingleStyleMode(e.target.checked)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4caf50',
                      '&:hover': {
                        backgroundColor: 'rgba(76, 175, 80, 0.08)'
                      }
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4caf50'
                    }
                  }}
                />
                <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem', color: singleStyleMode ? '#4caf50' : '#bdbdbd' }}>
                  1
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Добавляем компонент глобальных настроек с новой функцией */}
          <GlobalSettings
            open={showGlobalSettings}
            onClose={() => setShowGlobalSettings(false)}
            settings={globalSettings}
            onSettingsChange={handleGlobalSettingsChange}
          />
          
          {/* Добавляем компонент настроек промпта полного сайта */}
          <FullSitePromptSettings
            open={showFullSiteSettings}
            onClose={() => setShowFullSiteSettings(false)}
            onSave={handleFullSiteSettingsSave}
            initialSettings={fullSiteSettings}
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
                <MenuItem value="FULL_SITE">Полный сайт</MenuItem>
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
              <Tooltip title={targetSection === 'FULL_SITE' ? "Настроить и скопировать промпт" : "Скопировать шаблон промпта"} arrow placement="top">
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
                    {targetSection === 'FULL_SITE' ? 'Настроить' : 'Копировать'}
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

          {/* Компонент управления стилями */}
          <SiteStyleManager 
            open={showStyleManager}
            onClose={() => setShowStyleManager(false)}
            headerData={headerData}
            sectionsData={sectionsData}
            heroData={heroData}
            contactData={contactData}
            footerData={{}}
            onApplyToWholeWebsite={handleApplyWholeWebsiteStyle}
            onHeaderChange={onHeaderChange}
            onSectionsChange={onSectionsChange}
            onHeroChange={onHeroChange}
            onContactChange={onContactChange}
          />
        </Paper>
      </AccordionDetails>
    </Accordion>
  );
};

export default AiParser; 