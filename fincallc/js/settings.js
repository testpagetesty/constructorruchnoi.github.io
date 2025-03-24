// Модуль настроек будет реализован позже 

class SettingsManager {
    constructor() {
        this.container = document.getElementById('settings');
        this.settings = {
            language: localStorage.getItem('language') || 'ru',
            currency: localStorage.getItem('currency') || 'RUB'
        };
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="settings-container">
                <div class="settings-card">
                    <h2>Язык</h2>
                    <div class="settings-group">
                        <select id="languageSelect" class="settings-select">
                            <option value="ru" ${this.settings.language === 'ru' ? 'selected' : ''}>Русский</option>
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="de" ${this.settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
                        </select>
                    </div>
                </div>

                <div class="settings-card">
                    <h2>Валюта</h2>
                    <div class="settings-group">
                        <select id="currencySelect" class="settings-select">
                            <option value="RUB" ${this.settings.currency === 'RUB' ? 'selected' : ''}>Рубль (₽)</option>
                            <option value="USD" ${this.settings.currency === 'USD' ? 'selected' : ''}>Доллар ($)</option>
                            <option value="EUR" ${this.settings.currency === 'EUR' ? 'selected' : ''}>Евро (€)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Смена языка
        const languageSelect = this.container.querySelector('#languageSelect');
        languageSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            this.settings.language = newLang;
            localStorage.setItem('language', newLang);
            this.updateLanguage(newLang);
        });

        // Смена валюты
        const currencySelect = this.container.querySelector('#currencySelect');
        currencySelect.addEventListener('change', (e) => {
            const newCurrency = e.target.value;
            this.settings.currency = newCurrency;
            localStorage.setItem('currency', newCurrency);
            this.updateCurrencyDisplay();
        });
    }

    updateLanguage(lang) {
        const translations = {
            ru: {
                'finance.balance': 'Баланс',
                'finance.income': 'Доход',
                'finance.expense': 'Расход',
                'finance.addTransaction': 'Добавить транзакцию',
                'notes.title': 'Заметки',
                'notes.addNote': 'Добавить заметку',
                'notes.search': 'Поиск заметок...',
                'settings.title': 'Настройки'
            },
            en: {
                'finance.balance': 'Balance',
                'finance.income': 'Income',
                'finance.expense': 'Expense',
                'finance.addTransaction': 'Add Transaction',
                'notes.title': 'Notes',
                'notes.addNote': 'Add Note',
                'notes.search': 'Search notes...',
                'settings.title': 'Settings'
            },
            de: {
                'finance.balance': 'Kontostand',
                'finance.income': 'Einkommen',
                'finance.expense': 'Ausgabe',
                'finance.addTransaction': 'Transaktion hinzufügen',
                'notes.title': 'Notizen',
                'notes.addNote': 'Notiz hinzufügen',
                'notes.search': 'Notizen suchen...',
                'settings.title': 'Einstellungen'
            }
        };

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });
    }

    updateCurrencyDisplay() {
        const currencySymbols = {
            'RUB': '₽',
            'USD': '$',
            'EUR': '€'
        };
        const symbol = currencySymbols[this.settings.currency];

        // Обновляем отображение валюты во всех элементах с классом currency-value
        document.querySelectorAll('.currency-value').forEach(el => {
            const amount = el.textContent.replace(/[^0-9.-]/g, '');
            el.textContent = `${amount} ${symbol}`;
        });
    }
}

// Инициализация модуля настроек
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();
}); 