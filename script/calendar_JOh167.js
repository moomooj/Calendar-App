const STORAGE_KEY = "myTodoBoards";
const STUDY_LOG_KEY = "studyAppState";
const calendarDays = document.getElementById("calendar-days");
const monthYear = document.getElementById("month-year");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentDate = new Date();

function getTodoMap() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  const boards = JSON.parse(raw);
  const map = {};
  boards.forEach((board) => {
    const date = board.date;
    if (!map[date]) map[date] = [];
    map[date].push(board);
  });
  return map;
}

function getFormattedHourMin(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function getFormattedFullTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  //return `${h} H ${m} M ${s} S`;

  return `Study Time : ${h !== "00" ? h + " hrs, " : ""} ${
    m !== "00" ? m + " min, " : ""
  } ${s !== "00" ? s + " sec. " : ""}`;
}

function getStudyLog() {
  return JSON.parse(localStorage.getItem(STUDY_LOG_KEY) || "{}");
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const todoMap = getTodoMap();
  const studyLog = getStudyLog();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  monthYear.textContent = `${monthNames[month]} ${year}`;
  document.querySelectorAll(".calendar-cell").forEach((el) => el.remove());

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendar-cell";
    calendarDays.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    cell.dataset.date = dateStr;

    const dateText = document.createElement("span");
    dateText.className = "date-num";
    dateText.textContent = day;
    cell.appendChild(dateText);

    const boards = todoMap[dateStr];
    if (boards && boards.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "todo-preview";
      boards.slice(0, 2).forEach((board) => {
        const li = document.createElement("li");
        li.textContent = board.title;
        ul.appendChild(li);
      });
      cell.appendChild(ul);
    }

    const seconds = studyLog[dateStr] || 0;
    if (seconds > 0) {
      const timeEl = document.createElement("div");
      timeEl.className = "study-time-label";
      timeEl.textContent = `${getFormattedHourMin(seconds)}`;
      cell.appendChild(timeEl);
    }

    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    ) {
      cell.classList.add("today");
    }

    cell.addEventListener("click", () => {
      showTodoModal(dateStr);
    });

    calendarDays.appendChild(cell);
  }
}

function showTodoModal(dateStr) {
  const modal = document.getElementById("todo-modal");
  const body = document.getElementById("modal-body");
  const boards = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const matchedBoards = boards.filter((b) => b.date === dateStr);

  let html = `<h2>
    <span id="modal-date-text">${dateStr}</span>
    <span class="modal-study-time">${getFormattedFullTime(
      getStudyLog()[dateStr] || 0
    )}</span>
  </h2>`;

  if (matchedBoards.length === 0) {
    html += `
     <div class="noTodo">
        <p>No To-Do found</p>
        <a href="page2_JOh167.html">👉 Go to To-Do List</a>
        <p>Want to Study?</p>
        <a href="page3_JOh167.html">👉 Go to Study Timer</a>
      </div>
    `;
  } else {
    matchedBoards.forEach((board) => {
      const todos = board.todos || [];
      const todoItems = todos
        .map((todo) => {
          const className = todo.done ? "done" : "";
          return `<li class="${className}">${todo.text}</li>`;
        })
        .join("");
      html += `
        <div class="board-block">
          <strong>${board.title}</strong>
          <ul>${todoItems}</ul>
        </div>
      `;
    });
  }

  body.innerHTML = html;
  modal.style.display = "flex";
}

document.getElementById("modal-close").onclick = () => {
  document.getElementById("todo-modal").style.display = "none";
};

window.addEventListener("click", (e) => {
  const modal = document.getElementById("todo-modal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
