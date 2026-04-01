// Creamos un ID de sesión simple que dura mientras la pestaña esté abierta
const SESSION_ID = Math.random().toString(36).substring(7);

async function registrarVisita(seccion) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                seccion: seccion || 'Inicio',
                sessionId: SESSION_ID
            })
        });
    } catch (e) { console.log("Error tracking"); }
}

// 1. Rastrear cuando carga la página por primera vez
window.addEventListener('load', () => {
    const hashActual = window.location.hash || '#Inicio';
    registrarVisita(hashActual);
});

// 2. Rastrear cuando el usuario navega por las secciones (SPA)
window.addEventListener('hashchange', () => {
    registrarVisita(window.location.hash);
});
