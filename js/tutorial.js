class Tutorial {
    constructor() {
        // Если язык сохранён — использовать, иначе ru
        this.currentLanguage = localStorage.getItem('language') || 'ru';
        this.currentSlide = 0;
        this.slides = [];
        this.container = document.querySelector('.tutorial-container');

        this.initLanguageButtons();
        this.loadAndRenderTutorial();

        this.updateLanguageButtons();
    }

    async loadAndRenderTutorial() {
        try {
            const res = await fetch(`locales/${this.currentLanguage}.json`);
            const data = await res.json();
            this.tutorials = data.tutorials;
            this.buttonLabels = data.tutorial;

            this.renderSlides();
            this.showSlide(0);
        } catch (err) {
            console.error('Ошибка загрузки JSON:', err);
        }
    }

    renderSlides() {
        this.container.innerHTML = '';
        this.slides = [];

        this.tutorials.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.classList.add('tutorial-slide');
            slide.style.display = 'none';

            let buttonsHTML = '';

            if (index > 0) {
                buttonsHTML += `<button class="back-btn">${this.buttonLabels.back}</button>`;
            }

            if (index < this.tutorials.length - 1) {
                buttonsHTML += `<button class="next-btn">${this.buttonLabels.next}</button>`;
            } else {
                buttonsHTML += `<button class="start-btn">${this.buttonLabels.start}</button>`;
            }

            slide.innerHTML = `
                <h2>${item.title}</h2>
                <div class="tutorial-content">
                    ${item.text.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
                <div class="tutorial-buttons">${buttonsHTML}</div>
            `;

            this.container.appendChild(slide);
            this.slides.push(slide);
        });

        // Назначение кнопок
        this.container.querySelectorAll('.next-btn').forEach(btn =>
            btn.addEventListener('click', () => this.nextSlide())
        );

        this.container.querySelectorAll('.back-btn').forEach(btn =>
            btn.addEventListener('click', () => this.prevSlide())
        );

        this.container.querySelectorAll('.start-btn').forEach(btn =>
            btn.addEventListener('click', () => this.startGame())
        );
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        this.currentSlide = index;
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    startGame() {
        window.location.href = 'create-character.html';
        // Здесь может быть переход в игру
    }

    initLanguageButtons() {
        document.getElementById('lang-ru').addEventListener('click', () => this.switchLanguage('ru'));
        document.getElementById('lang-en').addEventListener('click', () => this.switchLanguage('en'));
    }

    switchLanguage(lang) {
        if (this.currentLanguage !== lang) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.currentSlide = 0;
            this.loadAndRenderTutorial();
            this.updateLanguageButtons();
        }
    }
    updateLanguageButtons() {
        document.querySelectorAll('.language-switcher button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`lang-${this.currentLanguage}`).classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Tutorial();
});
