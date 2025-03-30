// Состояние приложения
const state = {
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),
    transactions: JSON.parse(localStorage.getItem('transactions')) || [],
    selectedCategory: null,
    currentPage: 'main',
    categoryPositions: {
        expense: JSON.parse(localStorage.getItem('expenseCategoryPositions')) || {},
        income: JSON.parse(localStorage.getItem('incomeCategoryPositions')) || {}
    },
    dragState: {
        isDragging: false,
        dragElement: null,
        dragClone: null,
        longPressTimer: null,
        initialX: 0,
        initialY: 0,
        currentX: 0,
        currentY: 0,
        offsetX: 0,
        offsetY: 0
    }
};

// Объект состояния настроек приложения
const settingsState = {
    currency: 'RUB',
    currencySymbol: '₽',
    language: 'ru',
    remindersEnabled: true,
    reminders: [
        {
            id: 'default-reminder',
            title: 'Ежедневное напоминание',
            time: '18:00',
            repeat: 'daily',
            message: 'Не забудьте внести свои финансы за сегодня',
            enabled: true
        }
    ],
    soundEnabled: true
};

// Объект для хранения данных пользователя после авторизации
let userProfile = {
    isSignedIn: false,
    id: null,
    name: null,
    email: null,
    imageUrl: null
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOM полностью загружен');
    
    // Загружаем и применяем сохраненные позиции категорий
    loadCategoryPositions();
    
    // Инициализация страницы
    updateDateDisplay();
    updateTransactionsDisplay();
    setupNavigation();
    
    // Инициализация настроек
    initializeSettings();
    
    // Проверяем, есть ли страница настроек
    const settingsPage = document.getElementById('settings');
    if (settingsPage) {
        console.log('[DEBUG] Найдена страница настроек при загрузке DOM');
    } else {
        console.warn('[DEBUG] Не найдена страница настроек при загрузке DOM');
    }
    
    // Обработчики для кнопки добавления
    const addButton = document.querySelector('.add-button');
    addButton.addEventListener('click', () => {
        document.querySelector('.transaction-type-modal').classList.add('active');
    });
    
    // Обработчик для кнопки "назад" в модальном окне выбора типа операции
    const backButton = document.querySelector('.transaction-type-modal .back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            document.querySelector('.transaction-type-modal').classList.remove('active');
            
            // Возвращаем активное состояние на главную страницу
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(navItem => navItem.classList.remove('active'));
            const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
            if (mainNavItem) {
                mainNavItem.classList.add('active');
            }
            
            // Показываем главную страницу
            const pages = document.querySelectorAll('.content');
            pages.forEach(page => page.classList.remove('active'));
            const mainPage = document.getElementById('main');
            if (mainPage) {
                mainPage.classList.add('active');
            }
        });
    }
    
    // Инициализация перетаскивания категорий
    initializeDragAndDrop();
    
    // Обработчики для типов транзакций
    document.querySelectorAll('.type-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.type-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const type = button.dataset.type;
            document.querySelectorAll('.categories-grid').forEach(grid => grid.classList.remove('active'));
            
            if (type === 'expense') {
                document.querySelector('.expense-categories').classList.add('active');
            } else if (type === 'income') {
                document.querySelector('.income-categories').classList.add('active');
            } else if (type === 'transfer') {
                document.querySelector('.transfer-categories').classList.add('active');
            }
        });
    });
    
    // Обработчики навигации по месяцам НА ГЛАВНОЙ странице
    const mainPage = document.getElementById('main');
    if (mainPage) {
        const prevMonthMain = mainPage.querySelector('.prev-month');
        const nextMonthMain = mainPage.querySelector('.next-month');
        
        if (prevMonthMain) {
            prevMonthMain.addEventListener('click', () => {
                if (state.selectedMonth === 0) {
                    state.selectedMonth = 11;
                    state.selectedYear--;
                } else {
                    state.selectedMonth--;
                }
                updateDateDisplay();
                updateTransactionsDisplay();
            });
        }
        
        if (nextMonthMain) {
            nextMonthMain.addEventListener('click', () => {
                if (state.selectedMonth === 11) {
                    state.selectedMonth = 0;
                    state.selectedYear++;
                } else {
                    state.selectedMonth++;
                }
                updateDateDisplay();
                updateTransactionsDisplay();
            });
        }
    }
    
    // Обработчик выбора категории
    document.querySelector('.transaction-type-modal').querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Проверяем, что клик был именно по категории в модальном окне выбора типа операции
            if (!e.target.closest('.transaction-type-modal')) {
                return;
            }

            const category = item.dataset.category;
            const type = document.querySelector('.type-button.active').dataset.type;
            
            // Если категория уже выбрана, снимаем выбор
            if (item.classList.contains('selected')) {
                item.classList.remove('selected');
                hidePopupForm();
                state.selectedCategory = null;
                return;
            }

            // Снимаем выделение со всех категорий
            document.querySelector('.transaction-type-modal').querySelectorAll('.category-item').forEach(cat => {
                cat.classList.remove('selected');
            });

            // Выделяем выбранную категорию
            item.classList.add('selected');
            state.selectedCategory = category;

            // Заполняем скрытые поля
            document.getElementById('popup-category').value = category;
            document.getElementById('popup-type').value = type;

            // Устанавливаем текущую дату
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('popup-date').value = today;

            // Показываем форму
            showPopupForm();
        });
    });

    // Обработчик сохранения транзакции
    document.getElementById('popup-submit').addEventListener('click', () => {
        const amount = document.getElementById('popup-amount').value;
        const date = document.getElementById('popup-date').value;
        const note = document.getElementById('popup-note').value;
        const category = document.getElementById('popup-category').value;
        const type = document.getElementById('popup-type').value;
        const editId = document.querySelector('.popup-form').dataset.editId;

        if (!amount || !category || !date) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const transaction = {
            id: editId ? parseInt(editId) : Date.now(),
            amount: parseFloat(amount),
            category,
            type,
            date,
            note
        };

        saveTransaction(transaction);
        
        // Очищаем форму
        document.getElementById('popup-amount').value = '';
        document.getElementById('popup-note').value = '';
        document.getElementById('popup-category').value = '';
        document.getElementById('popup-type').value = '';
        document.getElementById('popup-date').value = '';
        document.querySelector('.popup-form').dataset.editId = '';
        
        // Скрываем форму
        hidePopupForm();
        
        // Снимаем выделение с категории
        document.querySelectorAll('.category-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Обновляем список транзакций и сводку
        updateTransactionsList();
        updateSummary();
    });

    // Инициализация функционала переводов
    initializeTransfers();

    // Инициализация выбора периода вместо календаря
    // initializePeriodSelector();

    // Инициализация календаря
    initializeCalendar();

    // Инициализация отчетов
    initializeReports();

    // Инициализация Google Sign-In
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 1000);
});

// Функции для работы с данными
function loadData() {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        state.transactions = JSON.parse(savedTransactions);
    }
}

function saveData() {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
}

// Функции обновления интерфейса
function updateDateDisplay() {
    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    const monthElement = document.querySelector('.month');
    const yearElement = document.querySelector('.year');
    
    if (monthElement && yearElement) {
        monthElement.textContent = monthNames[state.selectedMonth];
        yearElement.textContent = state.selectedYear;
    }
}

function updateTransactionsDisplay() {
    const transactions = document.querySelector('.transactions');
    const noRecords = document.querySelector('.no-records');
    
    if (state.transactions.length === 0) {
        if (noRecords) noRecords.style.display = 'flex';
        return;
    }
    
    if (noRecords) noRecords.style.display = 'none';
    
    // Фильтрация транзакций по текущему месяцу
    const currentTransactions = state.transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === state.selectedMonth && 
               date.getFullYear() === state.selectedYear;
    });
    
    // Обновление сумм
    updateSummary(currentTransactions);
}

function updateSummary(transactions = []) {
    // Если транзакции не переданы, получаем их из текущего месяца
    if (!transactions || transactions.length === 0) {
        transactions = getTransactions().filter(transaction => {
            const date = new Date(transaction.date);
            return date.getMonth() === state.selectedMonth && 
                   date.getFullYear() === state.selectedYear;
        });
    }
    
    let expenses = 0;
    let income = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'expense') {
            expenses += parseFloat(transaction.amount) || 0;
        } else {
            income += parseFloat(transaction.amount) || 0;
        }
    });
    
    const balance = income - expenses;
    
    // Проверяем существование элементов перед обновлением
    const expenseElement = document.querySelector('.expense');
    const incomeElement = document.querySelector('.income');
    const balanceElement = document.querySelector('.balance');
    
    if (expenseElement) expenseElement.textContent = formatAmount(expenses);
    if (incomeElement) incomeElement.textContent = formatAmount(income);
    if (balanceElement) balanceElement.textContent = formatAmount(balance);
}

// Вспомогательные функции
function formatAmount(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function showPopupForm(transaction = null) {
    const popupForm = document.querySelector('.popup-form');
    
    if (transaction) {
        // Режим редактирования
        document.getElementById('popup-amount').value = transaction.amount;
        document.getElementById('popup-date').value = transaction.date;
        document.getElementById('popup-note').value = transaction.note || '';
        document.getElementById('popup-category').value = transaction.category;
        document.getElementById('popup-type').value = transaction.type;
        popupForm.dataset.editId = transaction.id;
    } else {
        // Режим добавления
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('popup-date').value = today;
        popupForm.dataset.editId = '';
    }
    
    popupForm.classList.add('active');
    document.getElementById('popup-amount').focus();
}

function hidePopupForm() {
    const popupForm = document.querySelector('.popup-form');
    popupForm.classList.remove('active');
    
    // Очищаем все поля формы
    document.getElementById('popup-amount').value = '';
    document.getElementById('popup-note').value = '';
    document.getElementById('popup-category').value = '';
    document.getElementById('popup-type').value = '';
    document.getElementById('popup-date').value = '';
    popupForm.dataset.editId = '';
    
    // Снимаем выделение с категорий
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// Настройка навигации
function setupNavigation() {
    console.log('[DEBUG] Настройка навигации');
    
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.content');
    
    console.log(`[DEBUG] Найдено ${navItems.length} элементов навигации и ${pages.length} страниц`);
    
    // Проверяем, есть ли элемент навигации для настроек
    const settingsNavItem = document.querySelector('.nav-item[data-page="settings"]');
    if (settingsNavItem) {
        console.log('[DEBUG] Найден элемент навигации для настроек');
    } else {
        console.warn('[DEBUG] Не найден элемент навигации для настроек');
    }
    
    // Проверяем, есть ли страница настроек
    const settingsPage = document.getElementById('settings');
    if (settingsPage) {
        console.log('[DEBUG] Найдена страница настроек');
    } else {
        console.warn('[DEBUG] Не найдена страница настроек');
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageName = item.dataset.page;
            console.log(`[DEBUG] Клик по навигации: ${pageName}`);
            
            // Обработка специального случая - категории
            if (pageName === 'categories') {
                console.log('[DEBUG] Открытие модального окна категорий');
                document.querySelector('.transaction-type-modal').classList.add('active');
                
                // Убираем активный класс со всех навигационных элементов
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Добавляем активный класс на выбранный элемент
                item.classList.add('active');
                
                return;
            }
            
            // Скрываем все страницы
            pages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');
            });
            
            // Убираем активный класс со всех навигационных элементов
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Добавляем активный класс на выбранный элемент
            item.classList.add('active');
            
            // Показываем выбранную страницу
            const currentPage = document.getElementById(pageName);
            if (currentPage) {
                currentPage.style.display = 'block';
                currentPage.classList.add('active');
                state.currentPage = pageName;
                
                console.log(`[DEBUG] Переключение на страницу: ${pageName}`);
                
                // Дополнительные действия при переключении на определенные страницы
                if (pageName === 'reports') {
                    // Обновляем отчеты при переходе на страницу отчетов
                    console.log('[DEBUG] Обновление отчетов');
                    updateReport(true);
                } else if (pageName === 'settings') {
                    // При переходе на страницу настроек обновляем их отображение
                    console.log('[DEBUG] Обновление страницы настроек');
                    
                    // Проверяем, есть ли элементы настроек на странице
                    const settingsItems = document.querySelectorAll('.settings-item');
                    console.log(`[DEBUG] Элементы настроек на странице: ${settingsItems.length}`);
                }
            } else {
                console.error(`[DEBUG] Страница ${pageName} не найдена`);
            }
            
            // Закрываем любые открытые модальные окна при переключении страницы
            document.querySelectorAll('.modal.active').forEach(modal => {
                if (!modal.classList.contains('transaction-type-modal') || pageName !== 'categories') {
                    modal.classList.remove('active');
                }
            });
            
            // Если переходим не на страницу категорий, закрываем модальное окно выбора типа операции
            if (pageName !== 'categories') {
                const transactionTypeModal = document.querySelector('.transaction-type-modal');
                if (transactionTypeModal) {
                    transactionTypeModal.classList.remove('active');
                }
            }
        });
    });
    
    // По умолчанию активна главная страница
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    const mainPage = document.getElementById('main');
    if (mainPage) {
        mainPage.style.display = 'block';
        mainPage.classList.add('active');
    }
    
    // Активируем кнопку главной страницы
    navItems.forEach(nav => nav.classList.remove('active'));
    const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
    if (mainNavItem) {
        mainNavItem.classList.add('active');
    }
    
    console.log('[DEBUG] Навигация настроена');
}

