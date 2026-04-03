//========================================================
// 1. FUNCIÓN PRINCIPAL (PREPARA VARIABLES Y MATRICES BASE)
//========================================================
function VariablesSIMCHS(datosRegistro) {
    // ==================================================
    // 1. MATRICES BASE
    // ==================================================
    const matrizDatos = (typeof Matriz !== 'undefined') ? Matriz.Preguntas : [];
    const T_Preguntas = matrizDatos.length;

    // ==================================================
    // 2. CONTEOS Y PONDERACIÓN POR NIVELES (N1, N2, N3)
    // ==================================================
    const Cont_N1 = matrizDatos.filter(m => m.Nivel === "N1").length;
    const Cont_N2 = matrizDatos.filter(m => m.Nivel === "N2").length;
    const Cont_N3 = matrizDatos.filter(m => m.Nivel === "N3").length;

    const Pond_N1 = T_Preguntas > 0 ? (Cont_N1 / T_Preguntas) : 0;
    const Pond_N2 = T_Preguntas > 0 ? (Cont_N2 / T_Preguntas) : 0;
    const Pond_N3 = T_Preguntas > 0 ? (Cont_N3 / T_Preguntas) : 0;


    // ==================================================
    // 2.1. PESOS POR NIVELES (ESTRUCTURA GENERAL)
    // ==================================================
    // Corrección: antes tenías PonderacionN1 repetida para todo
    const PesPor_Niveles = {
        total: T_Preguntas,
        N1: { Cantidad: Cont_N1, Ponderacion: Pond_N1 },
        N2: { Cantidad: Cont_N2, Ponderacion: Pond_N2 },
        N3: { Cantidad: Cont_N3, Ponderacion: Pond_N3 }
    };


    // ==================================================
    // 3. CONCIENCIAS POR IMPACTO SOCIAL (ALTO / MEDIO / BAJO)
    // ==================================================
    const concienciasAltas = new Set();
    const concienciasMedias = new Set();
    const concienciasBajas = new Set();

    matrizDatos.forEach(m => {
        if (m.Impacto === "Alto") concienciasAltas.add(m.Conciencia);
        else if (m.Impacto === "Medio") concienciasMedias.add(m.Conciencia);
        else if (m.Impacto === "Bajo") concienciasBajas.add(m.Conciencia);
    });

    const Can_Con_Alt = concienciasAltas.size;
    const Can_Con_Med = concienciasMedias.size;
    const Can_Con_Baj = concienciasBajas.size;

    // Pesos base definidos para Impacto Social
    const Pes_Alt = 0.6;
    const Pes_Med = 0.25;
    const Pes_Baj = 0.15;

    // Ponderación por Impacto de Conciencia
    const Reglas_Impacto = {
        "Alto": Can_Con_Alt > 0 ? (Pes_Alt / Can_Con_Alt) : 0,
        "Medio": Can_Con_Med > 0 ? (Pes_Med / Can_Con_Med) : 0,
        "Bajo": Can_Con_Baj > 0 ? (Pes_Baj / Can_Con_Baj) : 0
    };


    // ==================================================
    // 4. MATRIZ DE PONDERACIONES (ESCENARIOS NIVEL + IMPACTO)
    // ==================================================
    const MatrizPonderacion = [
        { nivel: "N1", imp: "Medio", cant: 0, pondN: PesPor_Niveles.N1.Ponderacion, pondC: Reglas_Impacto["Medio"] },
        { nivel: "N2", imp: "Medio", cant: 0, pondN: PesPor_Niveles.N2.Ponderacion, pondC: Reglas_Impacto["Medio"] },
        { nivel: "N3", imp: "Medio", cant: 0, pondN: PesPor_Niveles.N3.Ponderacion, pondC: Reglas_Impacto["Medio"] },

        { nivel: "N1", imp: "Alto",  cant: 0, pondN: PesPor_Niveles.N1.Ponderacion, pondC: Reglas_Impacto["Alto"] },
        { nivel: "N2", imp: "Alto",  cant: 0, pondN: PesPor_Niveles.N2.Ponderacion, pondC: Reglas_Impacto["Alto"] },
        { nivel: "N3", imp: "Alto",  cant: 0, pondN: PesPor_Niveles.N3.Ponderacion, pondC: Reglas_Impacto["Alto"] },

        { nivel: "N1", imp: "Bajo",  cant: 0, pondN: PesPor_Niveles.N1.Ponderacion, pondC: Reglas_Impacto["Bajo"] },
        { nivel: "N2", imp: "Bajo",  cant: 0, pondN: PesPor_Niveles.N2.Ponderacion, pondC: Reglas_Impacto["Bajo"] },
        { nivel: "N3", imp: "Bajo",  cant: 0, pondN: PesPor_Niveles.N3.Ponderacion, pondC: Reglas_Impacto["Bajo"] }
    ];

    // ==================================================
    // 4.1. CONTEO DE PREGUNTAS POR ESCENARIO
    // ==================================================
    matrizDatos.forEach(m => {
        const fila = MatrizPonderacion.find(e => e.nivel === m.Nivel && e.imp === m.Impacto);
        if (fila) fila.cant++;
    });

    // ==================================================
    // 5. NORMALIZACIÓN DE PESOS (BASE Y FINAL)
    // ==================================================
    let sumaPonderacionP = 0;

    MatrizPonderacion.forEach(e => {
        e.pondP_Base = e.cant * (e.pondN + e.pondC);
        sumaPonderacionP += e.pondP_Base;
    });

    MatrizPonderacion.forEach(e => {
        e.pondP_Final = sumaPonderacionP > 0 ? (e.pondP_Base / sumaPonderacionP) : 0;
        e.pesoUnitario = sumaPonderacionP > 0 ? ((e.pondN + e.pondC) / sumaPonderacionP) : 0;
    });


    // ==================================================
    // 6. VALIDACIÓN DE DATOS REGISTRADOS (FORMULARIO)
    // ==================================================
    const tieneDatos = datosRegistro && datosRegistro.respuestas && Array.isArray(datosRegistro.respuestas);

    if (!tieneDatos) {
        const render = RenderSIMCHS(null, matrizDatos, false, MatrizPonderacion, null);
        ResultadosSIMCHS(render);
        return;
    }

    // ==================================================
    // 7. EJECUCIÓN DEL MOTOR DE CÁLCULO
    // ==================================================
    const datosProcesados = CalculadoraSIMCHS(matrizDatos, datosRegistro.respuestas, MatrizPonderacion);

    // ==================================================
    // 8. RESUMEN POR CONCIENCIA (AGRUPACIÓN DE RESULTADOS)
    // ==================================================
    const matrizConciencia = {};

    datosProcesados.forEach(item => {
        const nombreConciencia = item.meta.Conciencia;

        if (!matrizConciencia[nombreConciencia]) {
            matrizConciencia[nombreConciencia] = {
                peso: item.meta.PonderaciónP || 0,
                sumaImpacto: 0
            };
        }

        matrizConciencia[nombreConciencia].sumaImpacto += item.ImpactoP;
    });

    const resumenConciencia = Object.keys(matrizConciencia).map(nombre => {
        const datos = matrizConciencia[nombre];
        const valorPorcentaje = (datos.sumaImpacto * 100);

        return {
            conciencia: nombre,
            peso: PonderacionC,
            valor: valorPorcentaje.toFixed(2),
            valorTexto: valorPorcentaje.toFixed(2) + "%"
        };
    });


    // ==================================================
    // 9. GENERACIÓN DE RENDER Y ENVÍO A RESULTADOS
    // ==================================================
    const render = RenderSIMCHS(datosProcesados, matrizDatos, true, MatrizPonderacion, resumenConciencia);
    ResultadosSIMCHS(render);
}



