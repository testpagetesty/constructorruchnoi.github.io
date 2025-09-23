import React, { useState, useRef, useEffect } from 'react';
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
  ListItemIcon,
  List,
  ListItem,
  Chip,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Grid,
  Slider,
  Switch,
  Radio,
  RadioGroup
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import TuneIcon from '@mui/icons-material/Tune';
import StyleIcon from '@mui/icons-material/Style';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from '@mui/material/CircularProgress';
import { CARD_TYPES } from '../../utils/configUtils';
import GlobalSettings, { WEBSITE_THEMES, LANGUAGES, CONTENT_STYLES } from './GlobalSettings';
import SiteStyleManager from '../SiteStyleSettings/SiteStyleManager';
import ElementPromptsSection, { ELEMENT_PROMPTS } from './ElementPromptsSection';
import * as parsers from './parsingFunctions';
import { STYLE_PRESETS } from '../../utils/editorStylePresets';
import { contactPresets } from '../../utils/contactPresets';
import { headerPresets } from '../../utils/headerPresets';

// Function to remove Markdown formatting
const removeMarkdownFormatting = (text) => {
  if (!text) return text;
  
  // Remove bold formatting (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove italic formatting (*text*)
  text = text.replace(/\*(.*?)\*/g, '$1');
  
  // Other possible Markdown formatting
  text = text
    .replace(/`(.*?)`/g, '$1') // code
    .replace(/__(.*?)__/g, '$1') // underline
    .replace(/_(.*?)_/g, '$1') // italic with underscore
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // links
    
  return text;
};

