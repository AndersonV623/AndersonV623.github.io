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

/*-----Consulta municpios y departamentos del DANE para lista desplegable*/
const url = "https://ags.esri.co/arcgis/rest/services/DatosAbiertos/SERVICIOS_PUBLICOS_2005_MPIO/MapServer/0/query?where=1%3D1&outFields=DEPTO,DPTO_CCDGO,MPIO_CCDGO,MPIO_CNMBR&outSR=4326&f=json";
fetch(url)
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById("municipios");

    // Ordenar por nombre de municipio
    const municipiosOrdenados = data.features.sort((a, b) => {
      return a.attributes.MPIO_CNMBR.localeCompare(b.attributes.MPIO_CNMBR);
    });

    municipiosOrdenados.forEach(item => {
      const attr = item.attributes;
      const option = document.createElement("option");
      option.value = attr.MPIO_CCDGO;
      option.textContent = `${attr.MPIO_CNMBR} (${attr.DEPTO})`;
      select.appendChild(option);
    });

    // Inicializar Select2
    $('#municipios').select2({
      placeholder: "Busca tu municipio...",
      allowClear: true
    });
  });

/*-----------------------------Chekboxes----------------------------------------*/
  
document.addEventListener(
  "change", () => {
    const seleccionados = document.querySelectorAll(
      'input[name="musica"]:checked'
    );
    if (
      seleccionados.length > 3
    ) {
      alert("Solo puedes seleccionar máximo 3 géneros musicales.");
      seleccionados[seleccionados.length - 1].checked = false;
    }
  }
);

/* ---------------------------------- stickyRow */

const header = document.querySelector("header");
const stickyRow = document.getElementById("stickyRow");

// Iniciales
const headerHeight = header.offsetHeight;
const Encabezado_i = Math.round(stickyRow.getBoundingClientRect().top);

// Clonando encabezado
const clon = stickyRow.cloneNode(true);
clon.id = "stickyRowClone";
clon.style.display = "none";
stickyRow.parentNode.insertBefore(clon, stickyRow.nextSibling);

window.addEventListener("scroll", () => {
  const headerHeight = header.offsetHeight;
  const Encabezado_m = Math.round(stickyRow.getBoundingClientRect().top);
  const estilos = window.getComputedStyle(stickyRow); // recalculamos
  const Estado = estilos.position;

  let Encabezado_f;

  if (headerHeight <= Encabezado_m) {
    // El original sigue visible
    Encabezado_f = Encabezado_m;
    clon.style.display = "none"; // ocultamos el clon
  } else {
    // El original ya no está en su sitio
    clon.style.display = "table-row"; // mostramos el clon
    clon.style.position = "fixed";    // lo fijamos
    clon.style.top = headerHeight + "px"; // debajo del header
    Encabezado_f = headerHeight;
    
     // 👇 Ajustar cada celda del clon al ancho del original
    const originalCells = stickyRow.querySelectorAll("th, td");
    const cloneCells = clon.querySelectorAll("th, td");

    originalCells.forEach((cell, i) => {
      cloneCells[i].style.width = cell.offsetWidth + "px";
    });
    
  }
});

/*----------------Cargando Matriz en Formulario---------------------*/

fetch("Matriz_De_Preguntas.json")
.then(response => response.json())
.then(data => {
  renderPreguntas(data.preguntas);
})
.catch(error => console.error("Error cargando JSON:", error));

function renderPreguntas(preguntas) {
  const tbody = document.querySelector("tbody");

  preguntas.forEach(p => {
    const tr = document.createElement("tr");

    // Texto de la pregunta
    const tdTexto = document.createElement("td");
    tdTexto.colSpan = 7;
    tdTexto.textContent = `${p.item}. ${p.pregunta}`;
    tr.appendChild(tdTexto);

    // Radios 1–5
    for (let v = 1; v <= 5; v++) {
      const td = document.createElement("td");
      td.classList.add("text-center");

      const input = document.createElement("input");
      input.type = "radio";
      input.classList.add("form-check-input", "radio-scale", `radio-${v}`);
      input.name = `P${p.item}`; // grupo único por pregunta
      input.id = `P${p.item}_V${v}`; // IDs únicos: P1_V1, P1_V2...
      input.value = v;

      td.appendChild(input);
      tr.appendChild(td);
    }

    // Insertar justo después del stickyRow
    tbody.insertBefore(tr, stickyRow.nextSibling);
  });
}