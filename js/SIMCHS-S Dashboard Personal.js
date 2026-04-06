//========================================================
// 1. FUNCIÓN PRINCIPAL (PREPARA VARIABLES Y MATRICES BASE)
//========================================================
function VariablesSIMCHS(datosRegistro) {
    // 1.1. MATRIZ BASE DEL SISTEMA (PREGUNTAS SIMCH-S)
    const Matriz_Preguntas = (typeof Matriz !== 'undefined') ? Matriz.Preguntas : [];
    const Matriz_Recomendaciones = (typeof Matriz_R !== 'undefined') ? Matriz_R.Recomendaciones : [];
    const Total_Preguntas = Matriz_Preguntas.length;

    // 1.2. MATRIZ BASE DEL FORMULARIO (RESPUESTAS USUARIO)
    const Matriz_Respuestas = (datosRegistro && Array.isArray(datosRegistro.respuestas))
        ? datosRegistro.respuestas
        : [];
    
    // 1.3. MATRIZ DE IMPACTO (PESOS + CONCIENCIAS ÚNICAS) = Objetivo: Crear una matriz con 3 filas (Alto, Medio, Bajo) donde podamos calcular el peso por conciencia (ImpactoP).
    const Matriz_Impacto = [
        { Impacto: "Alto",  Peso: 0.60, N_conciencias: 0, Cantidad_Preguntas: 0, Conciencias: [], ImpactoP: 0 },
        { Impacto: "Medio", Peso: 0.25, N_conciencias: 0, Cantidad_Preguntas: 0, Conciencias: [], ImpactoP: 0 },
        { Impacto: "Bajo",  Peso: 0.15, N_conciencias: 0, Cantidad_Preguntas: 0, Conciencias: [], ImpactoP: 0 }
    ];

    // 1.3.1 CONTAR PREGUNTAS POR IMPACTO
    Matriz_Impacto.forEach(fila => {
        fila.Cantidad_Preguntas = Matriz_Preguntas.filter(p => p.Impacto === fila.Impacto).length;
    });

    // 1.3.2 OBTENER CONCIENCIAS ÚNICAS POR IMPACTO
    Matriz_Impacto.forEach(fila => {
        const concienciasSet = new Set();
        Matriz_Preguntas.forEach(p => {
            if (p.Impacto === fila.Impacto) {
                concienciasSet.add(p.Conciencia);
            }
        });
        fila.Conciencias = Array.from(concienciasSet);
        fila.N_conciencias = fila.Conciencias.length;
    });

    // 1.3.3 CALCULAR ImpactoP (Peso / N_conciencias)
    Matriz_Impacto.forEach(fila => {
        fila.ImpactoP = (fila.N_conciencias > 0)
            ? (fila.Peso / fila.N_conciencias)
            : 0;
    });

    // 1.4. MATRIZ DE NIVEL (PONDERACIÓN POR NIVEL N1, N2, N3) = Objetivo: calcular el peso porcentual de cada nivel según cantidad de preguntas.
    const Matriz_Nivel = [
        { NivelDimension: "Cognición",   Nivel: "N1", Cantidad_Preguntas: 0, PonderacionN: 0 },
        { NivelDimension: "Emoción",     Nivel: "N2", Cantidad_Preguntas: 0, PonderacionN: 0 },
        { NivelDimension: "Conductual",  Nivel: "N3", Cantidad_Preguntas: 0, PonderacionN: 0 }
    ];

    // 1.4.1 CONTAR PREGUNTAS POR NIVEL
    Matriz_Nivel.forEach(fila => {
        fila.Cantidad_Preguntas = Matriz_Preguntas.filter(p => p.Nivel === fila.Nivel).length;
    });

    // 1.4.2 CALCULAR PONDERACIÓN POR NIVEL
    Matriz_Nivel.forEach(fila => {
        fila.PonderacionN = (Total_Preguntas > 0)
            ? (fila.Cantidad_Preguntas / Total_Preguntas)
            : 0;
    });

    // 1.5. MATRIZ PONDERACIÓN POR PREGUNTA (NIVEL + IMPACTO) = Objetivo: construir los 9 escenarios Nivel + Impacto y calcular PonderaciónP
    const Matriz_Ponderacion_Preguntas = [];
    // 1.5.1 CREAR LOS 9 ESCENARIOS (COMBINATORIA)
    Matriz_Nivel.forEach(nivelFila => {
        Matriz_Impacto.forEach(impactoFila => {
            Matriz_Ponderacion_Preguntas.push({
                Nivel: nivelFila.Nivel,
                Impacto: impactoFila.Impacto,
                Cantidad: 0, // Conteo preguntas por escenario (Nivel + Impacto)
                PonderacionN: nivelFila.PonderacionN,
                ImpactoP: impactoFila.ImpactoP,
                Impacto_Nivel: 0,
                Impacto_Nivel_Cant: 0,
                PonderaciónP: 0
            });
        });
    });

    // 1.5.2 CONTAR CANTIDAD DE PREGUNTAS POR ESCENARIO
    Matriz_Ponderacion_Preguntas.forEach(escenario => {

        escenario.Cantidad = Matriz_Preguntas.filter(p =>
            p.Nivel === escenario.Nivel &&
            p.Impacto === escenario.Impacto
        ).length;

    });
    
    // 1.5.3 CALCULAR Impacto_Nivel (PonderacionN + ImpactoP)
    Matriz_Ponderacion_Preguntas.forEach(escenario => {
        escenario.Impacto_Nivel = escenario.PonderacionN + escenario.ImpactoP;
    });
    
    // 1.5.4 CALCULAR Impacto_Nivel_Cant (Impacto_Nivel * Cantidad)
    Matriz_Ponderacion_Preguntas.forEach(escenario => {
        escenario.Impacto_Nivel_Cant = escenario.Impacto_Nivel * escenario.Cantidad;
    });

    // 1.5.5 SUMA TOTAL PARA NORMALIZACIÓN
    const Suma_Impacto_Nivel_Cant = Matriz_Ponderacion_Preguntas.reduce(
        (acc, escenario) => acc + escenario.Impacto_Nivel_Cant,
        0
    );

    // 1.5.6 CALCULAR PonderaciónP FINAL = Fórmula: PonderaciónP = Impacto_Nivel / Suma_Impacto_Nivel_Cant
    Matriz_Ponderacion_Preguntas.forEach(escenario => {
        escenario.PonderaciónP = (Suma_Impacto_Nivel_Cant > 0)
            ? (escenario.Impacto_Nivel / Suma_Impacto_Nivel_Cant)
            : 0;

    });

    // 1.6. MATRIZ GENERAL (UNIÓN TOTAL DEL SISTEMA) = Contiene toda la información consolidada: Pregunta + Nivel + Impacto + Conciencia + Pesos + Respuesta
    const Matriz_General = Matriz_Preguntas.map(pregunta => {
        // 1.6.1. Buscar Respuesta del usuario (si existe)
        const respuesta = Matriz_Respuestas.find(r => Number(r.item) === pregunta.Item) || null;
        // 1.6.2. Buscar datos del Nivel (Dimensión + PonderaciónN)
        const filaNivel = Matriz_Nivel.find(n => n.Nivel === pregunta.Nivel) || null;
        // 1.6.3. Buscar datos del Impacto (ImpactoP por conciencia)
        const filaImpacto = Matriz_Impacto.find(i => i.Impacto === pregunta.Impacto) || null;
        // 1.6.4. Buscar PonderaciónP (Peso final por pregunta) Cruce: Nivel + Impacto
        const filaPesoPregunta = Matriz_Ponderacion_Preguntas.find(pp =>
            pp.Nivel === pregunta.Nivel &&
            pp.Impacto === pregunta.Impacto
        ) || null;
        // 1.6.5. Generamos Replica Captamos Respuesta
        const Respuesta = respuesta ? Number(respuesta.valor) : 0;
        const Replica = (Number(pregunta.P_Invertida) === 1)
            ? (6 - Respuesta)
            : Respuesta;
        const Normalizacion = (Replica - 1) / 4;
        const Puntaje_Perfil = Normalizacion * (filaPesoPregunta ? filaPesoPregunta.PonderaciónP : 0);
        // 1.6.6. Retorno final (fila general)
        return {
            // Datos Matriz Preguntas
            Item: pregunta.Item,
            Pregunta: pregunta.Pregunta,
            Nivel: pregunta.Nivel,
            CriterioN: pregunta.CriterioN,
            P_Invertida: pregunta.P_Invertida,
            Conciencia: pregunta.Conciencia,
            CriterioC: pregunta.CriterioC,
            Impacto: pregunta.Impacto,
            // Datos Matriz Nivel
            Dimension: filaNivel ? filaNivel.NivelDimension : null,
            PonderacionN: filaNivel ? filaNivel.PonderacionN : 0,
            // Datos Matriz Impacto
            ImpactoP: filaImpacto ? filaImpacto.ImpactoP : 0,
            // Peso Final por Pregunta
            PonderaciónP: filaPesoPregunta ? filaPesoPregunta.PonderaciónP : 0,
            // Respuesta usuario
            Respuesta: Respuesta,
            Replica: Replica,
            Normalizacion: Normalizacion,
            Puntaje_Perfil: Puntaje_Perfil
        };
    });

    // 1.7 MATRIZ CONCIENCIA = Objetivo: Crear la Matriz de conciencias, para validar el aporte de cada conciencia en la sociedad.
    const nombreConciencia = [...new Set(Matriz_General.map(m => m.Conciencia))];
    const Matriz_Conciencia = nombreConciencia.map(nombre => {
        const filas = Matriz_General.filter(m => m.Conciencia === nombre);
        const cantContestado = filas.filter(f => f.Respuesta > 0).length; //Cantidad de respuestas obteniddas
        const sumaNorm = filas.reduce((acc, curr) => acc + (curr.Normalizacion || 0), 0);
        const sumaPerfil = filas.reduce((acc, curr) => acc + (curr.Puntaje_Perfil || 0), 0);
        
        const PorcentajeC = cantContestado > 0 ? ((sumaNorm / 10) - sumaPerfil) * 100: 0;
        const PorcentajeI = cantContestado > 0 ? sumaPerfil * 100: 0;

        const recomendacionesDimension = Matriz_Recomendaciones.filter(r => r.Dimension === nombre);

        let recomendacionFinal = null;

        if (recomendacionesDimension.length > 0) {
            recomendacionFinal = recomendacionesDimension.reduce((mejor,actual) => {
                const distMejor = Math.abs(PorcentajeC - mejor.Porc_Rang);
                const distActual = Math.abs(PorcentajeC - actual.Porc_Rang);
                return distActual < distMejor ? actual : mejor;
            });
        }

        return {
            Conciencia: nombre,
            PorcentajeC: PorcentajeC,
            PorcentajeI: PorcentajeI,
            Recomendaciones: recomendacionFinal
        };
    });


    //1.8 Calculamos Render y ejecutamos resultados para mostrar.
    const render = RenderSIMCHS(Matriz_Impacto, Matriz_Nivel, Matriz_Ponderacion_Preguntas, Matriz_General, Matriz_Conciencia);
    const renderGraficos = () => {
        GraficarRadarSIMCHS(Matriz_Conciencia);
        // Aquí podremos agregar en el futuro: GraficarBarras(Matriz_Nivel);
    };
    ResultadosSIMCHS(render,renderGraficos);
}

