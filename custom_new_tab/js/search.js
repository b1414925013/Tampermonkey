// search.js - 搜索功能

function initSearch() {
    const searchBtn = document.getElementById("search-btn");
    const searchInput = document.getElementById("search-input");

    searchBtn.addEventListener("click", function () {
        const query = searchInput.value.trim();
        const engineBase = document.getElementById("engine-selector").value;

        if (query) {
            const searchUrl = engineBase + encodeURIComponent(query);
            window.open(searchUrl, "_blank");
        }
    });

    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchBtn.click();
        }
    });
}