// Добавляем объект с предустановленными промптами
const DEFAULT_PROMPTS = {
  FULL_SITE: `Создайте полный контент для сайта. Строго следуйте формату ниже.

КРИТИЧЕСКИ ВАЖНО: 
1. Весь контент, включая ID секций, ДОЛЖЕН быть на одном языке (который указан в настройках)
2. ID секции должен быть написан на том же языке, что и весь контент
3. Не использовать смешанные языки или транслитерацию
4. Каждый раздел должен начинаться с "=== РАЗДЕЛ: ИМЯ ===" и заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. НЕ ИСПОЛЬЗУЙТЕ символы экранирования (\) перед разделителями ===
6. Разделители должны быть точно: === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===

ВАЖНО: Не добавляйте обратные слеши (\) перед символами ===. Используйте точно такой формат:
=== РАЗДЕЛ: О НАС ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===\n\n`,

  GRADIENT_TEXT: `Создайте описание текстового контента для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: продвинутые-текстовые"
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню
5. Далее - элементы контента в формате:
   ТИП: gradient-text
   СОДЕРЖИМОЕ: [текст для отображения]

Где:
- [текст] - короткий эффектный текст или заголовок (1-5 слов)

Пример:
ID: продвинутые-текстовые
Современные текстовые элементы для сайта
Набор эффективных текстовых элементов для создания привлекательного и информативного контента на вашем сайте
Текстовые элементы

ТИП: gradient-text
СОДЕРЖИМОЕ: Инновационные решения

ТИП: gradient-text
СОДЕРЖИМОЕ: Ваш успех

ТИП: gradient-text
СОДЕРЖИМОЕ: Качество и надежность

ТИП: gradient-text
СОДЕРЖИМОЕ: Профессиональный подход

ТИП: gradient-text
СОДЕРЖИМОЕ: Результат гарантирован

ВАЖНО: 
1. Указывайте ТОЛЬКО текст в строке СОДЕРЖИМОЕ
2. НЕ добавляйте ТЕКСТ, НАПРАВЛЕНИЕ, ЦВЕТ1, ЦВЕТ2, РАЗМЕР_ШРИФТА, ТОЛЩИНА_ШРИФТА
3. НЕ используйте дополнительные параметры - только ТИП и СОДЕРЖИМОЕ
4. Используйте короткие эффектные фразы
5. Каждый элемент должен быть отделен пустой строкой\n\n`,

  SOLID_COLOR_TEXT: `Создайте описание текстового контента с чистым цветом для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: цветной-текст"
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню
5. Далее - элементы контента в формате:
   ТИП: solid-text
   СОДЕРЖИМОЕ: [текст для отображения]

Где:
- [текст] - короткий эффектный текст или заголовок (1-5 слов)

Пример:
ID: цветной-текст
Яркие акценты и заголовки
Привлекательные цветные тексты для выделения важной информации и создания ярких акцентов на сайте
Цветные акценты

ТИП: solid-text
СОДЕРЖИМОЕ: Наши преимущества

ТИП: solid-text
СОДЕРЖИМОЕ: Лучший выбор

ТИП: solid-text
СОДЕРЖИМОЕ: Гарантия качества

ТИП: solid-text
СОДЕРЖИМОЕ: Доверие клиентов

ТИП: solid-text
СОДЕРЖИМОЕ: Экспертное качество

ВАЖНО: 
1. Указывайте ТОЛЬКО текст в строке СОДЕРЖИМОЕ
2. НЕ добавляйте ЦВЕТ, РАЗМЕР_ШРИФТА, ТОЛЩИНА_ШРИФТА или другие параметры
3. НЕ используйте дополнительные параметры - только ТИП и СОДЕРЖИМОЕ
4. Используйте короткие эффектные фразы
5. Каждый элемент должен быть отделен пустой строкой\n\n`,

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
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки "О нас", где:
   - Каждая карточка начинается с заголовка
   - После заголовка идет описание
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: о_нас
Профессиональная команда с многолетним опытом
Узнайте больше о нашей истории, достижениях и ценностях
О нас

История компании
Основанная в 2010 году, наша компания прошла путь от небольшой фирмы до одного из лидеров рынка. За это время мы успешно реализовали более 1000 проектов и помогли сотням клиентов.

Наша миссия
Мы стремимся сделать услуги доступными и понятными для каждого клиента. Наша цель - не просто решать вопросы, а создавать долгосрочные партнерские отношения.

Рекомендуемое количество карточек: 4-6`,

  SERVICES: `Создайте описание услуг для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - элементы услуг в формате:
   ТИП: [тип элемента: typography, list, blockquote, table, chart, accordion, testimonial, imageCard]
   ЗАГОЛОВОК: [заголовок элемента]
   СОДЕРЖИМОЕ: [содержимое элемента]
   
   - Используйте разнообразные типы элементов
   - Между элементами ОДНА пустая строка

ОСОБЫЕ ТРЕБОВАНИЯ ДЛЯ АККОРДЕОНА (accordion):
Для элемента типа "accordion" используйте строго следующий формат:
ТИП: accordion
ЗАГОЛОВОК: [Заголовок аккордеона]
СОДЕРЖИМОЕ: [Заголовок панели 1]? [Содержимое панели 1] * [Заголовок панели 2]? [Содержимое панели 2] * [Заголовок панели 3]? [Содержимое панели 3]

Пример аккордеона:
ТИП: accordion
ЗАГОЛОВОК: Часто задаваемые вопросы
СОДЕРЖИМОЕ: Как начать работу с вашей компанией? Для начала работы достаточно оставить заявку через форму на сайте или позвонить по указанному номеру телефона. Наш менеджер свяжется с вами в течение рабочего дня для обсуждения деталей сотрудничества. * Какие гарантии вы предоставляете? Мы гарантируем высокое качество наших услуг и строго соблюдаем все договорные обязательства. Каждый проект сопровождается официальным договором. * Сколько времени занимает выполнение заказа? Сроки выполнения зависят от сложности проекта и составляют от 1 до 30 дней. Точные сроки оговариваются индивидуально с каждым клиентом.

Пример на русском:
ID: услуги
Комплексные решения для вашего бизнеса
Профессиональная поддержка для вашего бизнеса и частных лиц
Услуги

ТИП: list
ЗАГОЛОВОК: Основные услуги
СОДЕРЖИМОЕ: Консультации по бизнесу * Разработка стратегий * Автоматизация процессов * Техническая поддержка

ТИП: accordion
ЗАГОЛОВОК: Часто задаваемые вопросы
СОДЕРЖИМОЕ: Как начать работу с вашей компанией? Для начала работы достаточно оставить заявку через форму на сайте или позвонить по указанному номеру телефона. Наш менеджер свяжется с вами в течение рабочего дня для обсуждения деталей сотрудничества. * Какие гарантии вы предоставляете? Мы гарантируем высокое качество наших услуг и строго соблюдаем все договорные обязательства. Каждый проект сопровождается официальным договором. * Сколько времени занимает выполнение заказа? Сроки выполнения зависят от сложности проекта и составляют от 1 до 30 дней. Точные сроки оговариваются индивидуально с каждым клиентом.

Рекомендуемое количество элементов: 4-6`,

  FEATURES: `Создайте описание преимуществ для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки преимуществ, где:
   - Каждое преимущество начинается с краткого заголовка
   - После заголовка идет развернутое описание
   - Между преимуществами ОДНА пустая строка

Пример на русском:
ID: преимущества
Почему клиенты выбирают нашу компанию
Ключевые преимущества работы с нашей компанией
Преимущества

Профессионализм
Наши специалисты имеют более 15 лет опыта. Каждый эксперт регулярно проходит повышение квалификации.

Качество
Гарантируем высокое качество всех услуг. Работаем по международным стандартам.

Рекомендуемое количество преимуществ: 4-6`,

  TESTIMONIALS: `Создайте отзывы для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки отзывов, где:
   - Первая строка каждой карточки - имя автора
   - Следующие строки - текст отзыва
   - Между карточками ОДНА пустая строка

Пример на русском:
ID: отзывы
Что говорят наши довольные клиенты
Отзывы клиентов о качестве нашей работы и достигнутых результатах
Отзывы

Анна Петрова
Обратилась в компанию по вопросу оформления документов. Все было сделано быстро и профессионально. Очень довольна качеством услуг.

Сергей Иванов
Благодарен за помощь в решении сложного вопроса. Специалисты компании проявили высокий профессионализм и внимание к деталям.

Рекомендуемое количество отзывов: 3-5`,

  FAQ: `Создайте раздел вопросов и ответов для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - вопросы и ответы, где:
   - Каждый вопрос должен заканчиваться знаком "?"
   - После вопроса идет развернутый ответ
   - Между вопросами ОДНА пустая строка

Пример на русском:
ID: вопросы
Ответы на популярные вопросы клиентов
Здесь вы найдете ответы на самые распространенные вопросы о наших услугах и процессе работы
Вопросы и ответы

Как начать работу с вашей компанией?
Для начала работы с нашей компанией достаточно оставить заявку через форму на сайте или позвонить по указанному номеру телефона. Наш менеджер свяжется с вами в течение рабочего дня для обсуждения деталей сотрудничества.

Какие гарантии вы предоставляете?
Мы гарантируем высокое качество наших услуг и строго соблюдаем все договорные обязательства. Каждый проект сопровождается официальным договором, где прописаны все условия сотрудничества, сроки и гарантийные обязательства.

Рекомендуемое количество вопросов: 4-6`,

  NEWS: `Создайте новости для сайта. Строго следуйте формату ниже.

Требуемый формат:
1. Первая строка ОБЯЗАТЕЛЬНО должна быть "ID: " и название секции на языке основного контента (краткое, 1-2 слова)
2. Вторая строка - заголовок раздела (4-7 слов, должен быть информативным и отличаться от ID)
3. Третья строка - общее описание раздела (20-30 слов)
4. Четвертая строка - название секции для меню на том же языке
5. Далее - карточки новостей, где:
   - Каждая новость начинается с заголовка
   - После заголовка идет текст новости
   - Между новостями ОДНА пустая строка

Пример на русском:
ID: новости
Актуальные события и достижения компании
Следите за последними новостями и важными событиями в жизни нашей компании
Новости

Успешное завершение крупного проекта
Наша компания одержала значимую победу в важном деле, защитив интересы крупного промышленного предприятия. Благодаря профессионализму наших специалистов, клиенту удалось отстоять свои права и сохранить активы стоимостью более 100 миллионов рублей.

Наши специалисты получили престижную награду
Ведущие специалисты нашей компании были отмечены в рейтинге "Лучшие профессионалы года". Это признание подтверждает высокий уровень экспертизы нашей команды и качество предоставляемых услуг.

Рекомендуемое количество новостей: 3-5`,

  CONTACTS: `Используй язык который указан для нашего промта

Создайте раздел контактов для сайта.

Требуемый формат:
1. Первая строка - заголовок "Контакты" (используется язык основного контента)
2. Вторая строка - пустая
3. Третья строка - описание в скобках (должно содержать призыв оставить заявку или связаться, например: "Свяжитесь с нами для получения консультации" или "Оставьте заявку, и мы свяжемся с вами в ближайшее время")
4. Четвертая строка - пустая
5. Далее контактные данные в строгом порядке:
   - Адрес (ОЧЕНЬ ВАЖНО: формат адреса должен строго соответствовать международным стандартам для выбранной страны)
   - Пустая строка
   - Телефон (используйте правильный формат номера для выбранной страны)
   - Пустая строка
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

(Мы ценим каждого клиента и готовы оказать профессиональную поддержку. Свяжитесь с нами для получения консультации или оставьте заявку, и наши специалисты оперативно ответят на все ваши вопросы)

107023, Москва, ул. Большая Семёновская, д. 40, оф. 304

+7 (495) 123-45-67

info@your-law.com

Примечание: 
- Название компании будет автоматически синхронизировано с названием сайта из настроек шапки.
- Email адрес будет автоматически сформирован как info@[название-сайта].com, где [название-сайта] - это транслитерированное название сайта из настроек шапки.
=== КОНЕЦ РАЗДЕЛА ===\n\n`,

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

const WordRangeEditor = ({ section, ranges, onChange }) => {
  const handleRangeChange = (field, type, value) => {
    const newRange = { ...ranges[field] };
    const parsedValue = Math.max(1, parseInt(value) || 1);
    
    // Определяем тип контента
    const isCardContent = field === 'cardContent';
    
    // Применяем ограничения для cardContent
    if (isCardContent) {
      if (type === 'min') {
        // Минимум не может быть меньше 55 для cardContent
        newRange.min = Math.max(55, parsedValue);
        // Если максимум меньше минимума + 10, корректируем максимум
        if (newRange.max < newRange.min + 10) {
          newRange.max = Math.min(130, newRange.min + 10);
        }
      } else if (type === 'max') {
        // Максимум не может быть больше 130 для cardContent
        newRange.max = Math.min(130, parsedValue);
        // Если минимум больше максимума - 10, корректируем минимум
        if (newRange.min > newRange.max - 10) {
          newRange.min = Math.max(55, newRange.max - 10);
        }
      }
    } else {
      // Для других полей просто обновляем значение
      newRange[type] = parsedValue;
      
      // Убедимся, что max всегда больше min
      if (type === 'min' && newRange.max < newRange.min) {
        newRange.max = newRange.min + 1;
      } else if (type === 'max' && newRange.max < newRange.min) {
        newRange.min = newRange.max - 1;
      }
    }
    
    onChange(section, field, newRange);
  };

  const getFieldLabel = (field) => {
    if (section === 'HERO') {
      switch (field) {
        case 'title':
          return 'Заголовок Hero';
        case 'description':
          return 'Описание Hero';
        default:
          return field;
      }
    } else {
      switch (field) {
        case 'sectionTitle':
          return 'Заголовок раздела';
        case 'sectionDescription':
          return 'Описание раздела';
        case 'cardContent':
          return 'Содержимое карточки';
        default:
          return field;
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {section === 'HERO' ? 'Hero секция' : section}:
      </Typography>
      {Object.entries(ranges).map(([field, range]) => (
        <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ minWidth: 150 }}>
            {getFieldLabel(field)}:
          </Typography>
          <TextField
            size="small"
            type="number"
            label="Мин"
            value={range.min}
            onChange={(e) => handleRangeChange(field, 'min', e.target.value)}
            sx={{ width: 80, mr: 1 }}
            inputProps={{
              min: field === 'cardContent' ? 55 : 1,
              max: field === 'cardContent' ? 130 : undefined
            }}
          />
          <Typography variant="body2" sx={{ mx: 1 }}>-</Typography>
          <TextField
            size="small"
            type="number"
            label="Макс"
            value={range.max}
            onChange={(e) => handleRangeChange(field, 'max', e.target.value)}
            sx={{ width: 80 }}
            inputProps={{
              min: field === 'cardContent' ? 55 : 1,
              max: field === 'cardContent' ? 130 : undefined
            }}
          />
        </Box>
      ))}
    </Box>
  );
};



// Добавляем компонент настройки промпта полного сайта
const FullSitePromptSettings = ({ open, onClose, onSave, initialSettings, currentStep, setCurrentStep, completedSteps, setCompletedSteps, showPromptModal, setShowPromptModal, generatedPrompt, setGeneratedPrompt, globalSettings, getCurrentLanguage, getCurrentTheme, setParserMessage }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [promptType, setPromptType] = useState('optimized');
  const [selectedElements, setSelectedElements] = useState({});
  const [customPrompts, setCustomPrompts] = useState({});
  
  // Инициализируем разделы первого этапа при открытии диалога
  useEffect(() => {
    if (open && currentStep === 1) {
      const firstStepSections = STEP_SECTIONS[1];
      setSettings(prev => ({
        ...prev,
        includedSections: Object.keys(prev.includedSections).reduce((acc, section) => {
          acc[section] = firstStepSections.includes(section);
          return acc;
        }, {})
      }));
    }
  }, [open, currentStep]);
  
  // Функция для активации разделов текущего этапа
  const activateCurrentStepSections = () => {
    const currentStepSections = STEP_SECTIONS[currentStep];
    const allSections = Object.keys(settings.includedSections);
    
    setSettings(prev => ({
      ...prev,
      includedSections: allSections.reduce((acc, section) => {
        // Включаем только разделы текущего этапа
        acc[section] = currentStepSections.includes(section);
        return acc;
      }, {})
    }));
  };
  
  // Константы для этапов
  const STEP_SECTIONS = {
    1: ['HERO', 'ABOUT', 'FEATURES'],
    2: ['NEWS', 'SERVICES'],
    3: ['FAQ', 'CONTACTS', 'TESTIMONIALS'],
    4: ['LEGAL_DOCUMENTS', 'MERCI', 'UNIVERSAL']
  };
  
  const STEP_LABELS = {
    1: 'Этап 1: Главная + О нас + Преимущества',
    2: 'Этап 2: Новости + Услуги',
    3: 'Этап 3: FAQ + Контакты + Отзывы',
    4: 'Этап 4: Документы + Благодарность + Универсальная'
  };
  
  // Функция для получения значений по умолчанию для elementSettings
  const getDefaultElementSettings = () => {
    return {
      // Текстовые элементы
      'typography': { minContent: 70 },
      'rich-text': { minTitle: 30, minContent: 70 },
      'blockquote': { minTitle: 20, minContent: 70 },
      'list': { minContent: 70 },
      'callout': { minTitle: 30, minContent: 70 },
      'gradient-text': { minContent: 60 },
      'animated-counter': { minTitle: 60 },
      'typewriter-text': { minContent: 70 },
      'highlight-text': { minContent: 50 },
      'testimonial-card': { minContent: 60 },
      
      // Интерактивные элементы
      'faq-section': { minTitle: 40, minContent: 40, minQuestions: 5 },
      'accordion': { minTitle: 20, minContent: 40, minQuestions: 8 },
      'qr-code': { minTitle: 15 },
      'color-picker': { minTitle: 20, minContent: 40 },
      'share-buttons': { minContent: 40 },
      'rating': { minTitle: 30, minContent: 40 },
      'progress-bars': { minTitle: 30, minContent: 40 },
      'timeline-component': { minTitle: 20, minContent: 40, minDataPoints: 5 },
      'data-table': { minTitle: 20, minContent: 40, minRows: 5, minColumns: 7 },
      'image-gallery': { minTitle: 35, minContent: 60 },
      
      // Карточки
      'basic-card': { minTitle: 18, minContent: 60 },
      'image-card': { minTitle: 20, minContent: 70 },
      'multiple-cards': { minTitle: 20, minContent: 70, minCards: 4 },
      
      // Диаграммы и графики
      'bar-chart': { minTitle: 20, minContent: 50, minColumns: 8, minDataPoints: 8 },
      'advanced-line-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'advanced-pie-chart': { minTitle: 20, minContent: 30, minDataPoints: 5 },
      'advanced-area-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'chartjs-bar': { minTitle: 20, minContent: 50, minColumns: 8, minDataPoints: 8 },
      'chartjs-line': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'chartjs-pie': { minTitle: 20, minContent: 30, minDataPoints: 5 },
      'chartjs-doughnut': { minTitle: 20, minContent: 30, minDataPoints: 5 },
      'chartjs-area': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-line': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-area-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-bar-chart': { minTitle: 20, minContent: 40, minColumns: 8, minDataPoints: 8 },
      'apex-line-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-pie-chart': { minTitle: 20, minContent: 30, minDataPoints: 5 },
      'apex-donut-chart': { minTitle: 20, minContent: 30, minDataPoints: 5 },
      'apex-radar-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-polar-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-candlestick-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-heatmap-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-treemap-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-bubble-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-scatter-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      'apex-mixed-chart': { minTitle: 20, minContent: 40, minColumns: 7, minDataPoints: 5 },
      
      // Формы и другие элементы
      'advanced-contact-form': { minTitle: 20, minContent: 40 },
      'cta-section': { minTitle: 20, minContent: 40 },
      'full-multipage-site': { minTitle: 20, minContent: 40 }
    };
  };

  const [elementSettings, setElementSettings] = useState(getDefaultElementSettings());

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

  const handleWordRangeChange = (section, field, newRange) => {
    setSettings(prev => ({
      ...prev,
      wordRanges: {
        ...prev.wordRanges,
        [section]: {
          ...prev.wordRanges[section],
          [field]: newRange
        }
      }
    }));
  };



  const handleElementToggle = (section, elementKey) => {
    // Проверяем, не отключен ли элемент
    if (DISABLED_ELEMENTS.has(elementKey)) {
      return; // Не позволяем выбирать отключенные элементы
    }
    
    setSelectedElements(prev => {
      const newElements = { ...prev };
      if (!newElements[section]) {
        newElements[section] = new Set();
      }
      
      const sectionElements = new Set(newElements[section]);
      if (sectionElements.has(elementKey)) {
        sectionElements.delete(elementKey);
      } else {
        sectionElements.add(elementKey);
      }
      
      newElements[section] = sectionElements;
      return newElements;
    });
  };

  // Полный список всех доступных элементов
  const ALL_ELEMENTS = [
    'typography', 'rich-text', 'blockquote', 'list', 'callout', 
    'gradient-text', 'animated-counter', 'typewriter-text', 'highlight-text',
    'testimonial-card', 'faq-section', 'timeline-component', 'image-gallery',
    'basic-card', 'image-card', 'multiple-cards', 'accordion', 'qr-code',
    'rating', 'progress-bars', 'data-table', 'bar-chart', 'advanced-line-chart',
    'advanced-pie-chart', 'advanced-area-chart', 'chartjs-bar', 'chartjs-doughnut',
    'apex-line', 'advanced-contact-form', 'cta-section'
  ];

  // Список отключенных элементов
  const DISABLED_ELEMENTS = new Set([
    'qr-code', 'chartjs-bar', 'chartjs-doughnut', 'apex-line', 'advanced-contact-form'
  ]);

  // Функция для случайного выбора элементов в разделе
  const handleRandomSelection = (section, elements) => {
    if (!elements || elements.length === 0) return;

    // Фильтруем отключенные элементы
    const availableElements = elements.filter(element => !DISABLED_ELEMENTS.has(element));
    if (availableElements.length === 0) return;

    // Определяем количество элементов для выбора (3-5)
    const minElements = 3;
    const maxElements = Math.min(5, availableElements.length);
    const elementsToSelect = Math.floor(Math.random() * (maxElements - minElements + 1)) + minElements;

    // Перемешиваем элементы и выбираем случайные
    const shuffled = [...availableElements].sort(() => 0.5 - Math.random());
    const selectedKeys = shuffled.slice(0, elementsToSelect);

    // Применяем выбор
    setSelectedElements(prev => {
      const newElements = { ...prev };
      if (!newElements[section]) {
        newElements[section] = new Set();
      }
      
      // Сначала очищаем текущий выбор для этого раздела
      newElements[section] = new Set();
      
      // Добавляем случайно выбранные элементы
      selectedKeys.forEach(elementKey => {
        newElements[section].add(elementKey);
      });
      
      return newElements;
    });
  };

  // Функция для обычного режима (без разделов)
  const handleElementToggleLegacy = (elementKey) => {
    // Проверяем, не отключен ли элемент
    if (DISABLED_ELEMENTS.has(elementKey)) {
      return; // Не позволяем выбирать отключенные элементы
    }
    
    setSelectedElements(prev => {
      const newElements = { ...prev };
      if (!newElements['GLOBAL']) {
        newElements['GLOBAL'] = new Set();
      }
      
      const globalElements = new Set(newElements['GLOBAL']);
      if (globalElements.has(elementKey)) {
        globalElements.delete(elementKey);
      } else {
        globalElements.add(elementKey);
      }
      
      newElements['GLOBAL'] = globalElements;
      return newElements;
    });
  };

  const handlePromptChange = (elementKey, newPrompt) => {
    setCustomPrompts(prev => ({
      ...prev,
      [elementKey]: newPrompt || undefined // undefined удаляет ключ (сброс к оригиналу)
    }));
  };

  const handleElementSettingsChange = (newElementSettings) => {
    // Объединяем с значениями по умолчанию для новых элементов
    const defaultSettings = getDefaultElementSettings();
    const mergedSettings = { ...defaultSettings, ...newElementSettings };
    setElementSettings(mergedSettings);
  };

  // Функция для обработки изменений настроек конкретного элемента
  const handleElementSettingChange = (elementKey, field, value) => {
    setElementSettings(prev => ({
      ...prev,
      [elementKey]: {
        ...prev[elementKey],
        [field]: value
      }
    }));
  };

  // Функция для получения всех выбранных элементов
  const getAllSelectedElements = () => {
    const selected = new Set();
    Object.keys(selectedElements).forEach(section => {
      if (selectedElements[section]) {
        selectedElements[section].forEach(element => {
          selected.add(element);
        });
      }
    });
    return Array.from(selected);
  };

  const handleSave = () => {
    // Генерируем промпт только для текущего этапа
    const currentStepSections = STEP_SECTIONS[currentStep];
    const filteredSettings = {
      ...settings,
      includedSections: Object.keys(settings.includedSections).reduce((acc, section) => {
        acc[section] = currentStepSections.includes(section) ? settings.includedSections[section] : false;
        return acc;
      }, {})
    };
    
    const filteredSelectedElements = {};
    currentStepSections.forEach(section => {
      if (selectedElements[section]) {
        filteredSelectedElements[section] = selectedElements[section];
      }
    });
    
    onSave(filteredSettings, promptType, filteredSelectedElements, customPrompts, elementSettings, currentStep, customSectionLabels);
    onClose();
  };
  
  const handleStepComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    if (currentStep < 4) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Автоматически активируем разделы следующего этапа
      setTimeout(() => {
        const nextStepSections = STEP_SECTIONS[nextStep];
        setSettings(prev => ({
          ...prev,
          includedSections: Object.keys(prev.includedSections).reduce((acc, section) => {
            acc[section] = nextStepSections.includes(section);
            return acc;
          }, {})
        }));
      }, 100);
    }
  };
  
  const handleStepBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Автоматически активируем разделы предыдущего этапа
      setTimeout(() => {
        const prevStepSections = STEP_SECTIONS[prevStep];
        setSettings(prev => ({
          ...prev,
          includedSections: Object.keys(prev.includedSections).reduce((acc, section) => {
            acc[section] = prevStepSections.includes(section);
            return acc;
          }, {})
        }));
      }, 100);
    }
  };
  
  const getStepStatus = (step) => {
    if (completedSteps.includes(step)) return 'completed';
    if (step === currentStep) return 'current';
    return 'pending';
  };

  // Состояние для пользовательских названий разделов
  const [customSectionLabels, setCustomSectionLabels] = useState({});
  const [showSectionLabelsEditor, setShowSectionLabelsEditor] = useState(false);
  const [isGeneratingNames, setIsGeneratingNames] = useState(false);
  const [aiResponseText, setAiResponseText] = useState('');

  const defaultSectionLabels = {
    HERO: 'Hero секция',
    ABOUT: 'О нас',
    SERVICES: 'Услуги',
    FEATURES: 'Преимущества',
    NEWS: 'Новости',
    FAQ: 'Вопросы и ответы',
    TESTIMONIALS: 'Отзывы',
    CONTACTS: 'Контакты',
    MERCI: 'Сообщение благодарности',
    LEGAL: 'Правовые документы',
    UNIVERSAL: 'Универсальная секция'
  };

  // Функция для получения названия раздела (пользовательское или по умолчанию)
  const getSectionLabel = (section) => {
    return customSectionLabels[section] || defaultSectionLabels[section];
  };

  // Функция для обновления названия раздела
  const handleSectionLabelChange = (section, newLabel) => {
    setCustomSectionLabels(prev => ({
      ...prev,
      [section]: newLabel
    }));
  };

  // Функция для обработки ответа от нейросети
  const handleAiResponse = () => {
    try {
      // Пытаемся распарсить JSON ответ
      const response = JSON.parse(aiResponseText);
      
      // Применяем названия к разделам
      const newLabels = {};
      Object.keys(response).forEach(section => {
        if (defaultSectionLabels[section] && response[section]) {
          newLabels[section] = response[section];
        }
      });

      setCustomSectionLabels(prev => ({
        ...prev,
        ...newLabels
      }));

      setParserMessage(`Применены названия разделов из ответа нейросети. Обновлено разделов: ${Object.keys(newLabels).length}`);
      setAiResponseText(''); // Очищаем поле после применения
      
    } catch (error) {
      console.error('Ошибка при парсинге ответа нейросети:', error);
      setParserMessage('Ошибка: Неверный формат JSON. Убедитесь, что ответ содержит корректный JSON с названиями разделов.');
    }
  };


  // Функция AI-парсера для генерации названий разделов
  const generateSectionNamesWithAI = async (siteTheme, language) => {
    setIsGeneratingNames(true);
    try {
      // Разделы, которые НЕ нужно переименовывать
      const excludedSections = ['HERO', 'CONTACTS', 'MERCI', 'LEGAL'];
      
      // Разделы для переименования
      const sectionsToRename = Object.keys(defaultSectionLabels).filter(
        section => !excludedSections.includes(section)
      );

      // Создаем промпт для GPT
      const aiPrompt = `Ты - эксперт по веб-дизайну и UX. Создай подходящие названия разделов для сайта на основе тематики и языка.

ТЕМАТИКА САЙТА: ${siteTheme}
ЯЗЫК: ${language}

Создай названия для следующих разделов (на выбранном языке):
- РАЗДЕЛ1 (ABOUT) - раздел о компании/о нас
- РАЗДЕЛ2 (SERVICES) - раздел с услугами/каталогом
- РАЗДЕЛ3 (FEATURES) - раздел с преимуществами/особенностями
- РАЗДЕЛ4 (NEWS) - раздел с новостями/актуальной информацией
- РАЗДЕЛ5 (FAQ) - раздел с вопросами и ответами/помощью
- РАЗДЕЛ6 (TESTIMONIALS) - раздел с отзывами/мнениями клиентов
- РАЗДЕЛ7 (UNIVERSAL) - дополнительный раздел/еще информация

ТРЕБОВАНИЯ:
1. Названия должны подходить под тематику сайта
2. Названия должны быть краткими (1-2 слова)
3. Названия должны быть понятными для пользователей
4. Используй выбранный язык
5. НЕ используй стандартные названия - придумай уникальные, подходящие именно для этой тематики

ОТВЕТ В ФОРМАТЕ JSON:
{
  "ABOUT": "название",
  "SERVICES": "название", 
  "FEATURES": "название",
  "NEWS": "название",
  "FAQ": "название",
  "TESTIMONIALS": "название",
  "UNIVERSAL": "название"
}`;

      // Здесь должен быть вызов к GPT API
      // Пока что возвращаем заглушку
      console.log('AI Prompt:', aiPrompt);
      
      // Заглушка для тестирования - генерируем названия на основе тематики
      const generateMockNames = (theme) => {
        const themeLower = theme.toLowerCase();
        
        if (themeLower.includes('юридическ') || themeLower.includes('правов')) {
          return {
            "ABOUT": "О компании",
            "SERVICES": "Услуги", 
            "FEATURES": "Преимущества",
            "NEWS": "Новости",
            "FAQ": "Вопросы",
            "TESTIMONIALS": "Отзывы",
            "UNIVERSAL": "Дополнительно"
          };
        } else if (themeLower.includes('ресторан') || themeLower.includes('кафе') || themeLower.includes('еда')) {
          return {
            "ABOUT": "О нас",
            "SERVICES": "Меню", 
            "FEATURES": "Особенности",
            "NEWS": "Новости",
            "FAQ": "Вопросы",
            "TESTIMONIALS": "Отзывы",
            "UNIVERSAL": "Дополнительно"
          };
        } else if (themeLower.includes('магазин') || themeLower.includes('интернет-магазин') || themeLower.includes('торгов')) {
          return {
            "ABOUT": "О магазине",
            "SERVICES": "Каталог", 
            "FEATURES": "Преимущества",
            "NEWS": "Новости",
            "FAQ": "Вопросы",
            "TESTIMONIALS": "Отзывы",
            "UNIVERSAL": "Дополнительно"
          };
        } else {
          return {
            "ABOUT": "О компании",
            "SERVICES": "Услуги", 
            "FEATURES": "Преимущества",
            "NEWS": "Новости",
            "FAQ": "Вопросы",
            "TESTIMONIALS": "Отзывы",
            "UNIVERSAL": "Дополнительно"
          };
        }
      };

      const mockResponse = generateMockNames(siteTheme);

      // Сохраняем промпт для показа в модальном окне
      setGeneratedPrompt(aiPrompt);
      
      // Открываем редактор названий разделов, чтобы показать поле для ввода ответа
      setShowSectionLabelsEditor(true);
      
      // Копируем промпт в буфер обмена
      let copySuccess = false;
      try {
        await navigator.clipboard.writeText(aiPrompt);
        console.log('AI промпт скопирован в буфер обмена');
        copySuccess = true;
      } catch (err) {
        console.error('Ошибка при копировании промпта:', err);
        // Альтернативный способ копирования
        const textArea = document.createElement('textarea');
        textArea.value = aiPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          copySuccess = true;
        } catch (fallbackErr) {
          console.error('Альтернативное копирование не удалось:', fallbackErr);
        }
        document.body.removeChild(textArea);
      }
      
      // Показываем уведомление
      if (copySuccess) {
        setParserMessage(`Сгенерирован промпт для тематики "${siteTheme}". Промпт скопирован в буфер обмена. Вставьте его в нейросеть, получите ответ в формате JSON и вставьте в поле ниже.`);
      } else {
        setParserMessage(`Сгенерирован промпт для тематики "${siteTheme}". Промпт НЕ скопирован автоматически. Нажмите "Показать промпт" для копирования вручную.`);
        setShowPromptModal(true);
      }

      return null;
    } catch (error) {
      console.error('Ошибка при генерации названий разделов:', error);
      return null;
    } finally {
      setIsGeneratingNames(false);
    }
  };


  const randomizeAllSettings = () => {
    // Рандомизируем количество карточек
    const newCardCounts = { ...settings.cardCounts };
    Object.keys(newCardCounts).forEach(section => {
      if (section === 'SERVICES') {
        // Для услуг минимум 4 карточки, максимум 8
        newCardCounts[section] = Math.floor(Math.random() * 5) + 4; // 4-8
      } else {
        // Для остальных разделов от 2 до 7 карточек
        newCardCounts[section] = Math.floor(Math.random() * 6) + 2; // 2-7
      }
    });

    // Стили контента с разными характеристиками
    const contentStyles = {
      MINIMAL: {
        titleMultiplier: 0.6,
        descriptionMultiplier: 0.7,
        contentMultiplier: 0.5
      },
      STANDARD: {
        titleMultiplier: 1,
        descriptionMultiplier: 1,
        contentMultiplier: 1
      },
      DETAILED: {
        titleMultiplier: 1.3,
        descriptionMultiplier: 1.5,
        contentMultiplier: 1.8
      },
      COMPREHENSIVE: {
        titleMultiplier: 1.6,
        descriptionMultiplier: 2,
        contentMultiplier: 2.5
      }
    };

    // Выбираем случайный стиль для каждого раздела
    const getRandomStyle = () => {
      const styles = Object.keys(contentStyles);
      return styles[Math.floor(Math.random() * styles.length)];
    };

    const getRandomRange = (type, section) => {
      // Определяем тип раздела
      const isContentSection = ['FEATURES', 'TESTIMONIALS', 'ABOUT', 'NEWS', 'SERVICES', 'FAQ'].includes(section);
      
      // Устанавливаем жесткие максимальные ограничения
      const HARD_LIMITS = {
        content: isContentSection 
          ? { minRange: [55, 90], max: 130 } // Изменяем диапазон минимальных значений
          : { minRange: [20, 60], max: 90 },
        description: { minRange: [20, 60], max: 90 },
        title: { minRange: [2, 20], max: 30 }
      };

      // Определяем тип контента для применения ограничений
      let contentType = 'title'; // по умолчанию
      if (type === 'cardContent' || type.includes('content')) {
        contentType = 'content';
      } else if (type.includes('description') || type.includes('Description')) {
        contentType = 'description';
      }

      // Генерируем случайное минимальное значение
      let randomMin;
      const [minRange, maxRange] = HARD_LIMITS[contentType].minRange;
      
      // Для контента в указанных разделах генерируем случайное значение в диапазоне
      if (contentType === 'content' && isContentSection) {
        // Генерируем случайное значение между 55 и 90
        randomMin = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
      } else {
        randomMin = Math.floor(minRange + Math.random() * (maxRange - minRange));
      }

      // Генерируем максимальное значение с учетом ограничений
      const maxLimit = HARD_LIMITS[contentType].max;
      const minDiff = contentType === 'content' ? 10 : (contentType === 'description' ? 5 : 2);
      
      // Ограничиваем максимальную разницу
      const maxDiff = contentType === 'content' && isContentSection
        ? Math.min(40, 130 - randomMin) // Увеличиваем возможную разницу до 40 слов
        : Math.min(20, maxLimit - randomMin);

      let randomMax = Math.min(
        maxLimit,
        randomMin + minDiff + Math.floor(Math.random() * (maxDiff - minDiff))
      );

      // Обеспечиваем минимальную разницу и максимальное ограничение
      if (randomMax - randomMin < minDiff) {
        randomMax = Math.min(randomMin + minDiff, maxLimit);
      }

      // Финальная проверка ограничений для указанных разделов
      if (contentType === 'content' && isContentSection) {
        randomMin = Math.max(55, randomMin); // Гарантируем минимум 55 слов
        randomMax = Math.min(randomMax, 130); // Гарантируем максимум 130 слов
        
        // Убеждаемся, что разница между min и max составляет хотя бы 10 слов
        if (randomMax - randomMin < 10) {
          if (randomMax < 130) {
            randomMax = Math.min(130, randomMin + 10);
          } else {
            randomMin = Math.max(55, randomMax - 10);
          }
        }
      }

      return { min: randomMin, max: randomMax };
    };

    const newWordRanges = {};
    
    // Для каждой секции генерируем новые диапазоны
    Object.entries(settings.wordRanges).forEach(([section, fields]) => {
      newWordRanges[section] = {};
      Object.entries(fields).forEach(([field]) => {
        newWordRanges[section][field] = getRandomRange(field, section);
      });
    });

    // Дополнительная обработка для обеспечения контраста между разделами
    const sections = Object.keys(newWordRanges);
    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        const section1 = sections[i];
        const section2 = sections[j];
        
        // Проверяем перекрытие диапазонов для cardContent
        if (newWordRanges[section1].cardContent && newWordRanges[section2].cardContent) {
          const range1 = newWordRanges[section1].cardContent;
          const range2 = newWordRanges[section2].cardContent;
          
          // Если диапазоны слишком похожи, корректируем один из них
          if (Math.abs(range1.min - range2.min) < 15 && Math.abs(range1.max - range2.max) < 30) {
            if (Math.random() < 0.5) {
              // Уменьшаем первый диапазон
              range1.min = Math.max(55, Math.min(110, range1.min - 10));
              range1.max = Math.max(65, Math.min(130, range1.max - 10));
            } else {
              // Увеличиваем второй диапазон
              range2.min = Math.max(55, Math.min(110, range2.min + 10));
              range2.max = Math.max(65, Math.min(130, range2.max + 10));
            }
            
            // Проверяем и корректируем разницу между min и max
            if (range1.max - range1.min < 10) {
              range1.max = Math.min(130, range1.min + 10);
            }
            if (range2.max - range2.min < 10) {
              range2.max = Math.min(130, range2.min + 10);
            }
          }
        }
      }
    }

    // Финальная проверка всех диапазонов
    Object.entries(newWordRanges).forEach(([section, fields]) => {
      if (fields.cardContent) {
        fields.cardContent.min = Math.max(55, Math.min(110, fields.cardContent.min));
        fields.cardContent.max = Math.max(65, Math.min(130, fields.cardContent.max));
        
        // Обеспечиваем минимальную разницу
        if (fields.cardContent.max - fields.cardContent.min < 10) {
          fields.cardContent.max = Math.min(130, fields.cardContent.min + 10);
        }
      }
    });

    // Обновляем все настройки одновременно
    setSettings(prev => ({
      ...prev,
      cardCounts: newCardCounts,
      wordRanges: newWordRanges
    }));
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Настройка промпта полного сайта</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={randomizeAllSettings}
          startIcon={<ShuffleIcon />}
          size="small"
        >
          Случайные значения
        </Button>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="h6" gutterBottom>
            Тип промпта:
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <RadioGroup
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
            >
              <FormControlLabel 
                value="full" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Полный промпт</strong> (оригинальный)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Включает все разделы и правовые документы. Может быть слишком длинным для некоторых AI моделей.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="optimized" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Оптимизированный промпт</strong> (рекомендуется)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Сокращенная версия без правовых документов. Лучше работает с большинством AI моделей.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="legal_only" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Только правовые документы</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Специализированный промпт только для генерации правовых документов. Гарантирует полные результаты.
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel 
                value="manual_elements" 
                control={<Radio />} 
                label={
                  <Box>
                    <Typography variant="body1" component="div">
                      <strong>Ручной выбор элементов</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Выберите элементы для каждого раздела вручную. Для контактов, благодарности и правовых документов используются стандартные промпты.
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
        
        {/* Информация об отключенных элементах */}
        {promptType === 'manual_elements' && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff3e0', border: '1px solid #ff9800', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 'bold', mb: 1 }}>
              ℹ️ Информация об отключенных элементах
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Следующие элементы временно отключены и недоступны для выбора: <strong>QR код</strong>, <strong>Chart.js столбцы</strong>, <strong>Пончиковая диаграмма</strong>, <strong>ApexCharts линии</strong>, <strong>Расширенная контактная форма</strong>.
            </Typography>
          </Box>
        )}
        
        {promptType !== 'legal_only' && promptType !== 'manual_elements' && (
          <>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Выберите разделы для включения в промпт:
              </Typography>
              <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  💡 Вы можете переименовать разделы, чтобы они лучше подходили для вашего сайта
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setShowSectionLabelsEditor(!showSectionLabelsEditor)}
                    startIcon={<EditIcon />}
                  >
                    {showSectionLabelsEditor ? 'Скрыть редактор' : 'Переименовать разделы'}
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => {
                      const siteTheme = getCurrentTheme();
                      const language = getCurrentLanguage();
                      generateSectionNamesWithAI(siteTheme, language);
                    }}
                    disabled={isGeneratingNames}
                    startIcon={isGeneratingNames ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                    color="primary"
                    title={`Тематика: ${getCurrentTheme()}, Язык: ${getCurrentLanguage()}`}
                  >
                    {isGeneratingNames ? 'Генерируем...' : `AI-генерация (${getCurrentTheme()})`}
                  </Button>
                  {generatedPrompt && (
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={() => setShowPromptModal(true)}
                      color="secondary"
                    >
                      Показать промпт
                    </Button>
                  )}
                  {Object.keys(customSectionLabels).length > 0 && (
                    <Button 
                      size="small" 
                      variant="text" 
                      onClick={() => setCustomSectionLabels({})}
                      color="secondary"
                    >
                      Сбросить к умолчанию
                    </Button>
                  )}
                </Box>
              </Box>
              
              {showSectionLabelsEditor && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Редактор названий разделов:
                  </Typography>
                  
                  {/* Поле для ввода ответа от нейросети */}
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 1 }}>
                    <Typography variant="subtitle3" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
                      🤖 Ответ от нейросети (JSON формат):
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Вставьте сюда ответ от нейросети в формате JSON. Пример: {"{"}"ABOUT": "О компании", "SERVICES": "Услуги"{"}"}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={aiResponseText}
                      onChange={(e) => setAiResponseText(e.target.value)}
                      placeholder='{"ABOUT": "О компании", "SERVICES": "Услуги", "FEATURES": "Преимущества", "NEWS": "Новости", "FAQ": "Вопросы", "TESTIMONIALS": "Отзывы", "UNIVERSAL": "Дополнительно"}'
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={handleAiResponse}
                        disabled={!aiResponseText.trim()}
                        color="primary"
                      >
                        Применить названия
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => setAiResponseText('')}
                        color="secondary"
                      >
                        Очистить
                      </Button>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {Object.keys(settings.includedSections).map((section) => (
                      <Grid item xs={12} sm={6} key={section}>
                        <TextField
                          fullWidth
                          size="small"
                          label={`Название раздела "${defaultSectionLabels[section]}"`}
                          value={customSectionLabels[section] || ''}
                          onChange={(e) => handleSectionLabelChange(section, e.target.value)}
                          placeholder={defaultSectionLabels[section]}
                          helperText="Оставьте пустым для использования названия по умолчанию"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
              
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
                  label={getSectionLabel(section)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Раздел выбора элементов из ElementPromptsSection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Промпты элементов ({Object.keys(ELEMENT_PROMPTS).length}):
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Выберите элементы, которые должны быть включены в промпт полного сайта
          </Typography>
          
          {/* Компонент выбора элементов с галочками */}
          <ElementPromptsSection 
            selectionMode={true}
            selectedElements={selectedElements}
            onElementToggle={handleElementToggleLegacy}
            customPrompts={customPrompts}
            onPromptChange={handlePromptChange}
            elementSettings={elementSettings}
            onElementSettingsChange={handleElementSettingsChange}
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Количество карточек в каждом разделе:
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {Object.keys(settings.cardCounts).map((section) => (
            settings.includedSections[section] && (
              <Grid item xs={12} sm={6} key={section}>
                <Typography id={`${section}-slider-label`}>
                  {getSectionLabel(section)}: {settings.cardCounts[section]}
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Диапазоны количества слов:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Настройте количество слов для каждого элемента
            </Typography>
          </Box>
          <Accordion defaultExpanded={false}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Настройки диапазонов</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(settings.wordRanges).map(([section, ranges]) => (
                <WordRangeEditor
                  key={section}
                  section={section}
                  ranges={ranges}
                  onChange={handleWordRangeChange}
                />
              ))}
            </AccordionDetails>
              </Accordion>
          

            </Box>
          </>
        )}
        
        {promptType === 'manual_elements' && (
          <>
            <Divider sx={{ mb: 3 }} />
            
            {/* Индикаторы этапов */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Этапы обработки:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {[1, 2, 3, 4].map((step) => {
                  const stepSections = STEP_SECTIONS[step];
                  const selectedSections = stepSections.filter(section => settings.includedSections[section]);
                  const totalSections = stepSections.length;
                  const selectedCount = selectedSections.length;
                  
                  return (
                    <Box
                      key={step}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        border: '2px solid',
                        minWidth: 140,
                        backgroundColor: getStepStatus(step) === 'completed' ? '#4caf50' : 
                                       getStepStatus(step) === 'current' ? '#ff9800' : '#f5f5f5',
                        borderColor: getStepStatus(step) === 'completed' ? '#4caf50' : 
                                    getStepStatus(step) === 'current' ? '#ff9800' : '#ddd',
                        color: getStepStatus(step) === 'completed' ? 'white' : 
                               getStepStatus(step) === 'current' ? 'white' : '#666'
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {step}
                      </Typography>
                      <Typography variant="caption" sx={{ textAlign: 'center', fontSize: '0.7rem', mb: 1 }}>
                        {STEP_LABELS[step]}
                      </Typography>
                      
                      {/* Индикатор выбранных разделов */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        fontSize: '0.6rem',
                        opacity: 0.8
                      }}>
                        <Typography variant="caption" sx={{ mb: 0.5 }}>
                          Разделы: {selectedCount}/{totalSections}
                        </Typography>
                        {selectedSections.length > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 0.5, 
                            justifyContent: 'center',
                            maxWidth: 120
                          }}>
                            {selectedSections.map(section => (
                              <Box
                                key={section}
                                sx={{
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  px: 0.5,
                                  py: 0.2,
                                  borderRadius: 1,
                                  fontSize: '0.5rem',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {getSectionLabel(section)}
                              </Box>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Текущий этап {currentStep}:</strong> {STEP_LABELS[currentStep]}
                  {completedSteps.length > 0 && (
                    <span> • Завершено этапов: {completedSteps.length}</span>
                  )}
                </Typography>
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={activateCurrentStepSections}
                  sx={{ fontSize: '0.75rem' }}
                >
                  Активировать разделы этапа {currentStep}
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={() => setShowSectionLabelsEditor(!showSectionLabelsEditor)}
                  startIcon={<EditIcon />}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {showSectionLabelsEditor ? 'Скрыть редактор' : 'Переименовать разделы'}
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  onClick={() => {
                    const siteTheme = getCurrentTheme();
                    const language = getCurrentLanguage();
                    generateSectionNamesWithAI(siteTheme, language);
                  }}
                  disabled={isGeneratingNames}
                  startIcon={isGeneratingNames ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                  color="primary"
                  sx={{ fontSize: '0.75rem' }}
                  title={`Тематика: ${getCurrentTheme()}, Язык: ${getCurrentLanguage()}`}
                >
                  {isGeneratingNames ? 'Генерируем...' : `AI (${getCurrentTheme()})`}
                </Button>
                {generatedPrompt && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => setShowPromptModal(true)}
                    color="secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Показать промпт
                  </Button>
                )}
                {Object.keys(customSectionLabels).length > 0 && (
                  <Button 
                    size="small" 
                    variant="text" 
                    onClick={() => setCustomSectionLabels({})}
                    color="secondary"
                    sx={{ fontSize: '0.75rem' }}
                  >
                    Сбросить к умолчанию
                  </Button>
                )}
              </Box>
              
              {showSectionLabelsEditor && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Редактор названий разделов:
                  </Typography>
                  
                  {/* Поле для ввода ответа от нейросети */}
                  <Box sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 1 }}>
                    <Typography variant="subtitle3" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
                      🤖 Ответ от нейросети (JSON формат):
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Вставьте сюда ответ от нейросети в формате JSON. Пример: {"{"}"ABOUT": "О компании", "SERVICES": "Услуги"{"}"}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={aiResponseText}
                      onChange={(e) => setAiResponseText(e.target.value)}
                      placeholder='{"ABOUT": "О компании", "SERVICES": "Услуги", "FEATURES": "Преимущества", "NEWS": "Новости", "FAQ": "Вопросы", "TESTIMONIALS": "Отзывы", "UNIVERSAL": "Дополнительно"}'
                      variant="outlined"
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        onClick={handleAiResponse}
                        disabled={!aiResponseText.trim()}
                        color="primary"
                      >
                        Применить названия
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => setAiResponseText('')}
                        color="secondary"
                      >
                        Очистить
                      </Button>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {Object.keys(settings.includedSections).map((section) => (
                      <Grid item xs={12} sm={6} key={section}>
                        <TextField
                          fullWidth
                          size="small"
                          label={`Название раздела "${defaultSectionLabels[section]}"`}
                          value={customSectionLabels[section] || ''}
                          onChange={(e) => handleSectionLabelChange(section, e.target.value)}
                          placeholder={defaultSectionLabels[section]}
                          helperText="Оставьте пустым для использования названия по умолчанию"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ручной выбор элементов по разделам:
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Выберите элементы для каждого раздела. Для разделов "Контакты", "Сообщение благодарности" и "Правовые документы" используются стандартные промпты.
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Примечание:</strong> Разделы "Контакты", "Сообщение благодарности" и "Правовые документы" будут использовать стандартные промпты без выбора элементов.
                </Typography>
              </Alert>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Переключатели секций */}
            <Box sx={{ mb: 3 }}>
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
                      label={getSectionLabel(section)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Выбор элементов для каждого раздела */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Выбор элементов по разделам:
              </Typography>
              

              
              {/* О НАС */}
              {settings.includedSections.ABOUT && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      ℹ️ {getSectionLabel('ABOUT')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('ABOUT', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.ABOUT?.has(element) || false}
                              onChange={() => handleElementToggle('ABOUT', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
              
              {/* УСЛУГИ */}
              {settings.includedSections.SERVICES && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      🛠️ {getSectionLabel('SERVICES')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('SERVICES', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.SERVICES?.has(element) || false}
                              onChange={() => handleElementToggle('SERVICES', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
              
              {/* ПРЕИМУЩЕСТВА */}
              {settings.includedSections.FEATURES && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      ⭐ {getSectionLabel('FEATURES')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('FEATURES', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.FEATURES?.has(element) || false}
                              onChange={() => handleElementToggle('FEATURES', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
              
              {/* НОВОСТИ */}
              {settings.includedSections.NEWS && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      📰 {getSectionLabel('NEWS')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('NEWS', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.NEWS?.has(element) || false}
                              onChange={() => handleElementToggle('NEWS', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
              
              {/* ВОПРОСЫ */}
              {settings.includedSections.FAQ && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      ❓ {getSectionLabel('FAQ')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('FAQ', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.FAQ?.has(element) || false}
                              onChange={() => handleElementToggle('FAQ', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
              
              {/* ОТЗЫВЫ */}
              {settings.includedSections.TESTIMONIALS && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      💬 {getSectionLabel('TESTIMONIALS')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('TESTIMONIALS', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.TESTIMONIALS?.has(element) || false}
                              onChange={() => handleElementToggle('TESTIMONIALS', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
              
              {/* УНИВЕРСАЛЬНАЯ СЕКЦИЯ */}
              {settings.includedSections.UNIVERSAL && (
                <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                      🌟 {getSectionLabel('UNIVERSAL')}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRandomSelection('UNIVERSAL', ALL_ELEMENTS)}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Рандом
                    </Button>
                  </Box>
                  <FormGroup row>
                    {ALL_ELEMENTS.map(element => {
                      const isDisabled = DISABLED_ELEMENTS.has(element);
                      return (
                        <FormControlLabel
                          key={element}
                          control={
                            <Checkbox
                              checked={selectedElements.UNIVERSAL?.has(element) || false}
                              onChange={() => handleElementToggle('UNIVERSAL', element)}
                              disabled={isDisabled}
                              sx={{
                                opacity: isDisabled ? 0.5 : 1,
                                '&.Mui-disabled': {
                                  opacity: 0.5
                                }
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                color: isDisabled ? 'text.disabled' : 'text.primary',
                                textDecoration: isDisabled ? 'line-through' : 'none'
                              }}
                            >
                              {ELEMENT_PROMPTS[element]?.name || element}
                              {isDisabled && ' (отключено)'}
                            </Typography>
                          }
                          sx={{
                            opacity: isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              )}
            </Box>

            {/* Настройки минимального количества слов для выбранных элементов */}
            {promptType === 'manual_elements' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Настройки минимального количества слов для выбранных элементов:
                </Typography>
                
                <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                  {getAllSelectedElements().length > 0 ? (
                    <Grid container spacing={2}>
                      {getAllSelectedElements().map(elementKey => {
                        const element = ELEMENT_PROMPTS[elementKey];
                        const settings = elementSettings[elementKey] || {};
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={elementKey}>
                            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, backgroundColor: '#fafafa' }}>
                              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                                {element?.name || elementKey}
                              </Typography>
                              
                              {/* Настройки для заголовка */}
                              {element?.hasTitle !== false && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    Мин. слов в заголовке:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={settings.minTitle || 10}
                                    onChange={(e) => handleElementSettingChange(elementKey, 'minTitle', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0, max: 1000 }}
                                    sx={{ width: '100%', mt: 0.5 }}
                                  />
                                </Box>
                              )}
                              
                              {/* Настройки для содержимого */}
                              {element?.hasContent !== false && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    Мин. слов в содержимом:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={settings.minContent || 20}
                                    onChange={(e) => handleElementSettingChange(elementKey, 'minContent', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 0, max: 2000 }}
                                    sx={{ width: '100%', mt: 0.5 }}
                                  />
                                </Box>
                              )}
                              
                              {/* Дополнительные настройки для специфических элементов */}
                              {elementKey === 'faq-section' && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    Мин. количество вопросов:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={settings.minQuestions || 5}
                                    onChange={(e) => handleElementSettingChange(elementKey, 'minQuestions', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 1, max: 20 }}
                                    sx={{ width: '100%', mt: 0.5 }}
                                  />
                                </Box>
                              )}
                              
                              {elementKey === 'accordion' && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    Мин. количество пунктов:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={settings.minQuestions || 8}
                                    onChange={(e) => handleElementSettingChange(elementKey, 'minQuestions', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 1, max: 20 }}
                                    sx={{ width: '100%', mt: 0.5 }}
                                  />
                                </Box>
                              )}
                              
                              {elementKey === 'multiple-cards' && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    Мин. количество карточек:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={settings.minCards || 4}
                                    onChange={(e) => handleElementSettingChange(elementKey, 'minCards', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 2, max: 20 }}
                                    sx={{ width: '100%', mt: 0.5 }}
                                  />
                                </Box>
                              )}
                              
                              {elementKey === 'timeline-component' && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" color="textSecondary">
                                    Мин. количество точек:
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={settings.minDataPoints || 5}
                                    onChange={(e) => handleElementSettingChange(elementKey, 'minDataPoints', parseInt(e.target.value) || 0)}
                                    inputProps={{ min: 2, max: 20 }}
                                    sx={{ width: '100%', mt: 0.5 }}
                                  />
                                </Box>
                              )}
                              
                              {elementKey === 'data-table' && (
                                <>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="textSecondary">
                                      Мин. строк:
                                    </Typography>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={settings.minRows || 5}
                                      onChange={(e) => handleElementSettingChange(elementKey, 'minRows', parseInt(e.target.value) || 0)}
                                      inputProps={{ min: 2, max: 20 }}
                                      sx={{ width: '100%', mt: 0.5 }}
                                    />
                                  </Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="textSecondary">
                                      Мин. колонок:
                                    </Typography>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={settings.minColumns || 4}
                                      onChange={(e) => handleElementSettingChange(elementKey, 'minColumns', parseInt(e.target.value) || 0)}
                                      inputProps={{ min: 2, max: 10 }}
                                      sx={{ width: '100%', mt: 0.5 }}
                                    />
                                  </Box>
                                </>
                              )}
                              
                              {/* Настройки для диаграмм */}
                              {['bar-chart', 'advanced-line-chart', 'advanced-pie-chart', 'advanced-area-chart', 'chartjs-bar', 'chartjs-line', 'chartjs-pie', 'chartjs-doughnut', 'chartjs-area', 'apex-line', 'apex-chart', 'apex-area-chart', 'apex-bar-chart', 'apex-line-chart', 'apex-pie-chart', 'apex-donut-chart'].includes(elementKey) && (
                                <>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="textSecondary">
                                      Мин. колонок:
                                    </Typography>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={settings.minColumns || 4}
                                      onChange={(e) => handleElementSettingChange(elementKey, 'minColumns', parseInt(e.target.value) || 0)}
                                      inputProps={{ min: 2, max: 10 }}
                                      sx={{ width: '100%', mt: 0.5 }}
                                    />
                                  </Box>
                                  <Box sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="textSecondary">
                                      Мин. точек данных:
                                    </Typography>
                                    <TextField
                                      size="small"
                                      type="number"
                                      value={settings.minDataPoints || 5}
                                      onChange={(e) => handleElementSettingChange(elementKey, 'minDataPoints', parseInt(e.target.value) || 0)}
                                      inputProps={{ min: 2, max: 20 }}
                                      sx={{ width: '100%', mt: 0.5 }}
                                    />
                                  </Box>
                                </>
                              )}
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                      Выберите элементы выше, чтобы настроить минимальное количество слов
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        
        {promptType === 'manual_elements' && (
          <>
            <Button 
              onClick={handleStepBack} 
              disabled={currentStep === 1}
              variant="outlined"
            >
              ← Назад
            </Button>
            <Button 
              onClick={handleStepComplete} 
              disabled={currentStep === 4}
              variant="outlined"
              color="secondary"
            >
              Завершить этап →
            </Button>
          </>
        )}
        
        <Button onClick={handleSave} variant="contained" color="primary">
          {promptType === 'manual_elements' ? `Применить этап ${currentStep}` : 'Применить настройки'}
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
  onHeroChange,
  constructorMode = true,
  onConstructorModeChange
}) => {
  // Добавляем ref для текстового поля
  const textareaRef = useRef(null);

  // Существующие состояния
  const [customDelimiter, setCustomDelimiter] = useState('\\n\\n');
  const [customTitleContentDelimiter, setCustomTitleContentDelimiter] = useState(':');
  const [showSettings, setShowSettings] = useState(false);
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [targetSection, setTargetSection] = useState('FULL_SITE');
  const [parserMessage, setParserMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [editingPromptType, setEditingPromptType] = useState(null);
  const [editingPromptText, setEditingPromptText] = useState('');
  
  // Состояния для AI-парсера названий разделов
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
  // Добавляем состояния для глобальных настроек
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [globalSettings, setGlobalSettings] = useState({
    theme: 'CUSTOM',
    customTheme: '',
    language: '',
    contentStyle: 'PROFESSIONAL',
    additionalKeywords: '',
    usePrice: false,
    usePromotions: false,
    useContacts: false,
    useSocial: false,
    customInstructions: '',
    customLanguage: ''
  });

  // Функция для получения текущего языка
  const getCurrentLanguage = () => {
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      return globalSettings.customLanguage;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        return langObj.label.split(' - ')[0]; // Берем русское название до " - "
      }
    }
    return 'русский';
  };

  // Функция для получения текущей тематики сайта
  const getCurrentTheme = () => {
    if (globalSettings.theme === 'CUSTOM' && globalSettings.customTheme) {
      return globalSettings.customTheme;
    } else if (globalSettings.theme && WEBSITE_THEMES[globalSettings.theme]) {
      return WEBSITE_THEMES[globalSettings.theme];
    }
    return 'общая тематика';
  };
  
  // Добавляем состояние для настроек промпта полного сайта
  const [showFullSiteSettings, setShowFullSiteSettings] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Состояния для системы выбора элементов с чекбоксами
  const [scannedElements, setScannedElements] = useState([]);
  const [selectedElements, setSelectedElements] = useState(new Set());
  const [showElementSelector, setShowElementSelector] = useState(false);
  const [elementGroups, setElementGroups] = useState({});
  
  // Состояния для отслеживания обработанных элементов
  const [processedElements, setProcessedElements] = useState(new Set());
  const [processingHistory, setProcessingHistory] = useState([]);
  const [jsonMode, setJsonMode] = useState('ready'); // 'template' для GPT, 'ready' для готового
  
  // Состояние для пользовательских названий разделов
  const [customSectionLabels, setCustomSectionLabels] = useState({});
  
  const defaultSectionLabels = {
    HERO: 'Hero секция',
    ABOUT: 'О нас',
    SERVICES: 'Услуги',
    FEATURES: 'Преимущества',
    NEWS: 'Новости',
    FAQ: 'Вопросы и ответы',
    TESTIMONIALS: 'Отзывы',
    CONTACTS: 'Контакты',
    MERCI: 'Сообщение благодарности',
    LEGAL: 'Правовые документы',
    UNIVERSAL: 'Универсальная секция'
  };

  // Функция для получения названия раздела (пользовательское или по умолчанию)
  const getSectionLabel = (section) => {
    return customSectionLabels[section] || defaultSectionLabels[section];
  };
  const [fullSiteSettings, setFullSiteSettings] = useState({
    includedSections: {
      HERO: true, // Hero секция всегда включена
      ABOUT: true,
      SERVICES: true,
      FEATURES: true,
      NEWS: true,
      FAQ: true,
      TESTIMONIALS: true,
      CONTACTS: true,
      MERCI: true, // Включаем сообщение благодарности по умолчанию
      LEGAL: true, // Добавляем правовые документы в настройки
      UNIVERSAL: true // Универсальная секция по умолчанию включена
    },
    cardCounts: {
      ABOUT: 4,
      SERVICES: 4,
      FEATURES: 4,
      NEWS: 3,
      FAQ: 4,
      TESTIMONIALS: 3,
      UNIVERSAL: 3
    },
    wordRanges: {
      HERO: {
        title: { min: 3, max: 7 },        // Для заголовка Hero
        description: { min: 15, max: 25 }  // Для описания Hero
      },
      ABOUT: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      SERVICES: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      FEATURES: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      NEWS: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      FAQ: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      TESTIMONIALS: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      },
      UNIVERSAL: {
        sectionTitle: { min: 2, max: 10 },
        sectionDescription: { min: 10, max: 45 },
        cardContent: { min: 55, max: 130 }
      }
    }
  });
  
  // Добавляем состояние для управления стилями сайта
  const [showStyleManager, setShowStyleManager] = useState(false);
  
  // Добавляем состояние для переключателя стилей
  const [singleStyleMode, setSingleStyleMode] = useState(true);
  
  // Добавляем состояния для AI Дизайн Системы
  const [generatedDesignSystem, setGeneratedDesignSystem] = useState(null);
  const [showDesignSystemDialog, setShowDesignSystemDialog] = useState(false);
  const [gpt5JsonInput, setGpt5JsonInput] = useState('');
  const [jsonPromptDescription, setJsonPromptDescription] = useState(`Требования к цветовому стилю:
- Используйте современные градиенты и контрастные цвета
- Применяйте темные фоны с яркими акцентами
- Обеспечьте хорошую читаемость текста
- Используйте цветовую схему: основные цвета #00d4ff, #ff6b6b, #facc15
- Применяйте градиенты для фонов секций
- Добавляйте тени и скругления для современного вида

ДЕТАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ GPT-5:
1. УНИКАЛЬНОСТЬ ПОЛЕЙ: Каждое текстовое поле должно иметь уникальный цвет из палитры:
   - title: #00d4ff (голубой) - для главных заголовков
   - text: #ffffff (белый) - для основного текста на темном фоне
   - description: #facc15 (желтый) - для описаний и подзаголовков
   - cardTitle: #ff6b6b (красный) - для заголовков карточек
   - cardText: #e0e0e0 (светло-серый) - для текста в карточках
   - cardContent: #4ecdc4 (бирюзовый) - для контента карточек

2. КОНТРАСТНОСТЬ: Обеспечьте минимальный контраст 4.5:1 между текстом и фоном:
   - Белый текст (#ffffff) на темных фонах (#1a1a2e, #16213e)
   - Светлые цвета для текста на темных градиентах
   - Темные цвета для текста на светлых элементах

3. ФОНОВЫЕ ГРАДИЕНТЫ:
   - sectionBackground: градиент от #1a1a2e к #16213e
   - cardBackground: градиент от #0a0a0f к #1a1a2e
   - Используйте направление "to right" или "to bottom right"

4. ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ:
   - borderColor: #00d4ff для границ карточек
   - boxShadow: true для объемности
   - borderRadius: 8px для скругления углов
   - borderWidth: 1-2px для четкости границ

5. ПРИМЕНЕНИЕ К JSON: В сгенерированном JSON каждое поле colorSettings должно содержать:
   - Уникальный цвет для каждого текстового поля
   - Соответствующий фон с градиентом
   - Настройки границ и теней
   - Обеспечение читаемости на всех фонах`);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // Используем состояние из EditorPanel через пропсы
  // const [constructorMode, setConstructorMode] = useState(true); // Удалено - используем пропсы
  
  // Функция для генерации строки с минимальными требованиями для элемента
  const generateElementRequirements = (elementKey, elementSettings) => {
    const settings = elementSettings[elementKey];
    
    // Импортируем функцию getElementConfig из ElementPromptsSection
    const getElementConfig = (elementKey) => {
      const configs = {
        // Только содержимое
        'typography': { hasContent: true },
        'list': { hasContent: true },
        'gradient-text': { hasContent: true },
        'typewriter-text': { hasContent: true },
        'highlight-text': { hasContent: true },
        'testimonial-card': { hasContent: true },
        'share-buttons': { hasContent: true },
        
        // Заголовок + содержимое
        'rich-text': { hasTitle: true, hasContent: true },
        'blockquote': { hasTitle: true, hasContent: true },
        'callout': { hasTitle: true, hasContent: true },
        'animated-counter': { hasTitle: true }, // Убираем hasContent - у него специфическая структура
        'faq-section': { 
          hasTitle: true, 
          hasContent: true, 
          hasQuestions: true  // Количество вопросов
        },
        'timeline-component': { hasTitle: true, hasContent: true, hasDataPoints: true },
        'image-gallery': { hasTitle: true, hasContent: true },
        'basic-card': { hasTitle: true, hasContent: true },
        'image-card': { hasTitle: true, hasContent: true },
        'accordion': { hasTitle: true, hasContent: true },
        'qr-code': { hasTitle: true },
        'color-picker': { hasTitle: true, hasContent: true },
        'rating': { hasTitle: true, hasContent: true },
        'progress-bars': { hasTitle: true, hasContent: true },
        'cta-section': { hasTitle: true, hasContent: true },
        
        // Таблицы - строки и столбцы
        'data-table': { hasTitle: true, hasContent: true, hasRows: true, hasColumns: true },
        
        // Графики - данные и столбцы/категории
        'bar-chart': { hasTitle: true, hasContent: true, hasDataPoints: true, hasColumns: true },
        'advanced-line-chart': { hasTitle: true, hasContent: true, hasDataPoints: true, hasColumns: true },
        'advanced-pie-chart': { hasTitle: true, hasContent: true, hasDataPoints: true },
        'advanced-area-chart': { hasTitle: true, hasContent: true, hasDataPoints: true, hasColumns: true },
        'chartjs-bar': { hasTitle: true, hasContent: true, hasDataPoints: true, hasColumns: true },
        'chartjs-doughnut': { hasTitle: true, hasContent: true, hasDataPoints: true },
        'apex-line': { hasTitle: true, hasContent: true, hasDataPoints: true, hasColumns: true },
        
        // Множественные карточки
        'multiple-cards': { hasTitle: true, hasContent: true, hasCards: true },
        
        // Формы
        'advanced-contact-form': { hasTitle: true, hasContent: true },
        
        // Полный сайт
        'full-multipage-site': { hasTitle: true, hasContent: true }
      };
      
      return configs[elementKey] || { hasTitle: true, hasContent: true };
    };
    
    const elementConfig = getElementConfig(elementKey);
    
    if (!settings) {
      let defaultReq = [];
      if (elementConfig.hasTitle) defaultReq.push('ЗАГОЛОВОК: [заголовок элемента]');
      if (elementConfig.hasContent) {
        if (elementKey === 'testimonial-card') {
          defaultReq.push('СОДЕРЖИМОЕ: [Имя клиента] * [Должность] * [Компания] * [Текст отзыва] * [Рейтинг]');
        } else if (elementKey === 'faq-section') {
          defaultReq.push('СОДЕРЖИМОЕ: [Вопрос 1] | [Ответ 1] * [Вопрос 2] | [Ответ 2] * [Вопрос 3] | [Ответ 3]');
        } else {
          defaultReq.push('СОДЕРЖИМОЕ: [содержимое элемента]');
        }
      }
      return defaultReq.join('\n');
    }
    
    let requirements = [];
    let additionalRequirements = [];
    
    // Для графиков не заменяем структуру СОДЕРЖИМОЕ, а добавляем требования отдельно
    const isChart = elementKey.includes('chart') || elementKey.includes('bar') || 
                   elementKey.includes('line') || elementKey.includes('area') || 
                   elementKey.includes('apex') || elementKey.includes('pie') || 
                   elementKey.includes('doughnut');
    
    // Основные поля
    if (elementConfig.hasTitle) {
              if (settings.minTitle > 0) {
          requirements.push(`ЗАГОЛОВОК: [заголовок элемента] НЕ МЕНЕЕ ${settings.minTitle} слов`);
          additionalRequirements.push(`ТРЕБОВАНИЕ: Заголовок должен содержать НЕ МЕНЕЕ ${settings.minTitle} слов - проверяйте по количеству слов`);
        } else {
          requirements.push(`ЗАГОЛОВОК: [заголовок элемента]`);
        }
    }
    
          if (elementConfig.hasContent) {
        if (isChart) {
          // Для графиков сохраняем исходную структуру СОДЕРЖИМОЕ
          requirements.push(`СОДЕРЖИМОЕ: [содержимое элемента]`);
          // А требования к минимальному количеству слов добавляем как отдельное требование
          if (settings.minContent > 0) {
            additionalRequirements.push(`ТРЕБОВАНИЕ: Описание графика должно содержать минимум ${settings.minContent} слов`);
          }
        } else if (elementKey === 'testimonial-card') {
          // Специальная обработка для testimonial-card
          requirements.push(`СОДЕРЖИМОЕ: [Имя клиента] * [Должность] * [Компания] * [Текст отзыва] * [Рейтинг]`);
          if (settings.minContent > 0) {
            additionalRequirements.push(`ТРЕБОВАНИЕ: Текст отзыва должен содержать НЕ МЕНЕЕ ${settings.minContent} слов - проверяйте по количеству слов, а не символов или строк`);
            additionalRequirements.push(`ВАЖНО: Тексты отзывов, содержащие ${settings.minContent - 1} слов и менее, считаются НЕВЕРНЫМИ`);
            additionalRequirements.push(`ПОДСКАЗКА: Словом считается любое отдельное слово, включая артикли, предлоги, союзы и числительные`);
          }
                  } else if (elementKey === 'faq-section') {
            // Специальная обработка для faq-section
            if (settings.minTitle > 0) {
              requirements.push(`ЗАГОЛОВОК: [заголовок секции] НЕ МЕНЕЕ ${settings.minTitle} слов`);
              additionalRequirements.push(`ТРЕБОВАНИЕ: Заголовок секции должен содержать НЕ МЕНЕЕ ${settings.minTitle} слов - проверяйте по количеству слов`);
            } else {
              requirements.push(`ЗАГОЛОВОК: [заголовок секции]`);
            }
            
            requirements.push(`СОДЕРЖИМОЕ: [Вопрос 1] | [Ответ 1] * [Вопрос 2] | [Ответ 2] * [Вопрос 3] | [Ответ 3]`);
            
            if (settings.minContent > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Каждый ответ должен содержать НЕ МЕНЕЕ ${settings.minContent} слов - проверяйте по количеству слов, а не символов или строк`);
              additionalRequirements.push(`ВАЖНО: Ответы, содержащие ${settings.minContent - 1} слов и менее, считаются НЕВЕРНЫМИ`);
              additionalRequirements.push(`ПОДСКАЗКА: Словом считается любое отдельное слово, включая артикли, предлоги, союзы и числительные`);
            }
            
            if (settings.minQuestions > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minQuestions} вопросов в секции`);
            }
          } else if (elementKey === 'accordion') {
            // Специальная обработка для accordion
            if (settings.minTitle > 0) {
              requirements.push(`ЗАГОЛОВОК: [заголовок аккордеона] НЕ МЕНЕЕ ${settings.minTitle} слов`);
              additionalRequirements.push(`ТРЕБОВАНИЕ: Заголовок аккордеона должен содержать НЕ МЕНЕЕ ${settings.minTitle} слов - проверяйте по количеству слов`);
            } else {
              requirements.push(`ЗАГОЛОВОК: [заголовок аккордеона]`);
            }
            
            requirements.push(`СОДЕРЖИМОЕ: [Вопрос 1]? [Ответ 1] * [Вопрос 2]? [Ответ 2] * [Вопрос 3]? [Ответ 3]`);
            
            if (settings.minContent > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Каждый ответ должен содержать НЕ МЕНЕЕ ${settings.minContent} слов - проверяйте по количеству слов, а не символов или строк`);
              additionalRequirements.push(`ВАЖНО: Ответы, содержащие ${settings.minContent - 1} слов и менее, считаются НЕВЕРНЫМИ`);
              additionalRequirements.push(`ПОДСКАЗКА: Словом считается любое отдельное слово, включая артикли, предлоги, союзы и числительные`);
            }
            
                        if (settings.minQuestions > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minQuestions} вопросов в аккордеоне`);
            }
          } else if (elementKey === 'rating') {
            // Специальная обработка для rating
            if (settings.minTitle > 0) {
              requirements.push(`ЗАГОЛОВОК: [что оценивается] НЕ МЕНЕЕ ${settings.minTitle} слов`);
              additionalRequirements.push(`ТРЕБОВАНИЕ: Заголовок должен содержать НЕ МЕНЕЕ ${settings.minTitle} слов - проверяйте по количеству слов`);
            } else {
              requirements.push(`ЗАГОЛОВОК: [что оценивается]`);
            }
            
            requirements.push(`СОДЕРЖИМОЕ: [текущая оценка] * [подпись/описание]`);
            
            if (settings.minContent > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Подпись должна содержать НЕ МЕНЕЕ ${settings.minContent} слов - проверяйте по количеству слов, а не символов или строк`);
              additionalRequirements.push(`ВАЖНО: Подписи, содержащие ${settings.minContent - 1} слов и менее, считаются НЕВЕРНЫМИ`);
              additionalRequirements.push(`ПОДСКАЗКА: Словом считается любое отдельное слово, включая артикли, предлоги, союзы и числительные`);
            }
          } else if (elementKey === 'multiple-cards') {
            // Специальная обработка для multiple-cards
            if (settings.minTitle > 0) {
              requirements.push(`ЗАГОЛОВОК: [заголовок секции] НЕ МЕНЕЕ ${settings.minTitle} слов`);
              additionalRequirements.push(`ТРЕБОВАНИЕ: Заголовок секции должен содержать НЕ МЕНЕЕ ${settings.minTitle} слов - проверяйте по количеству слов`);
            } else {
              requirements.push(`ЗАГОЛОВОК: [заголовок секции]`);
            }
            
            // Генерируем формат с нужным количеством карточек
            const cardCount = settings.minCards > 0 ? settings.minCards : 3;
            const cardTemplate = Array.from({length: cardCount}, (_, i) => `[заголовок карточки ${i + 1}] * [содержимое карточки ${i + 1}]`).join(' * ');
            requirements.push(`СОДЕРЖИМОЕ: ${cardTemplate}`);
            
            if (settings.minContent > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Каждое содержимое карточки должно содержать НЕ МЕНЕЕ ${settings.minContent} слов - проверяйте по количеству слов, а не символов или строк`);
              additionalRequirements.push(`ВАЖНО: Содержимое карточек, содержащее ${settings.minContent - 1} слов и менее, считается НЕВЕРНЫМ`);
              additionalRequirements.push(`ПОДСКАЗКА: Словом считается любое отдельное слово, включая артикли, предлоги, союзы и числительные`);
            }
            
            if (settings.minCards > 0) {
              additionalRequirements.push(`ТРЕБОВАНИЕ: Создайте ТОЧНО ${settings.minCards} карточек, не больше и не меньше`);
              additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minCards} карточек`);
            }
            
            // Добавляем специальные требования для формата
            additionalRequirements.push(`ТРЕБОВАНИЕ: НЕ указывайте текст "карточка 1:", "карточка 2:", "карточка 3:" и т.д.`);
            additionalRequirements.push(`ТРЕБОВАНИЕ: Просто создавайте заголовок и содержимое каждой карточки без нумерации`);
            additionalRequirements.push(`ТРЕБОВАНИЕ: Каждая карточка должна иметь ОТДЕЛЬНЫЙ заголовок и ОТДЕЛЬНОЕ содержимое`);
          } else {
            // Для остальных элементов заменяем как обычно
          if (settings.minContent > 0) {
            requirements.push(`СОДЕРЖИМОЕ: [содержимое элемента] НЕ МЕНЕЕ ${settings.minContent} слов`);
            additionalRequirements.push(`ТРЕБОВАНИЕ: Содержимое должно содержать НЕ МЕНЕЕ ${settings.minContent} слов - проверяйте по количеству слов, а не символов или строк`);
            additionalRequirements.push(`ВАЖНО: Содержимое, содержащее ${settings.minContent - 1} слов и менее, считается НЕВЕРНЫМ`);
          } else {
            requirements.push(`СОДЕРЖИМОЕ: [содержимое элемента]`);
          }
        }
      }
    
    // Дополнительные требования как отдельные строки
    if (settings.minRows > 0) {
      additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minRows} строк в таблице`);
    }
    
    if (settings.minColumns > 0) {
      if (isChart) {
        additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minColumns} категорий на графике (например: Янв, Фев, Мар, Апр, Май...)`);
      } else {
        additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minColumns} столбцов в таблице`);
      }
    }
    
    if (settings.minCards > 0) {
      additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minCards} карточек`);
    }
    
    if (settings.minDataPoints > 0) {
      if (elementKey.includes('timeline')) {
        additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minDataPoints} событий на временной шкале`);
      } else {
        additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minDataPoints} точек данных для отображения`);
      }
    }
    
    if (settings.minQuestions > 0) {
      additionalRequirements.push(`ТРЕБОВАНИЕ: Минимум ${settings.minQuestions} вопросов`);
    }
    
    // Объединяем основные поля и дополнительные требования
    return [...requirements, ...additionalRequirements].join('\n');
  };
  
  // Функция для генерации промпта полного сайта с учетом настроек
  const generateFullSitePrompt = (settings, getSectionLabelFn = null) => {
    const getWordRange = (section, field) => {
      const range = settings.wordRanges[section]?.[field];
      if (!range) return '';
      return `(${range.min}-${range.max} слов)`;
    };

    // Функция для получения названия раздела для промта
    const getSectionNameForPrompt = (section) => {
      if (getSectionLabelFn) {
        return getSectionLabelFn(section);
      }
      return getSectionLabel(section);
    };

    // Функция для генерации NAME PAGE на основе названия раздела
    const generateNamePage = (section) => {
      const sectionName = getSectionNameForPrompt(section);
      
      // Словарь для перевода русских названий в английские
      const translations = {
        'О нас': 'about-us',
        'Услуги': 'services', 
        'Преимущества': 'features',
        'Новости': 'news',
        'Вопросы и ответы': 'faq',
        'Отзывы': 'testimonials',
        'Контакты': 'contacts',
        'Универсальная секция': 'universal',
        'Hero секция': 'hero',
        'Сообщение благодарности': 'thank-you',
        'Правовые документы': 'legal'
      };
      
      // Если есть точный перевод, используем его
      if (translations[sectionName]) {
        return translations[sectionName];
      }
      
      // Иначе генерируем на основе названия (максимум 2 слова)
      const words = sectionName.toLowerCase()
        .replace(/[^\w\s]/g, '') // убираем знаки препинания
        .split(/\s+/)
        .filter(word => word.length > 0)
        .slice(0, 2); // берем максимум 2 слова
      
      return words.join('-');
    };

    // Получаем информацию о выбранном языке из глобальных настроек
    let languageName = 'русском языке';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        languageName = langObj.label.split(' - ')[0]; // Берем русское название до " - "
      }
    }

    let sectionsPrompt = `Создайте полный контент для сайта. Строго следуйте формату ниже.

ОБЯЗАТЕЛЬНО СОЗДАЙТЕ ВСЕ УКАЗАННЫЕ РАЗДЕЛЫ, ВКЛЮЧАЯ ПРАВОВЫЕ ДОКУМЕНТЫ В КОНЦЕ!

КРИТИЧЕСКИ ВАЖНО: 
1. Весь контент, включая ID секций, ДОЛЖЕН быть на одном языке (который указан в настройках)
2. ⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE - для КАЖДОГО раздела указывайте имя HTML страницы на английском языке, подходящее под название раздела (максимум 2 слова, через дефис). ЭТО ПОЛЕ ОБЯЗАТЕЛЬНО ДЛЯ ВСЕХ РАЗДЕЛОВ!
3. ID секций: буквы "ID" всегда на английском языке, название секции после двоеточия - на ${languageName}
4. Не использовать смешанные языки или транслитерацию
5. КАЖДЫЙ раздел ОБЯЗАТЕЛЬНО должен начинаться с "=== РАЗДЕЛ: ИМЯ ===" и ОБЯЗАТЕЛЬНО заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
6. НЕ ИСПОЛЬЗУЙТЕ символы экранирования (\) перед разделителями ===
7. Разделители должны быть точно: === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===
8. ОБЯЗАТЕЛЬНО: Каждый раздел должен иметь закрывающий разделитель "=== КОНЕЦ РАЗДЕЛА ===" - это критически важно для корректной обработки
9. ОБЯЗАТЕЛЬНО указывайте ключевое слово "ТИП:" перед каждым AI элементом!

ВАЖНО: Не добавляйте обратные слеши (\) перед символами ===. Используйте точно такой формат:
=== РАЗДЕЛ: HERO ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===

ВНИМАНИЕ: Отсутствие разделителя "=== КОНЕЦ РАЗДЕЛА ===" приведет к ошибке обработки контента!\n\n`;

    // Добавляем Hero секцию в начало
    sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('HERO')} ===
