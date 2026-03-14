const STORAGE_KEY = "todos";
const THEME_KEY = "theme";

// Theme setup
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem(THEME_KEY) ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
document.documentElement.setAttribute("data-theme", savedTheme);
themeToggle.textContent = savedTheme === "dark" ? "\u2600" : "\u263E";

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_KEY, next);
  themeToggle.textContent = next === "dark" ? "\u2600" : "\u263E";
});

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentFilter = "all";

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const itemCount = document.getElementById("itemCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const footer = document.getElementById("footer");
const filterBtns = document.querySelectorAll(".filter-btn");

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getFilteredTodos() {
  if (currentFilter === "active") return todos.filter((t) => !t.completed);
  if (currentFilter === "completed") return todos.filter((t) => t.completed);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No todos yet. Add one above!</li>';
    footer.classList.add("hidden");
    return;
  }

  footer.classList.remove("hidden");

  if (filtered.length === 0) {
    todoList.innerHTML = '<li class="empty-state">No matching todos</li>';
  } else {
    filtered.forEach((todo) => {
      const li = document.createElement("li");
      li.className = "todo-item" + (todo.completed ? " completed" : "");

      const checkbox = document.createElement("div");
      checkbox.className = "todo-checkbox";
      checkbox.addEventListener("click", () => toggleTodo(todo.id));

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "todo-delete";
      deleteBtn.textContent = "\u00d7";
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      li.append(checkbox, text, deleteBtn);
      todoList.appendChild(li);
    });
  }

  const activeCount = todos.filter((t) => !t.completed).length;
  itemCount.textContent = activeCount === 1 ? "1 item left" : `${activeCount} items left`;

  const hasCompleted = todos.some((t) => t.completed);
  clearCompletedBtn.style.visibility = hasCompleted ? "visible" : "hidden";
}

function addTodo(text) {
  todos.unshift({ id: Date.now(), text: text.trim(), completed: false });
  saveTodos();
  render();
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  }
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function clearCompleted() {
  todos = todos.filter((t) => !t.completed);
  saveTodos();
  render();
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (text) {
    addTodo(text);
    todoInput.value = "";
    todoInput.focus();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

clearCompletedBtn.addEventListener("click", clearCompleted);

render();
