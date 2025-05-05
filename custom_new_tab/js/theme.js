// theme.js - 主题切换逻辑

function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") enableDarkMode();
    else if (isNightTime()) enableDarkMode();
    else disableDarkMode();

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        toggleBtn.textContent = isDark ? "🌙" : "☀️";
    });
}

function enableDarkMode() {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-toggle").textContent = "☀️";
}

function disableDarkMode() {
    document.body.classList.remove("dark-mode");
    document.getElementById("theme-toggle").textContent = "🌙";
}

function isNightTime() {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 7;
}