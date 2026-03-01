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

document.addEventListener("DOMContentLoaded", () => {
  renderPreguntas(Matriz.Preguntas);
});

function renderPreguntas(preguntas) {
  const tbody = document.querySelector("#SIMCH-S tbody");
  const stickyRow = document.getElementById("stickyRow");

  let referencia = stickyRow;

  preguntas.forEach(p => {
    const tr = document.createElement("tr");

    // Texto de la pregunta
    const tdTexto = document.createElement("td");
    tdTexto.colSpan = 7;
    tdTexto.textContent = `${p.Item}. ${p.Pregunta}`;
    tr.appendChild(tdTexto);

    // Radios 1–5
    for (let v = 1; v <= 5; v++) {
      const td = document.createElement("td");
      td.classList.add("text-center");

      const input = document.createElement("input");
      input.type = "radio";
      input.classList.add("form-check-input", "radio-scale", `radio-${v}`);
      input.name = `P${p.Item}`;
      input.id = `P${p.Item}_V${v}`;
      input.value = v;

      td.appendChild(input);
      tr.appendChild(td);
    }

    // Insertar debajo del anterior
    referencia.insertAdjacentElement("afterend", tr);
    referencia = tr;
  });
}

/*---------------------Obteniendo resultados del Form---------------------------*/
document.getElementById("formSIMCH").addEventListener("submit", function (e) {
  e.preventDefault();

  if (!encuestaActiva || !tiempoInicio) {
    alert("La encuesta no ha sido iniciada correctamente.");
    return;
  }

  // =============================
  // TIEMPO
  // =============================
  const tiempoFin = Date.now();
  const duracion = Math.floor((tiempoFin - tiempoInicio) / 1000);

  // =============================
  // DATOS GENERALES
  // =============================
  const datosGenerales = {
    rangoEdad: document.getElementById("rangoEdad")?.value || null,
    genero: document.querySelectorAll('#SIMCH-S select[name="genero"]')[1]?.value || null,
    nivelEducativo: document.getElementById("NivelEducativo")?.value || null,
    tipoSalud: document.getElementById("TipoSalud")?.value || null,
    municipio: document.getElementById("municipios")?.value || null,
    musica: Array.from(
      document.querySelectorAll('input[name="musica"]:checked')
    ).map(el => el.value)
  };

  // =============================
  // RESPUESTAS ESTRUCTURADAS
  // =============================
  const respuestas = [];

  Matriz.Preguntas.forEach(p => {
    const seleccionada = document.querySelector(`input[name="P${p.Item}"]:checked`);

    respuestas.push({
      item: p.Item,
      pregunta: p.Pregunta || p.pregunta,
      valor: seleccionada ? parseInt(seleccionada.value) : null,
      nivel: p.Nivel,
      dimension: p.Conciencia,
      tipo: p["Tipo de Pegunta"]
    });
  });

  // Validación
  const sinResponder = respuestas.filter(r => r.valor === null).length;

  if (sinResponder > 0) {
    alert(`Faltan ${sinResponder} preguntas por responder.`);
    return;
  }

  // =============================
  // PROGRESO
  // =============================
  const progreso = calcularProgreso();

  // =============================
  // REGISTRO FINAL
  // =============================
  const registro = {
    id: crypto.randomUUID(),
    estado: "completada",

    tiempo: {
      inicio: new Date(tiempoInicio).toISOString(),
      fin: new Date(tiempoFin).toISOString(),
      duracionSegundos: duracion
    },

    progreso: progreso,
    datosGenerales: datosGenerales,
    respuestas: respuestas
  };

  console.log("REGISTRO FINAL:", registro);

  mostrarResultado(registro);

  guardarEnBaseMensual(registro); //Descarga de DB

  localStorage.removeItem("inicioEncuesta");
  encuestaActiva = false;
});

/*------ Mostrar estructura [Temporal: solo para mostrar la estrucutra del Json]-----------------*/
function mostrarResultado(data) {

  const modal = new bootstrap.Modal(document.getElementById("resultadoModal"));
  const contenido = document.getElementById("resultadoContenido");

  contenido.textContent = JSON.stringify(data, null, 2);

  modal.show();
}

