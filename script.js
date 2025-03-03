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

const contactsBtn = document.querySelector('.contacts-btn');
const contactsInfo = document.querySelector('.contacts-info');
const contactsInfo1 = document.querySelector('.contacts-info1');

contactsBtn.addEventListener('click', () => {
    if (contactsInfo1.classList.contains('active')) {
        // Если блок активен, добавляем анимацию скрытия
        contactsInfo1.classList.remove('active');
        contactsInfo.classList.remove('active');
        resultBox.classList.add('hide-border'); // Добавляем класс для анимации скрытия обводки

        // Ждем завершения анимации (0.5s) и скрываем блок
        setTimeout(() => {
            contactsInfo1.style.display = 'none';
            contactsInfo.style.display = 'none';
            resultBox.classList.remove('hide-border'); // Убираем класс после завершения анимации
        }, 500); // Время анимации
    } else {
        // Если блок не активен, добавляем анимацию появления
        contactsInfo.style.display = 'flex';
        contactsInfo1.style.display = 'flex';
        contactsInfo.classList.add('active');
        contactsInfo1.classList.add('active');
        resultBox.classList.remove('hide-border'); // Убираем класс для анимации появления обводки
    }
});

explanationBtn.addEventListener('click', () => {
    const currentQuestion = questions[questionCount];
    if (currentQuestion.hint) {
        if (currentQuestion.image) {
            explanationImage.src = currentQuestion.image; // Устанавливаем изображение
            explanationImage.style.display = 'block'; // Показываем изображение
        } else {
            explanationImage.style.display = 'none'; // Скрываем изображение, если его нет
        } // Устанавливаем изображение
        explanationText.textContent = currentQuestion.explanation; // Устанавливаем текст пояснения
        explanationModal.style.display = 'flex'; // Показываем экран с пояснением
    }
});

// Обработчик для кнопки "Вернуться"
closeExplanationBtn.addEventListener('click', () => {
    explanationModal.style.display = 'none'; // Скрываем экран с пояснением
});

// Закрытие экрана с пояснением при клике вне контента
window.addEventListener('click', (event) => {
    if (event.target === explanationModal) {
        explanationModal.style.display = 'none';
    }
});

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++; // Увеличиваем счетчик вопросов
        currentQuestionIndex = questionCount; // Обновляем текущий вопрос
        displayQuestions(questionCount); // Показываем следующий вопрос
        questionCounter(questionCount + 1); // Обновляем счетчик вопросов
        nextBtn.classList.remove('active'); // Скрываем кнопку "Следующий"
        hintUsed = false; // Сбрасываем флаг использования подсказки
        isAnswerChecked = false; // Сбрасываем флаг проверки ответа
    } else {
        displayResultBox(); // Показываем результаты, если вопросы закончились
    }
};
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
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;
    // Скрываем подсказку и сбрасываем состояние кнопки
    hintText.style.display = 'none';
    hintText.textContent = '';
    hintBtn.disabled = false;
    hintBtn.textContent = 'Показать подсказку';
    explanationBtn.disabled = true;

    // Если у вопроса есть подсказка, добавляем обработчик для кнопки
    if (questions[index].hint) {
        hintBtn.style.display = 'block'; // Показываем кнопку
        hintBtn.onclick = () => {
            hintText.textContent = `Подсказка: ${questions[index].hint}`;
            hintText.style.display = 'block';
            hintBtn.disabled = true; // Отключаем кнопку после использования
            hintBtn.textContent = 'Подсказка использована';
            hintUsedArray[index] = true; // Сохраняем, что подсказка была использована
        };
    } else {
        hintBtn.style.display = 'none'; // Скрываем кнопку, если подсказки нет
    }

    // Если подсказка была использована, отключаем кнопку подсказки
    if (hintUsedArray[index]) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'Подсказка использована';
    }

    // Обновляем изображение в модальном окне
    if (questions[index].image) {
        modalImage.src = questions[index].image; // Устанавливаем новое изображение

        const questionImage = document.querySelector('.question-image');
        questionText.insertAdjacentHTML('beforeend', `<button id="openImageBtn" class='openImageBtn'>Показать картинку</button>`);
        const openImageBtn = document.getElementById('openImageBtn');

        openImageBtn.addEventListener('click', () => {
            imageModal.style.display = 'flex'; // Показываем модальное окно
            quizheader.classList.add('blur-background'); // Размываем фон
            quiztext.classList.add('blur-background');
            quizfooter.classList.add('blur-background');
            optionList.classList.add('blur-background');
            quiztext1.classList.add('blur-background');
            xCloseBtn.classList.add('blur-background');
            hintBtn.classList.add('blur-background');
            hintText.classList.add('blur-background');
        });

        // Закрытие модального окна
        closeModalBtn.addEventListener('click', () => {
            imageModal.style.display = 'none'; // Скрываем модальное окно
            quizheader.classList.remove('blur-background'); // Убираем размытие
            quiztext.classList.remove('blur-background');
            quizfooter.classList.remove('blur-background');
            optionList.classList.remove('blur-background');
            quiztext1.classList.remove('blur-background');
            xCloseBtn.classList.remove('blur-background');
            hintBtn.classList.remove('blur-background');
            hintText.classList.remove('blur-background');
        });

        // Закрытие модального окна при клике вне картинки
        window.addEventListener('click', (event) => {
            if (event.target === imageModal) {
                imageModal.style.display = 'none';
                quizheader.classList.remove('blur-background'); // Убираем размытие
                quiztext.classList.remove('blur-background');
                quizfooter.classList.remove('blur-background');
                optionList.classList.remove('blur-background');
                quiztext1.classList.remove('blur-background');
                xCloseBtn.classList.remove('blur-background');
                hintBtn.classList.remove('blur-background');
                hintText.classList.remove('blur-background');
            }
        });
    }

    let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
                    <div class="option"><span>${questions[index].options[1]}</span></div>
                    <div class="option"><span>${questions[index].options[2]}</span></div>
                    <div class="option"><span>${questions[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'checkAnswer(this)');
    }

    // Если ответ уже был выбран, показываем его как выбранный
    if (userAnswers[index] !== undefined) {
        const selectedAnswer = userAnswers[index];
        const options = optionList.children;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === selectedAnswer) {
                // Подсвечиваем выбранный ответ
                if (selectedAnswer === questions[index].answer) {
                    options[i].classList.add('correct'); // Правильный ответ
                } else {
                    options[i].classList.add('incorrect'); // Неправильный ответ
                }
            }
        }

        // Активируем кнопку "Пояснение", если ответ уже был выбран
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

        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);

    isQuizCompleted = true; // Устанавливаем флаг завершения квеста
}