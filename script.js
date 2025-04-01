const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.try-again-btn');
const homepageBtn = document.querySelector('.homepage-btn');
const xCloseBtn = document.querySelector('.x-close-btn');
let isQuizStarted = false;
const hintBtn = document.getElementById('hint-btn');
let currentQuestionIndex = 0;
let isQuizCompletedres = false
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImage = document.getElementById('modalImage');
const quizheader = document.getElementById('quiz-header');
const quiztext1 = document.getElementById('quiz-header1');
const quiztext = document.getElementById('question-text');
const quizfooter = document.getElementById('quiz-footer');
const body = document.body;
let isQuizCompleted = false; // Флаг для отслеживания завершения теста
// Получаем элементы
const explanationBtn = document.getElementById('explanationBtn');
const explanationModal = document.getElementById('explanationModal');
const explanationImage = document.getElementById('explanationImage');
const explanationText = document.getElementById('explanationText');
const closeExplanationBtn = document.getElementById('closeExplanationBtn');
let userAnswers = []; // Массив для хранения выбранных ответов
let hintUsedArray = [];
let userScore = 0; // Глобальная переменная для хранения счета
let savedUserScore = 0; // Переменная для сохранения счета при выходе на главную страницу
// Обработчик для кнопки "Пояснение"
let isAnswerChecked = false; // Флаг для отслеживания проверки ответа
const buttonsContainer = document.querySelector('.buttons-container');
const contactsBtn = document.querySelector('.contacts-btn');
const contactsInfo = document.querySelector('.contacts-info');
const contactsInfo1 = document.querySelector('.contacts-info1');
const unlockSound = new Audio('sounds/unlock.mp3'); 
// script.js (добавить в начало)
// В начале файла после объявления переменных
document.addEventListener('DOMContentLoaded', () => {
    const savedState = localStorage.getItem('quizState');
    if (savedState) {
        const state = JSON.parse(savedState);
        userScore = state.userScore;
        questionCount = state.questionCount;
        userAnswers = state.userAnswers;
        hintUsedArray = state.hintUsedArray;
        isQuizCompleted = state.isQuizCompleted;
        
        // Обновляем интерфейс
        updateHeaderScore();
        questionCounter(questionCount + 1);
        
        // Если квест был завершен, показываем результаты
        if (isQuizCompleted) {
            displayResultBox();
            quizSection.classList.add('active');
        }
        
        localStorage.removeItem('quizState');
    }
    updateGalleryButtonState();
    updateGalleryDescription();
});
explanationBtn.addEventListener('click', () => {
    explanationModal.style.display = 'flex';  
    explanationModal.classList.add('active');
    const currentQuestion = questions[questionCount];
    const xCloseBtn = document.querySelector('.x-close-btn');
    if (currentQuestion.explanation) {
        // Очищаем контейнер перед добавлением новых изображений
        const explanationImageContainer = document.getElementById('explanationImageContainer');
        explanationImageContainer.innerHTML = '';

        // Если есть изображения, добавляем их в контейнер
        if (currentQuestion.images && Array.isArray(currentQuestion.images)) {
            currentQuestion.images.forEach(imageSrc => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.style.maxWidth = '90%';
                img.style.maxHeight = '90%';
                img.style.margin = '10px';
                img.style.borderRadius = '10px';
                explanationImageContainer.appendChild(img);
                xCloseBtn.style.display = 'none'; // Добавляем изображение в контейнер
            });
        } else if (currentQuestion.images) {
            // Если изображение одно, просто добавляем его
            const img = document.createElement('img');
            img.src = currentQuestion.images;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.margin = '10px';
            img.style.borderRadius = '10px';
            explanationImageContainer.appendChild(img);
            xCloseBtn.style.display = 'none'; // Добавляем изображение в контейнер
        }
        if (currentQuestion.explanationImage) {
            const img = document.createElement('img');
            img.src = currentQuestion.explanationImage;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '80%';
            img.style.margin = '10px';
            img.style.borderRadius = '10px';
            explanationImageContainer.innerHTML = ''
            explanationImageContainer.appendChild(img);
        }
        xCloseBtn.style.display = 'none';
        explanationText.textContent = currentQuestion.explanation;
        

    }
});

