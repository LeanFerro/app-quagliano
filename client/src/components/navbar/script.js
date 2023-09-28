let darkModeIcon = document.querySelector("#darkMode-icon");
let fondotabla = document.querySelector(".p-datatable");

function toggleDarkMode() {
  if (darkModeIcon.classList.contains("bx-sun")) {
    darkModeIcon.classList.remove("bx-sun");
    darkModeIcon.classList.add("bx-moon");
    document.body.classList.add("dark-mode");
    fondotabla.style.background = 'URL("../img/q_trans1.png")';
  } else if (darkModeIcon.classList.contains("bx-moon")) {
    darkModeIcon.classList.remove("bx-moon");
    darkModeIcon.classList.add("bx-sun");
    document.body.classList.remove("dark-mode");
    fondotabla.style.background = 'URL("../img/ggg.png")';
  }
}
