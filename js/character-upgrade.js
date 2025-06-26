const upgradeCosts = {
    job: 1000,
    education: 1500, // за каждую ступень повышения
    transport: 0
};

const livingCosts = {
    'с родителями': 0,
    'общежитие': 500,
    'аренда комнаты': 700,
    'аренда квартиры': 1000,
    'ипотека': 1500,
    'собственная квартира': 2000,
    'загородный дом': 3500,
    'элитное жилье': 5000
};
const transportCosts = {
    'нет': 0,
    'велосипед': 200,
    'мопед': 400,
    'ролики': 100,
    'метро': 300,
    'подержанный автомобиль': 1500,
    'мотоцикл': 800,
    'такси': 500,
    'новый автомобиль': 3000,
    'премиум автомобиль': 7000,
    'водитель': 10000
};

const jobs = ['уборщик', 'разносчик газет', 'помощник в магазине', 'курьер', 'официант',
    'офисный работник', 'продавец', 'водитель', 'учитель', 'медсестра',
    'менеджер', 'бухгалтер', 'инженер', 'врач', 'директор'];

const educationOptions = ['нет', 'среднее', 'неполное среднее', 'колледж', 'неоконченное высшее',
    'бакалавр', 'магистр', 'кандидат наук', 'доктор наук'];

const livingOptions = ['с родителями', 'общежитие', 'аренда комнаты', 'аренда квартиры',
    'ипотека', 'собственная квартира', 'загородный дом', 'элитное жилье'];

const transportOptions = ['нет', 'велосипед', 'мопед', 'ролики', 'метро', 'подержанный автомобиль',
    'мотоцикл', 'такси', 'новый автомобиль', 'премиум автомобиль', 'водитель'];

function fillSelect(id, options, current, minIndex = 0) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    options.forEach((opt, index) => {
        // Для образования запрещаем выбирать ниже минимального индекса
        if (id === 'educationSelect' && index < minIndex) return;
        const o = document.createElement('option');
        o.value = opt;
        o.textContent = opt;
        if (opt === current) o.selected = true;
        select.appendChild(o);
    });
}

function fillCharacterData() {
    const char = JSON.parse(localStorage.getItem('characterData'));
    if (!char) return alert('Персонаж не найден');

    document.getElementById('characterImage').src = char.image;
    document.getElementById('characterName').textContent = char.name;
    document.getElementById('characterAge').textContent = char.age;
    document.getElementById('characterGender').textContent = char.gender === 'female' ?  'Ж' : 'M';

    fillSelect('jobSelect', jobs, char.job);
    // Образование только с текущего уровня и выше
    const currentEduIndex = educationOptions.indexOf(char.education);
    fillSelect('educationSelect', educationOptions, char.education, currentEduIndex);
    fillSelect('livingSelect', livingOptions, char.living);
    fillSelect('transportSelect', transportOptions, char.transport);

    setupCostCalculation(char);
}

function calculateTotalCost(char) {
    const newJob = document.getElementById('jobSelect').value;
    const newEdu = document.getElementById('educationSelect').value;
    const newLiv = document.getElementById('livingSelect').value;
    const newTrans = document.getElementById('transportSelect').value;

    let totalCost = 0;

    // Профессия (фиксированная цена при изменении)
    if (newJob !== char.job) totalCost += upgradeCosts.job;

    // Образование (только повышение — платим)
    const currentEduIndex = educationOptions.indexOf(char.education);
    const newEduIndex = educationOptions.indexOf(newEdu);
    const eduSteps = newEduIndex - currentEduIndex; // гарантированно >= 0
    totalCost += eduSteps * upgradeCosts.education;

    // Жилье (считаем разницу цен)
    const oldLivingCost = livingCosts[char.living] || 0;
    const newLivingCost = livingCosts[newLiv] || 0;
    totalCost += (newLivingCost - oldLivingCost);

    // Транспорт (считаем разницу фиксированной цены)

    const oldTransportCost = transportCosts[char.transport] || 0;
    const newTransportCost = transportCosts[newTrans] || 0;
    totalCost += (newTransportCost - oldTransportCost);

    return { totalCost, moneyReturned: 0 }; // moneyReturned уже не нужен
}


function setupCostCalculation(char) {
    const selects = ['jobSelect', 'educationSelect', 'livingSelect', 'transportSelect'];

    function updateCost() {
        const {totalCost, moneyReturned} = calculateTotalCost(char);
        const netCost = totalCost - moneyReturned;
        document.getElementById('upgradeCost').textContent =
            netCost >= 0
                ? `Стоимость улучшений: ${netCost} монет`
                : `Вы получите возврат: ${-netCost} монет`;
    }

    selects.forEach(id => {
        document.getElementById(id).addEventListener('change', updateCost);
    });

    updateCost(); // начальное значени
}

document.getElementById('saveUpgrades').addEventListener('click', () => {
    const char = JSON.parse(localStorage.getItem('characterData'));
    let stats = JSON.parse(localStorage.getItem('characterStats')) || {};
    let money = stats.money || 0;

    const newJob = document.getElementById('jobSelect').value;
    const newEdu = document.getElementById('educationSelect').value;
    const newLiv = document.getElementById('livingSelect').value;
    const newTrans = document.getElementById('transportSelect').value;

    const {totalCost, moneyReturned} = calculateTotalCost(char);
    const netCost = totalCost - moneyReturned;

    if (netCost > money) {
        alert(`Недостаточно средств. Нужно: ${netCost} монет, у вас: ${money}`);
        return;
    }

    if (educationOptions.indexOf(newEdu) < educationOptions.indexOf(char.education)) {
        alert('Понижение образования невозможно');
        return;
    }

    char.job = newJob;
    char.education = newEdu;
    char.living = newLiv;
    char.transport = newTrans;

    stats.money = money - netCost;

    localStorage.setItem('characterData', JSON.stringify(char));
    localStorage.setItem('characterStats', JSON.stringify(stats));
    document.getElementById('current-money').textContent = `${stats.money.toLocaleString()} ₽`;
    alert(`Изменения сохранены. ${netCost >= 0 ? `Потрачено: ${netCost} монет.` : `Возвращено: ${-netCost} монет.`}`);
    fillCharacterData();
});
function initGameTime() {
    let stats = loadStats();

    setInterval(() => {
        stats.minute += 12;

        if (stats.minute >= 60) {
            stats.minute = 0;
            stats.hour++;
        }

        if (stats.hour >= 24) {
            stats.hour = 0;
            stats.day++;
        }

        if (stats.day > 7) {
            stats.day = 1;
            stats.week++;
            saveStats(stats);
        }

        updateBottom(stats);
    }, 1000);
}
function updateBottom(stats){
    document.getElementById('current-week').textContent = `Неделя ${stats.week}`;
    document.getElementById('game-time').textContent = `День ${stats.day}, ${String(stats.hour).padStart(2, '0')}:${String(stats.minute).padStart(2, '0')}`;
}
function loadStats() {
    const defaultStats = {
        level: 1,
        fans: 0,
        contracts: 0,
        sales: 0,
        books: 0,
        income: 0,
        reputation: 0,
        exp: 0,
        money: 0,
        week: 1,
        day: 1,
        hour: 0,
        minute: 0
    };

    const savedStats = localStorage.getItem('characterStats');
    return savedStats ? JSON.parse(savedStats) : defaultStats;
}
initGameTime();
fillCharacterData();
let money = JSON.parse(localStorage.getItem('characterStats')).money;
document.getElementById('current-money').textContent = `${money} ₽`;
