// tabs.js - 标签页切换逻辑

function initTabs() {
  document.querySelectorAll(".tabs button").forEach(button => {
      button.addEventListener("click", () => {
          document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
          button.classList.add("active");

          const tab = button.getAttribute("data-tab");
          loadTabContent(tab);
      });
  });

  switchTab("work"); // 默认加载工作标签页
}

function switchTab(tabName) {
  document.querySelectorAll(".tabs button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
  });

  loadTabContent(tabName);
}

function loadTabContent(tabName) {
  // 示例：仅占位，实际由 bookmarks.js 加载书签内容
  console.log(`Switching to tab: ${tabName}`);
}