// Функции для работы с позициями категорий
function loadCategoryPositions() {
    const expenseGrid = document.querySelector('.expense-categories');
    const incomeGrid = document.querySelector('.income-categories');
    
    // Загружаем позиции для расходов
    if (expenseGrid && Object.keys(state.categoryPositions.expense).length > 0) {
        const expenseItems = Array.from(expenseGrid.children);
        const sortedExpenseItems = expenseItems.sort((a, b) => {
            const posA = state.categoryPositions.expense[a.dataset.category] || 0;
            const posB = state.categoryPositions.expense[b.dataset.category] || 0;
            return posA - posB;
        });
        
        sortedExpenseItems.forEach(item => {
            expenseGrid.appendChild(item);
        });
    }
    
    // Загружаем позиции для доходов
    if (incomeGrid && Object.keys(state.categoryPositions.income).length > 0) {
        const incomeItems = Array.from(incomeGrid.children);
        const sortedIncomeItems = incomeItems.sort((a, b) => {
            const posA = state.categoryPositions.income[a.dataset.category] || 0;
            const posB = state.categoryPositions.income[b.dataset.category] || 0;
            return posA - posB;
        });
        
        sortedIncomeItems.forEach(item => {
            incomeGrid.appendChild(item);
        });
    }
}

function saveCategoryPositions() {
    const expenseGrid = document.querySelector('.expense-categories');
    const incomeGrid = document.querySelector('.income-categories');
    
    // Сохраняем позиции расходов
    if (expenseGrid) {
        const expensePositions = {};
        Array.from(expenseGrid.children).forEach((item, index) => {
            expensePositions[item.dataset.category] = index;
        });
        state.categoryPositions.expense = expensePositions;
        localStorage.setItem('expenseCategoryPositions', JSON.stringify(expensePositions));
    }
    
    // Сохраняем позиции доходов
    if (incomeGrid) {
        const incomePositions = {};
        Array.from(incomeGrid.children).forEach((item, index) => {
            incomePositions[item.dataset.category] = index;
        });
        state.categoryPositions.income = incomePositions;
        localStorage.setItem('incomeCategoryPositions', JSON.stringify(incomePositions));
    }
}

// Функции для перетаскивания
function initializeDragAndDrop() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        // Обработчики для мобильных устройств
        item.addEventListener('touchstart', handleTouchStart, { passive: false });
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
        
        // Обработчики для мыши
        item.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(e.target.closest('.category-item'), touch.clientX, touch.clientY);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!state.dragState.isDragging) return;
    
    const touch = e.touches[0];
    moveDrag(touch.clientX, touch.clientY);
}

function handleTouchEnd() {
    endDrag();
}

function handleMouseDown(e) {
    e.preventDefault();
    startDrag(e.target.closest('.category-item'), e.clientX, e.clientY);
}

function handleMouseMove(e) {
    if (!state.dragState.isDragging) return;
    moveDrag(e.clientX, e.clientY);
}

function handleMouseUp() {
    endDrag();
}

function startDrag(element, x, y) {
    // Запускаем таймер для определения долгого нажатия
    state.dragState.longPressTimer = setTimeout(() => {
        state.dragState.isDragging = true;
        state.dragState.dragElement = element;
        state.dragState.initialX = x;
        state.dragState.initialY = y;
        state.dragState.currentX = x;
        state.dragState.currentY = y;
        
        // Создаем клон элемента
        const clone = element.cloneNode(true);
        clone.classList.add('category-clone');
        document.body.appendChild(clone);
        state.dragState.dragClone = clone;
        
        // Вычисляем смещение от точки касания до центра элемента
        const rect = element.getBoundingClientRect();
        state.dragState.offsetX = rect.width / 2;
        state.dragState.offsetY = rect.height / 2;
        
        // Позиционируем клон
        updateClonePosition(x, y);
        
        element.classList.add('shake');
    }, 500);
}

function moveDrag(x, y) {
    if (!state.dragState.isDragging) return;
    
    state.dragState.currentX = x;
    state.dragState.currentY = y;
    
    updateClonePosition(x, y);
    
    // Проверяем элемент под курсором/пальцем
    const elementBelow = document.elementFromPoint(x, y);
    const categoryBelow = elementBelow?.closest('.category-item');
    
    // Убираем подсветку со всех категорий
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    // Подсвечиваем категорию под курсором/пальцем
    if (categoryBelow && categoryBelow !== state.dragState.dragElement) {
        categoryBelow.classList.add('drag-over');
    }
}

function updateClonePosition(x, y) {
    if (!state.dragState.dragClone) return;
    
    const left = x - state.dragState.offsetX;
    const top = y - state.dragState.offsetY;
    
    state.dragState.dragClone.style.left = `${left}px`;
    state.dragState.dragClone.style.top = `${top}px`;
}

function endDrag() {
    // Очищаем таймер долгого нажатия
    if (state.dragState.longPressTimer) {
        clearTimeout(state.dragState.longPressTimer);
    }
    
    if (!state.dragState.isDragging) return;
    
    const draggedElement = state.dragState.dragElement;
    const dropTarget = document.elementFromPoint(state.dragState.currentX, state.dragState.currentY);
    const dropCategory = dropTarget?.closest('.category-item');
    
    if (dropCategory && dropCategory !== draggedElement) {
        // Меняем местами категории
        const draggedHTML = draggedElement.innerHTML;
        const draggedDataset = { ...draggedElement.dataset };
        
        draggedElement.innerHTML = dropCategory.innerHTML;
        Object.keys(dropCategory.dataset).forEach(key => {
            draggedElement.dataset[key] = dropCategory.dataset[key];
        });
        
        dropCategory.innerHTML = draggedHTML;
        Object.keys(draggedDataset).forEach(key => {
            dropCategory.dataset[key] = draggedDataset[key];
        });
        
        // Сохраняем новые позиции
        saveCategoryPositions();
    }
    
    // Удаляем клон
    if (state.dragState.dragClone) {
        state.dragState.dragClone.remove();
        state.dragState.dragClone = null;
    }
    
    // Очищаем стили и классы
    draggedElement.classList.remove('shake');
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('drag-over');
    });
    
    // Сбрасываем состояние перетаскивания
    state.dragState.isDragging = false;
    state.dragState.dragElement = null;
}

// Объединенный функционал переводов
function initializeTransfers() {
    const transferPlanner = document.querySelector('.transfer-planner');
    const plannedTransfers = document.querySelector('.planned-transfers');
    const bankSelects = document.querySelectorAll('.bank-select');
    
    // Обработка клика по компактному представлению формы
    if (transferPlanner) {
        // Открытие формы
        transferPlanner.addEventListener('click', (e) => {
            if (transferPlanner.classList.contains('collapsed') && !e.target.closest('.transfer-form')) {
                transferPlanner.classList.remove('collapsed');
                // Очищаем форму при открытии
                const transferForm = transferPlanner.querySelector('.transfer-form');
                if (transferForm) {
                    transferForm.reset();
                    delete transferForm.dataset.editId;
                    const saveButton = transferForm.querySelector('.save-transfer');
                    if (saveButton) {
                        saveButton.textContent = 'Сохранить';
                        saveButton.disabled = false;
                    }
                }
            }
        });

        // Обработка клика по кнопке сворачивания
        const collapseButton = transferPlanner.querySelector('.collapse-button');
        if (collapseButton) {
            collapseButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                transferPlanner.classList.add('collapsed');
            });
        }

        // Закрытие формы при клике вне её
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.transfer-planner') && !transferPlanner.classList.contains('collapsed')) {
                transferPlanner.classList.add('collapsed');
            }
        });
    }

    // Обработка выбора "Другой" банк
    bankSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            if (e.target.value === 'other') {
                const customBankName = prompt('Введите название банка:');
                if (customBankName) {
                    const option = document.createElement('option');
                    option.value = 'custom_' + customBankName.toLowerCase().replace(/\s+/g, '_');
                    option.textContent = customBankName;
                    
                    const otherOption = e.target.querySelector('option[value="other"]');
                    e.target.insertBefore(option, otherOption);
                    e.target.value = option.value;
                } else {
                    e.target.value = '';
                }
            }
        });
    });

    // Обработчик сохранения формы
    const transferForm = document.querySelector('.transfer-form');
    if (transferForm) {
        const saveButton = transferForm.querySelector('.save-transfer');
        const scheduleDayInput = transferForm.querySelector('.schedule-field input');
        
        // Добавляем валидацию для поля дня
        scheduleDayInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value)) {
                e.target.value = '';
            } else if (value < 1) {
                e.target.value = '1';
            } else if (value > 31) {
                e.target.value = '31';
            }
        });

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const fromBank = transferForm.querySelector('.bank-from .bank-select').value;
            const fromAccount = transferForm.querySelector('.bank-from .account-number').value;
            const toBank = transferForm.querySelector('.bank-to .bank-select').value;
            const toAccount = transferForm.querySelector('.bank-to .account-number').value;
            const amount = transferForm.querySelector('.amount-field input').value;
            const scheduleDay = transferForm.querySelector('.schedule-field input').value;
            const note = transferForm.querySelector('.note-field input').value;

            // Создаем и сохраняем перевод
            const transfer = {
                fromBank,
                fromAccount,
                toBank,
                toAccount,
                amount: parseFloat(amount),
                scheduleDay: parseInt(scheduleDay),
                note,
                id: Date.now()
            };

            // Сохраняем перевод
            saveTransfer(transfer);

            // Очищаем форму после сохранения
            transferForm.reset();
            delete transferForm.dataset.editId;
            saveButton.textContent = 'Сохранить';

            // Сворачиваем форму
            transferPlanner.classList.add('collapsed');
        });
    }

    // Загружаем сохраненные переводы при инициализации
    loadSavedTransfers();
}

