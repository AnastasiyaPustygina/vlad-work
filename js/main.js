document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const continueBtn = document.getElementById('continue-btn');
    const newGameBtn = document.getElementById('new-game-btn');
    const languageBtn = document.getElementById('language-btn');
    const aboutBtn = document.getElementById('about-btn');
    const soundBtn = document.getElementById('sound-btn');
    const modal = document.getElementById('about-modal');
    const closeBtn = document.querySelector('.close');
    const bgVideo = document.getElementById('bg-video');
    const aboutContent = document.getElementById('about-content');

    let currentLanguage = 'ru';
    if(localStorage.getItem('language') === 'en') {
        currentLanguage = 'en'
    }
    continueBtn.addEventListener('click', () => {
        if(localStorage.getItem('characterData')) {
            window.location.href = ''
        }
    })
    updateTexts(currentLanguage)
    // Загрузка локализации
    async function loadLanguage(lang) {
        const response = await fetch(`locales/${lang}.json`);
        return await response.json();
    }

    // Обновление текстов на странице
    async function updateTexts(lang) {
        const texts = await loadLanguage(lang);

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (texts[key]) {
                if (key === 'title') {
                    element.innerHTML = texts[key].replace('2', '<span>2</span>');
                } else {
                    element.textContent = texts[key];
                }
            }
        });

        // Обновление контента в модальном окне
        if (texts.aboutText) {
            aboutContent.innerHTML = `
                <p style="margin-bottom: 20px">${texts.aboutText.description}</p>
                <p><strong>${texts.aboutText.developers}</strong></p>
                <ul>
                    <li>${texts.aboutText.programmer}</li>
                </ul>
                <p><strong>${texts.aboutText.engine}</strong></p>
                <p><strong>${texts.aboutText.copyright}</strong></p>
            `;
        }
    }

    // Инициализация
    updateTexts(currentLanguage);

    // Обработчики
    languageBtn.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
        updateTexts(currentLanguage);
        localStorage.setItem('language', currentLanguage);
    });

    aboutBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    soundBtn.addEventListener('click', () => {
        const isMuted = bgVideo.muted;
        bgVideo.muted = !isMuted;
        soundBtn.textContent = isMuted ? '🔊' : '🔇';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
function goToNewGame() {
    localStorage.clear();
    window.location.href = 'tutorial.html';
}