//========================================================
// 2. FUNCIÓN PARA CALCULAR RESULTADOS POR PREGUNTA
//========================================================
function CalculadoraSIMCHS(matriz, respuestas, tablaPesos) {

    return respuestas.map(rta => {

        // ==================================================
        // 1. METADATA DE LA PREGUNTA (Matriz SIMCH-S)
        // ==================================================
        const meta = matriz.find(m => m.Item === Number(rta.item)) || {};

        // ==================================================
        // 2. ESCENARIO DE PESO (Nivel + Impacto)
        // ==================================================
        const escenario = tablaPesos.find(e => e.nivel === meta.Nivel && e.imp === meta.Impacto);
        const pesoReal = escenario ? escenario.pesoUnitario : 0;

        // ==================================================
        // 3. VALOR CALCULADO (CON INVERSIÓN SI APLICA)
        // ==================================================
        let valorCalculado = Number(rta.valor);

        if (meta.P_Invertida === true || meta.P_Invertida === "true") {
            valorCalculado = 6 - valorCalculado;
        }

        // ==================================================
        // 4. NORMALIZACIÓN DEL VALOR (ESCALA 1 A 5 → 0 A 1)
        // ==================================================
        const NormalizaP = (valorCalculado - 1) / 4;

        // ==================================================
        // 5. IMPACTO FINAL POR PREGUNTA (NORMALIZADO * PESO)
        // ==================================================
        const ImpactoP = NormalizaP * pesoReal;

        // ==================================================
        // 6. RETORNO FINAL (RESPUESTA ENRIQUECIDA)
        // ==================================================
        return {
            ...rta,
            valorCalculado,
            ImpactoP,
            NormalizaP,
            meta: { ...meta, PonderaciónP: pesoReal }
        };
    });
}



