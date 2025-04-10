const addBoardBtn = document.getElementById("add-board-btn");
const boardModal = document.getElementById("board-modal");
const boardForm = document.getElementById("board-form");
const cancelBoardBtn = document.getElementById("cancel-board");

const boardTitleInput = document.getElementById("board-title-input");
const boardDateInput = document.getElementById("board-date-input");
const boardContainer = document.getElementById("board-container");

const STORAGE_KEY = "myTodoBoards";
let draggedItem = null;

function loadBoards() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const boards = JSON.parse(saved);
    boards.forEach(createBoardFromData);
  }
}

function saveBoards() {
  const boards = [];
  document.querySelectorAll(".board").forEach((boardEl) => {
    const title = boardEl.querySelector("h3").textContent;
    const date = boardEl.querySelector("small").textContent;
    const todos = [];
    boardEl.querySelectorAll(".todo-item").forEach((todoEl) => {
      todos.push({
        text: todoEl.querySelector("span").textContent,
        done: todoEl.querySelector("span").classList.contains("done"),
      });
    });
    boards.push({ title, date, todos });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

function handleDragStart(e) {
  draggedItem = e.target;
  e.dataTransfer.effectAllowed = "move";
  setTimeout(() => {
    e.target.style.display = "none";
  }, 0);
}

function handleDragEnd(e) {
  e.target.style.display = "flex";
  draggedItem = null;
  saveBoards();
}

function handleDragOver(e) {
  e.preventDefault();
  const container = e.currentTarget;
  const afterElement = getDragAfterElement(container, e.clientY);
  if (!draggedItem || !container) return;
  if (afterElement == null) {
    container.appendChild(draggedItem);
  } else {
    container.insertBefore(draggedItem, afterElement);
  }
}

function handleDrop(e) {
  e.preventDefault();
  saveBoards();
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".todo-item:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

addBoardBtn.addEventListener("click", () => {
  boardModal.style.display = "flex";
});

cancelBoardBtn.addEventListener("click", () => {
  boardModal.style.display = "none";
  boardTitleInput.value = "";
  boardDateInput.value = "";
});

boardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = boardTitleInput.value.trim();
  const date = boardDateInput.value;
  if (!title) {
    alert("Please enter a board name!");
    return;
  }
  createBoardFromData({ title, date, todos: [] });
  boardModal.style.display = "none";
  boardTitleInput.value = "";
  boardDateInput.value = "";
  saveBoards();
});

function createBoardFromData(data) {
  const { title, date, todos } = data;
  const board = document.createElement("div");
  board.className = "board";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-board";
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => {
    board.remove();
    saveBoards();
  };

  const heading = document.createElement("h3");
  heading.textContent = title;

  const dateEl = document.createElement("small");
  dateEl.textContent = date;

  const ul = document.createElement("ul");
  ul.className = "todo-list";
  ul.addEventListener("dragover", handleDragOver);
  ul.addEventListener("drop", handleDrop);

  const todoForm = document.createElement("form");
  todoForm.className = "todo-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Add a task to ${title}`;
  input.required = true;

  todoForm.appendChild(input);
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") return;
    addTodoItem(ul, text, false);
    input.value = "";
    saveBoards();
  });

  board.appendChild(closeBtn);
  board.appendChild(heading);
  board.appendChild(dateEl);
  board.appendChild(todoForm);
  board.appendChild(ul);
  boardContainer.appendChild(board);

  todos.forEach((todo) => addTodoItem(ul, todo.text, todo.done));
}

function addTodoItem(ul, text, done) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.id = `todo-${Date.now()}`;
  li.draggable = true;

  const span = document.createElement("span");
  span.textContent = text;
  if (done) span.classList.add("done");

  const btnContainer = document.createElement("div");
  btnContainer.style.display = "flex";
  btnContainer.style.gap = "6px";
  btnContainer.style.marginLeft = "auto";

  const checkBtn = document.createElement("button");
  checkBtn.type = "button";
  checkBtn.textContent = "✔️";
  checkBtn.onclick = () => {
    span.classList.toggle("done");
    saveBoards();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.textContent = "❌";
  deleteBtn.onclick = () => {
    li.remove();
    saveBoards();
  };

  btnContainer.appendChild(checkBtn);
  btnContainer.appendChild(deleteBtn);
  li.appendChild(span);
  li.appendChild(btnContainer);

  li.addEventListener("dragstart", handleDragStart);
  li.addEventListener("dragend", handleDragEnd);

  ul.appendChild(li);
}

loadBoards();