//========================================================
// 2. FUNCIÓN PARA CALCULAR RESULTADOS POR PREGUNTA
//========================================================
function CalculadoraSIMCHS() {
    
    
}

//----------------------------------------------------------------------------------
//_____________________________3. Constructores de HTML___________________________||
//----------------------------------------------------------------------------------

//=====================================================
// 3.1. CONSTRUCTOR DE VISTA PARA INFORME PERSONAL
//=====================================================
function ConsInfPersonalSIMCHS(Matriz_General, Matriz_Conciencia) {
    // Variables de lestudio
    const CatnCont = Matriz_General.reduce((acc, curr) => acc + (curr.Respuesta || 0), 0);
    let indiceGlobal = 0;
    let estado = "";
    let clase = "";
    let interprete = "";

    if (CatnCont !== 0) {
        indiceGlobal = Matriz_General.reduce((acc, curr) => acc + (curr.Puntaje_Perfil || 0), 0);
    }
    if ((indiceGlobal * 100) < 40) {
        estado = "Perfil crítico";
        clase = "bg-danger bg-gradient text-white";
        interprete = "Se recomienda fortalecer procesos de autorregulación y conciencia personal."
    }
    else if ((indiceGlobal * 100) < 60) {
        estado = "Perfil en desarrollo";
        clase = "bg-warning bg-gradient text-dark";
        interprete ="El perfil muestra desarrollo medio con oportunidades de mejora.";
    }
    else if ((indiceGlobal * 100) < 80) {
        estado = "Perfil adecuado";
        clase = "bg-info bg-gradient text-white";
        interprete = "Existe un nivel funcional adecuado de desarrollo humano.";
    }
    else {
        estado = "Perfil óptimo";
        clase = "bg-success bg-gradient text-white";
        interprete = "El perfil evidencia alto nivel de integración personal y conciencia.";
    }

    const html_Tarjeta_Perfil = `
        <div class="card shadow-sm p-4 text-center animate__animated animate__fadeIn">
            <h3 class="mb-3">Perfil Humano SIMCH-S</h3>
            <div class="display-4 fw-bold mb-3">
                ${(indiceGlobal * 100).toFixed(1)}%
            </div>
            <div class="badge rounded-pill ${clase} p-2 fs-6">
                ${estado}
            </div>
            <p class="mt-3 text-muted">
                ${interprete}
            </p>
        </div>
    `;

    const html_Tarjeta_Conciencias = `
        <div class="card mb-3">
            <div id="radarChart" style="width: 100%; height: 400px;"></div>
            <div class="card-body">
                <h5 class="card-title">Grafico de Radar</h5>
                <p class="card-text">Interpretación.</p>
                <p class="card-text"><small class="text-muted">Descripción breve</small></p>
            </div>
        </div>
    `;

    const html_Tarjetas_Recomendaciones = Matriz_Conciencia.map(row => {
        if (!row.Recomendaciones) return "";
        return `
            <div class="card shadow-sm mb-3 animate__animated animate__fadeIn">
                <div class="card-header bg-dark text-white">
                    <strong>${row.Conciencia}</strong> 
                    <span class="${clase} ms-2">${row.PorcentajeC.toFixed(1)}%</span>
                </div>
                <div class="card-body">
                    <p><b>📚 Libro:</b> ${row.Recomendaciones.Herramienta_Literaria}</p>
                    <p><b>💡 Idea:</b> ${row.Recomendaciones.Frase_Literaria}</p>
                    <p><b>🎥 Visual:</b> ${row.Recomendaciones.Herramientas_Visuales}</p>
                    <p><b>🎧 Auditivo:</b> ${row.Recomendaciones.Herramientas_Auditivas}</p>
                    <p><b>🧩 Acción:</b> ${row.Recomendaciones.Herramientas_Accion}</p>
                </div>
            </div>
        `;
    }).join("");

    const html_Tarjeta_Recomendaciones = `
        <div class="mb-4">
            <h6 class="text-uppercase fw-bold text-primary small mb-2">
                🎯 Recomendaciones por Conciencia
            </h6>
            ${html_Tarjetas_Recomendaciones}
        </div>
    `;

    // 3.2.4. TABLA MATRIZ DE CONCIENCIA
    const filasConciencia = Matriz_Conciencia.map(row => `
        <tr>
            <td class="fw-bold">${row.Conciencia}</td>
            <td class="text-center">${row.PorcentajeC.toFixed(4)}%</td>
            <td class="text-center">${row.PorcentajeI.toFixed(4)}%</td>
        </tr>
    `).join("");

    const html_TablaConciencias = `
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-ligth table-striped table-hover bg-white" style="font-size: 0.75rem;">
                <thead class="align-middle table-dark">
                    <tr>
                        <th class="text-center">Conciencia</th>
                        <th class="text-center">Porcentaje Impacto por Conciencia</th>
                        <th class="text-center">Porcentaje Impacto General</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasConciencia}
                </tbody>
            </table>
        </div>
    `;

    // 3.1.6. HEADER DE INFORME PERSONAL
    const html_Header = `
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">🫂 Índice de Sincronía Social</h5>
        </div>
    `;
    // 3.1.7. SECCION PARA TARJETA DE PERFIL GLOBAL
    const html_SeccionPerfil = `
        <div class="mb-4">
            ${html_Tarjeta_Perfil}
        </div>
    `;
    
    const html_SeccionTarjetaConciencia = `
        <div class="mb-4">
            ${html_Tarjeta_Conciencias}
        </div>
    `;

    const html_SeccionMConciencia = `
        <div class="mb-4">
            <h6 class="text-uppercase fw-bold text-primary small mb-2">
                📌 Matriz de conciencias
            </h6>
            ${html_TablaConciencias}
        </div>
    `;

    const html_SeccionTarjetaRecomendacion = `
        <div class="mb-4">
            ${html_Tarjeta_Recomendaciones}
        </div>
    `;

    // 3.1.8. BODY FINAL
    if (CatnCont !== 0) {
        html_Body = `
            <div class="card-body bg-light">
                ${html_SeccionPerfil}
                <hr>
                ${html_SeccionTarjetaConciencia}
                <hr>
                ${html_SeccionMConciencia}
                <hr>
                ${html_SeccionTarjetaRecomendacion}
            </div>
        `;
    } else {
        html_Body = `
            <div class="card bg-dark text-white rounded overflow-hidden animate__animated animate__fadeIn" 
                style="max-height: 400px; border-radius: 15px;"> 
                
                <img src="https://img.freepik.com/foto-gratis/interior-sala-grunge-3d_1048-7935.jpg?semt=ais_incoming&w=740&q=80" 
                    class="card-img" 
                    alt="Sincronía en espera" 
                    style="opacity: 0.4; object-fit: cover; height: 300px; width: 100%;">
                
                <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center p-4">
                    <div class="p-4" style="
                        background: rgba(0, 0, 0, 0.6); 
                        border-radius: 20px; 
                        backdrop-filter: blur(8px); 
                        border: 1px solid rgba(0, 212, 255, 0.5); 
                        box-shadow: 0 0 15px rgba(0, 212, 255, 0.4), 0 0 30px rgba(0, 212, 255, 0.2);
                        opacity:0.5;
                    ">
                        <h4 class="card-title fw-bold text-uppercase mb-2" style="letter-spacing: 3px; color: #00d4ff; text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);">
                            <i class="bi bi-activity me-2"></i>Sincronía en espera
                        </h4>
                        <p class="card-text mb-1 fw-light">Tu mapa de conciencia aún no ha sido trazado.</p>
                        <p class="card-text small opacity-75">Por favor, responde las preguntas para iniciar el escaneo SIMCH-S.</p>
                        <hr class="my-3" style="width: 50%; margin: 0 auto; border-color: rgba(0, 212, 255, 0.3);">
                        <p class="card-text">
                            <small style="color: #00d4ff; font-weight: bold; opacity: 0.8;">
                                Última actualización: ${new Date().toLocaleTimeString()}
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 3.9. FOOTER
    const html_Footer = `
        <div class="card-footer text-muted small d-flex justify-content-between">
            <span>Estado: Vigilando...</span>
            <span>Actualizado: ${new Date().toLocaleTimeString()}</span>
        </div>
    `;

    // 3.10. RETORNO FINAL
    return `
        <div class="card shadow-sm border-0 mb-4">
            ${html_Header}
            ${html_Body}
            ${html_Footer}
        </div>
    `;
}

//======================================================
// 3.2. CONSTRUCTOR DE VISTA PARA INFORME AUDITORÍA
//======================================================
function ConstAuditoriaSIMCHS(Matriz_Impacto, Matriz_Nivel, Matriz_Ponderacion_Preguntas, Matriz_General, Matriz_Conciencia) {
    // 3.2.1. TABLA MATRIZ IMPACTO
    const filasImpacto = Matriz_Impacto.map(row => `
        <tr>
            <td class="fw-bold">${row.Impacto}</td>
            <td class="text-center">${row.Peso.toFixed(4)}</td>
            <td class="text-center">${row.N_conciencias}</td>
            <td class="text-center">${row.Cantidad_Preguntas}</td>
            <td style="font-size: 0.7rem;">${row.Conciencias.join("; ")}</td>
            <td class="text-success fw-bold text-center">${row.ImpactoP.toFixed(6)}</td>
        </tr>
    `).join("");

    const html_TablaImpacto = `
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-ligth table-striped table-hover bg-white" style="font-size: 0.75rem;">
                <thead class="align-middle table-dark">
                    <tr>
                        <th>Impacto</th>
                        <th class="text-center">Peso</th>
                        <th class="text-center">N Conciencias</th>
                        <th class="text-center">Cant Preguntas</th>
                        <th class="text-center">Conciencias</th>
                        <th class="text-center">ImpactoP</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasImpacto}
                </tbody>
            </table>
        </div>
    `;
    
    // 3.2.2. TABLA MATRIZ NIVEL
    const filasNivel = Matriz_Nivel.map(row => `
        <tr>
            <td class="fw-bold">${row.NivelDimension}</td>
            <td class="text-center">${row.Nivel}</td>
            <td class="text-success fw-bold text-center">${row.PonderacionN.toFixed(6)}</td>
        </tr>
    `).join("");

    const html_TablaNivel = `
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-ligth table-striped table-hover bg-white" style="font-size: 0.75rem;">
                <thead class="align-middle table-dark">
                    <tr>
                        <th>Nivel Dimensión</th>
                        <th class="text-center">Nivel</th>
                        <th class="text-center">PonderaciónN</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasNivel}
                </tbody>
            </table>
        </div>
    `;

    // 3.2.3 TABLA MATRIZ PONDERACIÓN PREGUNTAS (9 ESCENARIOS)
    const filasPonderacion = Matriz_Ponderacion_Preguntas.map(row => `
        <tr>
            <td class="fw-bold">${row.Nivel}</td>
            <td>${row.Impacto}</td>
            <td class="text-center">${row.Cantidad}</td>
            <td class="text-center">${row.PonderacionN.toFixed(6)}</td>
            <td class="text-center">${row.ImpactoP.toFixed(6)}</td>
            <td class="text-center text-primary fw-bold">${row.Impacto_Nivel.toFixed(6)}</td>
            <td class="text-center text-primary fw-bold">${row.Impacto_Nivel_Cant.toFixed(6)}</td>
            <td class="text-center text-success fw-bold">${row.PonderaciónP.toFixed(8)}</td>
        </tr>
    `).join("");

    const html_TablaPonderacionPreguntas = `
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-ligth table-striped table-hover bg-white" style="font-size: 0.75rem;">
                <thead class="align-middle table-dark">
                    <tr>
                        <th>Nivel</th>
                        <th>Impacto</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-center">PonderaciónN</th>
                        <th class="text-center">ImpactoP</th>
                        <th class="text-center">Impacto_Nivel</th>
                        <th class="text-center">Impacto_Nivel_Cant</th>
                        <th class="text-center">PonderaciónP</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasPonderacion}
                </tbody>
            </table>
        </div>
    `;
    
    // 3.2.4. TABLA MATRIZ DE CONCIENCIA
    const filasConciencia = Matriz_Conciencia.map(row => `
        <tr>
            <td class="fw-bold">${row.Conciencia}</td>
            <td class="text-center">${row.PorcentajeC.toFixed(4)}%</td>
            <td class="text-center">${row.PorcentajeI.toFixed(4)}%</td>
        </tr>
    `).join("");

    const html_TablaConciencias = `
        <div class="table-responsive">
            <table class="table table-sm table-bordered table-ligth table-striped table-hover bg-white" style="font-size: 0.75rem;">
                <thead class="align-middle table-dark">
                    <tr>
                        <th class="text-center">Conciencia</th>
                        <th class="text-center">Porcentaje Impacto por Conciencia</th>
                        <th class="text-center">Porcentaje Impacto General</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasConciencia}
                </tbody>
            </table>
        </div>
    `;

    // 3.2.5. TARJETAS DETALLADAS (PREGUNTA POR PREGUNTA)
    const html_TarjetasDetalle = Matriz_General.map(item => {
        const invertida = Number(item.P_Invertida) === 1;
        const colorPunto = invertida ? "#dc3545" : "#28a745";
        return `
            <div class="card mb-3 shadow-sm border-0">
                <div class="card-header text-white fw-bold d-flex justify-content-between align-items-center" style="background-color:#0b1f3a;">
                    <span>${item.Item} - ${item.Pregunta}</span>
                    <span style="
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background-color: ${colorPunto};
                        display: inline-block;
                        border: 1px solid #fff;
                    "></span>
                </div>
                <div class="card-body" style="font-size:0.85rem;">
                    <p class="mb-1">
                        <strong>${item.Dimension}:</strong> ${item.Nivel}
                        (<span class="text-muted">${item.CriterioN}</span>)
                        <span class="text-primary fw-bold">${item.PonderacionN}</span>
                    </p>
                    <p class="mb-1">
                        <strong>${item.Conciencia}:</strong>
                        <span class="text-muted">${item.CriterioC}</span>
                    </p>
                    <p class="mb-1">
                        <strong>${item.Impacto}:</strong>
                        <span class="text-success fw-bold">${item.ImpactoP}</span>
                    </p>
                    <p class="mb-1">
                        <strong>Respuesta:</strong>
                        <span class="badge bg-info text-dark">${item.Respuesta}</span>
                    </p>
                    <p class="mb-0">
                        <strong>Ponderación Pregunta:</strong>
                        <span class="text-danger fw-bold">${item.PonderaciónP}</span>
                    </p>
                    <hr class="my-2">
                    <div class="p-3 bg-dark text-white rounded border border-info font-monospace">
                        ${
                            (invertida && item.Respuesta !== 0) ? `Respuesta Convertida = ${item.Replica}<br>` : ""
                        }
                        Fórmulas:<br><hr>
                        <span class="text-info fw-bold"> Normalización (Norm) = (r - 1) / 4 -> </span> 
                            ${(((item.Replica -1)/4) >= 0 ) ? `<span class="text-danger fw-bold">(${item.Replica} - 1) / 4 = </span> <b> ${item.Normalizacion} </b><br>` : `<br>` }
                        <span class="text-success fw-bold">Puntaje Perfil = Norm * ${item.PonderaciónP.toFixed(6)} -> </span>
                            ${(((item.Replica -1)/4) >= 0 ) ? `<span class="text-danger fw-bold">${((item.Replica -1)/4)} * ${item.PonderaciónP.toFixed(6)} = </span> <b> ${item.Puntaje_Perfil} </b><br>` : `<br>` }
                        <br>
                        <span class="text-danger fw-bold"></span>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    const html_SeccionDetalle = `
        <div class="mb-2">
            <h6 class="text-uppercase fw-bold text-secondary small mb-3">
                🗂️ Cruce Individual (Pregunta por Pregunta)
            </h6>
            <div id="auditoria_DetallePreguntas" style="max-height: 600px; overflow-y: auto;">
                ${html_TarjetasDetalle}
            </div>
        </div>
    `;

    // 3.2.6. HEADER DE AUDITORÍA
    const html_Header = `
        <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">🕵️ Auditoría SIMCH-S</h5>
            <span class="badge bg-success">Activo</span>
        </div>
    `;
    // 3.2.7. SECCIONES YA CON TABLAS INCRUSTADAS
    const html_SeccionImpacto = `
        <div class="mb-4">
            <h6 class="text-uppercase fw-bold text-primary small mb-2">
                📌 Matriz de Impacto
            </h6>
            ${html_TablaImpacto}
        </div>
    `;

    const html_SeccionNivel = `
        <div class="mb-4">
            <h6 class="text-uppercase fw-bold text-primary small mb-2">
                📌 Matriz de Nivel
            </h6>
            ${html_TablaNivel}
        </div>
    `;

    const html_SeccionPonderacionPreguntas = `
        <div class="mb-4">
            <h6 class="text-uppercase fw-bold text-primary small mb-2">
                📌 Matriz Ponderación Preguntas (Nivel + Impacto)
            </h6>
            ${html_TablaPonderacionPreguntas}
        </div>
    `;

    const html_SeccionConciencia = `
        <div class="mb-4">
            <h6 class="text-uppercase fw-bold text-primary small mb-2">
                📌 Matriz de Conciencia
            </h6>
            ${html_TablaConciencias}
        </div>
    `;

    // 3.8. BODY FINAL
    const html_Body = `
        <div class="card-body bg-light">
            ${html_SeccionImpacto}
            <hr>
            ${html_SeccionNivel}
            <hr>
            ${html_SeccionPonderacionPreguntas}
            <hr>
            ${html_SeccionConciencia}
            <hr>
            ${html_SeccionDetalle}
        </div>
    `;

    // 3.9. FOOTER
    const html_Footer = `
        <div class="card-footer text-muted small d-flex justify-content-between">
            <span>Estado: Vigilando...</span>
            <span>Actualizado: ${new Date().toLocaleTimeString()}</span>
        </div>
    `;

    // 3.10. RETORNO FINAL
    return `
        <div class="card shadow-sm border-0 mb-4">
            ${html_Header}
            ${html_Body}
            ${html_Footer}
        </div>
    `;
}


