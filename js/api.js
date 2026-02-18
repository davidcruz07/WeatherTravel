// --- CONFIGURACION GLOBAL ---
const API_KEY = 'e739cdf2bfff015ecd5705898b644176';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

const circuitBreaker = {
    failures: 0,
    threshold: 3,
    state: 'CLOSED',
    nextAttempt: 0,
    cooldown: 30000 
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithResilience(url, retries = 2) {
    // 1. Verificación del Circuit Breaker
    if (circuitBreaker.state === 'OPEN') {
        if (Date.now() > circuitBreaker.nextAttempt) {
            circuitBreaker.state = 'HALF_OPEN';
        } else {
            // AVISO VISUAL AL USUARIO: Informamos el tiempo de espera
            const segundosRestantes = Math.ceil((circuitBreaker.nextAttempt - Date.now()) / 1000);
            if (typeof mostrarNotificacion === "function") {
                mostrarNotificacion(`Servicio pausado por seguridad. Reintenta en ${segundosRestantes}s`, 'warning');
            }
            throw new Error('Servicio temporalmente fuera de servicio.');
        }
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                mostrarNotificacion('Error de autenticación (API Key)', 'error');
                throw new Error('API Key no autorizada.');
            }
            if (response.status === 404) {
                mostrarNotificacion('La ciudad no existe. Intenta con otra.', 'error');
                throw new Error('Ciudad no encontrada.');
            }
            throw new Error('Error en el servidor.');
        }

        const data = await response.json();
        
        // Éxito: Reiniciamos el contador y cerramos el circuito
        circuitBreaker.failures = 0;
        circuitBreaker.state = 'CLOSED';
        return data;

    } catch (error) {
        // 2. Lógica de Reintentos (si no es un error de usuario 404/401)
        if (retries > 0 && !error.message.includes('autorizada') && !error.message.includes('encontrada')) {
            if (typeof mostrarNotificacion === "function") {
                mostrarNotificacion("Problema de conexión. Reintentando...", 'warning');
            }
            await wait(1000);
            return fetchWithResilience(url, retries - 1);
        }

        // 3. Manejo de Fallos Fatales
        circuitBreaker.failures++;
        
        if (circuitBreaker.failures >= circuitBreaker.threshold) {
            circuitBreaker.state = 'OPEN';
            circuitBreaker.nextAttempt = Date.now() + circuitBreaker.cooldown;
            
            if (typeof mostrarNotificacion === "function") {
                mostrarNotificacion("Demasiados errores. Sistema bloqueado por 30s.", 'error');
            }
        }
        
        throw error;
    }
}