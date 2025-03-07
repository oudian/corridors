document.addEventListener("DOMContentLoaded", function () {
    const ghostImage = document.getElementById("ghostImage");
    const themeToggle = document.getElementById("themeToggle");

    // Ключи для localStorage
    const animationKey = "animationState_" + window.location.pathname.split("/").pop().replace(".html", "");
    const imageKey = "imageState_" + window.location.pathname.split("/").pop().replace(".html", "");

    // Начальные и конечные значения для анимации
    const initialTop = 40; // Начальное значение top (в %)
    const finalTop = 50;   // Конечное значение top (в %)
    const initialWidth = 80; // Начальное значение width (в px)
    const finalWidth = 140;   // Конечное значение width (в px)
    const duration = 10000;   // Длительность анимации (10 секунд)

    // Загружаем прогресс анимации и состояние изображения
    let animationProgress = parseFloat(localStorage.getItem(animationKey)) || 0;
    let isGhost = localStorage.getItem(imageKey) !== "girl";

    // Применяем начальное состояние изображения
    updateImage(isGhost);

    // Если анимация уже завершена, устанавливаем финальные значения
    if (animationProgress >= 1) {
        ghostImage.style.top = `${finalTop}%`;
        ghostImage.style.width = `${finalWidth}px`;
    } else {
        // Запускаем анимацию
        const startTime = Date.now() - animationProgress * duration;

        function animate() {
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            // Обновляем значения top и width
            const currentTop = initialTop + (finalTop - initialTop) * progress;
            const currentWidth = initialWidth + (finalWidth - initialWidth) * progress;

            ghostImage.style.top = `${currentTop}%`;
            ghostImage.style.width = `${currentWidth}px`;

            // Сохраняем прогресс в localStorage
            localStorage.setItem(animationKey, progress);

            // Если анимация не завершена, продолжаем
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        // Запускаем анимацию
        animate();
    }

        // Обработчик клика на лампу
        themeToggle.addEventListener("click", function () {
            if (!document.body.classList.contains("dark") && isGhost) {
                isGhost = false;
                localStorage.setItem(imageKey, "girl");
                updateImage(isGhost);
            }
        });

    function updateImage(isGhostVisible) {
        ghostImage.src = isGhostVisible ? "ghost.png" : "girl.png";
    }
});