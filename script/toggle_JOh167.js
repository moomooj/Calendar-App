const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.querySelector(".sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
  if (sidebar.classList.contains("closed")) {
    toggleBtn.textContent = "☰";
  } else {
    toggleBtn.textContent = "X";
  }
});
