// Модуль настроек будет реализован позже 

class SettingsManager {
    constructor() {
        this.container = document.getElementById('settings');
        this.settings = {
            language: localStorage.getItem('language') || 'ru',
            currency: localStorage.getItem('currency') || 'RUB',
            theme: localStorage.getItem('theme') || 'light'
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
                    <h2 data-i18n="settings.language">Язык</h2>
                    <div class="settings-group">
                        <select id="languageSelect" class="settings-select">
                            <option value="ru" ${this.settings.language === 'ru' ? 'selected' : ''}>Русский</option>
                            <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                            <option value="de" ${this.settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
                        </select>
                    </div>
                </div>

                <div class="settings-card">
                    <h2 data-i18n="settings.currency">Валюта</h2>
                    <div class="settings-group">
                        <select id="currencySelect" class="settings-select">
                            <option value="RUB" ${this.settings.currency === 'RUB' ? 'selected' : ''}>Рубль (₽)</option>
                            <option value="USD" ${this.settings.currency === 'USD' ? 'selected' : ''}>Доллар ($)</option>
                            <option value="EUR" ${this.settings.currency === 'EUR' ? 'selected' : ''}>Евро (€)</option>
                        </select>
                    </div>
                </div>

                <div class="settings-card">
                    <h2 data-i18n="settings.data">Управление данными</h2>
                    <div class="settings-group">
                        <button class="export-btn" data-i18n="settings.export">
                            <i class="fas fa-download"></i> Экспорт данных
                        </button>
                        <div class="import-group">
                            <input type="file" id="importFile" accept=".json" style="display: none;">
                            <button class="import-btn" data-i18n="settings.import">
                                <i class="fas fa-upload"></i> Импорт данных
                            </button>
                        </div>
                        <button class="reset-btn" data-i18n="settings.reset">
                            <i class="fas fa-trash"></i> Сбросить все данные
                        </button>
                    </div>
                </div>
            </div>
        `;

        localization.updatePageLanguage();
    }

    setupEventListeners() {
        // Смена языка
        const languageSelect = this.container.querySelector('#languageSelect');
        languageSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            this.settings.language = newLang;
            localStorage.setItem('language', newLang);
            localization.setLanguage(newLang);
        });

        // Смена валюты
        const currencySelect = this.container.querySelector('#currencySelect');
        currencySelect.addEventListener('change', (e) => {
            const newCurrency = e.target.value;
            this.settings.currency = newCurrency;
            localStorage.setItem('currency', newCurrency);
            this.updateCurrencyDisplay();
        });

        // Экспорт данных
        const exportBtn = this.container.querySelector('.export-btn');
        exportBtn.addEventListener('click', () => {
            this.exportData();
        });

        // Импорт данных
        const importBtn = this.container.querySelector('.import-btn');
        const importFile = this.container.querySelector('#importFile');
        importBtn.addEventListener('click', () => {
            importFile.click();
        });
        importFile.addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });

        // Сброс данных
        const resetBtn = this.container.querySelector('.reset-btn');
        resetBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
                this.resetData();
            }
        });
    }

    updateCurrencyDisplay() {
        // Обновляем отображение валюты во всех модулях
        const currencySymbols = {
            'RUB': '₽',
            'USD': '$',
            'EUR': '€'
        };
        const symbol = currencySymbols[this.settings.currency];

        // Обновляем в финансовом модуле
        document.querySelectorAll('.balance-amount, .transaction-amount').forEach(el => {
            const amount = el.textContent.replace(/[^0-9.-]/g, '');
            el.textContent = `${amount} ${symbol}`;
        });
    }

    exportData() {
        const data = {
            transactions: JSON.parse(localStorage.getItem('transactions')) || [],
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            settings: this.settings
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-app-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async importData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (data.transactions) {
                localStorage.setItem('transactions', JSON.stringify(data.transactions));
            }
            if (data.notes) {
                localStorage.setItem('notes', JSON.stringify(data.notes));
            }
            if (data.settings) {
                Object.entries(data.settings).forEach(([key, value]) => {
                    localStorage.setItem(key, value);
                    this.settings[key] = value;
                });
            }

            // Перезагружаем страницу для применения изменений
            location.reload();
        } catch (error) {
            alert('Ошибка при импорте данных. Проверьте формат файла.');
        }
    }

    resetData() {
        localStorage.clear();
        location.reload();
    }
}

// Инициализация модуля настроек
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();
}); 