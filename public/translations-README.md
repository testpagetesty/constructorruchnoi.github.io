# 🌐 Live Chat Translations System

Система переводов для лайв чата с поддержкой 31 языка.

## 📁 Файлы системы

- `live-chat-translations.json` - JSON файл со всеми переводами
- `live-chat-translations.js` - JavaScript утилита для работы с переводами
- `translations-example.html` - Пример использования системы

## 🚀 Быстрый старт

```javascript
// Инициализация
const translator = new LiveChatTranslations();
await translator.init('ru'); // Установить русский как язык по умолчанию

// Получить случайный ответ
const response = translator.getRandomPresetResponse();
console.log(response); // "Рады, что вы к нам обратились! 😊"

// Сменить язык
translator.setLanguage('en');
const englishResponse = translator.getRandomPresetResponse();
console.log(englishResponse); // "Glad you contacted us! 😊"
```

## 📋 Поддерживаемые языки (31)

| Код | Язык | Код | Язык |
|-----|------|-----|------|
| `ru` | Русский | `en` | English |
| `es` | Español | `tr` | Türkçe |
| `de` | Deutsch | `it` | Italiano |
| `pt` | Português | `nl` | Nederlands |
| `ja` | 日本語 | `ko` | 한국어 |
| `he` | עברית | `hi` | हिन्दी |
| `uk` | Українська | `zh` | 中文 |
| `ar` | العربية | `fr` | Français |
| `pl` | Polski | `cs` | Čeština |
| `da` | Dansk | `fi` | Suomi |
| `el` | Ελληνικά | `hu` | Magyar |
| `no` | Norsk | `ro` | Română |
| `sv` | Svenska | `th` | ไทย |
| `vi` | Tiếng Việt | `bg` | Български |
| `sr` | Српски | `sk` | Slovenčina |
| `sl` | Slovenščina | | |

## 🔧 API методы

### Основные методы

```javascript
// Инициализация
await translator.init('ru');

// Установка языка
translator.setLanguage('en');

// Получение переводов
translator.getRandomPresetResponse();     // Случайный ответ
translator.getAllPresetResponses();       // Все ответы для языка
translator.getFinalResponse();            // Финальное сообщение
translator.getInterface();                // Интерфейсные элементы

// Проверки
translator.isLanguageSupported('en');     // true/false
translator.detectLanguage('Hello world'); // 'en'
translator.getLanguageStats();            // Статистика системы
```

### Интерфейсные элементы

```javascript
const interface = translator.getInterface();
console.log(interface.title);        // "Live Chat"
console.log(interface.placeholder);  // "Type your message..."
console.log(interface.sendButton);   // "Send"
console.log(interface.typing);       // "typing..."
```

## 📊 Структура JSON файла

```json
{
  "version": "1.0",
  "languages": 31,
  "presetResponses": {
    "ru": [
      "Рады, что вы к нам обратились! 😊",
      "Спасибо за ваше сообщение!",
      // ... еще 4 варианта
    ],
    "en": [
      "Glad you contacted us! 😊",
      "Thank you for your message!",
      // ... еще 4 варианта
    ]
    // ... остальные языки
  },
  "finalResponse": {
    "ru": "Пожалуйста, заполните форму обратной связи внизу сайта 📝",
    "en": "Please fill out the feedback form at the bottom of the site 📝"
    // ... остальные языки
  },
  "interface": {
    "ru": {
      "title": "Онлайн-чат",
      "placeholder": "Введите ваше сообщение...",
      "sendButton": "Отправить",
      "typing": "печатает..."
    }
    // ... остальные языки
  }
}
```

## 🎯 Использование в конструкторе

Для использования в конструкторе сайта:

```javascript
// В liveChatExporter.js
import LiveChatTranslations from './live-chat-translations.js';

export const generateLiveChatWithTranslations = async (siteName, language = 'ru') => {
  const translator = new LiveChatTranslations();
  await translator.init(language);
  
  const interface = translator.getInterface(language);
  const responses = translator.getAllPresetResponses(language);
  
  // Генерация HTML с переводами
  const html = `
    <div class="chat-header">
      <span>${interface.title}</span>
    </div>
    <input placeholder="${interface.placeholder}">
    <button>${interface.sendButton}</button>
  `;
  
  // Генерация JS с ответами
  const jsCode = `
    const presetResponses = ${JSON.stringify(responses)};
    const finalMessage = "${translator.getFinalResponse(language)}";
  `;
  
  return { html, jsCode };
};
```

## 🔍 Определение языка

Система может автоматически определять язык по тексту пользователя:

```javascript
const detectedLang = translator.detectLanguage("Привет, как дела?"); // 'ru'
const detectedLang2 = translator.detectLanguage("Hello world");      // 'en'
const detectedLang3 = translator.detectLanguage("¡Hola mundo!");     // 'es'
```

## 🛠️ Fallback система

Если переводы не загрузились, система автоматически использует базовые переводы для 3 языков (ru, en, es).

## 📝 Примеры использования

Посмотрите файл `translations-example.html` для полного примера работы с системой.

---

**Система готова к использованию в конструкторе для генерации многоязычных лайв чатов!** 🚀 