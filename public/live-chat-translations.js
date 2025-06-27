/**
 * Live Chat Translations Utility
 * Работает с файлом live-chat-translations.json для получения переводов
 */
class LiveChatTranslations {
  constructor() {
    this.translations = null;
    this.currentLanguage = 'ru';
    this.supportedLanguages = [
      'ru', 'en', 'es', 'tr', 'de', 'it', 'pt', 'nl', 'ja', 'ko', 
      'he', 'hi', 'uk', 'zh', 'ar', 'fr', 'pl', 'cs', 'da', 'fi',
      'el', 'hu', 'no', 'ro', 'sv', 'th', 'vi', 'bg', 'sr', 'sk', 'sl'
    ];
  }

  /**
   * Загружает переводы из JSON файла
   */
  async loadTranslations() {
    try {
      const response = await fetch('/live-chat-translations.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.translations = await response.json();
      console.log(`✅ Loaded translations for ${this.translations.languages} languages`);
      return this.translations;
    } catch (error) {
      console.error('❌ Error loading translations:', error);
      // Fallback к базовым переводам
      this.translations = this.getFallbackTranslations();
      return this.translations;
    }
  }

  /**
   * Устанавливает текущий язык
   */
  setLanguage(langCode) {
    if (this.isLanguageSupported(langCode)) {
      this.currentLanguage = langCode;
      console.log(`🌐 Language set to: ${langCode}`);
    } else {
      console.warn(`⚠️ Language ${langCode} not supported, falling back to Russian`);
      this.currentLanguage = 'ru';
    }
  }

  /**
   * Проверяет поддержку языка
   */
  isLanguageSupported(langCode) {
    return this.supportedLanguages.includes(langCode);
  }

  /**
   * Получает случайный ответ для текущего языка
   */
  getRandomPresetResponse(langCode = null) {
    const lang = langCode || this.currentLanguage;
    
    if (!this.translations || !this.translations.presetResponses[lang]) {
      return this.getFallbackResponse(lang);
    }

    const responses = this.translations.presetResponses[lang];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  /**
   * Получает все ответы для языка
   */
  getAllPresetResponses(langCode = null) {
    const lang = langCode || this.currentLanguage;
    
    if (!this.translations || !this.translations.presetResponses[lang]) {
      return [this.getFallbackResponse(lang)];
    }

    return this.translations.presetResponses[lang];
  }

  /**
   * Получает финальное сообщение для языка
   */
  getFinalResponse(langCode = null) {
    const lang = langCode || this.currentLanguage;
    
    if (!this.translations || !this.translations.finalResponse || !this.translations.finalResponse[lang]) {
      return this.getFallbackFinalResponse(lang);
    }

    return this.translations.finalResponse[lang];
  }

  /**
   * Получает интерфейсные переводы
   */
  getInterface(langCode = null) {
    const lang = langCode || this.currentLanguage;
    
    if (!this.translations || !this.translations.interface || !this.translations.interface[lang]) {
      return this.getFallbackInterface(lang);
    }

    return this.translations.interface[lang];
  }

  /**
   * Получает заголовок чата
   */
  getChatTitle(langCode = null) {
    const interface = this.getInterface(langCode);
    return interface.title;
  }

  /**
   * Получает плейсхолдер для поля ввода
   */
  getInputPlaceholder(langCode = null) {
    const interface = this.getInterface(langCode);
    return interface.placeholder;
  }

  /**
   * Получает текст кнопки отправки
   */
  getSendButtonText(langCode = null) {
    const interface = this.getInterface(langCode);
    return interface.sendButton;
  }

  /**
   * Определяет язык по тексту пользователя (базовая логика)
   */
  detectLanguage(text) {
    if (!text || text.length < 3) return 'ru';

    const patterns = {
      'ru': /[а-яё]/i,
      'en': /^[a-z\s.,!?]+$/i,
      'es': /[ñáéíóúü]/i,
      'tr': /[çğıöşü]/i,
      'de': /[äöüß]/i,
      'it': /[àèéìíîòóù]/i,
      'fr': /[àâäçéèêëïîôùûüÿ]/i,
      'pt': /[ãâàáçéêíôõóú]/i,
      'pl': /[ąćęłńóśźż]/i,
      'zh': /[\u4e00-\u9fff]/,
      'ar': /[\u0600-\u06ff]/,
      'he': /[\u0590-\u05ff]/,
      'ja': /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/,
      'ko': /[\uac00-\ud7af]/,
      'hi': /[\u0900-\u097f]/,
      'th': /[\u0e00-\u0e7f]/,
      'vi': /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return 'en'; // По умолчанию английский если не определили
  }

  /**
   * Fallback переводы на случай ошибки загрузки
   */
  getFallbackTranslations() {
    return {
      version: "1.0-fallback",
      languages: 3,
      presetResponses: {
        ru: ["Спасибо за ваше сообщение! Мы обязательно поможем вам."],
        en: ["Thank you for your message! We will definitely help you."],
        es: ["¡Gracias por su mensaje! Definitivamente les ayudaremos."]
      },
      finalResponse: {
        ru: "Пожалуйста, заполните форму обратной связи внизу сайта 📝",
        en: "Please fill out the feedback form at the bottom of the site 📝",
        es: "Por favor completen el formulario de contacto en la parte inferior del sitio 📝"
      },
      interface: {
        ru: { title: "Онлайн-чат", placeholder: "Введите сообщение...", sendButton: "Отправить", typing: "печатает..." },
        en: { title: "Live Chat", placeholder: "Type message...", sendButton: "Send", typing: "typing..." },
        es: { title: "Chat en Vivo", placeholder: "Escribe mensaje...", sendButton: "Enviar", typing: "escribiendo..." }
      }
    };
  }

  getFallbackResponse(lang) {
    const fallback = {
      ru: "Спасибо за ваше сообщение! Мы обязательно поможем вам.",
      en: "Thank you for your message! We will definitely help you.",
      es: "¡Gracias por su mensaje! Definitivamente les ayudaremos."
    };
    return fallback[lang] || fallback.ru;
  }

  getFallbackFinalResponse(lang) {
    const fallback = {
      ru: "Пожалуйста, заполните форму обратной связи внизу сайта 📝",
      en: "Please fill out the feedback form at the bottom of the site 📝",
      es: "Por favor completen el formulario de contacto en la parte inferior del sitio 📝"
    };
    return fallback[lang] || fallback.ru;
  }

  getFallbackInterface(lang) {
    const fallback = {
      ru: { title: "Онлайн-чат", placeholder: "Введите сообщение...", sendButton: "Отправить", typing: "печатает..." },
      en: { title: "Live Chat", placeholder: "Type message...", sendButton: "Send", typing: "typing..." },
      es: { title: "Chat en Vivo", placeholder: "Escribe mensaje...", sendButton: "Enviar", typing: "escribiendo..." }
    };
    return fallback[lang] || fallback.ru;
  }

  /**
   * Получает статистику по языкам
   */
  getLanguageStats() {
    if (!this.translations) return null;

    const stats = {
      totalLanguages: this.translations.languages,
      supportedLanguages: this.supportedLanguages.length,
      currentLanguage: this.currentLanguage,
      version: this.translations.version
    };

    return stats;
  }

  /**
   * Инициализация с автоматической загрузкой
   */
  async init(defaultLanguage = 'ru') {
    await this.loadTranslations();
    this.setLanguage(defaultLanguage);
    console.log('🚀 LiveChatTranslations initialized');
    return this;
  }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LiveChatTranslations;
} else if (typeof window !== 'undefined') {
  window.LiveChatTranslations = LiveChatTranslations;
}

// Пример использования:
/*
const translator = new LiveChatTranslations();
await translator.init('ru');

// Получить случайный ответ
const response = translator.getRandomPresetResponse();

// Определить язык пользователя
const detectedLang = translator.detectLanguage("Hello world");
translator.setLanguage(detectedLang);

// Получить интерфейсные элементы
const interface = translator.getInterface();
console.log(interface.title); // "Live Chat"
*/ 