//=====================================================
// 3.1. CONSTRUCTOR DE VISTA PARA INFORME PERSONAL
//=====================================================
function ConsInfPersonalSIMCHS(datosCalculados, resumenConciencia) {

    // ==================================================
    // 1. VARIABLES BASE DEL PERFIL (CÁLCULOS PRINCIPALES)
    // ==================================================
    let estado = "";
    let claseColor = "";
    let mensaje = "";

    const totalImpacto = datosCalculados.reduce((acc, item) => acc + item.ImpactoP, 0);
    const porcentajeFinal = (totalImpacto * 100);


    // ==================================================
    // 2. CLASIFICACIÓN DEL PERFIL (ESTADO FINAL)
    // ==================================================
    if (porcentajeFinal < 40) {
        estado = "Perfil crítico";
        claseColor = "#dc3545";
        mensaje = "Se recomienda fortalecer procesos de autorregulación y conciencia personal.";
    } else if (porcentajeFinal < 60) {
        estado = "Perfil en desarrollo";
        claseColor = "#ffc107";
        mensaje = "El perfil muestra desarrollo medio con oportunidades de mejora.";
    } else if (porcentajeFinal < 80) {
        estado = "Perfil adecuado";
        claseColor = "#17a2b8";
        mensaje = "Existe un nivel funcional adecuado de desarrollo humano.";
    } else {
        estado = "Perfil óptimo";
        claseColor = "#28a745";
        mensaje = "El perfil evidencia alto nivel de integración personal y conciencia.";
    }


    // ==================================================
    // 3. BLOQUES HTML (CONSTRUCCIÓN MODULAR)
    // ==================================================
    const html_Perfil = `
        <div class="card border-0 shadow-sm mb-4 text-center">
            <div class="card-body text-center p-4">
                <h4 class="text-secondary fw-light">Perfil Humano SIMCH-S</h4>

                <div class="display-2 fw-bold my-2" style="color: #333;">
                    ${porcentajeFinal.toFixed(2)}%
                </div>

                <div class="py-2 px-4 rounded-pill d-inline-block w-100 fw-bold mb-3"
                     style="background-color: ${claseColor}; color: ${porcentajeFinal >= 40 && porcentajeFinal < 60 ? '#000' : '#fff'};">
                    ${estado.toUpperCase()}
                </div>

                <p class="text-muted mb-0">${mensaje}</p>
            </div>
        </div>
    `;

    const html_Radar = `
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body text-center p-4">
                <h5 class="text-secondary fw-light">Radar de Conciencias</h5>
                <div id="radarSIMCHS" style="height: 350px;"></div>
            </div>
        </div>
    `;

    const html_ResumenConciencia = resumenConciencia ? `
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
                <h5 class="text-secondary fw-light text-center mb-3">Resumen por Conciencia</h5>

                <div class="table-responsive">
                    <table class="table table-sm table-bordered">
                        <thead class="table-dark">
                            <tr>
                                <th>Conciencia</th>
                                <th class="text-center">Resultado</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resumenConciencia.map(c => `
                                <tr>
                                    <td>${c.conciencia}</td>
                                    <td class="text-center fw-bold">${c.valorTexto}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ` : "";


    // ==================================================
    // 4. RETORNO FINAL (UNIFICACIÓN)
    // ==================================================
    return `
        ${html_Perfil}
        ${html_ResumenConciencia}
        ${html_Radar}
    `;
}



//======================================================
// 3.2. CONSTRUCTOR DE VISTA PARA INFORME AUDITORÍA
//======================================================
function ConstAuditoriaSIMCHS(datosCalculados, MatrizPonderacion, resumenConciencia) {

    // ==================================================
    // 1. TABLA DE PONDERACIONES (AUDITORÍA)
    // ==================================================
    let html_TablaPonderacion = "";

    if (MatrizPonderacion) {

        const html_FilasTabla = MatrizPonderacion.map(e => `
            <tr>
                <td class="fw-bold">${e.nivel}</td>
                <td>${e.imp}</td>
                <td class="text-center">${e.cant}</td>
                <td>${(e.pondN || 0).toFixed(4)}</td>
                <td>${(e.pondC || 0).toFixed(4)}</td>
                <td class="text-success fw-bold">${(e.pesoUnitario || 0).toFixed(6)}</td>
            </tr>
        `).join('');

        html_TablaPonderacion = `
            <div class="table-responsive mb-4">
                <p class="text-uppercase fw-bold text-primary small mb-2">
                    📊 Tabla de Ponderaciones (Auditoría de Escenarios)
                </p>

                <table class="table table-sm table-bordered bg-white" style="font-size: 0.7rem;">
                    <thead class="table-dark">
                        <tr>
                            <th>Nivel</th>
                            <th>Impacto</th>
                            <th class="text-center">Cant.</th>
                            <th>Pond. N</th>
                            <th>Pond. C</th>
                            <th>Peso Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${html_FilasTabla}
                    </tbody>
                </table>
            </div>
            <hr>
        `;
    }


    // ==================================================
    // 2. RESUMEN CONCIENCIA (TABLA SIMPLE)
    // ==================================================
    const html_ResumenConciencia = resumenConciencia ? `
        <div class="table-responsive mb-4">
            <p class="text-uppercase fw-bold text-success small mb-2">
                🧠 Resumen de Conciencias (Auditoría)
            </p>

            <table class="table table-sm table-bordered bg-white" style="font-size: 0.7rem;">
                <thead class="table-dark">
                    <tr>
                        <th>Conciencia</th>
                        <th class="text-center">Resultado</th>
                    </tr>
                </thead>
                <tbody>
                    ${resumenConciencia.map(c => `
                        <tr>
                            <td>${c.conciencia}</td>
                            <td class="text-center fw-bold">${c.valorTexto}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
        <hr>
    ` : "";


    // ==================================================
    // 3. TARJETAS DETALLADAS (CRUCE INDIVIDUAL)
    // ==================================================
    const html_TarjetasAuditoria = datosCalculados.map(item => {

        const html_Header = `
            <div class="card-header bg-primary text-white py-1">
                <small>Comparativa Ítem #${item.item}</small>
            </div>
        `;

        const html_MatrizReferencia = `
            <div class="col-md-6 border-end">
                <div class="p-2" style="font-size: 0.75rem; background-color: #f8f9fa;">
                    <p class="mb-1 text-primary fw-bold">🔍 MATRIZ DE REFERENCIA</p>
                    <p class="mb-1"><strong>Pregunta:</strong> ${item.meta.Pregunta || 'No encontrada'}</p>
                    <p class="mb-1"><strong>Nivel:</strong> ${item.meta.Nivel} - <span class="text-muted">${item.meta.CriterioN || ""}</span></p>
                    <p class="mb-1"><strong>Invertida:</strong> ${item.meta.P_Invertida} | <strong>Impacto:</strong> ${item.meta.Impacto}</p>
                    <p class="mb-1"><strong>Conciencia:</strong> ${item.meta.Conciencia} - ${item.meta.CriterioC || ""}</p>

                    <div class="mt-2 p-1 bg-white border rounded">
                        <code class="d-block">P.N: ${((item.meta.PonderacionN || 0)).toFixed(5)}</code>
                        <code class="d-block">P.C: ${((item.meta.PonderacionC || 0)).toFixed(5)}</code>
                        <code class="d-block text-danger fw-bold">P.P (Peso): ${((item.meta.PonderaciónP || 0)).toFixed(5)}</code>
                    </div>
                </div>
            </div>
        `;

        const html_RespuestaFormulario = `
            <div class="col-md-6">
                <div class="p-2" style="font-size: 0.75rem;">
                    <p class="mb-1 text-info fw-bold">📝 RESPUESTA DEL FORMULARIO</p>
                    <p class="mb-1"><strong>Pregunta:</strong> ${item.pregunta || '---'}</p>
                    <p class="mb-1"><strong>Valor Marcado:</strong> <span class="badge bg-info text-dark">${item.valor}</span></p>
                    <p class="mb-1"><strong>Valor Calculado:</strong> ${item.valorCalculado}</p>
                    <p class="mb-1"><strong>Valor Normalizado:</strong> ${item.NormalizaP.toFixed(5)}</p>

                    <div class="mt-2 p-1 bg-light border rounded">
                        <p class="mb-0 fw-bold text-success">Cálculo en Memoria:</p>
                        <code class="d-block">
                            I.P = ${item.NormalizaP.toFixed(5)} * ${((item.meta.PonderaciónP || 0)).toFixed(5)} = ${item.ImpactoP.toFixed(5)}
                        </code>
                    </div>
                </div>
            </div>
        `;

        return `
            <div class="card mb-3 shadow-sm border-0">
                ${html_Header}
                <div class="row g-0">
                    ${html_MatrizReferencia}
                    ${html_RespuestaFormulario}
                </div>
            </div>
        `;

    }).join('');


    // ==================================================
    // 4. RETORNO FINAL DE AUDITORÍA (UNIFICACIÓN)
    // ==================================================
    return `
        <div class="card shadow-sm border-0 mb-4">
            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">🕵️ Vigilante de Variables (Auditoría)</h5>
                <span class="badge bg-success">Datos Detectados</span>
            </div>

            <div class="card-body bg-light">
                ${html_TablaPonderacion}
                ${html_ResumenConciencia}

                <h6 class="text-uppercase fw-bold text-secondary small mb-3">
                    🗂️ Detalle de Cruce Individual
                </h6>

                <div id="cruce-detallado" style="max-height: 600px; overflow-y: auto; padding-right: 10px;">
                    ${html_TarjetasAuditoria}
                </div>
            </div>

            <div class="card-footer text-muted small d-flex justify-content-between">
                <span>Estado: Vigilando...</span>
                <span>Actualizado: ${new Date().toLocaleTimeString()}</span>
            </div>
        </div>
    `;
}



//======================================================
// 4. FUNCIÓN RENDER (ARMA EL PAQUETE FINAL PARA DOM)
//======================================================
function RenderSIMCHS(datosProcesados, matrizDatos, tieneDatos, MatrizPonderacion, resumenConciencia) {

    // ==================================================
    // SI NO HAY DATOS, SE DEVUELVE RENDER VACÍO
    // ==================================================
    if (!tieneDatos) {
        return {
            tieneDatos: false,
            htmlPersonal: "",
            htmlAuditoria: `
                <div class="alert alert-secondary text-center">
                    Completa el formulario para ver el cruce de datos.
                </div>
            `,
            resumenConciencia: null
        };
    }


    // ==================================================
    // HTML PERSONAL Y AUDITORÍA
    // ==================================================
    const htmlPersonal = ConsInfPersonalSIMCHS(datosProcesados, resumenConciencia);
    const htmlAuditoria = ConstAuditoriaSIMCHS(datosProcesados, MatrizPonderacion, resumenConciencia);


    // ==================================================
    // RETORNO FINAL (PAQUETE COMPLETO)
    // ==================================================
    return {
        tieneDatos: true,
        htmlPersonal,
        htmlAuditoria,
        resumenConciencia
    };
}



//======================================================
// 5. FUNCIÓN RESULTADOS (RENDERIZA DOM Y GRÁFICAS)
//======================================================
function ResultadosSIMCHS(render) {

    // ==================================================
    // 1. CONTENEDORES HTML (INFORME Y AUDITORÍA)
    // ==================================================
    const contInforme = document.getElementById("Informe_SIMCHS_Personal");
    const contAuditoria = document.getElementById("Auditoria_SIMCHS_Personal");

    // ==================================================
    // 2. INSERTAR HTML EN CONTENEDORES
    // ==================================================
    if (contInforme) contInforme.innerHTML = render.htmlPersonal;
    if (contAuditoria) contAuditoria.innerHTML = render.htmlAuditoria;


    // ==================================================
    // 3. EJECUCIÓN DE GRÁFICAS (POST-RENDER)
    // ==================================================
    if (render.tieneDatos && render.resumenConciencia) {
        GraficarRadarSIMCHS(render.resumenConciencia);
    }
}



//======================================================
// 6. FUNCIÓN PARA GRAFICAR RADAR (PLOTLY)
//======================================================
function GraficarRadarSIMCHS(resumenConciencia) {

    // Validación: si no existe el contenedor, no hacemos nada
    const radarDiv = document.getElementById("radarSIMCHS");
    if (!radarDiv) return;

    // Validación: si Plotly no existe, no hacemos nada
    if (typeof Plotly === "undefined") {
        radarDiv.innerHTML = `<div class="alert alert-danger text-center">Plotly no está cargado.</div>`;
        return;
    }

    // Labels y valores
    const labels = resumenConciencia.map(x => x.conciencia);
    const valores = resumenConciencia.map(x => Number(x.valor));

    // Radar debe cerrar el círculo (Plotly recomienda repetir el primer punto)
    labels.push(labels[0]);
    valores.push(valores[0]);

    const data = [{
        type: "scatterpolar",
        r: valores,
        theta: labels,
        fill: "toself",
        name: "Conciencias"
    }];

    const layout = {
        polar: {
            radialaxis: {
                visible: true,
                range: [0, 100]
            }
        },
        showlegend: false,
        margin: { t: 30, b: 30, l: 30, r: 30 }
    };

    Plotly.newPlot("radarSIMCHS", data, layout, { responsive: true });
}

/*--------------------------------------Inspector--------------------------------------*/
let cacheDatos = "";
setInterval(() => {
    const datosActuales = window.SIMCHS_REGISTRO;
    const stringDatos = JSON.stringify(datosActuales);
    if (stringDatos !== cacheDatos) {
        VariablesSIMCHS(datosActuales);
        cacheDatos = stringDatos;
    }
}, 800);



/*
//========================================================
// 1. Función para mantener la Variables de las matrices||
//========================================================
function VariablesSIMCHS(datosRegistro) {
    // ==================================================
    // 1. MATRICES BASE
    // ==================================================
    const matrizDatos = (typeof Matriz !== 'undefined') ? Matriz.Preguntas : [];
    const T_Preguntas = matrizDatos.length;

    // ==================================================
    // 2. CONTEOS Y PONDERACIÓN POR NIVELES (N1, N2, N3)
    // ==================================================
    const Cont_N1 = matrizDatos.filter(m => m.Nivel === "N1").length;
    const Cont_N2 = matrizDatos.filter(m => m.Nivel === "N2").length;
    const Cont_N3 = matrizDatos.filter(m => m.Nivel === "N3").length;

    const Pond_N1 = T_Preguntas > 0 ? (Cont_N1 / T_Preguntas) : 0;
    const Pond_N2 = T_Preguntas > 0 ? (Cont_N2 / T_Preguntas) : 0;
    const Pond_N3 = T_Preguntas > 0 ? (Cont_N3 / T_Preguntas) : 0;

    // Calculamos los pesos por los Niveles ("N1: Cognición") ("N2: Emoción") ("N3: Conductual")
    const PesPor_Niveles = {
        total: T_Preguntas,
        N1: { Cantidad: Cont_N1, PonderacionN1: Pond_N1 },
        N2: { Cantidad: Cont_N2, PonderacionN1: Pond_N2 },
        N3: { Cantidad: Cont_N3, PonderacionN1: Pond_N3 }
    };

    // ==================================================
    // 3. CONCIENCIAS POR IMPACTO SOCIAL (ALTO / MEDIO / BAJO)
    // ==================================================
    // Usamos Set() para evitar duplicados (una conciencia no se cuenta 2 veces)
    const concienciasAltas = new Set();
    const concienciasMedias = new Set();
    const concienciasBajas = new Set();

    // Clasificamos las conciencias según su impacto
    matrizDatos.forEach(m => {
        if (m.Impacto === "Alto") concienciasAltas.add(m.Conciencia);
        else if (m.Impacto === "Medio") concienciasMedias.add(m.Conciencia);
        else if (m.Impacto === "Bajo") concienciasBajas.add(m.Conciencia);
    });

    // Conteos por Conciencia e Impacto en la sociedad
    const Can_Con_Alt = concienciasAltas.size;
    const Can_Con_Med = concienciasMedias.size;
    const Can_Con_Baj = concienciasBajas.size;

    // Pesos base definidos para Impacto Social
    const Pes_Alt = 0.6;
    const Pes_Med = 0.25;
    const Pes_Baj = 0.15;

    // Ponderación por Impacto de Conciencia (distribuye el peso entre conciencias existentes)
    const Reglas_Impacto = {
        "Alto": Can_Con_Alt > 0 ? (Pes_Alt / Can_Con_Alt) : 0,
        "Medio": Can_Con_Med > 0 ? (Pes_Med / Can_Con_Med) : 0,
        "Bajo": Can_Con_Baj > 0 ? (Pes_Baj / Can_Con_Baj) : 0
    };

    // ==================================================
    // 4. MATRIZ DE PONDERACIONES (ESCENARIOS NIVEL + IMPACTO)
    // ==================================================
    // Esta tabla cruza Nivel (N1, N2, N3) con Impacto (Alto, Medio, Bajo)
    // para calcular el peso unitario de cada pregunta.
    const MatrizPonderacion = [
        { nivel: "N1", imp: "Medio", cant: 0, pondN: PesPor_Niveles.N1.PonderacionN1, pondC: Reglas_Impacto["Medio"] },
        { nivel: "N2", imp: "Medio", cant: 0, pondN: PesPor_Niveles.N2.PonderacionN2, pondC: Reglas_Impacto["Medio"] },
        { nivel: "N3", imp: "Medio", cant: 0, pondN: PesPor_Niveles.N3.PonderacionN3, pondC: Reglas_Impacto["Medio"] },

        { nivel: "N3", imp: "Alto",  cant: 0, pondN: PesPor_Niveles.N3.PonderacionN1, pondC: Reglas_Impacto["Alto"] },
        { nivel: "N1", imp: "Alto",  cant: 0, pondN: PesPor_Niveles.N1.PonderacionN2, pondC: Reglas_Impacto["Alto"] },
        { nivel: "N2", imp: "Alto",  cant: 0, pondN: PesPor_Niveles.N2.PonderacionN3, pondC: Reglas_Impacto["Alto"] },

        { nivel: "N1", imp: "Bajo",  cant: 0, pondN: PesPor_Niveles.N1.PonderacionN1, pondC: Reglas_Impacto["Bajo"] },
        { nivel: "N3", imp: "Bajo",  cant: 0, pondN: PesPor_Niveles.N3.PonderacionN2, pondC: Reglas_Impacto["Bajo"] },
        { nivel: "N2", imp: "Bajo",  cant: 0, pondN: PesPor_Niveles.N2.PonderacionN3, pondC: Reglas_Impacto["Bajo"] }
    ];

    // Contamos cuántas preguntas existen en cada escenario (nivel + impacto)
    matrizDatos.forEach(m => {
        const fila = MatrizPonderacion.find(e => e.nivel === m.Nivel && e.imp === m.Impacto);
        if (fila) fila.cant++;
    });

    // ==================================================
    // 5. NORMALIZACIÓN DE PESOS (BASE Y FINAL)
    // ==================================================
    // pondP_Base: peso inicial del escenario
    // pondP_Final: peso final normalizado dentro del sistema
    // pesoUnitario: peso final que se asigna a cada pregunta individual
    let sumaPonderacionP = 0;

    MatrizPonderacion.forEach(e => {
        e.pondP_Base = e.cant * (e.pondN + e.pondC);
        sumaPonderacionP += e.pondP_Base;
    });

    MatrizPonderacion.forEach(e => {
        e.pondP_Final = e.pondP_Base / sumaPonderacionP;
        e.pesoUnitario = (e.pondN + e.pondC) / sumaPonderacionP;
    });


    // ==================================================
    // 6. VALIDACIÓN DE DATOS REGISTRADOS (FORMULARIO)
    // ==================================================
    const tieneDatos = datosRegistro && datosRegistro.respuestas && Array.isArray(datosRegistro.respuestas);

    // Si no hay datos, solo renderizamos el estado vacío y salimos
    if (!tieneDatos) {
        ResultadosSIMCHS(null, matrizDatos, false);
        return;
    }


    // ==================================================
    // 7. EJECUCIÓN DEL MOTOR DE CÁLCULO
    // ==================================================
    const datosProcesados = CalculadoraSIMCHS(matrizDatos, datosRegistro.respuestas, MatrizPonderacion);


    // ==================================================
    // 8. RESUMEN POR CONCIENCIA (AGRUPACIÓN DE RESULTADOS)
    // ==================================================
    const matrizConciencia = {};

    datosProcesados.forEach(item => {
        const nombreConciencia = item.meta.Conciencia;
        if (!matrizConciencia[nombreConciencia]) {
            matrizConciencia[nombreConciencia] = {
                peso: item.meta.PonderaciónP || 0,
                sumaImpacto: 0
            };
        }
        matrizConciencia[nombreConciencia].sumaImpacto += item.ImpactoP;
    });

    const resumenConciencia = Object.keys(matrizConciencia).map(nombre => {
        const datos = matrizConciencia[nombre];
        const valorPorcentaje = (datos.sumaImpacto * 100);
        return {
            conciencia: nombre,
            peso: datos.peso,
            valor: valorPorcentaje.toFixed(2) + "%"
        };
    });


    // ==================================================
    // 9. ENVÍO AL MOTOR DE RESULTADOS (RENDER FINAL)
    // ==================================================
    ResultadosSIMCHS(datosProcesados, matrizDatos, true, MatrizPonderacion, resumenConciencia);
}

//========================================================
// 2. Función para Calcular la Variables de las matrices||
//========================================================
function CalculadoraSIMCHS(matriz, respuestas, tablaPesos) {

    return respuestas.map(rta => {
        // ==================================================
        // 1. METADATA DE LA PREGUNTA (Matriz SIMCH-S)
        // ==================================================
        const meta = matriz.find(m => m.Item === Number(rta.item)) || {};
        // ==================================================
        // 2. ESCENARIO DE PESO (Nivel + Impacto)
        // ==================================================
        const escenario = tablaPesos.find(e => e.nivel === meta.Nivel && e.imp === meta.Impacto);
        const pesoReal = escenario ? escenario.pesoUnitario : 0;
        // ==================================================
        // 3. VALOR CALCULADO (CON INVERSIÓN SI APLICA)
        // ==================================================
        let valorCalculado = Number(rta.valor);
        if (meta.P_Invertida === true || meta.P_Invertida === "true") {
            valorCalculado = 6 - valorCalculado;
        }
        // ==================================================
        // 4. NORMALIZACIÓN DEL VALOR (ESCALA 1 A 5 → 0 A 1)
        // ==================================================
        const NormalizaP = (valorCalculado - 1) / 4;
        // ==================================================
        // 5. IMPACTO FINAL POR PREGUNTA (NORMALIZADO * PESO)
        // ==================================================
        const ImpactoP = NormalizaP * pesoReal;
        // ==================================================
        // 6. RETORNO FINAL (RESPUESTA ENRIQUECIDA)
        // ==================================================
        return {
            ...rta,
            valorCalculado,
            ImpactoP,
            NormalizaP,
            meta: { ...meta, PonderaciónP: pesoReal }
        };
    });
}

//=====================================================
// 3.1. Constructur de Vista para el informe Personal||
//=====================================================
function ConsInfPersonalSIMCHS(datosCalculados) {
    // ==================================================
    // 1. VARIABLES BASE DEL PERFIL (CÁLCULOS PRINCIPALES)
    // ==================================================
    let estado = "";
    let claseColor = "";
    let mensaje = "";

    const totalImpacto = datosCalculados.reduce((acc, item) => acc + item.ImpactoP, 0);
    const porcentajeFinal = (totalImpacto * 100);


    // ==================================================
    // 2. CLASIFICACIÓN DEL PERFIL (ESTADO FINAL)
    // ==================================================
    if (porcentajeFinal < 40) {
        estado = "Perfil crítico";
        claseColor = "#dc3545"; // Rojo
        mensaje = "Se recomienda fortalecer procesos de autorregulación y conciencia personal.";
    } else if (porcentajeFinal < 60) {
        estado = "Perfil en desarrollo";
        claseColor = "#ffc107"; // Amarillo
        mensaje = "El perfil muestra desarrollo medio con oportunidades de mejora.";
    } else if (porcentajeFinal < 80) {
        estado = "Perfil adecuado";
        claseColor = "#17a2b8"; // Azul/Cian
        mensaje = "Existe un nivel funcional adecuado de desarrollo humano.";
    } else {
        estado = "Perfil óptimo";
        claseColor = "#28a745"; // Verde
        mensaje = "El perfil evidencia alto nivel de integración personal y conciencia.";
    }


    // ==================================================
    // 3. BLOQUES HTML (CONSTRUCCIÓN MODULAR)
    // ==================================================

    // --- Tarjeta principal del perfil ---
    const html_Perfil = `
        <div class="card border-0 shadow-sm mb-4 text-center">
            <div class="card-body text-center p-4">
                <h4 class="text-secondary fw-light">Perfil Humano SIMCH-S</h4>

                <div class="display-2 fw-bold my-2" style="color: #333;">
                    ${porcentajeFinal.toFixed(2)}%
                </div>
                
                <div class="py-2 px-4 rounded-pill d-inline-block w-100 fw-bold mb-3" 
                     style="background-color: ${claseColor}; color: ${porcentajeFinal >= 40 && porcentajeFinal < 60 ? '#000' : '#fff'}; transition: all 0.5s;">
                    ${estado.toUpperCase()}
                </div>

                <p class="text-muted mb-0">
                    ${mensaje}
                </p>
            </div>
        </div>
    `;


    // --- Radar (placeholder por ahora) ---
    const html_Radar = `
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body text-center p-4">
                <h5 class="text-secondary fw-light">Radar de Conciencias</h5>
                <div id="radarSIMCHS" style="height: 350px;"></div>
            </div>
        </div>
    `;


    // ==================================================
    // 4. RETORNO FINAL (UNIFICACIÓN)
    // ==================================================
    return `
        ${html_Perfil}
        ${html_Radar}
    `;
}

//======================================================
// 3.2. Constructur de Vista para el informe Auditoria||
//======================================================
function ConstAuditoriaSIMCHS(datosCalculados) {
    // ==================================================
    // CONSTRUCTOR DE AUDITORÍA
    // Genera tarjetas por cada pregunta comparando:
    // - Matriz de referencia (SIMCH-S)
    // - Respuesta del formulario (usuario)
    // ==================================================
    return datosCalculados.map(item => {
        // ==================================================
        // 1. HEADER DE TARJETA (ITEM ACTUAL)
        // ==================================================
        const html_Header = `
            <div class="card-header bg-primary text-white py-1">
                <small>Comparativa Ítem #${item.item}</small>
            </div>
        `;
        // ==================================================
        // 2. TARJETA IZQUIERDA (MATRIZ DE REFERENCIA)
        // ==================================================
        const html_MatrizReferencia = `
            <div class="col-md-6 border-end">
                <div class="p-2" style="font-size: 0.75rem; background-color: #f8f9fa;">
                    <p class="mb-1 text-primary fw-bold">🔍 MATRIZ DE REFERENCIA</p>
                    <p class="mb-1"><strong>Pregunta:</strong> ${item.meta.Pregunta || 'No encontrada'}</p>
                    <p class="mb-1">
                        <strong>Nivel:</strong> ${item.meta.Nivel} - 
                        <span class="text-muted">${item.meta.CriterioN}</span>
                    </p>
                    <p class="mb-1">
                        <strong>Invertida:</strong> ${item.meta.P_Invertida} | 
                        <strong>Impacto:</strong> ${item.meta.Impacto}
                    </p>
                    <p class="mb-1">
                        <strong>Conciencia:</strong> ${item.meta.Conciencia} - 
                        ${item.meta.CriterioC}
                    </p>
                    <div class="mt-2 p-1 bg-white border rounded">
                        <code class="d-block">P.N: ${(item.meta.PonderacionN || 0).toFixed(5)}</code>
                        <code class="d-block">P.C: ${(item.meta.PonderacionC || 0).toFixed(5)}</code>
                        <code class="d-block text-danger fw-bold">P.P (Peso): ${item.meta.PonderaciónP.toFixed(5)}</code>
                    </div>
                </div>
            </div>
        `;

        // ==================================================
        // 3. TARJETA DERECHA (RESPUESTA DEL FORMULARIO)
        // ==================================================
        const html_RespuestaFormulario = `
            <div class="col-md-6">
                <div class="p-2" style="font-size: 0.75rem;">
                    <p class="mb-1 text-info fw-bold">📝 RESPUESTA DEL FORMULARIO</p>
                    <p class="mb-1">
                        <strong>Pregunta:</strong> ${item.pregunta || '---'}
                    </p>
                    <p class="mb-1">
                        <strong>Valor Marcado:</strong> 
                        <span class="badge bg-info text-dark">${item.valor}</span>
                    </p>
                    <p class="mb-1"><strong>Valor Calculado:</strong> ${item.valorCalculado}</p>
                    <p class="mb-1"><strong>Valor Normalizado:</strong> ${item.NormalizaP}</p>
                    <div class="mt-2 p-1 bg-light border rounded">
                        <p class="mb-0 fw-bold text-success">Cálculo en Memoria:</p>
                        <code class="d-block">
                            I.P = ${item.NormalizaP.toFixed(5)} * ${item.meta.PonderaciónP.toFixed(5) || 0} = ${item.ImpactoP.toFixed(5)}
                        </code>
                    </div>
                </div>
            </div>
        `;

        // ==================================================
        // 4. TARJETA FINAL COMPLETA (UNIFICACIÓN)
        // ==================================================
        const html_TarjetaFinal = `
            <div class="card mb-3 shadow-sm border-0">
                
                ${html_Header}

                <div class="row g-0">
                    ${html_MatrizReferencia}
                    ${html_RespuestaFormulario}
                </div>

            </div>
        `;

        return html_TarjetaFinal;
    }).join('');
}

function ResultadosSIMCHS(datosProcesados, matrizDatos, tieneDatos, MatrizPonderacion,resumenConciencia) {
    // ==================================================
    // 1. CONTENEDORES HTML (INFORME Y AUDITORÍA)
    // ==================================================
    const contInforme = document.getElementById("Informe_SIMCHS_Personal");
    const contAuditoria = document.getElementById("Auditoria_SIMCHS_Personal");


    // ==================================================
    // 2. BLOQUE A: INFORME PERSONAL (USUARIO FINAL)
    // ==================================================
    if (contInforme) {

        // Si hay datos, construimos el informe
        if (tieneDatos && typeof ConsInfPersonalSIMCHS === 'function') {
            contInforme.innerHTML = ConsInfPersonalSIMCHS(datosProcesados);
        } 
        
        // Si no hay datos, limpiamos
        else {
            contInforme.innerHTML = "";
        }
    }


    // ==================================================
    // 3. BLOQUE B: AUDITORÍA (VIGILANTE)
    // ==================================================
    // Si no existe el contenedor de auditoría, no seguimos
    if (!contAuditoria) return;


    // ==================================================
    // 4. VALIDACIÓN: SI NO HAY DATOS, MOSTRAMOS MENSAJE
    // ==================================================
    if (!tieneDatos) {
        contAuditoria.innerHTML = `
            <div class="alert alert-secondary text-center">
                Completa el formulario para ver el cruce de datos.
            </div>
        `;
        return;
    }


    // ==================================================
    // 5. BLOQUE TABLA DE PONDERACIONES (AUDITORÍA)
    // ==================================================
    let html_TablaPonderacion = "";

    if (MatrizPonderacion) {

        const html_FilasTabla = MatrizPonderacion.map(e => `
            <tr>
                <td class="fw-bold">${e.nivel}</td>
                <td>${e.imp}</td>
                <td class="text-center">${e.cant}</td>
                <td>${e.pondN.toFixed(4)}</td>
                <td>${e.pondC.toFixed(4)}</td>
                <td class="text-success fw-bold">${e.pesoUnitario.toFixed(6)}</td>
            </tr>
        `).join('');

        html_TablaPonderacion = `
            <div class="table-responsive mb-4">
                <p class="text-uppercase fw-bold text-primary small mb-2">
                    📊 Tabla de Ponderaciones (Auditoría de Escenarios)
                </p>

                <table class="table table-sm table-bordered bg-white" style="font-size: 0.7rem;">
                    <thead class="table-dark">
                        <tr>
                            <th>Nivel</th>
                            <th>Impacto</th>
                            <th class="text-center">Cant.</th>
                            <th>Pond. N</th>
                            <th>Pond. C</th>
                            <th>Peso Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${html_FilasTabla}
                    </tbody>
                </table>
            </div>
            <hr>
        `;
    }


    // ==================================================
    // 6. BLOQUE JSON (DEBUG VISUAL)
    // ==================================================
    const html_DebugJSON = `
        <div class="row">
            <div class="col-6">
                <small class="fw-bold">Matriz JSON</small>
                <pre class="bg-dark text-success p-2 rounded" 
                     style="max-height: 100px; overflow-y: auto; font-size: 0.7rem;">
                    ${JSON.stringify(matrizDatos.slice(0, 2), null, 2)}...
                </pre>
            </div>

            <div class="col-6">
                <small class="fw-bold">Respuestas JSON</small>
                <pre class="bg-dark text-info p-2 rounded" 
                     style="max-height: 100px; overflow-y: auto; font-size: 0.7rem;">
                    ${JSON.stringify(datosProcesados.slice(0, 2), null, 2)}...
                </pre>
            </div>
        </div>
        <hr>
    `;


    // ==================================================
    // 7. BLOQUE TARJETAS DETALLADAS (CRUCE INDIVIDUAL)
    // ==================================================
    const html_TarjetasAuditoria = (typeof ConstAuditoriaSIMCHS === 'function')
        ? ConstAuditoriaSIMCHS(datosProcesados)
        : `<div class="text-center text-muted p-3">
                <small>[ Módulo de tarjetas de auditoría desactivado ]</small>
           </div>`;


    // ==================================================
    // 8. CARD FINAL DE AUDITORÍA (CONTENEDOR PRINCIPAL)
    // ==================================================
    const html_AuditoriaFinal = `
        <div class="card shadow-sm border-0 mb-4">

            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0">🕵️ Vigilante de Variables (Auditoría)</h5>

                <span class="badge bg-success">
                    Datos Detectados
                </span>
            </div>

            <div class="card-body bg-light">

                ${html_TablaPonderacion}

                ${html_DebugJSON}

                <h6 class="text-uppercase fw-bold text-secondary small mb-3">
                    🗂️ Detalle de Cruce Individual
                </h6>

                <div id="cruce-detallado" 
                     style="max-height: 600px; overflow-y: auto; padding-right: 10px;">
                    ${html_TarjetasAuditoria}
                </div>

            </div>

            <div class="card-footer text-muted small d-flex justify-content-between">
                <span>Estado: Vigilando...</span>
                <span>Actualizado: ${new Date().toLocaleTimeString()}</span>
            </div>

        </div>
    `;


    // ==================================================
    // 9. RENDER FINAL (INSERTA EN EL HTML)
    // ==================================================
    contAuditoria.innerHTML = html_AuditoriaFinal;
}
*/