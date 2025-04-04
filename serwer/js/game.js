class PongGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;

        this.paddleWidth = 10;
        this.paddleHeight = 100;
        this.ballSize = 10;
        this.ballSpeed = 5;

        this.playerPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0
        };

        this.opponentPaddle = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0
        };

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            dx: this.ballSpeed,
            dy: 0
        };

        this.keys = {
            up: false,
            down: false
        };

        // Подключение к серверу
        const SERVER_URL = 'http://31.185.7.85:3000';
        console.log('Подключение к серверу:', SERVER_URL);
        this.socket = io(SERVER_URL, {
            transports: ['websocket'],
            cors: {
                origin: "*"
            }
        });

        this.socket.on('connect', () => {
            console.log('Подключено к серверу');
        });

        this.socket.on('connect_error', (error) => {
            console.error('Ошибка подключения:', error);
        });

        this.setupSocketListeners();
        this.setupEventListeners();
        this.setupScreenHandlers();
        this.loadSettings();
    }

    setupSocketListeners() {
        this.socket.on('registered', (data) => {
            console.log('Зарегистрирован, рейтинг:', data.rating);
            this.rating = data.rating;
        });

        this.socket.on('gameStart', (data) => {
            console.log('Игра началась:', data);
            this.side = data.side;
            this.opponentName = data.opponent;
            this.showScreen('game');
            this.startGame();
        });

        this.socket.on('waiting', () => {
            console.log('Ожидание второго игрока');
            this.showScreen('waiting');
        });

        this.socket.on('opponentPaddleMove', (position) => {
            this.opponentPaddle.y = position;
        });

        this.socket.on('ballUpdate', (ballData) => {
            if (this.side === 'right') {
                this.ball = ballData;
            }
        });

        this.socket.on('scoreUpdate', (scores) => {
            this.updateScore(scores);
        });

        this.socket.on('gameOver', (data) => {
            this.handleGameOver(data);
        });

        this.socket.on('opponentDisconnected', () => {
            this.handleOpponentDisconnect();
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') this.keys.up = true;
            if (e.key === 'ArrowDown' || e.key === 's') this.keys.down = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'w') this.keys.up = false;
            if (e.key === 'ArrowDown' || e.key === 's') this.keys.down = false;
        });

        document.getElementById('play-button').addEventListener('click', () => {
            console.log('Кнопка "Играть" нажата');
            const playerName = document.getElementById('player-name').value;
            console.log('Имя игрока:', playerName);
            if (playerName.trim()) {
                console.log('Отправка register');
                this.socket.emit('register', { name: playerName });
                console.log('Отправка findGame');
                this.socket.emit('findGame');
            }
        });

        document.getElementById('surrender-button').addEventListener('click', () => {
            this.socket.emit('surrender');
        });

        document.getElementById('play-again-button').addEventListener('click', () => {
            this.showScreen('menu');
        });
    }

    setupScreenHandlers() {
        // Обработчики для таблицы лидеров
        document.getElementById('leaderboard-button').addEventListener('click', () => {
            this.showScreen('leaderboard');
            this.socket.emit('getLeaderboard');
        });

        document.getElementById('back-button').addEventListener('click', () => {
            this.showScreen('menu');
        });

        // Обработчики для настроек
        document.getElementById('settings-button').addEventListener('click', () => {
            this.showScreen('settings');
        });

        document.getElementById('settings-back-button').addEventListener('click', () => {
            this.showScreen('menu');
            this.saveSettings();
        });

        // Обработчики громкости
        document.getElementById('sound-volume').addEventListener('change', (e) => {
            this.settings.soundVolume = e.target.value;
        });

        document.getElementById('music-volume').addEventListener('change', (e) => {
            this.settings.musicVolume = e.target.value;
        });
    }

    loadSettings() {
        this.settings = JSON.parse(localStorage.getItem('pongSettings')) || {
            soundVolume: 50,
            musicVolume: 50
        };

        document.getElementById('sound-volume').value = this.settings.soundVolume;
        document.getElementById('music-volume').value = this.settings.musicVolume;
    }

    saveSettings() {
        localStorage.setItem('pongSettings', JSON.stringify(this.settings));
    }

    startGame() {
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (this.keys.up && this.playerPaddle.y > 0) {
            this.playerPaddle.y -= 5;
        }
        if (this.keys.down && this.playerPaddle.y < this.canvas.height - this.paddleHeight) {
            this.playerPaddle.y += 5;
        }

        this.socket.emit('paddleMove', this.playerPaddle.y);

        if (this.side === 'left') {
            this.updateBall();
            this.socket.emit('ballUpdate', this.ball);
        }
    }

    updateBall() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Отскок от верхней и нижней стенки
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy = -this.ball.dy;
        }

        // Отскок от платформ
        if (this.checkPaddleCollision()) {
            this.ball.dx = -this.ball.dx;
            this.ball.dy = (Math.random() - 0.5) * this.ballSpeed;
            this.playSound('hit');
        }

        // Проверка на гол
        if (this.ball.x <= 0 || this.ball.x >= this.canvas.width) {
            if (this.ball.x <= 0) {
                this.opponentPaddle.score++;
            } else {
                this.playerPaddle.score++;
            }
            this.resetBall();
            this.socket.emit('score', {
                player1: this.playerPaddle.score,
                player2: this.opponentPaddle.score
            });
            this.playSound('score');
        }
    }

    checkPaddleCollision() {
        // Проверка столкновения с левой платформой
        if (this.ball.x <= this.paddleWidth && 
            this.ball.y >= this.playerPaddle.y && 
            this.ball.y <= this.playerPaddle.y + this.paddleHeight) {
            return true;
        }
        
        // Проверка столкновения с правой платформой
        if (this.ball.x >= this.canvas.width - this.paddleWidth && 
            this.ball.y >= this.opponentPaddle.y && 
            this.ball.y <= this.opponentPaddle.y + this.paddleHeight) {
            return true;
        }

        return false;
    }

    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.dx = this.side === 'left' ? this.ballSpeed : -this.ballSpeed;
        this.ball.dy = 0;
    }

    draw() {
        // Очистка canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Отрисовка разделительной линии
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Отрисовка платформ
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, this.playerPaddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(
            this.canvas.width - this.paddleWidth,
            this.opponentPaddle.y,
            this.paddleWidth,
            this.paddleHeight
        );

        // Отрисовка мяча
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    updateScore(scores) {
        document.getElementById('player-score').textContent = this.side === 'left' ? 
            scores.player1 : scores.player2;
        document.getElementById('opponent-score').textContent = this.side === 'left' ? 
            scores.player2 : scores.player1;
    }

    handleGameOver(data) {
        const resultMessage = document.getElementById('result-message');
        const ratingChange = document.getElementById('rating-change');
        
        resultMessage.textContent = data.won ? 'Победа!' : 'Поражение';
        ratingChange.textContent = data.ratingChange > 0 ? 
            `+${data.ratingChange}` : data.ratingChange;
        
        this.showScreen('game-over');
        this.playSound(data.won ? 'victory' : 'defeat');
    }

    handleOpponentDisconnect() {
        const resultMessage = document.getElementById('result-message');
        resultMessage.textContent = 'Противник отключился';
        this.showScreen('game-over');
    }

    playSound(soundName) {
        // Здесь можно добавить воспроизведение звуков
        const volume = this.settings.soundVolume / 100;
        // TODO: Реализовать систему звуков
    }
}

// Создание экземпляра игры при загрузке страницы
window.addEventListener('load', () => {
    new PongGame();
}); 
