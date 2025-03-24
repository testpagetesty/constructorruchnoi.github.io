class FinanceManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.container = document.getElementById('finance');
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="finance-container">
                <div class="balance-card">
                    <h2 data-i18n="finance.balance">Баланс</h2>
                    <div class="balance-amount">${this.calculateBalance()} ₽</div>
                    <div class="balance-details">
                        <div class="income">
                            <span data-i18n="finance.income">Доход</span>: 
                            <span class="income-amount">+${this.calculateIncome()} ₽</span>
                        </div>
                        <div class="expense">
                            <span data-i18n="finance.expense">Расход</span>: 
                            <span class="expense-amount">-${this.calculateExpense()} ₽</span>
                        </div>
                    </div>
                </div>

                <button class="add-transaction-btn" data-i18n="finance.addTransaction">
                    Добавить транзакцию
                </button>

                <div class="transaction-form" style="display: none;">
                    <form id="transactionForm">
                        <select name="type" required>
                            <option value="income" data-i18n="finance.income">Доход</option>
                            <option value="expense" data-i18n="finance.expense">Расход</option>
                        </select>
                        <input type="number" name="amount" placeholder="Сумма" required>
                        <select name="category" required>
                            <option value="salary" data-i18n="finance.categories.salary">Зарплата</option>
                            <option value="food" data-i18n="finance.categories.food">Еда</option>
                            <option value="transport" data-i18n="finance.categories.transport">Транспорт</option>
                            <option value="entertainment" data-i18n="finance.categories.entertainment">Развлечения</option>
                        </select>
                        <input type="date" name="date" required>
                        <textarea name="description" placeholder="Описание"></textarea>
                        <button type="submit">Сохранить</button>
                        <button type="button" class="cancel-btn">Отмена</button>
                    </form>
                </div>

                <div class="transactions-list">
                    ${this.renderTransactions()}
                </div>
            </div>
        `;

        // Обновляем переводы на странице
        localization.updatePageLanguage();
    }

    renderTransactions() {
        return this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => `
                <div class="transaction-item ${transaction.type}">
                    <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
                    <div class="transaction-category">${transaction.category}</div>
                    <div class="transaction-amount">
                        ${transaction.type === 'income' ? '+' : '-'}${transaction.amount} ₽
                    </div>
                    <div class="transaction-description">${transaction.description || ''}</div>
                    <button class="delete-transaction" data-id="${transaction.id}">×</button>
                </div>
            `)
            .join('');
    }

    setupEventListeners() {
        const addBtn = this.container.querySelector('.add-transaction-btn');
        const form = this.container.querySelector('#transactionForm');
        const cancelBtn = this.container.querySelector('.cancel-btn');

        addBtn.addEventListener('click', () => {
            this.container.querySelector('.transaction-form').style.display = 'block';
            addBtn.style.display = 'none';
        });

        cancelBtn.addEventListener('click', () => {
            this.container.querySelector('.transaction-form').style.display = 'none';
            addBtn.style.display = 'block';
            form.reset();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction(new FormData(form));
            form.reset();
            this.container.querySelector('.transaction-form').style.display = 'none';
            addBtn.style.display = 'block';
        });

        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-transaction')) {
                const id = e.target.dataset.id;
                this.deleteTransaction(id);
            }
        });
    }

    addTransaction(formData) {
        const transaction = {
            id: Date.now().toString(),
            type: formData.get('type'),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            date: formData.get('date'),
            description: formData.get('description')
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.render();
    }

    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveTransactions();
        this.render();
    }

    calculateBalance() {
        return this.calculateIncome() - this.calculateExpense();
    }

    calculateIncome() {
        return this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    calculateExpense() {
        return this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }

    saveTransactions() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }
}

// Инициализация модуля финансов
document.addEventListener('DOMContentLoaded', () => {
    const financeManager = new FinanceManager();
}); 