// Обработчик для кнопки "Вернуться"
closeExplanationBtn.addEventListener('click', () => {
    explanationModal.classList.add('fade-out');
    explanationModal.classList.remove('active');
    
    setTimeout(() => {
        explanationModal.style.display = 'none';
        explanationModal.classList.remove('fade-out');
        // Сбрасываем стили после анимации
        explanationModal.style.opacity = '0';
        explanationModal.style.transform = 'translateY(50px) scale(0.95)';
    }, 300); // Время должно совпадать с длительностью анимации
    
    // Возвращаем исходные параметры через 500мс
    setTimeout(() => {
        explanationModal.style.opacity = '';
        explanationModal.style.transform = '';
    }, 500);
});

// Закрытие экрана с пояснением при клике вне контента
// Закрытие модального окна с изображениями при клике вне его контента
window.addEventListener('click', (event) => {
    const questionText = document.querySelector('.question-text');
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');
    const explanationBtn = document.getElementById('explanationBtn');
    const openImageBtn = document.getElementById('openImageBtn');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    if (event.target === imageModal) {
        imageModal.style.display = 'none';
        // Убираем размытие фона
        quizheader.classList.remove('blur-background');
        quiztext.classList.remove('blur-background');
        quizfooter.classList.remove('blur-background');
        optionList.classList.remove('blur-background');
        quiztext1.classList.remove('blur-background');
        xCloseBtn.classList.remove('blur-background');
        hintBtn.classList.remove('blur-background');
        hintText.classList.remove('blur-background');
        buttonsContainer.classList.remove('blur-background');
    }
});
// Обработчик для кнопки закрытия (крестик)

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        // Добавляем анимацию исчезновения текущего вопроса
        quizBox.classList.add('fade-out');

        // Ждем завершения анимации исчезновения
        setTimeout(() => {
            questionCount++; // Увеличиваем счетчик вопросов
            currentQuestionIndex = questionCount; // Обновляем текущий вопрос
            displayQuestions(questionCount); // Показываем следующий вопрос
            questionCounter(questionCount + 1); // Обновляем счетчик вопросов
            nextBtn.classList.remove('active'); // Скрываем кнопку "Следующий"
            hintUsed = false; // Сбрасываем флаг использования подсказки
            isAnswerChecked = false; // Сбрасываем флаг проверки ответа

            // Убираем класс fade-out и добавляем анимацию появления
            quizBox.classList.remove('fade-out');
            quizBox.classList.add('fade-in');
        }, 500); // Время анимации исчезновения (0.5 секунды)
    } else {
        displayResultBox(); // Показываем результаты, если вопросы закончились
    }
};

// Удаляем класс fade-in после завершения анимации
quizBox.addEventListener('animationend', () => {
    quizBox.classList.remove('fade-in');
});
exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
}


continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    isQuizStarted = true; // Устанавливаем флаг, что квиз начат
    displayQuestions(currentQuestionIndex); // Показываем текущий вопрос
    questionCounter(currentQuestionIndex + 1); // Обновляем счетчик вопросов
    updateHeaderScore(); // Обновляем счет
};

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    resultBox.classList.remove('active');

    nextBtn.classList.remove('active');

    questionCount = 0; // Сбрасываем счетчик вопросов
    currentQuestionIndex = 0; // Сбрасываем индекс текущего вопроса
    questionNumb = 1; // Сбрасываем номер вопроса
    userScore = 0; // Сбрасываем счет
    isQuizStarted = false; // Сбрасываем флаг начала квиза
    isQuizCompleted = false; // Сбрасываем флаг завершения квеста
    userAnswers = []; // Очищаем массив ответов
    hintUsedArray = []; // Очищаем массив использованных подсказок
    isAnswerChecked = false;
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('disabled', 'correct', 'incorrect'); // Убираем классы disabled, correct, incorrect
    });
    
    displayQuestions(questionCount); // Показываем первый вопрос
    questionCounter(questionNumb); // Обновляем счетчик вопросов
    updateHeaderScore(); // Обновляем счет

    // Меняем текст кнопки на "Начать квиз"
    const startBtn = document.getElementById('startBtn');
    startBtn.textContent = 'Начать квиз';
    isQuizCompleted = false;
    updateGalleryButtonState();
    updateGalleryDescription();
    localStorage.removeItem('galleryUnlocked');
};

homepageBtn.onclick = () => {
    savedUserScore = userScore; // Сохраняем текущий счет
    quizSection.classList.remove('active');
    resultBox.classList.remove('active');
    
};

