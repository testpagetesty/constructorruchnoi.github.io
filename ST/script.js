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

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Обработчики навигации по месяцам
    const prevMonth = document.querySelector('.prev-month');
    const nextMonth = document.querySelector('.next-month');
    
    if (prevMonth) {
        prevMonth.addEventListener('click', () => {
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
    
    if (nextMonth) {
        nextMonth.addEventListener('click', () => {
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
    
    // Обработчик выбора категории
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
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
            document.querySelectorAll('.category-item').forEach(cat => {
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
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            
            // Обновляем активную страницу
            document.querySelectorAll('.content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Обновляем активную кнопку навигации
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });
            item.classList.add('active');

            // Скрываем все модальные окна
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });

            // Обработка специфических действий для каждой страницы
            switch (page) {
                case 'main':
                    // Показываем основную страницу с транзакциями
                    document.getElementById('main').classList.add('active');
                    updateTransactionsList();
                    updateSummary();
                    document.querySelector('.add-button').style.display = 'flex';
                    break;
                    
                case 'reports':
                    // Показываем страницу отчетов
                    document.getElementById('reports').classList.add('active');
                    document.querySelector('.add-button').style.display = 'none';
                    if (typeof initializeReports === 'function') {
                        initializeReports();
                    }
                    break;
                    
                case 'categories':
                    // Показываем модальное окно выбора типа транзакции
                    document.querySelector('.transaction-type-modal').classList.add('active');
                    document.querySelector('.add-button').style.display = 'none';
                    break;
                    
                case 'settings':
                    // Показываем страницу настроек
                    document.getElementById('settings').classList.add('active');
                    document.querySelector('.add-button').style.display = 'none';
                    break;
            }

            state.currentPage = page;
        });
    });

    // Инициализация - показываем главную страницу при загрузке
    const mainContent = document.getElementById('main');
    if (mainContent) {
        mainContent.classList.add('active');
        updateTransactionsList();
        updateSummary();
    }
    const mainNavItem = document.querySelector('.nav-item[data-page="main"]');
    if (mainNavItem) {
        mainNavItem.classList.add('active');
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

            // Отключаем кнопку на время сохранения
            saveButton.disabled = true;

            const fromBank = transferForm.querySelector('.bank-from .bank-select').value;
            const fromAccount = transferForm.querySelector('.bank-from .account-number').value;
            const toBank = transferForm.querySelector('.bank-to .bank-select').value;
            const toAccount = transferForm.querySelector('.bank-to .account-number').value;
            const amount = transferForm.querySelector('.amount-field input').value;
            const scheduleDay = transferForm.querySelector('.schedule-field input').value;
            const note = transferForm.querySelector('.note-field input').value;

            if (!fromBank || !fromAccount || !toBank || !toAccount || !amount || !scheduleDay) {
                alert('Пожалуйста, заполните все обязательные поля');
                saveButton.disabled = false;
                return;
            }

            // Проверяем корректность дня
            const day = parseInt(scheduleDay);
            if (isNaN(day) || day < 1 || day > 31) {
                alert('Пожалуйста, введите корректный день месяца (1-31)');
                saveButton.disabled = false;
                return;
            }

            saveTransfer({
                fromBank,
                fromAccount,
                toBank,
                toAccount,
                amount,
                scheduleDay: day,
                note
            });

            // Очищаем форму и сбрасываем состояние
            transferForm.reset();
            delete transferForm.dataset.editId;
            saveButton.textContent = 'Сохранить';
            saveButton.disabled = false;
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
    const editId = transferForm.dataset.editId;
    
    if (editId) {
        // Редактирование существующего перевода
        const transferIndex = savedTransfers.findIndex(t => t.id === parseInt(editId));
        if (transferIndex !== -1) {
            // Сохраняем состояние уведомлений и ID
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

    // Инициализация при загрузке
    updateMonthDisplay();
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
    
    console.log('Транзакция сохранена:', transaction);
    console.log('Всего транзакций:', transactions.length);

    // Обновляем отчеты, если модальное окно отчетов открыто
    const reportsModal = document.querySelector('.reports-modal');
    if (reportsModal && reportsModal.classList.contains('active')) {
        updateReport();
    }
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
    console.log('Initializing expense chart');
    
    // Получаем контекст холста
    const ctx = document.getElementById('expenseChart')?.getContext('2d');
    if (!ctx) {
        console.error('Chart canvas not found');
        return;
    }
    
    // Уничтожаем существующую диаграмму, если она есть
    if (window.expenseChart instanceof Chart) {
        window.expenseChart.destroy();
    }
    
    // Данные для диаграммы (фиксированные для простоты)
    const data = {
        labels: ['Инвестиции', 'Одежда', 'Транспорт', 'Дом'],
        datasets: [{
            data: [11112, 2223, 112, 1123],
            backgroundColor: [
                '#32D74B', // Зеленый для инвестиций (доход)
                '#FF453A', // Красный для расходов
                '#FF453A',
                '#FF453A'
            ],
            borderWidth: 0,
            spacing: 2
        }]
    };
    
    // Создаем новую диаграмму
    window.expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
    
    console.log('Chart initialized');
}

function initializeReports() {
    console.log('Initializing reports');

    // Получаем элементы для работы с отчетами
    const reportsButton = document.querySelector('.nav-item[data-page="reports"]');
    const reportsModal = document.querySelector('.reports-modal');
    const closeButton = reportsModal.querySelector('.close-button');
    
    // Получаем переключатель периода
    const periodButtons = reportsModal.querySelectorAll('.period-button');
    
    // Получаем кнопки переключения типа отчета
    const expenseButton = reportsModal.querySelector('.expense-button');
    const incomeButton = reportsModal.querySelector('.income-button');
    
    // Добавляем обработчик для открытия отчетов
    reportsButton.addEventListener('click', () => {
        reportsModal.classList.add('active');
        
        // Принудительно обновляем state из localStorage перед обновлением отчета
        state.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        
        // Добавляем небольшую задержку перед загрузкой отчета
        setTimeout(() => {
            updateReport(); // Обновляем отчет с задержкой
        }, 300);
    });
    
    // Добавляем обработчик для закрытия отчетов
    closeButton.addEventListener('click', () => {
        reportsModal.classList.remove('active');
    });
    
    // Добавляем обработчики для переключения периода
    periodButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Снимаем активность со всех кнопок
            periodButtons.forEach(btn => btn.classList.remove('active'));
            // Делаем текущую кнопку активной
            button.classList.add('active');
            // Обновляем отчет с новым периодом
            updateReport();
        });
    });
    
    // Добавляем обработчики для переключения типа отчета
    expenseButton.addEventListener('click', () => {
        expenseButton.classList.add('active');
        incomeButton.classList.remove('active');
        updateReport();
    });
    
    incomeButton.addEventListener('click', () => {
        incomeButton.classList.add('active');
        expenseButton.classList.remove('active');
        updateReport();
    });
    
    // Инициализируем диаграмму с задержкой при первой загрузке
    setTimeout(() => {
        initializeChart();
    }, 300);
    
    console.log('Report initialization complete');
}

