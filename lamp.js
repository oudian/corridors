document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const lampOnSound = document.getElementById("lampOnSound");
    const lampOffSound = document.getElementById("lampOffSound");

    // Ключ для localStorage (используем полный путь)
    const themeKey = "theme_" + window.location.pathname;

    // Определяем текущую страницу
    const currentPage = window.location.pathname;

    // Страницы, где по умолчанию тёмная тема
    const darkThemePages = ["/6/6/6/c.html", "/6/6/6/g/g.html"];

    // Загружаем состояние темы из localStorage
    let isDark = localStorage.getItem(themeKey);

    // Если состояние темы не сохранено, устанавливаем по умолчанию
    if (isDark === null) {
        isDark = darkThemePages.includes(currentPage); // Тёмная тема для указанных страниц
    } else {
        isDark = isDark === "true"; // Восстанавливаем из localStorage
    }

    // Применяем начальное состояние темы
    document.body.classList.toggle("dark", isDark);

    // Обработчик клика на лампу
    themeToggle.addEventListener("click", function (e) {
        isDark = !isDark;
        document.body.classList.toggle("dark", isDark);
        localStorage.setItem(themeKey, isDark);

        if (isDark) {
            if (lampOffSound) lampOffSound.play();
        } else {
            if (lampOnSound) lampOnSound.play();
        }
    });
});