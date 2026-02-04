// Данные приложения
let cheatsheets = JSON.parse(localStorage.getItem('egeCheatsheets')) || [];
let editingId = null;
let currentView = 'list'; // 'list', 'grid', 'view'
let currentFilter = {
    subject: 'all',
    task: 'all',
    search: ''
};

let isEditModalOpen = false;
let selectedCheatsheets = new Set();
let customSubjects = JSON.parse(localStorage.getItem('egeCustomSubjects')) || [];
let currentStep = 1;
let selectedSubject = '';
let selectedTask = '';
let helpModal = null;
let closeHelpModalBtn = null;
let prevStepBtn = null;
let nextStepBtn = null;
let subjectGrid = null;
let taskGrid = null;
let formatBtns = null;
let previewSection = null;
let editPreviewBtn = null;
let modalSubtitle = null;
let formatHelpBtn = null;
let tagsInput = null;
let statsContainer = null;
let subjectStats = null;
let contentTextarea = null;

// Константы для настройки
const PREVIEW_MAX_LENGTH = 120;
const LIST_MAX_TAGS = 2;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем DOM элементы после загрузки страницы
    initDOMElements();
    initTaskNumbers();
    initSubjects();
    updateStats();
    renderCheatsheets();
    setupEventListeners();
    
    // Проверяем тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    if (saveBtn) {
        debounceButtonClick(saveBtn, saveCheatsheet);
    }
    
    if (confirmDeleteBtn) {
        debounceButtonClick(confirmDeleteBtn, confirmDeleteCheatsheet, 500);
    }
    
    if (confirmExportBtn) {
        debounceButtonClick(confirmExportBtn, confirmExport);
    }
    
    setupMobileView();
    setTimeout(updateCheatsheetListHeight, 100);
    
    const observer = new MutationObserver(updateCheatsheetListHeight);
    const cheatsheetList = document.querySelector('.cheatsheet-list');
    if (cheatsheetList) {
        observer.observe(cheatsheetList, { childList: true });
    }
});

// Функция для инициализации DOM элементов
function initDOMElements() {
    // Основные элементы
    cheatsheetList = document.getElementById('cheatsheetList');
    cheatsheetGrid = document.getElementById('cheatsheetGrid');
    contentArea = document.getElementById('contentArea');
    emptyState = document.getElementById('emptyState');
    totalCheatsheets = document.getElementById('totalCheatsheets');
    searchInput = document.getElementById('searchInput');
    subjectFilter = document.getElementById('subjectFilter');
    taskFilter = document.getElementById('taskFilter');
    currentSubject = document.getElementById('currentSubject');
    closeViewBtn = document.getElementById('closeViewBtn');
    cheatsheetView = document.getElementById('cheatsheetView');
    viewTitle = document.getElementById('viewTitle');
    viewSubject = document.getElementById('viewSubject');
    viewTask = document.getElementById('viewTask');
    viewDate = document.getElementById('viewDate');
    viewContent = document.getElementById('viewContent');
    editBtn = document.getElementById('editBtn');
    deleteBtn = document.getElementById('deleteBtn');
    newCheatsheetBtn = document.getElementById('newCheatsheetBtn');
    emptyNewBtn = document.getElementById('emptyNewBtn');
    editModal = document.getElementById('editModal');
    closeModalBtn = document.getElementById('closeModalBtn');
    cancelBtn = document.getElementById('cancelBtn');
    modalTitle = document.getElementById('modalTitle');
    cheatsheetForm = document.getElementById('cheatsheetForm');
    subjectSelect = document.getElementById('subject');
    taskNumberSelect = document.getElementById('taskNumber');
    titleInput = document.getElementById('title');
    contentTextarea = document.getElementById('content');
    charCount = document.getElementById('charCount');
    saveBtn = document.getElementById('saveBtn');
    exportBtn = document.getElementById('exportBtn');
    importBtn = document.getElementById('importBtn');
    themeToggle = document.getElementById('themeToggle');
    toastContainer = document.getElementById('toastContainer');
    deleteConfirmModal = document.getElementById('deleteConfirmModal');
    cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    deleteConfirmText = document.getElementById('deleteConfirmText');
    deleteConfirmDetails = document.getElementById('deleteConfirmDetails');
    
    // Экспорт
    exportModal = document.getElementById('exportModal');
    closeExportModalBtn = document.getElementById('closeExportModalBtn');
    cancelExportBtn = document.getElementById('cancelExportBtn');
    confirmExportBtn = document.getElementById('confirmExportBtn');
    exportAllRadio = document.getElementById('exportAll');
    exportFilteredRadio = document.getElementById('exportFiltered');
    exportSelectedRadio = document.getElementById('exportSelected');
    exportSelection = document.getElementById('exportSelection');
    exportCheckboxes = document.getElementById('exportCheckboxes');
    exportAllCount = document.getElementById('exportAllCount');
    exportFilteredCount = document.getElementById('exportFilteredCount');
    exportSelectedCount = document.getElementById('exportSelectedCount');
    
    // Редактор
    helpModal = document.getElementById('helpModal');
    closeHelpModalBtn = document.getElementById('closeHelpModalBtn');
    prevStepBtn = document.getElementById('prevStepBtn');
    nextStepBtn = document.getElementById('nextStepBtn');
    subjectGrid = document.getElementById('subjectGrid');
    taskGrid = document.getElementById('taskGrid');
    formatBtns = document.querySelectorAll('.format-btn');
    previewSection = document.getElementById('previewSection');
    editPreviewBtn = document.getElementById('editPreviewBtn');
    modalSubtitle = document.getElementById('modalSubtitle');
    formatHelpBtn = document.getElementById('formatHelpBtn');
    tagsInput = document.getElementById('tags');
    statsContainer = document.getElementById('statsContainer');
    subjectStats = document.getElementById('subjectStats');
    
    // Инициализация Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker зарегистрирован:', registration.scope);
                })
                .catch(error => {
                    console.log('Ошибка регистрации ServiceWorker:', error);
                });
        });
    }
    
    // Инициализация PWA
    initPWA();
}

// Функция для инициализации PWA
function initPWA() {
    let deferredPrompt;
    let installBtn = document.getElementById('installBtn');
    
    if (!installBtn) {
        installBtn = document.createElement('div');
        installBtn.id = 'installBtn';
        installBtn.className = 'pwa-install-btn';
        installBtn.style.cssText = 'display: none; position: fixed; bottom: 20px; right: 20px; z-index: 1000;';
        installBtn.innerHTML = `
            <button class="btn btn-primary" style="padding: 10px 20px; border-radius: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <i class="fas fa-download"></i> Установить приложение
            </button>
        `;
        document.body.appendChild(installBtn);
    }
    
    window.addEventListener('beforeinstallprompt', (e) => {
        // Не вызываем preventDefault() здесь
        deferredPrompt = e;
        
        // Показываем кнопку через 3 секунды
        setTimeout(() => {
            if (installBtn && deferredPrompt) {
                installBtn.style.display = 'block';
                installBtn.style.animation = 'fadeIn 0.5s ease-in-out';
            }
        }, 3000);
        
        installBtn.querySelector('button').addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            
            const choiceResult = await deferredPrompt.userChoice;
            
            if (choiceResult.outcome === 'accepted') {
                console.log('Пользователь принял установку');
            } else {
                console.log('Пользователь отклонил установку');
            }
            
            deferredPrompt = null;
            installBtn.style.display = 'none';
        });
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('PWA установлен');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
        showToast('Приложение успешно установлено!', 'success');
    });
}

