let currentLang = 'de';
let surveyCompleted = false;
let currentQuestion = 1;

const companies = {
    apple: {
        name: 'Apple Inc. (AAPL)',
        annualReturn: 0.15
    },
    microsoft: {
        name: 'Microsoft Corp. (MSFT)',
        annualReturn: 0.20
    },
    google: {
        name: 'Alphabet Inc. (GOOGL)',
        annualReturn: 0.18
    },
    amazon: {
        name: 'Amazon.com Inc. (AMZN)',
        annualReturn: 0.17
    },
    nvidia: {
        name: 'NVIDIA Corp. (NVDA)',
        annualReturn: 0.25
    }
};

const languageNames = {
    de: 'Deutsch',
    en: 'English',
    ru: 'Русский'
};

// Функция для изменения языка
function changeLanguage(lang) {
    currentLang = lang;
    
    // Обновляем текст текущего языка
    document.getElementById('current-language').textContent = languageNames[lang];
    
    // Обновляем активный элемент в выпадающем списке
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent === languageNames[lang]) {
            item.classList.add('active');
        }
    });
    
    updateTexts();
}

// Обновление всех текстов на странице
function updateTexts() {
    document.getElementById('age-question').textContent = translations[currentLang].ageQuestion;
    document.getElementById('citizenship-question').textContent = translations[currentLang].citizenshipQuestion;
    document.getElementById('welcome-text').textContent = translations[currentLang].welcome;
    document.getElementById('motivation-text').textContent = translations[currentLang].motivation;
    document.getElementById('calc-title').textContent = translations[currentLang].calculator;
    document.getElementById('company-label').textContent = translations[currentLang].company;
    document.getElementById('amount-label').textContent = translations[currentLang].amount;
    document.getElementById('months-label').textContent = translations[currentLang].months;
    document.getElementById('calc-btn').textContent = translations[currentLang].calculate;
    document.getElementById('survey-title').textContent = translations[currentLang].survey;
    document.getElementById('survey-description').textContent = translations[currentLang].surveyDescription;
    document.getElementById('start-survey-btn').textContent = translations[currentLang].startSurvey;
    document.getElementById('q1').textContent = translations[currentLang].q1;
    document.getElementById('q2').textContent = translations[currentLang].q2;
    document.getElementById('q3').textContent = translations[currentLang].q3;
    document.getElementById('reg-title').textContent = translations[currentLang].registration;
    document.getElementById('name-label').textContent = translations[currentLang].name;
    document.getElementById('email-label').textContent = translations[currentLang].email;
    document.getElementById('phone-label').textContent = translations[currentLang].phone;
    document.getElementById('submit-btn').textContent = translations[currentLang].register;
    document.getElementById('thank-you-text').textContent = translations[currentLang].thankYou;
    document.getElementById('contact-text').textContent = translations[currentLang].contact;
    document.getElementById('back-btn').textContent = translations[currentLang].backToCalc;

    // Обновляем все кнопки Да/Нет
    document.querySelectorAll('.button-group .btn').forEach(btn => {
        if (btn.textContent === 'Ja' || btn.textContent === 'Yes' || btn.textContent === 'Да') {
            btn.textContent = translations[currentLang].yes;
        } else if (btn.textContent === 'Nein' || btn.textContent === 'No' || btn.textContent === 'Нет') {
            btn.textContent = translations[currentLang].no;
        }
    });
}

// Обработка ответа на вопрос о возрасте
function answerAge(isAdult) {
    if (!isAdult) {
        // Если пользователю меньше 18, показываем сообщение и блокируем доступ
        const modal = document.getElementById('citizenship-modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${translations[currentLang].notAllowedAge}</h2>
            </div>
        `;
        return;
    }
    
    // Если пользователю 18 или больше, показываем вопрос о гражданстве
    document.getElementById('age-question-container').classList.add('hidden');
    document.getElementById('citizenship-question-container').classList.remove('hidden');
}

// Обработка ответа на вопрос о гражданстве
function answerCitizenship(isGerman) {
    document.getElementById('citizenship-modal').classList.add('hidden');
}

// Калькулятор инвестиций
function calculateInvestment() {
    const selectedCompany = document.getElementById('company-select').value;
    const amount = parseFloat(document.getElementById('investment-amount').value);
    const months = parseInt(document.getElementById('investment-months').value);
    
    const company = companies[selectedCompany];
    const monthlyRate = company.annualReturn / 12;
    const result = amount * Math.pow(1 + monthlyRate, months);
    const profit = result - amount;
    
    const resultBox = document.getElementById('result');
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="company-name">${company.name}</div>
        <div class="investment-details">
            ${translations[currentLang].investmentAmount} ${amount.toFixed(2)}${translations[currentLang].currency}<br>
            ${translations[currentLang].investmentPeriod} ${months} ${translations[currentLang].monthsLabel}<br>
            ${translations[currentLang].annualReturn}: ${(company.annualReturn * 100).toFixed(1)}%
        </div>
        <div class="profit">
            ${translations[currentLang].potentialReturn} ${result.toFixed(2)}${translations[currentLang].currency}<br>
            (+${profit.toFixed(2)}${translations[currentLang].currency})
        </div>
    `;
}

// Начало опроса
function startSurvey() {
    currentQuestion = 1;
    document.getElementById('survey-modal').classList.remove('hidden');
    document.getElementById('survey-modal').classList.add('fade-in');
    updateProgress();
}

// Обновление прогресс-бара
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    progressFill.style.width = `${(currentQuestion / 3) * 100}%`;
    progressText.textContent = `${currentQuestion}/3`;
}

// Обработка ответов на вопросы опроса
function answerSurveyQuestion(questionNumber, answer) {
    // Скрываем текущий вопрос
    document.getElementById(`survey-question-${questionNumber}`).classList.add('hidden');
    
    if (questionNumber < 3) {
        // Показываем следующий вопрос
        currentQuestion++;
        document.getElementById(`survey-question-${currentQuestion}`).classList.remove('hidden');
        updateProgress();
    } else {
        // Закрываем модальное окно опроса
        document.getElementById('survey-modal').classList.remove('fade-in');
        document.getElementById('survey-modal').classList.add('hidden');
        
        // Показываем форму регистрации
        document.getElementById('registration-modal').classList.remove('hidden');
        document.getElementById('registration-modal').classList.add('fade-in');
    }
}

// Обработка отправки формы регистрации
function submitRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Скрываем форму регистрации
    document.getElementById('registration-modal').classList.add('hidden');
    
    // Показываем окно благодарности
    document.getElementById('thank-you').classList.remove('hidden');
    document.getElementById('thank-you').classList.add('fade-in');
}

// Закрытие окна благодарности
function closeThankYou() {
    document.getElementById('thank-you').classList.remove('fade-in');
    document.getElementById('thank-you').classList.add('hidden');
    // Возвращаемся к калькулятору
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
}

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    updateTexts();
});