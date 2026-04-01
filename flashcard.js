// Configuración de MathJax (opcional si ya la tienes en el HTML)
window.MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
    svg: { fontCache: 'global' }
};

// Seleccionamos el contenedor por ID
const container = document.getElementById('flashcard-container');

function renderFlashcards() {
    if (!container) {
        console.error("No se encontró el contenedor #flashcard-container");
        return;
    }

    // Limpiamos el contenedor
    container.innerHTML = '';

    // Usamos directamente la variable 'flashcardsData' del otro archivo
    flashcardsData.forEach(item => {
        const listItems = item.detalles.map(detail => `<li>${detail}</li>`).join('');

        const cardHTML = `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="flip-card">
                    <div class="flip-card-inner">
                        <div class="flip-card-front shadow">
                            <h4 class="card-title">${item.titulo}</h4>
                            <p class="text-muted mt-2">${item.descripcion}</p>
                            <small class="text-secondary">Pasa el mouse para ver el contenido</small>
                        </div>
                        <div class="flip-card-back shadow">
                            <h5>¿Qué incluye?</h5>
                            <div class="formula">
                                <ol>${listItems}</ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });

    // Renderizar fórmulas de MathJax si existen
    if (window.MathJax && window.MathJax.typeset) {
        window.MathJax.typeset();
    }
}

// Ejecutamos al cargar el DOM
document.addEventListener('DOMContentLoaded', renderFlashcards);