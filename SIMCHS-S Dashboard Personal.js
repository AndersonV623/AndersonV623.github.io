function procesarSIMCHS(registro) {

    const matriz = Matriz.Preguntas;

    const dimensiones = {};
    let sumaGlobal = 0;
    let contadorGlobal = 0;

    registro.respuestas.forEach(r => {

        if (r.valor === null) return;

        const preguntaConfig = matriz.find(m => m.Item === r.item);

        if (!preguntaConfig) return;

        let valor = r.valor;

        // Normalización Likert 1-5 → 0-1
        let norm = (valor - 1) / 4;

        // Invertidas
        if (r.tipo && r.tipo.includes("Invertida")) {
            norm = 1 - norm;
        }

        // Peso nivel
        let pesoNivel = 0.5;

        if (r.nivel.includes("N3")) pesoNivel = 1;
        else if (r.nivel.includes("N2")) pesoNivel = 0.75;

        const puntaje = norm * pesoNivel * 100;

        if (!dimensiones[r.dimension]) {
            dimensiones[r.dimension] = {
                suma: 0,
                count: 0
            };
        }

        dimensiones[r.dimension].suma += puntaje;
        dimensiones[r.dimension].count++;

        sumaGlobal += puntaje;
        contadorGlobal++;
    });

    // Índices dimensión
    const indicesDimension = {};

    Object.keys(dimensiones).forEach(dim => {
        indicesDimension[dim] =
            dimensiones[dim].suma / dimensiones[dim].count;
    });

    const indiceGlobal = sumaGlobal / contadorGlobal;

    // Fortalezas y crecimiento
    const mediaGlobal = indiceGlobal;

    const fortalezas = [];
    const crecimiento = [];

    Object.keys(indicesDimension).forEach(dim => {

        if (indicesDimension[dim] >= mediaGlobal) {
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

        if (v < 40) return "red";
        if (v < 60) return "orange";
        if (v < 80) return "blue";
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
                range: [0, 100]
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

    renderPerfilHumano(resultados);
    renderRadarChart(resultados.indicesDimension);
    renderFortalezas(resultados.fortalezas);
    renderCrecimiento(resultados.crecimiento);

});