/*function mostrarResultado(data) {

  console.log("DATA RECIBIDA:", data);

  const modalElement = document.getElementById("resultadoModal");
  if (!modalElement) {
    console.error("No existe #resultadoModal");
    return;
  }

  const modal = new bootstrap.Modal(modalElement);
  const contenido = document.getElementById("resultadoContenido");

  let html = "";

  // Estado
  html += `<h4>Estado: ${data.estado ?? "NO DEFINIDO"}</h4><hr>`;

  // Tiempo
  if (data.tiempo) {
    html += `<h5>Tiempo de Respuesta</h5>`;
    html += `
      <ul>
        <li><strong>Inicio:</strong> ${data.tiempo.inicio ?? "-"}</li>
        <li><strong>Fin:</strong> ${data.tiempo.fin ?? "-"}</li>
        <li><strong>Duración:</strong> ${data.tiempo.duracionSegundos ?? 0} segundos</li>
      </ul>
    `;
    html += `<hr>`;
  }

  // Progreso
  if (data.progreso) {
    html += `<h5>Progreso</h5>`;
    html += `
      <ul>
        <li><strong>Respondidas:</strong> ${data.progreso.respondidas ?? 0}</li>
        <li><strong>Total:</strong> ${data.progreso.total ?? 0}</li>
        <li><strong>Porcentaje:</strong> ${data.progreso.porcentaje ?? 0}%</li>
      </ul>
    `;
    html += `<hr>`;
  }

  // Datos Generales
  if (data.datosGenerales) {
    html += `<h5>Datos Generales</h5>`;
    html += `<pre>${JSON.stringify(data.datosGenerales, null, 2)}</pre><hr>`;
  }

  // Respuestas
  if (data.respuestas) {
    html += `<h5>Respuestas</h5><ul style="max-height:300px; overflow:auto;">`;
    Object.entries(data.respuestas).forEach(([pregunta, valor]) => {
      html += `<li><strong>${pregunta}:</strong> ${valor}</li>`;
    });
    html += `</ul>`;
  }

  contenido.innerHTML = html;

  modal.show();
}*/

/*-------------------tiempos de respuesta en encuetas----------*/
let encuestaActiva = false;
let tiempoInicio = null;

const rangoEdad = document.getElementById("rangoEdad");

rangoEdad.addEventListener("change", () => {
  if (!encuestaActiva) {
    encuestaActiva = true;
    tiempoInicio = Date.now();
    console.log("Encuesta iniciada");
  }
});

window.addEventListener("beforeunload", function (e) {
  if (encuestaActiva) {
    const tiempoFin = Date.now();
    const duracion = Math.floor((tiempoFin - tiempoInicio) / 1000);

    const progreso = calcularProgreso();

    const registroIncompleto = {
      id: crypto.randomUUID(),
      estado: "abandonada",
      inicio: new Date(tiempoInicio).toISOString(),
      fin: new Date(tiempoFin).toISOString(),
      duracionSegundos: duracion,
      progreso: progreso
    };

    localStorage.setItem("ultimaEncuestaAbandonada", JSON.stringify(registroIncompleto));
  }
});

function calcularProgreso() {
  let respondidas = 0;

  Matriz.Preguntas.forEach(p => {
    const seleccionada = document.querySelector(`input[name="P${p.Item}"]:checked`);
    if (seleccionada) respondidas++;
  });

  return {
    respondidas: respondidas,
    total: Matriz.Preguntas.length,
    porcentaje: Math.round((respondidas / Matriz.Preguntas.length) * 100)
  };
}

rangoEdad.addEventListener("change", () => {
  if (!encuestaActiva) {
    encuestaActiva = true;
    tiempoInicio = Date.now();

    localStorage.setItem("inicioEncuesta", tiempoInicio);
  }
});

window.addEventListener("load", () => {
  const inicioGuardado = localStorage.getItem("inicioEncuesta");

  if (inicioGuardado) {
    const ahora = Date.now();
    const diferenciaMin = (ahora - inicioGuardado) / 60000;

    if (diferenciaMin > 60) {
      alert("La encuesta anterior fue abierta hace más de 1 hora. Se reiniciará.");
      localStorage.removeItem("inicioEncuesta");
    }
  }
});

/* ---- Actualizar DB ----------------------------*/

function guardarEnBaseMensual(registro) {
  const ahora = new Date();
  const año = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const nombreArchivo = `SIMCHS_${año}_${mes}`;
  let base = JSON.parse(localStorage.getItem(nombreArchivo)) || [];
  base.push(registro);
  localStorage.setItem(nombreArchivo, JSON.stringify(base));
  descargarBaseMensual(nombreArchivo, base);
}

function descargarBaseMensual(nombre, data) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombre}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}