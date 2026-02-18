let timeoutId;

async function getWeatherData(city) {
    try {
        const weatherData = await fetchWithResilience(`${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`);
        const forecastData = await fetchWithResilience(`${BASE_URL}forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`);

        renderWeather(weatherData);
        const dailyForecast = forecastData.list.filter((_, index) => index % 8 === 0);
        renderForecast(dailyForecast);
        generateRecommendations(weatherData.weather[0].main);
        saveToHistory(weatherData.name);
    } catch (error) {
        console.error(error.message);
    }
}

async function fetchSugerencias(query) {
    try {
        const locations = await fetchWithResilience(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
        renderSugerencias(locations);
    } catch (err) { console.error(err); }
}

function seleccionarCiudad(city) {
    document.getElementById('cityInput').value = city;
    limpiarSugerencias();
    getWeatherData(city);
}

function limpiarSugerencias() {
    const div = document.getElementById('suggestions');
    if (div) div.innerHTML = '';
}

// Eventos
document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        limpiarSugerencias();
        getWeatherData(city);
    }
});

document.getElementById('cityInput').addEventListener('keyup', (e) => {
    const query = e.target.value.trim();
    clearTimeout(timeoutId);
    if (query.length < 3) return limpiarSugerencias();
    timeoutId = setTimeout(() => fetchSugerencias(query), 500);
});

// Inicialización
renderFavorites();
renderHistory();