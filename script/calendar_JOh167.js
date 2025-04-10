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
    const count = board.todos?.length || 0;
    if (date) map[date] = count;
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
    cell.textContent = day;

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    ) {
      cell.classList.add("today");
    }

    if (todoMap[dateStr]) {
      cell.classList.add("has-task");
      cell.setAttribute("data-task", todoMap[dateStr]);
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