function initSubjects() {
    const subjects = [
        { id: 'Математика', icon: 'fa-calculator', color: '#4361ee' },
        { id: 'Русский язык', icon: 'fa-language', color: '#7209b7' },
        { id: 'Физика', icon: 'fa-atom', color: '#f72585' },
        { id: 'Химия', icon: 'fa-flask', color: '#4cc9f0' },
        { id: 'Биология', icon: 'fa-dna', color: '#2ec4b6' },
        { id: 'Информатика', icon: 'fa-laptop-code', color: '#ff9e00' },
        { id: 'История', icon: 'fa-landmark', color: '#9d4edd' },
        { id: 'Обществознание', icon: 'fa-users', color: '#06d6a0' },
        { id: 'Английский язык', icon: 'fa-globe-europe', color: '#ef476f' },
        { id: 'Литература', icon: 'fa-book-open', color: '#118ab2' },
        { id: 'География', icon: 'fa-globe-americas', color: '#06d6a0' }
    ];
    
    subjectGrid.innerHTML = subjects.map(subject => `
        <button type="button" class="subject-btn" data-subject="${subject.id}">
            <i class="fas ${subject.icon}"></i>
            <span>${subject.id}</span>
        </button>
    `).join('');
    
    // Обработчики для кнопок предметов
    document.querySelectorAll('.subject-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSubject = btn.dataset.subject;
            updateModalSubtitle();
        });
    });
}
// Заполняем список номеров заданий
function initTaskNumbers() {
    const taskNumbers = Array.from({length: 27}, (_, i) => i + 1);
    
    // Для фильтра
    taskFilter.innerHTML = '<option value="all">Все задания</option>' +
        taskNumbers.map(num => `<option value="${num}">${num}</option>`).join('');
    
    // Для сетки
    taskGrid.innerHTML = taskNumbers.map(num => `
        <button type="button" class="task-btn" data-task="${num}">${num}</button>
    `).join('');
    
    // Обработчики для кнопок заданий
    document.querySelectorAll('.task-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.task-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTask = btn.dataset.task;
            updateModalSubtitle();
        });
    });
    
    // Инициализируем скрытые селекты для формы (добавляем)
    taskNumberSelect.innerHTML = '<option value="" disabled selected>Выберите номер</option>' +
        taskNumbers.map(num => `<option value="${num}">${num}</option>`).join('');
}
function updateModalSubtitle() {
    if (selectedSubject && selectedTask) {
        modalSubtitle.textContent = `${selectedSubject}, задание ${selectedTask}`;
    } else if (selectedSubject) {
        modalSubtitle.textContent = `Выбран предмет: ${selectedSubject}`;
    } else if (selectedTask) {
        modalSubtitle.textContent = `Выбрано задание: ${selectedTask}`;
    } else {
        modalSubtitle.textContent = 'Заполните информацию о шпаргалке';
    }
}
// Настройка обработчиков событий
// Настройка обработчиков событий
function setupEventListeners() {
    const sidebarFooter = document.querySelector('.sidebar-footer');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (sidebarFooter && mobileMenu) {
        // Показываем оба меню, CSS скроет ненужное
        sidebarFooter.style.display = 'flex';
        mobileMenu.style.display = 'flex';
        
        // Явно назначаем обработчики для мобильных кнопок
        const mobileExportBtn = document.getElementById('mobileExportBtn');
        const mobileImportBtn = document.getElementById('mobileImportBtn');
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');
        
        if (mobileExportBtn) {
            mobileExportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                exportBtn.click();
            });
        }
        
        if (mobileImportBtn) {
            mobileImportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                importBtn.click();
            });
        }
        
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                themeToggle.click();
            });
        }
    }
    // Форма
    cheatsheetForm.addEventListener('submit', saveCheatsheet);
    contentTextarea.addEventListener('input', function() {
        updateCharCount();
        updateTextStats();
        updatePreview();
    });
    // Фильтры
    searchInput.addEventListener('input', updateFilters);
    subjectFilter.addEventListener('change', updateFilters);
    taskFilter.addEventListener('change', updateFilters);
    
    // Кнопки
    newCheatsheetBtn.addEventListener('click', () => openEditModal());
    emptyNewBtn.addEventListener('click', () => openEditModal());
    closeViewBtn.addEventListener('click', () => {
        // Снимаем активный класс со всех элементов
        document.querySelectorAll('.cheatsheet-item.active, .grid-item.active').forEach(el => {
            el.classList.remove('active');
        });
        showListView();
    });
    editBtn.addEventListener('click', editCurrentCheatsheet);
    deleteBtn.addEventListener('click', showDeleteConfirmation);
    
    // Модальное окно
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    
    // Управление
    importBtn.addEventListener('click', importCheatsheets);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Улучшенное закрытие модалки при клике вне её
    setupImprovedModalClose(editModal, closeEditModal);
    setupImprovedModalClose(exportModal, closeExportModal);
    setupImprovedModalClose(deleteConfirmModal, closeDeleteModal);
    setupImprovedModalClose(helpModal, closeHelpModal);
    
    nextStepBtn.addEventListener('click', nextStep);
    prevStepBtn.addEventListener('click', prevStep);
    
    // Обработчики форматирования
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => applyFormatting(btn.dataset.format));
    });
    
    // Предпросмотр
    editPreviewBtn.addEventListener('click', () => goToStep(2));
    
    // Подсказки
    formatHelpBtn.addEventListener('click', openHelpModal);
    closeHelpModalBtn.addEventListener('click', closeHelpModal);
    
    // Обработчик Escape для модальных окон
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (editModal.style.display === 'flex') {
                closeEditModal();
            }
            if (helpModal.style.display === 'flex') {
                closeHelpModal();
            }
            if (exportModal.style.display === 'flex') {
                closeExportModal();
            }
            if (deleteConfirmModal.style.display === 'flex') {
                closeDeleteModal();
            }
        }
    });
    
    exportBtn.addEventListener('click', openExportModal);
    
    // Модальное окно экспорта
    closeExportModalBtn.addEventListener('click', closeExportModal);
    cancelExportBtn.addEventListener('click', closeExportModal);
    confirmExportBtn.addEventListener('click', confirmExport);
    
    // Переключение типа экспорта
    exportAllRadio.addEventListener('change', updateExportSelection);
    exportFilteredRadio.addEventListener('change', updateExportSelection);
    exportSelectedRadio.addEventListener('change', updateExportSelection);
    
    // Следим за изменениями в форме для предпросмотра
    titleInput.addEventListener('input', updatePreview);
    contentTextarea.addEventListener('input', updatePreview);
    tagsInput.addEventListener('input', updatePreview);
    
    // Удаление шпаргалки
    deleteBtn.addEventListener('click', showDeleteConfirmation);
    
    // Модальное окно подтверждения удаления
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', confirmDeleteCheatsheet);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (deleteConfirmModal.style.display === 'flex') {
                closeDeleteModal();
            }
        }
    });
}
// Улучшенная функция закрытия модального окна при клике вне его
function setupImprovedModalClose(modalElement, closeFunction) {
    let mouseDownInside = false;
    let mouseDownTarget = null;
    
    // Отслеживаем начало клика
    modalElement.addEventListener('mousedown', function(e) {
        mouseDownInside = true;
        mouseDownTarget = e.target;
    });
    
    // Отслеживаем отпускание кнопки мыши
    modalElement.addEventListener('mouseup', function(e) {
        // Проверяем, был ли клик начат и завершен на фоне модального окна
        if (mouseDownInside && mouseDownTarget === e.target && e.target === modalElement) {
            // Ждем немного, чтобы избежать конфликтов с другими событиями
            setTimeout(() => {
                if (modalElement.style.display === 'flex') {
                    closeFunction();
                }
            }, 10);
        }
        // Сбрасываем флаги
        mouseDownInside = false;
        mouseDownTarget = null;
    });
    
    // Также обрабатываем клик, но только если он не начался внутри контента
    modalElement.addEventListener('click', function(e) {
        // Если клик был на самом фоне модалки (не на контенте)
        if (e.target === modalElement) {
            // Проверяем, не было ли начало клика внутри контента
            const modalContent = modalElement.querySelector('.modal-content');
            if (modalContent && modalContent.contains(mouseDownTarget)) {
                // Клик начался внутри контента, не закрываем
                return;
            }
            
            // Задержка для стабильности
            setTimeout(() => {
                if (modalElement.style.display === 'flex') {
                    closeFunction();
                }
            }, 10);
        }
    });
    
    // Сбрасываем флаги при уходе курсора
    modalElement.addEventListener('mouseleave', function() {
        mouseDownInside = false;
        mouseDownTarget = null;
    });
}
function closeDeleteModal() {
    // Проверяем, открыто ли окно
    if (deleteConfirmModal.style.display !== 'flex') return;
    
    // Убираем подсветку
    if (cheatsheetToDelete) {
        const listItem = document.querySelector(`.cheatsheet-item[data-id="${cheatsheetToDelete}"]`);
        const gridItem = document.querySelector(`.grid-item[data-id="${cheatsheetToDelete}"]`);
        
        if (listItem) listItem.classList.remove('deleting-highlight');
        if (gridItem) gridItem.classList.remove('deleting-highlight');
    }
    
    deleteConfirmModal.style.opacity = '0';
    setTimeout(() => {
        deleteConfirmModal.style.display = 'none';
        cheatsheetToDelete = null;
    }, 0);
}
function confirmDeleteCheatsheet() {
    if (!cheatsheetToDelete) return;
    
    // Сразу закрываем модальное окно
    deleteConfirmModal.style.opacity = '0';
    setTimeout(() => {
        deleteConfirmModal.style.display = 'none';
    }, 0);
    
    // Добавляем анимацию удаления к элементам
    const listItem = document.querySelector(`.cheatsheet-item[data-id="${cheatsheetToDelete}"]`);
    const gridItem = document.querySelector(`.grid-item[data-id="${cheatsheetToDelete}"]`);
    
    if (listItem) listItem.classList.add('deleting');
    if (gridItem) gridItem.classList.add('deleting');
    
    // Удаляем шпаргалку из массива сразу (без задержки)
    cheatsheets = cheatsheets.filter(c => c.id !== cheatsheetToDelete);
    
    // Сохраняем в localStorage
    saveToStorage();
    
    // Обновляем интерфейс (но без перерисовки элементов, которые в процессе анимации)
    updateStats();
    
    // Если удаляли просматриваемую шпаргалку, показываем список
    if (cheatsheetView.dataset.id === cheatsheetToDelete) {
        showListView();
    }
    
    // Показываем уведомление с возможностью отмены
    showUndoableToast('Шпаргалка удалена', cheatsheetToDelete);
    
    // Сбрасываем ID через короткую задержку
    setTimeout(() => {
        cheatsheetToDelete = null;
        // Перерисовываем список только после завершения анимации
        renderCheatsheets();
    }, 500); // Соответствует длительности анимации
}
function showUndoableToast(message, cheatsheetId) {
    // Сохраняем копию удаленной шпаргалки
    const deletedCheatsheet = cheatsheets.find(c => c.id === cheatsheetId);
    if (!deletedCheatsheet) return;
    
    lastDeletedCheatsheet = deletedCheatsheet;
    
    // Создаем уведомление с кнопкой отмены
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.dataset.id = cheatsheetId;
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-trash"></i> ${message}
            <span id="undoCountdown">5</span>с
        </div>
        <button class="toast-undo" id="undoDeleteBtn">
            <i class="fas fa-undo"></i> Отменить
        </button>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Запускаем таймер для автоматического скрытия
    let countdown = 5;
    const countdownElement = toast.querySelector('#undoCountdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            if (toast.parentNode) {
                toast.remove();
                lastDeletedCheatsheet = null;
            }
        }
    }, 1000);
    
    // Обработчик кнопки отмены
    const undoBtn = toast.querySelector('#undoDeleteBtn');
    undoBtn.addEventListener('click', () => {
        undoDelete(deletedCheatsheet);
        clearInterval(countdownInterval);
        toast.remove();
    });
    
    // Обработчик закрытия
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        clearInterval(countdownInterval);
        toast.remove();
        lastDeletedCheatsheet = null;
    });
    
    // Автоматическое удаление через 5 секунд
    undoTimeout = setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
            lastDeletedCheatsheet = null;
        }
    }, 5000);
}
function undoDelete(cheatsheet) {
    if (!cheatsheet) return;
    
    // Убираем класс удаления с элементов (если они еще есть в DOM)
    const listItem = document.querySelector(`.cheatsheet-item[data-id="${cheatsheet.id}"]`);
    const gridItem = document.querySelector(`.grid-item[data-id="${cheatsheet.id}"]`);
    
    if (listItem) listItem.classList.remove('deleting');
    if (gridItem) gridItem.classList.remove('deleting');
    
    // Восстанавливаем шпаргалку в массив
    cheatsheets.unshift(cheatsheet);
    
    // Сохраняем в localStorage
    saveToStorage();
    
    // Обновляем интерфейс
    updateStats();
    renderCheatsheets();
    
    // Показываем уведомление о восстановлении
    showToast('Шпаргалка восстановлена', 'success');
    
    // Показываем восстановленную шпаргалку
    const restoredItem = document.querySelector(`.cheatsheet-item[data-id="${cheatsheet.id}"]`);
    if (restoredItem) {
        restoredItem.click();
    }
    
    lastDeletedCheatsheet = null;
}
const undoToastStyles = `
.toast .toast-content i.fa-trash {
    margin-right: 8px;
    color: var(--danger-color);
}

.toast #undoCountdown {
    display: inline-block;
    background-color: rgba(255, 71, 87, 0.2);
    color: var(--danger-color);
    padding: 2px 6px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-left: 8px;
    min-width: 24px;
    text-align: center;
}

.toast-undo {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    margin-right: 8px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
}

.toast-undo:hover {
    background-color: rgba(67, 97, 238, 0.1);
    transform: translateY(-1px);
}

.toast-undo i {
    font-size: 0.9rem;
}
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = undoToastStyles;
document.head.appendChild(styleSheet);
let lastDeletedCheatsheet = null;
let undoTimeout = null;
function showDeleteConfirmation() {
    const cheatsheetId = cheatsheetView.dataset.id;
    const cheatsheet = cheatsheets.find(c => c.id === cheatsheetId);
    
    if (!cheatsheet) return;
    
    // Сохраняем ID шпаргалки для удаления
    cheatsheetToDelete = cheatsheetId;
    
    // Подсвечиваем удаляемую шпаргалку в списке
    const listItem = document.querySelector(`.cheatsheet-item[data-id="${cheatsheetId}"]`);
    const gridItem = document.querySelector(`.grid-item[data-id="${cheatsheetId}"]`);
    
    if (listItem) listItem.classList.add('deleting-highlight');
    if (gridItem) gridItem.classList.add('deleting-highlight');
    
    // Красивое описание для удаления
    const taskTypes = {
        1: "задание с кратким ответом",
        2: "задание на анализ текста",
        3: "задание на соответствие",
        4: "задание с развернутым ответом",
        5: "задание на решение задач"
    };
    
    const taskType = taskTypes[cheatsheet.taskNumber] || "задание";
    
    deleteConfirmText.innerHTML = `
        <strong>${cheatsheet.title}</strong> будет удалена без возможности восстановления.<br>
        Это ${taskType} по предмету <strong>${cheatsheet.subject}</strong>.
    `;
    
    // Форматируем даты красиво
    const createdDate = new Date(cheatsheet.createdAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const updatedDate = new Date(cheatsheet.updatedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Добавляем красивые детали
    deleteConfirmDetails.innerHTML = `
        <div class="confirm-details-item">
            <span class="confirm-details-label">
                <i class="fas fa-book"></i> Предмет
            </span>
            <span class="confirm-details-value" style="color: var(--primary-color); font-weight: 700;">
                ${cheatsheet.subject}
            </span>
        </div>
        <div class="confirm-details-item">
            <span class="confirm-details-label">
                <i class="fas fa-tasks"></i> Номер задания
            </span>
            <span class="confirm-details-value" style="background: linear-gradient(135deg, var(--secondary-color), var(--secondary-light)); color: white; padding: 4px 12px; border-radius: 20px;">
                ${cheatsheet.taskNumber}
            </span>
        </div>
        <div class="confirm-details-item">
            <span class="confirm-details-label">
                <i class="fas fa-calendar-plus"></i> Создано
            </span>
            <span class="confirm-details-value">${createdDate}</span>
        </div>
        <div class="confirm-details-item">
            <span class="confirm-details-label">
                <i class="fas fa-history"></i> Обновлено
            </span>
            <span class="confirm-details-value">${updatedDate}</span>
        </div>
        <div class="confirm-details-item">
            <span class="confirm-details-label">
                <i class="fas fa-text-height"></i> Размер
            </span>
            <span class="confirm-details-value">
                ${cheatsheet.content.length} символов, 
                ${Math.ceil(cheatsheet.content.split(' ').length)} слов
            </span>
        </div>
    `;
    
    // Показываем модальное окно
    deleteConfirmModal.style.display = 'flex';
    setTimeout(() => {
        deleteConfirmModal.style.opacity = '1';
        confirmDeleteBtn.focus();
    }, 10);
}
// Обновление фильтров
function updateFilters() {
    currentFilter.subject = subjectFilter.value;
    currentFilter.task = taskFilter.value;
    currentFilter.search = searchInput.value.toLowerCase().trim();
    
    updateCurrentSubjectText();
    renderCheatsheets(); // Уже есть
    
    // Обновляем активный элемент, если есть
    if (currentView === 'view' && cheatsheetView.dataset.id) {
        const activeCheatsheet = cheatsheets.find(c => c.id === cheatsheetView.dataset.id);
        if (activeCheatsheet && getFilteredCheatsheets().some(c => c.id === activeCheatsheet.id)) {
            // Если активная шпаргалка проходит фильтр, обновляем её отображение
            viewCheatsheet(activeCheatsheet);
        } else {
            // Иначе возвращаемся к списку
            showListView();
        }
    }
}

// Обновление текста текущего предмета
function updateCurrentSubjectText() {
    if (currentFilter.subject === 'all') {
        currentSubject.textContent = 'Все шпаргалки';
    } else {
        currentSubject.textContent = currentFilter.subject;
    }
}
function nextStep() {
    if (currentStep === 1) {
        // Проверяем, выбраны ли предмет и задание
        if (!selectedSubject || !selectedTask) {
            showToast('Выберите предмет и номер задания', 'error');
            return;
        }
        
        // Заполняем скрытые select'ы для обратной совместимости
        if (subjectSelect) subjectSelect.value = selectedSubject;
        if (taskNumberSelect) taskNumberSelect.value = selectedTask;
        
        // Переходим к шагу 2
        goToStep(2);
    } else if (currentStep === 2) {
        // Проверяем содержание
        if (!contentTextarea.value.trim()) {
            showToast('Введите содержание шпаргалки', 'error');
            return;
        }
        
        // Обновляем предпросмотр
        updatePreview();
        
        // Переходим к шагу 3
        goToStep(3);
    }
}
function prevStep() {
    if (currentStep === 2) {
        goToStep(1);
    } else if (currentStep === 3) {
        goToStep(2);
    }
}
function goToStep(step) {
    // Скрываем все секции
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Обновляем степпер
    document.querySelectorAll('.stepper-step').forEach(stepEl => {
        stepEl.classList.remove('active');
        if (parseInt(stepEl.dataset.step) <= step) {
            stepEl.classList.add('active');
        }
    });
    
    // Показываем нужную секцию
    document.getElementById(`${['basic', 'content', 'preview'][step-1]}Section`).style.display = 'block';
    
    // Обновляем кнопки
    prevStepBtn.style.display = step > 1 ? 'flex' : 'none';
    nextStepBtn.style.display = step < 3 ? 'flex' : 'none';
    saveBtn.style.display = step === 3 ? 'flex' : 'none';
    
    // Обновляем заголовок
    modalTitle.textContent = step === 1 ? 'Новая шпаргалка' : 
                           step === 2 ? 'Содержание шпаргалки' : 
                           'Предпросмотр и сохранение';
    
    currentStep = step;
    
    // Если это последний шаг, обновляем статистику символов
    if (step === 2) {
        updateTextStats();
    }
}

// Обновление счетчика символов
function updateCharCount() {
    const length = contentTextarea.value.length;
    charCount.textContent = length;
}
function applyFormatting(format) {
    const textarea = contentTextarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = textarea.value.indexOf('\n', end);
    const currentLine = lineEnd === -1 
        ? textarea.value.substring(lineStart)
        : textarea.value.substring(lineStart, lineEnd);
    
    let formattedText = '';
    
    switch(format) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'header':
            // Если строка уже начинается с #, удаляем заголовок
            if (currentLine.startsWith('# ')) {
                formattedText = currentLine.substring(2);
                textarea.setRangeText(formattedText, lineStart, lineEnd === -1 ? textarea.value.length : lineEnd, 'end');
            } else {
                formattedText = `# ${currentLine}`;
                textarea.setRangeText(formattedText, lineStart, lineEnd === -1 ? textarea.value.length : lineEnd, 'end');
            }
            textarea.focus();
            textarea.dispatchEvent(new Event('input'));
            return;
        case 'list':
            // Если выделен текст, применяем к каждой строке
            if (selectedText) {
                formattedText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
            } else {
                // Если курсор в начале строки, добавляем маркер
                if (currentLine.startsWith('• ')) {
                    formattedText = currentLine.substring(2);
                    textarea.setRangeText(formattedText, lineStart, lineEnd === -1 ? textarea.value.length : lineEnd, 'end');
                } else {
                    formattedText = `• ${currentLine}`;
                    textarea.setRangeText(formattedText, lineStart, lineEnd === -1 ? textarea.value.length : lineEnd, 'end');
                }
                textarea.focus();
                textarea.dispatchEvent(new Event('input'));
                return;
            }
            break;
        case 'code':
            formattedText = `\`${selectedText}\``;
            break;
        case 'clear':
            formattedText = selectedText.replace(/\*\*|\*|`{1,3}|^[•\-]\s+/gm, '');
            break;
    }
    
    textarea.setRangeText(formattedText, start, end, 'end');
    textarea.focus();
    textarea.dispatchEvent(new Event('input'));
}


function updateTextStats() {
    const text = contentTextarea.value;
    const charCountElement = document.getElementById('charCount');
    const wordCountElement = document.getElementById('wordCount');
    const lineCountElement = document.getElementById('lineCount');
    
    // Символы
    const chars = text.length;
    charCountElement.textContent = chars;
    
    // Слова
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCountElement.textContent = words;
    
    // Строки
    const lines = text ? text.split('\n').length : 0;
    lineCountElement.textContent = lines;
}
// Закрытие модального окна
function closeEditModal() {
    // Проверяем, открыто ли окно
    if (editModal.style.display !== 'flex') return;
    
    isEditModalOpen = false;
    editModal.style.opacity = '0';
    setTimeout(() => {
        editModal.style.display = 'none';
        editingId = null;
        selectedSubject = '';
        selectedTask = '';
        
        // Сбрасываем активные кнопки
        document.querySelectorAll('.subject-btn, .task-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Сбрасываем форму
        cheatsheetForm.reset();
        
        // Сбрасываем шаги
        goToStep(1);
    }, 0);
}
function updatePreview() {
    // Обновляем статистику текста
    updateTextStats();
    
    // Обновляем предпросмотр
    document.getElementById('previewSubject').textContent = selectedSubject;
    document.getElementById('previewTask').textContent = `Задание ${selectedTask}`;
    
    const title = titleInput.value.trim() || `${selectedSubject}, задание ${selectedTask}`;
    document.getElementById('previewTitle').textContent = title;
    
    // Форматируем содержимое с помощью formatContent для правильного отображения
    const formattedContent = formatContent(contentTextarea.value);
    document.getElementById('previewContent').innerHTML = formattedContent;
    
    // Обновляем теги
    const tagsContainer = document.getElementById('previewTags');
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (tags.length > 0) {
        tagsContainer.innerHTML = tags.map(tag => 
            `<span class="preview-tag">${tag}</span>`
        ).join('');
    } else {
        tagsContainer.innerHTML = '<span class="preview-tag">без тегов</span>';
    }
}
// Сохранение шпаргалки

function openHelpModal() {
    helpModal.style.display = 'flex';
    setTimeout(() => helpModal.style.opacity = '1', 10);
}

// Закрытие модального окна с подсказками
function closeHelpModal() {
    // Проверяем, открыто ли окно
    if (helpModal.style.display !== 'flex') return;
    
    helpModal.style.opacity = '0';
    setTimeout(() => {
        helpModal.style.display = 'none';
    },0);
}
function debounceButtonClick(button, callback, delay = 300) {
    let isProcessing = false;
    
    button.addEventListener('click', function(e) {
        if (isProcessing) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        
        isProcessing = true;
        
        // Визуальная обратная связь
        button.classList.add('processing');
        
        // Выполняем callback
        if (typeof callback === 'function') {
            callback(e);
        }
        
        // Сбрасываем через delay миллисекунд
        setTimeout(() => {
            isProcessing = false;
            button.classList.remove('processing');
        }, delay);
    });
}
// Обновление статистики (расширенная версия)
function updateStats() {
    const total = cheatsheets.length;
    
    // Обновляем общее количество с правильным склонением
    const word = getWordForm(total, ['шпаргалка', 'шпаргалки', 'шпаргалок']);
    document.getElementById('totalCheatsheets').textContent = total;
    document.querySelector('.stats-label').textContent = word;
    
    // Показываем статистику по предметам
    if (total > 0) {
        const subjectCounts = {};
        cheatsheets.forEach(c => {
            subjectCounts[c.subject] = (subjectCounts[c.subject] || 0) + 1;
        });
        
        // Сортируем по количеству
        const sortedSubjects = Object.entries(subjectCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3); // Показываем только топ-3
        
        if (sortedSubjects.length > 0) {
            const statsText = sortedSubjects.map(([subject, count]) => 
                `${subject}: ${count}`
            ).join(', ');
            
            subjectStats.textContent = statsText;
            subjectStats.style.display = 'block';
        } else {
            subjectStats.style.display = 'none';
        }
    } else {
        subjectStats.style.display = 'none';
    }
    
    // Обновляем внешний вид контейнера статистики
    statsContainer.classList.toggle('has-stats', total > 0);
}

// Функция для склонения слов
function getWordForm(number, forms) {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}

// Обновляем функцию openEditModal
function openEditModal(cheatsheet = null) {
    // Сбрасываем форму
    isEditModalOpen = true;
    currentStep = 1;
    selectedSubject = '';
    selectedTask = '';
    
    document.querySelectorAll('.subject-btn, .task-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (cheatsheet) {
        // Редактирование существующей
        editingId = cheatsheet.id;
        modalTitle.textContent = 'Редактировать шпаргалку';
        
        // Выбираем предмет
        const subjectBtn = document.querySelector(`.subject-btn[data-subject="${cheatsheet.subject}"]`);
        if (subjectBtn) {
            subjectBtn.classList.add('active');
            selectedSubject = cheatsheet.subject;
        }
        
        // Выбираем задание
        const taskBtn = document.querySelector(`.task-btn[data-task="${cheatsheet.taskNumber}"]`);
        if (taskBtn) {
            taskBtn.classList.add('active');
            selectedTask = String(cheatsheet.taskNumber);
        }
        
        titleInput.value = cheatsheet.title || '';
        contentTextarea.value = cheatsheet.content;
        tagsInput.value = cheatsheet.tags ? cheatsheet.tags.join(', ') : '';
        
        // Заполняем скрытые поля для обратной совместимости
        if (subjectSelect) subjectSelect.value = cheatsheet.subject;
        if (taskNumberSelect) taskNumberSelect.value = String(cheatsheet.taskNumber);
    } else {
        // Создание новой
        editingId = null;
        modalTitle.textContent = 'Новая шпаргалка';
        cheatsheetForm.reset();
        
        // Сбрасываем скрытые селекты
        if (subjectSelect) subjectSelect.value = '';
        if (taskNumberSelect) taskNumberSelect.value = '';
    }
    
    // Обновляем подзаголовок
    updateModalSubtitle();
    
    // Сбрасываем к шагу 1
    goToStep(1);
    
    // Показываем модальное окно
    editModal.style.display = 'flex';
    setTimeout(() => {
        editModal.style.opacity = '1';
        contentTextarea.focus();
    }, 10);
}

// Обновляем функцию saveCheatsheet для поддержки тегов
function saveCheatsheet(e) {
    e.preventDefault();
    
    // Валидация
    if (!selectedSubject || !selectedTask) {
        showToast('Выберите предмет и номер задания', 'error');
        goToStep(1);
        return;
    }
    
    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (!content) {
        showToast('Введите содержание шпаргалки', 'error');
        goToStep(2);
        return;
    }
    
    // Преобразуем selectedTask в число
    const taskNumber = parseInt(selectedTask);
    
    let updatedCheatsheet;
    
    if (editingId) {
        // Обновление существующей
        const index = cheatsheets.findIndex(c => c.id === editingId);
        if (index !== -1) {
            cheatsheets[index] = {
                ...cheatsheets[index],
                subject: selectedSubject,
                taskNumber: taskNumber,
                title: title || `${selectedSubject}, задание ${selectedTask}`,
                content,
                tags,
                updatedAt: new Date().toISOString()
            };
            updatedCheatsheet = cheatsheets[index];
        }
    } else {
        // Создание новой
        const newCheatsheet = {
            id: Date.now().toString(),
            subject: selectedSubject,
            taskNumber: taskNumber,
            title: title || `${selectedSubject}, задание ${selectedTask}`,
            content,
            tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        cheatsheets.unshift(newCheatsheet);
        updatedCheatsheet = newCheatsheet;
    }
    
    // Сохраняем в localStorage
    saveToStorage();
    
    // Обновляем интерфейс
    updateStats();
    renderCheatsheets();
    closeEditModal();
    
    // Если редактировали шпаргалку, которая сейчас открыта в режиме просмотра, обновляем её
    if (editingId && cheatsheetView.dataset.id === editingId && updatedCheatsheet) {
        viewCheatsheet(updatedCheatsheet);
    }
    
    // Показываем уведомление
    showToast(
        editingId ? 'Шпаргалка обновлена' : 'Шпаргалка создана',
        'success'
    );
}
// Сохранение в localStorage
function saveToStorage() {
    try {
        localStorage.setItem('egeCheatsheets', JSON.stringify(cheatsheets));
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showToast('Превышен лимит хранилища. Удалите некоторые шпаргалки.', 'error');
        }
        return false;
    }
}

// Отображение шпаргалок
function renderCheatsheets() {
    let filteredCheatsheets = getFilteredCheatsheets();
    totalCheatsheets.textContent = filteredCheatsheets.length;
    if (filteredCheatsheets.length === 0) {
        showEmptyState();
        // Очищаем список
        cheatsheetList.innerHTML = '';
        cheatsheetGrid.innerHTML = '';
        return;
    }
    if (currentView !== 'view') {
        showListView();
    }
    
    // Очищаем списки
    cheatsheetList.innerHTML = '';
    cheatsheetGrid.innerHTML = '';
    
    // Добавляем шпаргалки
    filteredCheatsheets.forEach(cheatsheet => {
        renderCheatsheetItem(cheatsheet);
        renderGridItem(cheatsheet);
    });
    setTimeout(updateCheatsheetListHeight, 100);
}

// Рендер элемента списка
// Рендер элемента списка (без превью текста)
function renderCheatsheetItem(cheatsheet) {
    const item = document.createElement('div');
    item.className = 'cheatsheet-item';
    item.dataset.id = cheatsheet.id;
    
    // Форматируем дату
    const date = formatDate(cheatsheet.updatedAt || cheatsheet.createdAt);
    
    // Определяем иконку предмета
    const subjectIcons = {
        'Математика': 'fa-calculator',
        'Русский язык': 'fa-language',
        'Физика': 'fa-atom',
        'Химия': 'fa-flask',
        'Биология': 'fa-dna',
        'Информатика': 'fa-laptop-code',
        'История': 'fa-landmark',
        'Обществознание': 'fa-users',
        'Английский язык': 'fa-globe-europe',
        'Литература': 'fa-book-open',
        'География': 'fa-globe-americas'
    };
    
    const iconClass = subjectIcons[cheatsheet.subject] || 'fa-book';
    
    // Теги для отображения в meta
    const tagsDisplay = cheatsheet.tags && cheatsheet.tags.length > 0 
        ? `<div class="cheatsheet-tags">${cheatsheet.tags.slice(0, 3).map(tag => 
            `<span class="cheatsheet-tag">${tag}</span>`).join('')}</div>`
        : '';
    

    
    item.innerHTML = `
        <div class="cheatsheet-item-header">
            <div class="cheatsheet-subject-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="cheatsheet-info">
                <div class="cheatsheet-title">${cheatsheet.title}</div>
                <div class="cheatsheet-subject-task">
                    <span class="cheatsheet-subject">${cheatsheet.subject}</span>
                    <span class="cheatsheet-task">Задание ${cheatsheet.taskNumber}</span>
                </div>
                
            </div>
        </div>
        <div class="cheatsheet-meta">
            <span>${date}</span>
            <span class="cheatsheet-tags-meta">${tagsDisplay}</span>
        </div>
    `;
    
    item.addEventListener('click', () => {
        document.querySelectorAll('.cheatsheet-item').forEach(el => {
            el.classList.remove('active');
        });
        item.classList.add('active');
        viewCheatsheet(cheatsheet);
    });
    
    cheatsheetList.appendChild(item);
}
function formatContent(content) {
    if (!content) return '';
    
    let formatted = content;
    
    // Сначала обрабатываем блоки кода, чтобы не трогать их содержимое
    // Блок кода: ```код```
    formatted = formatted.replace(/```\s*([\s\S]*?)\s*```/g, '<pre><code>$1</code></pre>');
    
    // Обрабатываем остальное форматирование построчно
    let lines = formatted.split('\n');
    let resultLines = [];
    let inList = false;
    let listItems = [];
    
    for (let line of lines) {
        // Проверяем, не является ли строка блоком кода
        if (line.includes('```')) {
            if (inList && listItems.length > 0) {
                resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
                listItems = [];
                inList = false;
            }
            resultLines.push(line);
            continue;
        }
        
        // Заголовки: # Заголовок, ## Подзаголовок
        if (line.startsWith('## ')) {
            if (inList && listItems.length > 0) {
                resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
                listItems = [];
                inList = false;
            }
            line = `<h4>${line.substring(3)}</h4>`;
            resultLines.push(line);
        }
        else if (line.startsWith('# ')) {
            if (inList && listItems.length > 0) {
                resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
                listItems = [];
                inList = false;
            }
            line = `<h3>${line.substring(2)}</h3>`;
            resultLines.push(line);
        }
        // Горизонтальная линия
        else if (line === '---') {
            if (inList && listItems.length > 0) {
                resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
                listItems = [];
                inList = false;
            }
            line = '<hr>';
            resultLines.push(line);
        }
        // Элемент списка
        else if (line.startsWith('• ') || line.startsWith('- ')) {
            const listSymbol = line.startsWith('• ') ? '•' : '-';
            if (!inList) {
                inList = true;
            }
            
            // Убираем маркер списка и обрабатываем форматирование внутри
            let itemText = line.substring(2);
            itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            itemText = itemText.replace(/\*(.*?)\*/g, '<em>$1</em>');
            itemText = itemText.replace(/`(.*?)`/g, '<code>$1</code>');
            
            listItems.push(`<li>${itemText}</li>`);
        }
        // Не элемент списка, но список активен
        else if (inList && line.trim() !== '' && !line.startsWith('• ') && !line.startsWith('- ')) {
            if (listItems.length > 0) {
                resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
                listItems = [];
            }
            inList = false;
            
            // Добавляем текущую строку
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
            line = line.replace(/`(.*?)`/g, '<code>$1</code>');
            resultLines.push(line);
        }
        // Не элемент списка и список не активен
        else if (!inList && line.trim() !== '') {
            // Жирный текст: **текст**
            line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Курсив: *текст*
            line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
            // Код: `текст`
            line = line.replace(/`(.*?)`/g, '<code>$1</code>');
            resultLines.push(line);
        }
        // Пустая строка
        else if (line.trim() === '') {
            if (inList && listItems.length > 0) {
                resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
                listItems = [];
                inList = false;
            }
            resultLines.push('<br>');
        }
    }
    
    // Закрываем список, если он остался открытым
    if (inList && listItems.length > 0) {
        resultLines.push(`<ul class="formatted-list">${listItems.join('')}</ul>`);
    }
    
    formatted = resultLines.join('\n');
    
    return formatted;
}
// Рендер элемента сетки
// Рендер элемента сетки
function renderGridItem(cheatsheet) {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.dataset.id = cheatsheet.id;
    
    // Форматируем дату
    const date = formatDateShort(cheatsheet.updatedAt || cheatsheet.createdAt);
    
    // Убираем форматирование из превью
    const cleanPreview = cheatsheet.content
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/```\s*([\s\S]*?)\s*```/g, '$1')
        .replace(/^•\s+/gm, '')
        .replace(/\n/g, ' ');
    
    const preview = cleanPreview.length > 120 
        ? cleanPreview.substring(0, 120) + '...' 
        : cleanPreview;
    
    item.innerHTML = `
        <div class="grid-title">${cheatsheet.title}</div>
        <div class="grid-preview">${preview}</div>
        <div class="grid-meta">
            <span>${cheatsheet.subject} • Задание ${cheatsheet.taskNumber}</span>
            <span>${date}</span>
        </div>
    `;
    
    item.addEventListener('click', () => viewCheatsheet(cheatsheet));
    cheatsheetGrid.appendChild(item);
}

