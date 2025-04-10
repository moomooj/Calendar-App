const STORAGE_KEY = "myTodoBoards";
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
    const todos = board.todos || [];
    if (date) map[date] = todos;
  });
  return map;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const todoMap = getTodoMap();

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

    const dateText = document.createElement("span");
    dateText.className = "date-num";
    dateText.textContent = day;
    cell.appendChild(dateText);

    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    ) {
      cell.classList.add("today");
    }

    const todos = todoMap[dateStr];
    if (todos && todos.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "todo-preview";

      todos.slice(0, 3).forEach((todo) => {
        const li = document.createElement("li");
        li.textContent = todo.text;
        ul.appendChild(li);
      });

      cell.appendChild(ul);
    }

    calendarDays.appendChild(cell);
  }
}

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();