//======================================================
// 4. FUNCIÓN RENDER (ARMA EL PAQUETE FINAL PARA DOM)
//======================================================
function RenderSIMCHS(Matriz_Impacto, Matriz_Nivel, Matriz_Ponderacion_Preguntas, Matriz_General, Matriz_Conciencia) {

    const htmlAuditoria = ConstAuditoriaSIMCHS(
        Matriz_Impacto,
        Matriz_Nivel,
        Matriz_Ponderacion_Preguntas,
        Matriz_General,
        Matriz_Conciencia
    );

    const htmlInforme = ConsInfPersonalSIMCHS(
        Matriz_General,
        Matriz_Conciencia
    ); 

    return {
        htmlAuditoria,
        htmlInforme
    };
}

//======================================================
// 5. FUNCIÓN RESULTADOS (RENDERIZA DOM Y GRÁFICAS)
//======================================================
function ResultadosSIMCHS(render, renderGraficos) {

    const contInforme = document.getElementById("Informe_SIMCHS_Personal");
    const contAuditoria = document.getElementById("Auditoria_SIMCHS_Personal");

    if (contInforme) {
        contInforme.innerHTML = render.htmlInforme || "";
        if (renderGraficos && typeof renderGraficos === "function") {
            renderGraficos(); 
        }
    }

    if (contAuditoria) {
        contAuditoria.innerHTML = render.htmlAuditoria || "";
    }
    

}

