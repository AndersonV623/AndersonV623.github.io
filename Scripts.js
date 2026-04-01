/*________________________________________________________________________________________________
|------------------------------------------------------------------------------------------------|
|----------------------------Eventos iniciales, scroll en 0, menu del header---------------------|
|------------------------------------------------------------------------------------------------|
|_______________________________________________________________________________________________*/

window.addEventListener("hashchange", function () {
  window.scrollTo(0, 0);
});

function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  if (menu.style.width === "250px") {
    menu.style.width = "0";
  } else {
    menu.style.width = "250px";
  }
}
/*________________________________________________________________________________________________
|------------------------------------------------------------------------------------------------|
|----------------------------Eventos iniciales, scroll en 0, menu del header---------------------|
|------------------------------------------------------------------------------------------------|
|_______________________________________________________________________________________________*/

function showSection(id) {
  document
    .querySelector("section.active")
    ?.classList.remove("active");

  document
    .getElementById(id)
    ?.classList.add("active");
}

/*------------------------------------ Mostramos las funciones -------------------------------------*/
function mostrarFunciones(boton) {
  new bootstrap.Modal(document.getElementById('FuncionesModal')).show();
  
  document.getElementById("FuncionesABPS").style.display = "none";
  document.getElementById("FuncionesIQO").style.display = "none";
  document.getElementById("FuncionesCAYRE").style.display = "none";
  document.getElementById("FuncionesSITEL").style.display = "none";
  
  switch (boton.id){
    case "btnFuncionesABPS":
      document.getElementById("FuncionesABPS").style.display = "block";
      break;
    case "btnFuncionesIQO":
      document.getElementById("FuncionesIQO").style.display = "block";
      break;
    case "btnFuncionesCAYRE":
      document.getElementById("FuncionesCAYRE").style.display = "block";
      break;
    case "btnFuncionesSITEL":
      document.getElementById("FuncionesSITEL").style.display = "block";
      break;
  }
}

/*------------------------------------ Mostramos las Experiencias -------------------------------------*/
function mostrarExperiencia(boton) {
  new bootstrap.Modal(document.getElementById('ExperienciasModal')).show();
  
  document.getElementById("ExperienciaABPS").style.display = "none";
  document.getElementById("ExperienciaIQO").style.display = "none";
  document.getElementById("ExperienciaCAYRE").style.display = "none";
  document.getElementById("ExperienciaSITEL").style.display = "none";
  
  switch (boton.id){
    case "btnExperiencABPS":
      document.getElementById("ExperienciaABPS").style.display = "block";
      break;
    case "btnExperiencIQO":
      document.getElementById("ExperienciaIQO").style.display = "block";
      break;
    case "btnExperiencCAYRE":
      document.getElementById("ExperienciaCAYRE").style.display = "block";
      break;
    case "btnExperiencSITEL":
      document.getElementById("ExperienciaSITEL").style.display = "block";
      break;
  }
}

/*------------------------------------ Mostramos Graficas Herramientas -------------------------------------*/

function animaBar(barId, percent, percentId, colorClass){

  const bar = document.getElementById(barId);
  const label = document.getElementById(percentId);

  let current = 0;

  bar.classList.add(colorClass);

  const interval = setInterval(() => {

    if(current >= percent){
      clearInterval(interval);
      return;
    }

    current++;
    bar.style.width = current + "%";
    label.textContent = current + "%";

  },20);

}