// Вспомогательные функции для работы с переводами
function createTransferItem(transfer) {
    const transferItem = document.createElement('div');
    transferItem.className = 'planned-transfer-item collapsed';
    transferItem.innerHTML = `
        <div class="transfer-header">
            <div class="transfer-info">
                <div class="transfer-main">
                    <div class="transfer-banks">${getBankName(transfer.fromBank)} → ${getBankName(transfer.toBank)}</div>
                    <div class="transfer-amount">${formatAmount(transfer.amount)} ₽</div>
                </div>
                <div class="transfer-secondary">
                    <div class="schedule-info">Ежемесячно ${transfer.scheduleDay}-го числа</div>
                    ${transfer.notifications ? 
                        `<div class="notification-time">
                            <span class="material-icons">schedule</span>
                            ${transfer.notificationTime}
                        </div>` : 
                        ''}
                    ${transfer.note ? `<div class="transfer-note">${transfer.note}</div>` : ''}
                </div>
            </div>
            <div class="transfer-actions">
                <button class="action-button notification-toggle ${transfer.notifications ? 'active' : ''}" 
                        title="Уведомления ${transfer.notificationTime || ''}">
                    <span class="material-icons">${transfer.notifications ? 'notifications_active' : 'notifications_off'}</span>
                </button>
                <button class="action-button edit-button" title="Редактировать">
                    <span class="material-icons">edit</span>
                </button>
                <button class="action-button delete-button" title="Удалить">
                    <span class="material-icons">delete</span>
                </button>
            </div>
        </div>
        <div class="transfer-details">
            <div class="account-details">
                <div class="account-info">
                    <span class="label">Счет отправителя:</span>
                    <span class="value">${transfer.fromAccount}</span>
                </div>
                <div class="account-info">
                    <span class="label">Счет получателя:</span>
                    <span class="value">${transfer.toAccount}</span>
                </div>
            </div>
        </div>
    `;

    // Обработчик для кнопки уведомлений
    const notificationToggle = transferItem.querySelector('.notification-toggle');
    notificationToggle.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        if (!notificationToggle.classList.contains('active')) {
            // При включении уведомлений запрашиваем время
            const time = await showTimePickerDialog();
            if (!time) return; // Если пользователь отменил выбор времени
            
            notificationToggle.classList.add('active');
            notificationToggle.querySelector('.material-icons').textContent = 'notifications_active';
            notificationToggle.title = `Уведомления ${time}`;
            
            // Обновляем состояние уведомлений в хранилище
            updateTransferNotifications(transfer.id, true, time);
        } else {
            // При выключении просто отключаем уведомления
            notificationToggle.classList.remove('active');
            notificationToggle.querySelector('.material-icons').textContent = 'notifications_off';
            notificationToggle.title = 'Уведомления';
            
            // Обновляем состояние уведомлений в хранилище
            updateTransferNotifications(transfer.id, false, null);
        }
        
        // Обновляем отображение времени уведомления
        loadSavedTransfers();
    });

    // Обработчик для кнопки редактирования
    const editButton = transferItem.querySelector('.edit-button');
    editButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditTransferForm(transfer);
    });

    // Обработчик для кнопки удаления
    const deleteButton = transferItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Вы уверены, что хотите удалить этот перевод?')) {
            deleteTransfer(transfer.id);
            transferItem.remove();
        }
    });

    // Обработчик для сворачивания/разворачивания
    transferItem.addEventListener('click', () => {
        const wasCollapsed = transferItem.classList.contains('collapsed');
        
        // Сворачиваем все остальные элементы
        document.querySelectorAll('.planned-transfer-item').forEach(item => {
            if (item !== transferItem) {
                item.classList.add('collapsed');
            }
        });
        
        // Переключаем состояние текущего элемента
        transferItem.classList.toggle('collapsed');
    });

    return transferItem;
}

// Функция для обновления состояния уведомлений
function updateTransferNotifications(transferId, enabled, time = null) {
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    const transferIndex = savedTransfers.findIndex(t => t.id === transferId);
    
    if (transferIndex !== -1) {
        savedTransfers[transferIndex].notifications = enabled;
        savedTransfers[transferIndex].notificationTime = time;
        localStorage.setItem('plannedTransfers', JSON.stringify(savedTransfers));
    }
}

// Функция для удаления перевода
function deleteTransfer(transferId) {
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    const updatedTransfers = savedTransfers.filter(t => t.id !== transferId);
    localStorage.setItem('plannedTransfers', JSON.stringify(updatedTransfers));
}

// Функция для открытия формы редактирования
function openEditTransferForm(transfer) {
    const transferPlanner = document.querySelector('.transfer-planner');
    const transferForm = transferPlanner.querySelector('.transfer-form');
    
    // Заполняем форму данными перевода
    transferForm.querySelector('.bank-from .bank-select').value = transfer.fromBank;
    transferForm.querySelector('.bank-from .account-number').value = transfer.fromAccount;
    transferForm.querySelector('.bank-to .bank-select').value = transfer.toBank;
    transferForm.querySelector('.bank-to .account-number').value = transfer.toAccount;
    transferForm.querySelector('.amount-field input').value = transfer.amount;
    transferForm.querySelector('.schedule-field input').value = transfer.scheduleDay;
    transferForm.querySelector('.note-field input').value = transfer.note || '';
    
    // Добавляем ID редактируемого перевода в форму
    transferForm.dataset.editId = transfer.id;
    
    // Меняем текст кнопки
    const saveButton = transferForm.querySelector('.save-transfer');
    saveButton.textContent = 'Сохранить изменения';
    
    // Разворачиваем форму
    transferPlanner.classList.remove('collapsed');
}

// Обновляем функцию сохранения
function saveTransfer(transfer) {
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    const transferForm = document.querySelector('.transfer-form');
    const editId = transferForm?.dataset.editId;
    
    if (editId) {
        // Редактирование существующего перевода
        const transferIndex = savedTransfers.findIndex(t => t.id === parseInt(editId));
        if (transferIndex !== -1) {
            savedTransfers[transferIndex] = {
                ...transfer,
                id: parseInt(editId),
                notifications: savedTransfers[transferIndex].notifications
            };
        }
    } else {
        // Создание нового перевода
        transfer.id = Date.now();
        transfer.notifications = false;
        savedTransfers.push(transfer);
    }
    
    localStorage.setItem('plannedTransfers', JSON.stringify(savedTransfers));
    
    // Обновляем отображение
    loadSavedTransfers();

    // Очищаем форму и сворачиваем её
    const transferPlanner = document.querySelector('.transfer-planner');
    if (transferForm) {
        // Очищаем все поля формы
        const bankFromSelect = transferForm.querySelector('.bank-from .bank-select');
        const bankFromAccount = transferForm.querySelector('.bank-from .account-number');
        const bankToSelect = transferForm.querySelector('.bank-to .bank-select');
        const bankToAccount = transferForm.querySelector('.bank-to .account-number');
        const amountInput = transferForm.querySelector('.amount-field input');
        const scheduleDayInput = transferForm.querySelector('.schedule-field input');
        const noteInput = transferForm.querySelector('.note-field input');

        if (bankFromSelect) bankFromSelect.value = '';
        if (bankFromAccount) bankFromAccount.value = '';
        if (bankToSelect) bankToSelect.value = '';
        if (bankToAccount) bankToAccount.value = '';
        if (amountInput) amountInput.value = '';
        if (scheduleDayInput) scheduleDayInput.value = '';
        if (noteInput) noteInput.value = '';

        // Сбрасываем состояние формы
        delete transferForm.dataset.editId;
        const saveButton = transferForm.querySelector('.save-transfer');
        if (saveButton) {
            saveButton.textContent = 'Сохранить';
            saveButton.disabled = false;
        }
    }

    // Сворачиваем форму
    if (transferPlanner) {
        transferPlanner.classList.add('collapsed');
    }
}

function loadSavedTransfers() {
    const plannedTransfers = document.querySelector('.planned-transfers');
    const savedTransfers = JSON.parse(localStorage.getItem('plannedTransfers') || '[]');
    
    // Очищаем существующие элементы
    plannedTransfers.innerHTML = '';

    // Сортируем переводы по дате создания (ID)
    savedTransfers.sort((a, b) => b.id - a.id);

    savedTransfers.forEach(transfer => {
        const transferItem = createTransferItem(transfer);
        plannedTransfers.appendChild(transferItem);
    });
}

// Вспомогательные функции
function getBankName(bankValue) {
    const bankMap = {
        'sber': 'Сбербанк',
        'tinkoff': 'Тинькофф',
        'vtb': 'ВТБ',
        'alfa': 'Альфа-Банк',
        'gazprom': 'Газпромбанк',
        'raif': 'Райффайзен'
    };

    if (bankValue.startsWith('custom_')) {
        return bankValue.replace('custom_', '').replace(/_/g, ' ');
    }

    return bankMap[bankValue] || bankValue;
}

function formatAmount(amount) {
    return new Intl.NumberFormat('ru-RU').format(amount);
}