xCloseBtn.onclick = () => {
    savedUserScore = userScore; // Сохраняем текущий счет
    savedQuestionCount = questionCount; // Сохраняем текущий счетчик
    quizSection.classList.remove('active'); // Скрываем секцию с квизом
    resultBox.classList.remove('active'); // Скрываем результаты (если они открыты)

    // Меняем текст кнопки на "Продолжить квиз"
    const startBtn = document.getElementById('startBtn');
    startBtn.textContent = 'Продолжить квиз';
};

let savedQuestionCount = 0;
let questionCount = 0;
let questionNumb = 1;
userScore = savedUserScore;

startBtn.onclick = () => {
    if (isQuizStarted) {
        console.log(isQuizCompleted)
        if (isQuizCompleted) {
            // Если квест завершен, показываем результаты
            displayResultBox();
            startBtn.textContent = 'Посмотреть результаты';
        } else {
            // Если квест не завершен, продолжаем с текущего вопроса
            quizSection.classList.add('active');
            quizBox.classList.add('active');
            questionCount = savedQuestionCount; // Восстанавливаем сохраненный счетчик
            userScore = savedUserScore; // Восстанавливаем сохраненный счет
            displayQuestions(questionCount); // Показываем текущий вопрос
            questionCounter(questionCount + 1); // Обновляем счетчик вопросов
            updateHeaderScore(); // Обновляем счет
            isAnswerChecked = false; // Сбрасываем флаг проверки ответа
        }
    } else {
        popupInfo.classList.add('active');
        main.classList.add('active');
    }
};
// getting questions and options from array

function displayQuestions(index) {
    const questionText = document.querySelector('.question-text');
    const hintText = document.getElementById('hint-text');
    const hintBtn = document.getElementById('hint-btn');
    const explanationBtn = document.getElementById('explanationBtn');
    const openImageBtn = document.getElementById('openImageBtn');
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');

    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    // Скрываем подсказку и сбрасываем состояние кнопки
    hintText.style.display = 'none';
    hintText.textContent = '';
    hintBtn.disabled = false;
    hintBtn.textContent = 'Подсказка';
    explanationBtn.disabled = true;

    // Если у вопроса есть подсказка, добавляем обработчик для кнопки
    if (questions[index].hint) {
        hintBtn.style.display = 'block';
        hintBtn.onclick = () => {
            hintText.textContent = `Подсказка: ${questions[index].hint}`;
            hintText.style.display = 'block';
            hintBtn.disabled = true;
            hintBtn.textContent = 'Подсказка использована';
            hintUsedArray[index] = true;
        };
    } else {
        hintBtn.style.display = 'none';
    }

    // Если подсказка была использована, отключаем кнопку подсказки
    if (hintUsedArray[index]) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'Подсказка использована';
    }

    // Обработка нескольких изображений
    // Обработка нескольких изображений
if (questions[index].images && Array.isArray(questions[index].images)) {
    openImageBtn.style.display = 'block';

    openImageBtn.addEventListener('click', () => {
        
        // Очищаем модальное окно перед добавлением новых изображений
        imageModal.innerHTML = '';
        imageModal.classList.add('show');
        // Добавляем кнопку закрытия
        const closeBtn = document.createElement('span');
        closeBtn.className = 'cloose-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            imageModal.classList.remove('show'); // Убираем класс анимации открытия
            imageModal.classList.add('fade-out'); // Добавляем анимацию закрытия
            
            setTimeout(() => {
                imageModal.style.display = 'none';
                imageModal.classList.remove('fade-out'); 
            }, 500); // Время должно совпадать с длительностью анимации
            
            imageModal.style.display = 'none';
            quizheader.classList.remove('blur-background');
            quiztext.classList.remove('blur-background');
            quizfooter.classList.remove('blur-background');
            optionList.classList.remove('blur-background');
            quiztext1.classList.remove('blur-background');
            xCloseBtn.classList.remove('blur-background');
            hintBtn.classList.remove('blur-background');
            hintText.classList.remove('blur-background');
            buttonsContainer.classList.remove('blur-background');
        };
        imageModal.appendChild(closeBtn);

        // Добавляем изображения в модальное окно
        questions[index].images.forEach(imageSrc => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.margin = '10px';
            img.style.borderRadius = '10px';
            imageModal.appendChild(img);
        });

        imageModal.style.display = 'flex';
        quizheader.classList.add('blur-background');
        quiztext.classList.add('blur-background');
        quizfooter.classList.add('blur-background');
        optionList.classList.add('blur-background');
        quiztext1.classList.add('blur-background');
        xCloseBtn.classList.add('blur-background');
        hintBtn.classList.add('blur-background');
        hintText.classList.add('blur-background');
        buttonsContainer.classList.add('blur-background');
    });
} else {
    openImageBtn.style.display = 'none';
}

    // Остальная часть функции остается без изменений
    optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
                <div class="option"><span>${questions[index].options[1]}</span></div>
                <div class="option"><span>${questions[index].options[2]}</span></div>
                <div class="option"><span>${questions[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'checkAnswer(this)');
    }

    if (userAnswers[index] !== undefined) {
        const selectedAnswer = userAnswers[index];
        const options = optionList.children;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === selectedAnswer) {
                if (selectedAnswer === questions[index].answer) {
                    options[i].classList.add('correct');
                } else {
                    options[i].classList.add('incorrect');
                }
            }
        }

        explanationBtn.disabled = false;
    }
}

