function procesarSIMCHS(registro) {
    const matriz = Matriz.Preguntas;
    const dimensiones = {};
    let sumaGlobal = 0;
    registro.respuestas.forEach(r => {
        if (r.valor === null) return;

        // Configuración de la pregunta
        const preguntaConfig = matriz.find(m => m.Item === r.item);
        if (!preguntaConfig) return;

        let valor = r.valor;

        // Inversión si la pregunta es espejo
        if (preguntaConfig.P_Invertida) {
            valor = 6 - valor;
        }

        // Normalización Likert 1–5 → 0–1
        const norm = (valor - 1) / 4;

        // Puntaje ponderado (Ponderación por conciencia y Nivel de acuerdo a afectación)
        const puntaje = norm * preguntaConfig["PonderaciónP"] * 100;

        // Acumular por dimensión (Conciencia)
        const dimension = preguntaConfig.Conciencia;

        if (!dimensiones[dimension]) {
            dimensiones[dimension] = {
                suma: 0
            };
        }

        dimensiones[dimension].suma += puntaje;

        // Acumular global
        sumaGlobal += puntaje;
    });

    // Índices por dimensión
    const indicesDimension = {};

    Object.keys(dimensiones).forEach(dim => {
        indicesDimension[dim] = dimensiones[dim].suma;
    });

    // Índice global
    const indiceGlobal = sumaGlobal;

    // Clasificación comparativa interna
    const fortalezas = [];
    const crecimiento = [];

    Object.keys(indicesDimension).forEach(dim => {

        if (indicesDimension[dim] >= indiceGlobal) {
            fortalezas.push(dim);
        } else {
            crecimiento.push(dim);
        }

    });

    return {
        indiceGlobal,
        indicesDimension,
        fortalezas,
        crecimiento,
        registro
    };
}

function cargarDashboardSIMCHS() {

    const datos = window.SIMCHS_Resultados;

    if (!datos) return;

    renderPerfilHumano(datos);
    renderRadarChart(datos.indicesDimension);
    renderFortalezas(datos.fortalezas);
    renderCrecimiento(datos.crecimiento);
}

document.getElementById("resultadoModal")
.addEventListener("hidden.bs.modal", function () {

    const radar = document.getElementById("radarChart");

    if (radar) radar.innerHTML = "";

});

function renderPerfilHumano(datos) {

    const container = document.getElementById("perfilHumano");

    if (!container) return;

    container.innerHTML = `
        <h3>Perfil Humano</h3>
        <h1>${datos.indiceGlobal.toFixed(1)} / 100</h1>
    `;
}

function renderFortalezas(lista) {

    const container = document.getElementById("fortalezas");

    if (!container) return;

    container.innerHTML = "";

    lista.forEach(f => {
        container.innerHTML += `<p>✅ ${f}</p>`;
    });
}

function renderCrecimiento(lista) {

    const container = document.getElementById("crecimiento");

    if (!container) return;

    container.innerHTML = "";

    lista.forEach(c => {
        container.innerHTML += `<p>⚠️ ${c}</p>`;
    });
}

function renderPerfilHumano(datos) {

    const container = document.getElementById("perfilHumano");

    if (!container) return;

    const indice = datos.indiceGlobal;

    let estado = "";
    let clase = "";

    if (indice < 40) {
        estado = "Perfil crítico";
        clase = "bg-danger text-white";
    }
    else if (indice < 60) {
        estado = "Perfil en desarrollo";
        clase = "bg-warning text-dark";
    }
    else if (indice < 80) {
        estado = "Perfil adecuado";
        clase = "bg-info text-white";
    }
    else {
        estado = "Perfil óptimo";
        clase = "bg-success text-white";
    }

    container.innerHTML = `
        <div class="card shadow-sm p-4 text-center animate__animated animate__fadeIn">

            <h3 class="mb-3">Perfil Humano SIMCH-S</h3>

            <div class="display-4 fw-bold mb-3">
                ${indice.toFixed(1)}
            </div>

            <div class="badge rounded-pill ${clase} p-2 fs-6">
                ${estado}
            </div>

            <p class="mt-3 text-muted">
                ${interpretarPerfil(indice)}
            </p>

        </div>
    `;
}

function interpretarPerfil(indice) {

    if (indice < 40) {
        return "Se recomienda fortalecer procesos de autorregulación y conciencia personal.";
    }

    if (indice < 60) {
        return "El perfil muestra desarrollo medio con oportunidades de mejora.";
    }

    if (indice < 80) {
        return "Existe un nivel funcional adecuado de desarrollo humano.";
    }

    return "El perfil evidencia alto nivel de integración personal y conciencia.";
}

