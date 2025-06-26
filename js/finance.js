let updateQueue = [];
let isProcessingQueue = false;
const UPDATE_DELAY = 50;
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 60,
            "density": {
                "enable": true,
                "value_area": 600
            }
        },
        "color": {
            "value": "#d4af37"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.4,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 2.5,
            "random": true
        },
        "line_linked": {
            "enable": true,
            "distance": 120,
            "color": "#d4af37",
            "opacity": 0.2,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 1.5,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": true,
                "rotateX": 500,
                "rotateY": 1000
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 120,
                "line_linked": {
                    "opacity": 0.8
                }
            },
            "push": {
                "particles_nb": 3
            }
        }
    },
    "retina_detect": true
});

function initClickGame() {
    const modal = document.getElementById('click-game-modal');
    const gameBoard = document.getElementById('click-game-board');
    const timer = document.getElementById('click-timer');
    const clickCount = document.getElementById('click-count');
    const clickEarned = document.getElementById('click-earned');
    const closeBtn = document.getElementById('close-click-game');

    let clicks = 0;
    let timeLeft = 100;
    let gameInterval;

    // Создаем игровое поле
    gameBoard.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const square = document.createElement('div');
        square.className = 'click-item';
        square.addEventListener('click', () => {
            if (!square.classList.contains('clicked')) {
                square.classList.add('clicked');
                clicks++;
                clickCount.textContent = clicks;

                // Каждые 5 кликов добавляем 10 рублей
                if (clicks % 5 === 0) {
                    const earned = Math.floor(clicks / 5) * 10;
                    clickEarned.textContent = earned;
                }
            }
        });
        gameBoard.appendChild(square);
    }

    // Сброс игры
    function resetGame() {
        clicks = 0;
        timeLeft = 100;
        clickCount.textContent = '0';
        clickEarned.textContent = '0';
        timer.style.width = '100%';

        const squares = document.querySelectorAll('.click-item');
        squares.forEach(square => square.classList.remove('clicked'));
    }

    // Запуск игры
    function startGame() {
        resetGame();
        modal.style.display = 'flex';

        gameInterval = setInterval(() => {
            timeLeft -= 1;
            timer.style.width = `${timeLeft}%`;

            if (timeLeft <= 0) {
                clearInterval(gameInterval);
                const earned = Math.floor(clicks / 5) * 10;
                addMoney(earned);
                setTimeout(() => {
                    alert(`Вы заработали ${earned} ₽!`);
                    modal.style.display = 'none';
                }, 500);
            }
        }, 100);
    }

    // Обработчики событий
    document.querySelector('.start-click-game').addEventListener('click', startGame);
    closeBtn.addEventListener('click', () => {
        clearInterval(gameInterval);
        modal.style.display = 'none';
    });
}


// Подработка
function initSideJobs() {
    // Просмотр рекламы
    document.querySelector('.watch-ad-btn').addEventListener('click', () => {
        if (confirm('Просмотреть рекламный ролик (30 секунд) за 30 ₽?')) {
            setTimeout(() => {
                addMoney(30);
                alert('Реклама просмотрена! Вы получили 30 ₽');
            }, 30000);
        }
    });

    // Оставить отзыв
    document.querySelector('.leave-review-btn').addEventListener('click', () => {
        if (confirm('Перейти в Play Market для оставления отзыва? Вы получите 100 ₽ после возвращения.')) {
            // В реальном приложении здесь был бы переход по ссылке
            setTimeout(() => {
                addMoney(100);
                alert('Спасибо за отзыв! Вы получили 100 ₽');
            }, 2000);
        }
    });

    // Подписаться на группу
    document.querySelector('.join-vk-btn').addEventListener('click', () => {
        if (confirm('Перейти в группу ВКонтакте? Вы получите 50 ₽ после подписки.')) {
            // В реальном приложении здесь был бы переход по ссылке
            setTimeout(() => {
                addMoney(50);
                alert('Спасибо за подписку! Вы получили 50 ₽');
            }, 2000);
        }
    });
}

