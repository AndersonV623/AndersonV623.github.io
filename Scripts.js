function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  if (menu.style.width === "250px") {
    menu.style.width = "0"; // cerrar
  } else {
    menu.style.width = "250px"; // abrir
  }
}

function showSection(id) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll("main section");
  sections.forEach(sec => sec.classList.remove("active"));

  // Mostrar la sección seleccionada
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
  }
}