// При выходе на главную страницу сохраняем текущее состояние


// При возвращении на страницу квиза восстанавливаем состояние
startBtn.onclick = () => {
    if (isQuizCompletedres){

    }
    if (isQuizStarted) {
        quizSection.classList.add('active');
        quizBox.classList.add('active');
        userScore = savedUserScore; // Восстанавливаем сохраненный счет
        displayQuestions(currentQuestionIndex); // Показываем текущий вопрос
        questionCounter(currentQuestionIndex + 1); // Обновляем счетчик вопросов
        updateHeaderScore(); // Обновляем счет
    } else {
        popupInfo.classList.add('active');
        main.classList.add('active');
    }
};

let hintUsed = false; // Флаг для отслеживания использования подсказки

function checkAnswer(answer) {
    if (isAnswerChecked) return; // Если ответ уже проверен, выходим из функции

    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer; // Используем questionCount
    let allOptions = optionList.children.length;

    // Сохраняем выбранный ответ
    userAnswers[questionCount] = userAnswer;

    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        if (hintUsedArray[questionCount]) {
            userScore += 0.5; // Даем 0.5 балла, если подсказка была использована
        } else {
            userScore += 1; // Даем 1 балл, если подсказка не использовалась
        }
        updateHeaderScore();
    } else {
        answer.classList.add('incorrect');

        // Если выбран неправильный ответ, показываем правильный
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].classList.add('correct'); // Добавляем класс correct
            }
        }
    }

    // Отключаем все варианты ответов после выбора
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    nextBtn.classList.add('active');
    hintUsed = false; // Сбрасываем флаг использования подсказки

    // Деактивируем кнопку "Показать подсказку"
    const hintBtn = document.getElementById('hint-btn');
    hintBtn.disabled = true; // Отключаем кнопку

    // Если подсказка была использована, не меняем текст кнопки
    if (!hintUsedArray[questionCount]) {
        hintBtn.textContent = 'Подсказка недоступна'; // Меняем текст кнопки только если подсказка не использовалась
    }

    // Активируем кнопку "Пояснение"
    const explanationBtn = document.getElementById('explanationBtn');
    explanationBtn.disabled = false; // Активируем кнопку "Пояснение"

    isAnswerChecked = true; // Устанавливаем флаг, что ответ был проверен
}
function questionCounter(index) {
    const questionsTotal = document.querySelector('.questions-total');
    questionsTotal.textContent = `${index} из ${questions.length} вопросов`;
}

function updateHeaderScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Счет: ${userScore} / ${questions.length}`;
}

function displayResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    let scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Вы набрали ${userScore} из ${questions.length}`;

    let circularProgress = document.querySelector('.circular-progress');
    let progressValue = document.querySelector('.progress-value');

    let progressStartValue = -1;
    let progressEndValue = (userScore / questions.length) * 100;
    let speed = 20;

    let progress = setInterval(() => {
        progressStartValue++;

        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#e05330 ${progressStartValue * 3.6}deg, rgba(255, 255, 255, .1) 0deg)`;

        if (progressStartValue >= progressEndValue) { // Изменено условие
            clearInterval(progress);
        }
    }, speed);

    isQuizCompleted = true;
    isQuizCompletedres = true
    if (!localStorage.getItem('galleryUnlocked')) {
        showGalleryUnlockToast();
        localStorage.setItem('galleryUnlocked', 'true');
    }
    updateGalleryButtonState();
    updateGalleryDescription(); // Добавить
    if (document.querySelector('.gallery-modal.active')) {
        initGallery();}
}
// Получаем кнопку "Сохранить результат"
const saveResultBtn = document.querySelector('.save-result-btn');