window.onload = function() {
  console.log("window cargado");
  animaBar("SQL-bar-ABPS",80,"SQL-percent-ABPS","bg-sql");
  animaBar("PowerBI-bar-ABPS", 90, "PowerBI-percent-ABPS", "bg-powerbi");
  animaBar("Python-bar-ABPS", 70, "Python-percent-ABPS", "bg-python");
  animaBar("PowerAutomate-bar-ABPS", 10, "PowerAutomate-percent-ABPS", "bg-automate");
  animaBar("Excel-bar-ABPS", 80, "Excel-percent-ABPS", "bg-excel");
  animaBar("Access-bar-ABPS", 30, "Access-percent-ABPS", "bg-access");
  animaBar("Excel-bar-IQO", 95, "Excel-percent-IQO", "bg-excel");
  animaBar("Access-bar-IQO", 60, "Access-percent-IQO", "bg-access");
  animaBar("VBA-bar-IQO", 80, "VBA-percent-IQO", "bg-VBA");
  animaBar("Excel-bar-Kayre", 80, "Excel-percent-Kayre", "bg-excel");
  animaBar("VBA-bar-Kayre", 50, "VBA-percent-Kayre", "bg-VBA");
  animaBar("Excel-bar-Sitel", 60, "Excel-percent-Sitel", "bg-excel");
  animaBar("Access-bar-Sitel", 40, "Access-percent-Sitel", "bg-access");
};

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
/*-----Consulta municipios y departamentos del DANE -----*/
const url = "https://ags.esri.co/arcgis/rest/services/DatosAbiertos/SERVICIOS_PUBLICOS_2005_MPIO/MapServer/0/query?where=1%3D1&outFields=DEPTO,DPTO_CCDGO,MPIO_CCDGO,MPIO_CNMBR&outSR=4326&f=json";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const select = document.getElementById("municipios");
    if (!select) return; // Si el select no existe en el HTML aún, detenemos aquí.

    // Ordenar por nombre de municipio
    const municipiosOrdenados = data.features.sort((a, b) => {
      return a.attributes.MPIO_CNMBR.localeCompare(b.attributes.MPIO_CNMBR);
    });

    municipiosOrdenados.forEach(item => {
      const attr = item.attributes;
      const option = document.createElement("option");
      // Guardamos el código DANE y el nombre para que Supabase lo reciba clarito
      option.value = `${attr.MPIO_CCDGO} - ${attr.MPIO_CNMBR} (${attr.DEPTO})`;
      option.textContent = `${attr.MPIO_CNMBR} (${attr.DEPTO})`;
      select.appendChild(option);
    });

    // --- PROTECCIÓN PARA SELECT2 ---
    // Verificamos que jQuery ($) y el plugin (.select2) existan
    if (window.$ && $.fn.select2) {
      $('#municipios').select2({
        placeholder: "Busca tu municipio...",
        allowClear: true,
        width: '100%' // Recomendado para que no se "encoja" en formularios ocultos
      });
    } else {
      console.warn("Select2 no cargó a tiempo. El buscador será un select normal.");
    }
  })
  .catch(err => console.error("Error cargando municipios DANE:", err));

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
  const estilos = window.getComputedStyle(stickyRow);
  const Estado = estilos.position;

  let Encabezado_f;

  if (headerHeight <= Encabezado_m) {
    Encabezado_f = Encabezado_m;
    clon.style.display = "none";
  } else {
    
    clon.style.display = "table-row"; 
    clon.style.position = "fixed";
    clon.style.top = headerHeight + "px";
    Encabezado_f = headerHeight;
    
     // Ajustar cada celda del clon al ancho del original
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

  // Detectar hash en el URL (para QR o enlaces directos)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    showSection(hash);
  }
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
  const datos_generales = {
    rangoEdad: document.getElementById("rangoEdad")?.value || null,
    genero: document.getElementById("genero")?.value || null,
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
    inicio: new Date(tiempoInicio).toISOString(),
    fin: new Date().toISOString(),
    duracion: Math.floor((Date.now() - tiempoInicio) / 1000),

    // ENVOLVEMOS EN CORCHETES para que coincida con el tipo jsonb[]
    progreso: [ progreso ], 
    datos_generales: [ datos_generales ], 
    
    // Respuestas ya es un array, así que se deja igual
    respuestas: respuestas 
  };


  console.log("REGISTRO FINAL:", registro);
  
  window.SIMCHS_REGISTRO = registro;

  enviarASupabase(registro);

  localStorage.removeItem("inicioEncuesta");
  encuestaActiva = false;
});

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
      duracion: duracion,
      progreso: [ progreso ] 
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

/*---------------------------Cargue de datos en googles sheets----------------*/
async function enviarASupabase(datos) {
    try {
        const respuesta = await fetch('/api/send', { // La ruta de tu archivo send.js
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Encuesta enviada con éxito!");
        } else {
            throw new Error(resultado.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un fallo: " + error.message);
    }
}

/*--------------------------Limpiar Form--------------------------------------------------*/
function limpiarFormulario() {
  const form = document.getElementById("miFormulario");

  form.reset();
  inicioEncuesta = null;
  finEncuesta = null;

  actualizarProgreso(0);

  // Si tienes selects personalizados
  const selects = form.querySelectorAll("select");
  selects.forEach(select => select.selectedIndex = 0);

  // Si tienes checkboxes múltiples
  const checks = form.querySelectorAll("input[type='checkbox']");
  checks.forEach(check => check.checked = false);

  console.log("Formulario limpio correctamente");
}

/*------ Mostramos la ventana modal con los resultados-------*/
document.addEventListener("DOMContentLoaded", function () {
    const boton = document.getElementById("btnMostrarResultado");
    /*boton.addEventListener("click", function () {
        alert("El botón funciona correctamente");
    });*/
}); 