// Функция для показа диалога выбора времени
function showTimePickerDialog() {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'time-picker-dialog';
        dialog.innerHTML = `
            <div class="time-picker-content">
                <h3>Выберите время уведомления</h3>
                <input type="time" class="time-input" value="09:00">
                <div class="time-picker-buttons">
                    <button class="cancel-time">Отмена</button>
                    <button class="confirm-time">Подтвердить</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        const timeInput = dialog.querySelector('.time-input');
        const confirmButton = dialog.querySelector('.confirm-time');
        const cancelButton = dialog.querySelector('.cancel-time');
        
        confirmButton.addEventListener('click', () => {
            const selectedTime = timeInput.value;
            dialog.remove();
            resolve(selectedTime);
        });
        
        cancelButton.addEventListener('click', () => {
            dialog.remove();
            resolve(null);
        });
    });
}

// Инициализация календаря
function initializeCalendar() {
    const calendarButton = document.querySelector('.calendar-button');
    const calendarModal = document.querySelector('.calendar-modal');
    const backButton = calendarModal.querySelector('.back-button');
    let currentDate = new Date();
    let selectedDate = null;

    // Открытие календаря
    calendarButton.addEventListener('click', () => {
        calendarModal.classList.add('active');
        updateMonthDisplay();
        generateCalendarDays();
    });

    // Закрытие календаря
    backButton.addEventListener('click', () => {
        calendarModal.classList.remove('active');
    });

    function updateMonthDisplay() {
        const monthNames = [
            'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
            'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
        ];
        const monthTitle = calendarModal.querySelector('.month-title');
        const date = selectedDate || currentDate;
        monthTitle.textContent = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()} г.`;
    }

    function generateCalendarDays() {
        const calendarGrid = calendarModal.querySelector('.calendar-grid');
        calendarGrid.innerHTML = '';

        // Добавляем дни недели
        const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        weekdays.forEach(day => {
            const weekdayElement = document.createElement('div');
            weekdayElement.className = 'calendar-weekday';
            weekdayElement.textContent = day;
            calendarGrid.appendChild(weekdayElement);
        });

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Добавляем дни предыдущего месяца
        const prevMonthDays = firstDay.getDay();
        const prevMonth = new Date(year, month, 0);
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day other-month';
            dayButton.textContent = prevMonth.getDate() - i;
            calendarGrid.appendChild(dayButton);
        }

        // Добавляем дни текущего месяца
        const today = new Date();
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day';
            dayButton.textContent = i;

            if (year === today.getFullYear() && 
                month === today.getMonth() && 
                i === today.getDate()) {
                dayButton.classList.add('today');
            }

            if (selectedDate && 
                year === selectedDate.getFullYear() && 
                month === selectedDate.getMonth() && 
                i === selectedDate.getDate()) {
                dayButton.classList.add('selected');
            }

            dayButton.addEventListener('click', () => {
                // Убираем выделение с предыдущего выбранного дня
                const previousSelected = calendarGrid.querySelector('.calendar-day.selected');
                if (previousSelected) {
                    previousSelected.classList.remove('selected');
                }

                // Выделяем новый выбранный день
                dayButton.classList.add('selected');
                selectedDate = new Date(year, month, i);
                
                // Обновляем заголовок
                const headerTitle = document.querySelector('.header-title');
                const monthNames = [
                    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
                ];
                headerTitle.textContent = `${i} ${monthNames[month]} ${year} г.`;

                // Обновляем state
                state.selectedMonth = month;
                state.selectedYear = year;
                state.selectedDay = i;

                // Фильтруем и отображаем транзакции за выбранный день
                const selectedTransactions = state.transactions.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return transactionDate.getDate() === i &&
                           transactionDate.getMonth() === month &&
                           transactionDate.getFullYear() === year;
                });

                // Обновляем отображение транзакций
                const container = document.querySelector('.transactions');
                container.innerHTML = '';

                if (selectedTransactions.length === 0) {
                    container.innerHTML = `
                        <div class="no-records">
                            <span class="material-icons">receipt_long</span>
                            <p>Нет транзакций</p>
                        </div>
                    `;
                } else {
                    const group = document.createElement('div');
                    group.className = 'transaction-group';

                    const dateHeader = document.createElement('div');
                    dateHeader.className = 'transaction-date';
                    dateHeader.textContent = `${i} ${monthNames[month]}`;
                    group.appendChild(dateHeader);

                    const list = document.createElement('div');
                    list.className = 'transaction-list';

                    selectedTransactions.forEach(transaction => {
                        const item = createTransactionItem(transaction);
                        list.appendChild(item);
                    });

                    group.appendChild(list);
                    container.appendChild(group);
                }

                // Обновляем суммы
                updateSummary(selectedTransactions);
                
                // Закрываем календарь
                setTimeout(() => {
                    calendarModal.classList.remove('active');
                }, 200);
            });

            calendarGrid.appendChild(dayButton);
        }

        // Добавляем дни следующего месяца
        const remainingDays = 42 - (prevMonthDays + lastDay.getDate());
        for (let i = 1; i <= remainingDays; i++) {
            const dayButton = document.createElement('button');
            dayButton.className = 'calendar-day other-month';
            dayButton.textContent = i;
            calendarGrid.appendChild(dayButton);
        }
    }
}

// Инициализируем календарь при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeCalendar);

// Функции для работы с транзакциями
function saveTransaction(transaction) {
    let transactions = getTransactions();
    
    if (transaction.id) {
        // Редактирование существующей транзакции
        const index = transactions.findIndex(t => t.id === transaction.id);
        if (index !== -1) {
            transactions[index] = transaction;
        } else {
            transactions.push(transaction);
        }
    } else {
        // Новая транзакция
        transaction.id = Date.now();
        transactions.push(transaction);
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Обновляем state
    state.transactions = transactions;
    
    // Обновляем отчеты, если модальное окно отчетов открыто
    const reportsModal = document.querySelector('.reports-modal');
    if (reportsModal && reportsModal.classList.contains('active')) {
        // Инициализируем диаграмму, если её нет
        if (!window.expenseChart) {
            initializeChart();
        }
        // Обновляем данные без анимации
        updateReport(false);
    }
    
    // Обновляем список транзакций и сводку
    updateTransactionsList();
    updateSummary();
}

function getTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    // Сортируем транзакции по дате в обратном порядке (новые сверху)
    return transactions.sort((a, b) => {
        // Сначала сравниваем по дате
        const dateComparison = new Date(b.date) - new Date(a.date);
        // Если даты равны, сортируем по времени создания (id) в обратном порядке
        if (dateComparison === 0) {
            return b.id - a.id;
        }
        return dateComparison;
    });
}

function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    return `${day} ${months[d.getMonth()]}`;
}

function groupTransactionsByDate(transactions) {
    const groups = {};
    transactions.forEach(transaction => {
        const date = transaction.date.split('T')[0]; // Получаем только дату
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
    });
    return groups;
}

function createTransactionItem(transaction) {
    const item = document.createElement('div');
    item.className = `transaction-item ${transaction.type}`;
    item.dataset.id = transaction.id;

    item.innerHTML = `
        <div class="transaction-content">
            <div class="transaction-icon">
                <span class="material-icons">${getCategoryIcon(transaction.category)}</span>
            </div>
            <div class="transaction-info">
                <div class="transaction-category">${getCategoryName(transaction.category)}</div>
                ${transaction.note ? `<div class="transaction-note">${transaction.note}</div>` : ''}
            </div>
            <div class="transaction-amount">${formatAmount(transaction.amount)}</div>
        </div>
        <div class="transaction-details">
            <div class="transaction-detail-row">
                <span class="detail-label">Категория</span>
                <span class="detail-value">${getCategoryName(transaction.category)}</span>
            </div>
            <div class="transaction-detail-row">
                <span class="detail-label">Сумма</span>
                <span class="detail-value">${formatAmount(transaction.amount)}</span>
            </div>
            <div class="transaction-detail-row">
                <span class="detail-label">Дата</span>
                <span class="detail-value">${formatDate(transaction.date)}</span>
            </div>
            ${transaction.note ? `
                <div class="transaction-detail-row">
                    <span class="detail-label">Заметка</span>
                    <span class="detail-value">${transaction.note}</span>
                </div>
            ` : ''}
            <div class="transaction-actions">
                <button class="action-button edit">
                    <span class="material-icons">edit</span>
                    Изменить
                </button>
                <button class="action-button delete">
                    <span class="material-icons">delete</span>
                    Удалить
                </button>
            </div>
        </div>
    `;

    // Обработчик клика по транзакции для раскрытия/сворачивания
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.action-button')) {
            // Закрываем все другие открытые транзакции
            document.querySelectorAll('.transaction-item.expanded').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('expanded');
                }
            });
            // Переключаем состояние текущей транзакции
            item.classList.toggle('expanded');
        }
    });

    // Обработчик кнопки редактирования
    const editButton = item.querySelector('.action-button.edit');
    if (editButton) {
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const transactionId = parseInt(item.dataset.id);
            const transaction = getTransactions().find(t => t.id === transactionId);
            if (transaction) {
                showPopupForm(transaction);
            }
        });
    }

    // Обработчик кнопки удаления
    const deleteButton = item.querySelector('.action-button.delete');
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const transactionId = parseInt(item.dataset.id);
            if (confirm('Вы уверены, что хотите удалить эту операцию?')) {
                let transactions = getTransactions();
                transactions = transactions.filter(t => t.id !== transactionId);
                localStorage.setItem('transactions', JSON.stringify(transactions));
                
                // Обновляем state
                state.transactions = transactions;
                
                // Обновляем список транзакций и сводку
                updateTransactionsList();
                updateSummary();
                
                // Обновляем отчеты, если модальное окно отчетов открыто
                const reportsModal = document.querySelector('.reports-modal');
                if (reportsModal && reportsModal.classList.contains('active')) {
                    updateReport();
                }
            }
        });
    }

    return item;
}