// Функция для сохранения результата в виде изображения
// script.js
function saveResultAsImage() {
    const resultBox = document.querySelector('.result-box');
    const originalStyles = {
        display: resultBox.style.display,
        opacity: resultBox.style.opacity,
        circularProgress: document.querySelector('.circular-progress').style.opacity,
        progressValue: document.querySelector('.progress-value').style.opacity
    };

    // Показываем и делаем видимыми нужные элементы
    resultBox.style.display = 'block';
    resultBox.style.opacity = '1';
    document.querySelector('.circular-progress').style.opacity = '1';
    document.querySelector('.progress-value').style.opacity = '1';

    // Ждем завершения всех анимаций
    setTimeout(() => {
        html2canvas(resultBox, {
            scale: 2,
            logging: true,
            useCORS: true,
            backgroundColor: '#5A3A6C',
            onclone: (clonedDoc) => {
                // Гарантируем видимость элементов в клоне
                clonedDoc.querySelector('.circular-progress').style.opacity = '1';
                clonedDoc.querySelector('.progress-value').style.opacity = '1';
                clonedDoc.querySelectorAll('.buttons, .contacts-info').forEach(el => {
                    el.style.display = 'none';
                });
            }
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'quiz_progress.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Восстанавливаем оригинальные стили
            resultBox.style.display = originalStyles.display;
            resultBox.style.opacity = originalStyles.opacity;
            document.querySelector('.circular-progress').style.opacity = originalStyles.circularProgress;
            document.querySelector('.progress-value').style.opacity = originalStyles.progressValue;
        }).catch(e => console.error('Ошибка:', e));
    }, 500); // Даем время на завершение анимаций
}
// Функция для сохранения результата в виде текстового файла
// Обработчик для кнопки "Поделиться"
document.getElementById('shareResultBtn').addEventListener('click', () => {
    // Показываем модальное окно с выбором платформ
    document.getElementById('shareOptionsModal').style.display = 'flex';
});

// Обработчик для кнопки "Сохранить результат"

// Получаем элементы модального окна
const saveResultModal = document.getElementById('saveResultModal');
const saveAsImageBtn = document.getElementById('saveAsImageBtn');
const saveAsTextBtn = document.getElementById('saveAsTextBtn');
const closeSaveModalBtn = document.getElementById('closeSaveModalBtn');

// Обработчик для кнопки "Сохранить результат"
saveResultBtn.addEventListener('click', () => {
    saveResultModal.style.display = 'flex'; // Показываем модальное окно
});

// Обработчик для кнопки "Сохранить как изображение"
saveAsImageBtn.addEventListener('click', () => {
    saveResultAsImage(); // Сохраняем как изображение
    saveResultModal.style.display = 'none'; // Скрываем модальное окно
});


// Обработчик для кнопки "Закрыть"
// Обработчик для кнопки "Закрыть" в модалке сохранения
closeSaveModalBtn.addEventListener('click', () => {
    saveResultModal.style.display = 'none';
});
// Обработчик для кнопки "Поделиться"


// Обработчики для кнопок выбора платформ
document.getElementById('shareVK').addEventListener('click', () => {
    const shareText = `Мои результаты квеста: ${document.querySelector('.score-text').textContent}, ${document.querySelector('.progress-value').textContent}\n\nПопробуйте и вы: ${window.location.href}`;
    const vkUrl = `https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('Мои результаты квеста')}&description=${encodeURIComponent(shareText)}`;
    window.open(vkUrl, '_blank');
    document.getElementById('shareOptionsModal').style.display = 'none';
});

