document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const nameInput = document.getElementById('name-input');
    const ageInput = document.getElementById('age-input');
    const ageValue = document.getElementById('age-value');
    const charName = document.getElementById('char-name');
    const charAge = document.getElementById('char-age');
    const charJob = document.getElementById('char-job');
    const charEducation = document.getElementById('char-education');
    const charLiving = document.getElementById('char-living');
    const charTransport = document.getElementById('char-transport');
    const characterImage = document.getElementById('character-image');
    const placeholderText = document.querySelector('.placeholder-text');
    const loadingSpinner = document.getElementById('loading-spinner');

    const randomizeBtn = document.getElementById('randomize-btn');
    const generateBtn = document.getElementById('generate-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    document.getElementById('character-info').style.display = 'none';
    // Профессии в зависимости от возраста
    const jobsByAge = {
        young: ['уборщик', 'разносчик газет', 'помощник в магазине', 'курьер', 'официант'],
        adult: ['офисный работник', 'продавец', 'водитель', 'учитель', 'медсестра'],
        senior: ['менеджер', 'бухгалтер', 'инженер', 'врач', 'директор']
    };

    // Образование
    const educationOptions = {
        young: ['нет', 'среднее', 'неполное среднее', 'колледж'],
        adult: ['среднее', 'колледж', 'неоконченное высшее', 'бакалавр'],
        senior: ['бакалавр', 'магистр', 'кандидат наук', 'доктор наук']
    };

    // Жилье
    const livingOptions = {
        young: ['с родителями', 'общежитие', 'аренда комнаты'],
        adult: ['аренда квартиры', 'ипотека', 'собственная квартира'],
        senior: ['собственная квартира', 'загородный дом', 'элитное жилье']
    };

    // Транспорт
    const transportOptions = {
        young: ['нет', 'велосипед', 'мопед', 'ролики'],
        adult: ['метро', 'подержанный автомобиль', 'мотоцикл', 'такси'],
        senior: ['новый автомобиль', 'премиум автомобиль', 'водитель']
    };

    // Обновление возраста
    ageInput.addEventListener('input', function() {
        const age = this.value;
        ageValue.textContent = age;
        charAge.textContent = age;
        updateCharacteristics(age);
    });

    // Обновление имени
    nameInput.addEventListener('input', function() {
        charName.textContent = this.value || 'Не указано';
    });

    // Случайный персонаж
    randomizeBtn.addEventListener('click', function() {
        // Случайное имя
        const names = {
            male: ['Даниил', 'Алексей', 'Иван', 'Михаил', 'Сергей', 'Андрей'],
            female: ['Анна', 'Мария', 'Екатерина', 'Ольга', 'Наталья', 'Елена']
        };
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        document.querySelector(`input[name="gender"][value="${gender}"]`).checked = true;

        const randomName = names[gender][Math.floor(Math.random() * names[gender].length)];
        nameInput.value = randomName;
        charName.textContent = randomName;

        // Случайный возраст
        const randomAge = Math.floor(Math.random() * (70 - 16 + 1)) + 16;
        ageInput.value = randomAge;
        ageValue.textContent = randomAge;
        charAge.textContent = randomAge;
        updateCharacteristics(randomAge);

        // Случайные параметры внешности
        document.getElementById('ethnicity').selectedIndex = Math.floor(Math.random() * 5);
        document.getElementById('hair-style').selectedIndex = Math.floor(Math.random() * 6);
        document.getElementById('hair-color').selectedIndex = Math.floor(Math.random() * 7);
        document.getElementById('glasses').selectedIndex = Math.floor(Math.random() * 5);
        loadImageFromSources();
        loadingSpinner.style.display = 'none';

        document.getElementById('character-info').style.display = 'block';
    });

    const IMAGE_SOURCES = [
        {
            name: 'DiceBear Avatars (Adventurer)',
            url: () => {
                const skinColor = document.getElementById('ethnicity').value;
                const gender = document.querySelector('input[name="gender"]:checked').value;
                const selectedHairStyle = document.getElementById('hair-style').value;
                let hairStyle = '';
                switch(selectedHairStyle) {
                    case 'short':
                        const shortRandom = Math.floor(Math.random() * 18) + 1;
                        hairStyle = `short${shortRandom.toString().padStart(2, '0')}`;
                        break;
                    case 'medium':
                        if(gender === 'male') {
                            const shortRandom = Math.floor(Math.random() * 18) + 1;
                            hairStyle = `short${shortRandom.toString().padStart(2, '0')}`;
                            break;
                        }
                    case 'long':
                        if(gender === 'male'){
                            const shortRandom = Math.floor(Math.random() * 18) + 1;
                            hairStyle = `short${shortRandom.toString().padStart(2, '0')}`;
                        } else {
                            const longRandom = Math.floor(Math.random() * 26) + 1;
                            hairStyle = `long${longRandom.toString().padStart(2, '0')}`;
                        }
                        break;
                    case 'none':
                        hairStyle = 'short19';
                        break;
                    case 'curly':
                        if(gender === 'male'){
                            const shortRandom = Math.floor(Math.random() * 18) + 1;
                            hairStyle = `short${shortRandom.toString().padStart(2, '0')}`;
                        } else {
                            const curlyOptions = ['long06', 'long17', 'long18', 'short03', 'short07'];
                            hairStyle = curlyOptions[Math.floor(Math.random() * curlyOptions.length)];
                        }
                        break;
                    default:
                        hairStyle = 'short01';
                }

                const hairColor = document.getElementById('hair-color').value.replace('#', '').toLowerCase();
                const seed = `${nameInput.value || 'unknown'}-${Date.now()}`;

                const params = new URLSearchParams();
                params.set('seed', seed);
                params.set('gender', gender);
                params.set('skinColor', skinColor);
                params.set('hair', hairStyle);
                params.set('hairColor', hairColor);
                if(document.getElementById('glasses').value !== 'none'){
                    params.set('glasses', document.getElementById('glasses').value);
                    params.set('glassesProbability', '100');
                }
                else{
                    params.set('glassesProbability', '0');
                }
                params.set('backgroundColor', 'ffffff');

                const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?${params.toString()}`;
                console.log("Generated URL:", avatarUrl);
                return avatarUrl;
            }
        },
        {
            name: 'DiceBear Avatars (FunEmoji)',
            url: () => {
                const seed = `${nameInput.value}-${hairColorInput.value}`;
                return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${encodeURIComponent(seed)}`;
            }
        }
    ];
    const hairColorInput = document.getElementById('hair-color');

    async function loadImageFromSources() {
        loadingSpinner.style.display = 'block';
        characterImage.style.display = 'none';
        placeholderText.style.display = 'none';

        // Очистить старое изображение
        characterImage.src = '';

        for (const source of IMAGE_SOURCES) {
            try {
                const url = typeof source.url === 'function' ? source.url() : source.url;

                await loadImage(url);
                console.log(`Успешно загружено: ${source.name}`);
                return;
            } catch (error) {
                console.warn(`Ошибка в ${source.name}:`, error);
            }
        }

        alert("Не удалось загрузить изображение ни из одного источника.");
        placeholderText.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }

    generateBtn.addEventListener('click', async function () {
        await loadImageFromSources();
        loadingSpinner.style.display = 'none';

        document.getElementById('character-info').style.display = 'block';
    });


    // Начать игру
    startGameBtn.addEventListener('click', function() {
        if (!characterImage.src || characterImage.src.includes('placeholder')) {
            alert('Пожалуйста, сначала создайте персонажа!');
            return;
        }

        const characterData = {
            name: nameInput.value || 'Безымянный',
            age: ageInput.value,
            gender: document.querySelector('input[name="gender"]:checked').value,
            job: charJob.textContent,
            education: charEducation.textContent,
            living: charLiving.textContent,
            transport: charTransport.textContent,
            image: characterImage.src
        };

        // Сохраняем в localStorage
        localStorage.setItem('characterData', JSON.stringify(characterData));

        window.location.href = 'character.html';

    });
    // Функция загрузки изображения
    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                characterImage.src = url;
                characterImage.style.display = 'block';
                placeholderText.style.display = 'none';
                resolve();
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    // Обновление характеристик
    function updateCharacteristics(age) {
        const ageGroup = getAgeGroup(age);

        // Профессия
        const randomJob = jobsByAge[ageGroup][Math.floor(Math.random() * jobsByAge[ageGroup].length)];
        charJob.textContent = randomJob;

        // Образование
        const randomEducation = educationOptions[ageGroup][Math.floor(Math.random() * educationOptions[ageGroup].length)];
        charEducation.textContent = randomEducation;

        // Жилье
        const randomLiving = livingOptions[ageGroup][Math.floor(Math.random() * livingOptions[ageGroup].length)];
        charLiving.textContent = randomLiving;

        // Транспорт
        const randomTransport = transportOptions[ageGroup][Math.floor(Math.random() * transportOptions[ageGroup].length)];
        charTransport.textContent = randomTransport;
    }

    // Определение возрастной группы
    function getAgeGroup(age) {
        age = parseInt(age);
        if (age < 20) return 'young';
        if (age < 40) return 'adult';
        return 'senior';
    }
    // Инициализация
    updateCharacteristics(ageInput.value);
});