function updateTransactionsList() {
    const transactions = getTransactions().filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === state.selectedMonth && 
               date.getFullYear() === state.selectedYear;
    });

    const container = document.querySelector('.transactions');
    container.innerHTML = '';

    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="no-records">
                <span class="material-icons">receipt_long</span>
                <p>Нет транзакций</p>
            </div>
        `;
        return;
    }

    // Группируем транзакции по дате
    const groups = transactions.reduce((acc, transaction) => {
        const date = transaction.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    // Сортируем даты в обратном порядке (новые сверху)
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));

    sortedDates.forEach(date => {
        const group = document.createElement('div');
        group.className = 'transaction-group';

        const dateHeader = document.createElement('div');
        dateHeader.className = 'transaction-date';
        dateHeader.textContent = formatDate(date);
        group.appendChild(dateHeader);

        const list = document.createElement('div');
        list.className = 'transaction-list';

        // Сортируем транзакции внутри группы по id в обратном порядке (новые сверху)
        groups[date].sort((a, b) => b.id - a.id).forEach(transaction => {
            const item = createTransactionItem(transaction);
            list.appendChild(item);
        });

        group.appendChild(list);
        container.appendChild(group);
    });

    // Обновляем сводку
    updateSummary();
}

function getCategoryIcon(category) {
    // Преобразуем категорию в нижний регистр для сравнения
    const lowerCategory = typeof category === 'string' ? category.toLowerCase() : '';
    
    // Маппинг категорий на иконки (как на русском, так и на английском)
    const iconMap = {
        // Расходы (на русском)
        'шоппинг': 'shopping_cart',
        'еда': 'restaurant',
        'телефон': 'phone_android',
        'развлечения': 'sports_esports',
        'транспорт': 'directions_car',
        'здоровье': 'local_hospital',
        'дом': 'home',
        'коммунальные': 'bolt',
        'одежда': 'checkroom',
        'подарки': 'card_giftcard',
        'спорт': 'fitness_center',
        'образование': 'school',
        'путешествия': 'flight_takeoff',
        'жкх': 'house',
        
        // Доходы (на русском)
        'зарплата': 'account_balance_wallet',
        'фриланс': 'work',
        'дивиденды': 'trending_up',
        'подарок': 'redeem',
        'проценты': 'account_balance',
        'бизнес': 'business_center',
        'аренда': 'apartment',
        'инвестиции': 'show_chart',
        
        // Расходы (на английском)
        'shopping': 'shopping_cart',
        'food': 'restaurant',
        'phone': 'phone_android',
        'entertainment': 'sports_esports',
        'transport': 'directions_car',
        'health': 'local_hospital',
        'house': 'home',
        'utilities': 'power',
        'clothes': 'checkroom',
        'beauty': 'spa',
        'education': 'school',
        'sports': 'fitness_center',
        'cafe': 'local_cafe',
        'gifts': 'redeem',
        'pets': 'pets',
        'internet': 'wifi',
        'taxi': 'local_taxi',
        'parking': 'local_parking',
        'books': 'menu_book',
        'medicine': 'medication',
        'furniture': 'chair',
        'repair': 'build',
        'insurance': 'security',
        'subscriptions': 'subscriptions',
        'hobbies': 'palette',
        'cinema': 'movie',
        'music': 'music_note',
        'travel': 'flight_takeoff',
        'electronics': 'devices',
        'other_expense': 'attach_money',
        
        // Доходы (на английском)
        'salary': 'account_balance_wallet',
        'investments': 'show_chart',
        'part-time': 'schedule',
        'rewards': 'card_giftcard',
        'rental': 'house',
        'business': 'business_center',
        'dividends': 'trending_up',
        'freelance': 'work',
        'sales': 'sell',
        'other_income': 'payments'
    };
    
    // Возвращаем соответствующую иконку или иконку по умолчанию
    return iconMap[lowerCategory] || 'attach_money';
}

function getCategoryName(category) {
    const names = {
        // Расходы
        shopping: 'Шоппинг',
        food: 'Еда',
        phone: 'Телефон',
        entertainment: 'Развлечения',
        transport: 'Транспорт',
        health: 'Здоровье',
        house: 'Дом',
        utilities: 'ЖКХ',
        clothes: 'Одежда',
        beauty: 'Красота',
        education: 'Образование',
        sports: 'Спорт',
        cafe: 'Кафе',
        gifts: 'Подарки',
        pets: 'Питомцы',
        internet: 'Интернет',
        taxi: 'Такси',
        parking: 'Парковка',
        books: 'Книги',
        medicine: 'Лекарства',
        furniture: 'Мебель',
        repair: 'Ремонт',
        insurance: 'Страховка',
        subscriptions: 'Подписки',
        hobbies: 'Хобби',
        cinema: 'Кино',
        music: 'Музыка',
        travel: 'Путешествия',
        electronics: 'Электроника',
        other_expense: 'Другое',

        // Доходы
        salary: 'Зарплата',
        investments: 'Инвестиции',
        'part-time': 'Подработка',
        rewards: 'Награды',
        rental: 'Аренда',
        business: 'Бизнес',
        dividends: 'Дивиденды',
        freelance: 'Фриланс',
        sales: 'Продажи',
        other_income: 'Другое'
    };
    return names[category] || 'Другое';
}

// Обработчик формы добавления транзакции
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const transaction = {
        amount: document.getElementById('amount').value,
        date: document.getElementById('date').value,
        note: document.getElementById('note').value,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value
    };

    saveTransaction(transaction);
    
    // Закрываем модальное окно
    document.querySelector('.add-transaction-modal').classList.remove('active');
    // Очищаем форму
    this.reset();
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    clearLocalStorage();
    updateTransactionsList();
    updateSummary();
});

// Функции для работы с отчетами
function reapplyCategories() {
    console.log('Reapplying categories HTML');
    document.querySelector('.reports-modal .category-list').innerHTML = `
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Инвестиции</div>
                <div class="category-amount income">11 112</div>
            </div>
        </div>
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Одежда</div>
                <div class="category-amount">2 223</div>
            </div>
        </div>
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Транспорт</div>
                <div class="category-amount">112</div>
            </div>
        </div>
        <div class="category-item">
            <div class="category-icon">
                <span class="material-icons">attach_money</span>
            </div>
            <div class="category-info">
                <div class="category-name">Дом</div>
                <div class="category-amount">1 123</div>
            </div>
        </div>
    `;
    
    // Инициализируем диаграмму
    initializeChart();
}

function initializeChart() {
    console.log('[initializeChart] Начало создания новой диаграммы');
    
    // Получаем canvas и контекст
    const canvas = document.getElementById('expenseChart');
    if (!canvas) {
        console.error('[initializeChart] Canvas не найден');
        return null;
    }
    
    // Очищаем canvas (если была предыдущая диаграмма)
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Удаляем предыдущую диаграмму, если она есть
    if (window.expenseChart) {
        delete window.expenseChart;
    }
    
    // Принудительно устанавливаем размеры canvas
    canvas.style.width = '90%';
    canvas.style.height = '250px';
    canvas.style.display = 'block';
    
    try {
        // Создаем простую диаграмму с минимальной конфигурацией
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Нет данных'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#333'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%'
            }
        });
    } catch (error) {
        console.error('[initializeChart] Ошибка создания диаграммы:', error);
        return null;
    }
}

function updateCategoryList(categories, total, isExpense) {
    const categoryList = document.querySelector('.reports-modal .category-list');
    if (!categoryList) return;
    
    // Очищаем текущий список
    categoryList.innerHTML = '';
    
    // Сортируем категории по сумме в порядке убывания
    const sortedCategories = [...categories].sort((a, b) => {
        // Если суммы равны, сохраняем порядок
        if (Math.abs(b.amount - a.amount) < 0.01) {
            return 0;
        }
        return b.amount - a.amount;
    });

    // Если нет категорий, показываем сообщение
    if (sortedCategories.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-category-message';
        emptyMessage.textContent = 'Нет данных для отображения';
        emptyMessage.style.color = '#666';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        categoryList.appendChild(emptyMessage);
        return;
    }

    // Создаем элементы для каждой категории
    sortedCategories.forEach(category => {
        // Пропускаем категорию "Другое"
        if (category.name.includes('other_expense') || category.name.includes('other_income')) {
            return;
        }
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'transaction-item';
        
        // Добавляем класс в зависимости от типа (расход/доход)
        if (isExpense) {
            categoryItem.classList.add('expense');
        } else {
            categoryItem.classList.add('income');
        }
        
        // Создаем содержимое транзакции
        const transactionContent = document.createElement('div');
        transactionContent.className = 'transaction-content';
        
        // Создаем иконку транзакции
        const transactionIcon = document.createElement('div');
        transactionIcon.className = 'transaction-icon';
        
        // Получаем материальный значок для категории
        const iconName = getCategoryIcon(category.name);
        transactionIcon.innerHTML = `<span class="material-icons">${iconName}</span>`;
        
        // Создаем информацию о транзакции
        const transactionInfo = document.createElement('div');
        transactionInfo.className = 'transaction-info';
        
        // Добавляем название категории
        const transactionCategory = document.createElement('div');
        transactionCategory.className = 'transaction-category';
        transactionCategory.textContent = getCategoryName(category.name);
        
        // Добавляем процент от общей суммы как заметку
        const percentage = (category.amount / total * 100).toFixed(2);
        const transactionNote = document.createElement('div');
        transactionNote.className = 'transaction-note';
        transactionNote.textContent = `${percentage}%`;
        
        // Добавляем сумму
        const transactionAmount = document.createElement('div');
        transactionAmount.className = 'transaction-amount';
        transactionAmount.textContent = Math.round(category.amount).toLocaleString('ru-RU');
        
        // Собираем элементы вместе
        transactionInfo.appendChild(transactionCategory);
        transactionInfo.appendChild(transactionNote);
        
        transactionContent.appendChild(transactionIcon);
        transactionContent.appendChild(transactionInfo);
        transactionContent.appendChild(transactionAmount);
        
        categoryItem.appendChild(transactionContent);
        
        categoryList.appendChild(categoryItem);
    });
}

// Функция для получения цвета категории
function getCategoryColor(category, isExpense) {
    // Цвета для расходов
    const expenseColors = {
        'shopping': '#FF453A',
        'food': '#FF9F0A',
        'phone': '#64D2FF',
        'entertainment': '#BF5AF2',
        'transport': '#FF9500',
        'health': '#30D158',
        'house': '#30D158',
        'utilities': '#5E5CE6',
        'clothes': '#FF2D55',
        'beauty': '#FF375F',
        'education': '#5856D6',
        'sports': '#32ADE6',
        'cafe': '#FF9F0A',
        'gifts': '#FF3B30',
        'pets': '#32D74B',
        'internet': '#64D2FF',
        'taxi': '#FF9500',
        'parking': '#FF9500',
        'books': '#5856D6',
        'medicine': '#30D158',
        'furniture': '#30D158',
        'repair': '#30D158',
        'insurance': '#5E5CE6',
        'subscriptions': '#FF2D55',
        'hobbies': '#BF5AF2',
        'cinema': '#FF9F0A',
        'music': '#BF5AF2',
        'travel': '#FF9500',
        'electronics': '#64D2FF',
        'other_expense': '#8E8E93'
    };
    
    // Полностью обновленная палитра для доходов с уникальными цветами
    const incomeColors = {
        'salary': '#2ECC71',        // Изумрудный зеленый
        'investments': '#9B59B6',    // Аметистовый
        'part-time': '#E67E22',     // Морковный
        'rewards': '#F1C40F',       // Солнечный желтый
        'rental': '#3498DB',        // Питерский голубой
        'business': '#16A085',      // Бирюзовый
        'dividends': '#8E44AD',     // Глубокий пурпурный
        'freelance': '#E74C3C',     // Алый
        'sales': '#D35400',         // Тыквенный
        'other_income': '#27AE60'   // Нефритовый
    };
    
    // В зависимости от типа транзакции выбираем соответствующий набор цветов
    const colorMap = isExpense ? expenseColors : incomeColors;
    
    // Возвращаем цвет категории, если он есть в наборе, иначе возвращаем цвет по умолчанию
    return colorMap[category] || (isExpense ? '#FF453A' : '#2ECC71');
}

// Функция для обновления навигации по датам
function updateDateNavigation() {
    const dateDisplay = document.querySelector('.reports-modal .date-display');
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    if (dateDisplay) {
        dateDisplay.textContent = `${months[state.selectedMonth]} ${state.selectedYear}`;
    }
}

// Добавляем функцию для очистки localStorage
function clearLocalStorage() {
    console.log('Подготовка локального хранилища...');
    
    // Проверяем, существуют ли уже данные в localStorage
    const hasTransactions = localStorage.getItem('transactions');
    
    // Если в хранилище нет transactions, инициализируем пустой массив
    if (!hasTransactions) {
        localStorage.setItem('transactions', JSON.stringify([]));
        console.log('Инициализирован пустой массив transactions');
    } else {
        console.log('Найдены существующие transactions, сохраняем');
    }
    
    // Проверяем наличие и инициализируем другие необходимые данные
    if (!localStorage.getItem('plannedTransfers')) {
        localStorage.setItem('plannedTransfers', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('expenseCategoryPositions')) {
        localStorage.setItem('expenseCategoryPositions', JSON.stringify({}));
    }
    
    if (!localStorage.getItem('incomeCategoryPositions')) {
        localStorage.setItem('incomeCategoryPositions', JSON.stringify({}));
    }
    
    // Обновляем локальный state из localStorage
    state.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    state.categoryPositions.expense = JSON.parse(localStorage.getItem('expenseCategoryPositions')) || {};
    state.categoryPositions.income = JSON.parse(localStorage.getItem('incomeCategoryPositions')) || {};
    
    console.log('Локальное хранилище готово');
}

function initializeReports() {
    console.log('[initializeReports] Начало инициализации отчетов');
    
    // Получаем элементы для работы с отчетами
    const reportsButton = document.querySelector('.nav-item[data-page="reports"]');
    const reportsModal = document.querySelector('.reports-modal');
    
    // Получаем переключатель периода
    const periodButtons = reportsModal.querySelectorAll('.period-button');
    
    // Получаем кнопки переключения типа отчета
    const expenseButton = reportsModal.querySelector('.expense-button');
    const incomeButton = reportsModal.querySelector('.income-button');

    // Получаем кнопки навигации ОТЧЕТОВ с новыми классами
    const prevMonthButton = reportsModal.querySelector('.reports-prev-month');
    const nextMonthButton = reportsModal.querySelector('.reports-next-month');

    // Получаем навигационные кнопки для закрытия отчетов
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.dataset.page !== 'reports') {
            item.addEventListener('click', () => {
                console.log('[navItem] Закрытие отчетов при переходе на другую страницу');
                reportsModal.classList.remove('active');
            });
        }
    });

    // Обработчики для кнопок навигации по месяцам в ОТЧЕТАХ
    if (prevMonthButton) {
        prevMonthButton.addEventListener('click', (e) => {
            // Предотвращаем всплытие события
            e.stopPropagation();
            
            if (state.selectedMonth === 0) {
                state.selectedMonth = 11;
                state.selectedYear--;
            } else {
                state.selectedMonth--;
            }
            updateDateNavigation();
            updateReport(false);
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener('click', (e) => {
            // Предотвращаем всплытие события
            e.stopPropagation();
            
            if (state.selectedMonth === 11) {
                state.selectedMonth = 0;
                state.selectedYear++;
            } else {
                state.selectedMonth++;
            }
            updateDateNavigation();
            updateReport(false);
        });
    }

    // Предварительно загружаем данные
    console.log('[initializeReports] Загрузка данных из localStorage');
    state.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Добавляем обработчик для открытия отчетов
    reportsButton.addEventListener('click', () => {
        console.log('[reportsButton] Нажата кнопка отчетов');
        
        // Показываем модальное окно
        reportsModal.classList.add('active');

        // Простая задержка перед обновлением, чтобы DOM успел обновиться
        setTimeout(() => {
            // Обновляем навигацию по дате
            updateDateNavigation();
            
            // Обновляем отчет (это создаст новую диаграмму)
            updateReport(true);
            
            console.log('[reportsButton] Отчет обновлен');
        }, 300);
    });

    // Добавляем обработчик для кнопки "назад" в отчетах, если она есть
    const backButton = reportsModal.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            console.log('[backButton] Закрытие отчетов');
            reportsModal.classList.remove('active');

            // Возвращаемся на главную страницу
            const pages = document.querySelectorAll('.content');
            pages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');
            });

            // Активируем главную страницу
            const mainPage = document.getElementById('main');
            if (mainPage) {
                mainPage.style.display = 'block';
                mainPage.classList.add('active');
            }

            // Активируем кнопку главной страницы
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(nav => nav.classList.remove('active'));
            const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
            if (mainNavItem) {
                mainNavItem.classList.add('active');
            }
        });
    }
    
    // Обработчики для переключения периода
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('[periodButton] Переключение периода');
            periodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateReport(false);
        });
    });
    
    // Обработчики для переключения типа отчета
    expenseButton.addEventListener('click', () => {
        console.log('[typeButton] Переключение на расходы');
        expenseButton.classList.add('active');
        incomeButton.classList.remove('active');
        updateReport(false);
    });
    
    incomeButton.addEventListener('click', () => {
        console.log('[typeButton] Переключение на доходы');
        incomeButton.classList.add('active');
        expenseButton.classList.remove('active');
        updateReport(false);
    });
    
    console.log('[initializeReports] Завершение инициализации отчетов');
}

function updateReport(animate = false) {
    console.log('[updateReport] Начало обновления отчета');
    
    const reportsModal = document.querySelector('.reports-modal');
    if (!reportsModal) {
        console.log('[updateReport] Модальное окно отчетов не найдено');
        return;
    }

    // Определяем текущие режимы отчета
    const isExpense = document.querySelector('.reports-modal .expense-button').classList.contains('active');
    const isMonthPeriod = document.querySelector('.reports-modal .period-button.active').textContent === 'Месяц';
    
    console.log(`[updateReport] Режим: ${isExpense ? 'расходы' : 'доходы'}, период: ${isMonthPeriod ? 'месяц' : 'год'}`);
    
    // Загружаем и фильтруем транзакции
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let filteredTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        
        const typeMatch = isExpense ? transaction.type === 'expense' : transaction.type === 'income';
        const periodMatch = isMonthPeriod 
            ? transactionMonth === state.selectedMonth && transactionYear === state.selectedYear
            : transactionYear === state.selectedYear;
        
        return typeMatch && periodMatch;
    });
    
    console.log(`[updateReport] Отфильтровано транзакций: ${filteredTransactions.length}`);
    
    // Группируем транзакции по категориям
    const categories = {};
    filteredTransactions.forEach(transaction => {
        if (!categories[transaction.category]) {
            categories[transaction.category] = 0;
        }
        categories[transaction.category] += parseFloat(transaction.amount);
    });
    
    // Преобразуем в массив и сортируем
    const categoriesArray = Object.entries(categories)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
    
    console.log(`[updateReport] Количество категорий: ${categoriesArray.length}`);
    
    // Пересоздаем canvas для диаграммы
    recreateChartCanvas();
    
    // Создаем новую диаграмму вместо обновления существующей
    try {
        // Создаем данные для диаграммы
        const chartLabels = categoriesArray.map(c => c.name);
        const chartData = categoriesArray.map(c => c.amount);
        const chartColors = categoriesArray.map(c => getCategoryColor(c.name, isExpense));
        
        // Если нет данных, показываем заглушку
        if (chartData.length === 0) {
            chartLabels.push('Нет данных');
            chartData.push(1);
            chartColors.push('#333');
        }
        
        // Создаем новую диаграмму на чистом canvas
        const canvas = document.getElementById('expenseChart');
        if (canvas) {
            // Принудительно задаем размеры canvas
            canvas.style.width = '90%';
            canvas.style.height = '250px';
            canvas.style.display = 'block';
            
            try {
                const ctx = canvas.getContext('2d');
                
                window.expenseChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            data: chartData,
                            backgroundColor: chartColors,
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                            tooltip: {
                                enabled: true,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                titleFont: {
                                    size: 16,
                                    weight: 'bold',
                                    family: 'system-ui'
                                },
                                bodyFont: {
                                    size: 14,
                                    family: 'system-ui'
                                },
                                padding: 16,
                                displayColors: false,
                                callbacks: {
                                    // Изменение заголовка подсказки на русском
                                    title: function(items) {
                                        if (!items.length) return '';
                                        const category = items[0].label;
                                        return getCategoryName(category);
                                    },
                                    // Изменение текста подсказки на русском
                                    label: function(context) {
                                        const value = context.raw;
                                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return `${percentage}% (${Math.round(value).toLocaleString('ru-RU')} ₽)`;
                                    },
                                    // Локализация статистики
                                    afterLabel: function(context) {
                                        if (chartData.length <= 1) return '';
                                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                        return `Из общей суммы: ${Math.round(total).toLocaleString('ru-RU')} ₽`;
                                    }
                                }
                            },
                            legend: {
                                display: false
                            }
                        }
                    }
                });
                
                console.log('[updateReport] Новая диаграмма успешно создана');
            } catch (error) {
                console.error('[updateReport] Ошибка создания диаграммы:', error);
            }
        }
    } catch (error) {
        console.error('[updateReport] Ошибка при работе с диаграммой:', error);
    }
    
    // Обновляем список категорий
    const total = categoriesArray.reduce((sum, category) => sum + category.amount, 0);
    updateCategoryList(categoriesArray, total, isExpense);
    
    // Обновляем общую сумму
    const totalElement = document.querySelector('.reports-modal .chart-total');
    if (totalElement) {
        totalElement.textContent = Math.round(total).toLocaleString('ru-RU');
    }

    // Обновляем отображение текущего месяца и навигацию
    updateDateNavigation();
    
    console.log('[updateReport] Завершение обновления отчета');
}

// Полное удаление диаграммы из DOM для принудительного пересоздания
function recreateChartCanvas() {
    console.log('[recreateChartCanvas] Пересоздание canvas элемента для диаграммы');
    
    // Находим контейнер и текущий canvas
    const container = document.querySelector('.chart-container');
    const oldCanvas = document.getElementById('expenseChart');
    
    if (!container || !oldCanvas) {
        console.error('[recreateChartCanvas] Не найден контейнер или canvas');
        return false;
    }
    
    // Получаем текущий общий элемент (число в центре)
    const totalElement = document.querySelector('.chart-total');
    
    // Удаляем старый canvas
    oldCanvas.remove();
    
    // Удаляем глобальную диаграмму, если она существует
    if (window.expenseChart) {
        delete window.expenseChart;
    }
    
    // Создаем новый canvas
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'expenseChart';
    
    // Добавляем новый canvas перед элементом с суммой
    container.insertBefore(newCanvas, totalElement);
    
    console.log('[recreateChartCanvas] Canvas успешно пересоздан');
    return true;
}

// Инициализация настроек приложения
function initializeSettings() {
    console.log('[DEBUG] Инициализация настроек приложения');
    
    // Загрузка настроек из localStorage
    loadSettingsFromStorage();
    
    // Установка обработчиков событий для элементов настроек
    setupSettingsHandlers();
    
    // Обновление отображения текущей валюты в интерфейсе
    updateCurrencyDisplay();
    
    // Инициализация уведомлений, если они включены
    if (settingsState.remindersEnabled) {
        initializeReminders();
    }
}

// Загрузка настроек из localStorage
function loadSettingsFromStorage() {
    console.log('[DEBUG] Загрузка настроек из localStorage');
    
    const savedSettings = localStorage.getItem('financeTrackerSettings');
    if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Обновление состояния настроек из сохраненных данных
        Object.assign(settingsState, parsedSettings);
        
        console.log('[DEBUG] Загружены настройки:', settingsState);
    } else {
        console.log('[DEBUG] Сохраненные настройки не найдены, используются настройки по умолчанию');
        // Сохраняем настройки по умолчанию
        saveSettingsToStorage();
    }
}

// Сохранение настроек в localStorage
function saveSettingsToStorage() {
    console.log('[DEBUG] Сохранение настроек в localStorage');
    localStorage.setItem('financeTrackerSettings', JSON.stringify(settingsState));
}

// Настройка обработчиков событий для элементов настроек
function setupSettingsHandlers() {
    console.log('[DEBUG] Настройка обработчиков событий для настроек');
    
    const settingsItems = document.querySelectorAll('.settings-item');
    console.log(`[DEBUG] Найдено ${settingsItems.length} элементов настроек`);
    
    settingsItems.forEach(item => {
        item.addEventListener('click', () => {
            const settingType = item.getAttribute('data-setting');
            console.log(`[DEBUG] Клик по настройке: ${settingType}`);
            
            if (settingType === 'sound') {
                // Для звука переключаем состояние переключателя
                toggleSound();
            } else {
                // Для других настроек открываем соответствующее модальное окно
                openSettingsModal(settingType);
            }
        });
    });
    
    // Настройка обработчиков для кнопок возврата в модальных окнах
    const backButtons = document.querySelectorAll('.settings-back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.settings-modal');
            closeSettingsModal(modal);
        });
    });
    
    // Инициализация обработчиков для различных настроек
    setupCurrencyHandlers();
    setupLanguageHandlers();
    setupRemindersHandlers();
    setupDataHandlers();
    setupShareHandlers();
    
    console.log('[DEBUG] Настройка обработчиков событий для настроек завершена');
}

// Установка обработчиков для валют
function setupCurrencyHandlers() {
    console.log('[DEBUG] Настройка обработчиков для валют');
    
    const currencyItems = document.querySelectorAll('.currency-item');
    currencyItems.forEach(item => {
        item.addEventListener('click', () => {
            const currencyCode = item.getAttribute('data-currency');
            const currencySymbol = item.getAttribute('data-symbol');
            
            console.log(`[DEBUG] Выбрана валюта: ${currencyCode} (${currencySymbol})`);
            
            // Обновляем активную валюту в интерфейсе
            document.querySelectorAll('.currency-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            
            // Обновляем состояние настроек
            settingsState.currency = currencyCode;
            settingsState.currencySymbol = currencySymbol;
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем отображение валюты в интерфейсе
            updateCurrencyDisplay();
            
            // Закрываем модальное окно
            setTimeout(() => {
                closeSettingsModal(document.getElementById('currency-modal'));
            }, 300);
        });
    });
}

// Установка обработчиков для языков
function setupLanguageHandlers() {
    console.log('[DEBUG] Настройка обработчиков для языков');
    
    const languageItems = document.querySelectorAll('.language-item');
    languageItems.forEach(item => {
        item.addEventListener('click', () => {
            const langCode = item.getAttribute('data-language');
            const langName = item.querySelector('.language-item-name').textContent;
            
            console.log(`[DEBUG] Выбран язык: ${langCode} (${langName})`);
            
            // Обновляем активный язык в интерфейсе
            document.querySelectorAll('.language-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            
            // Обновляем состояние настроек
            settingsState.language = langCode;
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем язык интерфейса
            updateLanguageDisplay();
            
            // Закрываем модальное окно
            setTimeout(() => {
                closeSettingsModal(document.getElementById('language-modal'));
            }, 300);
        });
    });
}

// Установка обработчиков для напоминаний
function setupRemindersHandlers() {
    console.log('[DEBUG] Настройка обработчиков для напоминаний');
    
    // Обработчик для переключателя напоминаний
    const remindersToggle = document.querySelector('#reminders-modal .switch input');
    if (remindersToggle) {
        remindersToggle.addEventListener('change', () => {
            settingsState.remindersEnabled = remindersToggle.checked;
            saveSettingsToStorage();
            
            console.log(`[DEBUG] Напоминания ${settingsState.remindersEnabled ? 'включены' : 'выключены'}`);
            
            // Обновляем статус в основном меню настроек
            initializeReminders();
        });
    }
    
    // Обработчик для кнопки добавления напоминания
    const addReminderButton = document.querySelector('.add-reminder-button');
    if (addReminderButton) {
        addReminderButton.addEventListener('click', () => {
            openReminderEditModal();
        });
    }
    
    // Обработчик для кнопки сохранения напоминания
    const saveReminderButton = document.querySelector('.save-reminder-button');
    if (saveReminderButton) {
        saveReminderButton.addEventListener('click', () => {
            saveReminder();
        });
    }
}

// Обновление языка в интерфейсе
function updateLanguageDisplay() {
    console.log('[DEBUG] Обновление языка в интерфейсе');
    
    // Обновляем подзаголовок в настройках
    const languageSubtitle = document.querySelector('[data-setting="language"] .settings-item-subtitle');
    if (languageSubtitle) {
        const selectedLanguage = document.querySelector(`.language-item[data-language="${settingsState.language}"] .language-item-name`);
        if (selectedLanguage) {
            languageSubtitle.textContent = selectedLanguage.textContent;
            console.log(`[DEBUG] Обновлен подзаголовок языка: ${languageSubtitle.textContent}`);
        }
    } else {
        console.warn('[DEBUG] Не найден подзаголовок для языка');
    }
    
    // В реальном приложении здесь был бы код для загрузки локализованных строк
    // и обновления всех текстовых элементов интерфейса
}

// Обновление отображения валюты в интерфейсе
function updateCurrencyDisplay() {
    console.log('[DEBUG] Обновление отображения валюты в интерфейсе');
    
    // Обновляем подзаголовок в настройках
    const currencySubtitle = document.querySelector('[data-setting="currency"] .settings-item-subtitle');
    if (currencySubtitle) {
        currencySubtitle.textContent = `${settingsState.currency} (${settingsState.currencySymbol})`;
        console.log(`[DEBUG] Обновлен подзаголовок валюты: ${currencySubtitle.textContent}`);
    } else {
        console.warn('[DEBUG] Не найден подзаголовок для валюты');
    }
    
    // Обновляем отображение во всех суммах транзакций
    updateTransactionsDisplay();
    
    // Обновляем отчеты, если они отображаются
    const reportsPage = document.getElementById('reports');
    if (reportsPage && reportsPage.style.display !== 'none') {
        updateReport();
    }
}

// Инициализация напоминаний
function initializeReminders() {
    console.log('[DEBUG] Инициализация напоминаний');
    
    // Обновляем подзаголовок в настройках
    const remindersSubtitle = document.querySelector('[data-setting="reminders"] .settings-item-subtitle');
    if (remindersSubtitle) {
        remindersSubtitle.textContent = settingsState.remindersEnabled 
            ? `Активно: ${settingsState.reminders.length}`
            : 'Отключено';
        console.log(`[DEBUG] Обновлен подзаголовок напоминаний: ${remindersSubtitle.textContent}`);
    } else {
        console.warn('[DEBUG] Не найден подзаголовок для напоминаний');
    }
    
    // В реальном приложении здесь был бы код для регистрации уведомлений
    // например, использование Notification API или службы push-уведомлений
    console.log('[DEBUG] Напоминания инициализированы:', settingsState.reminders);
}

// Создание элемента напоминания для интерфейса
function createReminderItem(reminder) {
    console.log(`[DEBUG] Создание элемента напоминания: ${reminder.title}`);
    
    const reminderItem = document.createElement('div');
    reminderItem.className = 'reminder-item';
    reminderItem.setAttribute('data-reminder-id', reminder.id);
    
    reminderItem.innerHTML = `
        <div class="reminder-item-content">
            <div class="reminder-item-title">${reminder.title}</div>
            <div class="reminder-item-time">${reminder.time}${reminder.repeat === 'daily' ? ' (ежедневно)' : ''}</div>
        </div>
        <div class="reminder-item-actions">
            <button class="reminder-edit-button">
                <span class="material-icons">edit</span>
            </button>
            <button class="reminder-delete-button">
                <span class="material-icons">delete</span>
            </button>
        </div>
    `;
    
    // Добавляем обработчик для кнопки редактирования
    reminderItem.querySelector('.reminder-edit-button').addEventListener('click', (e) => {
        e.stopPropagation();
        openReminderEditModal(reminder);
    });
    
    // Добавляем обработчик для кнопки удаления
    reminderItem.querySelector('.reminder-delete-button').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteReminder(reminder.id);
    });
    
    return reminderItem;
}

// Открытие модального окна редактирования напоминания
function openReminderEditModal(reminder = null) {
    console.log(`[DEBUG] Открытие модального окна редактирования напоминания: ${reminder ? reminder.id : 'новое'}`);
    
    const modal = document.getElementById('reminder-edit-modal');
    if (modal) {
        // Заполняем форму данными напоминания или значениями по умолчанию
        const titleInput = modal.querySelector('#reminder-title');
        const timeInput = modal.querySelector('#reminder-time');
        const repeatSelect = modal.querySelector('#reminder-repeat');
        const messageInput = modal.querySelector('#reminder-message');
        
        if (reminder) {
            titleInput.value = reminder.title;
            timeInput.value = reminder.time;
            repeatSelect.value = reminder.repeat;
            messageInput.value = reminder.message;
            
            // Устанавливаем атрибут с идентификатором редактируемого напоминания
            modal.setAttribute('data-edit-reminder-id', reminder.id);
        } else {
            // Значения по умолчанию для нового напоминания
            titleInput.value = 'Новое напоминание';
            timeInput.value = '09:00';
            repeatSelect.value = 'daily';
            messageInput.value = 'Не забудьте внести свои финансы';
            
            // Удаляем атрибут, если он был установлен ранее
            modal.removeAttribute('data-edit-reminder-id');
        }
        
        // Отображаем модальное окно
        modal.classList.add('active');
    } else {
        console.error('[DEBUG] Модальное окно редактирования напоминания не найдено');
    }
}

// Сохранение напоминания
function saveReminder() {
    console.log('[DEBUG] Сохранение напоминания');
    
    const modal = document.getElementById('reminder-edit-modal');
    if (modal) {
        // Получаем данные из формы
        const titleInput = modal.querySelector('#reminder-title');
        const timeInput = modal.querySelector('#reminder-time');
        const repeatSelect = modal.querySelector('#reminder-repeat');
        const messageInput = modal.querySelector('#reminder-message');
        
        // Получаем идентификатор редактируемого напоминания, если он есть
        const editReminderId = modal.getAttribute('data-edit-reminder-id');
        
        // Создаем объект напоминания
        const reminderData = {
            id: editReminderId || 'reminder-' + Date.now(),
            title: titleInput.value.trim(),
            time: timeInput.value,
            repeat: repeatSelect.value,
            message: messageInput.value.trim(),
            enabled: true
        };
        
        // Если это редактирование существующего напоминания
        if (editReminderId) {
            // Находим индекс напоминания в массиве
            const reminderIndex = settingsState.reminders.findIndex(r => r.id === editReminderId);
            
            if (reminderIndex !== -1) {
                // Обновляем данные напоминания
                settingsState.reminders[reminderIndex] = reminderData;
            }
        } else {
            // Добавляем новое напоминание
            settingsState.reminders.push(reminderData);
        }
        
        // Сохраняем настройки
        saveSettingsToStorage();
        
        // Обновляем отображение напоминаний
        updateRemindersModal();
        
        // Обновляем счетчик в основном меню настроек
        initializeReminders();
        
        // Закрываем модальное окно редактирования
        closeSettingsModal(modal);
    }
}

// Удаление напоминания
function deleteReminder(reminderId) {
    console.log(`[DEBUG] Удаление напоминания: ${reminderId}`);
    
    if (confirm('Вы уверены, что хотите удалить это напоминание?')) {
        // Находим индекс напоминания в массиве
        const reminderIndex = settingsState.reminders.findIndex(r => r.id === reminderId);
        
        if (reminderIndex !== -1) {
            // Удаляем напоминание из массива
            settingsState.reminders.splice(reminderIndex, 1);
            
            // Сохраняем настройки
            saveSettingsToStorage();
            
            // Обновляем отображение напоминаний
            updateRemindersModal();
            
            // Обновляем счетчик в основном меню настроек
            initializeReminders();
        }
    }
}

// Функция для открытия модального окна настроек
function openSettingsModal(settingType) {
    console.log(`[DEBUG] Открытие модального окна настроек: ${settingType}`);
    
    // Находим соответствующее модальное окно
    const modalId = `${settingType}-modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
        console.log(`[DEBUG] Найдено модальное окно: ${modalId}`);
        
        // Закрываем все другие модальные окна настроек
        document.querySelectorAll('.settings-modal.active').forEach(m => {
            if (m !== modal) {
                m.classList.remove('active');
            }
        });
        
        // Открываем выбранное модальное окно
        modal.classList.add('active');
        
        // Дополнительные действия в зависимости от типа настройки
        if (settingType === 'currency') {
            // Выделяем текущую валюту
            const currencyItems = modal.querySelectorAll('.currency-item');
            currencyItems.forEach(item => {
                const itemCurrency = item.getAttribute('data-currency');
                if (itemCurrency === settingsState.currency) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else if (settingType === 'language') {
            // Выделяем текущий язык
            const languageItems = modal.querySelectorAll('.language-item');
            languageItems.forEach(item => {
                const itemLanguage = item.getAttribute('data-language');
                if (itemLanguage === settingsState.language) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        } else if (settingType === 'reminders') {
            // Обновляем список напоминаний
            if (settingsState.reminders && settingsState.reminders.length > 0) {
                const remindersList = modal.querySelector('.reminders-list');
                
                // Очищаем список
                if (remindersList) {
                    remindersList.innerHTML = '';
                    
                    // Добавляем напоминания
                    settingsState.reminders.forEach(reminder => {
                        remindersList.appendChild(createReminderItem(reminder));
                    });
                }
            }
            
            // Устанавливаем состояние переключателя
            const toggleInput = modal.querySelector('.reminders-toggle-container .switch input');
            if (toggleInput) {
                toggleInput.checked = settingsState.remindersEnabled;
            }
        }
    } else {
        console.error(`[DEBUG] Модальное окно не найдено: ${modalId}`);
    }
}

// Функция для закрытия модального окна настроек
function closeSettingsModal(modal) {
    console.log('[DEBUG] Закрытие модального окна настроек');
    
    if (modal) {
        modal.classList.remove('active');
    } else {
        // Если модальное окно не указано, закрываем все модальные окна настроек
        document.querySelectorAll('.settings-modal.active').forEach(m => {
            m.classList.remove('active');
        });
    }
}

// Функция для переключения звука
function toggleSound() {
    console.log('[DEBUG] Переключение звука');
    
    // Находим переключатель звука
    const soundToggle = document.querySelector('.settings-item[data-setting="sound"] .switch input');
    
    if (soundToggle) {
        // Инвертируем состояние
        soundToggle.checked = !soundToggle.checked;
        
        // Обновляем настройки
        settingsState.soundEnabled = soundToggle.checked;
        
        // Сохраняем настройки
        saveSettingsToStorage();
        
        console.log(`[DEBUG] Звук ${settingsState.soundEnabled ? 'включен' : 'выключен'}`);
    }
}

// Установка обработчиков для импорта/экспорта данных
function setupDataHandlers() {
    console.log('[DEBUG] Настройка обработчиков для данных');
    
    // Обработчик для кнопки импорта
    const importButton = document.querySelector('.import-button');
    if (importButton) {
        importButton.addEventListener('click', () => {
            console.log('[DEBUG] Импорт данных');
            
            // Создаем невидимый элемент ввода файла
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            
            // Добавляем обработчик выбора файла
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const importedData = JSON.parse(event.target.result);
                            
                            // Проверяем валидность данных
                            if (importedData.transactions && Array.isArray(importedData.transactions)) {
                                // Сохраняем импортированные данные
                                localStorage.setItem('transactions', JSON.stringify(importedData.transactions));
                                
                                // Обновляем отображение транзакций
                                state.transactions = importedData.transactions;
                                updateTransactionsList();
                                
                                // Обновляем сводку
                                updateSummary(state.transactions);
                                
                                // Если в импортированных данных есть настройки, обновляем их
                                if (importedData.settings) {
                                    Object.assign(settingsState, importedData.settings);
                                    saveSettingsToStorage();
                                    updateCurrencyDisplay();
                                    updateLanguageDisplay();
                                }
                                
                                alert('Данные успешно импортированы');
                            } else {
                                alert('Некорректный формат файла');
                            }
                        } catch (error) {
                            console.error('[DEBUG] Ошибка импорта:', error);
                            alert('Ошибка при импорте данных');
                        }
                    };
                    reader.readAsText(file);
                }
            });
            
            // Имитируем клик по элементу ввода файла
            document.body.appendChild(fileInput);
            fileInput.click();
            
            // Удаляем элемент после выбора файла
            fileInput.addEventListener('blur', () => {
                document.body.removeChild(fileInput);
            });
        });
    }
    
    // Обработчик для кнопки экспорта
    const exportButton = document.querySelector('.export-button');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            console.log('[DEBUG] Экспорт данных');
            
            // Получаем данные для экспорта
            const exportData = {
                transactions: state.transactions || [],
                settings: settingsState
            };
            
            // Подготавливаем данные для загрузки
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            // Создаем ссылку для скачивания
            const dateStr = new Date().toISOString().slice(0, 10);
            const exportFileDefaultName = `finance_tracker_backup_${dateStr}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.style.display = 'none';
            
            // Добавляем ссылку в DOM, имитируем клик и удаляем
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
        });
    }
}

// Установка обработчиков для функции поделиться
function setupShareHandlers() {
    console.log('[DEBUG] Настройка обработчиков для функции поделиться');
    
    // Обработчик для кнопки копирования ссылки
    const copyLinkButton = document.querySelector('.copy-link-button');
    const linkInput = document.querySelector('.share-link input');
    
    if (copyLinkButton && linkInput) {
        copyLinkButton.addEventListener('click', () => {
            console.log('[DEBUG] Копирование ссылки');
            
            // Выделяем текст в поле ввода
            linkInput.select();
            linkInput.setSelectionRange(0, 99999); // Для мобильных устройств
            
            // Копируем в буфер обмена
            try {
                document.execCommand('copy');
                alert('Ссылка скопирована в буфер обмена');
            } catch (err) {
                console.error('[DEBUG] Ошибка копирования:', err);
                alert('Не удалось скопировать ссылку');
            }
        });
    }
    
    // Обработчики для кнопок соцсетей
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
            const network = button.classList[1]; // telegram, whatsapp, vk
            const appUrl = linkInput ? linkInput.value : 'https://example.com/finance-tracker';
            const shareText = 'Попробуйте этот удобный трекер финансов!';
            
            let shareUrl = '';
            
            switch (network) {
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + appUrl)}`;
                    break;
                case 'vk':
                    shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(appUrl)}&title=${encodeURIComponent(shareText)}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank');
            }
        });
    });
}

