document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryModal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImg');
    const imgDescription = document.getElementById('imgDescription');
    const closeBtn = document.querySelector('.close-btn');

    // Создаем элементы галереи
    galleryImages.forEach(img => {
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'gallery-item';
        
        const imgElement = document.createElement('img');
        imgElement.src = img.src;
        imgElement.alt = "Картина из галереи";
        
        imgWrapper.appendChild(imgElement);
        galleryGrid.appendChild(imgWrapper);

        // Обработчик клика
        imgElement.addEventListener('click', () => {
            modalImg.src = img.src;
            imgDescription.textContent = img.description;
            galleryModal.style.display = 'block';
        });
    });

    // Закрытие модального окна
    closeBtn.onclick = () => galleryModal.style.display = 'none';
    window.onclick = (e) => e.target === galleryModal && (galleryModal.style.display = 'none');
});
// gallery.js
document.getElementById('back-btn').addEventListener('click', () => {
    // Сохраняем состояние перед переходом
    localStorage.setItem('shouldShowResults', 'true');
    window.history.back(); // Возврат с сохранением состояния
});