// Бизнес
function initBusiness() {
    document.querySelectorAll('.buy-business').forEach(btn => {
        btn.addEventListener('click', function () {
            const cost = parseInt(this.getAttribute('data-cost'));
            const income = parseInt(this.getAttribute('data-income'));
            const businessId = this.closest('.option-card').id;
            const businessName = this.closest('.option-card').querySelector('.option-title').textContent.trim();

            const stats = loadStats();

            if (stats.money >= cost) {
                if (confirm(`Купить "${businessName}" за ${cost.toLocaleString()} ₽? Это принесет вам ${income.toLocaleString()} ₽ ежедневно.`)) {
                    stats.money -= cost;

                    if (!stats.businesses) stats.businesses = [];
                    stats.businesses.push({
                        id: businessId,
                        name: businessName,
                        income: income
                    });

                    saveStats(stats);
                    updateUI(stats);
                    alert(`Поздравляем с приобретением "${businessName}"!`);
                }
            } else {
                alert(`У вас недостаточно денег. Нужно ещё ${(cost - stats.money).toLocaleString()} ₽.`);
            }
        });
    });
}

// Контракты
function initContracts() {
    document.querySelectorAll('.take-contract').forEach(btn => {
        btn.addEventListener('click', function () {
            const contractCard = this.closest('.option-card');
            const values = contractCard.querySelectorAll('.requirement-value');
            if (values.length < 4) {
                alert('Ошибка: данные контракта некорректны');
                return;
            }

            const genre = values[0].textContent.trim();
            // Убираем слово "страниц" и пробелы
            const pagesText = values[1].textContent.trim();
            const pages = parseInt(pagesText.replace(/\D/g, ''));

            // Убираем знак + и %, если есть, и парсим число качества
            const qualityText = values[2].textContent.trim();
            const quality = parseInt(qualityText.replace(/[^\d]/g, ''));

            // Убираем % и делим на 100 для коэффициента
            const bonusText = values[3].textContent.trim();
            const bonus = parseFloat(bonusText.replace(/[^\d.]/g, '')) / 100;

            if (!genre || isNaN(pages) || isNaN(quality) || isNaN(bonus)) {
                alert('Ошибка: не удалось считать параметры контракта');
                return;
            }

            if (confirm(`Взять контракт на книгу в жанре "${genre}" (${pages} страниц)?`)) {
                const stats = loadStats();
                stats.currentContract = {
                    genre,
                    pages,
                    quality,
                    bonus
                };
                saveStats(stats);

                alert(`Контракт принят! Теперь создайте книгу в жанре "${genre}" объемом ${pages} страниц.`);

            }
        });
    });
}


