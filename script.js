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
const imageModal = document.getElementById('imageModal');
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
});
explanationBtn.addEventListener('click', () => {
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
        xCloseBtn.style.display = 'none';
        explanationText.textContent = currentQuestion.explanation;
        explanationModal.style.display = 'flex';
    }
});

// Обработчик для кнопки "Вернуться"
closeExplanationBtn.addEventListener('click', () => {
    explanationModal.classList.add('fade-out');
    const xCloseBtn = document.querySelector('.x-close-btn'); // Добавляем анимацию исчезновения
    setTimeout(() => {
        explanationModal.style.display = 'none'; // Скрываем модальное окно
        explanationModal.classList.remove('fade-out');
        xCloseBtn.style.display = 'block'; // Убираем класс анимации
    }, 500); // Время анимации
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
};

homepageBtn.onclick = () => {
    savedUserScore = userScore; // Сохраняем текущий счет
    quizSection.classList.remove('active');
    resultBox.classList.remove('active');
    isQuizCompleted = false; // Сбрасываем флаг завершения квеста
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
homepageBtn.onclick = () => {
    savedUserScore = userScore; // Сохраняем текущий счет
    quizSection.classList.remove('active');
    resultBox.classList.remove('active');
    isQuizCompleted = false; // Сбрасываем флаг завершения квеста
};

// При возвращении на страницу квиза восстанавливаем состояние
startBtn.onclick = () => {
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
}
// Получаем кнопку "Сохранить результат"
const saveResultBtn = document.querySelector('.save-result-btn');

// Функция для сохранения результата в виде изображения
// script.js
function saveResultAsImage() {
    const resultBox = document.querySelector('.result-box');
    const originalDisplay = [
        resultBox.style.display,
        document.querySelector('.buttons').style.display,
        document.querySelector('.contacts-info').style.display
    ];

    // Показываем нужные элементы
    resultBox.style.display = 'block';
    document.querySelector('.circular-progress').style.opacity = '1';
    document.querySelector('.score-text').style.opacity = '1';

    html2canvas(resultBox, {
        scale: 2,
        logging: true,
        useCORS: true,
        backgroundColor: '#5A3A6C',
        onclone: (clonedDoc) => {
            // Гарантируем видимость элементов в клоне
            clonedDoc.querySelector('.circular-progress').style.opacity = '1';
            clonedDoc.querySelector('.score-text').style.opacity = '1';
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
        resultBox.style.display = originalDisplay[0];
        document.querySelector('.buttons').style.display = originalDisplay[1];
        document.querySelector('.contacts-info').style.display = originalDisplay[2];
    }).catch(e => console.error('Ошибка:', e));
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

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        imageModal.classList.remove('show');
        imageModal.classList.add('fade-out');
        
        setTimeout(() => {
            imageModal.style.display = 'none';
            imageModal.classList.remove('fade-out');
        }, 500);
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
document.getElementById('galleryBtn').addEventListener('click', () => {
    // Сохраняем все ключевые данные
    localStorage.setItem('quizState', JSON.stringify({
        userScore: userScore,
        questionCount: questionCount,
        userAnswers: userAnswers,
        hintUsedArray: hintUsedArray,
        isQuizCompleted: isQuizCompleted
    }));
    window.location.href = 'gallery.html';
});