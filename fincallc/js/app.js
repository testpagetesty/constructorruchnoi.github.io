class App {
    constructor() {
        this.currentSection = 'finance';
        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
    }

    switchSection(sectionId) {
        // Обновляем навигацию
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Обновляем видимость секций
        document.querySelectorAll('.section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        this.currentSection = sectionId;
    }
}

const app = new App();

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация навигации
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            
            // Обновляем активный пункт меню
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Показываем нужную секцию
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // Инициализация языка при загрузке
    const currentLang = localStorage.getItem('language') || 'ru';
    const settingsManager = new SettingsManager();
    settingsManager.updateLanguage(currentLang);
}); 