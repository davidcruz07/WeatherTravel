function eliminarFavorito(event, city) {
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('favs')) || [];
    favorites = favorites.filter(fav => fav !== city);
    localStorage.setItem('favs', JSON.stringify(favorites));
    renderFavorites();
}

function eliminarHistorial(event, city) {
    event.stopPropagation();
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = history.filter(item => item !== city);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    renderHistory();
}

function toggleFavorite(cityName) {
    let favorites = JSON.parse(localStorage.getItem('favs')) || [];
    if (!favorites.includes(cityName)) {
        favorites.push(cityName);
        localStorage.setItem('favs', JSON.stringify(favorites));
        renderFavorites();
    }
}

function saveToHistory(cityName) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = history.filter(item => item !== cityName);
    history.unshift(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 5)));
    renderHistory();
}