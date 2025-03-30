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

// Функция для обновления даты в заголовке на текущую
function updateCurrentDateDisplay() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    
    const monthNames = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = `${day} ${month} ${year} г.`;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем дату в заголовке
    updateCurrentDateDisplay();
    
    // Загружаем и применяем сохраненные позиции категорий
    loadCategoryPositions();
    
    // Инициализация страницы
    updateDateDisplay();
    updateTransactionsDisplay();
    setupNavigation();
    
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
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.content');
    const reportsModal = document.querySelector('.reports-modal');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Получаем id страницы, которую нужно показать
            const pageId = item.dataset.page;
            
            // Если нажата кнопка категорий, открываем модальное окно выбора типа операции
            if (pageId === 'categories') {
                const reportsModal = document.querySelector('.reports-modal');
                // Если открыто окно отчетов, закрываем его
                if (reportsModal && reportsModal.classList.contains('active')) {
                    reportsModal.classList.remove('active');
                }
                
                // Убираем активный класс со всех элементов навигации
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Добавляем активный класс к кнопке категорий и подсвечиваем её желтым
                item.classList.add('active');
                item.style.color = '#FFD60A';
                
                document.querySelector('.transaction-type-modal').classList.add('active');
                return; // Прерываем выполнение функции
            }
            
            // Убираем активный класс со всех элементов навигации
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
                navItem.style.color = ''; // Сбрасываем цвет для всех кнопок
            });
            
            // Добавляем активный класс текущему элементу
            item.classList.add('active');
            
            // Скрываем все страницы
            pages.forEach(page => page.classList.remove('active'));
            
            // Показываем нужную страницу
            const targetPage = document.getElementById(pageId);
            if (targetPage) targetPage.classList.add('active');

            // Если открыто модальное окно отчетов и нажата не кнопка отчетов, закрываем его
            if (reportsModal && reportsModal.classList.contains('active') && pageId !== 'reports') {
                reportsModal.classList.remove('active');
            }

            // Если открыто модальное окно транзакций, закрываем его
            const transactionTypeModal = document.querySelector('.transaction-type-modal');
            if (transactionTypeModal && transactionTypeModal.classList.contains('active')) {
                transactionTypeModal.classList.remove('active');
            }

            // Если открыта форма добавления транзакции, закрываем её
            const popupForm = document.querySelector('.popup-form');
            if (popupForm && popupForm.classList.contains('active')) {
                popupForm.classList.remove('active');
            }
        });
    });
    
    // Добавляем обработчик для закрытия модального окна выбора типа операции
    const backButton = document.querySelector('.transaction-type-modal .back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            // Сбрасываем цвет для кнопки категорий
            const categoriesButton = document.querySelector('.nav-item[data-page="categories"]');
            if (categoriesButton) {
                categoriesButton.style.color = '';
            }
        });
    }
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
        item.addEventListener('touchstart', handleTouchStart, { passive: true }); // Изменено на passive: true для работы скролла
        item.addEventListener('touchmove', handleTouchMove, { passive: false });
        item.addEventListener('touchend', handleTouchEnd);
        
        // Обработчики для мыши
        item.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });
}

// Переменные для отслеживания начального скролла
let initialScrollY = 0;
let isScrolling = false;
let touchStartY = 0;

function handleTouchStart(e) {
    // Сохраняем начальное положение скролла и касания
    const touch = e.touches[0];
    touchStartY = touch.clientY;
    initialScrollY = e.target.closest('.categories-grid')?.scrollTop || 0;
    isScrolling = false;
    
    // Запускаем таймер для долгого нажатия
    state.dragState.longPressTimer = setTimeout(() => {
        // Только если не было скролла, начинаем перетаскивание
        if (!isScrolling) {
            e.preventDefault(); // Теперь предотвращаем стандартное поведение
            startDrag(e.target.closest('.category-item'), touch.clientX, touch.clientY);
        }
    }, 500);
}

function handleTouchMove(e) {
    const touch = e.touches[0];
    const touchCurrentY = touch.clientY;
    const grid = e.target.closest('.categories-grid');
    
    // Проверяем, происходит ли скролл (разница больше порога)
    if (Math.abs(touchCurrentY - touchStartY) > 10) {
        isScrolling = true;
        
        // Очищаем таймер долгого нажатия при скролле
        if (state.dragState.longPressTimer) {
            clearTimeout(state.dragState.longPressTimer);
            state.dragState.longPressTimer = null;
        }
    }
    
    // Если уже перетаскиваем, то предотвращаем скролл
    if (state.dragState.isDragging) {
        e.preventDefault();
        moveDrag(touch.clientX, touch.clientY);
    }
}

function handleTouchEnd() {
    // Очищаем таймер при завершении касания
    if (state.dragState.longPressTimer) {
        clearTimeout(state.dragState.longPressTimer);
        state.dragState.longPressTimer = null;
    }
    
    // Завершаем перетаскивание
    endDrag();
    
    // Сбрасываем флаг скролла
    isScrolling = false;
}

function handleMouseDown(e) {
    // Запускаем перетаскивание только на основной кнопке мыши (левой)
    if (e.button !== 0) return;
    
    // Начинаем перетаскивание
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
    if (!element) return; // Проверка на существование элемента
    
    // Очищаем предыдущий таймер если он существует
    if (state.dragState.longPressTimer) {
        clearTimeout(state.dragState.longPressTimer);
    }
    
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