// settings.js - 设置弹窗控制与数据导入导出

function initSettingsModal() {
    const settingsBtn = document.getElementById("settings-btn");
    const modal = document.getElementById("settings-modal");
    const closeBtn = document.querySelector(".modal .close");

    settingsBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // 导出待办数据
    document.getElementById("export-todos-btn")?.addEventListener("click", () => {
        const todos = getTodosFromStorage();
        const dataStr = JSON.stringify(todos, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "todos.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    // 导入待办数据
    document.getElementById("import-todos-input")?.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const contents = e.target.result;
                const importedTodos = JSON.parse(contents);
                if (Array.isArray(importedTodos)) {
                    localStorage.setItem("todos", JSON.stringify(importedTodos));
                    alert("✅ 数据导入成功！");
                    renderTodos();
                } else {
                    alert("❌ 文件内容格式不正确");
                }
            } catch (err) {
                alert("❌ 读取或解析文件失败：" + err.message);
            }
        };

        reader.readAsText(file);
    });
}