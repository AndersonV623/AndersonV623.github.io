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

//--------------------------------------------------------------Funciones para SQUARE
function createDotSquare(containerId, percent) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const totalDots = 25;
    const filledDots = Math.round(totalDots * (percent / 100));

    // Crear todos los punticos
    const dots = [];
    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dots.push(dot);
    }

    // Insertar en orden de abajo hacia arriba
    let count = 0;
    for (let row = 4; row >= 0; row--) {
        for (let col = 0; col < 5; col++) {
            const index = row * 5 + col;
            if (count < filledDots) {
                dots[index].classList.add("filled");
                count++;
            }
            container.appendChild(dots[index]);
        }
    }
}

// Animación al hacer scroll
function createDotSquare(containerId, percent, colorClass) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const totalDots = 25;
  const filledDots = Math.round(totalDots * (percent / 100));

  const dots = [];
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    dots.push(dot);
  }

  let count = 0;
  for (let row = 4; row >= 0; row--) {
    for (let col = 0; col < 5; col++) {
      const index = row * 5 + col;
      if (count < filledDots) {
        dots[index].classList.add("filled", colorClass);
        count++;
      }
      container.appendChild(dots[index]);
    }
  }
}

function animateOnScroll(id, percent, percentId, colorClass) {
  const element = document.getElementById(id);
  const percentLabel = document.getElementById(percentId);

  let animated = false;
  window.addEventListener("scroll", () => {
    const rect = element.getBoundingClientRect();
    if (!animated && rect.top < window.innerHeight) {
      animated = true;
      let current = 0;
      const interval = setInterval(() => {
        if (current <= percent) {
          createDotSquare(id, current, colorClass);
          percentLabel.textContent = current + "%";
          current++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }
  });
}

animateOnScroll("Ciencia_De_Datos-square", 70, "Ciencia_De_Datos-percent", "bg-dark");
animateOnScroll("Python-square", 80, "Python-percent", "bg-primary");
animateOnScroll("SQL-square", 70, "SQL-percent", "bg-info");
animateOnScroll("Powerbi-square", 90, "Powerbi-percent", "bg-warning");
animateOnScroll("Excel-square", 95, "Excel-percent", "bg-success");
animateOnScroll("Access-square", 70, "Access-percent", "bg-danger");
animateOnScroll("ETL-square", 100, "ETL-percent", "bg-dark");
animateOnScroll("HTML-square", 80, "HTML-percent", "bg-info");
animateOnScroll("CSS-square", 70, "CSS-percent", "bg-primary");
animateOnScroll("JavaScript-square", 50, "JavaScript-percent", "bg-warning");
animateOnScroll("PHP-square", 50, "PHP-percent", "bg-danger");
animateOnScroll("Git_y_Github-square", 60, "Git_y_Github-percent", "bg-dark");