document.addEventListener("DOMContentLoaded", function() {
    const backButton = document.getElementById("backButton");

    function updateButtonSize() {
        const scale = Math.min(window.innerWidth / 1000, window.innerHeight / 1000);
        backButton.style.transform = `translateX(-50%) scale(${scale})`;
    }

    window.addEventListener("resize", updateButtonSize);
    window.addEventListener("scroll", updateButtonSize);

    updateButtonSize(); 

    backButton.addEventListener("click", function() {
        const currentUrl = new URL(window.location.href);
        const segments = currentUrl.pathname.split("/").filter(segment => segment !== "");
        
        if (segments.length < 2) {
            window.location.href = "/index.html";
            return;
        }
        
        const newSegments = segments.slice(0, -2);
        
        if (newSegments.length === 0) {
            window.location.href = "/index.html";
        } else {
            const newPath = "/" + newSegments.join("/") + "/c.html";
            window.location.href = newPath;
        }
    });
});