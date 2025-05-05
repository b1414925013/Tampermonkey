// bookmarks.js - 书签管理（获取、渲染、导出、导入）

function getFaviconUrl(bookmark) {
    if (bookmark.favicon) return bookmark.favicon;

    try {
        const url = new URL(bookmark.url);
        const origin = url.origin;
        const cacheKey = `favicon_${origin}`;

        const cachedIcon = localStorage.getItem(cacheKey);
        if (cachedIcon) return cachedIcon === "null" ? "" : cachedIcon;

        fetchFaviconAndCache(origin, cacheKey);
        return "";
    } catch (e) {
        return "";
    }
}

async function fetchFaviconAndCache(origin, cacheKey) {
    try {
        const response = await fetch(`${origin}/favicon.ico`, { method: 'HEAD', mode: 'no-cors' });
        localStorage.setItem(cacheKey, `${origin}/favicon.ico`);
    } catch (e) {
        localStorage.setItem(cacheKey, "null");
    }

    renderBookmarks(document.querySelector(".tabs button.active").dataset.tab);
}

function getBookmarksFromStorage() {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : getDefaultBookmarks();
}

function getDefaultBookmarks() {
    return {
        work: {
            label: "工作",
            links: [
                { name: "GitHub", url: "https://github.com" },
                { name: "百度", url: "https://www.baidu.com", favicon: "https://www.baidu.com/favicon.ico" }
            ]
        },
        life: {
            label: "生活",
            links: [
                { name: "知乎", url: "https://zhihu.com" }
            ]
        }
    };
}

function saveBookmarksToStorage(bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

let bookmarks = getBookmarksFromStorage();
let currentTab = "work";

function renderBookmarks(tabName) {
    const content = document.getElementById("tab-content");
    content.innerHTML = "";

    const tabData = bookmarks[tabName];
    if (tabData && Array.isArray(tabData.links)) {
        tabData.links.forEach(link => {
            const a = document.createElement("a");
            a.href = link.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            const icon = document.createElement("img");
            icon.className = "bookmark-icon";
            icon.src = link.favicon || "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.15.4/svgs/solid/bookmark.svg";
            icon.alt = "favicon";

            const text = document.createElement("span");
            text.textContent = link.name;

            a.appendChild(icon);
            a.appendChild(text);
            content.appendChild(a);
        });
    }
}

function renderTabs() {
    const tabNav = document.querySelector(".tabs");
    tabNav.innerHTML = "";

    Object.keys(bookmarks).forEach(tabName => {
        const btn = document.createElement("button");
        btn.dataset.tab = tabName;
        btn.textContent = bookmarks[tabName].label;
        btn.addEventListener("click", () => switchTab(tabName));

        tabNav.appendChild(btn);
    });

    switchTab(currentTab);
}

function setActiveTab(tabName) {
    document.querySelectorAll(".tabs button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
}

function switchTab(tabName) {
    currentTab = tabName;
    setActiveTab(tabName);
    renderBookmarks(tabName);
}

function exportBookmarks() {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importBookmarks(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (typeof imported === "object" && !Array.isArray(imported)) {
                bookmarks = imported;
                saveBookmarksToStorage(bookmarks);
                renderTabs();
                renderBookmarks(currentTab);
                alert("✅ 书签导入成功！");
            } else {
                alert("❌ 文件格式不正确");
            }
        } catch (error) {
            alert("❌ 解析失败：" + error.message);
        }
    };
    reader.readAsText(file);
}

function initBookmarks() {
    renderTabs();
    renderBookmarks("work");

    document.getElementById("export-bookmarks-btn")?.addEventListener("click", exportBookmarks);
    document.getElementById("import-bookmarks-input")?.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) importBookmarks(file);
    });
}