function initTypingGame() {
    const modal = document.getElementById('typing-game-modal');
    const typingInput = document.getElementById('typing-input');
    const typingTarget = document.getElementById('typing-target');
    const typingSpeed = document.getElementById('typing-speed');
    const typingAccuracy = document.getElementById('typing-accuracy');
    const typingEarned = document.getElementById('typing-earned');
    const typingTimer = document.getElementById('typing-timer');
    const closeBtn = document.getElementById('close-typing-game');

    let startTime;
    let timerInterval;
    let timeLeft = 100;
    let correctChars = 0;
    let totalChars = 0;

    const sampleTexts = [
        "В тот год осенняя погода стояла долго на дворе. Зимы ждали, ждали природы. Снег выпал только в январе, в ночь на третье число.",
        "Кони несут меня по неровной дороге. Колокольчик звенит странным звуком. Я слышу, как ветер гудит в ушах, и чувствую, как холодный воздух обжигает лицо.",
        "Писать — это значит выражать свои мысли словами. Чем яснее мысли, тем лучше будет текст. Практика помогает совершенствовать навык письма.",
        "Утро было холодное, но ясное. Солнце только что взошло и золотило верхушки деревьев. На траве блестела роса, и воздух был наполнен свежестью."
    ];

    function resetGame() {
        // Выбираем случайный текст
        typingTarget.textContent = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        typingInput.value = '';
        typingInput.disabled = false;
        typingSpeed.textContent = '0';
        typingAccuracy.textContent = '100';
        typingEarned.textContent = '0';
        timeLeft = 100;
        typingTimer.style.width = '100%';
        correctChars = 0;
        totalChars = 0;

        // Фокусируемся на поле ввода
        typingInput.focus();
    }

    function startGame() {
        resetGame();
        modal.style.display = 'flex';
        startTime = new Date();

        timerInterval = setInterval(() => {
            timeLeft -= 0.5;
            typingTimer.style.width = `${timeLeft}%`;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 100);
    }

    function endGame() {
        clearInterval(timerInterval);
        typingInput.disabled = true;

        const timeSpent = (new Date() - startTime) / 60000; // в минутах
        const charsPerMin = Math.floor(totalChars / timeSpent);
        const accuracy = totalChars > 0 ? Math.floor((correctChars / totalChars) * 100) : 0;

        // Расчет заработка
        const baseEarned = Math.floor(charsPerMin / 5);
        const accuracyBonus = Math.floor(baseEarned * (accuracy / 100));
        const totalEarned = baseEarned + accuracyBonus;

        typingSpeed.textContent = charsPerMin.toString();
        typingAccuracy.textContent = accuracy.toString();
        typingEarned.textContent = totalEarned.toString();

        addMoney(totalEarned);
    }

    typingInput.addEventListener('input', function () {
        const inputText = this.value;
        const targetText = typingTarget.textContent.substr(0, inputText.length);

        totalChars = inputText.length;
        correctChars = 0;

        // Считаем правильные символы
        for (let i = 0; i < inputText.length; i++) {
            if (inputText[i] === targetText[i]) {
                correctChars++;
            }
        }

        // Обновляем точность
        typingAccuracy.textContent = totalChars > 0 ? Math.floor((correctChars / totalChars) * 100) : 100;

        // Если весь текст набран, завершаем игру
        if (inputText.length === typingTarget.textContent.length) {
            endGame();
        }
    });

    document.querySelector('.start-typing-game').addEventListener('click', startGame);
    closeBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        modal.style.display = 'none';
    });
}

// Игра "Память"
function initMemoryGame() {
    const modal = document.getElementById('memory-game-modal');
    const gameBoard = document.getElementById('memory-game-board');
    const memoryAttempts = document.getElementById('memory-attempts');
    const memoryMatches = document.getElementById('memory-matches');
    const memoryEarned = document.getElementById('memory-earned');
    const memoryTimer = document.getElementById('memory-timer');
    const closeBtn = document.getElementById('close-memory-game');

    const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let timeLeft = 100;
    let timerInterval;

    function createBoard() {
        // Создаем пары символов
        let cardSymbols = [...symbols, ...symbols];

        // Перемешиваем
        cardSymbols = cardSymbols.sort(() => Math.random() - 0.5);

        // Создаем карточки
        gameBoard.innerHTML = '';
        cardSymbols.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card hidden';
            card.dataset.symbol = symbol;
            card.dataset.index = index;
            card.textContent = symbol;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });

        cards = Array.from(document.querySelectorAll('.memory-card'));
    }

    function flipCard() {
        // Не переворачиваем уже совпавшие или открытые карточки
        if (flippedCards.length < 2 && !this.classList.contains('matched') && !flippedCards.includes(this)) {
            this.classList.remove('hidden');
            flippedCards.push(this);

            // Если открыли 2 карточки, проверяем на совпадение
            if (flippedCards.length === 2) {
                attempts++;
                memoryAttempts.textContent = attempts;

                if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                    // Совпадение
                    flippedCards.forEach(card => {
                        card.classList.add('matched');
                    });

                    matchedPairs++;
                    memoryMatches.textContent = matchedPairs;

                    // Проверяем, все ли пары найдены
                    if (matchedPairs === symbols.length) {
                        endGame();
                    }
                } else {
                    // Не совпали - переворачиваем обратно через секунду
                    setTimeout(() => {
                        flippedCards.forEach(card => {
                            card.classList.add('hidden');
                        });
                    }, 1000);
                }

                flippedCards = [];
            }
        }
    }

    function resetGame() {
        createBoard();
        attempts = 0;
        matchedPairs = 0;
        flippedCards = [];
        timeLeft = 100;
        memoryTimer.style.width = '100%';
        memoryAttempts.textContent = '0';
        memoryMatches.textContent = '0';
        memoryEarned.textContent = '0';
    }

    function startGame() {
        resetGame();
        modal.style.display = 'flex';

        // Показываем карточки на 3 секунды
        cards.forEach(card => card.classList.remove('hidden'));
        setTimeout(() => {
            cards.forEach(card => card.classList.add('hidden'));

            // Запускаем таймер
            timerInterval = setInterval(() => {
                timeLeft -= 0.2;
                memoryTimer.style.width = `${timeLeft}%`;

                if (timeLeft <= 0) {
                    endGame();
                }
            }, 100);
        }, 3000);
    }

    function endGame() {
        clearInterval(timerInterval);

        // Расчет заработка
        const baseEarned = 50;
        const attemptsPenalty = Math.min(attempts, 30); // Максимальный штраф - 30 попыток
        const timeBonus = Math.floor(timeLeft / 10); // Бонус за оставшееся время
        const totalEarned = baseEarned - attemptsPenalty + timeBonus;

        memoryEarned.textContent = totalEarned > 0 ? totalEarned : 10; // Минимум 10 рублей
        addMoney(totalEarned > 0 ? totalEarned : 10);
    }

    document.querySelector('.start-memory-game').addEventListener('click', startGame);
    closeBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        modal.style.display = 'none';
    });
}

