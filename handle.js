document.addEventListener("DOMContentLoaded", function () {
    const handles = document.querySelectorAll(".handle");
    const openSound = document.getElementById("openSound");
    const closedSound = document.getElementById("closedSound");

    handles.forEach((handle) => {
        handle.addEventListener("click", function (e) {
            e.stopPropagation();
            const index = parseInt(handle.dataset.handleIndex, 10);
            const targetPage = handle.dataset.page;

            if (index === 3) {
                if (document.cookie.indexOf("accessGranted") === -1) {
                    closedSound.play();
                    return;
                }
            }
            if (index === 6) {
                if (!document.body.classList.contains("dark")) {
                    closedSound.play();
                    return;
                }
            }
            openSound.play();
            openSound.onended = function () {
                window.location.href = targetPage;
            };
        });
    });
});