1. Первая строка - название сайта (1-2 слова, легко запоминающееся)
2. Вторая строка - заголовок hero секции ${getWordRange('HERO', 'title')}
3. Третья строка - описание ${getWordRange('HERO', 'description')}

Пример структуры:
ПравоЩит
Надежная защита ваших интересов
Профессиональная юридическая поддержка для бизнеса и частных лиц. Решаем сложные правовые вопросы, гарантируя результат.
=== КОНЕЦ РАЗДЕЛА ===\n\n`;

    if (settings.includedSections.ABOUT) {
      const sectionName = getSectionNameForPrompt('ABOUT');
      sectionsPrompt += `=== РАЗДЕЛ: ${sectionName} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('ABOUT')} (подходящее имя на английском языке, максимум 2 слова)
[Заголовок раздела ${getWordRange('ABOUT', 'sectionTitle')}]
[Описание раздела ${getWordRange('ABOUT', 'sectionDescription')}]

ТИП: typography
ЗАГОЛОВОК: О нашей компании
СОДЕРЖИМОЕ: Краткое описание компании и её деятельности

ТИП: multiple-cards
ЗАГОЛОВОК: Наши направления
СОДЕРЖИМОЕ: Направление 1 * Описание направления * Направление 2 * Описание направления * Направление 3 * Описание направления
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.SERVICES) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('SERVICES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('SERVICES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('SERVICES', 'sectionTitle')}]
[Описание раздела ${getWordRange('SERVICES', 'sectionDescription')}]

ТИП: typography
ЗАГОЛОВОК: Наши основные услуги
СОДЕРЖИМОЕ: Краткое описание направления деятельности компании

ТИП: accordion
ЗАГОЛОВОК: Подробная информация
СОДЕРЖИМОЕ: Услуга 1? Описание первой услуги * Услуга 2? Описание второй услуги * Услуга 3? Описание третьей услуги

ТИП: callout
ЗАГОЛОВОК: Консультация бесплатно
СОДЕРЖИМОЕ: Получите профессиональную консультацию по вашему вопросу

ТИП: multiple-cards
ЗАГОЛОВОК: Дополнительные услуги
СОДЕРЖИМОЕ: Услуга А * Краткое описание * Услуга Б * Краткое описание * Услуга В * Краткое описание

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FEATURES) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FEATURES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FEATURES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FEATURES', 'sectionTitle')}]
[Описание раздела ${getWordRange('FEATURES', 'sectionDescription')}]

ТИП: callout
ЗАГОЛОВОК: Профессиональная команда
СОДЕРЖИМОЕ: В нашем штате сертифицированные специалисты

ТИП: animated-counter
ЗАГОЛОВОК: Наша статистика
СОДЕРЖИМОЕ: 100 * довольных клиентов * За время работы мы помогли сотням клиентов

ТИП: multiple-cards
ЗАГОЛОВОК: Наши преимущества
СОДЕРЖИМОЕ: Качество * Высокие стандарты работы * Скорость * Быстрое решение задач * Надежность * Проверенные решения * Поддержка * Помощь на всех этапах

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.NEWS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('NEWS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('NEWS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('NEWS', 'sectionTitle')}]
[Описание раздела ${getWordRange('NEWS', 'sectionDescription')}]

ТИП: typography
ЗАГОЛОВОК: Последние события
СОДЕРЖИМОЕ: Мы регулярно публикуем новости о нашей работе и достижениях

ТИП: multiple-cards
ЗАГОЛОВОК: Новости компании
СОДЕРЖИМОЕ: Новая услуга * Мы запустили новую услугу для клиентов * Расширение команды * Пополнение штата специалистами * Новые технологии * Внедрение современных решений

ТИП: timeline-component
ЗАГОЛОВОК: События года
СОДЕРЖИМОЕ: Январь * Запуск нового направления * Апрель * Открытие офиса * Сентябрь * Получение сертификата качества

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FAQ) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FAQ')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FAQ')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FAQ', 'sectionTitle')}]
[Описание раздела ${getWordRange('FAQ', 'sectionDescription')}]

ТИП: faq-section
ЗАГОЛОВОК: Часто задаваемые вопросы
СОДЕРЖИМОЕ: Как заказать услугу? | Свяжитесь с нами по телефону или email

ТИП: callout
ЗАГОЛОВОК: Не нашли ответ?
СОДЕРЖИМОЕ: Задайте ваш вопрос напрямую нашим специалистам

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('TESTIMONIALS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('TESTIMONIALS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('TESTIMONIALS', 'sectionTitle')}]
[Описание раздела ${getWordRange('TESTIMONIALS', 'sectionDescription')}]

ТИП: testimonial-card
СОДЕРЖИМОЕ: [Имя клиента] * [Должность] * [Компания] * [Текст отзыва] * [Рейтинг]

КРИТИЧЕСКИ ВАЖНО для testimonial-card:
ОБЯЗАТЕЛЬНО используйте ВСЕ 5 ключей в строгом порядке, разделенных звездочками:
[Имя клиента] * [Должность] * [Компания] * [Текст отзыва] * [Рейтинг]
НЕ пропускайте ни одного ключа, даже если информация неизвестна!

Пример:
ТИП: testimonial-card
СОДЕРЖИМОЕ: Иван Петров * Директор * ООО "Рога и копыта" * Отличная компания, помогли решить все вопросы быстро и профессионально. Рекомендую! * 5

ТИП: animated-counter
ЗАГОЛОВОК: Наши достижения
СОДЕРЖИМОЕ: 500 * довольных клиентов * За время работы мы помогли сотням компаний

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.UNIVERSAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('UNIVERSAL')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('UNIVERSAL')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('UNIVERSAL', 'sectionTitle')}]
[Описание раздела ${getWordRange('UNIVERSAL', 'sectionDescription')}]

ТИП: typography
ЗАГОЛОВОК: Дополнительная информация
СОДЕРЖИМОЕ: Полезная информация, которая дополняет основной контент сайта

ТИП: basic-card
ЗАГОЛОВОК: Полезные материалы
СОДЕРЖИМОЕ: Дополнительные материалы и ресурсы для наших клиентов

ТИП: animated-counter
ЗАГОЛОВОК: Дополнительные показатели
СОДЕРЖИМОЕ: 100 * дополнительных проектов * Мы реализовали множество успешных проектов

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('CONTACTS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('CONTACTS')} (подходящее имя на английском языке, максимум 2 слова)
[Заголовок раздела на выбранном языке]

([Описание на выбранном языке, 15-20 слов, пример: "Свяжитесь с нами для оформления заявки или получения бесплатной консультации по вашему вопросу"])

[Полный адрес в стандартном формате страны, включая:
- Для России: город, улица, дом, индекс (например: "Москва, ул. Большая Семёновская, д. 40, 107023")
- Для США: улица, город, штат, zip (например: "2500 N Forest Rd, Getzville, NY 14068")
- Для Германии: улица, почтовый код, город (например: "Mehringdamm 33, 10961 Berlin")
- Для Франции: улица, почтовый код, город (например: "123 Avenue de Flandre, 75019 Paris")
- Для Великобритании: номер дома, улица, город, почтовый код (например: "45 Deansgate, Manchester M3 2AY")
- Для Канады: улица, город, провинция, почтовый код (например: "1055 W Georgia St, Vancouver, BC V6E 3P3")
- Для Австралии: улица, пригород, штат, почтовый код (например: "200 Queen St, Melbourne VIC 3000")
- Для Испании: улица, номер, город, почтовый код (например: "Carrer de Balmes 145, Barcelona 08008")
- Для Италии: улица, номер, город, почтовый код (например: "Via Torino 61, Milano 20123")
- Для других стран: полный адрес согласно местным стандартам адресации]

[Телефон в местном формате с кодом страны]

[Email]

ВАЖНО О ФОРМАТЕ:
- Адрес должен включать ВСЕ необходимые элементы согласно стандартам страны: улицу, номер дома, город, индекс/код
- Использовать полные слова вместо сокращений для лучшей читаемости
- ОБЯЗАТЕЛЬНО: Использовать только РЕАЛЬНЫЕ адреса, которые существуют и отображаются на Google Maps
- НЕ использовать адреса государственных учреждений, известных достопримечательностей или публичных мест (избегать: Кремль, Белый дом, Букингемский дворец, Тверская, Oxford Street, Times Square, Champs-Élysées, Via del Corso и другие известные места)
- Использовать адреса обычных офисных зданий, бизнес-центров, торговых центров или жилых комплексов
- Формат телефона должен соответствовать национальным стандартам с международным кодом
- Email будет автоматически создан как info@[название-сайта].com

Пример структуры на русском (заменить на выбранный язык):
Контакты

(Свяжитесь с нами для оформления заявки или получения бесплатной консультации. Наши специалисты ответят на все ваши вопросы)

107023, Москва, ул. Большая Семёновская, д. 40, оф. 304

+7 (495) 123-45-67

info@company.com
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.MERCI) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('MERCI')} ===
[Текст сообщения на выбранном языке, пример: "Спасибо за обращение, с вами свяжется в ближайшее время наш специалист"]

[Текст кнопки на выбранном языке, пример: "Закрыть"]

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.LEGAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('LEGAL')} ===
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

ПРОВЕРКА: Убедитесь, что ВСЕ заголовки и ВЕСЬ текст написаны ТОЛЬКО на выбранном языке. Не смешивайте языки. Если выбран не русский язык, НЕ используйте русский текст нигде в документах.

КРИТИЧЕСКИ ВАЖНО: Раздел правовых документов ОБЯЗАТЕЛЬНО должен заканчиваться разделителем "=== КОНЕЦ РАЗДЕЛА ===" после последнего документа. Это необходимо для корректной обработки системой!
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    sectionsPrompt += `Важные требования:
1. Разделители === РАЗДЕЛ: ИМЯ === всегда на русском языке
2. Заголовки внутри разделов - на выбранном языке
3. Весь контент (включая ID) - на выбранном языке
4. Не использовать специальные символы и форматирование
5. Каждый элемент должен начинаться с новой строки
6. Между карточками/пунктами оставлять ОДНУ пустую строку
7. ОБЯЗАТЕЛЬНО: Каждый раздел должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ===" - без исключений!
8. Проверьте, что ВСЕ разделы имеют закрывающий разделитель, особенно последний раздел
9. НЕ ПРОПУСКАЙТЕ раздел "=== РАЗДЕЛ: ПРАВОВЫЕ ДОКУМЕНТЫ ===" - он обязателен и должен содержать все три документа!
10. ВНИМАНИЕ: Убедитесь, что создали ВСЕ указанные разделы, включая правовые документы в самом конце`;

    return sectionsPrompt;
  };

  // Функция для генерации отдельного промпта для правовых документов
  const generateLegalDocumentsPrompt = () => {
    const theme = globalSettings.theme === 'CUSTOM' 
      ? globalSettings.customTheme 
      : WEBSITE_THEMES[globalSettings.theme];

    let language;
    let languageCode = '';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageCode = globalSettings.customLanguage;
      language = `языке с кодом ISO ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        language = langObj.label.split(' - ')[0]; // Берем русское название до " - "
        const codeMatch = langObj.label.match(/\(([a-z]{2})\)/i);
        languageCode = codeMatch ? codeMatch[1].toLowerCase() : '';
      } else {
        language = 'русском языке';
        languageCode = 'ru';
      }
    } else {
      // Если язык не выбран, используем русский по умолчанию
      language = 'русском языке';
      languageCode = 'ru';
    }

    return `СПЕЦИАЛИЗИРОВАННЫЙ ПРОМПТ ДЛЯ ПРАВОВЫХ ДОКУМЕНТОВ

Создайте три юридических документа для сайта "${theme}" СТРОГО на ${language}.

КРИТИЧЕСКИ ВАЖНО:
1. Весь текст документов ОБЯЗАТЕЛЬНО должен быть только на ${language}
2. Каждый документ должен быть ПОЛНЫМ (1200-2000 слов)
3. Документы должны соответствовать требованиям GDPR и быть универсальными

ФОРМАТ ДОКУМЕНТОВ:
- Каждый документ начинается с заголовка в круглых скобках на отдельной строке
- После заголовка сразу идет текст документа  
- Между документами оставляйте ровно две пустые строки

СОЗДАЙТЕ ТРИ ДОКУМЕНТА В СТРОГОМ ПОРЯДКЕ:

1. ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ - должна включать разделы:
   - Общие положения
   - Какую информацию мы собираем
   - Как мы используем информацию
   - Защита данных и срок хранения
   - Передача данных третьим лицам
   - Использование файлов cookie
   - Права пользователя
   - Изменения в политике
   - Согласие пользователя

2. ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ - должно включать разделы:
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

3. ПОЛИТИКА ИСПОЛЬЗОВАНИЯ COOKIE - должна включать разделы:
   - Что такое файлы cookie
   - Типы файлов cookie
   - Цели использования cookie
   - Контроль файлов cookie
   - Сторонние cookie-файлы
   - Срок хранения cookie
   - Как отключить cookie
   - Обновления политики

СТРОГИЕ ПРАВИЛА:
- НЕ указывать конкретные контактные данные
- Использовать формулировки "наш сайт", "администрация сайта"
- НЕ добавлять комментарии после последнего документа
- НЕ использовать форматирование Markdown или HTML
- Ответ должен содержать ТОЛЬКО три документа

ФИНАЛЬНАЯ ПРОВЕРКА:
1. Все документы написаны полностью на ${language}
2. Каждый документ содержит все требуемые разделы
3. Нет дополнительных комментариев после последнего документа
4. Объем каждого документа 1200-2000 слов`;
  };

  // Улучшенная функция генерации промпта полного сайта (без правовых документов)
  const generateOptimizedFullSitePrompt = (settings, getSectionLabelFn = null) => {
    const getWordRange = (section, field) => {
      const range = settings.wordRanges[section]?.[field];
      if (!range) return '';
      return `(${range.min}-${range.max} слов)`;
    };

    // Функция для получения названия раздела для промта
    const getSectionNameForPrompt = (section) => {
      if (getSectionLabelFn) {
        return getSectionLabelFn(section);
      }
      return getSectionLabel(section);
    };

    // Получаем информацию о выбранном языке из глобальных настроек
    let languageName = 'русском языке';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        languageName = langObj.label.split(' - ')[0]; // Берем русское название до " - "
      }
    }

    let sectionsPrompt = `ОПТИМИЗИРОВАННЫЙ ПРОМПТ ПОЛНОГО САЙТА

Создайте контент для сайта согласно указанным разделам.

ФОРМАТ РАЗДЕЛИТЕЛЕЙ:
=== РАЗДЕЛ: ИМЯ ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===

ВАЖНО: 
1. ⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE - для КАЖДОГО раздела указывайте имя HTML страницы на английском языке (например: "about-us", "services", "contact", "get-in-touch"). ЭТО ПОЛЕ ОБЯЗАТЕЛЬНО ДЛЯ ВСЕХ РАЗДЕЛОВ!
2. Каждый раздел ОБЯЗАТЕЛЬНО должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
3. ОБЯЗАТЕЛЬНО указывайте ключевое слово "ТИП:" перед каждым AI элементом!

`;

    // Добавляем Hero секцию
    sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('HERO')} ===
1. Название сайта (1-2 слова)
2. Заголовок hero секции ${getWordRange('HERO', 'title')}
3. Описание ${getWordRange('HERO', 'description')}
=== КОНЕЦ РАЗДЕЛА ===

`;

    // Добавляем остальные секции с новым форматом AI элементов
    if (settings.includedSections.ABOUT) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('ABOUT')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('ABOUT')} (подходящее имя на английском языке, максимум 2 слова)
[Заголовок ${getWordRange('ABOUT', 'sectionTitle')}]
[Описание ${getWordRange('ABOUT', 'sectionDescription')}]

ТИП: typography
ЗАГОЛОВОК: О нашей компании
СОДЕРЖИМОЕ: Краткое описание

ТИП: multiple-cards
ЗАГОЛОВОК: Наши направления
СОДЕРЖИМОЕ: Направление 1 | Описание направления и его особенности
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.SERVICES) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('SERVICES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('SERVICES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('SERVICES', 'sectionTitle')}]
[Описание ${getWordRange('SERVICES', 'sectionDescription')}]

ТИП: [тип элемента: typography, list, blockquote, table, chart, accordion, testimonial, imageCard]
ЗАГОЛОВОК: [заголовок элемента]
СОДЕРЖИМОЕ: [содержимое элемента]

ОСОБЫЕ ТРЕБОВАНИЯ ДЛЯ АККОРДЕОНА (accordion):
Для элемента типа "accordion" используйте строго следующий формат:
ТИП: accordion
ЗАГОЛОВОК: [Заголовок аккордеона]
СОДЕРЖИМОЕ: [Заголовок панели 1]? [Содержимое панели 1] * [Заголовок панели 2]? [Содержимое панели 2] * [Заголовок панели 3]? [Содержимое панели 3]

=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.FEATURES) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FEATURES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FEATURES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('FEATURES', 'sectionTitle')}]
[Описание ${getWordRange('FEATURES', 'sectionDescription')}]

Заголовок преимущества
Описание ${getWordRange('FEATURES', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.NEWS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('NEWS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('NEWS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('NEWS', 'sectionTitle')}]
[Описание ${getWordRange('NEWS', 'sectionDescription')}]

Заголовок новости
Текст новости ${getWordRange('NEWS', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.FAQ) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FAQ')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FAQ')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('FAQ', 'sectionTitle')}]
[Описание ${getWordRange('FAQ', 'sectionDescription')}]