function initClickGame() {
    const modal = document.getElementById('click-game-modal');
    const gameBoard = document.getElementById('click-game-board');
    const timer = document.getElementById('click-timer');
    const clickCount = document.getElementById('click-count');
    const clickEarned = document.getElementById('click-earned');
    const closeBtn = document.getElementById('close-click-game');

    let clicks = 0;
    let timeLeft = 100;
    let gameInterval;
    let squares = [];

    function createSquares() {
        gameBoard.innerHTML = '';
        squares = [];

        // Создаем 9 квадратов
        for (let i = 0; i < 9; i++) {
            const square = document.createElement('div');
            square.className = 'click-item';
            square.dataset.index = i;
            square.addEventListener('click', handleSquareClick);
            gameBoard.appendChild(square);
            squares.push(square);
        }
    }

    function handleSquareClick() {
        // Проверяем, не был ли квадрат уже кликнут
        if (!this.classList.contains('clicked')) {
            this.classList.add('clicked');
            clicks++;
            clickCount.textContent = clicks;

            // Начисляем деньги за каждые 9 кликов (полный набор)
            if (clicks % 9 === 0) {
                const earned = Math.floor(clicks / 9) * 50; // 50 рублей за полный набор
                clickEarned.textContent = earned;

                // Проверяем, все ли квадраты кликнуты
                const clickedSquares = document.querySelectorAll('.click-item.clicked').length;
                if (clickedSquares === 9) {
                    // Все квадраты кликнуты - обновляем поле
                    setTimeout(() => {
                        createSquares();
                    }, 300);
                }
            }
        }
    }

    function resetGame() {
        clicks = 0;
        timeLeft = 100;
        clickCount.textContent = '0';
        clickEarned.textContent = '0';
        timer.style.width = '100%';
        createSquares();
    }

    function startGame() {
        resetGame();
        modal.style.display = 'flex';

        gameInterval = setInterval(() => {
            timeLeft -= 1;
            timer.style.width = `${timeLeft}%`;

            if (timeLeft <= 0) {
                endGame();
            }
        }, 100);
    }

    function endGame() {
        clearInterval(gameInterval);
        const earned = Math.floor(clicks / 9) * 50;
        addMoney(earned);
        setTimeout(() => {
            alert(`Игра окончена! Вы заработали ${earned} ₽!`);
            modal.style.display = 'none';
        }, 500);
    }

    // Обработчики событий
    document.querySelector('.start-click-game').addEventListener('click', startGame);
    closeBtn.addEventListener('click', () => {
        clearInterval(gameInterval);
        modal.style.display = 'none';
    });
}

// Объявляем глобальные переменные для очереди в самом начале