// Просмотр шпаргалки
function viewCheatsheet(cheatsheet) {
    if (isMobileDevice() && !document.querySelector('.main-content').classList.contains('mobile-active')) {
        return;
    }
    currentView = 'view';
    
    // Обновляем данные
    viewTitle.textContent = cheatsheet.title;
    viewSubject.textContent = cheatsheet.subject;
    viewTask.textContent = `Задание ${cheatsheet.taskNumber}`;
    viewDate.textContent = formatDate(cheatsheet.updatedAt || cheatsheet.createdAt);
    
    // Форматируем содержимое
    const formattedContent = formatContent(cheatsheet.content);
    viewContent.innerHTML = formattedContent;
    
    // Сохраняем ID для редактирования/удаления
    cheatsheetView.dataset.id = cheatsheet.id;
    
    // Показываем режим просмотра
    showCheatsheetView();
    
    // Обновляем активный элемент в списке
    document.querySelectorAll('.cheatsheet-item, .grid-item').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.id === cheatsheet.id) {
            el.classList.add('active');
        }
    });
}


// Показать пустое состояние
function showEmptyState() {
    emptyState.style.display = 'flex';
    cheatsheetGrid.style.display = 'none';
    cheatsheetView.style.display = 'none';
    closeViewBtn.style.display = 'none';
}