// Функция для обновления отчета
function updateReport() {
    console.log('Updating report...');
    
    // Определяем текущие режимы отчета
    const isExpense = document.querySelector('.reports-modal .expense-button').classList.contains('active');
    const isMonthPeriod = document.querySelector('.reports-modal .period-button.active').textContent === 'Месяц';
    
    // Получаем текущую дату из навигации или используем текущую
    const dateText = document.querySelector('.reports-modal .date-text').textContent;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Фильтруем транзакции по типу и текущему периоду
    let filteredTransactions = state.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        
        // Проверяем соответствие типа (расход/доход)
        const typeMatch = isExpense ? transaction.type === 'expense' : transaction.type === 'income';
        
        // Проверяем соответствие периода (месяц/год)
        const periodMatch = isMonthPeriod 
            ? transactionMonth === currentMonth && transactionYear === currentYear
            : transactionYear === currentYear;
        
        return typeMatch && periodMatch;
    });
    
    // Группируем транзакции по категориям и суммируем
    const categories = {};
    filteredTransactions.forEach(transaction => {
        if (!categories[transaction.category]) {
            categories[transaction.category] = 0;
        }
        categories[transaction.category] += parseFloat(transaction.amount);
    });
    
    // Преобразуем в массив и сортируем по убыванию суммы
    let categoriesArray = Object.keys(categories).map(category => {
        return {
            name: category,
            amount: categories[category]
        };
    }).sort((a, b) => b.amount - a.amount);
    
    // Отфильтруем категорию "Другое"
    categoriesArray = categoriesArray.filter(category => 
        !category.name.includes('other_expense') && !category.name.includes('other_income'));
    
    // Вычисляем общую сумму
    const total = categoriesArray.reduce((sum, category) => sum + category.amount, 0);
    
    // Обновляем отображение общей суммы
    const chartTotal = document.querySelector('.chart-total');
    if (chartTotal) {
        chartTotal.textContent = Math.round(total).toLocaleString('ru-RU');
        
        // Устанавливаем цвет в зависимости от типа (расход/доход)
        if (isExpense) {
            chartTotal.style.color = '#FF453A'; // Красный для расходов
        } else {
            chartTotal.style.color = '#32D74B'; // Зеленый для доходов
        }
    }
    
    // Обновляем заголовок с типом отчета
    const reportTitle = document.querySelector('.reports-modal .title');
    if (reportTitle) {
        reportTitle.textContent = isExpense ? 'Расходы▼' : 'Доходы▼';
    }
    
    // Подготавливаем данные для графика
    const chartLabels = categoriesArray.map(category => category.name);
    const chartData = categoriesArray.map(category => category.amount);
    const chartColors = categoriesArray.map(category => getCategoryColor(category.name, isExpense));
    
    // Обновляем диаграмму с небольшой задержкой
    setTimeout(() => {
        if (window.expenseChart) {
            window.expenseChart.data.labels = chartLabels;
            window.expenseChart.data.datasets[0].data = chartData;
            window.expenseChart.data.datasets[0].backgroundColor = chartColors;
            window.expenseChart.update();
        } else {
            // Если диаграмма не инициализирована, создаем ее
            initializeChart();
        }
    }, 200);
    
    // Обновляем список категорий
    updateCategoryList(categoriesArray, total, isExpense);
    
    // Обновляем навигацию по датам
    updateDateNavigation();
}