// Обновление отображения текущего языка
function updateLanguageDisplay() {
    console.log('[DEBUG] Обновление отображения языка');
    
    // Обновляем отображение текущего языка в настройках
    const languageSubtitle = document.querySelector('.settings-item[data-setting="language"] .settings-item-subtitle');
    
    if (languageSubtitle) {
        if (settingsState.language === 'ru') {
            languageSubtitle.textContent = 'Русский';
        } else if (settingsState.language === 'en') {
            languageSubtitle.textContent = 'English';
        }
    }
}

// Функция для инициализации Google Sign-In
function initializeGoogleSignIn() {
    console.log('[DEBUG] Инициализация Google Sign-In');
    
    // Проверка протокола - запрещаем авторизацию через file://
    if (window.location.protocol === 'file:') {
        console.warn('[DEBUG] Обнаружен протокол file:// - авторизация через Google невозможна');
        
        // Убираем кнопку Google и показываем сообщение об ошибке
        const buttonContainer = document.getElementById('google-signin-button');
        if (buttonContainer) {
            buttonContainer.innerHTML = `
                <div class="auth-error-message">
                    <span class="material-icons">error</span>
                    <p>Авторизация через Google недоступна при открытии как локального файла.</p>
                    <p>Используйте локальный веб-сервер (http://localhost).</p>
                </div>
            `;
        }
        return;
    }
    
    // Создаем кнопку входа с Google
    google.accounts.id.initialize({
        client_id: '847891057280-7uq6pf0fjc1f8cdnqouf7cj2tkjnkm1b.apps.googleusercontent.com', // Тестовый client_id
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        // Добавляем информацию о происхождении запроса
        ux_mode: 'popup',
        context: 'signin',
        // Указываем локальное происхождение
        origin: window.location.origin
    });
    
    // Отображаем кнопку в контейнере
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
        google.accounts.id.renderButton(
            buttonContainer, 
            { 
                type: "standard",
                theme: "filled_black",
                size: "large",
                text: "signin_with",
                shape: "rectangular",
                logo_alignment: "left",
                width: 280
            }
        );
        
        console.log('[DEBUG] Кнопка Google Sign-In отрендерена');
    } else {
        console.warn('[DEBUG] Контейнер для кнопки Google Sign-In не найден');
    }
    
    // Проверяем, авторизован ли уже пользователь
    if (localStorage.getItem('userProfile')) {
        try {
            userProfile = JSON.parse(localStorage.getItem('userProfile'));
            if (userProfile.isSignedIn) {
                updateUserProfileUI();
            }
        } catch (error) {
            console.error('[DEBUG] Ошибка при загрузке профиля пользователя:', error);
        }
    }
    
    // Настраиваем кнопку выхода
    const logoutButton = document.querySelector('.logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOut();
        });
    }
}

