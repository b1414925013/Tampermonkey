// todo.js - 待办事项逻辑

function initTodo() {
  const addBtn = document.getElementById("todo-add-btn");
  const input = document.getElementById("todo-input");

  addBtn.addEventListener("click", addTodo);
  input.addEventListener("keypress", e => {
      if (e.key === "Enter") addBtn.click();
  });

  renderTodos();

  document.getElementById("today-btn")?.addEventListener("click", () => setView("today"));
  document.getElementById("week-btn")?.addEventListener("click", () => setView("week"));
  document.getElementById("all-btn")?.addEventListener("click", () => setView("all"));

  window.renderTodos = renderTodos;
}

function getLocalISOString(date = new Date()) {
  const offset = date.getTimezoneOffset();
  const localTime = new Date(date.getTime() - offset * 60 * 1000);
  return localTime.toISOString().slice(0, 19);
}

function isToday(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
  );
}

function isThisWeek(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (24 * 60 * 60 * 1000));
  return diffDays >= 0 && diffDays < 7;
}

function getTodosFromStorage() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodosToStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  const text = document.getElementById("todo-input").value.trim();
  const dueDate = document.getElementById("todo-due-date").value;
  if (!text) return;

  const todos = getTodosFromStorage();
  todos.push({ text, completed: false, createdAt: getLocalISOString(), dueDate });
  saveTodosToStorage(todos);
  document.getElementById("todo-input").value = "";
  document.getElementById("todo-due-date").value = "";
  renderTodos();
}

function renderTodos() {
  const list = document.getElementById("todo-list");
  const archiveList = document.getElementById("archive-list");
  list.innerHTML = "";
  archiveList.innerHTML = "";

  const todos = getTodosFromStorage();
  const now = new Date();

  todos.forEach((todo, index) => {
      let show = true;
      if (currentView === "today" && !isToday(todo.createdAt)) return;
      if (currentView === "week" && !isThisWeek(todo.createdAt)) return;

      const li = document.createElement("li");
      li.className = "todo-item";
      if (todo.completed) li.classList.add("completed");

      // 过期判断 + 合法性检查
      let isOverdue = false;
      if (todo.dueDate) {
          const dueDate = new Date(todo.dueDate);
          if (!isNaN(dueDate.getTime())) { // 确保是合法日期
              isOverdue = !todo.completed && dueDate < now;
          }
      }

      const span = document.createElement("span");
        span.textContent = isOverdue ? `${todo.text} ⏰ 已过期` : todo.text;
        span.addEventListener("click", () => toggleTodo(index));

      const delBtn = document.createElement("button");
      delBtn.textContent = "×";
      delBtn.className = "todo-delete-btn";
      delBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteTodo(index);
      });

      li.appendChild(span);
      li.appendChild(delBtn);

      if (todo.completed) {
          archiveList.appendChild(li);
      } else {
          list.appendChild(li);
      }

      // 添加 overdue 类用于样式区分
      if (isOverdue) {
        li.classList.add("overdue");
    }
  });
}

function toggleTodo(index) {
  const todos = getTodosFromStorage();
  todos[index].completed = !todos[index].completed;
  saveTodosToStorage(todos);
  renderTodos();
}

function deleteTodo(index) {
  const todos = getTodosFromStorage();
  todos.splice(index, 1);
  saveTodosToStorage(todos);
  renderTodos();
}

let currentView = "today";

function setView(view) {
  currentView = view;
  document.querySelectorAll(".view-toggle button").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`${view}-btn`).classList.add("active");
  renderTodos();
}