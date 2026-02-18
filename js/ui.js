function renderWeather(data) {
    const card = document.getElementById('weatherCard');
    card.classList.remove('hidden');
    
    card.innerHTML = `
        <div class="current-weather">
            <h2>${data.name}, ${data.sys.country}</h2>
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="icono">
                <span style="font-size: 3rem; font-weight: bold;">${Math.round(data.main.temp)}°C</span>
            </div>
            <p style="text-transform: capitalize; font-size: 1.2rem; margin-bottom: 10px;">
                ${data.weather[0].description}
            </p>
            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-label">Viento</span>
                    <span class="detail-value">${data.wind.speed} m/s</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Humedad</span>
                    <span class="detail-value">${data.main.humidity}%</span>
                </div>
            </div>
            <button onclick="toggleFavorite('${data.name}')" class="btn-fav">
                Guardar en Favoritos
            </button>
        </div>
        <div id="forecastContainer" class="forecast-grid"></div>
    `;
}

function renderForecast(days) {
    const container = document.getElementById('forecastContainer');
    let forecastHTML = '<h3 style="grid-column: 1/-1; margin-top: 20px;">Próximos días</h3>';
    days.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('es-ES', { weekday: 'short' });
        forecastHTML += `
            <div class="forecast-item">
                <p style="font-weight: bold; text-transform: uppercase; margin: 5px 0;">${date}</p>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="icon">
                <p style="margin: 5px 0;">${Math.round(day.main.temp)}°C</p>
            </div>`;
    });
    container.innerHTML = forecastHTML;
}

function renderFavorites() {
    const favList = document.getElementById('favList');
    if (!favList) return;
    const favorites = JSON.parse(localStorage.getItem('favs')) || [];
    favList.innerHTML = favorites.map(city => `
        <li class="fav-item" onclick="getWeatherData('${city}')">
            <span>${city}</span>
            <span class="delete-btn" onclick="eliminarFavorito(event, '${city}')">×</span>
        </li>`).join('');
}

function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    container.innerHTML = history.map(city => `
        <div class="history-chip" onclick="getWeatherData('${city}')">
            <span>${city}</span>
            <span class="delete-btn" onclick="eliminarHistorial(event, '${city}')">×</span>
        </div>`).join('');
}

function renderSugerencias(locations) {
    const div = document.getElementById('suggestions');
    if (!div) return;
    div.innerHTML = locations.map(loc => `
        <div class="suggestion-item" onclick="seleccionarCiudad('${loc.name},${loc.country}')">
            ${loc.name} (${loc.country})
        </div>`).join('');
}

function generateRecommendations(condition) {
    const recList = document.getElementById('recList');
    document.getElementById('recommendations').classList.remove('hidden');
    const activities = { 
        'Clear': "Ideal para un tour a pie.", 
        'Rain': "Visita museos.", 
        'Clouds': "Perfecto para caminar.", 
        'Snow': "Día de chocolate caliente.", 
        'Thunderstorm': "Quédate en interiores." 
    };
    recList.innerHTML = `<p>${activities[condition] || "¡Disfruta tu viaje!"}</p>`;
}



function mostrarNotificacion(mensaje, tipo = 'error') {
   
    const alertaExistente = document.querySelector('.alerta-clima');
    if (alertaExistente) alertaExistente.remove();

    const alerta = document.createElement('div');
    alerta.className = 'alerta-clima';
    
   
    const colorFondo = tipo === 'error' ? '#e74c3c' : '#f39c12'; // Rojo para error, Naranja para advertencia
    
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colorFondo};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: bold;
        font-family: sans-serif;
        transition: all 0.5s ease;
    `;
    
    alerta.textContent = mensaje;
    document.body.appendChild(alerta);

    
    setTimeout(() => {
        alerta.style.opacity = '0';
        alerta.style.transform = 'translateY(-20px)';
        setTimeout(() => alerta.remove(), 500);
    }, 4000);
}