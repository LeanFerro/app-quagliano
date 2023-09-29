export const handleDarkModeToggle = (isDarkMode) => {
  const datatable = document.querySelector(".p-datatable");
  const tds = document.querySelectorAll("td");
  const nombEmp = document.querySelector(".nomb-emp");
  if (datatable) {
    if (isDarkMode) {
      datatable.classList.add("light-bg");
      tds.forEach((td) => td.classList.add("dark-text-color"));
      nombEmp.classList.add("nomb-emp-dark");
    } else {
      datatable.classList.remove("light-bg");
      tds.forEach((td) => td.classList.remove("dark-text-color"));
      nombEmp.classList.remove("nomb-emp-dark");
    }
  }
};