function renderRadarChart(indices) {

    const container = document.getElementById("radarChart");

    if (!container) return;

    const dimensiones = Object.keys(indices);
    const valores = Object.values(indices);

    // Interpretación por eje
    const colores = valores.map(v => {

        if (v < 4) return "red";
        if (v < 6) return "orange";
        if (v < 8) return "blue";
        return "green";

    });

    const trace = {
        type: "scatterpolar",
        r: valores,
        theta: dimensiones,
        fill: "toself",
        line: {
            width: 2
        },
        marker: {
            size: 6,
            color: colores
        }
    };

    const layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 10]
            }
        },
        margin: { t: 30 },
        showlegend: false
    };

    Plotly.newPlot("radarChart", [trace], layout);

    // Animación simple de entrada
    setTimeout(() => {
        Plotly.animate("radarChart", {
            data: [{ r: valores }]
        }, {
            transition: {
                duration: 800
            },
            frame: {
                duration: 800
            }
        });
    }, 200);
}

document
  .getElementById("resultadoModal")
  .addEventListener("shown.bs.modal", function () {

    if (!window.SIMCHS_REGISTRO) return;

    const resultados = procesarSIMCHS(window.SIMCHS_REGISTRO);
    mostrarResultado(resultados);
    renderPerfilHumano(resultados);
    renderRadarChart(resultados.indicesDimension);
    renderFortalezas(resultados.fortalezas);
    renderCrecimiento(resultados.crecimiento);

});


function mostrarResultado(data) {

    const contenido = document.getElementById("resultadoContenido");
    if (!contenido) return;

    const registro = data.registro;
    const matriz = Matriz.Preguntas;

    let html = "";

    /* =============================
       TIEMPO Y PROGRESO
    ============================== */

    html += `
    <div class="container-fluid mb-4">
        <div class="row">
            <div class="col-md-6">
                <h5 class="fw-bold">Tiempo de respuesta</h5>
                <p><strong>Inicio:</strong> ${registro.tiempo?.inicio ?? "-"}</p>
                <p><strong>Fin:</strong> ${registro.tiempo?.fin ?? "-"}</p>
                <p><strong>Duración:</strong> ${registro.tiempo?.duracionSegundos ?? 0} segundos</p>
            </div>
            <div class="col-md-6">
                <h5 class="fw-bold">Progreso</h5>
                <p><strong>Respondidas:</strong> ${registro.progreso?.respondidas ?? 0}</p>
                <p><strong>Total:</strong> ${registro.progreso?.total ?? 0}</p>
                <p><strong>Porcentaje:</strong> ${registro.progreso?.porcentaje ?? 0}%</p>
            </div>
        </div>
    </div>
    `;

    /* =============================
       DATOS GENERALES
    ============================== */

    if (registro.datosGenerales) {

        html += `<h5 class="fw-bold mt-3">Datos Generales</h5>`;

        html += `<div class="table-responsive">`;
        html += `<table class="table table-bordered table-sm">`;

        html += `
            <thead class="table-dark text-center">
                <tr>
                    <th>Rango Edad</th>
                    <th>Género</th>
                    <th>Nivel Educativo</th>
                    <th>Tipo Salud</th>
                    <th>C/Municipio</th>
                </tr>
            </thead>
            <tbody class="text-center">
                <tr>
                    <td>${registro.datosGenerales.rangoEdad ?? "-"}</td>
                    <td>${registro.datosGenerales.genero ?? "-"}</td>
                    <td>${registro.datosGenerales.nivelEducativo ?? "-"}</td>
                    <td>${registro.datosGenerales.tipoSalud ?? "-"}</td>
                    <td>${registro.datosGenerales.municipio ?? "-"}</td>
                </tr>
            </tbody>
        </table>
        </div>
        `;
    }

    /* =============================
       TABLA DE PREGUNTAS
    ============================== */

    html += `<h5 class="fw-bold mt-4">Detalle de Respuestas</h5>`;
    html += `<div class="table-responsive">`;
    html += `<table class="table table-bordered table-striped table-sm align-middle">`;

    html += `
        <thead class="table-dark text-white text-center">
            <tr>
                <th>Pregunta</th>
                <th>Conciencia</th>
                <th>Nivel</th>
                <th>Ponderación</th>
                <th>Respuesta</th>
                <th>Tipo</th>
            </tr>
        </thead>
        <tbody>
    `;

    registro.respuestas.forEach(r => {

        const config = matriz.find(m => m.Item === r.item);
        if (!config) return;

        html += `
            <tr>
                <td>${config.Pregunta}</td>
                <td class="text-center">${config.Conciencia ?? "-"}</td>
                <td class="text-center">${r.nivel ?? "-"}</td>
                <td class="text-center">${config.PonderaciónP ?? "-"}</td>
                <td class="text-center fw-bold">${r.valor ?? "-"}</td>
                <td class="text-center">${r.tipo ?? "Normal"}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;

    contenido.innerHTML = html;
}