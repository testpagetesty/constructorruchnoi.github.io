class FinanceManager {
    constructor() {
        this.container = document.getElementById('finance');
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.init();
    }

    init() {
        this.renderTransactionForm();
        this.setupEventListeners();
        this.updateBalance();
    }

    renderTransactionForm() {
        const formHTML = `
            <div class="transaction-form">
                <form id="transactionForm">
                    <div class="form-group">
                        <label for="transactionType" data-i18n="finance.type">Тип</label>
                        <select id="transactionType" required>
                            <option value="income" data-i18n="finance.income">Доход</option>
                            <option value="expense" data-i18n="finance.expense">Расход</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="transactionAmount" data-i18n="finance.amount">Сумма</label>
                        <input type="number" id="transactionAmount" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label for="transactionDate" data-i18n="finance.date">Дата</label>
                        <input type="date" id="transactionDate" required>
                    </div>
                    <div class="form-group">
                        <label for="transactionDescription" data-i18n="finance.description">Описание</label>
                        <input type="text" id="transactionDescription" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="cancelTransaction" data-i18n="finance.cancel">Отмена</button>
                        <button type="submit" class="btn btn-primary" data-i18n="finance.add">Добавить</button>
                    </div>
                </form>
            </div>
        `;

        // Добавляем форму после кнопки добавления транзакции
        const addButton = this.container.querySelector('.add-transaction-btn');
        addButton.insertAdjacentHTML('afterend', formHTML);
    }

    setupEventListeners() {
        // Открытие формы
        const addButton = this.container.querySelector('.add-transaction-btn');
        const form = this.container.querySelector('.transaction-form');
        const cancelButton = this.container.querySelector('#cancelTransaction');

        addButton.addEventListener('click', () => {
            form.classList.add('active');
            addButton.style.display = 'none';
        });

        // Отмена добавления
        cancelButton.addEventListener('click', () => {
            form.classList.remove('active');
            addButton.style.display = 'flex';
            form.querySelector('form').reset();
        });

        // Добавление транзакции
        const transactionForm = this.container.querySelector('#transactionForm');
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const transaction = {
                id: Date.now(),
                type: transactionForm.querySelector('#transactionType').value,
                amount: parseFloat(transactionForm.querySelector('#transactionAmount').value),
                date: transactionForm.querySelector('#transactionDate').value,
                description: transactionForm.querySelector('#transactionDescription').value
            };

            this.addTransaction(transaction);
            
            // Сброс и закрытие формы
            form.classList.remove('active');
            addButton.style.display = 'flex';
            transactionForm.reset();
        });
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        this.updateBalance();
        this.renderTransactions();
    }

    updateBalance() {
        const balance = this.transactions.reduce((acc, trans) => {
            return acc + (trans.type === 'income' ? trans.amount : -trans.amount);
        }, 0);

        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + t.amount, 0);

        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + t.amount, 0);

        // Обновляем отображение
        this.container.querySelector('.currency-value').textContent = balance.toFixed(2);
        this.container.querySelector('.income-amount').textContent = income.toFixed(2);
        this.container.querySelector('.expense-amount').textContent = expense.toFixed(2);

        // Обновляем отображение валюты
        const settingsManager = new SettingsManager();
        settingsManager.updateCurrencyDisplay();
    }

    renderTransactions() {
        const listContainer = this.container.querySelector('.transactions-list');
        listContainer.innerHTML = this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(trans => `
                <div class="transaction-item ${trans.type}">
                    <div class="transaction-date">${new Date(trans.date).toLocaleDateString()}</div>
                    <div class="transaction-description">${trans.description}</div>
                    <div class="transaction-amount currency-value">
                        ${trans.type === 'income' ? '+' : '-'}${trans.amount.toFixed(2)}
                    </div>
                    <button class="delete-transaction" data-id="${trans.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `)
            .join('');

        // Добавляем обработчики для удаления
        listContainer.querySelectorAll('.delete-transaction').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                this.deleteTransaction(id);
            });
        });
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        this.updateBalance();
        this.renderTransactions();
    }
}

// Инициализация модуля финансов
document.addEventListener('DOMContentLoaded', () => {
    const financeManager = new FinanceManager();
}); 