// Затем объявляем функции работы с очередью
async function processUpdateQueue() {
    if (isProcessingQueue || updateQueue.length === 0) return;

    isProcessingQueue = true;

    try {
        const updateTask = updateQueue.shift();
        await updateTask();

        if (updateQueue.length > 0) {
            setTimeout(processUpdateQueue, UPDATE_DELAY);
        }
    } finally {
        isProcessingQueue = false;
    }
}

function queueUpdate(updateFn) {
    try{
        updateQueue.push(updateFn);
        if (!isProcessingQueue) {
            setTimeout(processUpdateQueue, UPDATE_DELAY);
        }
    }catch (e) {
        let updateQueue = []
        updateQueue.push(updateFn);
        if (!isProcessingQueue) {
            setTimeout(processUpdateQueue, UPDATE_DELAY);
        }
    }
}

// Остальной код остается без изменений
function loadStats() {
    const defaultStats = {
        money: 0,
        week: 1,
        day: 1,
        hour: 0,
        minute: 0,
        level: 1,
        exp: 0,
        reputation: 0,
        income: 0,
        businesses: [],
        contracts: [],
        books: [],
        sales: [],
        fans: 0
    };

    try {
        const savedStats = localStorage.getItem('characterStats');
        const parsed = savedStats ? JSON.parse(savedStats) : {};
        const merged = {...defaultStats, ...parsed};

        if (typeof merged.money !== 'number' || isNaN(merged.money) || merged.money < 0) {
            console.warn("Обнаружены некорректные данные денег. Сброс к умолчанию.");
            merged.money = defaultStats.money;
        }

        console.log("ЗАГРУЗКА ДАННЫХ:", merged);
        return merged;
    } catch (e) {
        console.error("Ошибка при загрузке данных:", e);
        return {...defaultStats};
    }
}

function saveStats(stats) {
    console.log("СОХРАНЕНИЕ ДАННЫХ:", stats);
    localStorage.setItem('characterStats', JSON.stringify(stats));
}

function updateUI(stats) {
    document.getElementById('current-money').textContent = `${stats.money.toLocaleString()} ₽`;
    document.getElementById('current-week').textContent = `Неделя ${stats.week}`;
    document.getElementById('game-time').textContent = `День ${stats.day}, ${String(stats.hour).padStart(2, '0')}:${String(stats.minute).padStart(2, '0')}`;
}

function addMoney(amount) {
    queueUpdate(async () => {
        const stats = loadStats();
        console.log("Деньги до добавления:", stats.money);
        stats.money += amount;
        saveStats(stats);
        console.log("Деньги после добавления:", stats.money);
        updateUI(stats);
    });
    return amount;
}

function initGameTime() {
    setInterval(() => {
        queueUpdate(async () => {
            const stats = loadStats();
            let {minute, hour, day, week, money, businesses} = stats;

            minute += 12;
            if (minute >= 60) {
                minute = 0;
                hour++;
            }
            if (hour >= 24) {
                hour = 0;
                day++;
            }
            if (day > 7) {
                day = 1;
                week++;
            }

            let newMoney = money;
            if (day === 1 && hour === 0 && minute === 0) {
                const weeklyIncome = businesses.reduce((sum, b) => sum + (b.income || 0), 0) * 7;
                newMoney += weeklyIncome;
            }

            const updatedStats = {
                ...stats,
                minute,
                hour,
                day,
                week,
                money: newMoney
            };

            saveStats(updatedStats);
            updateUI(updatedStats);
        });
    }, 1000);
}

function updateStats(newStats) {
    queueUpdate(async () => {
        const currentStats = loadStats();

        const updatedStats = {
            ...currentStats,
            ...newStats,
            money: typeof newStats.money === 'number' ?
                newStats.money : currentStats.money
        };

        if (isNaN(updatedStats.money) || updatedStats.money < 0) {
            updatedStats.money = currentStats.money;
        }

        saveStats(updatedStats);
        updateUI(updatedStats);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const stats = loadStats();
    updateUI(stats);

    initClickGame?.();
    initTypingGame?.();
    initMemoryGame?.();
    initSideJobs?.();
    initBusiness?.();
    initContracts?.();
    initGameTime();
});