function showListView() {
    if (isMobileDevice()) {
        return mobileShowListView();
    }
    currentView = 'list';
    emptyState.style.display = 'none';
    cheatsheetGrid.style.display = 'grid';
    cheatsheetView.style.display = 'none';
    // Проверяем, что closeViewBtn существует
    if (closeViewBtn) {
        closeViewBtn.style.display = 'none';
    }
}

// Показать просмотр шпаргалки
function showCheatsheetView() {
    emptyState.style.display = 'none';
    cheatsheetGrid.style.display = 'none';
    cheatsheetView.style.display = 'block';
    closeViewBtn.style.display = 'flex';
}

// Редактирование текущей шпаргалки
function editCurrentCheatsheet() {
    const cheatsheetId = cheatsheetView.dataset.id;
    const cheatsheet = cheatsheets.find(c => c.id === cheatsheetId);
    
    if (cheatsheet) {
        openEditModal(cheatsheet);
    }
}

// Удаление текущей шпаргалки


// Экспорт шпаргалок
function exportCheatsheets(cheatsheetsToExport = null) {
    const exportData = cheatsheetsToExport || cheatsheets;
    
    if (exportData.length === 0) {
        showToast('Нет шпаргалок для экспорта', 'warning');
        return;
    }
    
    const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        count: exportData.length,
        cheatsheets: exportData
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `шпаргалки_еге_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showToast(`Экспортировано ${exportData.length} шпаргалок`, 'success');
}
function exportSelectedCheatsheets(selectedIds) {
    if (!selectedIds || selectedIds.length === 0) {
        showToast('Не выбраны шпаргалки для экспорта', 'warning');
        return false;
    }
    
    // Фильтруем шпаргалки по выбранным ID
    const selectedCheatsheets = cheatsheets.filter(cheatsheet => 
        selectedIds.includes(cheatsheet.id)
    );
    
    if (selectedCheatsheets.length === 0) {
        showToast('Выбранные шпаргалки не найдены', 'error');
        return false;
    }
    
    // Создаем объект для экспорта
    const exportData = {
        version: '1.1',
        exportedAt: new Date().toISOString(),
        count: selectedCheatsheets.length,
        exportType: 'selected',
        selectedIds: selectedIds,
        cheatsheets: selectedCheatsheets
    };
    
    // Преобразуем в JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = `выбранные_шпаргалки_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Освобождаем память
    URL.revokeObjectURL(url);
    
    showToast(`Экспортировано ${selectedCheatsheets.length} выбранных шпаргалок`, 'success');
    return true;
}
function exportFilteredCheatsheets() {
    const filteredCheatsheets = getFilteredCheatsheets();
    
    if (filteredCheatsheets.length === 0) {
        showToast('Нет отфильтрованных шпаргалок для экспорта', 'warning');
        return false;
    }
    
    const exportData = {
        version: '1.1',
        exportedAt: new Date().toISOString(),
        count: filteredCheatsheets.length,
        exportType: 'filtered',
        filter: { ...currentFilter },
        cheatsheets: filteredCheatsheets
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `отфильтрованные_шпаргалки_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showToast(`Экспортировано ${filteredCheatsheets.length} отфильтрованных шпаргалок`, 'success');
    return true;
}


// Импорт шпаргалок
function importCheatsheets() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Проверяем формат
            let importedCheatsheets;
            if (data.cheatsheets && Array.isArray(data.cheatsheets)) {
                importedCheatsheets = data.cheatsheets;
            } else if (Array.isArray(data)) {
                importedCheatsheets = data;
            } else {
                throw new Error('Неверный формат файла');
            }
            
            // Добавляем новые ID
            importedCheatsheets.forEach(c => {
                c.id = Date.now() + Math.random().toString(36).substr(2, 9);
                if (!c.createdAt) c.createdAt = new Date().toISOString();
                if (!c.updatedAt) c.updatedAt = new Date().toISOString();
            });
            
            // Добавляем к существующим
            cheatsheets = [...importedCheatsheets, ...cheatsheets];
            saveToStorage();
            updateStats();
            renderCheatsheets();
            
            showToast(`Импортировано ${importedCheatsheets.length} шпаргалок`, 'success');
        } catch (error) {
            showToast('Ошибка при импорте файла', 'error');
        }
    };
    
    input.click();
}

// Переключение темы
function toggleTheme() {
    const isDark = !document.body.classList.contains('light-theme');
    
    if (isDark) {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Если сегодня
    if (diff < 86400000) {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Если вчера
    if (diff < 172800000) {
        return 'Вчера, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Старше
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Если сегодня
    if (diff < 86400000) {
        return 'сегодня';
    }
    
    // Если вчера
    if (diff < 172800000) {
        return 'вчера';
    }
    
    // Если на этой неделе
    if (diff < 604800000) {
        const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
        return days[date.getDay()];
    }
    
    // Старше
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
    });
}

// Обновление статистики


// Показать уведомление
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">${message}</div>
        <button class="toast-close">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Закрытие
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Сохраняем данные при закрытии вкладки
window.addEventListener('beforeunload', () => {
    if (contentTextarea.value.trim() && editingId && isEditModalOpen) {
        saveCheatsheet({ preventDefault: () => {} });
    }
});
// Функции для работы с экспортом
function openExportModal() {
    // Обновляем счетчики
    exportAllCount.textContent = cheatsheets.length;
    
    const filteredCheatsheets = getFilteredCheatsheets();
    exportFilteredCount.textContent = filteredCheatsheets.length;
    
    // Считаем только те выбранные, которые есть в отфильтрованных
    const filteredSelectedCount = Array.from(selectedCheatsheets).filter(id => 
        filteredCheatsheets.some(c => c.id === id)
    ).length;
    exportSelectedCount.textContent = filteredSelectedCount;
    
    // Заполняем чекбоксы
    populateExportCheckboxes();
    
    // Сбрасываем выбор типа экспорта
    if (exportAllRadio) exportAllRadio.checked = true;
    updateExportSelection();
    
    // Сбрасываем стили прокрутки
    const modalBody = exportModal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.classList.remove('scrollable');
    }
    
    // Показываем модальное окно
    exportModal.style.display = 'flex';
    setTimeout(() => {
        exportModal.style.opacity = '1';
    }, 10);
}

function closeExportModal() {
    // Проверяем, открыто ли окно
    if (exportModal.style.display !== 'flex') return;
    
    exportModal.style.opacity = '0';
    setTimeout(() => {
        exportModal.style.display = 'none';
        
        // Сбрасываем стили прокрутки
        const modalBody = exportModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.classList.remove('scrollable');
            modalBody.style.overflowY = '';
            modalBody.style.maxHeight = '';
        }
        
        // Сбрасываем стили блока выбора
        if (exportSelection) {
            exportSelection.style.maxHeight = '';
            exportSelection.style.overflowY = '';
        }
    }, 0);
}


// Обновляем функцию populateExportCheckboxes
function populateExportCheckboxes() {
    const filteredCheatsheets = getFilteredCheatsheets();
    
    if (!exportCheckboxes) return;
    
    exportCheckboxes.innerHTML = '';
    
    if (filteredCheatsheets.length === 0) {
        exportCheckboxes.innerHTML = '<div class="export-no-items">Нет шпаргалок для выбора</div>';
        return;
    }
    
    // Создаем контейнер для чекбоксов
    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.className = 'export-checkboxes-list';
    
    // Добавляем каждый чекбокс
    filteredCheatsheets.forEach(cheatsheet => {
        const checkboxItem = document.createElement('div');
        checkboxItem.className = 'export-checkbox-item';
        
        const isSelected = selectedCheatsheets.has(cheatsheet.id);
        if (isSelected) {
            checkboxItem.classList.add('selected');
        }
        
        const date = formatDateShort(cheatsheet.updatedAt || cheatsheet.createdAt);
        
        checkboxItem.innerHTML = `
            <input type="checkbox" id="export_${cheatsheet.id}" 
                   value="${cheatsheet.id}" ${isSelected ? 'checked' : ''}>
            <label for="export_${cheatsheet.id}" class="export-checkbox-content">
                <div class="export-checkbox-main">
                    <div class="export-checkbox-subject">${cheatsheet.subject}</div>
                    <div class="export-checkbox-title">${cheatsheet.title}</div>
                </div>
                <div class="export-checkbox-meta">
                    <span class="export-checkbox-task">${cheatsheet.taskNumber}</span>
                    <span class="export-checkbox-date">${date}</span>
                </div>
            </label>
        `;
        
        checkboxesContainer.appendChild(checkboxItem);
        
        // Обработчик клика на весь элемент
                // Обработчик клика на весь элемент
        checkboxItem.addEventListener('click', (e) => {
            const checkbox = checkboxItem.querySelector('input[type="checkbox"]');
            const label = checkboxItem.querySelector('label');
            
            // Проверяем, на какой элемент был клик
            const clickedElement = e.target;
            
            // Если кликнули на сам чекбокс
            if (clickedElement === checkbox) {
                // Ничего не делаем - событие change сработает автоматически
                return;
            }
            
            // Если кликнули на label или его дочерние элементы
            if (clickedElement === label || label.contains(clickedElement)) {
                // Клик на label автоматически изменит состояние связанного чекбокса
                // благодаря атрибуту for, поэтому ничего не делаем
                return;
            }
            
            // Если кликнули на сам элемент checkboxItem (но не на чекбокс и не на label)
            // Тогда переключаем чекбокс вручную
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        // Обработчик изменения чекбокса
        const checkbox = checkboxItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            if (checkbox.checked) {
                selectedCheatsheets.add(cheatsheet.id);
            
            } else {
                selectedCheatsheets.delete(cheatsheet.id);
            
            }
            updateExportCheckboxes();
            exportSelectedCount.textContent = selectedCheatsheets.size;
        });
    });
    
    // Создаем контейнер для кнопок
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'export-checkbox-actions';
    
    // Определяем, все ли отфильтрованные выбраны
    const allFilteredSelected = filteredCheatsheets.length > 0 && 
        filteredCheatsheets.every(c => selectedCheatsheets.has(c.id));
    
    actionsDiv.innerHTML = `
        <button type="button" class="btn-text" id="selectAllBtn">
            <i class="fas ${allFilteredSelected ? 'fa-square' : 'fa-check-square'}"></i> 
            ${allFilteredSelected ? 'Снять выделение' : 'Выбрать все'}
        </button>
        <button type="button" class="btn-text" id="selectFilteredBtn">
            <i class="fas fa-filter"></i> Только отфильтрованные
        </button>
    `;
    
    exportCheckboxes.appendChild(actionsDiv);
    exportCheckboxes.appendChild(checkboxesContainer);
    
    // Обработчики для кнопок
    document.getElementById('selectAllBtn').addEventListener('click', () => {
        const allCurrentlySelected = filteredCheatsheets.every(c => 
            selectedCheatsheets.has(c.id)
        );
        
        if (allCurrentlySelected) {
            // Снимаем выделение со всех отфильтрованных
            filteredCheatsheets.forEach(cheatsheet => {
                selectedCheatsheets.delete(cheatsheet.id);
            });
        } else {
            // Выбираем все отфильтрованные
            filteredCheatsheets.forEach(cheatsheet => {
                selectedCheatsheets.add(cheatsheet.id);
            });
        }
        updateExportCheckboxes();
        exportSelectedCount.textContent = selectedCheatsheets.size;
    });
    
    document.getElementById('selectFilteredBtn').addEventListener('click', () => {
        // Очищаем предыдущий выбор
        selectedCheatsheets.clear();
        // Выбираем только отфильтрованные
        filteredCheatsheets.forEach(cheatsheet => {
            selectedCheatsheets.add(cheatsheet.id);
        });
        updateExportCheckboxes();
        exportSelectedCount.textContent = selectedCheatsheets.size;
    });
}
function updateExportCheckboxes() {
    const checkboxes = exportCheckboxes.querySelectorAll('input[type="checkbox"]');
    const filteredCheatsheets = getFilteredCheatsheets();
    const allSelected = filteredCheatsheets.length > 0 && 
        filteredCheatsheets.every(c => selectedCheatsheets.has(c.id));
    
    // Обновляем кнопку "Выбрать все"
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
        selectAllBtn.innerHTML = `
            <i class="fas ${allSelected ? 'fa-square' : 'fa-check-square'}"></i> 
            ${allSelected ? 'Снять выделение' : 'Выбрать все'}
        `;
    }
    
    // Обновляем состояние всех чекбоксов
    checkboxes.forEach(checkbox => {
        const cheatsheetId = checkbox.value;
        // Проверяем, находится ли шпаргалка в отфильтрованном списке
        const isInFiltered = filteredCheatsheets.some(c => c.id === cheatsheetId);
        
        if (isInFiltered) {
            // Обновляем состояние чекбокса в соответствии с selectedCheatsheets
            checkbox.checked = selectedCheatsheets.has(cheatsheetId);
        }
        
        const checkboxItem = checkbox.closest('.export-checkbox-item');
        if (checkboxItem) {
            if (checkbox.checked) {
                checkboxItem.classList.add('selected');
            } else {
                checkboxItem.classList.remove('selected');
            }
        }
    });
}
function confirmExport() {
    if (exportAllRadio && exportAllRadio.checked) {
        // Экспорт всех шпаргалок
        exportCheatsheets(cheatsheets);
    } else if (exportFilteredRadio && exportFilteredRadio.checked) {
        // Экспорт отфильтрованных шпаргалок
        const filteredCheatsheets = getFilteredCheatsheets();
        if (filteredCheatsheets.length === 0) {
            showToast('Нет отфильтрованных шпаргалок для экспорта', 'warning');
            return;
        }
        exportCheatsheets(filteredCheatsheets);
    } else if (exportSelectedRadio && exportSelectedRadio.checked) {
        // Экспорт выбранных шпаргалок
        const checkboxes = exportCheckboxes.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            showToast('Выберите хотя бы одну шпаргалку для экспорта', 'warning');
            return;
        }
        
        const selectedIds = Array.from(checkboxes).map(cb => cb.value);
        const selectedCheatsheetsToExport = cheatsheets.filter(c => selectedIds.includes(c.id));
        
        exportCheatsheets(selectedCheatsheetsToExport);
    }
    
    closeExportModal();
}

function getFilteredCheatsheets() {
    return cheatsheets.filter(cheatsheet => {
        if (currentFilter.subject !== 'all' && cheatsheet.subject !== currentFilter.subject) {
            return false;
        }
        
        if (currentFilter.task !== 'all' && cheatsheet.taskNumber !== parseInt(currentFilter.task)) {
            return false;
        }
        
        if (currentFilter.search) {
            const searchText = currentFilter.search;
            const inTitle = cheatsheet.title.toLowerCase().includes(searchText);
            const inContent = cheatsheet.content.toLowerCase().includes(searchText);
            const inSubject = cheatsheet.subject.toLowerCase().includes(searchText);
            
            if (!inTitle && !inContent && !inSubject) {
                return false;
            }
        }
        
        return true;
    });
}
function updateExportSelection() {
    if (exportSelectedRadio && exportSelectedRadio.checked) {
        exportSelection.style.display = 'block';
        // Убираем фиксированную высоту и прокрутку у блока выбора
        exportSelection.style.maxHeight = 'none';
        exportSelection.style.overflowY = 'visible';
        
        // Добавляем прокрутку основному контенту модального окна
        const modalBody = exportModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.overflowY = 'auto';
            modalBody.style.maxHeight = 'calc(90vh)';
        }
    } else {
        exportSelection.style.display = 'none';
        // Восстанавливаем стили для других режимов
        exportSelection.style.maxHeight = '';
        exportSelection.style.overflowY = '';
        
        const modalBody = exportModal.querySelector('.modal-body');
        if (modalBody) {
            modalBody.style.overflowY = '';
            modalBody.style.maxHeight = '';
        }
    }
}
// ===== МОБИЛЬНАЯ АДАПТИВНОСТЬ =====

// Проверяем мобильное устройство
function isMobileDevice() {
    return window.innerWidth <= 768 
}
function updateCheatsheetListHeight() {
    if (!isMobileDevice()) return;
    
    const sidebar = document.querySelector('.sidebar');
    const header = document.querySelector('.sidebar-header');
    const btnNew = document.querySelector('.btn-new');
    const filters = document.querySelector('.filters');
    const footer = document.querySelector('.mobile-menu');
    const cheatsheetList = document.querySelector('.cheatsheet-list');
    
    if (sidebar && header && btnNew && filters && footer && cheatsheetList) {
        // Вычисляем использованную высоту
        const usedHeight = 
            header.offsetHeight + 
            btnNew.offsetHeight + 
            filters.offsetHeight + 
            footer.offsetHeight + 40; // 40px для отступов
        
        // Доступная высота
        const availableHeight = window.innerHeight - usedHeight;
        
        // Устанавливаем высоту списка
        cheatsheetList.style.maxHeight = `${Math.max(availableHeight, 100)}px`;
        cheatsheetList.style.height = `${Math.max(availableHeight, 100)}px`;
        
        // Принудительно обновляем прокрутку
        cheatsheetList.style.overflowY = 'auto';
    }
}
window.addEventListener('resize', function() {
    // Пересчитываем высоту списка
    setTimeout(updateCheatsheetListHeight, 100);
    
    // Обновляем отображение кнопок в зависимости от устройства
    const mobileMenu = document.querySelector('.mobile-menu');
    const sidebarFooter = document.querySelector('.sidebar-footer');
    
    if (mobileMenu && sidebarFooter) {
        if (isMobileDevice()) {
            mobileMenu.style.display = 'flex';
            sidebarFooter.style.display = 'none';
        } else {
            mobileMenu.style.display = 'none';
            sidebarFooter.style.display = 'flex';
        }
    }
});
// Обновляем функцию viewCheatsheet для мобильных
function mobileViewCheatsheet(cheatsheet) {
    if (!isMobileDevice()) return false;
    
    // Показываем main-content как модальное окно
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.add('mobile-active');
    
    // Меняем кнопку "Назад"
    const closeBtn = document.getElementById('closeViewBtn');
    closeBtn.classList.add('mobile-back-btn');
    
    // Показываем шпаргалку обычным способом
    viewCheatsheet(cheatsheet);
    
    // Прокручиваем к началу
    mainContent.scrollTo(0, 0);
    
    // Блокируем прокрутку body
    document.body.style.overflow = 'hidden';
    
    return true;
}

// Обновляем функцию showListView для мобильных
function mobileShowListView() {
    if (!isMobileDevice()) return false;
    
    // Скрываем main-content
    const mainContent = document.querySelector('.main-content');
    mainContent.classList.remove('mobile-active');
    
    // Возвращаем обычную кнопку
    const closeBtn = document.getElementById('closeViewBtn');
    closeBtn.classList.remove('mobile-back-btn');
    
    // Разблокируем прокрутку
    document.body.style.overflow = '';
    
    // Сбрасываем активные элементы
    document.querySelectorAll('.cheatsheet-item.active, .grid-item.active').forEach(el => {
        el.classList.remove('active');
    });
    
    return true;
}

// Обновляем обработчики кликов на шпаргалки
function setupMobileView() {
    if (!isMobileDevice() && closeViewBtn) {
        closeViewBtn.style.display = 'none';
    }
    // Делегирование событий для списка
    const cheatsheetList = document.getElementById('cheatsheetList');
    if (cheatsheetList) {
        cheatsheetList.addEventListener('click', function(e) {
            const cheatsheetItem = e.target.closest('.cheatsheet-item');
            if (!cheatsheetItem) return;
            
            const cheatsheetId = cheatsheetItem.dataset.id;
            const cheatsheet = cheatsheets.find(c => c.id === cheatsheetId);
            
            if (cheatsheet && isMobileDevice()) {
                e.preventDefault();
                e.stopPropagation();
                mobileViewCheatsheet(cheatsheet);
            }
        });
    }
    
    // Для сетки
    const cheatsheetGrid = document.getElementById('cheatsheetGrid');
    if (cheatsheetGrid) {
        cheatsheetGrid.addEventListener('click', function(e) {
            const gridItem = e.target.closest('.grid-item');
            if (!gridItem) return;
            
            const cheatsheetId = gridItem.dataset.id;
            const cheatsheet = cheatsheets.find(c => c.id === cheatsheetId);
            
            if (cheatsheet && isMobileDevice()) {
                e.preventDefault();
                e.stopPropagation();
                mobileViewCheatsheet(cheatsheet);
            }
        });
    }
    
    // Обновляем кнопку "Назад" для мобильных
    const closeViewBtn = document.getElementById('closeViewBtn');
    if (closeViewBtn) {
        closeViewBtn.addEventListener('click', function() {
            if (isMobileDevice() && document.querySelector('.main-content').classList.contains('mobile-active')) {
                mobileShowListView();
            }
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileDevice() && 
            document.querySelector('.main-content').classList.contains('mobile-active')) {
            mobileShowListView();
        }
    });
    
    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        if (!isMobileDevice() && document.querySelector('.main-content').classList.contains('mobile-active')) {
            mobileShowListView();
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Настраиваем мобильный вид
    setupMobileView();
    
    // Инициализируем высоту списка после небольшой задержки
    setTimeout(function() {
        updateCheatsheetListHeight();
        
        // Наблюдаем за изменениями в DOM для обновления высоты
        const observer = new MutationObserver(function() {
            setTimeout(updateCheatsheetListHeight, 50);
        });
        
        const cheatsheetList = document.querySelector('.cheatsheet-list');
        if (cheatsheetList) {
            observer.observe(cheatsheetList, { 
                childList: true, 
                subtree: true 
            });
        }
    }, 300); // Увеличиваем задержку для полной загрузки DOM
    
    // Скрываем кнопку закрытия просмотра на десктопах
    if (!isMobileDevice()) {
        const closeViewBtn = document.getElementById('closeViewBtn');
        if (closeViewBtn) {
            closeViewBtn.style.display = 'none';
        }
    }
});
