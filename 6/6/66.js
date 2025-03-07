document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const lampBrokeSound = document.getElementById("lampBrokeSound"); 

    themeToggle.addEventListener("click", function (e) {
        lampBrokeSound.play();
    });
});