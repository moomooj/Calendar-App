const STORAGE_KEY = "studyAppState";

const stopwatchTab = document.getElementById("stopwatch-tab");
const timerTab = document.getElementById("timer-tab");
const stopwatchPanel = document.getElementById("stopwatch-panel");
const timerPanel = document.getElementById("timer-panel");

stopwatchTab.addEventListener("click", () => {
  stopwatchTab.classList.add("active");
  timerTab.classList.remove("active");
  stopwatchPanel.classList.add("active");
  timerPanel.classList.remove("active");
});

timerTab.addEventListener("click", () => {
  timerTab.classList.add("active");
  stopwatchTab.classList.remove("active");
  timerPanel.classList.add("active");
  stopwatchPanel.classList.remove("active");
});

const stopwatchDisplay = document.getElementById("stopwatch-display");
let stopwatchTime = 0;
let stopwatchInterval = null;

function updateStopwatchDisplay() {
  const hrs = String(Math.floor(stopwatchTime / 3600)).padStart(2, "0");
  const mins = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, "0");
  const secs = String(stopwatchTime % 60).padStart(2, "0");
  stopwatchDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

document.getElementById("start-stopwatch").addEventListener("click", () => {
  if (!stopwatchInterval) {
    stopwatchInterval = setInterval(() => {
      stopwatchTime++;
      updateStopwatchDisplay();
    }, 1000);
  }
});

document.getElementById("pause-stopwatch").addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
});

document.getElementById("reset-stopwatch").addEventListener("click", () => {
  if (stopwatchTime > 0) {
    saveStudySeconds(stopwatchTime);
  }
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchTime = 0;
  updateStopwatchDisplay();
});

updateStopwatchDisplay();

const timerDisplay = document.getElementById("timer-display");
let timerInterval = null;
let remainingSeconds = 0;
let timerOriginalSeconds = 0;

function updateTimerDisplay() {
  const hrs = String(Math.floor(remainingSeconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const secs = String(remainingSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

document.getElementById("start-timer").addEventListener("click", () => {
  if (timerInterval) return;

  const inputHr = parseInt(document.getElementById("hours").value) || 0;
  const inputMin = parseInt(document.getElementById("minutes").value) || 0;
  const inputSec = parseInt(document.getElementById("seconds").value) || 0;
  if (inputHr === 0 && inputMin === 0 && inputSec === 0) return;

  timerOriginalSeconds = inputHr * 3600 + inputMin * 60 + inputSec;
  remainingSeconds = timerOriginalSeconds;

  document.getElementById("timer-inputs").style.display = "none";

  timerInterval = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      saveStudySeconds(timerOriginalSeconds);
      alert("Time's up!");
    }
  }, 1000);
  updateTimerDisplay();
});

document.getElementById("pause-timer").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

document.getElementById("reset-timer").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;

  const usedTime = timerOriginalSeconds - remainingSeconds;
  if (usedTime > 0) {
    saveStudySeconds(usedTime);
  }

  remainingSeconds = 0;
  updateTimerDisplay();
  document.getElementById("timer-inputs").style.display = "flex";
});

updateTimerDisplay();

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function saveStudySeconds(seconds) {
  const key = getTodayKey();
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  if (!data[key]) data[key] = 0;
  data[key] += seconds;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  updateTotalTimeDisplay();
}

function getTotalTodaySeconds() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  return data[getTodayKey()] || 0;
}

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

function updateTotalTimeDisplay() {
  const el = document.getElementById("total-time-display");
  const total = getTotalTodaySeconds();
  el.textContent = `Today's Total Study Time: ${formatTime(total)}`;
}

updateTotalTimeDisplay();

setInterval(() => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const today = getTodayKey();
  data[today] = getTotalTodaySeconds();
  data.stopwatch = {
    seconds: stopwatchTime,
    running: !!stopwatchInterval,
  };
  data.timer = {
    original: timerOriginalSeconds,
    remaining: remainingSeconds,
    running: !!timerInterval,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}, 60000);