// Обработчик ответа от Google Sign-In
function handleCredentialResponse(response) {
    console.log('[DEBUG] Получен ответ от Google Sign-In');
    
    // Декодируем JWT токен
    const payload = parseJwt(response.credential);
    console.log('[DEBUG] Данные пользователя:', payload);
    
    // Сохраняем данные пользователя
    userProfile = {
        isSignedIn: true,
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        imageUrl: payload.picture
    };
    
    // Сохраняем профиль в localStorage
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    
    // Обновляем интерфейс
    updateUserProfileUI();
    
    // В реальном приложении здесь можно добавить код для синхронизации данных с сервером
    // и загрузки данных пользователя
}

// Функция для разбора JWT токена
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
}

// Функция для обновления UI после входа пользователя
function updateUserProfileUI() {
    console.log('[DEBUG] Обновление UI пользователя');
    
    // Проверка протокола - не показываем профиль пользователя на file://
    if (window.location.protocol === 'file:') {
        console.warn('[DEBUG] Обнаружен протокол file:// - авторизация через Google невозможна');
        return;
    }
    
    // Скрываем кнопку входа и показываем профиль
    const googleButton = document.getElementById('google-signin-button');
    const profileContainer = document.querySelector('.user-profile-container');
    
    if (userProfile.isSignedIn) {
        if (googleButton) googleButton.style.display = 'none';
        if (profileContainer) {
            profileContainer.style.display = 'block';
            
            // Заполняем данные профиля
            const nameElement = profileContainer.querySelector('.user-profile-name');
            const emailElement = profileContainer.querySelector('.user-profile-email');
            const imageElement = profileContainer.querySelector('.user-profile-image');
            
            if (nameElement) nameElement.textContent = userProfile.name;
            if (emailElement) emailElement.textContent = userProfile.email;
            if (imageElement) imageElement.src = userProfile.imageUrl;
            
            // Обновляем информацию в настройках
            const profileSubtitle = document.querySelector('.settings-item[data-setting="profile"] .settings-item-subtitle');
            if (profileSubtitle) profileSubtitle.textContent = userProfile.email;
        }
    } else {
        if (googleButton) googleButton.style.display = 'flex';
        if (profileContainer) profileContainer.style.display = 'none';
        
        // Обновляем информацию в настройках
        const profileSubtitle = document.querySelector('.settings-item[data-setting="profile"] .settings-item-subtitle');
        if (profileSubtitle) profileSubtitle.textContent = 'Не выполнен вход';
    }
}

// Функция для выхода из аккаунта
function signOut() {
    console.log('[DEBUG] Выход из аккаунта Google');
    
    // Сбрасываем данные пользователя
    userProfile = {
        isSignedIn: false,
        id: null,
        name: null,
        email: null,
        imageUrl: null
    };
    
    // Удаляем данные из localStorage
    localStorage.removeItem('userProfile');
    
    // Обновляем интерфейс
    updateUserProfileUI();
    
    // В реальном приложении здесь может быть код для отмены синхронизации с сервером
    // и сброса локального кэша данных пользователя
    
    // Закрываем модальное окно профиля
    const profileModal = document.getElementById('profile-modal');
    if (profileModal) closeSettingsModal(profileModal);
}

// Добавляем инициализацию Google Sign-In при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Существующий код инициализации...
    
    // Инициализация Google Sign-In
    setTimeout(() => {
        initializeGoogleSignIn();
    }, 1000);
});

// ... existing code ...