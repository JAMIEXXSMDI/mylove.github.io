document.addEventListener('DOMContentLoaded', function() {
    console.log('Открытка для Лики загружена! 💕');
    
    // ===== 1. КОНФЕТТИ =====
    const confettiContainer = document.querySelector('.confetti-container');
    const confettiSound = document.getElementById('confettiSound');
    
    function createConfetti() {
        const colors = ['#ff6b9d', '#c44dff', '#4facfe', '#ff9a9e', '#fad0c4', '#ffd89b', '#e8907a'];
        const confettiCount = 80;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.setProperty('--c', colors[Math.floor(Math.random() * colors.length)]);
            confetti.style.opacity = Math.random() + 0.5;
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Автоконфетти при загрузке
    setTimeout(createConfetti, 800);
    
    // ===== 2. ПЕРЕКЛЮЧЕНИЕ ФОТО В БОЛЬШОМ КРУГЕ =====
    const photoFrame = document.getElementById('photoFrame');
    const photos = document.querySelectorAll('.big-circle-photo');
    const photoTitles = document.querySelectorAll('.photo-title');
    
    console.log('photoFrame найден:', !!photoFrame);
    console.log('Фото найдено:', photos.length);
    console.log('Подписи найдены:', photoTitles.length);
    
    if (photos.length >= 2 && photoFrame) {
        let isAnimating = false;
        let clickCount = 0;
        
        // Убедимся, что только первое фото активно
        photos.forEach((photo, index) => {
            if (index === 0) {
                photo.classList.add('active');
            } else {
                photo.classList.remove('active');
            }
        });
        
        // И подписи тоже
        photoTitles.forEach((title, index) => {
            if (index === 0) {
                title.classList.add('active');
            } else {
                title.classList.remove('active');
            }
        });
        
        function switchPhoto() {
            if (isAnimating) {
                console.log('Анимация ещё идёт, ждём...');
                return;
            }
            
            isAnimating = true;
            clickCount++;
            
            console.log('Переключаем фото! Клик #' + clickCount);
            
            // Анимация нажатия
            photoFrame.style.transform = 'scale(0.95)';
            
            // Звук переключения
            if (confettiSound) {
                confettiSound.currentTime = 0;
                confettiSound.volume = 0.2;
                confettiSound.play().catch(e => {});
            }
            
            // Находим текущее активное фото и подпись
            const currentActivePhoto = document.querySelector('.big-circle-photo.active');
            const currentActiveTitle = document.querySelector('.photo-title.active');
            
            if (!currentActivePhoto) {
                console.error('Активное фото не найдено!');
                isAnimating = false;
                return;
            }
            
            // Определяем индекс следующего фото
            let nextIndex = 0;
            for (let i = 0; i < photos.length; i++) {
                if (photos[i] === currentActivePhoto) {
                    nextIndex = (i + 1) % photos.length;
                    break;
                }
            }
            
            console.log('Текущий индекс:', Array.from(photos).indexOf(currentActivePhoto), '→ Следующий:', nextIndex);
            
            // Скрываем текущее фото и подпись
            currentActivePhoto.classList.remove('active');
            if (currentActiveTitle) {
                currentActiveTitle.classList.remove('active');
            }
            
            // Показываем следующее фото и подпись
            setTimeout(() => {
                if (photos[nextIndex]) {
                    photos[nextIndex].classList.add('active');
                } else {
                    console.error('Фото с индексом ' + nextIndex + ' не найдено!');
                }
                
                if (photoTitles[nextIndex]) {
                    photoTitles[nextIndex].classList.add('active');
                }
                
                // Запускаем конфетти каждый 3-й раз
                if (clickCount % 3 === 0) {
                    createConfetti();
                }
                
                isAnimating = false;
                console.log('Переключение завершено!');
            }, 300);
            
            // Возвращаем рамку в исходное состояние
            setTimeout(() => {
                photoFrame.style.transform = '';
            }, 500);
        }
        
        // Клик по рамке
        photoFrame.addEventListener('click', function(e) {
            console.log('Клик по photoFrame');
            switchPhoto();
        });
        
        // Клик по самим фото
        photos.forEach(photo => {
            photo.addEventListener('click', function(e) {
                console.log('Клик по фото');
                e.stopPropagation();
                switchPhoto();
            });
        });
        
        console.log('Переключение фото в круге настроено!');
        
    } else {
        console.error('Ошибка: не найдены все необходимые элементы для переключения фото!');
        console.log('photoFrame:', photoFrame);
        console.log('photos:', photos);
        console.log('photoTitles:', photoTitles);
    }
    
    // ===== 3. ИНТЕРАКТИВНАЯ ФОТО-ГАЛЕРЕЯ =====
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function initGallery() {
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === 0);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === 0);
            });
        }
        
        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            slides[currentSlide].classList.remove('active');
            slides[index].classList.add('active');
            
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentSlide = index;
            
            if (confettiSound) {
                confettiSound.currentTime = 0;
                confettiSound.volume = 0.1;
                confettiSound.play().catch(e => {});
            }
            
            if ((currentSlide + 1) % 3 === 0) {
                setTimeout(createConfetti, 300);
            }
        }
        
        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }
        
        initGallery();
        
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });
        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
        
        dots.forEach(dot => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                goToSlide(parseInt(this.getAttribute('data-index')));
            });
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); }
        });
    }
});