//======================================================
// 6. FUNCIÓN PARA GRAFICAR RADAR (PLOTLY)
//======================================================
function GraficarRadarSIMCHS(Matriz_Conciencia) {
    const container = document.getElementById("radarChart");
    if (!container || !Matriz_Conciencia.length) return;

    // 1. Extraemos los nombres y los valores (Porcentaje de Conciencia)
    let dimensiones = Matriz_Conciencia.map(row => row.Conciencia);
    let valores = Matriz_Conciencia.map(row => row.PorcentajeC);
    
    dimensiones.push(dimensiones[0]);
    valores.push(valores[0]);

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
        fillcolor: "rgba(0, 212, 255, 0.3)",
        line: {color: colores, width: 3}, //Linea
        marker: {size: 8,color: colores} //Marcadr
    };

    const layout = {
        polar: {
            bgcolor: "rgba(0,0,0,0)",
            radialaxis: {
                visible: true,
                range: [0, 100],
                tickfont: { size: 10, color: "#6c757d" },
                gridcolor: "rgba(0,0,0,0.1)"
            },
            angularaxis: {
                tickfont: { size: 11, color: "#495057", fontWeight: "bold" },
                gridcolor: "rgba(0,0,0,0.1)"
            }
        },
        margin: { t: 40, b: 40, l: 60, r: 60 },
        showlegend: false,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)"
    };

    Plotly.newPlot("radarChart", [trace], layout, {responsive: true});
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