document.getElementById('shareTelegram').addEventListener('click', () => {
    const scoreText = document.querySelector('.score-text').textContent; // Пример: "Вы набрали 8 из 10"
    const progressValue = document.querySelector('.progress-value').textContent; // Пример: "80%"

    // Формируем текст для Telegram
    const shareText = `Мои результаты квеста: ${scoreText}, ${progressValue}\n\nПопробуйте и вы: ${window.location.href}`;

    // Создаем ссылку для Telegram
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareText)}`;

    // Открываем ссылку в новом окне
    window.open(telegramUrl, '_blank');

    // Закрываем модальное окно
    document.getElementById('shareOptionsModal').style.display = 'none';
});

document.getElementById('shareWhatsApp').addEventListener('click', () => {
    const shareText = `Результаты квиза:\n\n${document.querySelector('.score-text').textContent}\nПрогресс: ${document.querySelector('.progress-value').textContent}\n\nПопробуйте и вы: ${window.location.href}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    document.getElementById('shareOptionsModal').style.display = 'none';
});

document.getElementById('copyLink').addEventListener('click', () => {
    const shareText = `Результаты квиза:\n\n${document.querySelector('.score-text').textContent}\nПрогресс: ${document.querySelector('.progress-value').textContent}\n\nПопробуйте и вы: ${window.location.href}`;
    navigator.clipboard.writeText(shareText)
        .then(() => alert('Ссылка скопирована в буфер обмена!'))
        .catch(() => alert('Не удалось скопировать ссылку.'));
    document.getElementById('shareOptionsModal').style.display = 'none';
});

// Обработчик для кнопки "Закрыть" в модальном окне выбора платформ
document.getElementById('closeShareOptionsModal').addEventListener('click', () => {
    document.getElementById('shareOptionsModal').style.display = 'none';
});

// Закрытие модального окна при клике вне его области
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('shareOptionsModal')) {
        document.getElementById('shareOptionsModal').style.display = 'none';
    }
});

// Закрытие модалки при клике вне ее области
window.addEventListener('click', (e) => {
    if (e.target === saveResultModal) {
        saveResultModal.style.display = 'none';
    }
});




// Если нужно скрыть подсказку при повторном нажатии
hintBtn.addEventListener('click', () => {
    if (hintText.style.display === 'block') {
        hintText.classList.add('fade-out'); // Добавляем анимацию исчезновения
        setTimeout(() => {
            hintText.style.display = 'none'; // Скрываем подсказку
        }, 300); // Время анимации
    } else {
        hintText.style.display = 'block'; // Показываем подсказку
    }
});
// Функция для предзагрузки изображений
function preloadImages() {
    const images = [];
    questions.forEach(question => {
        if (question.images) {
            if (Array.isArray(question.images)) {
                question.images.forEach(imageSrc => {
                    const img = new Image();
                    img.src = imageSrc;
                    images.push(img);
                });
            } else {
                const img = new Image();
                img.src = question.images;
                images.push(img);
            }
        }
    });
}

// Вызов функции предзагрузки изображений при загрузке страницы
window.onload = preloadImages;
// В обработчике кнопки "Картинная галерея"

// Добавить в конец файла
// В script.js добавить
// Кнопка в блоке результатов
const reportErrorBtn = document.createElement('button');
reportErrorBtn.className = 'report-btn';
reportErrorBtn.textContent = 'Сообщить об ошибке';
document.querySelector('.buttons').appendChild(reportErrorBtn);

// Элементы модального окна
const reportModal = document.querySelector('.report-modal');
const closeReportBtn = document.querySelector('.close-report-btn');

// Обработчики
reportErrorBtn.addEventListener('click', () => {
    document.getElementById('reportScore').value = userScore;
    document.getElementById('reportQuestion').value = questionCount + 1;
    document.getElementById('reportAnswers').value = userAnswers.join('\n');
    reportModal.style.display = 'block';
});

closeReportBtn.addEventListener('click', () => {
    reportModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === reportModal) {
        reportModal.style.display = 'none';
    }
});

// Обработка успешной отправки формы
const form = document.querySelector('.report-content form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(e.target.action, {
            method: 'POST',
            body: new FormData(e.target),
            headers: { Accept: 'application/json' }
        });
        
        if (response.ok) {
            showSuccessToast();
            reportModal.style.display = 'none';
            form.reset();
        } else {
            showErrorToast();
        }
    } catch (error) {
        showErrorToast();
    }
});

