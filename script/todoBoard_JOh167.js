// ✅ todoBoard_JOh167.js 통합 버전 (체크버튼 + 삭제 + 드래그앤드롭 + 순서변경 + 버튼정렬 개선)

const addBoardBtn = document.getElementById("add-board-btn");
const boardModal = document.getElementById("board-modal");
const boardForm = document.getElementById("board-form");
const cancelBoardBtn = document.getElementById("cancel-board");

const boardTitleInput = document.getElementById("board-title-input");
const boardDateInput = document.getElementById("board-date-input");
const boardContainer = document.getElementById("board-container");

let draggedItem = null;

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
    alert("보드 이름을 입력하세요!");
    return;
  }

  const board = document.createElement("div");
  board.className = "board";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close-board";
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => board.remove();

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
  input.placeholder = `${title} 을/를 추가해보세요!`;
  input.required = true;

  todoForm.appendChild(input);
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "") return;

    const li = document.createElement("li");
    li.className = "todo-item";
    li.id = `todo-${Date.now()}`;
    li.draggable = true;

    const span = document.createElement("span");
    span.textContent = text;

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "6px";
    btnContainer.style.marginLeft = "auto";

    const checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.textContent = "✔️";
    checkBtn.onclick = () => {
      span.classList.toggle("done");
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => li.remove();

    btnContainer.appendChild(checkBtn);
    btnContainer.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnContainer);

    li.addEventListener("dragstart", handleDragStart);
    li.addEventListener("dragend", handleDragEnd);

    ul.appendChild(li);
    input.value = "";
  });

  board.appendChild(closeBtn);
  board.appendChild(heading);
  board.appendChild(dateEl);
  board.appendChild(todoForm);
  board.appendChild(ul);
  boardContainer.appendChild(board);

  boardModal.style.display = "none";
  boardTitleInput.value = "";
  boardDateInput.value = "";
});