function updateCategoryList(categories, total, isExpense) {
    const categoryList = document.querySelector('.reports-modal .category-list');
    if (!categoryList) return;
    
    // Очищаем текущий список
    categoryList.innerHTML = '';
    
    // Создаем элементы для каждой категории
    categories.forEach(category => {
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
    
    // Цвета для доходов
    const incomeColors = {
        'salary': '#32D74B',
        'investments': '#30D158',
        'part-time': '#32D74B',
        'rewards': '#FFD60A',
        'rental': '#30D158',
        'business': '#32D74B',
        'dividends': '#30D158',
        'freelance': '#32D74B',
        'sales': '#30D158',
        'other_income': '#32D74B'
    };
    
    // В зависимости от типа транзакции выбираем соответствующий набор цветов
    const colorMap = isExpense ? expenseColors : incomeColors;
    
    // Возвращаем цвет категории, если он есть в наборе, иначе возвращаем цвет по умолчанию
    return colorMap[category] || (isExpense ? '#FF453A' : '#32D74B');
}

// Функция для обновления навигации по датам
function updateDateNavigation() {
    const dateNavigation = document.querySelector('.reports-modal .date-navigation');
    if (!dateNavigation) return;
    
    // Сохраняем выбранный месяц и год в атрибутах элемента
    dateNavigation.dataset.selectedMonth = state.selectedMonth;
    dateNavigation.dataset.selectedYear = state.selectedYear;
    
    // Получаем названия месяцев для отображения
    const monthNames = [
        'янв.', 'февр.', 'март', 'апр.', 'май', 'июнь',
        'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'
    ];
    
    // Определяем месяц для отображения в навигации
    const currentMonthName = monthNames[state.selectedMonth];
    const currentYearShort = state.selectedYear;
    
    // Обновляем текст в навигации
    dateNavigation.innerHTML = '';
    
    // Создаем навигационные точки
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'chart-navigation';
    
    // Создаем 5 точек, где средняя точка - текущий месяц
    for (let i = -2; i <= 2; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) {
            dot.classList.add('active');
        }
        
        // Вычисляем месяц и год для этой точки
        let navMonth = state.selectedMonth + i;
        let navYear = state.selectedYear;
        
        // Корректируем переход между годами
        if (navMonth < 0) {
            navMonth = 12 + navMonth;
            navYear--;
        } else if (navMonth > 11) {
            navMonth = navMonth - 12;
            navYear++;
        }
        
        // Сохраняем данные для точки
        dot.dataset.month = navMonth;
        dot.dataset.year = navYear;
        
        // Добавляем обработчик для переключения на выбранный месяц
        dot.addEventListener('click', function() {
            // Обновляем датасет навигации
            dateNavigation.dataset.selectedMonth = this.dataset.month;
            dateNavigation.dataset.selectedYear = this.dataset.year;
            
            // Обновляем активную точку
            document.querySelectorAll('.chart-navigation .dot').forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            // Обновляем отчет
            updateReport();
        });
        
        dotsContainer.appendChild(dot);
    }
    
    // Добавляем текст с текущим месяцем и годом
    const dateText = document.createElement('div');
    dateText.className = 'date-text';
    dateText.textContent = `${currentMonthName} ${currentYearShort} г.`;
    
    // Добавляем элементы в навигацию
    dateNavigation.appendChild(dateText);
    dateNavigation.appendChild(dotsContainer);
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