Вопрос?
Ответ ${getWordRange('FAQ', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('TESTIMONIALS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('TESTIMONIALS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('TESTIMONIALS', 'sectionTitle')}]
[Описание ${getWordRange('TESTIMONIALS', 'sectionDescription')}]

Имя автора
Текст отзыва ${getWordRange('TESTIMONIALS', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.UNIVERSAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('UNIVERSAL')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('UNIVERSAL')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('UNIVERSAL', 'sectionTitle')}]
[Описание ${getWordRange('UNIVERSAL', 'sectionDescription')}]

Дополнительная информация
Полезный контент ${getWordRange('UNIVERSAL', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('CONTACTS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('CONTACTS')} (подходящее имя на английском языке, максимум 2 слова)
[Заголовок на выбранном языке]

([Описание, 15-20 слов])

[Полный адрес в стандартном формате страны, включая:
- Для России: город, улица, дом, индекс (например: "Москва, ул. Большая Семёновская, д. 40, 107023")
- Для США: улица, город, штат, zip (например: "2500 N Forest Rd, Getzville, NY 14068")
- Для Германии: улица, почтовый код, город (например: "Mehringdamm 33, 10961 Berlin")
- Для Франции: улица, почтовый код, город (например: "123 Avenue de Flandre, 75019 Paris")
- Для Великобритании: номер дома, улица, город, почтовый код (например: "45 Deansgate, Manchester M3 2AY")
- Для Канады: улица, город, провинция, почтовый код (например: "1055 W Georgia St, Vancouver, BC V6E 3P3")
- Для Австралии: улица, пригород, штат, почтовый код (например: "200 Queen St, Melbourne VIC 3000")
- Для Испании: улица, номер, город, почтовый код (например: "Carrer de Balmes 145, Barcelona 08008")
- Для Италии: улица, номер, город, почтовый код (например: "Via Torino 61, Milano 20123")
- Для других стран: полный адрес согласно местным стандартам адресации]

ВАЖНО: Использовать только РЕАЛЬНЫЕ адреса, которые существуют и отображаются на Google Maps. НЕ использовать адреса государственных учреждений, известных достопримечательностей или публичных мест. Использовать адреса обычных офисных зданий, торговых центров или жилых комплексов.

[Телефон в местном формате с кодом страны]

[Email]
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.MERCI) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('MERCI')} ===
[Текст сообщения на выбранном языке, пример: "Спасибо за обращение, с вами свяжется в ближайшее время наш специалист"]

[Текст кнопки на выбранном языке, пример: "Закрыть"]

=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    if (settings.includedSections.UNIVERSAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('UNIVERSAL')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('UNIVERSAL')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок ${getWordRange('UNIVERSAL', 'sectionTitle')}]
[Описание ${getWordRange('UNIVERSAL', 'sectionDescription')}]

Дополнительная информация
Полезный контент ${getWordRange('UNIVERSAL', 'cardContent')}
=== КОНЕЦ РАЗДЕЛА ===

`;
    }

    sectionsPrompt += `ТРЕБОВАНИЯ:
1. Весь контент на одном языке (указанном в настройках)
2. ID секций: буквы "ID" всегда на английском, название секции после двоеточия - на ${languageName}
3. Не использовать форматирование Markdown/HTML
4. Каждый раздел должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. Не пропускать указанные разделы
6. КРИТИЧЕСКИ ВАЖНО ДЛЯ АДРЕСОВ: Использовать только РЕАЛЬНЫЕ адреса, которые существуют на Google Maps. НЕ использовать: известные улицы/места (Тверская, Арбат, Oxford Street, Times Square, Broadway, Champs-Élysées), правительственные здания, достопримечательности. Использовать адреса обычных бизнес-центров, офисных зданий, торговых центров`;

    return sectionsPrompt;
  };

  // Функция генерации базового промпта БЕЗ предустановленных элементов
  const generateBasicFullSitePrompt = (settings, getSectionLabelFn = null) => {
    const getWordRange = (section, field) => {
      const range = settings.wordRanges[section]?.[field];
      if (!range) return '';
      return `(${range.min}-${range.max} слов)`;
    };

    // Функция для получения названия раздела для промта
    const getSectionNameForPrompt = (section) => {
      if (getSectionLabelFn) {
        return getSectionLabelFn(section);
      }
      return getSectionLabel(section);
    };

    // Получаем информацию о выбранном языке из глобальных настроек
    let languageName = 'русском языке';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        languageName = langObj.label.split(' - ')[0];
      }
    }

    let sectionsPrompt = `Создайте полный контент для сайта. Строго следуйте формату ниже.

КРИТИЧЕСКИ ВАЖНО: 
1. Весь контент, включая ID секций, ДОЛЖЕН быть на одном языке (который указан в настройках)
2. ⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE - для КАЖДОГО раздела указывайте имя HTML страницы на английском языке, подходящее под название раздела (максимум 2 слова, через дефис). ЭТО ПОЛЕ ОБЯЗАТЕЛЬНО ДЛЯ ВСЕХ РАЗДЕЛОВ!
3. ID секций: буквы "ID" всегда на английском языке, название секции после двоеточия - на ${languageName}
4. Не использовать смешанные языки или транслитерацию
5. КАЖДЫЙ раздел ОБЯЗАТЕЛЬНО должен начинаться с "=== РАЗДЕЛ: ИМЯ ===" и ОБЯЗАТЕЛЬНО заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
6. НЕ ИСПОЛЬЗУЙТЕ символы экранирования (\) перед разделителями === 
7. ОБЯЗАТЕЛЬНО указывайте ключевое слово "ТИП:" перед каждым AI элементом!

AI ЭЛЕМЕНТЫ - ИСПОЛЬЗУЙТЕ ТОЛЬКО ВЫБРАННЫЕ:

ВАЖНО: Каждый AI элемент ДОЛЖЕН начинаться с "ТИП: [название_элемента]"

\n\n`;

    // Добавляем Hero секцию в начало
    sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('HERO')} ===
1. Первая строка - название сайта (1-2 слова)
2. Вторая строка - заголовок hero секции ${getWordRange('HERO', 'title')}
3. Третья строка - описание ${getWordRange('HERO', 'description')}
=== КОНЕЦ РАЗДЕЛА ===\n\n`;

    if (settings.includedSections.ABOUT) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('ABOUT')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('ABOUT')} (подходящее имя на английском языке, максимум 2 слова)
[Заголовок раздела ${getWordRange('ABOUT', 'sectionTitle')}]
[Описание раздела ${getWordRange('ABOUT', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.SERVICES) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('SERVICES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('SERVICES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('SERVICES', 'sectionTitle')}]
[Описание раздела ${getWordRange('SERVICES', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FEATURES) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FEATURES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FEATURES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FEATURES', 'sectionTitle')}]
[Описание раздела ${getWordRange('FEATURES', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.NEWS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('NEWS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('NEWS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('NEWS', 'sectionTitle')}]
[Описание раздела ${getWordRange('NEWS', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.UNIVERSAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('UNIVERSAL')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('UNIVERSAL')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('UNIVERSAL', 'sectionTitle')}]
[Описание раздела ${getWordRange('UNIVERSAL', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FAQ) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FAQ')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FAQ')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FAQ', 'sectionTitle')}]
[Описание раздела ${getWordRange('FAQ', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('TESTIMONIALS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('TESTIMONIALS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('TESTIMONIALS', 'sectionTitle')}]
[Описание раздела ${getWordRange('TESTIMONIALS', 'sectionDescription')}]

[Используйте подходящие выбранные AI элементы для данного раздела]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('CONTACTS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('CONTACTS')} (подходящее имя на английском языке, максимум 2 слова)
[Заголовок раздела на выбранном языке]
([Описание на выбранном языке, 15-20 слов])
[Полный адрес в стандартном формате страны]
[Телефон в местном формате с кодом страны]
[Email]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.MERCI) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('MERCI')} ===
[Текст сообщения на выбранном языке]
[Текст кнопки на выбранном языке]
=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    return sectionsPrompt;
  };

  // Функция для проверки выбранных элементов в глобальном режиме
  const isElementSelectedGlobal = (selectedElements, elementKey) => {
    if (selectedElements.GLOBAL && selectedElements.GLOBAL.has) {
      return selectedElements.GLOBAL.has(elementKey);
    }
    return false;
  };

  // Функция генерации промпта с выбранными элементами для полного сайта  
  const generateFullSitePromptWithElements = (settings, selectedElements, customPrompts = {}, elementSettings = {}, getSectionLabelFn = null) => {
    console.log('[generateFullSitePromptWithElements] Called with selectedElements:', selectedElements);
    console.log('[generateFullSitePromptWithElements] Custom prompts count:', Object.keys(customPrompts).length);

    // Функция для получения названия раздела для промта
    const getSectionNameForPrompt = (section) => {
      if (getSectionLabelFn) {
        return getSectionLabelFn(section);
      }
      return getSectionLabel(section);
    };

    // Функция для генерации NAME PAGE на основе названия раздела
    const generateNamePage = (section) => {
      const sectionName = getSectionNameForPrompt(section);
      
      // Словарь для перевода русских названий в английские
      const translations = {
        'О нас': 'about-us',
        'Услуги': 'services', 
        'Преимущества': 'features',
        'Новости': 'news',
        'Вопросы и ответы': 'faq',
        'Отзывы': 'testimonials',
        'Контакты': 'contacts',
        'Универсальная секция': 'universal',
        'Hero секция': 'hero',
        'Сообщение благодарности': 'thank-you',
        'Правовые документы': 'legal'
      };
      
      // Если есть точный перевод, используем его
      if (translations[sectionName]) {
        return translations[sectionName];
      }
      
      // Иначе генерируем на основе названия (максимум 2 слова)
      const words = sectionName.toLowerCase()
        .replace(/[^\w\s]/g, '') // убираем знаки препинания
        .split(/\s+/)
        .filter(word => word.length > 0)
        .slice(0, 2); // берем максимум 2 слова
      
      return words.join('-');
    };
    console.log('[generateFullSitePromptWithElements] Element settings:', elementSettings);
    
    if (selectedElements.GLOBAL && selectedElements.GLOBAL.size > 0) {
      // Если элементы выбраны, используем базовый промпт БЕЗ предустановленных элементов
      console.log('[generateFullSitePromptWithElements] Using custom elements, generating basic prompt');
      let basePrompt = generateBasicFullSitePrompt(settings, getSectionLabelFn);
      
      basePrompt += 'AI ЭЛЕМЕНТЫ:\n';
      basePrompt += 'Используйте ВСЕ выбранные элементы минимум 1 раз каждый.\n\n';
      
      basePrompt += 'КРИТИЧЕСКИ ВАЖНО:\n';
      basePrompt += 'ОБЯЗАТЕЛЬНО указывайте ключевое слово "ТИП:" перед каждым элементом!\n';
      basePrompt += 'Каждый элемент ДОЛЖЕН начинаться с "ТИП: [название_элемента]"\n\n';
      
      basePrompt += 'СТРОГИЕ ТРЕБОВАНИЯ К КОЛИЧЕСТВУ СЛОВ:\n';
      basePrompt += '- Проверяйте количество слов, а НЕ символов или строк\n';
      basePrompt += '- Словом считается любое отдельное слово, включая артикли, предлоги, союзы\n';
      basePrompt += '- Тексты с меньшим количеством слов считаются НЕВЕРНЫМИ\n\n';
      
      // Добавляем специальные требования для testimonial-card, если он выбран
      if (isElementSelectedGlobal(selectedElements, 'testimonial-card')) {
        basePrompt += 'КРИТИЧЕСКИ ВАЖНО для testimonial-card:\n';
        basePrompt += 'ОБЯЗАТЕЛЬНО используйте ВСЕ 5 ключей в строгом порядке, разделенных звездочками:\n';
        basePrompt += '[Имя клиента] * [Должность] * [Компания] * [Текст отзыва] * [Рейтинг]\n';
        basePrompt += 'НЕ пропускайте ни одного ключа, даже если информация неизвестна!\n\n';
      }
      
      // Добавляем специальные требования для multiple-cards, если он выбран
      if (isElementSelectedGlobal(selectedElements, 'multiple-cards')) {
        basePrompt += 'КРИТИЧЕСКИ ВАЖНО для multiple-cards:\n';
        basePrompt += 'СОЗДАЙТЕ ТОЧНОЕ количество карточек, указанное в требованиях!\n';
        basePrompt += 'Если указано "5 карточек" - создайте РОВНО 5 карточек\n';
        basePrompt += 'Если указано "3 карточки" - создайте РОВНО 3 карточки\n';
        basePrompt += 'НЕ создавайте больше или меньше карточек!\n';
        basePrompt += 'ФОРМАТ: [заголовок карточки 1] * [содержимое карточки 1] * [заголовок карточки 2] * [содержимое карточки 2] * ...\n';
        basePrompt += 'НЕ указывайте текст "карточка 1:", "карточка 2:", "карточка 3:" и т.д.!\n';
        basePrompt += 'Просто создавайте заголовок и содержимое каждой карточки без нумерации!\n\n';
      }
      
      const selectedElementsArray = Array.from(selectedElements.GLOBAL);
      selectedElementsArray.forEach(elementKey => {
        const element = ELEMENT_PROMPTS[elementKey];
        if (element) {
          // Извлекаем пример из промпта элемента
          const sourcePrompt = customPrompts[elementKey] || element.fullSitePrompt || element.prompt;
          const promptLines = sourcePrompt.split('\n');
          let example = '';
          let foundExample = false;
          
          for (let line of promptLines) {
            line = line.trim();
            
            // Ищем начало примера
            if (line.includes('ТИП:') && line.includes(elementKey)) {
              foundExample = true;
              example += line + '\n';
              continue;
            }
            
            // Если нашли начало, продолжаем собирать пример
            if (foundExample) {
              if (line.includes('ЗАГОЛОВОК:') || line.includes('СОДЕРЖИМОЕ:') || 
                  line.includes('ФОРМАТ:') || line.includes('НАБОР_ДАННЫХ') ||
                  line.includes('МЕТКИ_ОСИ') || line.includes('ТИП_ВЫНОСКИ:') ||
                  line.includes('ЛИНИЯ_1:') || line.includes('ЛИНИЯ_2:') ||
                  line.includes('СЕРИЯ_1:') || line.includes('СЕРИЯ_2:')) {
                example += line + '\n';
              } else if (line.length === 0) {
                // Пустая строка - конец примера
                break;
              } else if (line.includes('Пример:') || line.includes('ID:')) {
                // Начался новый блок - останавливаемся
                break;
              }
            }
          }
          
          // Если не нашли пример, создаем базовый с учетом настроек
          if (!example.trim()) {
            example = `ТИП: ${elementKey}\n${generateElementRequirements(elementKey, elementSettings)}\n`;
          } else {
            // Если нашли пример, дополняем его требованиями из настроек
            const requirements = generateElementRequirements(elementKey, elementSettings);
            if (requirements) {
              const requirementLines = requirements.split('\n');
              
              // Заменяем только основные поля ЗАГОЛОВОК и СОДЕРЖИМОЕ, сохраняя структуру
              requirementLines.forEach(req => {
                if (req.startsWith('ЗАГОЛОВОК:') && req.includes('минимум')) {
                  example = example.replace(/^ЗАГОЛОВОК: \[.*?\]$/gm, req);
                } else if (req.startsWith('СОДЕРЖИМОЕ:') && req.includes('минимум')) {
                  example = example.replace(/^СОДЕРЖИМОЕ: \[.*?\]$/gm, req);
                }
              });
              
              // Добавляем дополнительные требования в конец
              const additionalReqs = requirementLines.filter(req => req.startsWith('ТРЕБОВАНИЕ:'));
              if (additionalReqs.length > 0) {
                example += '\n' + additionalReqs.join('\n');
              }
            }
          }
          
          basePrompt += example + '\n';
        }
      });
      
      // Функция для получения диапазона слов
      const getWordRange = (section, field) => {
        const range = settings.wordRanges[section]?.[field];
        if (!range) return '';
        return `(${range.min}-${range.max} слов)`;
      };

      // Простой список элементов для использования
      basePrompt += 'Выбранные элементы: ' + selectedElementsArray.join(', ') + '\n\n';
      

      
      return basePrompt;
    } else {
      // Если элементы не выбраны, используем стандартный промпт с предустановленными элементами
      return generateFullSitePrompt(settings, getSectionLabelFn);
    }
    
    return basePrompt;
  };

  // Функция генерации оптимизированного промпта с выбранными элементами
  const generateManualElementsPrompt = (settings, selectedElements, customPrompts = {}, elementSettings = {}, getSectionLabelFn = null, defaultLabels = {}) => {
    const getWordRange = (section, field) => {
      const range = settings.wordRanges[section]?.[field];
      if (!range) return '';
      return `(${range.min}-${range.max} слов)`;
    };

    // Функция для получения названия раздела для промта
    const getSectionNameForPrompt = (section) => {
      if (getSectionLabelFn) {
        return getSectionLabelFn(section);
      }
      return defaultLabels[section] || section;
    };

    // Функция для генерации NAME PAGE на основе названия раздела
    const generateNamePage = (section) => {
      const sectionName = getSectionNameForPrompt(section);
      
      // Словарь для перевода русских названий в английские
      const translations = {
        'О нас': 'about-us',
        'Услуги': 'services', 
        'Преимущества': 'features',
        'Новости': 'news',
        'Вопросы и ответы': 'faq',
        'Отзывы': 'testimonials',
        'Контакты': 'contacts',
        'Универсальная секция': 'universal',
        'Hero секция': 'hero',
        'Сообщение благодарности': 'thank-you',
        'Правовые документы': 'legal'
      };
      
      // Если есть точный перевод, используем его
      if (translations[sectionName]) {
        return translations[sectionName];
      }
      
      // Иначе генерируем на основе названия (максимум 2 слова)
      const words = sectionName.toLowerCase()
        .replace(/[^\w\s]/g, '') // убираем знаки препинания
        .split(/\s+/)
        .filter(word => word.length > 0)
        .slice(0, 2); // берем максимум 2 слова
      
      return words.join('-');
    };

    // Функция для генерации полного промпта элемента
    const generateElementPrompt = (elementKey) => {
      const element = ELEMENT_PROMPTS[elementKey];
      if (!element) {
        console.warn(`[generateElementPrompt] Element not found: ${elementKey}`);
        return '';
      }

      // Используем кастомный промпт если есть, иначе fullSitePrompt (если доступен), иначе обычный промпт
      const sourcePrompt = customPrompts[elementKey] || element.fullSitePrompt || element.prompt;
      
      // Извлекаем только пример использования из промпта
      const promptLines = sourcePrompt.split('\n');
      let example = '';
      let foundExample = false;
      
      for (let line of promptLines) {
        line = line.trim();
        
        // Ищем начало примера - более гибкий поиск
        if (line.startsWith('ТИП:') && (line.includes(elementKey) || line.includes(`ТИП: ${elementKey}`))) {
          foundExample = true;
          example += line + '\n';
          continue;
        }
        
        // Если нашли начало, продолжаем собирать пример
        if (foundExample) {
          if (line.includes('ЗАГОЛОВОК:') || line.includes('ОПИСАНИЕ:') || line.includes('СОДЕРЖИМОЕ:') || 
              line.includes('ФОРМАТ:') || line.includes('НАБОР_ДАННЫХ') ||
              line.includes('МЕТКИ_ОСИ') || line.includes('ТИП_ВЫНОСКИ:') ||
              line.includes('ЛИНИЯ_1:') || line.includes('ЛИНИЯ_2:') ||
              line.includes('СЕРИЯ_1:') || line.includes('СЕРИЯ_2:')) {
            example += line + '\n';
          } else if (line.length === 0) {
            // Пустая строка - конец примера
            break;
          } else if (line.includes('Пример:') || line.includes('ID:') || line.includes('ВАЖНО:')) {
            // Начался новый блок - останавливаемся
            break;
          }
        }
      }
      
      // Если не нашли пример, создаем базовый с учетом настроек
      if (!example.trim()) {
        console.warn(`[generateElementPrompt] No example found for ${elementKey}, creating basic prompt`);
        example = `ТИП: ${elementKey}\n${generateElementRequirements(elementKey, elementSettings)}\n`;
      } else {
        console.log(`[generateElementPrompt] Found example for ${elementKey}`);
        // Если нашли пример, дополняем его требованиями из настроек
        const requirements = generateElementRequirements(elementKey, elementSettings);
        if (requirements) {
          const requirementLines = requirements.split('\n');
          
          // Заменяем только основные поля ЗАГОЛОВОК и СОДЕРЖИМОЕ, сохраняя структуру
          requirementLines.forEach(req => {
            if (req.startsWith('ЗАГОЛОВОК:') && req.includes('минимум')) {
              example = example.replace(/^ЗАГОЛОВОК: \[.*?\]$/gm, req);
            } else if (req.startsWith('СОДЕРЖИМОЕ:') && req.includes('минимум')) {
              example = example.replace(/^СОДЕРЖИМОЕ: \[.*?\]$/gm, req);
            }
          });
          
          // Добавляем дополнительные требования в конец
          const additionalReqs = requirementLines.filter(req => req.startsWith('ТРЕБОВАНИЕ:'));
          if (additionalReqs.length > 0) {
            example += '\n' + additionalReqs.join('\n');
          }
        }
      }
      
      return example.trim();
    };

    // Получаем информацию о выбранном языке
    let languageName = 'русском языке';
    
    if (globalSettings.language === 'CUSTOM' && globalSettings.customLanguage) {
      languageName = `языке с кодом ${globalSettings.customLanguage}`;
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        languageName = langObj.label.split(' - ')[0];
      }
    }

    let sectionsPrompt = `Создайте полный контент для сайта с РУЧНЫМ ВЫБОРОМ ЭЛЕМЕНТОВ. Строго следуйте формату ниже.

ОБЯЗАТЕЛЬНО СОЗДАЙТЕ ВСЕ УКАЗАННЫЕ РАЗДЕЛЫ!

КРИТИЧЕСКИ ВАЖНО: 
1. Весь контент, включая ID секций, ДОЛЖЕН быть на одном языке (который указан в настройках)
2. ID секции должен быть написан на том же языке, что и весь контент
3. Не использовать смешанные языки или транслитерацию
4. Каждый раздел должен начинаться с "=== РАЗДЕЛ: ИМЯ ===" и заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. НЕ ИСПОЛЬЗУЙТЕ символы экранирования (\) перед разделителями ===
6. Разделители должны быть точно: === РАЗДЕЛ: ИМЯ === и === КОНЕЦ РАЗДЕЛА ===

ВАЖНО: Не добавляйте обратные слеши (\) перед символами ===. Используйте точно такой формат:
=== РАЗДЕЛ: О НАС ===
(контент раздела)
=== КОНЕЦ РАЗДЕЛА ===

РУЧНОЙ ВЫБОР ЭЛЕМЕНТОВ:
Каждый элемент должен начинаться с "ТИП: [название_элемента]"

`;

    // Генерируем разделы с ручным выбором элементов (исключая стандартные)
    if (settings.includedSections.HERO) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('HERO')} ===
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
- Текст должен быть понятным для всех клиентов

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.ABOUT) {
      const aboutElements = Array.from(selectedElements.ABOUT || []);
      console.log(`[generateManualElementsPrompt] ABOUT section elements:`, aboutElements);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('ABOUT')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('ABOUT')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('ABOUT', 'sectionTitle')}]
[Описание раздела ${getWordRange('ABOUT', 'sectionDescription')}]

${aboutElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.SERVICES) {
      const servicesElements = Array.from(selectedElements.SERVICES || []);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('SERVICES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('SERVICES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('SERVICES', 'sectionTitle')}]
[Описание раздела ${getWordRange('SERVICES', 'sectionDescription')}]

${servicesElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FEATURES) {
      const featuresElements = Array.from(selectedElements.FEATURES || []);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FEATURES')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FEATURES')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FEATURES', 'sectionTitle')}]
[Описание раздела ${getWordRange('FEATURES', 'sectionDescription')}]

${featuresElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.NEWS) {
      const newsElements = Array.from(selectedElements.NEWS || []);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('NEWS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('NEWS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('NEWS', 'sectionTitle')}]
[Описание раздела ${getWordRange('NEWS', 'sectionDescription')}]

${newsElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.FAQ) {
      const faqElements = Array.from(selectedElements.FAQ || []);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('FAQ')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('FAQ')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('FAQ', 'sectionTitle')}]
[Описание раздела ${getWordRange('FAQ', 'sectionDescription')}]

${faqElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.TESTIMONIALS) {
      const testimonialsElements = Array.from(selectedElements.TESTIMONIALS || []);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('TESTIMONIALS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('TESTIMONIALS')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('TESTIMONIALS', 'sectionTitle')}]
[Описание раздела ${getWordRange('TESTIMONIALS', 'sectionDescription')}]

ВАЖНО: Создайте минимум 5 отзывов для данного раздела.

${testimonialsElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.UNIVERSAL) {
      const universalElements = Array.from(selectedElements.UNIVERSAL || []);
      
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('UNIVERSAL')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('UNIVERSAL')} (подходящее имя на английском языке, максимум 2 слова)
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]
[Заголовок раздела ${getWordRange('UNIVERSAL', 'sectionTitle')}]
[Описание раздела ${getWordRange('UNIVERSAL', 'sectionDescription')}]

ВАЖНО: Создайте универсальную секцию, которая будет релевантна тематике сайта. Эта секция должна дополнять основной контент и быть полезной для посетителей сайта.

${universalElements.map(element => generateElementPrompt(element)).join('\n\n')}

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    // Стандартные разделы без выбора элементов
    if (settings.includedSections.CONTACTS) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('CONTACTS')} ===
⚠️ ОБЯЗАТЕЛЬНО: NAME PAGE: ${generateNamePage('CONTACTS')} (подходящее имя на английском языке, максимум 2 слова)
Требуемый формат:
1. Первая строка - заголовок "Контакты" (используется язык основного контента)
2. Вторая строка - пустая
3. Третья строка - описание в скобках (должно содержать призыв оставить заявку или связаться, например: "Свяжитесь с нами для получения консультации" или "Оставьте заявку, и мы свяжемся с вами в ближайшее время")
4. Четвертая строка - пустая
5. Далее контактные данные в строгом порядке:
   - Адрес (ОЧЕНЬ ВАЖНО: формат адреса должен строго соответствовать международным стандартам для выбранной страны)
   - Пустая строка
   - Телефон (используйте правильный формат номера для выбранной страны)
   - Пустая строка
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

(Мы ценим каждого клиента и готовы оказать профессиональную поддержку. Свяжитесь с нами для получения консультации или оставьте заявку, и наши специалисты оперативно ответят на все ваши вопросы)

107023, Москва, ул. Большая Семёновская, д. 40, оф. 304

+7 (495) 123-45-67

info@your-law.com

Примечание: 
- Название компании будет автоматически синхронизировано с названием сайта из настроек шапки.
- Email адрес будет автоматически сформирован как info@[название-сайта].com, где [название-сайта] - это транслитерированное название сайта из настроек шапки.

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.MERCI) {
      sectionsPrompt += `=== РАЗДЕЛ: MERCI ===
[Текст сообщения на выбранном языке]
[Текст кнопки на выбранном языке]

Используйте стандартные элементы для сообщения благодарности.

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    if (settings.includedSections.LEGAL) {
      sectionsPrompt += `=== РАЗДЕЛ: ${getSectionNameForPrompt('LEGAL')} ===
NAME PAGE: legal-documents
ID: [название секции на ${languageName}, желательно одно слово или с коротким предлогом, при этом буквы "ID" всегда на английском]

Создайте следующие документы:
1. Политика конфиденциальности (1200-2000 слов)
2. Условия использования (1200-2000 слов)
3. Политика использования файлов cookie (800-1200 слов)

Каждый документ должен быть полным и соответствовать международным стандартам.

=== КОНЕЦ РАЗДЕЛА ===\n\n`;
    }

    sectionsPrompt += `ТРЕБОВАНИЯ:
1. Весь контент на одном языке (указанном в настройках)
2. ID секций: буквы "ID" всегда на английском, название секции после двоеточия - на ${languageName}
3. Не использовать форматирование Markdown/HTML
4. Каждый раздел должен заканчиваться "=== КОНЕЦ РАЗДЕЛА ==="
5. Не пропускать указанные разделы
6. Использовать указанные элементы для каждого раздела
7. Каждый элемент должен начинаться с "ТИП: [название_элемента]"
8. Соблюдать требования к количеству слов для каждого элемента`;
    if (currentStep === 3) {
      sectionsPrompt += `\n\nВАЖНО: Для разделов "Контакты", "Сообщение благодарности" и "Правовые документы" используйте стандартные промпты без выбора элементов.`;
    }

    return sectionsPrompt;
  };

  const generateOptimizedFullSitePromptWithElements = (settings, selectedElements, customPrompts = {}, elementSettings = {}, getSectionLabelFn = null) => {
    console.log('[generateOptimizedFullSitePromptWithElements] Called with selectedElements:', selectedElements);
    console.log('[generateOptimizedFullSitePromptWithElements] Custom prompts count:', Object.keys(customPrompts).length);
    console.log('[generateOptimizedFullSitePromptWithElements] Element settings:', elementSettings);

    // Функция для получения названия раздела для промта
    const getSectionNameForPrompt = (section) => {
      if (getSectionLabelFn) {
        return getSectionLabelFn(section);
      }
      return getSectionLabel(section);
    };
    
    if (selectedElements.GLOBAL && selectedElements.GLOBAL.size > 0) {
      // Если элементы выбраны, используем базовый промпт БЕЗ предустановленных элементов
      console.log('[generateOptimizedFullSitePromptWithElements] Using custom elements, generating basic prompt');
      let basePrompt = generateBasicFullSitePrompt(settings, getSectionLabelFn);
      
      basePrompt += 'AI ЭЛЕМЕНТЫ (ОПТИМИЗИРОВАННЫЙ):\n';
      basePrompt += 'Используйте ВСЕ выбранные элементы минимум 1 раз каждый.\n\n';
      
      basePrompt += 'КРИТИЧЕСКИ ВАЖНО:\n';
      basePrompt += 'ОБЯЗАТЕЛЬНО указывайте ключевое слово "ТИП:" перед каждым элементом!\n';
      basePrompt += 'Каждый элемент ДОЛЖЕН начинаться с "ТИП: [название_элемента]"\n\n';
      
      basePrompt += 'СТРОГИЕ ТРЕБОВАНИЯ К КОЛИЧЕСТВУ СЛОВ:\n';
      basePrompt += '- Проверяйте количество слов, а НЕ символов или строк\n';
      basePrompt += '- Словом считается любое отдельное слово, включая артикли, предлоги, союзы\n';
      basePrompt += '- Тексты с меньшим количеством слов считаются НЕВЕРНЫМИ\n\n';
      
      // Добавляем специальные требования для testimonial-card, если он выбран
      if (isElementSelectedGlobal(selectedElements, 'testimonial-card')) {
        basePrompt += 'КРИТИЧЕСКИ ВАЖНО для testimonial-card:\n';
        basePrompt += 'ОБЯЗАТЕЛЬНО используйте ВСЕ 5 ключей в строгом порядке, разделенных звездочками:\n';
        basePrompt += '[Имя клиента] * [Должность] * [Компания] * [Текст отзыва] * [Рейтинг]\n';
        basePrompt += 'НЕ пропускайте ни одного ключа, даже если информация неизвестна!\n\n';
      }
      
      // Добавляем специальные требования для multiple-cards, если он выбран
      if (isElementSelectedGlobal(selectedElements, 'multiple-cards')) {
        basePrompt += 'КРИТИЧЕСКИ ВАЖНО для multiple-cards:\n';
        basePrompt += 'СОЗДАЙТЕ ТОЧНОЕ количество карточек, указанное в требованиях!\n';
        basePrompt += 'Если указано "5 карточек" - создайте РОВНО 5 карточек\n';
        basePrompt += 'Если указано "3 карточки" - создайте РОВНО 3 карточки\n';
        basePrompt += 'НЕ создавайте больше или меньше карточек!\n';
        basePrompt += 'ФОРМАТ: [заголовок карточки 1] * [содержимое карточки 1] * [заголовок карточки 2] * [содержимое карточки 2] * ...\n';
        basePrompt += 'НЕ указывайте текст "карточка 1:", "карточка 2:", "карточка 3:" и т.д.!\n';
        basePrompt += 'Просто создавайте заголовок и содержимое каждой карточки без нумерации!\n\n';
      }
      
      const selectedElementsArray = Array.from(selectedElements.GLOBAL);
      selectedElementsArray.forEach(elementKey => {
        const element = ELEMENT_PROMPTS[elementKey];
        if (element) {
          // Извлекаем пример из промпта элемента (оптимизированная версия)
          const sourcePrompt = customPrompts[elementKey] || element.fullSitePrompt || element.prompt;
          const promptLines = sourcePrompt.split('\n');
          let example = '';
          let foundExample = false;
          
          for (let line of promptLines) {
            line = line.trim();
            
            // Ищем начало примера
            if (line.includes('ТИП:') && line.includes(elementKey)) {
              foundExample = true;
              example += line + '\n';
              continue;
            }
            
            // Если нашли начало, продолжаем собирать пример
            if (foundExample) {
              if (line.includes('ЗАГОЛОВОК:') || line.includes('СОДЕРЖИМОЕ:') || 
                  line.includes('ФОРМАТ:') || line.includes('НАБОР_ДАННЫХ') ||
                  line.includes('МЕТКИ_ОСИ') || line.includes('ТИП_ВЫНОСКИ:') ||
                  line.includes('ЛИНИЯ_1:') || line.includes('ЛИНИЯ_2:') ||
                  line.includes('СЕРИЯ_1:') || line.includes('СЕРИЯ_2:')) {
                example += line + '\n';
              } else if (line.length === 0) {
                // Пустая строка - конец примера
                break;
              } else if (line.includes('Пример:') || line.includes('ID:')) {
                // Начался новый блок - останавливаемся
                break;
              }
            }
          }
          
          // Если не нашли пример, создаем базовый с учетом настроек
          if (!example.trim()) {
            example = `ТИП: ${elementKey}\n${generateElementRequirements(elementKey, elementSettings)}\n`;
          } else {
            // Если нашли пример, дополняем его требованиями из настроек
            const requirements = generateElementRequirements(elementKey, elementSettings);
            if (requirements) {
              const requirementLines = requirements.split('\n');
              
              // Заменяем только основные поля ЗАГОЛОВОК и СОДЕРЖИМОЕ, сохраняя структуру
              requirementLines.forEach(req => {
                if (req.startsWith('ЗАГОЛОВОК:') && req.includes('минимум')) {
                  example = example.replace(/^ЗАГОЛОВОК: \[.*?\]$/gm, req);
                } else if (req.startsWith('СОДЕРЖИМОЕ:') && req.includes('минимум')) {
                  example = example.replace(/^СОДЕРЖИМОЕ: \[.*?\]$/gm, req);
                }
              });
              
              // Добавляем дополнительные требования в конец
              const additionalReqs = requirementLines.filter(req => req.startsWith('ТРЕБОВАНИЕ:'));
              if (additionalReqs.length > 0) {
                example += '\n' + additionalReqs.join('\n');
              }
            }
          }
          
          basePrompt += example + '\n';
        }
      });
      
      // Функция для получения диапазона слов
      const getWordRange = (section, field) => {
        const range = settings.wordRanges[section]?.[field];
        if (!range) return '';
        return `(${range.min}-${range.max} слов)`;
      };

      // Функция для получения диапазона слов для элементов
      // Список элементов для использования (оптимизированный)
      basePrompt += 'Выбранные элементы: ' + selectedElementsArray.join(', ') + '\n';

      
      return basePrompt;
    } else {
      // Если элементы не выбраны, используем стандартный оптимизированный промпт
      return generateOptimizedFullSitePrompt(settings, getSectionLabelFn);
    }
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
  const handleFullSiteSettingsSave = (settings, promptType = 'full', selectedElements = {}, customPrompts = {}, elementSettings = {}, currentStep = 1, receivedCustomSectionLabels = {}) => {
    console.log('[handleFullSiteSettingsSave] Received selectedElements:', selectedElements);
    console.log('[handleFullSiteSettingsSave] promptType:', promptType);
    console.log('[handleFullSiteSettingsSave] customPrompts:', customPrompts);
    console.log('[handleFullSiteSettingsSave] elementSettings:', elementSettings);
    console.log('[handleFullSiteSettingsSave] receivedCustomSectionLabels:', receivedCustomSectionLabels);
    
    // Обновляем состояние с полученными пользовательскими названиями разделов
    setCustomSectionLabels(receivedCustomSectionLabels);
    
    // Создаем функцию getSectionLabel с актуальными данными
    const getSectionLabelWithData = (section) => {
      return receivedCustomSectionLabels[section] || defaultSectionLabels[section];
    };
    
    setFullSiteSettings(settings);
    
    let finalPrompt = '';
    
    if (promptType === 'legal_only') {
      // Генерируем только промпт для правовых документов
      finalPrompt = applyGlobalSettings(generateLegalDocumentsPrompt());
      setParserMessage('Специализированный промпт для правовых документов скопирован в буфер обмена.');
    } else if (promptType === 'optimized') {
      // Генерируем оптимизированный промпт без правовых документов с учетом выбранных элементов
      console.log('[handleFullSiteSettingsSave] Calling generateOptimizedFullSitePromptWithElements with elements:', Array.from(selectedElements));
      const optimizedPrompt = generateOptimizedFullSitePromptWithElements(settings, selectedElements, customPrompts, elementSettings, getSectionLabelWithData);
      finalPrompt = applyGlobalSettings(optimizedPrompt);
      const totalElements = Object.values(selectedElements).reduce((sum, sectionElements) => sum + (sectionElements?.size || 0), 0);
      setParserMessage(`Оптимизированный промпт полного сайта с ${totalElements} элементами скопирован в буфер обмена.`);
    } else if (promptType === 'manual_elements') {
      // Генерируем промпт с ручным выбором элементов, исключая стандартные разделы
      console.log('[handleFullSiteSettingsSave] Calling generateManualElementsPrompt with elements:', Array.from(selectedElements));
      const manualPrompt = generateManualElementsPrompt(settings, selectedElements, customPrompts, elementSettings, getSectionLabelWithData, defaultSectionLabels);
      finalPrompt = applyGlobalSettings(manualPrompt);
      
      const stepLabels = {
        1: 'Главная + О нас + Преимущества',
        2: 'Новости + Услуги',
        3: 'FAQ + Контакты + Отзывы',
        4: 'Документы + Благодарность + Универсальная'
      };
      
      setParserMessage(`Промпт этапа ${currentStep} (${stepLabels[currentStep]}) скопирован в буфер обмена.`);
    } else {
      // Оригинальный полный промпт (по умолчанию) с учетом выбранных элементов
      console.log('[handleFullSiteSettingsSave] Calling generateFullSitePromptWithElements with elements:', Array.from(selectedElements));
      const fullSitePrompt = generateFullSitePromptWithElements(settings, selectedElements, customPrompts, elementSettings, getSectionLabelWithData);
      finalPrompt = applyGlobalSettings(fullSitePrompt);
      const totalElements = Object.values(selectedElements).reduce((sum, sectionElements) => sum + (sectionElements?.size || 0), 0);
      setParserMessage(`Полный промпт сайта с ${totalElements} элементами скопирован в буфер обмена.`);
    }
    
    // Копируем промпт в буфер обмена
    navigator.clipboard.writeText(finalPrompt)
      .then(() => {
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
    } else if (globalSettings.language) {
      const langObj = LANGUAGES.find(lang => lang.code === globalSettings.language);
      if (langObj) {
        // Извлекаем название языка и код
        languageName = langObj.label.split(' - ')[0]; // Берем русское название до " - "
        language = languageName;
        
        // Извлекаем код языка из строки в формате "Русский - English (en)"
        const codeMatch = langObj.label.match(/\(([a-z]{2})\)/i);
        languageCode = codeMatch ? codeMatch[1].toLowerCase() : '';
      } else {
        languageName = 'русском языке';
        language = languageName;
        languageCode = 'ru';
      }
    } else {
      // Если язык не выбран, используем русский по умолчанию
      languageName = 'русском языке';
      language = languageName;
      languageCode = 'ru';
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
    } else if (newSettings.language) {
      // Извлекаем код языка из объекта языка
      const langObj = LANGUAGES.find(lang => lang.code === newSettings.language);
      if (langObj) {
        const match = langObj.label.match(/\(([a-z]{2})\)/i);
        languageCode = match ? match[1].toLowerCase() : '';
      }
    } else {
      // Если язык не выбран, используем русский по умолчанию
      languageCode = 'ru';
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
    // Нормализуем переносы строк и убираем экранирование
    const normalizedText = e.target.value
      .replace(/\r\n/g, '\n')
      .replace(/\\===/g, '==='); // Убираем экранирование разделителей
    setContent(normalizedText);
  };

  // Очищаем Markdown при вставке текста и нормализуем переносы строк
  const handleTextPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    
    // Нормализуем переносы строк в вставленном тексте и убираем экранирование
    const normalizedText = pastedText
      .replace(/\r\n/g, '\n')  // Заменяем CRLF на LF
      .replace(/\r/g, '\n')   // Заменяем CR на LF
      .replace(/\\===/g, '==='); // Убираем экранирование разделителей
    
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

  // Функция для сканирования и группировки всех элементов
  const handleScanElementsWithSelection = () => {
    try {
      console.log('🔍 [AI Дизайн Система] Начинаем сканирование элементов для выбора...');
      
      const allElements = [];
      const groups = {
        'Текстовые элементы': [],
        'Списки и цитаты': [],
        'Блоки и карточки': [],
        'Специальные элементы': []
      };
      
      // Сканируем все секции
      Object.entries(sectionsData).forEach(([sectionKey, sectionData]) => {
        console.log(`🔍 [DEBUG] Сканируем секцию: ${sectionKey}`, sectionData);
        if (sectionData?.elements && Array.isArray(sectionData.elements)) {
          sectionData.elements.forEach((element, elementIndex) => {
            const elementData = {
              id: `${sectionKey}_${elementIndex}`,
              sectionKey,
              elementIndex,
              type: element.type,
              title: element.title || element.text || element.content || `${element.type} #${elementIndex + 1}`,
              sectionTitle: sectionData.title || sectionKey,
              currentStyles: element.colorSettings || {},
              element: element
            };
            
            console.log(`🔍 [DEBUG] Найден элемент: ${elementData.id} (${elementData.type}) - ${elementData.title}`);
            allElements.push(elementData);
            
            // Группируем по типам
            switch (element.type) {
              case 'typography':
              case 'rich-text':
              case 'gradient-text':
              case 'typewriter-text':
              case 'highlight-text':
                groups['Текстовые элементы'].push(elementData);
                break;
              case 'list':
              case 'blockquote':
                groups['Списки и цитаты'].push(elementData);
                break;
              case 'callout':
              case 'basic-card':
              case 'multiple-cards':
              case 'testimonial-card':
                groups['Блоки и карточки'].push(elementData);
                break;
              case 'animated-counter':
                groups['Специальные элементы'].push(elementData);
                break;
              default:
                groups['Специальные элементы'].push(elementData);
            }
          });
        }
      });
      
      // Сортируем элементы по порядку: сначала по секциям, потом по индексу
      const sortedElements = allElements.sort((a, b) => {
        // Сначала сортируем по названию секции
        if (a.sectionKey !== b.sectionKey) {
          return a.sectionKey.localeCompare(b.sectionKey);
        }
        // Потом по индексу элемента в секции
        return a.elementIndex - b.elementIndex;
      });
      
      // Пересортируем группы с учетом порядка
      const sortedGroups = {};
      Object.keys(groups).forEach(groupName => {
        sortedGroups[groupName] = groups[groupName].sort((a, b) => {
          if (a.sectionKey !== b.sectionKey) {
            return a.sectionKey.localeCompare(b.sectionKey);
          }
          return a.elementIndex - b.elementIndex;
        });
      });
      
      setScannedElements(sortedElements);
      setElementGroups(sortedGroups);
      setShowElementSelector(true);
      setSelectedElements(new Set()); // Очищаем выбор
      
      console.log(`🔍 Найдено ${sortedElements.length} элементов, сгруппированы в ${Object.keys(sortedGroups).length} категории`);
      console.log(`🔍 Элементы отсортированы по порядку:`, sortedElements.map(el => `${el.sectionKey}_${el.elementIndex} (${el.type})`));
      
    } catch (error) {
      console.error('❌ [AI Дизайн Система] Ошибка при сканировании элементов:', error);
    }
  };

  // Функция для переключения выбора элемента
  const toggleElementSelection = (elementId) => {
    setSelectedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      return newSet;
    });
  };

  // Функция для выбора всех элементов в группе
  const toggleGroupSelection = (groupName) => {
    const groupElements = elementGroups[groupName] || [];
    const groupIds = groupElements.map(el => el.id);
    const allSelected = groupIds.every(id => selectedElements.has(id));
    
    setSelectedElements(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Убираем все элементы группы
        groupIds.forEach(id => newSet.delete(id));
      } else {
        // Добавляем все элементы группы
        groupIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  // Функция для генерации реальных цветов для JSON с учетом количества столбцов для bar-chart и advanced-line-chart
  const getRealColorsForElementWithColumns = (elementType, element) => {
    if (elementType === 'bar-chart') {
      // Определяем количество столбцов из данных элемента
      const barData = (element.data && element.data.data && Array.isArray(element.data.data.data)) ? element.data.data.data :
                     (element.data && Array.isArray(element.data.data)) ? element.data.data :
                     Array.isArray(element.data) ? element.data : [];
      
      const columnCount = barData.length || 8; // По умолчанию 8 столбцов
      
      // Генерируем цвета для каждого столбца
      const generateChartColors = (count) => {
        const baseColors = [
          '#8b0000', '#a52a2a', '#b22222', '#dc143c', '#ff0000', 
          '#ff4500', '#ff6347', '#ff7f50', '#ffa500', '#ffd700',
          '#ffff00', '#adff2f', '#00ff00', '#00fa9a', '#00ced1',
          '#00bfff', '#1e90ff', '#4169e1', '#8a2be2', '#9370db'
        ];
        
        const chartColors = {};
        const colorNames = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary', 'octonary', 'nonary', 'denary', 'undenary', 'duodenary', 'tridenary', 'quattuordenary', 'quindenary', 'sexdenary', 'septendenary', 'octodenary', 'novemdenary', 'vigenary'];
        
        for (let i = 0; i < count; i++) {
          const colorName = colorNames[i] || `color${i + 1}`;
          chartColors[colorName] = baseColors[i % baseColors.length];
        }
        
        return chartColors;
      };
      
      // Получаем базовую схему цветов
      const scheme = {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { 
          title: '#00d4ff', 
          text: '#ffffff', 
          content: '#e0e0e0',
          description: '#e0e0e0',
          axisLabel: '#00d4ff',
          dataLabel: '#ffffff',
          legendText: '#00d4ff'
        },
        chartColors: generateChartColors(columnCount),
        borderSettings: { enabled: true, color: '#00d4ff', width: 2, style: 'solid' },
        gridSettings: { enabled: true, color: '#00d4ff', width: 1, style: 'dashed' },
        animationSettings: { enabled: true, duration: 1000, easing: 'ease-out', delay: 100 }
      };
      
      const baseResult = {
        sectionBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        textFields: {
          ...scheme.textFields,
          fontSize: '16px'
        },
        chartColors: scheme.chartColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 2,
        borderRadius: 12,
        padding: 24,
        boxShadow: true
      };
      
      return baseResult;
    }
    
    if (elementType === 'advanced-line-chart') {
      // Определяем количество линий из данных элемента
      const lineData = (element.data && element.data.data && Array.isArray(element.data.data.data)) ? element.data.data.data :
                     (element.data && Array.isArray(element.data.data)) ? element.data.data :
                     Array.isArray(element.data) ? element.data : [];
      
      const lineCount = Math.max(2, lineData.length > 0 ? 2 : 2); // Минимум 2 линии для линейного графика
      
      // Генерируем цвета для каждой линии с нашими новыми цветами
      const generateLineColors = (count) => {
        const baseColors = [
          '#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#3b82f6', 
          '#8b5cf6', '#ec4899', '#ef4444', '#ffa500', '#ffd700',
          '#ffff00', '#adff2f', '#00ff00', '#00fa9a', '#00ced1',
          '#00bfff', '#1e90ff', '#4169e1', '#8a2be2', '#9370db'
        ];
        
        const lineColors = {};
        const colorNames = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary', 'octonary', 'nonary', 'denary', 'undenary', 'duodenary', 'tridenary', 'quattuordenary', 'quindenary', 'sexdenary', 'septendenary', 'octodenary', 'novemdenary', 'vigenary'];
        
        for (let i = 0; i < count; i++) {
          const colorName = colorNames[i] || `color${i + 1}`;
          lineColors[colorName] = baseColors[i % baseColors.length];
        }
        
        return lineColors;
      };
      
      // Получаем базовую схему цветов с нашими новыми цветами
      const scheme = {
        background: { gradientColor1: '#0d4f3c', gradientColor2: '#1a5f4a' },
        textFields: { 
          title: '#00ff88', 
          text: '#ffffff', 
          content: '#e8f5e8',
          description: '#e8f5e8',
          axisLabel: '#00ff88',
          dataLabel: '#ffffff',
          legendText: '#ffff00',
          grid: '#ff4444',
          legend: '#ffff00',
          axis: '#ff4444'
        },
        lineColors: generateLineColors(lineCount),
        borderSettings: { enabled: true, color: '#00ff88', width: 2, style: 'solid' },
        gridSettings: { enabled: true, color: '#ff4444', width: 1, style: 'dotted' },
        animationSettings: { enabled: true, duration: 1200, easing: 'ease-in-out', delay: 200 }
      };
      
      const baseResult = {
        sectionBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        textFields: {
          ...scheme.textFields,
          fontSize: '16px'
        },
        lineColors: scheme.lineColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 2,
        borderRadius: 12,
        padding: 24,
        boxShadow: true
      };
      
      return baseResult;
    }
    
    if (elementType === 'advanced-pie-chart') {
      // Определяем количество сегментов из данных элемента
      const pieData = (element.data && element.data.data && Array.isArray(element.data.data.data)) ? element.data.data.data :
                     (element.data && Array.isArray(element.data.data)) ? element.data.data :
                     Array.isArray(element.data) ? element.data : [];
      
      const segmentCount = pieData.length || 5; // По умолчанию 5 сегментов
      console.log('🔥 [getRealColorsForElementWithColumns] advanced-pie-chart: найдено сегментов:', segmentCount);
      console.log('🔥 [getRealColorsForElementWithColumns] pieData:', pieData);
      
      // Генерируем цвета для каждого сегмента
      const generateSegmentColors = (count) => {
        const baseColors = [
          '#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#3b82f6', 
          '#8b5cf6', '#ec4899', '#ef4444', '#ffa500', '#ffd700',
          '#ffff00', '#adff2f', '#00ff00', '#00fa9a', '#00ced1',
          '#00bfff', '#1e90ff', '#4169e1', '#8a2be2', '#9370db'
        ];
        
        const segmentColors = {};
        
        for (let i = 0; i < count; i++) {
          const segmentKey = `segment${i + 1}`;
          segmentColors[segmentKey] = baseColors[i % baseColors.length];
        }
        
        console.log('🔥 [generateSegmentColors] Сгенерированы цвета для сегментов:', segmentColors);
        return segmentColors;
      };
      
      // Получаем базовую схему цветов с нашими новыми цветами
      const scheme = {
        background: { gradientColor1: '#0d4f3c', gradientColor2: '#1a5f4a' },
        textFields: { 
          title: '#00ff88', 
          text: '#ffffff', 
          content: '#e8f5e8',
          description: '#e8f5e8',
          axisLabel: '#00ff88',
          dataLabel: '#ffffff',
          legendText: '#ffff00',
          fontSize: '16px'
        },
        segmentColors: generateSegmentColors(segmentCount),
        borderSettings: { enabled: true, color: '#00ff88', width: 2, style: 'solid' },
        gridSettings: { enabled: true, color: '#ff4444', width: 1, style: 'dotted' },
        animationSettings: { enabled: true, duration: 1200, easing: 'ease-in-out', delay: 200 }
      };
      
      const baseResult = {
        sectionBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        textFields: {
          ...scheme.textFields
        },
        segmentColors: scheme.segmentColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 2,
        borderRadius: 12,
        padding: 25,
        boxShadow: true
      };
      
      return baseResult;
    }
    
    if (elementType === 'advanced-area-chart') {
      // Определяем количество областей из данных элемента
      const areaData = (element.data && element.data.data && Array.isArray(element.data.data.data)) ? element.data.data.data :
                     (element.data && Array.isArray(element.data.data)) ? element.data.data :
                     Array.isArray(element.data) ? element.data : [];
      
      const areaCount = areaData.length || 2; // По умолчанию 2 области
      console.log('🔥 [getRealColorsForElementWithColumns] advanced-area-chart: найдено областей:', areaCount);
      console.log('🔥 [getRealColorsForElementWithColumns] areaData:', areaData);
      
      // Генерируем цвета для каждой области
      const generateAreaColors = (count) => {
        const baseColors = [
          '#ff6b35', '#f7931e', '#ffd23f', '#06ffa5', '#3b82f6', 
          '#8b5cf6', '#ec4899', '#ef4444', '#ffa500', '#ffd700',
          '#ffff00', '#adff2f', '#00ff00', '#00fa9a', '#00ced1',
          '#00bfff', '#1e90ff', '#4169e1', '#8a2be2', '#9370db'
        ];
        
        const areaColors = {};
        
        for (let i = 0; i < count; i++) {
          const areaKey = `area${i + 1}`;
          areaColors[areaKey] = baseColors[i % baseColors.length];
        }
        
        console.log('🔥 [generateAreaColors] Сгенерированы цвета для областей:', areaColors);
        return areaColors;
      };
      
      // Получаем базовую схему цветов с нашими новыми цветами
      const scheme = {
        background: { gradientColor1: '#0d4f3c', gradientColor2: '#1a5f4a' },
        textFields: { 
          title: '#00ff88', 
          text: '#ffffff', 
          content: '#e8f5e8',
          description: '#e8f5e8',
          axisLabel: '#00ff88',
          dataLabel: '#ffffff',
          legendText: '#ffff00',
          fontSize: '16px'
        },
        areaColors: generateAreaColors(areaCount),
        borderSettings: { enabled: true, color: '#00ff88', width: 2, style: 'solid' },
        gridSettings: { enabled: true, color: '#ff4444', width: 1, style: 'dotted' },
        animationSettings: { enabled: true, duration: 1200, easing: 'ease-in-out', delay: 200 }
      };
      
      const baseResult = {
        sectionBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        textFields: {
          ...scheme.textFields
        },
        areaColors: scheme.areaColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 2,
        borderRadius: 12,
        padding: 25,
        boxShadow: true
      };
      
      return baseResult;
    }
    
    return getRealColorsForElement(elementType);
  };

  // Функция для генерации реальных цветов для JSON
  const getRealColorsForElement = (elementType) => {
    const colorSchemes = {
      'typography': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { title: '#00d4ff', text: '#ffffff', content: '#e0e0e0', link: '#ff6b6b', code: '#facc15', heading: '#00d4ff', paragraph: '#ffffff' }
      },
      'rich-text': {
        background: { gradientColor1: '#2d1b69', gradientColor2: '#11998e' },
        textFields: { title: '#ffffff', text: '#ffffff', content: '#ffffff', h1: '#00d4ff', h2: '#ff6b6b', h3: '#facc15', h4: '#00d4ff', h5: '#ff6b6b', h6: '#facc15', p: '#ffffff', li: '#e0e0e0', a: '#00d4ff', strong: '#ff6b6b', em: '#facc15', code: '#00d4ff' }
      },
      'blockquote': {
        background: { gradientColor1: '#8e2de2', gradientColor2: '#4a00e0' },
        textFields: { title: '#ffffff', text: '#ffffff', content: '#ffffff', quote: '#facc15', author: '#00d4ff', citation: '#ff6b6b' }
      },
      'list': {
        background: { gradientColor1: '#ff6b6b', gradientColor2: '#4ecdc4' },
        textFields: { title: '#ffffff', text: '#ffffff', content: '#ffffff', listItem: '#ffffff', item: '#ffffff', bullet: '#facc15', marker: '#facc15' }
      },
      'callout': {
        background: { gradientColor1: '#667eea', gradientColor2: '#764ba2' },
        textFields: { title: '#ffffff', text: '#ffffff', content: '#ffffff', icon: '#facc15', type: '#facc15', border: '#facc15', footnote: '#facc15' }
      },
      'gradient-text': {
        background: { gradientColor1: '#FFFFFF', gradientColor2: '#808080' },
        textFields: { title: '#FFFF00', text: '#FFFF00', content: '#FFFF00', gradientStart: '#FFFF00', gradientEnd: '#000000' },
        textGradient: { enabled: true, gradientStart: '#FFFF00', gradientEnd: '#000000', gradientDirection: 'to right' }
      },
      'animated-counter': {
        background: { gradientColor1: '#ff9a9e', gradientColor2: '#fad0c4' },
        textFields: { title: '#ffffff', text: '#ffffff', content: '#ffffff', number: '#facc15', label: '#00d4ff' }
      },
      'typewriter-text': {
        background: { gradientColor1: '#c2ffd8', gradientColor2: '#465efb' },
        textFields: { title: '#ffffff', text: '#ffffff', content: '#ffffff', cursor: '#facc15' }
      },
      'highlight-text': {
        background: { gradientColor1: '#c9ffbf', gradientColor2: '#ffafbd' },
        textFields: { title: '#1a1a2e', text: '#1a1a2e', content: '#1a1a2e', highlight: '#facc15' }
      },
      'testimonial-card': {
        background: { gradientColor1: '#4158d0', gradientColor2: '#c850c0' },
        textFields: { name: '#1976d2', role: '#FF0000', company: '#888888', content: '#333333', rating: '#ffc107' }
      },
      'multiple-cards': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#16213e' },
        cardBackground: { 
          enabled: true, 
          useGradient: true, 
          solidColor: '#0a0a0f', 
          gradientColor1: '#0a0a0f', 
          gradientColor2: '#1a1a2e', 
          gradientDirection: 'to bottom right', 
          opacity: 1 
        },
        textFields: { 
          title: '#00d4ff', 
          text: '#ff6b6b', 
          description: '#facc15',
          cardTitle: '#c2185b',
          cardText: '#facc15',
          cardContent: '#4ecdc4'
        }
      },
      'faq-section': {
        background: { gradientColor1: '#ff6b6b', gradientColor2: '#4ecdc4' },
        textFields: { 
          title: '#ffffff', 
          text: '#ffffff', 
          content: '#ffffff',
          question: '#facc15',
          answer: '#00d4ff',
          heading: '#ffffff',
          paragraph: '#ffffff',
          faqTitle: '#ffffff',
          questionText: '#facc15',
          answerText: '#00d4ff',
          icon: '#ff6b6b',
          accordionIcon: '#ff6b6b',
          accordionBg: '#2d1b69',
          accordionHover: '#4ecdc4'
        }
      },
      'timeline-component': {
        background: { gradientColor1: '#667eea', gradientColor2: '#764ba2' },
        textFields: { 
          title: '#ffffff', 
          text: '#ffffff', 
          content: '#ffffff',
          date: '#facc15',
          line: '#00d4ff',
          completed: '#4caf50',
          inProgress: '#ff9800',
          pending: '#2196f3'
        }
      },
      'basic-card': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { 
          title: '#00d4ff', 
          text: '#ffffff', 
          content: '#e0e0e0',
          link: '#ff6b6b',
          code: '#facc15',
          heading: '#00d4ff',
          paragraph: '#ffffff',
          background: '#ff00ff',
          border: '#00ffff'
        }
      },
      'progress-bars': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { 
          title: '#00d4ff', 
          text: '#ffffff', 
          content: '#e0e0e0',
          background: '#e0e0e0',
          progress: '#ff6b6b'
        }
      },
      'data-table': {
        background: { gradientColor1: '#0a0a0f', gradientColor2: '#1a1a2e' },
        textFields: { 
          title: '#00d4ff', 
          text: '#e0e0e0', 
          content: '#b0b0b0',
          headerBg: '#1a1a2e',
          headerText: '#00d4ff',
          rowBg: '#0f0f23',
          border: '#2d2d5a',
          hover: '#1e1e3f',
          cellText: '#ffffff'
        }
      },
      'image-gallery': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { 
          title: '#00d4ff', 
          text: '#ffffff', 
          content: '#e0e0e0',
          description: '#e0e0e0',
          background: '#ffffff',
          border: '#ff6b6b',
          navigation: '#facc15',
          pagination: '#00d4ff',
          overlay: '#000000'
        }
      },
      'accordion': {
        background: { gradientColor1: '#c41e3a', gradientColor2: '#ffd700' },
        textFields: { 
          title: '#ffd700', 
          text: '#ffffff', 
          content: '#ffffff',
          background: '#000000',
          border: '#c41e3a',
          hover: '#4ecdc4'
        }
      },
      'bar-chart': {
        background: { gradientColor1: '#000000', gradientColor2: '#1a237e' },
        textFields: { 
          title: '#ff0000', 
          text: '#ff0000', 
          content: '#ff0000',
          description: '#ff0000',
          axisLabel: '#ff0000',
          dataLabel: '#ff0000',
          legendText: '#ff0000' // Применяется к описанию секции
        },
        chartColors: {
          primary: '#8b0000',
          secondary: '#a52a2a',
          tertiary: '#b22222',
          quaternary: '#dc143c',
          quinary: '#ff0000',
          senary: '#ff4500',
          septenary: '#ff6347',
          octonary: '#ff7f50'
        },
        borderSettings: {
          enabled: true,
          color: '#ff0000',
          width: 2,
          style: 'solid'
        },
        gridSettings: {
          enabled: true,
          color: '#ff0000',
          width: 1,
          style: 'dashed'
        },
        animationSettings: {
          enabled: true,
          duration: 1000,
          easing: 'ease-out',
          delay: 100
        }
      },
      'advanced-line-chart': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { 
          title: '#00d4ff', 
          text: '#ffffff', 
          content: '#e0e0e0',
          description: '#e0e0e0',
          axisLabel: '#00d4ff',
          dataLabel: '#ffffff',
          legendText: '#00d4ff' // Применяется к описанию секции
        },
        lineColors: {
          primary: '#8884d8',
          secondary: '#82ca9d',
          tertiary: '#ffc658',
          quaternary: '#ff7300',
          quinary: '#0088fe',
          senary: '#00c49f',
          septenary: '#ffbb28',
          octonary: '#ff8042'
        },
        borderSettings: { enabled: true, color: '#00d4ff', width: 2, style: 'solid' },
        gridSettings: { enabled: true, color: '#00d4ff', width: 1, style: 'dashed' },
        animationSettings: { enabled: true, duration: 1000, easing: 'ease-out', delay: 100 }
      },
      'advanced-area-chart': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#8b0000' },
        textFields: { 
          title: '#ffd700', 
          text: '#ffffff', 
          content: '#ffcccb',
          description: '#ffcccb',
          axisLabel: '#ffa500',
          dataLabel: '#ffffff',
          legendText: '#ff69b4',
          grid: '#ff0000',
          axis: '#ffa500'
        },
        areaColors: {
          area1: '#32cd32',
          area2: '#ff6347'
        },
        borderSettings: { enabled: true, color: '#ff0000', width: 2, style: 'solid' },
        gridSettings: { enabled: true, color: '#ff0000', width: 1, style: 'dotted' },
        animationSettings: { enabled: true, duration: 1500, easing: 'ease-in-out', delay: 200 }
      },
      'cta-section': {
        background: { gradientColor1: '#1a1a2e', gradientColor2: '#0f3460' },
        textFields: { 
          title: '#00d4ff', 
          description: '#ffffff', 
          background: '#1a1a2e',
          border: 'transparent',
          button: '#ff6b6b',
          buttonText: '#ffffff',
          buttonBorderRadius: 8
        }
      }
    };

    const scheme = colorSchemes[elementType] || colorSchemes['typography'];
    
    const baseResult = {
      sectionBackground: {
        enabled: true,
        useGradient: true,
        solidColor: scheme.background.gradientColor1,
        gradientColor1: scheme.background.gradientColor1,
        gradientColor2: scheme.background.gradientColor2,
        gradientDirection: 'to right',
        opacity: 1
      },
      padding: 24,
      textFields: {
        ...scheme.textFields,
        fontSize: elementType === 'animated-counter' ? '20px' : 
                 elementType === 'typography' || elementType === 'gradient-text' || elementType === 'blockquote' ? '18px' : '16px'
      }
    };

    // Добавляем специальные поля для bar-chart
    if (elementType === 'bar-chart') {
      return {
        ...baseResult,
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        chartColors: scheme.chartColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 2,
        borderRadius: 12,
        boxShadow: true
      };
    }

    // Добавляем специальные поля для multiple-cards
    if (elementType === 'multiple-cards') {
      return {
        ...baseResult,
        cardBackground: scheme.cardBackground || {
          enabled: true,
          useGradient: true,
          solidColor: '#0a0a0f',
          gradientColor1: '#0a0a0f',
          gradientColor2: '#1a1a2e',
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        borderWidth: 1,
        borderRadius: 8,
        boxShadow: true
      };
    }

    // Добавляем специальные поля для advanced-line-chart
    if (elementType === 'advanced-line-chart') {
      return {
        ...baseResult,
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom right',
          opacity: 1
        },
        lineColors: scheme.lineColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 2,
        borderRadius: 12,
        boxShadow: true
      };
    }

    // Добавляем специальные поля для advanced-area-chart
    if (elementType === 'advanced-area-chart') {
      return {
        ...baseResult,
        sectionBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom',
          opacity: 1
        },
        chartBackground: {
          enabled: true,
          useGradient: true,
          solidColor: scheme.background.gradientColor1,
          gradientColor1: scheme.background.gradientColor1,
          gradientColor2: scheme.background.gradientColor2,
          gradientDirection: 'to bottom',
          opacity: 1
        },
        areaColors: scheme.areaColors,
        borderSettings: scheme.borderSettings,
        gridSettings: scheme.gridSettings,
        animationSettings: scheme.animationSettings,
        borderWidth: 3,
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 20px 60px rgba(255, 0, 0, 0.25), 0 0 0 1px rgba(255, 0, 0, 0.15)"
      };
    }

    return baseResult;
  };

  // Функция для создания шаблона colorSettings для разных типов элементов
  const getColorSettingsTemplate = (elementType) => {
    switch (elementType) {
      case 'typography':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          link: '#EXAMPLE_COLOR',
          code: '#EXAMPLE_COLOR',
          heading: '#EXAMPLE_COLOR',
          paragraph: '#EXAMPLE_COLOR',
          fontSize: '18px'
        };
      
      case 'rich-text':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          h1: '#EXAMPLE_COLOR',
          h2: '#EXAMPLE_COLOR',
          h3: '#EXAMPLE_COLOR',
          h4: '#EXAMPLE_COLOR',
          h5: '#EXAMPLE_COLOR',
          h6: '#EXAMPLE_COLOR',
          p: '#EXAMPLE_COLOR',
          li: '#EXAMPLE_COLOR',
          a: '#EXAMPLE_COLOR',
          strong: '#EXAMPLE_COLOR',
          em: '#EXAMPLE_COLOR',
          code: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'list':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          listItem: '#EXAMPLE_COLOR',
          item: '#EXAMPLE_COLOR',
          bullet: '#EXAMPLE_COLOR',
          marker: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'blockquote':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          quote: '#EXAMPLE_COLOR',
          author: '#EXAMPLE_COLOR',
          citation: '#EXAMPLE_COLOR',
          fontSize: '18px'
        };
      
      case 'callout':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          icon: '#EXAMPLE_COLOR',
          type: '#EXAMPLE_COLOR',
          border: '#EXAMPLE_COLOR',
          footnote: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'basic-card':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          cardTitle: '#EXAMPLE_COLOR',
          cardText: '#EXAMPLE_COLOR',
          cardBackground: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'multiple-cards':
        return {
          sectionBackground: {
            enabled: true,
            useGradient: true,
            solidColor: '#2d5016',
            gradientColor1: '#2d5016',
            gradientColor2: '#000000',
            gradientDirection: 'to bottom',
            opacity: 1
          },
          cardBackground: {
            enabled: true,
            useGradient: true,
            solidColor: '#000000',
            gradientColor1: '#000000',
            gradientColor2: '#8b0000',
            gradientDirection: 'to bottom right',
            opacity: 1
          },
          textFields: {
            title: '#ffff00',
            text: '#8a2be2',
            description: '#8a2be2',
            cardTitle: '#800080',
            cardText: '#ff4500',
            cardContent: '#ff4500',
            border: '#800080',
            fontSize: '16px'
          },
          borderWidth: 2,
          borderRadius: 8,
          padding: 24
        };
      
      case 'gradient-text':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          gradientStart: '#EXAMPLE_COLOR',
          gradientEnd: '#EXAMPLE_COLOR',
          fontSize: '18px'
        };
      
      case 'animated-counter':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          number: '#EXAMPLE_COLOR',
          label: '#EXAMPLE_COLOR',
          fontSize: '20px'
        };
      
      case 'typewriter-text':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          cursor: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'highlight-text':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          highlight: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'testimonial-card':
        return {
          name: '#EXAMPLE_COLOR',
          role: '#EXAMPLE_COLOR',
          company: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          rating: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'faq-section':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          question: '#EXAMPLE_COLOR',
          answer: '#EXAMPLE_COLOR',
          heading: '#EXAMPLE_COLOR',
          paragraph: '#EXAMPLE_COLOR',
          faqTitle: '#EXAMPLE_COLOR',
          questionText: '#EXAMPLE_COLOR',
          answerText: '#EXAMPLE_COLOR',
          icon: '#EXAMPLE_COLOR',
          accordionIcon: '#EXAMPLE_COLOR',
          accordionBg: '#EXAMPLE_COLOR',
          accordionHover: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'timeline-component':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          date: '#EXAMPLE_COLOR',
          line: '#EXAMPLE_COLOR',
          completed: '#EXAMPLE_COLOR',
          inProgress: '#EXAMPLE_COLOR',
          pending: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'basic-card':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          link: '#EXAMPLE_COLOR',
          code: '#EXAMPLE_COLOR',
          heading: '#EXAMPLE_COLOR',
          paragraph: '#EXAMPLE_COLOR',
          background: '#EXAMPLE_COLOR',
          border: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'progress-bars':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          background: '#EXAMPLE_COLOR',
          progress: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'data-table':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          headerBg: '#EXAMPLE_COLOR',
          headerText: '#EXAMPLE_COLOR',
          rowBg: '#EXAMPLE_COLOR',
          border: '#EXAMPLE_COLOR',
          hover: '#EXAMPLE_COLOR',
          cellText: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'image-gallery':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          description: '#EXAMPLE_COLOR',
          background: '#EXAMPLE_COLOR',
          border: '#EXAMPLE_COLOR',
          navigation: '#EXAMPLE_COLOR',
          pagination: '#EXAMPLE_COLOR',
          overlay: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'accordion':
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          background: '#EXAMPLE_COLOR',
          border: '#EXAMPLE_COLOR',
          hover: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
      
      case 'bar-chart':
        return {
          sectionBackground: {
            enabled: true,
            useGradient: true,
            solidColor: '#000000',
            gradientColor1: '#000000',
            gradientColor2: '#1a237e',
            gradientDirection: 'to bottom',
            opacity: 1
          },
          chartBackground: {
            enabled: true,
            useGradient: true,
            solidColor: '#000000',
            gradientColor1: '#000000',
            gradientColor2: '#1a237e',
            gradientDirection: 'to bottom right',
            opacity: 1
          },
          textFields: {
            title: '#ff0000',
            text: '#ff0000',
            description: '#ff0000',
            axisLabel: '#ff0000',
            dataLabel: '#ff0000',
            legendText: '#ff0000', // Применяется к описанию секции
            fontSize: '16px'
          },
          chartColors: {
            primary: '#ff0000',
            secondary: '#ff3333',
            tertiary: '#ff6666',
            quaternary: '#ff9999',
            quinary: '#ffcccc',
            senary: '#ff4444',
            septenary: '#ff7777',
            octonary: '#ffaaaa'
          },
          borderSettings: {
            enabled: true,
            color: '#ff0000',
            width: 2,
            style: 'solid'
          },
          gridSettings: {
            enabled: true,
            color: '#ff0000',
            width: 1,
            style: 'dashed'
          },
          animationSettings: {
            enabled: true,
            duration: 1000,
            easing: 'ease-out',
            delay: 100
          },
          borderWidth: 2,
          borderRadius: 12,
          padding: 24,
          boxShadow: true
        };
      
      case 'advanced-area-chart':
        return {
          sectionBackground: {
            enabled: true,
            useGradient: true,
            solidColor: '#1a1a2e',
            gradientColor1: '#1a1a2e',
            gradientColor2: '#8b0000',
            gradientDirection: 'to bottom',
            opacity: 1
          },
          padding: 32,
          textFields: {
            title: '#ffd700',
            text: '#ffffff',
            content: '#ffcccb',
            description: '#ffcccb',
            axisLabel: '#ffa500',
            dataLabel: '#ffffff',
            legendText: '#ff69b4',
            fontSize: '16px',
            grid: '#ff0000',
            axis: '#ffa500'
          },
          chartBackground: {
            enabled: true,
            useGradient: true,
            solidColor: '#1a1a2e',
            gradientColor1: '#1a1a2e',
            gradientColor2: '#8b0000',
            gradientDirection: 'to bottom',
            opacity: 1
          },
          areaColors: {
            area1: '#32cd32',
            area2: '#ff6347'
          },
          borderSettings: {
            enabled: true,
            color: '#ff0000',
            width: 2,
            style: 'solid'
          },
          gridSettings: {
            enabled: true,
            color: '#ff0000',
            width: 1,
            style: 'dotted'
          },
          animationSettings: {
            enabled: true,
            duration: 1500,
            easing: 'ease-in-out',
            delay: 200
          },
          borderWidth: 3,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(255, 0, 0, 0.25), 0 0 0 1px rgba(255, 0, 0, 0.15)'
        };
      
      case 'cta-section':
        return {
          title: '#EXAMPLE_COLOR',
          description: '#EXAMPLE_COLOR',
          background: '#EXAMPLE_COLOR',
          border: '#EXAMPLE_COLOR',
          button: '#EXAMPLE_COLOR',
          buttonText: '#EXAMPLE_COLOR',
          buttonBorderRadius: 8,
          fontSize: '16px'
        };
      
      default:
        return {
          title: '#EXAMPLE_COLOR',
          text: '#EXAMPLE_COLOR',
          content: '#EXAMPLE_COLOR',
          fontSize: '16px'
        };
    }
  };

  // Функция для создания JSON только для выбранных элементов
  const generateSelectedElementsJSON = () => {
    try {
      if (selectedElements.size === 0) {
        alert('Выберите хотя бы один элемент!');
        return;
      }

      console.log('🔍 [DEBUG] Выбранные элементы ID:', Array.from(selectedElements));
      console.log('🔍 [DEBUG] Все отсканированные элементы:', scannedElements);
      
      const selectedElementsData = scannedElements.filter(el => selectedElements.has(el.id));
      console.log('🔍 [DEBUG] Найденные данные для выбранных элементов:', selectedElementsData);
      
      const designSystem = {
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          description: `Дизайн-система для ${selectedElements.size} выбранных элементов`
        },
        sections: {}
      };

      // Группируем выбранные элементы по секциям
      selectedElementsData.forEach(elementData => {
        const { sectionKey, elementIndex, element } = elementData;
        
        if (!designSystem.sections[sectionKey]) {
          designSystem.sections[sectionKey] = {
            elements: []
          };
        }

        // Создаем упрощенную структуру элемента только со стилями
        const elementForJSON = {
          type: element.type,
          colorSettings: jsonMode === 'template' ? 
            (element.type === 'multiple-cards' ? getColorSettingsTemplate(element.type) : {
              sectionBackground: {
                enabled: true,
                useGradient: false,
                solidColor: '#EXAMPLE_COLOR',
                gradientColor1: '#EXAMPLE_COLOR',
                gradientColor2: '#EXAMPLE_COLOR',
                gradientDirection: 'to bottom right',
                opacity: 1
              },
              padding: 24,
              textFields: getColorSettingsTemplate(element.type)
            }) : (element.type === 'bar-chart' || element.type === 'advanced-line-chart' || element.type === 'advanced-pie-chart' ? getRealColorsForElementWithColumns(element.type, element) : getRealColorsForElement(element.type))
        };

        designSystem.sections[sectionKey].elements.push(elementForJSON);
      });

      const jsonString = JSON.stringify(designSystem, null, 2);
      
      // Добавляем требования к стилю перед JSON только если они заданы
      const jsonWithStyleRequirements = jsonPromptDescription && jsonPromptDescription.trim() 
        ? `${jsonPromptDescription}\n\nJSON для элементов:\n${jsonString}`
        : jsonString;
      
      // Копируем в буфер обмена
      navigator.clipboard.writeText(jsonWithStyleRequirements).then(() => {
        // Отмечаем элементы как обработанные
        setProcessedElements(prev => {
          const newSet = new Set(prev);
          selectedElements.forEach(id => newSet.add(id));
          return newSet;
        });
        
        // Добавляем в историю обработки
        const timestamp = new Date().toLocaleTimeString();
        setProcessingHistory(prev => [...prev, {
          timestamp,
          elementIds: Array.from(selectedElements),
          count: selectedElements.size,
          type: 'json_copied'
        }]);
        
        const message = jsonPromptDescription && jsonPromptDescription.trim() 
          ? `✅ JSON для ${selectedElements.size} элементов с требованиями к стилю скопирован в буфер обмена!`
          : `✅ JSON для ${selectedElements.size} элементов скопирован в буфер обмена!`;
        alert(message);
      }).catch(() => {
        // Fallback - показываем в консоли
        console.log('📋 JSON для выбранных элементов:', jsonWithStyleRequirements);
        const fallbackMessage = jsonPromptDescription && jsonPromptDescription.trim() 
          ? 'JSON с требованиями к стилю выведен в консоль (F12)'
          : 'JSON выведен в консоль (F12)';
        alert(fallbackMessage);
      });

    } catch (error) {
      console.error('❌ Ошибка при создании JSON:', error);
      alert('Ошибка при создании JSON. Проверьте консоль.');
    }
  };

  // Функция для сброса истории обработки
  const clearProcessingHistory = () => {
    setProcessedElements(new Set());
    setProcessingHistory([]);
    alert('🔄 История обработки очищена!');
  };

  // Функция для получения статуса элемента
  const getElementStatus = (elementId) => {
    if (processedElements.has(elementId)) return 'processed';
    if (selectedElements.has(elementId)) return 'selected';
    return 'available';
  };

  // Функция для ТОЛЬКО сканирования элементов и создания JSON дизайн-системы (БЕЗ применения стилей)
  const handleScanElements = () => {
    try {
      console.log('🔍 [AI Дизайн Система] Начинаем ТОЛЬКО сканирование элементов (без применения стилей)...');
      console.log('🔍 [AI Дизайн Система] Режим конструктора:', constructorMode);
      
      // Собираем данные о стилях всех элементов
      const designSystem = {
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          description: 'Сканированная дизайн-система на основе текущих настроек сайта (только структура)'
        },
        globalSettings: {
          theme: globalSettings.theme,
          contentStyle: globalSettings.contentStyle,
          language: globalSettings.language,
          additionalKeywords: globalSettings.additionalKeywords,
          customInstructions: globalSettings.customInstructions
        },
        header: {
          titleColor: headerData?.titleColor || '#000000',
          backgroundColor: headerData?.backgroundColor || '#ffffff',
          linksColor: headerData?.linksColor || '#000000',
          siteBackgroundType: headerData?.siteBackgroundType || 'solid',
          siteBackgroundColor: headerData?.siteBackgroundColor || '#f8f9fa',
          siteGradientColor1: headerData?.siteGradientColor1 || '#ffffff',
          siteGradientColor2: headerData?.siteGradientColor2 || '#f0f0f0',
          siteGradientDirection: headerData?.siteGradientDirection || 'to right'
        },
        hero: {
          titleColor: heroData?.titleColor || '#000000',
          backgroundColor: heroData?.backgroundColor || 'transparent',
          subtitleColor: heroData?.subtitleColor || '#666666',
          backgroundType: heroData?.backgroundType || 'solid',
          backgroundImage: heroData?.backgroundImage || null,
          overlayColor: heroData?.overlayColor || 'rgba(0,0,0,0.5)'
        },
        sections: {},
        contact: {
          titleColor: contactData?.titleColor || '#000000',
          backgroundColor: contactData?.backgroundColor || '#ffffff',
          formBackgroundColor: contactData?.formBackgroundColor || '#f8f9fa',
          buttonColor: contactData?.buttonColor || '#1976d2'
        },
        footer: {
          backgroundColor: '#f8f9fa',
          textColor: '#666666',
          linkColor: '#1976d2'
        }
      };
      
      console.log('🔍 [AI Дизайн Система] Базовые настройки:', {
        headerData,
        heroData,
        contactData,
        globalSettings
      });
      
      // 🎯 ТОЛЬКО СКАНИРУЕМ СТРУКТУРУ (БЕЗ ПРИМЕНЕНИЯ СТИЛЕЙ)
      console.log('🎯 [AI Дизайн Система] Сканируем только структуру элементов...');
      
      // Создаем минимальную структуру дизайн-системы (только для отображения)
      Object.keys(sectionsData).forEach(sectionKey => {
        const section = sectionsData[sectionKey];
        console.log(`🎯 [AI Дизайн Система] Обрабатываем секцию ${sectionKey}`);
        
        if (section && section.elements) {
          designSystem.sections[sectionKey] = {
            title: section.title || '',
            description: section.description || '',
            backgroundColor: section.backgroundColor || 'transparent',
            titleColor: section.titleColor || '#000000',
            descriptionColor: section.descriptionColor || '#666666',
            elements: section.elements.map(element => ({
              type: element.type || 'unknown',
              // НЕ включаем содержимое (title, content, text)
              // НЕ включаем customStyles (только colorSettings)
              colorSettings: element.colorSettings || {}
            }))
          };
        }
      });
      
      // ✅ ЗАВЕРШАЕМ СКАНИРОВАНИЕ (БЕЗ ПРИМЕНЕНИЯ СТИЛЕЙ)
      console.log('✅ [AI Дизайн Система] Сканирование завершено. Стили НЕ применяются автоматически.');
      console.log('🎯 [AI Дизайн Система] Структура дизайн-системы (только сканирование):', designSystem);
      
      setGeneratedDesignSystem(designSystem);
      setParserMessage('✅ Сканирование элементов завершено! JSON дизайн-системы готов для отправки в GPT-5.');
      
    } catch (error) {
      console.error('❌ [AI Дизайн Система] Ошибка при сканировании элементов:', error);
      setParserMessage('Ошибка при сканировании элементов: ' + error.message);
    }
  };

  // Функция для ПРИМЕНЕНИЯ стилей ко всем элементам (отдельная от сканирования)
  const handleApplyStylesToAllElements = () => {
    try {
      console.log('🎨 [AI Дизайн Система] Начинаем применение стилей ко всем элементам...');
      console.log('🎨 [AI Дизайн Система] Режим конструктора:', constructorMode);
      
      const updatedSections = { ...sectionsData };
      
      Object.keys(updatedSections).forEach(sectionKey => {
        const section = updatedSections[sectionKey];
        if (section && section.elements) {
          console.log(`🎨 [AI Дизайн Система] Обрабатываем секцию ${sectionKey} с ${section.elements.length} элементами`);
          
          // Применяем стили ко ВСЕМ элементам по их типам
          section.elements.forEach((currentElement, elementIndex) => {
            console.log(`🎨 [AI Дизайн Система] Обрабатываем элемент ${elementIndex} типа ${currentElement.type}`);
            
            // Создаем colorSettings если их нет
            if (!currentElement.colorSettings) {
              currentElement.colorSettings = {};
            }
            
            // ПРИМЕНЯЕМ СТИЛИ ПО ТИПУ ЭЛЕМЕНТА (БЕЗ ИЗМЕНЕНИЯ СОДЕРЖИМОГО)
            let updatedElement = { ...currentElement };
            
            switch (currentElement.type) {
              case 'typography':
                // ПОЛНЫЕ настройки стилей для типографики (заголовки и текст)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для typography
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    link: '#00FFA3',       // Неоново-зеленые ссылки
                    code: '#FF4AE0',       // Неоново-розовый код
                    heading: '#00FFA3',    // Неоново-зеленый заголовок
                    paragraph: '#4AE0FF',  // Неоново-голубой параграф
                    strong: '#FF4AE0',     // Неоново-розовый жирный текст
                    em: '#4AE0FF',         // Неоново-голубой курсив
                    small: '#FF4AE0',      // Неоново-розовый мелкий текст
                    mark: '#00FFA3',       // Неоново-зеленый выделенный текст
                    
                    // Стили шрифта
                    fontSize: '38px',
                    fontWeight: '900',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.6,
                    letterSpacing: 0.5
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 2,
                  borderRadius: 18,
                  padding: 28,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '16px 0',
                  textAlign: 'left',
                  overflow: 'hidden',
                  position: 'relative'
                };
                break;
                
              case 'rich-text':
                // ПОЛНЫЕ настройки стилей для rich-text (богатый текст)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для rich-text
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    link: '#00FFA3',       // Неоново-зеленые ссылки
                    code: '#FF4AE0',       // Неоново-розовый код
                    blockquote: '#FF4AE0', // Неоново-розовые цитаты
                    list: '#4AE0FF',       // Неоново-голубые списки
                    h1: '#00FFA3',         // Неоново-зеленый H1
                    h2: '#00FFA3',         // Неоново-зеленый H2
                    h3: '#00FFA3',         // Неоново-зеленый H3
                    h4: '#00FFA3',         // Неоново-зеленый H4
                    h5: '#00FFA3',         // Неоново-зеленый H5
                    h6: '#00FFA3',         // Неоново-зеленый H6
                    p: '#4AE0FF',          // Неоново-голубой параграф
                    li: '#4AE0FF',         // Неоново-голубой элемент списка
                    a: '#00FFA3',          // Неоново-зеленая ссылка
                    strong: '#FF4AE0',     // Неоново-розовый жирный текст
                    em: '#4AE0FF',         // Неоново-голубой курсив
                    u: '#FF4AE0',          // Неоново-розовый подчеркнутый
                    s: '#FF4AE0',          // Неоново-розовый зачеркнутый
                    mark: '#00FFA3',       // Неоново-зеленый выделенный текст
                    small: '#FF4AE0',      // Неоново-розовый мелкий текст
                    sup: '#FF4AE0',        // Неоново-розовый верхний индекс
                    sub: '#FF4AE0',        // Неоново-розовый нижний индекс
                    
                    // Стили шрифта
                    fontSize: '24px',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.5,
                    letterSpacing: 0.3
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 2,
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '12px 0',
                  textAlign: 'left',
                  overflow: 'hidden',
                  position: 'relative'
                };
                break;
                
              case 'basic-card':
                // ПОЛНЫЕ настройки стилей для basic-card (карточки)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для basic-card
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    subtitle: '#4AE0FF',   // Неоново-голубой подзаголовок
                    button: '#00FFA3',     // Неоново-зеленая кнопка
                    icon: '#FF4AE0',       // Неоново-розовая иконка
                    header: '#00FFA3',     // Неоново-зеленый заголовок карточки
                    footer: '#4AE0FF',     // Неоново-голубой футер карточки
                    image: '#FF4AE0',      // Неоново-розовое изображение
                    caption: '#4AE0FF',    // Неоново-голубая подпись
                    price: '#00FFA3',      // Неоново-зеленая цена
                    rating: '#FF4AE0',     // Неоново-розовый рейтинг
                    tag: '#4AE0FF',        // Неоново-голубой тег
                    label: '#00FFA3',      // Неоново-зеленая метка
                    
                    // Стили шрифта
                    fontSize: '20px',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.4,
                    letterSpacing: 0.1
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 2,
                  borderRadius: 15,
                  padding: 24,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '15px 0',
                  textAlign: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease'
                };
                break;

              case 'blockquote':
                // ПОЛНЫЕ настройки стилей для blockquote (цитаты)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для blockquote
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    quote: '#FF4AE0',      // Неоново-розовая цитата
                    author: '#00FFA3',     // Неоново-зеленый автор
                    source: '#4AE0FF',     // Неоново-голубой источник
                    citation: '#FF4AE0',   // Неоново-розовая цитата
                    blockquote: '#FF4AE0', // Неоново-розовый блок цитаты
                    q: '#FF4AE0',          // Неоново-розовая короткая цитата
                    cite: '#4AE0FF',       // Неоново-голубой источник
                    footer: '#00FFA3',     // Неоново-зеленый футер цитаты
                    
                    // Стили шрифта
                    fontSize: '22px',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    fontStyle: 'italic',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.4,
                    letterSpacing: 0.2
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 3,
                  borderRadius: 20,
                  padding: 30,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '20px 0',
                  textAlign: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  borderLeft: '5px solid #00FFA3'
                };
                break;

              case 'list':
                // ПОЛНЫЕ настройки стилей для list (списки)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для list
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    listItem: '#4AE0FF',   // Неоново-голубые элементы списка
                    bullet: '#00FFA3',     // Неоново-зеленые маркеры
                    number: '#FF4AE0',     // Неоново-розовые номера
                    ul: '#4AE0FF',         // Неоново-голубой неупорядоченный список
                    ol: '#4AE0FF',         // Неоново-голубой упорядоченный список
                    li: '#4AE0FF',         // Неоново-голубой элемент списка
                    dt: '#00FFA3',         // Неоново-зеленый термин определения
                    dd: '#4AE0FF',         // Неоново-голубой элемент определения
                    dl: '#4AE0FF',         // Неоново-голубой список определений
                    marker: '#00FFA3',     // Неоново-зеленый маркер
                    counter: '#FF4AE0',    // Неоново-розовый счетчик
                    
                    // Стили шрифта
                    fontSize: '20px',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.3,
                    letterSpacing: 0.1
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 2,
                  borderRadius: 15,
                  padding: 25,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '15px 0',
                  textAlign: 'left',
                  overflow: 'hidden',
                  position: 'relative',
                  listStyleType: 'disc'
                };
                break;

              case 'callout':
                // ПОЛНЫЕ настройки стилей для callout (выноски)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для callout
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    icon: '#00FFA3',       // Неоново-зеленая иконка
                    badge: '#FF4AE0',      // Неоново-розовый бейдж
                    alert: '#FF4AE0',      // Неоново-розовое предупреждение
                    info: '#4AE0FF',       // Неоново-голубая информация
                    warning: '#FF4AE0',    // Неоново-розовое предупреждение
                    error: '#FF4AE0',      // Неоново-розовая ошибка
                    success: '#00FFA3',    // Неоново-зеленый успех
                    note: '#4AE0FF',       // Неоново-голубая заметка
                    tip: '#00FFA3',        // Неоново-зеленый совет
                    highlight: '#FF4AE0',  // Неоново-розовое выделение
                    
                    // Стили шрифта
                    fontSize: '26px',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.2,
                    letterSpacing: 0.4
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 3,
                  borderRadius: 25,
                  padding: 35,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '25px 0',
                  textAlign: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  borderTop: '5px solid #00FFA3'
                };
                break;

              case 'code-block':
                // ПОЛНЫЕ настройки стилей для code-block (блоки кода)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для code-block
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    code: '#FF4AE0',       // Неоново-розовый код
                    keyword: '#00FFA3',    // Неоново-зеленые ключевые слова
                    string: '#4AE0FF',     // Неоново-голубые строки
                    comment: '#666666',    // Серые комментарии
                    function: '#00FFA3',   // Неоново-зеленая функция
                    variable: '#4AE0FF',   // Неоново-голубая переменная
                    number: '#FF4AE0',     // Неоново-розовое число
                    operator: '#00FFA3',   // Неоново-зеленый оператор
                    class: '#4AE0FF',      // Неоново-голубой класс
                    method: '#FF4AE0',     // Неоново-розовый метод
                    property: '#00FFA3',   // Неоново-зеленое свойство
                    tag: '#4AE0FF',        // Неоново-голубой тег
                    attribute: '#FF4AE0',  // Неоново-розовый атрибут
                    selector: '#00FFA3',   // Неоново-зеленый селектор
                    
                    // Стили шрифта
                    fontSize: '18px',
                    fontWeight: '500',
                    fontFamily: 'monospace',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.4,
                    letterSpacing: 0.1
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 2,
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '10px 0',
                  textAlign: 'left',
                  overflow: 'auto',
                  position: 'relative',
                  backgroundColor: '#1a1a1a'
                };
                break;

              case 'accordion':
                // ПОЛНЫЕ настройки стилей для accordion (аккордеоны)
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#0A0A0F',
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    // ВСЕ возможные поля для accordion
                    title: '#00FFA3',      // Неоново-зеленый заголовок
                    text: '#4AE0FF',       // Неоново-голубой основной текст
                    content: '#FF4AE0',    // Неоново-розовый дополнительный контент
                    header: '#00FFA3',     // Неоново-зеленый заголовок панели
                    body: '#4AE0FF',       // Неоново-голубой текст панели
                    icon: '#FF4AE0',       // Неоново-розовая иконка
                    summary: '#00FFA3',    // Неоново-зеленое резюме
                    details: '#4AE0FF',    // Неоново-голубые детали
                    panel: '#FF4AE0',      // Неоново-розовая панель
                    expandIcon: '#FF4AE0', // Неоново-розовая иконка разворачивания
                    collapseIcon: '#FF4AE0', // Неоново-розовая иконка сворачивания
                    section: '#4AE0FF',    // Неоново-голубая секция
                    
                    // Стили шрифта
                    fontSize: '24px',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    textTransform: 'none',
                    lineHeight: 1.3,
                    letterSpacing: 0.2
                  },
                  // Границы и отступы
                  borderColor: '#4AE0FF',
                  borderWidth: 2,
                  borderRadius: 15,
                  padding: 25,
                  boxShadow: true,
                  
                  // Дополнительные настройки
                  margin: '20px 0',
                  textAlign: 'left',
                  overflow: 'hidden',
                  position: 'relative',
                  borderBottom: '2px solid #4AE0FF'
                };
                break;
                
              case 'gradient-text':
                // Стили для gradient-text - градиент применяется к тексту и фону
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    solidColor: '#FFFFFF',
                    gradientColor1: '#FFFFFF',
                    gradientColor2: '#808080',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    title: '#FFFF00',
                    text: '#FFFF00',
                    content: '#FFFF00',
                    gradientStart: '#FFFF00',
                    gradientEnd: '#000000',
                    fontSize: '18px'
                  },
                  // Настройки градиента для текста
                  textGradient: {
                    enabled: true,
                    gradientStart: '#FFFF00',
                    gradientEnd: '#000000',
                    gradientDirection: 'to right'
                  },
                  padding: 24
                };
                break;
                
              case 'animated-counter':
                // Стили для animated-counter
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    title: '#00FFA3',
                    text: '#4AE0FF',
                    content: '#FF4AE0',
                    number: '#00FFA3',
                    label: '#4AE0FF',
                    fontSize: '20px'
                  },
                  padding: 24
                };
                break;
                
              case 'typewriter-text':
                // Стили для typewriter-text
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    title: '#00FFA3',
                    text: '#4AE0FF',
                    content: '#FF4AE0',
                    cursor: '#00FFA3',
                    fontSize: '16px'
                  },
                  padding: 24
                };
                break;
                
              case 'highlight-text':
                // Стили для highlight-text
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    title: '#00FFA3',
                    text: '#4AE0FF',
                    content: '#FF4AE0',
                    highlight: '#00FFA3',
                    fontSize: '16px'
                  },
                  padding: 24
                };
                break;
                
              case 'testimonial-card':
                // Стили для testimonial-card
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    name: '#1976d2',
                    role: '#FF0000',
                    company: '#888888',
                    content: '#333333',
                    rating: '#ffc107',
                    fontSize: '16px'
                  },
                  padding: 24
                };
                break;

              case 'multiple-cards':
                console.log('🔥 [AiParser] Обрабатываем multiple-cards элемент:', elementData);
                
                // ИСПРАВЛЕНИЕ: Применяем стили из JSON с учетом структуры данных
                if (elementData.colorSettings) {
                  // Применяем colorSettings к самому элементу
                  updatedElement.colorSettings = {
                    ...elementData.colorSettings,
                    // Дополнительные поля для совместимости
                    sectionColorSettings: elementData.colorSettings,
                    sectionStyles: {
                      titleColor: elementData.colorSettings.textFields?.title || '#1976d2',
                      descriptionColor: elementData.colorSettings.textFields?.description || elementData.colorSettings.textFields?.text || '#666666',
                      backgroundColor: elementData.colorSettings.sectionBackground?.solidColor || '#ffffff',
                      backgroundType: elementData.colorSettings.sectionBackground?.useGradient ? 'gradient' : 'solid',
                      gradientDirection: elementData.colorSettings.sectionBackground?.gradientDirection || 'to right',
                      gradientStartColor: elementData.colorSettings.sectionBackground?.gradientColor1 || '#1976d2',
                      gradientEndColor: elementData.colorSettings.sectionBackground?.gradientColor2 || '#42a5f5',
                      padding: `${elementData.colorSettings.padding || 24}px`,
                      borderRadius: `${elementData.colorSettings.borderRadius || 12}px`
                    }
                  };
                  
                  // Применяем стили к карточкам - проверяем разные возможные структуры
                  const cards = updatedElement.cards || updatedElement.data?.cards || [];
                  console.log('🔥 [AiParser] Найдены карточки:', cards.length);
                  console.log('🔥 [AiParser] Структура updatedElement:', {
                    hasCards: !!updatedElement.cards,
                    hasDataCards: !!updatedElement.data?.cards,
                    cardsLength: cards.length
                  });
                  
                  // Применяем стили ко всем существующим карточкам
                  const existingCards = updatedElement.cards || updatedElement.data?.cards || [];
                  console.log('🔥 [AiParser] Существующие карточки:', existingCards.length);
                  
                  if (existingCards && Array.isArray(existingCards)) {
                    const updatedCards = existingCards.map(card => {
                      // Используем цвета карточек из JSON или цвета секции как fallback
                      const cardColorSettings = card.colorSettings || {};
                      const cardTextFields = cardColorSettings.textFields || elementData.colorSettings.textFields || {};
                      const cardSectionBackground = cardColorSettings.sectionBackground || elementData.colorSettings.sectionBackground || {};
                      
                      console.log('🔥 [AiParser] Карточка до обработки:', card.id, {
                        cardColorSettings,
                        cardTextFields,
                        cardSectionBackground
                      });
                      
                      return {
                        ...card,
                        colorSettings: {
                          textFields: {
                            title: cardTextFields.title || cardTextFields.cardTitle || '#1976d2',
                            text: cardTextFields.text || cardTextFields.cardText || cardTextFields.cardContent || '#333333',
                            content: cardTextFields.content || cardTextFields.cardContent || '#333333',
                            border: cardTextFields.border || '#e0e0e0'
                          },
                          sectionBackground: {
                            enabled: cardSectionBackground.enabled !== false,
                            useGradient: cardSectionBackground.useGradient || false,
                            solidColor: cardSectionBackground.solidColor || '#ffffff',
                            gradientColor1: cardSectionBackground.gradientColor1 || '#000000',
                            gradientColor2: cardSectionBackground.gradientColor2 || '#8b0000',
                            gradientDirection: cardSectionBackground.gradientDirection || 'to right',
                            opacity: cardSectionBackground.opacity || 1
                          },
                          borderWidth: cardColorSettings.borderWidth || 1,
                          borderRadius: cardColorSettings.borderRadius || 8,
                          padding: cardColorSettings.padding || 24,
                          boxShadow: cardColorSettings.boxShadow || false
                        },
                        // Обновляем customStyles для совместимости
                        customStyles: {
                          ...card.customStyles,
                          backgroundColor: cardSectionBackground.solidColor || '#ffffff',
                          titleColor: cardTextFields.title || cardTextFields.cardTitle || '#333333',
                          textColor: cardTextFields.text || cardTextFields.cardText || cardTextFields.cardContent || '#666666',
                          backgroundType: cardSectionBackground.useGradient ? 'gradient' : 'solid',
                          gradientColor1: cardSectionBackground.gradientColor1 || '#000000',
                          gradientColor2: cardSectionBackground.gradientColor2 || '#8b0000',
                          gradientDirection: cardSectionBackground.gradientDirection || 'to right',
                          borderColor: cardTextFields.border || '#e0e0e0',
                          borderWidth: cardColorSettings.borderWidth || 1,
                          borderRadius: cardColorSettings.borderRadius || 8
                        }
                      };
                    });
                    
                    // Обновляем карточки в правильном месте
                    if (updatedElement.cards) {
                      updatedElement.cards = updatedCards;
                      console.log('🔥 [AiParser] Обновили updatedElement.cards');
                    } else if (updatedElement.data) {
                      updatedElement.data.cards = updatedCards;
                      console.log('🔥 [AiParser] Обновили updatedElement.data.cards');
                    } else {
                      // Если нет ни того, ни другого, создаем data.cards
                      updatedElement.data = updatedElement.data || {};
                      updatedElement.data.cards = updatedCards;
                      console.log('🔥 [AiParser] Создали updatedElement.data.cards');
                    }
                    
                    console.log('🔥 [AiParser] Карточки после обработки:', updatedCards.map(card => ({
                      id: card.id,
                      colorSettings: card.colorSettings,
                      customStyles: card.customStyles
                    })));
                  }
                } else {
                  // Fallback на дефолтные стили если нет colorSettings в JSON
                  updatedElement.colorSettings = {
                    sectionBackground: {
                      enabled: true,
                      useGradient: true,
                      solidColor: '#1a1a2e',
                      gradientColor1: '#1a1a2e',
                      gradientColor2: '#16213e',
                      gradientDirection: 'to bottom right',
                      opacity: 1
                    },
                    textFields: {
                      title: '#8e24aa',
                      text: '#8e24aa',
                      description: '#8e24aa',
                      fontSize: '18px'
                    },
                    borderColor: '#8e24aa',
                    borderWidth: 1,
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: true
                  };
                }
                console.log('🔥 [handleApplyStylesToAllElements] MULTIPLE-CARDS обработан!', updatedElement);
                break;
                
              default:
                // Для остальных типов применяем базовые стили
                updatedElement.colorSettings = {
                  sectionBackground: {
                    enabled: true,
                    useGradient: true,
                    gradientColor1: '#0A0A0F',
                    gradientColor2: '#14142B',
                    gradientDirection: 'to bottom right',
                    opacity: 1
                  },
                  textFields: {
                    title: '#00FFA3',
                    text: '#4AE0FF',
                    content: '#FF4AE0',
                    fontSize: '18px',
                    fontWeight: '500',
                    fontFamily: 'inherit'
                  },
                  borderColor: '#4AE0FF',
                  borderWidth: 1,
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: false
                };
            }
            
            console.log(`🎯 [AI Дизайн Система] Обновленный элемент ${elementIndex} типа ${currentElement.type}:`, updatedElement);
            
            // Обновляем элемент в секции
            updatedSections[sectionKey].elements[elementIndex] = updatedElement;
            
            // 🔥 ОТЛАДКА: Проверяем, что элемент обновился
            if (currentElement.type === 'multiple-cards') {
              console.log('🔥🔥🔥 [MULTIPLE-CARDS UPDATE] Обновленный элемент в updatedSections:', updatedSections[sectionKey].elements[elementIndex]);
              console.log('🔥🔥🔥 [MULTIPLE-CARDS UPDATE] colorSettings:', updatedSections[sectionKey].elements[elementIndex].colorSettings);
            }
          });
        }
      });
      
      // 🔥 ОТЛАДКА: Проверяем финальное состояние updatedSections
      console.log('🔥🔥🔥 [FINAL UPDATE] updatedSections после обработки:', updatedSections);
      Object.keys(updatedSections).forEach(sectionKey => {
        const section = updatedSections[sectionKey];
        if (section && section.elements) {
          section.elements.forEach((element, index) => {
            if (element.type === 'multiple-cards') {
              console.log(`🔥🔥🔥 [FINAL UPDATE] multiple-cards #${index} в секции ${sectionKey}:`, element);
              console.log(`🔥🔥🔥 [FINAL UPDATE] colorSettings:`, element.colorSettings);
            }
          });
        }
      });
      
      // Применяем обновленные секции
      if (onSectionsChange) {
        console.log('🎨 [AI Дизайн Система] Применяем обновленные секции с новыми стилями');
        console.log('🎨 [AI Дизайн Система] Вызываем onSectionsChange с данными:', updatedSections);
        
        // Принудительно вызываем обновление
        onSectionsChange(updatedSections);
        
        // Добавляем задержку для гарантии обновления
        setTimeout(() => {
          console.log('🎨 [AI Дизайн Система] Проверяем, что onSectionsChange был вызван');
          // Дополнительно вызываем еще раз для гарантии
          onSectionsChange({...updatedSections});
        }, 100);
      } else {
        console.log('❌ [AI Дизайн Система] onSectionsChange недоступен!');
      }
      
      setParserMessage('✅ Стили автоматически применены ко всем элементам!');
      
    } catch (error) {
      console.error('❌ [AI Дизайн Система] Ошибка при применении стилей:', error);
      setParserMessage('Ошибка при применении стилей: ' + error.message);
    }
  };

  // Функция для применения стилей из JSON, полученного от GPT-5
  const handleApplyDesignSystem = (designSystemJson) => {
    try {
      console.log('🎨 [AI Дизайн Система] ===== НАЧАЛО ПРИМЕНЕНИЯ СТИЛЕЙ =====');
      console.log('🎨 [AI Дизайн Система] Применяем стили из JSON:', designSystemJson);
      console.log('🎨 [AI Дизайн Система] Текущие данные секций:', sectionsData);
      console.log('🎨 [AI Дизайн Система] Режим конструктора:', constructorMode);
      console.log('🎨 [AI Дизайн Система] onSectionsChange доступен:', !!onSectionsChange);
      
      // Применяем глобальные настройки
      if (designSystemJson.globalSettings) {
        console.log('🎨 [AI Дизайн Система] Применяем глобальные настройки:', designSystemJson.globalSettings);
        setGlobalSettings(prev => ({
          ...prev,
          ...designSystemJson.globalSettings
        }));
      }
      
      // Применяем стили заголовка (только если есть явные настройки заголовка)
      if (designSystemJson.header && onHeaderChange) {
        console.log('🎨 [AI Дизайн Система] Применяем стили заголовка:', designSystemJson.header);
        
        // Фильтруем только настройки заголовка, исключая sectionBackground из элементов
        const headerSettings = { ...designSystemJson.header };
        
        // Удаляем sectionBackground, если он пришел из элементов
        if (headerSettings.sectionBackground && headerSettings.sectionBackground.isElementBackground) {
          delete headerSettings.sectionBackground;
          console.log('🎨 [AI Дизайн Система] Удален sectionBackground из элементов из настроек заголовка');
        }
        
        onHeaderChange({
          ...headerData,
          ...headerSettings
        });
      }
      
      // Применяем стили hero секции (только если есть явные настройки hero)
      if (designSystemJson.hero && onHeroChange) {
        console.log('🎨 [AI Дизайн Система] Применяем стили hero секции:', designSystemJson.hero);
        
        // Фильтруем только настройки hero, исключая sectionBackground из элементов
        const heroSettings = { ...designSystemJson.hero };
        
        // Удаляем sectionBackground, если он пришел из элементов
        if (heroSettings.sectionBackground && heroSettings.sectionBackground.isElementBackground) {
          delete heroSettings.sectionBackground;
          console.log('🎨 [AI Дизайн Система] Удален sectionBackground из элементов из настроек hero');
        }
        
        onHeroChange({
          ...heroData,
          ...heroSettings
        });
      }
      
      // Применяем стили контактов
      if (designSystemJson.contact && onContactChange) {
        console.log('🎨 [AI Дизайн Система] Применяем стили контактов:', designSystemJson.contact);
        onContactChange({
          ...contactData,
          ...designSystemJson.contact
        });
      }
      
      // Применяем стили секций
      if (designSystemJson.sections && onSectionsChange) {
        console.log('🎨 [AI Дизайн Система] Обрабатываем секции:', designSystemJson.sections);
        console.log('🎨 [AI Дизайн Система] Доступные секции в sectionsData:', Object.keys(sectionsData));
        
        const updatedSections = { ...sectionsData };
        
        Object.keys(designSystemJson.sections).forEach(sectionKey => {
          console.log(`🎨 [AI Дизайн Система] Проверяем секцию ${sectionKey}:`, {
            existsInJson: !!designSystemJson.sections[sectionKey],
            existsInSectionsData: !!updatedSections[sectionKey],
            sectionData: designSystemJson.sections[sectionKey]
          });
          
          if (updatedSections[sectionKey]) {
            const sectionData = designSystemJson.sections[sectionKey];
            console.log(`🎨 [AI Дизайн Система] Обрабатываем секцию ${sectionKey}:`, sectionData);
            
            updatedSections[sectionKey] = {
              ...updatedSections[sectionKey],
              title: sectionData.title || updatedSections[sectionKey].title,
              description: sectionData.description || updatedSections[sectionKey].description,
              // НЕ применяем backgroundColor из sectionData, чтобы избежать влияния на глобальный фон
              // backgroundColor: sectionData.backgroundColor || updatedSections[sectionKey].backgroundColor,
              titleColor: sectionData.titleColor || updatedSections[sectionKey].titleColor,
              descriptionColor: sectionData.descriptionColor || updatedSections[sectionKey].descriptionColor
            };
            
            // АВТОМАТИЧЕСКОЕ ПРИМЕНЕНИЕ СТИЛЕЙ КО ВСЕМ ЭЛЕМЕНТАМ ТИПОГРАФИКИ
            if (sectionData.elements && updatedSections[sectionKey].elements) {
              console.log(`🎨 [AI Дизайн Система] Элементы в JSON для секции ${sectionKey}:`, sectionData.elements);
              console.log(`🎨 [AI Дизайн Система] Элементы в sectionsData для секции ${sectionKey}:`, updatedSections[sectionKey].elements);
              
              // Применяем стили к элементам по типам из JSON
              sectionData.elements.forEach((jsonElement, jsonIndex) => {
                console.log(`🎯 [AI Дизайн Система] Обрабатываем элемент из JSON #${jsonIndex}: ${jsonElement.type}`);
                
                // Ищем элемент такого же типа в sectionsData
                const matchingElements = updatedSections[sectionKey].elements.filter(el => el.type === jsonElement.type);
                console.log(`🎯 [AI Дизайн Система] Найдено элементов типа ${jsonElement.type} в sectionsData:`, matchingElements.length);
                
                if (matchingElements.length > 0) {
                  // Берем первый подходящий элемент (или можно по индексу)
                  const currentElement = matchingElements[0];
                  const originalIndex = updatedSections[sectionKey].elements.indexOf(currentElement);
                  console.log(`🎯 [AI Дизайн Система] Применяем стили к элементу ${jsonElement.type} в секции ${sectionKey}, элемент #${originalIndex}`);
                  console.log(`🎯 [AI Дизайн Система] Текущий элемент до обновления:`, currentElement);
                  
                  // Создаем colorSettings если их нет
                  if (!currentElement.colorSettings) {
                    currentElement.colorSettings = {};
                  }
                  
                  // ПРИНУДИТЕЛЬНОЕ ПРИМЕНЕНИЕ СТИЛЕЙ ИЗ JSON К ЭЛЕМЕНТУ
                  let updatedElement = {
                    ...currentElement, // Сохраняем ВСЕ существующие данные
                    
                    // ПРАВИЛЬНОЕ СЛИЯНИЕ COLOR SETTINGS ИЗ JSON
                    colorSettings: {
                      // Сохраняем существующие настройки
                      ...currentElement.colorSettings,
                      
                      // Перезаписываем настройками из JSON (приоритет)
                      ...jsonElement.colorSettings,
                      
                      // Глубокое слияние textFields
                      textFields: {
                        ...currentElement.colorSettings?.textFields,
                        ...jsonElement.colorSettings?.textFields
                      },
                      
                      // Глубокое слияние sectionBackground (только для элемента, не для глобального фона)
                      sectionBackground: {
                        ...currentElement.colorSettings?.sectionBackground,
                        ...jsonElement.colorSettings?.sectionBackground,
                        // Убеждаемся, что sectionBackground применяется только к элементу
                        isElementBackground: true
                      },
                      
                      // Глубокое слияние cardBackground
                      cardBackground: {
                        ...currentElement.colorSettings?.cardBackground,
                        ...jsonElement.colorSettings?.cardBackground
                      }
                    }
                  };
                  
                  // Специальная обработка для faq-section - применяем стили к элементам аккордеона
                  if (jsonElement.type === 'faq-section' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка faq-section в handleApplyDesignSystem');
                    
                    // Применяем стили к элементам FAQ
                    const items = updatedElement.items || updatedElement.data?.items || [];
                    console.log('🔥 [AiParser] Найдены элементы FAQ в handleApplyDesignSystem:', items.length);
                    
                    if (items && Array.isArray(items)) {
                      const updatedItems = items.map(item => {
                        console.log('🔥 [AiParser] Обрабатываем элемент FAQ в handleApplyDesignSystem:', item.id);
                        
                        return {
                          ...item,
                          // Применяем цвета из colorSettings
                          questionColor: jsonElement.colorSettings.textFields?.question || jsonElement.colorSettings.textFields?.questionText || '#ffff00',
                          answerColor: jsonElement.colorSettings.textFields?.answer || jsonElement.colorSettings.textFields?.answerText || '#00ffff'
                        };
                      });
                      
                      // Обновляем элементы в правильном месте
                      if (updatedElement.items) {
                        updatedElement.items = updatedItems;
                        console.log('🔥 [AiParser] Обновили updatedElement.items в handleApplyDesignSystem');
                      } else if (updatedElement.data) {
                        updatedElement.data.items = updatedItems;
                        console.log('🔥 [AiParser] Обновили updatedElement.data.items в handleApplyDesignSystem');
                      } else {
                        updatedElement.data = updatedElement.data || {};
                        updatedElement.data.items = updatedItems;
                        console.log('🔥 [AiParser] Создали updatedElement.data.items в handleApplyDesignSystem');
                      }
                      
                      console.log('🔥 [AiParser] Элементы FAQ после обработки:', updatedItems.map(item => ({
                        id: item.id,
                        questionColor: item.questionColor,
                        answerColor: item.answerColor
                      })));
                    }
                    
                    // Обновляем основные поля элемента
                    updatedElement.backgroundColor = jsonElement.colorSettings.backgroundColor || '#ff00ff';
                    updatedElement.titleColor = jsonElement.colorSettings.textFields?.title || jsonElement.colorSettings.textFields?.faqTitle || '#00ff00';
                    updatedElement.backgroundType = 'solid';
                    updatedElement.borderColor = jsonElement.colorSettings.borderColor || '#ff6600';
                    updatedElement.borderWidth = jsonElement.colorSettings.borderWidth || 3;
                    updatedElement.borderRadius = jsonElement.colorSettings.borderRadius || 12;
                    
                    console.log('🔥 [AiParser] Обновлены основные поля FAQ:', {
                      backgroundColor: updatedElement.backgroundColor,
                      titleColor: updatedElement.titleColor,
                      borderColor: updatedElement.borderColor
                    });
                  }
                  
                  // Специальная обработка для multiple-cards - применяем стили к карточкам
                  if (jsonElement.type === 'multiple-cards' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка multiple-cards в handleApplyDesignSystem');
                    
                    // Применяем стили к карточкам
                    const cards = updatedElement.cards || updatedElement.data?.cards || [];
                    console.log('🔥 [AiParser] Найдены карточки в handleApplyDesignSystem:', cards.length);
                    
                    if (cards && Array.isArray(cards)) {
                      const updatedCards = cards.map(card => {
                        console.log('🔥 [AiParser] Обрабатываем карточку в handleApplyDesignSystem:', card.id);
                        
                        return {
                          ...card,
                    colorSettings: {
                            textFields: {
                              title: jsonElement.colorSettings.textFields?.cardTitle || jsonElement.colorSettings.textFields?.title || '#8e24aa',
                              text: jsonElement.colorSettings.textFields?.cardText || jsonElement.colorSettings.textFields?.text || '#8e24aa',
                              content: jsonElement.colorSettings.textFields?.cardContent || jsonElement.colorSettings.textFields?.content || '#8e24aa',
                              border: jsonElement.colorSettings.textFields?.border || '#e0e0e0'
                            },
                            sectionBackground: {
                              enabled: true,
                              useGradient: jsonElement.colorSettings.cardBackground?.useGradient || false,
                              solidColor: jsonElement.colorSettings.cardBackground?.solidColor || '#ffffff',
                              gradientColor1: jsonElement.colorSettings.cardBackground?.gradientColor1 || '#000000',
                              gradientColor2: jsonElement.colorSettings.cardBackground?.gradientColor2 || '#8b0000',
                              gradientDirection: jsonElement.colorSettings.cardBackground?.gradientDirection || 'to right',
                              opacity: jsonElement.colorSettings.cardBackground?.opacity || 1
                            },
                            borderWidth: 1,
                            borderRadius: 8,
                            padding: 24,
                            boxShadow: false
                          },
                          // Обновляем customStyles для совместимости
                          customStyles: {
                            ...card.customStyles,
                            backgroundColor: jsonElement.colorSettings.cardBackground?.solidColor || '#ffffff',
                            titleColor: jsonElement.colorSettings.textFields?.cardTitle || jsonElement.colorSettings.textFields?.title || '#333333',
                            textColor: jsonElement.colorSettings.textFields?.cardText || jsonElement.colorSettings.textFields?.text || '#666666',
                            backgroundType: jsonElement.colorSettings.cardBackground?.useGradient ? 'gradient' : 'solid',
                            gradientColor1: jsonElement.colorSettings.cardBackground?.gradientColor1 || '#000000',
                            gradientColor2: jsonElement.colorSettings.cardBackground?.gradientColor2 || '#8b0000',
                            gradientDirection: jsonElement.colorSettings.cardBackground?.gradientDirection || 'to right',
                            borderColor: jsonElement.colorSettings.textFields?.border || '#e0e0e0',
                            borderWidth: jsonElement.colorSettings.borderWidth || 1,
                            borderRadius: jsonElement.colorSettings.borderRadius || 8
                          }
                        };
                      });
                      
                      // Обновляем карточки в правильном месте
                      if (updatedElement.cards) {
                        updatedElement.cards = updatedCards;
                        console.log('🔥 [AiParser] Обновили updatedElement.cards в handleApplyDesignSystem');
                      } else if (updatedElement.data) {
                        updatedElement.data.cards = updatedCards;
                        console.log('🔥 [AiParser] Обновили updatedElement.data.cards в handleApplyDesignSystem');
                      } else {
                        updatedElement.data = updatedElement.data || {};
                        updatedElement.data.cards = updatedCards;
                        console.log('🔥 [AiParser] Создали updatedElement.data.cards в handleApplyDesignSystem');
                      }
                      
                      console.log('🔥 [AiParser] Карточки после обработки в handleApplyDesignSystem:', updatedCards.map(card => ({
                        id: card.id,
                        colorSettings: card.colorSettings,
                        customStyles: card.customStyles
                      })));
                    }
                  }
                  
                  // Специальная обработка для data-table - применяем стили к таблице
                  if (jsonElement.type === 'data-table' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка data-table в handleApplyDesignSystem');
                    
                    // Обновляем основные поля элемента
                    updatedElement.backgroundColor = jsonElement.colorSettings.backgroundColor || '#ffffff';
                    updatedElement.titleColor = jsonElement.colorSettings.textFields?.title || jsonElement.colorSettings.textFields?.headerText || '#333333';
                    updatedElement.backgroundType = 'solid';
                    updatedElement.borderColor = jsonElement.colorSettings.borderColor || jsonElement.colorSettings.textFields?.border || '#e0e0e0';
                    updatedElement.borderWidth = jsonElement.colorSettings.borderWidth || 1;
                    updatedElement.borderRadius = jsonElement.colorSettings.borderRadius || 8;
                    
                    console.log('🔥 [AiParser] Обновлены основные поля data-table:', {
                      backgroundColor: updatedElement.backgroundColor,
                      titleColor: updatedElement.titleColor,
                      borderColor: updatedElement.borderColor
                    });
                  }
                  
                  // Специальная обработка для advanced-line-chart - применяем стили к линиям графика
                  if (jsonElement.type === 'advanced-line-chart' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка advanced-line-chart в handleApplyDesignSystem');
                    
                    // 🔥 ИСПРАВЛЕНИЕ: Применяем цвет легенды к описанию секции и в colorSettings
                    if (jsonElement.colorSettings.textFields?.legendText) {
                      updatedElement.descriptionColor = jsonElement.colorSettings.textFields.legendText;
                      
                      // Также обновляем colorSettings для совместимости с редактором
                      if (!updatedElement.colorSettings) {
                        updatedElement.colorSettings = {};
                      }
                      if (!updatedElement.colorSettings.textFields) {
                        updatedElement.colorSettings.textFields = {};
                      }
                      updatedElement.colorSettings.textFields.legend = jsonElement.colorSettings.textFields.legendText;
                      
                      console.log('🔥 [AiParser] Применили цвет легенды к описанию секции и colorSettings:', {
                        descriptionColor: updatedElement.descriptionColor,
                        legendColor: updatedElement.colorSettings.textFields.legend
                      });
                    }
                    
                    // Применяем стили к данным диаграммы
                    const chartData = updatedElement.data || updatedElement.chartData || [];
                    console.log('🔥 [AiParser] Найдены данные линейного графика в handleApplyDesignSystem:', chartData.length);
                    
                    if (chartData && Array.isArray(chartData)) {
                      // Обновляем цвета линий
                      const lineColors = jsonElement.colorSettings.lineColors || {};
                      const availableLineColors = Object.values(lineColors);
                      const lineColorKeys = Object.keys(lineColors);
                      
                      if (availableLineColors.length > 0) {
                        updatedElement.lineColors = availableLineColors;
                        console.log('🔥 [AiParser] Обновили цвета линий:', availableLineColors);
                      }
                      
                      // Обновляем названия линий если есть
                      if (jsonElement.lineNames && Array.isArray(jsonElement.lineNames)) {
                        updatedElement.lineNames = jsonElement.lineNames;
                        console.log('🔥 [AiParser] Обновили названия линий:', jsonElement.lineNames);
                      }
                    }
                  }
                  
                  // Специальная обработка для bar-chart - применяем стили к столбцам диаграммы
                  if (jsonElement.type === 'bar-chart' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка bar-chart в handleApplyDesignSystem');
                    
                    // 🔥 ИСПРАВЛЕНИЕ: Применяем цвет легенды к описанию секции и в colorSettings
                    if (jsonElement.colorSettings.textFields?.legendText) {
                      updatedElement.descriptionColor = jsonElement.colorSettings.textFields.legendText;
                      
                      // Также обновляем colorSettings для совместимости с редактором
                      if (!updatedElement.colorSettings) {
                        updatedElement.colorSettings = {};
                      }
                      if (!updatedElement.colorSettings.textFields) {
                        updatedElement.colorSettings.textFields = {};
                      }
                      updatedElement.colorSettings.textFields.legend = jsonElement.colorSettings.textFields.legendText;
                      
                      console.log('🔥 [AiParser] Применили цвет легенды к описанию секции и colorSettings:', {
                        descriptionColor: updatedElement.descriptionColor,
                        legendColor: updatedElement.colorSettings.textFields.legend
                      });
                    }
                    
                    // Применяем стили к данным диаграммы
                    const chartData = updatedElement.data || updatedElement.chartData || [];
                    console.log('🔥 [AiParser] Найдены данные диаграммы в handleApplyDesignSystem:', chartData.length);
                    
                    if (chartData && Array.isArray(chartData)) {
                      const updatedChartData = chartData.map((item, index) => {
                        console.log('🔥 [AiParser] Обрабатываем столбец диаграммы в handleApplyDesignSystem:', item.label);
                        
                        // Определяем цвет столбца из chartColors
                        let barColor = '#1976d2'; // цвет по умолчанию
                        
                        if (jsonElement.colorSettings.chartColors) {
                          // Получаем все доступные цвета из JSON
                          const availableColors = Object.values(jsonElement.colorSettings.chartColors);
                          const colorKeys = Object.keys(jsonElement.colorSettings.chartColors);
                          
                          if (availableColors.length > 0) {
                            // Используем цвет по индексу из доступных цветов
                            const colorIndex = index % availableColors.length;
                            barColor = availableColors[colorIndex];
                            console.log(`🔥 [AiParser] Применяем цвет ${colorKeys[colorIndex]} (${barColor}) к столбцу ${index + 1}`);
                          }
                        }
                        
                        return {
                          ...item,
                          color: barColor,
                          // Обновляем customStyles для совместимости
                          customStyles: {
                            ...item.customStyles,
                            backgroundColor: barColor,
                            color: barColor
                          }
                        };
                      });
                      
                      // Обновляем данные диаграммы в правильном месте
                      if (updatedElement.data) {
                        updatedElement.data = updatedChartData;
                        console.log('🔥 [AiParser] Обновили updatedElement.data в handleApplyDesignSystem');
                      } else if (updatedElement.chartData) {
                        updatedElement.chartData = updatedChartData;
                        console.log('🔥 [AiParser] Обновили updatedElement.chartData в handleApplyDesignSystem');
                      } else {
                        updatedElement.data = updatedChartData;
                        console.log('🔥 [AiParser] Создали updatedElement.data в handleApplyDesignSystem');
                      }
                      
                      console.log('🔥 [AiParser] Данные диаграммы после обработки в handleApplyDesignSystem:', updatedChartData.map(item => ({
                        label: item.label,
                        value: item.value,
                        color: item.color
                      })));
                    }
                  }
                  
                  // Специальная обработка для advanced-pie-chart - применяем стили к сегментам диаграммы
                  if (jsonElement.type === 'advanced-pie-chart' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка advanced-pie-chart в handleApplyDesignSystem');
                    
                    // Применяем все colorSettings к элементу
                    updatedElement.colorSettings = {
                      ...updatedElement.colorSettings,
                      ...jsonElement.colorSettings
                    };
                    
                    // Применяем цвет легенды к описанию секции
                    if (jsonElement.colorSettings.textFields?.legendText) {
                      updatedElement.descriptionColor = jsonElement.colorSettings.textFields.legendText;
                      
                      // Также обновляем colorSettings для совместимости с редактором
                      if (!updatedElement.colorSettings.textFields) {
                        updatedElement.colorSettings.textFields = {};
                      }
                      updatedElement.colorSettings.textFields.legend = jsonElement.colorSettings.textFields.legendText;
                    }
                    
                    // Применяем стили к данным диаграммы
                    const pieData = updatedElement.data || updatedElement.chartData || [];
                    console.log('🔥 [AiParser] Найдены данные круговой диаграммы в handleApplyDesignSystem:', pieData.length);
                    
                    if (pieData && Array.isArray(pieData)) {
                      // Обновляем цвета сегментов
                      const segmentColors = jsonElement.colorSettings.segmentColors || {};
                      const availableSegmentColors = Object.values(segmentColors);
                      
                      console.log('🔥 [AiParser] Доступные цвета сегментов:', availableSegmentColors);
                      
                      const updatedPieData = pieData.map((item, index) => {
                        console.log('🔥 [AiParser] Обрабатываем сегмент круговой диаграммы в handleApplyDesignSystem:', item.name);
                        
                        // Определяем цвет сегмента из segmentColors
                        let segmentColor = '#8884d8'; // цвет по умолчанию
                        
                        if (availableSegmentColors.length > 0) {
                          segmentColor = availableSegmentColors[index % availableSegmentColors.length];
                        }
                        
                        return {
                          ...item,
                          fill: segmentColor,
                          color: segmentColor
                        };
                      });
                      
                      // Обновляем данные диаграммы в правильном месте
                      if (updatedElement.data) {
                        updatedElement.data = updatedPieData;
                        console.log('🔥 [AiParser] Обновили updatedElement.data в handleApplyDesignSystem');
                      } else if (updatedElement.chartData) {
                        updatedElement.chartData = updatedPieData;
                        console.log('🔥 [AiParser] Обновили updatedElement.chartData в handleApplyDesignSystem');
                      } else {
                        updatedElement.data = updatedPieData;
                        console.log('🔥 [AiParser] Создали updatedElement.data в handleApplyDesignSystem');
                      }
                      
                      // Обновляем pieColors массив для совместимости с редактором
                      const pieColors = updatedPieData.map(item => item.fill || item.color);
                      updatedElement.pieColors = pieColors;
                      
                      console.log('🔥 [AiParser] Данные круговой диаграммы после обработки в handleApplyDesignSystem:', updatedPieData.map(item => ({
                        name: item.name,
                        value: item.value,
                        fill: item.fill,
                        color: item.color
                      })));
                    }
                  }
                  
                  // Специальная обработка для advanced-area-chart - применяем стили к областям диаграммы
                  if (jsonElement.type === 'advanced-area-chart' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка advanced-area-chart в handleApplyDesignSystem');
                    
                    // Применяем все colorSettings к элементу
                    updatedElement.colorSettings = {
                      ...updatedElement.colorSettings,
                      ...jsonElement.colorSettings
                    };
                    
                    // Применяем цвет легенды к описанию секции
                    if (jsonElement.colorSettings.textFields?.legendText) {
                      updatedElement.descriptionColor = jsonElement.colorSettings.textFields.legendText;
                      
                      // Также обновляем colorSettings для совместимости с редактором
                      if (!updatedElement.colorSettings.textFields) {
                        updatedElement.colorSettings.textFields = {};
                      }
                      updatedElement.colorSettings.textFields.legend = jsonElement.colorSettings.textFields.legendText;
                    }
                    
                    // Применяем стили к данным диаграммы
                    const areaData = updatedElement.data || updatedElement.chartData || [];
                    console.log('🔥 [AiParser] Найдены данные диаграммы областей в handleApplyDesignSystem:', areaData.length);
                    
                    if (areaData && Array.isArray(areaData)) {
                      // Получаем доступные цвета областей из JSON
                      const availableAreaColors = Object.values(jsonElement.colorSettings.areaColors || {});
                      console.log('🔥 [AiParser] Доступные цвета областей из JSON:', availableAreaColors);
                      
                      const updatedAreaData = areaData.map((item, index) => {
                        console.log('🔥 [AiParser] Обрабатываем область диаграммы в handleApplyDesignSystem:', item.name);
                        
                        // Определяем цвет области из areaColors
                        let areaColor = '#8884d8'; // цвет по умолчанию
                        
                        if (availableAreaColors.length > 0) {
                          areaColor = availableAreaColors[index % availableAreaColors.length];
                        }
                        
                        return {
                          ...item,
                          fill: areaColor,
                          color: areaColor
                        };
                      });
                      
                      // Обновляем данные диаграммы в правильном месте
                      if (updatedElement.data) {
                        updatedElement.data = updatedAreaData;
                        console.log('🔥 [AiParser] Обновили updatedElement.data в handleApplyDesignSystem');
                      } else if (updatedElement.chartData) {
                        updatedElement.chartData = updatedAreaData;
                        console.log('🔥 [AiParser] Обновили updatedElement.chartData в handleApplyDesignSystem');
                      } else {
                        updatedElement.data = updatedAreaData;
                        console.log('🔥 [AiParser] Создали updatedElement.data в handleApplyDesignSystem');
                      }
                      
                      // Обновляем areaColors массив для совместимости с редактором
                      const areaColors = updatedAreaData.map(item => item.fill || item.color);
                      updatedElement.areaColors = areaColors;
                      
                      console.log('🔥 [AiParser] Данные диаграммы областей после обработки в handleApplyDesignSystem:', updatedAreaData.map(item => ({
                        name: item.name,
                        value: item.value,
                        fill: item.fill,
                        color: item.color
                      })));
                    }
                  }
                  
                  // Специальная обработка для cta-section - применяем стили к CTA секции
                  if (jsonElement.type === 'cta-section' && jsonElement.colorSettings) {
                    console.log('🔥 [AiParser] Специальная обработка cta-section в handleApplyDesignSystem');
                    
                    // Применяем только стили, НЕ изменяем текстовые поля
                    if (jsonElement.alignment) {
                      updatedElement.alignment = jsonElement.alignment;
                    }
                    if (jsonElement.backgroundType) {
                      updatedElement.backgroundType = jsonElement.backgroundType;
                    }
                    if (jsonElement.backgroundColor) {
                      updatedElement.backgroundColor = jsonElement.backgroundColor;
                    }
                    if (jsonElement.gradientColor1) {
                      updatedElement.gradientColor1 = jsonElement.gradientColor1;
                    }
                    if (jsonElement.gradientColor2) {
                      updatedElement.gradientColor2 = jsonElement.gradientColor2;
                    }
                    if (jsonElement.gradientDirection) {
                      updatedElement.gradientDirection = jsonElement.gradientDirection;
                    }
                    if (jsonElement.textColor) {
                      updatedElement.textColor = jsonElement.textColor;
                    }
                    if (jsonElement.titleColor) {
                      updatedElement.titleColor = jsonElement.titleColor;
                    }
                    if (jsonElement.descriptionColor) {
                      updatedElement.descriptionColor = jsonElement.descriptionColor;
                    }
                    if (jsonElement.buttonColor) {
                      updatedElement.buttonColor = jsonElement.buttonColor;
                    }
                    if (jsonElement.buttonTextColor) {
                      updatedElement.buttonTextColor = jsonElement.buttonTextColor;
                    }
                    if (jsonElement.borderRadius) {
                      updatedElement.borderRadius = jsonElement.borderRadius;
                    }
                    if (jsonElement.padding) {
                      updatedElement.padding = jsonElement.padding;
                    }
                    if (jsonElement.buttonBorderRadius) {
                      updatedElement.buttonBorderRadius = jsonElement.buttonBorderRadius;
                    }
                    if (jsonElement.showShadow !== undefined) {
                      updatedElement.showShadow = jsonElement.showShadow;
                    }
                    if (jsonElement.animationSettings) {
                      updatedElement.animationSettings = jsonElement.animationSettings;
                    }
                    
                    // Применяем colorSettings
                    updatedElement.colorSettings = {
                      ...updatedElement.colorSettings,
                      ...jsonElement.colorSettings
                    };
                    
                    console.log('🔥 [AiParser] Применены стили CTA секции (текст не изменен):', {
                      alignment: updatedElement.alignment,
                      backgroundType: updatedElement.backgroundType,
                      backgroundColor: updatedElement.backgroundColor,
                      titleColor: updatedElement.titleColor,
                      descriptionColor: updatedElement.descriptionColor,
                      buttonColor: updatedElement.buttonColor,
                      buttonTextColor: updatedElement.buttonTextColor,
                      borderRadius: updatedElement.borderRadius,
                      padding: updatedElement.padding,
                      buttonBorderRadius: updatedElement.buttonBorderRadius,
                      showShadow: updatedElement.showShadow,
                      colorSettings: updatedElement.colorSettings
                    });
                  }
                
                  console.log(`✅ [AI Дизайн Система] Обновленный элемент ${jsonElement.type} #${originalIndex}:`, updatedElement);
                  console.log(`🎯 [AI Дизайн Система] Применены стили из JSON:`, jsonElement.colorSettings);
                  
                  // Обновляем элемент в секции
                  updatedSections[sectionKey].elements[originalIndex] = updatedElement;
                } else {
                  console.log(`⚠️ [AI Дизайн Система] Не найден элемент типа ${jsonElement.type} в sectionsData для секции ${sectionKey}`);
                }
              });
              

            }
          }
        });
        
        console.log('🎨 [AI Дизайн Система] Обновленные секции:', updatedSections);
        console.log('🎨 [AI Дизайн Система] Вызываем onSectionsChange с обновленными данными');
        onSectionsChange(updatedSections);
        console.log('🎨 [AI Дизайн Система] onSectionsChange вызван');
        console.log('🎨 [AI Дизайн Система] ===== СТИЛИ ПРИМЕНЕНЫ =====');
      } else {
        console.log('🎨 [AI Дизайн Система] Секции или onSectionsChange недоступны:', {
          hasSections: !!designSystemJson.sections,
          hasOnSectionsChange: !!onSectionsChange
        });
      }
      
      setParserMessage('✅ Стили успешно применены!');
      
    } catch (error) {
      console.error('❌ [AI Дизайн Система] Ошибка при применении стилей:', error);
      setParserMessage('Ошибка при применении стилей: ' + error.message);
    }
  };

  // Функция для обработки JSON от GPT-5
  const handleApplyGpt5Json = () => {
    try {
      console.log('🚀 [AI Дизайн Система] ===== НАЧАЛО ОБРАБОТКИ JSON =====');
      
      if (!gpt5JsonInput.trim()) {
        setParserMessage('Введите JSON для применения стилей.');
        return;
      }
      
      console.log('🚀 [AI Дизайн Система] Обрабатываем JSON от GPT-5:', gpt5JsonInput);
      
      // Парсим JSON
      const designSystemJson = JSON.parse(gpt5JsonInput);
      console.log('🚀 [AI Дизайн Система] Распарсенный JSON:', designSystemJson);
      console.log('🚀 [AI Дизайн Система] Проверяем структуру JSON:', {
        hasSections: !!designSystemJson.sections,
        sectionKeys: designSystemJson.sections ? Object.keys(designSystemJson.sections) : [],
        hasElements: designSystemJson.sections ? Object.values(designSystemJson.sections).some(s => s.elements) : false
      });
      
      // Применяем стили
      console.log('🚀 [AI Дизайн Система] Вызываем handleApplyDesignSystem...');
      handleApplyDesignSystem(designSystemJson);
      
      // Очищаем поле ввода
      setGpt5JsonInput('');
      
    } catch (error) {
      console.error('❌ [AI Дизайн Система] Ошибка при обработке JSON от GPT-5:', error);
      setParserMessage('Ошибка при обработке JSON: ' + error.message);
    }
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
            parsedData = parsers.parseFullSite(content, headerData, contactData);
            if (parsedData) {
              console.log('Результаты парсинга полного сайта:', parsedData);
              console.log('🔍 parsedData.merci:', parsedData.merci);
              
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
              
              // Определяем порядок секций для меню: О нас, Услуги, Преимущества, Новости, FAQ, Отзывы, Универсальная
              const sectionOrder = ['about', 'services', 'features', 'news', 'faq', 'testimonials', 'universal'];

              // Создаем список пунктов меню, сохраняя нужный порядок
              const processOrderedSections = () => {
                // Создаем список секций в нужном порядке, начиная с существующих пунктов меню
                const orderedMenuItems = [...headerData.menuItems];
                
                console.log('Доступные секции в parsedData:', Object.keys(parsedData));
                console.log('Существующие пункты меню:', headerData.menuItems.map(item => item.id));
                
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
                    case 'universal':
                      section = parsedData.universal;
                      break;
                  }
                  
                  if (section) {
                    console.log(`Секция ${sectionId} найдена:`, section);
                    
                    // ВАЖНОЕ ИЗМЕНЕНИЕ: 
                    // 1. Сохраняем секцию по её ID, а не по ключу массива
                    // 2. Явно указываем все важные поля, включая заголовок и описание 
                    // 3. КРИТИЧЕСКИ ВАЖНО: добавляем поля elements и contentElements!
                    updatedSections[section.id] = {
                      id: section.id,
                      title: section.title,
                      description: section.description,
                      pageName: section.pageName || '', // ДОБАВЛЕНО: поле pageName для экспорта
                      cardType: section.cardType || 'ELEVATED',
                      cards: section.cards || [],
                      elements: section.elements || [], // ДОБАВЛЕНО: поле elements
                      contentElements: section.contentElements || [], // ДОБАВЛЕНО: поле contentElements
                      titleColor: section.titleColor || '#1976d2',
                      descriptionColor: section.descriptionColor || '#666666'
                    };
                    
                    console.log(`Обновлена секция ${section.id}:`, updatedSections[section.id]);
                    console.log(`✅ Поле pageName для секции ${section.id}:`, section.pageName);
                    
                    // Используем заголовок секции для названия в меню
                    let menuText = section.id;
                    let menuId = section.id;

                    if (sectionId === 'news') {
                      console.log('Обрабатываем раздел новостей, ID из контента:', section.id);
                    }
                    
                    // Проверяем существование пункта меню в уже созданном массиве
                    const existingMenuItemIndex = orderedMenuItems.findIndex(item => item.id === menuId);
                    
                    if (existingMenuItemIndex !== -1) {
                      // Обновляем существующий пункт меню
                      orderedMenuItems[existingMenuItemIndex] = {
                        ...orderedMenuItems[existingMenuItemIndex],
                        text: menuText,
                        link: `#${menuId}`
                      };
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
              let updatedContactData = contactData;
              if (parsedData.contacts) {
                console.log('🔍 parsedData.contacts содержит:', parsedData.contacts);
                console.log('🔍 parsedData.contacts.pageName:', parsedData.contacts.pageName);
                updatedContactData = {
                  ...parsedData.contacts,
                  thankYouMessage: parsedData.merci?.message || contactData?.thankYouMessage,
                  closeButtonText: parsedData.merci?.closeButtonText || contactData?.closeButtonText
                };
                console.log('✅ Обновляем данные контактов с pageName:', updatedContactData.pageName);
                onContactChange(updatedContactData);
              }
              
              // Обновляем данные благодарности даже если контакты не обрабатывались
              if (parsedData.merci && !parsedData.contacts) {
                console.log('🔍 parsedData.merci содержит:', parsedData.merci);
                updatedContactData = {
                  ...contactData,
                  thankYouMessage: parsedData.merci.message,
                  closeButtonText: parsedData.merci.closeButtonText
                };
                console.log('✅ Обновляем только данные благодарности:', updatedContactData);
                onContactChange(updatedContactData);
              }
              
              // Обновляем правовые документы с актуальными контактными данными
              if (parsedData.legalDocuments) {
                console.log('Обновляем правовые документы с актуальными контактами:', updatedContactData);
                
                // Перепарсиваем правовые документы с обновленными контактными данными
                const updatedLegalDocuments = {};
                Object.keys(parsedData.legalDocuments).forEach(docType => {
                  const doc = parsedData.legalDocuments[docType];
                  if (doc && doc.content) {
                    // Удаляем старую контактную информацию из конца документа
                    let cleanContent = doc.content;
                    
                    // Удаляем блок с контактами в конце (если есть эмодзи)
                    const contactBlockRegex = /\n\n🏢.*$/s;
                    cleanContent = cleanContent.replace(contactBlockRegex, '');
                    
                    // Добавляем новые контактные данные
                    let contactBlock = '\n\n';
                    
                    if (updatedContactData.companyName) {
                      contactBlock += `🏢 ${updatedContactData.companyName}\n`;
                    }
                    
                    if (updatedContactData.address) {
                      contactBlock += `📍 ${updatedContactData.address}\n`;
                    }
                    
                    if (updatedContactData.phone) {
                      contactBlock += `📞 ${updatedContactData.phone}\n`;
                    }
                    
                    if (updatedContactData.email) {
                      contactBlock += `📧 ${updatedContactData.email}\n`;
                    }
                    
                    updatedLegalDocuments[docType] = {
                      ...doc,
                      content: cleanContent + contactBlock
                    };
                  } else {
                    updatedLegalDocuments[docType] = doc;
                  }
                });
                
                onLegalDocumentsChange(updatedLegalDocuments);
              }
              
              // Добавляем принудительное обновление для гарантии применения всех изменений
              setTimeout(() => {
                console.log('Принудительное обновление страницы для применения изменений');
                // Повторно применяем обновления всех секций
                onSectionsChange({...updatedSections});
              }, 100);
              
              // Формируем сообщение о том, что было обновлено
              const updatedParts = [];
              if (parsedData.hero) updatedParts.push('главная секция');
              if (Object.keys(updatedSections).length > 0) updatedParts.push('разделы сайта');
              if (parsedData.contacts) updatedParts.push('контакты');
              if (parsedData.legalDocuments) updatedParts.push('правовые документы');
              
              const message = updatedParts.length > 0 
                ? `Успешно обновлены: ${updatedParts.join(', ')}`
                : 'Все разделы сайта успешно обновлены';
              
              setParserMessage(message);
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
              elements: parsedData.elements || [], // Добавляем поддержку элементов
              contentElements: parsedData.contentElements || [], // Добавляем поддержку contentElements
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
                    
            // Сохраняем обновленные данные с полной структурой
            onSectionsChange({
              ...sectionsData,
              [parsedData.id]: {
                ...parsedData,
                elements: parsedData.elements || [],
                contentElements: parsedData.contentElements || []
              }
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
              elements: parsedData.elements || [], // Добавляем поддержку элементов
              contentElements: parsedData.contentElements || [], // Добавляем поддержку contentElements
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
              elements: parsedData.elements || [], // Добавляем поддержку элементов
              contentElements: parsedData.contentElements || [], // Добавляем поддержку contentElements
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
              elements: parsedData.elements || [], // Добавляем поддержку элементов
              contentElements: parsedData.contentElements || [], // Добавляем поддержку contentElements
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
              elements: parsedData.elements || [], // Добавляем поддержку элементов
              contentElements: parsedData.contentElements || [], // Добавляем поддержку contentElements
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
        case 'AI_ELEMENTS':
          // Универсальный парсер для AI элементов с автоматическим определением типа секции
          parsedData = parsers.parseUniversalSection(content);
          if (parsedData) {
            console.log('Результат универсального парсера:', parsedData);
            
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Если пункт меню существует, то обновляем его параметры вместо добавления нового
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.title || parsedData.id,
                      link: parsedData.link || `#${parsedData.id}`,
                      backgroundColor: parsedData.backgroundColor || '#ffffff',
                      textColor: parsedData.textColor || '#000000',
                      borderColor: parsedData.borderColor || '#e0e0e0',
                      shadowColor: parsedData.shadowColor || 'rgba(0,0,0,0.1)',
                      gradientStart: parsedData.gradientStart || '#ffffff',
                      gradientEnd: parsedData.gradientEnd || '#f5f5f5',
                      gradientDirection: parsedData.gradientDirection || 'to right'
                    }
                  : item
              );
            } else {
              // Create new menu item
              const menuItem = {
                id: parsedData.id,
                text: parsedData.title || parsedData.id,
                link: parsedData.link || `#${parsedData.id}`,
                backgroundColor: parsedData.backgroundColor || '#ffffff',
                textColor: parsedData.textColor || '#000000',
                borderColor: parsedData.borderColor || '#e0e0e0',
                shadowColor: parsedData.shadowColor || 'rgba(0,0,0,0.1)',
                gradientStart: parsedData.gradientStart || '#ffffff',
                gradientEnd: parsedData.gradientEnd || '#f5f5f5',
                gradientDirection: parsedData.gradientDirection || 'to right'
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
               cardType: parsedData.cardType || 'ELEVATED',
               cards: parsedData.cards || [],
               elements: parsedData.elements || [], // Поддержка элементов (старая система)
               contentElements: parsedData.contentElements || parsedData.elements || [], // Поддержка элементов (новая система)
               link: parsedData.link || `#${parsedData.id}`,
               backgroundColor: parsedData.backgroundColor || '#ffffff',
               textColor: parsedData.textColor || '#000000',
               borderColor: parsedData.borderColor || '#e0e0e0',
               shadowColor: parsedData.shadowColor || 'rgba(0,0,0,0.1)',
               gradientStart: parsedData.gradientStart || '#ffffff',
               gradientEnd: parsedData.gradientEnd || '#f5f5f5',
               gradientDirection: parsedData.gradientDirection || 'to right',
               titleColor: '#1976d2',
               descriptionColor: '#666666'
             };
            
            // Update sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage(`Секция "${parsedData.title}" успешно обновлена.`);
            } else {
              setParserMessage(`Секция "${parsedData.title}" успешно добавлена.`);
            }
          }
          break;
        case 'AUTO':
          // Попробуем универсальный парсер для контента с элементами
          parsedData = parsers.parseUniversalSection(content);
          if (parsedData) {
            console.log('Универсальный парсер AUTO обработал контент:', parsedData);
            
            // Проверяем, существует ли уже пункт меню с таким ID
            const menuItemExists = headerData.menuItems.some(item => item.id === parsedData.id);
            
            // Создаем или обновляем пункт меню
            let updatedMenuItems;
            if (menuItemExists) {
              updatedMenuItems = headerData.menuItems.map(item => 
                item.id === parsedData.id 
                  ? {
                      ...item,
                      text: parsedData.title || parsedData.id,
                      link: parsedData.link || `#${parsedData.id}`,
                      backgroundColor: parsedData.backgroundColor || '#ffffff',
                      textColor: parsedData.textColor || '#000000',
                      borderColor: parsedData.borderColor || '#e0e0e0',
                      shadowColor: parsedData.shadowColor || 'rgba(0,0,0,0.1)',
                      gradientStart: parsedData.gradientStart || '#ffffff',
                      gradientEnd: parsedData.gradientEnd || '#f5f5f5',
                      gradientDirection: parsedData.gradientDirection || 'to right'
                    }
                  : item
              );
            } else {
              const menuItem = {
                id: parsedData.id,
                text: parsedData.title || parsedData.id,
                link: parsedData.link || `#${parsedData.id}`,
                backgroundColor: parsedData.backgroundColor || '#ffffff',
                textColor: parsedData.textColor || '#000000',
                borderColor: parsedData.borderColor || '#e0e0e0',
                shadowColor: parsedData.shadowColor || 'rgba(0,0,0,0.1)',
                gradientStart: parsedData.gradientStart || '#ffffff',
                gradientEnd: parsedData.gradientEnd || '#f5f5f5',
                gradientDirection: parsedData.gradientDirection || 'to right'
              };
              updatedMenuItems = [...headerData.menuItems, menuItem];
            }
            
            // Обновляем headerData
            onHeaderChange({ ...headerData, menuItems: updatedMenuItems });
            
            // Создаем или обновляем секцию с элементами
            const newSection = {
              id: parsedData.id,
              title: parsedData.title,
              description: parsedData.description,
              cardType: parsedData.cardType || 'ELEVATED',
              cards: parsedData.cards || [],
              elements: parsedData.elements || [], // Массив AI элементов
              contentElements: parsedData.contentElements || parsedData.elements || [], // Альтернативное поле для элементов
              link: parsedData.link || `#${parsedData.id}`,
              backgroundColor: parsedData.backgroundColor || '#ffffff',
              textColor: parsedData.textColor || '#000000',
              borderColor: parsedData.borderColor || '#e0e0e0',
              shadowColor: parsedData.shadowColor || 'rgba(0,0,0,0.1)',
              gradientStart: parsedData.gradientStart || '#ffffff',
              gradientEnd: parsedData.gradientEnd || '#f5f5f5',
              gradientDirection: parsedData.gradientDirection || 'to right',
              titleColor: '#1976d2',
              descriptionColor: '#666666'
            };
            
            // Обновляем sectionsData
            onSectionsChange({ ...sectionsData, [parsedData.id]: newSection });
            
            if (menuItemExists) {
              setParserMessage(`Универсальная секция "${parsedData.title}" успешно обновлена с ${parsedData.elements?.length || 0} элементами.`);
            } else {
              setParserMessage(`Универсальная секция "${parsedData.title}" успешно добавлена с ${parsedData.elements?.length || 0} элементами.`);
            }
          } else {
            setParserMessage('Не удалось автоматически определить тип контента. Пожалуйста, выберите раздел вручную.');
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
  const handleApplyWholeWebsiteStyle = (styleName, stylePreset, contactPreset, headerPreset) => {
    console.log(`Применяем стиль ${styleName} ко всему сайту`);
    
    // Применяем стиль к шапке сайта
    if (onHeaderChange && headerData) {
      if (headerPreset) {
        // Если передан headerPreset, применяем его
        onHeaderChange({
          ...headerData,
          titleColor: headerPreset.titleColor,
          backgroundColor: headerPreset.backgroundColor,
          linksColor: headerPreset.linksColor,
          siteBackgroundType: headerPreset.siteBackgroundType || 'solid',
          ...((!headerPreset.siteBackgroundType || headerPreset.siteBackgroundType === 'solid') && {
            siteBackgroundColor: headerPreset.siteBackgroundColor || headerPreset.backgroundColor || '#ffffff'
          }),
          ...(headerPreset.siteBackgroundType === 'gradient' && {
            siteGradientColor1: headerPreset.siteGradientColor1 || headerPreset.backgroundColor || '#ffffff',
            siteGradientColor2: headerPreset.siteGradientColor2 || headerPreset.cardBackgroundColor || '#f5f5f5',
            siteGradientDirection: headerPreset.siteGradientDirection || 'to bottom'
          })
        });
        
        // Применяем цвета из headerPreset к hero секции
        if (onHeroChange && heroData) {
          onHeroChange({
            ...heroData,
            titleColor: headerPreset.titleColor,
            subtitleColor: headerPreset.linksColor,
            descriptionColor: headerPreset.linksColor,
            backgroundColor: headerPreset.backgroundColor,
            borderColor: stylePreset.borderColor,
          });
        }
      } else {
        // Иначе применяем стандартный стиль
        onHeaderChange({
          ...headerData,
          titleColor: stylePreset.titleColor,
          backgroundColor: stylePreset.backgroundColor,
          borderColor: stylePreset.borderColor,
          linksColor: stylePreset.descriptionColor,
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
        
        // Применяем стиль к герою, используя цвета из stylePreset
        if (onHeroChange && heroData) {
          onHeroChange({
            ...heroData,
            titleColor: stylePreset.titleColor,
            subtitleColor: stylePreset.descriptionColor,
            descriptionColor: stylePreset.descriptionColor,
            backgroundColor: stylePreset.backgroundColor,
            borderColor: stylePreset.borderColor,
          });
        }
      }
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
            titleColor: stylePreset.cardTitleColor || stylePreset.titleColor,
            contentColor: stylePreset.cardContentColor || stylePreset.descriptionColor,
            backgroundColor: stylePreset.cardBackgroundColor || '#ffffff',
            borderColor: stylePreset.cardBorderColor || stylePreset.borderColor,
            backgroundType: stylePreset.cardBackgroundType || 'solid',
            gradientColor1: stylePreset.cardGradientColor1,
            gradientColor2: stylePreset.cardGradientColor2,
            gradientDirection: stylePreset.cardGradientDirection || 'to bottom',
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

    // Применяем соответствующий стиль к контактной форме
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
          // Создаем новый стиль на основе основного стиля
          matchingContactStyle = {
            // 🎨 ФОНОВЫЕ НАСТРОЙКИ для fallback стиля
            showBackground: true,
            backgroundType: 'solid',
            backgroundColor: stylePreset.backgroundColor || '#f8f9fa',
            gradientColor1: stylePreset.backgroundColor || '#ffffff',
            gradientColor2: stylePreset.cardBackgroundColor || '#f5f5f5',
            gradientDirection: 'to bottom',
            // Остальные настройки
            titleColor: stylePreset.titleColor,
            descriptionColor: stylePreset.descriptionColor,
            companyInfoColor: stylePreset.titleColor,
            formVariant: 'outlined',
            infoVariant: 'elevation',
            formBackgroundColor: stylePreset.backgroundColor || '#ffffff',
            infoBackgroundColor: stylePreset.cardBackgroundColor || '#f5f5f5',
            formBorderColor: stylePreset.borderColor,
            infoBorderColor: stylePreset.borderColor,
            labelColor: stylePreset.titleColor,
            inputBackgroundColor: stylePreset.cardBackgroundColor || '#ffffff',
            inputTextColor: stylePreset.cardContentColor || '#333333',
            buttonColor: stylePreset.titleColor,
            buttonTextColor: '#ffffff',
            iconColor: stylePreset.titleColor,
            infoTitleColor: stylePreset.titleColor,
            infoTextColor: stylePreset.descriptionColor
          };
        }
      }
      
      // Применяем найденный или созданный стиль
      console.log('Применяем стиль к разделу контактов:', matchingContactStyle.name || 'базовый стиль');
      
      onContactChange({
        ...contactData,
        // 🎨 ФОНОВЫЕ НАСТРОЙКИ - ВАЖНО ДОБАВИТЬ И ЗДЕСЬ!
        showBackground: matchingContactStyle.showBackground,
        backgroundType: matchingContactStyle.backgroundType,
        backgroundColor: matchingContactStyle.backgroundColor,
        gradientColor1: matchingContactStyle.gradientColor1,
        gradientColor2: matchingContactStyle.gradientColor2,
        gradientDirection: matchingContactStyle.gradientDirection,
        // Остальные настройки
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
    }
  };

  // Модифицируем функцию для применения случайного стиля
  const applyRandomStyle = () => {
    // Получаем все доступные стили из STYLE_PRESETS
    const styleNames = Object.keys(STYLE_PRESETS);
    // Получаем доступные стили шапки
    const headerStyleKeys = Object.keys(headerPresets);
    
    if (singleStyleMode) {
      // Применяем один и тот же стиль ко всем разделам
      const randomStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const randomStylePreset = STYLE_PRESETS[randomStyleName];
      
      // Выбираем случайный стиль шапки
      const randomHeaderIndex = Math.floor(Math.random() * headerStyleKeys.length);
      const selectedHeaderStyle = headerStyleKeys[randomHeaderIndex];
      const headerPreset = headerPresets[selectedHeaderStyle];
      
      console.log(`Применяем один случайный стиль ко всем разделам: ${randomStyleName}`);
      console.log(`И случайный стиль шапки: ${selectedHeaderStyle}`);
      
      // ВАЖНО: Применяем headerPreset даже в режиме единого стиля
      handleApplyWholeWebsiteStyle(randomStyleName, randomStylePreset, null, headerPreset);
    } else {
      // Применяем разные случайные стили к каждому разделу
      console.log('Применяем разные случайные стили к каждому разделу');
      
      // Выбираем случайный стиль шапки
      const randomHeaderIndex = Math.floor(Math.random() * headerStyleKeys.length);
      const selectedHeaderStyle = headerStyleKeys[randomHeaderIndex];
      const headerPreset = headerPresets[selectedHeaderStyle];
      
      // Применяем случайный стиль к шапке
      if (onHeaderChange && headerData) {
        console.log(`Применяем случайный стиль шапки: ${selectedHeaderStyle}`);
        onHeaderChange({
          ...headerData,
          titleColor: headerPreset.titleColor,
          backgroundColor: headerPreset.backgroundColor,
          linksColor: headerPreset.linksColor,
          siteBackgroundType: headerPreset.siteBackgroundType || 'solid',
          ...((!headerPreset.siteBackgroundType || headerPreset.siteBackgroundType === 'solid') && {
            siteBackgroundColor: headerPreset.siteBackgroundColor || headerPreset.backgroundColor || '#ffffff'
          }),
          ...(headerPreset.siteBackgroundType === 'gradient' && {
            siteGradientColor1: headerPreset.siteGradientColor1 || headerPreset.backgroundColor || '#ffffff',
            siteGradientColor2: headerPreset.siteGradientColor2 || headerPreset.cardBackgroundColor || '#f5f5f5',
            siteGradientDirection: headerPreset.siteGradientDirection || 'to bottom'
          })
        });
        
        // Применяем согласованные цвета к hero секции
        if (onHeroChange && heroData) {
          onHeroChange({
            ...heroData,
            titleColor: headerPreset.titleColor, // Используем цвет заголовка шапки
            subtitleColor: headerPreset.linksColor, // Используем цвет ссылок шапки для подзаголовка
            descriptionColor: headerPreset.linksColor, // Используем цвет ссылок шапки
            backgroundColor: headerPreset.backgroundColor,
            borderColor: headerPreset.borderColor || '#e0e0e0',
          });
        }
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
      
      // Применяем случайный стиль к контактам
      const contactStyleName = styleNames[Math.floor(Math.random() * styleNames.length)];
      const contactStylePreset = STYLE_PRESETS[contactStyleName];
      
      if (onContactChange && contactData) {
        // Выбираем случайный стиль из contactPresets
        const contactPresetKeys = Object.keys(contactPresets);
        const randomContactPreset = contactPresets[contactPresetKeys[Math.floor(Math.random() * contactPresetKeys.length)]];
        
        console.log('🎨 APPLYING RANDOM CONTACT PRESET:', randomContactPreset.name);
        console.log('🎨 BACKGROUND SETTINGS:', {
          showBackground: randomContactPreset.showBackground,
          backgroundType: randomContactPreset.backgroundType,
          backgroundColor: randomContactPreset.backgroundColor,
          gradientColor1: randomContactPreset.gradientColor1,
          gradientColor2: randomContactPreset.gradientColor2,
          gradientDirection: randomContactPreset.gradientDirection
        });
        
        onContactChange({
          ...contactData,
          // 🎨 ФОНОВЫЕ НАСТРОЙКИ - САМОЕ ВАЖНОЕ!
          showBackground: randomContactPreset.showBackground,
          backgroundType: randomContactPreset.backgroundType,
          backgroundColor: randomContactPreset.backgroundColor,
          gradientColor1: randomContactPreset.gradientColor1,
          gradientColor2: randomContactPreset.gradientColor2,
          gradientDirection: randomContactPreset.gradientDirection,
          // Остальные настройки
          titleColor: randomContactPreset.titleColor,
          descriptionColor: randomContactPreset.descriptionColor,
          companyInfoColor: randomContactPreset.companyInfoColor,
          formVariant: randomContactPreset.formVariant,
          infoVariant: randomContactPreset.infoVariant,
          formBackgroundColor: randomContactPreset.formBackgroundColor,
          infoBackgroundColor: randomContactPreset.infoBackgroundColor,
          formBorderColor: randomContactPreset.formBorderColor,
          infoBorderColor: randomContactPreset.infoBorderColor,
          labelColor: randomContactPreset.labelColor,
          inputBackgroundColor: randomContactPreset.inputBackgroundColor,
          inputTextColor: randomContactPreset.inputTextColor,
          buttonColor: randomContactPreset.buttonColor,
          buttonTextColor: randomContactPreset.buttonTextColor,
          iconColor: randomContactPreset.iconColor,
          infoTitleColor: randomContactPreset.infoTitleColor,
          infoTextColor: randomContactPreset.infoTextColor
        });
      }
    }
  };

  return (
    <Box>
      {/* Переключатель режимов конструктора */}
      <Box sx={{ 
        mb: 1, 
        p: 2, 
        bgcolor: 'rgba(0, 0, 0, 0.02)', 
        borderRadius: '8px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1,
          bgcolor: 'white',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: constructorMode ? '#1976d2' : 'rgba(0, 0, 0, 0.6)',
              fontWeight: constructorMode ? 600 : 400,
              fontSize: '0.85rem',
              minWidth: '120px',
              textAlign: 'center'
            }}
          >
            Конструктор
          </Typography>
          <Switch
            checked={!constructorMode}
            onChange={(e) => onConstructorModeChange && onConstructorModeChange(!e.target.checked)}
            size="small"
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#ff9800',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#ff9800',
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#1976d2',
              }
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: !constructorMode ? '#ff9800' : 'rgba(0, 0, 0, 0.6)',
              fontWeight: !constructorMode ? 600 : 400,
              fontSize: '0.85rem',
              minWidth: '120px',
              textAlign: 'center'
            }}
          >
            Ручной режим
          </Typography>
        </Box>
      </Box>
      
      {/* Новый раздел: Промпты для элементов */}
      <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />} 
          sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
          <Typography variant="h6" sx={{ color: '#4caf50' }}>
            Промпты для элементов
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <ElementPromptsSection />
        </AccordionDetails>
      </Accordion>
      
      {/* Новый раздел: AI Дизайн Система */}
      <Accordion defaultExpanded={false} sx={{ mb: 2 }}>
        <AccordionSummary 
          expandIcon={<ExpandMoreIcon />} 
          sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
        >
          <Typography variant="h6" sx={{ color: '#9c27b0' }}>
            🎨 AI Дизайн Система
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Paper sx={{ boxShadow: 'none' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.7)', mb: 2 }}>
                Сканирование элементов и создание JSON дизайн-системы для отправки в GPT-5
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleScanElementsWithSelection()}
                  startIcon={<TuneIcon />}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                    }
                  }}
                >
                  📋 Выбрать элементы
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleScanElements()}
                  startIcon={<TuneIcon />}
                  sx={{
                    color: '#2196f3',
                    borderColor: '#2196f3',
                    '&:hover': {
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(33, 150, 243, 0.04)'
                    }
                  }}
                >
                  🔍 Сканировать все
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleApplyStylesToAllElements()}
                  startIcon={<StyleIcon />}
                  sx={{
                    color: '#9c27b0',
                    borderColor: '#9c27b0',
                    '&:hover': {
                      borderColor: '#7b1fa2',
                      backgroundColor: 'rgba(156, 39, 176, 0.04)'
                    }
                  }}
                >
                  🎨 Применить стили
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setShowDesignSystemDialog(true)}
                  startIcon={<TuneIcon />}
                  disabled={!generatedDesignSystem}
                  sx={{
                    color: '#ff9800',
                    borderColor: '#ff9800',
                    '&:hover': {
                      borderColor: '#f57c00',
                      backgroundColor: 'rgba(255, 152, 0, 0.04)'
                    }
                  }}
                >
                  📋 Показать JSON
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ p: 2 }}>
              {/* Поле для описания JSON промпта */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#2196f3' }}>
                  📝 Описание для GPT-5 промпта
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Требования к цветовому стилю (будет добавлено к JSON)"
                  value={jsonPromptDescription}
                  onChange={(e) => setJsonPromptDescription(e.target.value)}
                  sx={{ mb: 2 }}
                  variant="outlined"
                  helperText="Это описание будет автоматически добавлено к JSON при копировании для лучшего понимания GPT-5"
                />
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setJsonPromptDescription(`Требования к цветовому стилю:
- Используйте современные градиенты и контрастные цвета
- Применяйте темные фоны с яркими акцентами
- Обеспечьте хорошую читаемость текста
- Используйте цветовую схему: основные цвета #00d4ff, #ff6b6b, #facc15
- Применяйте градиенты для фонов секций
- Добавляйте тени и скругления для современного вида

ДЕТАЛЬНЫЕ ТРЕБОВАНИЯ ДЛЯ GPT-5:
1. УНИКАЛЬНОСТЬ ПОЛЕЙ: Каждое текстовое поле должно иметь уникальный цвет из палитры:
   - title: #00d4ff (голубой) - для главных заголовков
   - text: #ffffff (белый) - для основного текста на темном фоне
   - description: #facc15 (желтый) - для описаний и подзаголовков
   - cardTitle: #ff6b6b (красный) - для заголовков карточек
   - cardText: #e0e0e0 (светло-серый) - для текста в карточках
   - cardContent: #4ecdc4 (бирюзовый) - для контента карточек

2. КОНТРАСТНОСТЬ: Обеспечьте минимальный контраст 4.5:1 между текстом и фоном:
   - Белый текст (#ffffff) на темных фонах (#1a1a2e, #16213e)
   - Светлые цвета для текста на темных градиентах
   - Темные цвета для текста на светлых элементах

3. ФОНОВЫЕ ГРАДИЕНТЫ:
   - sectionBackground: градиент от #1a1a2e к #16213e
   - cardBackground: градиент от #0a0a0f к #1a1a2e
   - Используйте направление "to right" или "to bottom right"

4. ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ:
   - borderColor: #00d4ff для границ карточек
   - boxShadow: true для объемности
   - borderRadius: 8px для скругления углов
   - borderWidth: 1-2px для четкости границ

5. ПРИМЕНЕНИЕ К JSON: В сгенерированном JSON каждое поле colorSettings должно содержать:
   - Уникальный цвет для каждого текстового поля
   - Соответствующий фон с градиентом
   - Настройки границ и теней
   - Обеспечение читаемости на всех фонах`)}
                    sx={{ color: '#2196f3', borderColor: '#2196f3' }}
                  >
                    🔄 Сбросить к умолчанию
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setJsonPromptDescription('')}
                    sx={{ color: '#f44336', borderColor: '#f44336' }}
                  >
                    🗑️ Очистить
                  </Button>
                  {generatedDesignSystem && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setShowPreviewDialog(true)}
                      sx={{ color: '#4caf50', borderColor: '#4caf50' }}
                    >
                      👁️ Предпросмотр
                    </Button>
                  )}
                </Box>
              </Box>

              {generatedDesignSystem ? (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, color: '#9c27b0' }}>
                    🎯 Сгенерированная дизайн-система
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                      Скопируйте этот JSON и отправьте в GPT-5 для получения готового кода:
                    </Typography>
                    <Box sx={{ 
                      bgcolor: '#fff', 
                      p: 2, 
                      borderRadius: '4px', 
                      border: '1px solid #ddd',
                      maxHeight: '300px',
                      overflow: 'auto'
                    }}>
                      <pre style={{ 
                        margin: 0, 
                        fontSize: '12px', 
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}>
                        {JSON.stringify(generatedDesignSystem, null, 2)}
                      </pre>
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          const jsonWithDescription = `${jsonPromptDescription}\n\nJSON дизайн-системы:\n${JSON.stringify(generatedDesignSystem, null, 2)}`;
                          navigator.clipboard.writeText(jsonWithDescription);
                        }}
                        sx={{ bgcolor: '#9c27b0' }}
                      >
                        📋 Копировать JSON + Описание
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(generatedDesignSystem, null, 2))}
                        sx={{ color: '#9c27b0', borderColor: '#9c27b0' }}
                      >
                        📋 Только JSON
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setGeneratedDesignSystem(null)}
                      >
                        Очистить
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                    Нажмите "Сканировать элементы" для создания JSON дизайн-системы
                  </Typography>
                </Box>
              )}
              
              {/* Поле для ввода JSON от GPT-5 */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#ff9800' }}>
                  🚀 Применить стили от GPT-5
                </Typography>
                <Paper sx={{ p: 2, bgcolor: '#fff3e0', border: '1px solid #ffb74d', borderRadius: '8px' }}>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.7)' }}>
                    Вставьте JSON с готовыми стилями, полученный от GPT-5. Для элемента typography используйте поля: headingType, textColor, textAlign, customStyles.color, colorSettings.borderColor
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="Вставьте JSON с дизайн-системой от GPT-5..."
                    value={gpt5JsonInput}
                    onChange={(e) => setGpt5JsonInput(e.target.value)}
                    sx={{ mb: 2 }}
                    variant="outlined"
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleApplyGpt5Json()}
                      disabled={!gpt5JsonInput.trim()}
                      startIcon={<StyleIcon />}
                    >
                      🎨 Применить стили
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setGpt5JsonInput('')}
                    >
                      Очистить
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Paper>
        </AccordionDetails>
      </Accordion>
      
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
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mr: 0.5, 
                    fontSize: '0.7rem', 
                    color: singleStyleMode ? '#bdbdbd' : '#4caf50',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={applyRandomStyle}
                >
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
                <Typography 
                  variant="caption" 
                  sx={{ 
                    ml: 0.5, 
                    fontSize: '0.7rem', 
                    color: singleStyleMode ? '#4caf50' : '#bdbdbd',
                    cursor: 'pointer',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  onClick={applyRandomStyle}
                >
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
            currentStep={currentStep}
            showPromptModal={showPromptModal}
            setShowPromptModal={setShowPromptModal}
            generatedPrompt={generatedPrompt}
            setGeneratedPrompt={setGeneratedPrompt}
            setCurrentStep={setCurrentStep}
            completedSteps={completedSteps}
            setCompletedSteps={setCompletedSteps}
            globalSettings={globalSettings}
            getCurrentLanguage={getCurrentLanguage}
            getCurrentTheme={getCurrentTheme}
            setParserMessage={setParserMessage}
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
                <MenuItem value="FULL_SITE">Полный сайт</MenuItem>
                <MenuItem value="HERO">Hero секция</MenuItem>
                <MenuItem value="AI_ELEMENTS">🤖 AI Элементы (универсальный)</MenuItem>
                <MenuItem value="ABOUT">О нас</MenuItem>
                <MenuItem value="FEATURES">Преимущества</MenuItem>
                <MenuItem value="SERVICES">Услуги</MenuItem>
                <MenuItem value="TESTIMONIALS">Отзывы</MenuItem>
                <MenuItem value="FAQ">Вопросы и ответы</MenuItem>
                <MenuItem value="NEWS">Новости</MenuItem>
                <MenuItem value="CONTACTS">Свяжитесь с нами</MenuItem>
                <MenuItem value="MERCI">Сообщение благодарности</MenuItem>
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
              {targetSection === 'LEGAL' && (
                <Tooltip title="Скопировать оптимизированный промпт для правовых документов" arrow placement="top">
                  <span>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        const legalPrompt = applyGlobalSettings(generateLegalDocumentsPrompt());
                        navigator.clipboard.writeText(legalPrompt)
                          .then(() => {
                            setParserMessage('Оптимизированный промпт для правовых документов скопирован в буфер обмена.');
                            handleClearText();
                          })
                          .catch(() => {
                            setParserMessage('Не удалось скопировать промпт.');
                          });
                      }}
                      startIcon={<ContentCopyIcon sx={{ fontSize: '0.9rem' }} />}
                      sx={{
                        background: 'linear-gradient(45deg, #ed6c02 30%, #ff9800 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #e65100 30%, #f57c00 90%)'
                        }
                      }}
                    >
                      Промпт Legal
                    </Button>
                  </span>
                </Tooltip>              )}
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

          {/* Модальное окно для выбора элементов */}
          <Dialog 
            open={showElementSelector} 
            onClose={() => setShowElementSelector(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                📋 Выбор элементов для стилизации
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Найдено: ${scannedElements.length}`} 
                  size="small" 
                  color="primary" 
                />
                <Chip 
                  label={`Выбрано: ${selectedElements.size}`} 
                  size="small" 
                  color="secondary" 
                />
                <Chip 
                  label={`Обработано: ${processedElements.size}`} 
                  size="small" 
                  color="success" 
                />
                {processingHistory.length > 0 && (
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={clearProcessingHistory}
                    sx={{ ml: 'auto' }}
                  >
                    🔄 Сбросить историю
                  </Button>
                )}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(0,0,0,0.7)' }}>
                Выберите элементы для создания JSON. ✅ Зеленые элементы уже обрабатывались, но их можно выбрать повторно.
              </Typography>
              
              {processingHistory.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    📊 История обработки:
                  </Typography>
                  {processingHistory.slice(-3).map((entry, index) => (
                    <Typography key={index} variant="caption" sx={{ display: 'block', color: 'rgba(0,0,0,0.6)' }}>
                      {entry.timestamp}: Скопировано {entry.count} элементов
                    </Typography>
                  ))}
                </Paper>
              )}
              
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Checkbox
                    checked={scannedElements.every(el => selectedElements.has(el.id))}
                    indeterminate={scannedElements.some(el => selectedElements.has(el.id)) && !scannedElements.every(el => selectedElements.has(el.id))}
                    onChange={() => {
                      const allSelected = scannedElements.every(el => selectedElements.has(el.id));
                      setSelectedElements(allSelected ? new Set() : new Set(scannedElements.map(el => el.id)));
                    }}
                  />
                  <Typography variant="h6" sx={{ ml: 1, flex: 1 }}>
                    Все элементы ({scannedElements.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="body2">Режим JSON:</Typography>
                    <Button
                      size="small"
                      variant={jsonMode === 'ready' ? 'contained' : 'outlined'}
                      onClick={() => setJsonMode('ready')}
                      sx={{ minWidth: 80 }}
                    >
                      🎨 Готовый
                    </Button>
                    <Button
                      size="small"
                      variant={jsonMode === 'template' ? 'contained' : 'outlined'}
                      onClick={() => setJsonMode('template')}
                      sx={{ minWidth: 80 }}
                    >
                      🤖 Для GPT
                    </Button>
                  </Box>
                </Box>
                
                <List dense>
                  {scannedElements.map((element) => {
                    const status = getElementStatus(element.id);
                    const statusColors = {
                      processed: { bg: '#e8f5e8', border: '#4caf50', icon: '✅' },
                      selected: { bg: '#e3f2fd', border: '#2196f3', icon: '🔵' },
                      available: { bg: '#f5f5f5', border: '#e0e0e0', icon: '⚪' }
                    };
                    const statusColor = statusColors[status];
                    
                    return (
                      <ListItem 
                        key={element.id} 
                        sx={{ 
                          py: 0.5,
                          backgroundColor: statusColor.bg,
                          border: `1px solid ${statusColor.border}`,
                          borderRadius: 1,
                          mb: 0.5
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Checkbox
                            edge="start"
                            checked={selectedElements.has(element.id)}
                            onChange={() => toggleElementSelection(element.id)}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{statusColor.icon}</span>
                              <Chip 
                                label={`${element.elementIndex + 1}`} 
                                size="small" 
                                color="default" 
                                variant="outlined"
                                sx={{ minWidth: 24, height: 20, fontSize: '0.7rem' }}
                              />
                              <strong>{element.type}</strong> - {element.title}
                              {status === 'processed' && (
                                <Chip label="Обработан" size="small" color="success" variant="outlined" />
                              )}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="textSecondary">
                              Секция: {element.sectionTitle} • Позиция: {element.elementIndex + 1}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowElementSelector(false)}>
                Закрыть
              </Button>
              <Button
                variant="contained"
                onClick={generateSelectedElementsJSON}
                disabled={selectedElements.size === 0}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  }
                }}
              >
                📋 Копировать JSON ({selectedElements.size})
              </Button>
            </DialogActions>
          </Dialog>

          {/* Диалог предпросмотра промпта */}
          <Dialog 
            open={showPreviewDialog} 
            onClose={() => setShowPreviewDialog(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              👁️ Предпросмотр промпта для GPT-5
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(0, 0, 0, 0.7)' }}>
                Полный текст, который будет скопирован в буфер обмена:
              </Typography>
              <Box sx={{ 
                bgcolor: '#f8f9fa', 
                p: 2, 
                borderRadius: '8px', 
                border: '1px solid #e0e0e0',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                <pre style={{ 
                  margin: 0, 
                  fontSize: '12px', 
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace'
                }}>
                  {generatedDesignSystem ? `${jsonPromptDescription}\n\nJSON дизайн-системы:\n${JSON.stringify(generatedDesignSystem, null, 2)}` : 'Нет данных для предпросмотра'}
                </pre>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setShowPreviewDialog(false)}
                color="primary"
              >
                Закрыть
              </Button>
              <Button 
                onClick={() => {
                  if (generatedDesignSystem) {
                    const fullPrompt = `${jsonPromptDescription}\n\nJSON дизайн-системы:\n${JSON.stringify(generatedDesignSystem, null, 2)}`;
                    navigator.clipboard.writeText(fullPrompt);
                    setShowPreviewDialog(false);
                  }
                }}
                variant="contained"
                color="primary"
                disabled={!generatedDesignSystem}
              >
                📋 Копировать
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </AccordionDetails>
    </Accordion>

    {/* Модальное окно для показа промпта */}
    <Dialog open={showPromptModal} onClose={() => setShowPromptModal(false)} maxWidth="md" fullWidth>
      <DialogTitle>🤖 Промпт для нейросети</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Скопируйте этот промпт и вставьте в ChatGPT или другую нейросеть. Получите ответ в формате JSON и вставьте в поле "Ответ от нейросети" выше.
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={15}
          value={generatedPrompt}
          variant="outlined"
          InputProps={{
            readOnly: true,
            sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowPromptModal(false)}>
          Закрыть
        </Button>
        <Button 
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(generatedPrompt);
              setParserMessage('Промпт скопирован в буфер обмена!');
            } catch (err) {
              // Альтернативный способ копирования
              const textArea = document.createElement('textarea');
              textArea.value = generatedPrompt;
              document.body.appendChild(textArea);
              textArea.select();
              try {
                document.execCommand('copy');
                setParserMessage('Промпт скопирован в буфер обмена (альтернативный способ)!');
              } catch (fallbackErr) {
                setParserMessage('Ошибка при копировании. Выделите текст вручную и скопируйте.');
              }
              document.body.removeChild(textArea);
            }
          }}
          variant="contained"
          color="primary"
        >
          📋 Копировать промпт
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default AiParser; 
