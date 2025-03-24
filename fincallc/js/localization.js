class Localization {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'ru';
        this.translations = {};
    }

    async init() {
        try {
            const response = await fetch('/locales/translations.json');
            this.translations = await response.json();
            this.updatePageLanguage();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updatePageLanguage();
    }

    updatePageLanguage() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.translate(key);
        });
    }

    translate(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return value;
    }
}

const localization = new Localization();
document.addEventListener('DOMContentLoaded', () => localization.init()); 