function showSuccessToast() {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">Отчёт успешно отправлен!</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showErrorToast() {
    const toast = document.createElement('div');
    toast.className = 'error-toast'; // Добавьте аналогичные стили для ошибок
    toast.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// Добавить в начало файла
const galleryBtn = document.querySelector('.gallery-btn');
const galleryModal = document.querySelector('.gallery-modal');
const closeGalleryBtn = document.querySelector('.close-gallery-btn');
const imageModal = document.querySelector('.image-modal');
const closeImageModal = document.querySelector('.close-image-modal');

// Инициализация галереи
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `<img src="${image.src}" alt="${image.description}">`;
        
        galleryItem.addEventListener('click', () => {
            
            // Добавьте проверку на существование элементов
            const modal = document.querySelector('.image-modal');
            const modalImg = modal.querySelector('.modal-image');
            const desc = modal.querySelector('.image-description');
            modalImg.style.display = 'flex';
            if (modalImg && desc) {
                modalImg.src = image.src;
                if (isQuizCompleted) {
                    desc.textContent = image.description;
                    desc.classList.remove('locked-description');
                } else {
                    desc.innerHTML = '<span class="lock-icon">🔒</span><span class="locked-text"> Пройди квиз до конца, чтобы открыть описание!</span>';
                    desc.classList.add('locked-description');
                }
                modal.style.display = 'block';
                
                setTimeout(() => {
                    modal.classList.add('active');
                }, 50);
            }
            modal.addEventListener('click', function modalClickHandler(event) {
                // Проверяем, что кликнули именно на фон (а не на содержимое)
                const content = modal.querySelector('.image-modal-content');
                const isClickInside = content.contains(event.target);
                if (!isClickInside) { // Клик вне контента
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                    
                    modal.removeEventListener('click', modalClickHandler);
                }
            });
        });
        
        galleryGrid.appendChild(galleryItem);
    });
}

// Добавьте обработчик закрытия модального окна
document.querySelector('.close-image-modal').addEventListener('click', () => {
    const modal = document.querySelector('.image-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
});

// Обработчики событий
galleryBtn.addEventListener('click', () => {
    document.body.classList.add('gallery-open'); // Добавить класс
    galleryModal.classList.add('active');
    initGallery();
});

// Общая функция закрытия галереи
function closeGallery() {
    document.body.classList.remove('gallery-open'); // Убрать класс
    galleryModal.classList.remove('active');
}

// Обработчики для всех способов закрытия
document.querySelector('.gallery-close-btn').addEventListener('click', closeGallery);
document.querySelector('.close-gallery-btn').addEventListener('click', closeGallery);

// Закрытие по клику вне контента
document.querySelector('.gallery-modal').addEventListener('click', (e) => {
    if (e.target.classList.contains('gallery-modal')) {
        closeGallery();
    }
});
closeGalleryBtn.addEventListener('click', closeGallery);

function openImageModal(src, description) {
    document.querySelector('.modal-image').src = src;
    document.querySelector('.image-description').textContent = description;
    imageModal.classList.add('active');
}


galleryGrid.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const img = galleryImages.find(i => i.src === e.target.src);
        if (img) openImageModal(img.src, img.description);
    }
});
// Стало
window.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        const modal = document.querySelector('.image-modal');
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
});
function updateGalleryButtonState() {
    const galleryBtn = document.querySelector('.gallery-btn');
    if (isQuizCompleted) {
        galleryBtn.classList.add('completed');
        galleryBtn.title = "Галерея доступна!";
    } else {
        galleryBtn.classList.remove('completed');
        galleryBtn.title = "Пройдите квест для доступа";
    }
}
function updateGalleryDescription() {
    const galleryDesc = document.getElementById('galleryDescription');
    
    if (isQuizCompleted) {
        galleryDesc.textContent = "🎉 Поздравляем! Теперь вы можете видеть эксклюзивные описания картин. Нажмите на любую картину, чтобы узнать интересные факты!";
        galleryDesc.classList.remove('locked');
        galleryDesc.classList.add('unlocked');
    } else {
        galleryDesc.textContent = "🔒 Пройдите весь квест до конца, чтобы разблокировать подробные описания картин. Сейчас доступен только предпросмотр!";
        galleryDesc.classList.remove('unlocked');
        galleryDesc.classList.add('locked');
    }
}
function showGalleryUnlockToast() {
    const toast = document.createElement('div');
    toast.className = 'unlock-toast active';
    toast.innerHTML = `
        <div class="toast-content">
            <strong>Достижение разблокировано!</strong>
            <p>Полная версия галереи теперь доступна</p>
        </div>
    `;
    if (unlockSound) unlockSound.play();
    document.body.appendChild(toast);
    
    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}