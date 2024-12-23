// API configuration
const API_KEY = 'a7f737c640fcab223de39b5daba4f8e7';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const recentSearches = document.getElementById('recentSearches');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Load recent searches from localStorage
let recentSearchesList = JSON.parse(localStorage.getItem('recentSearches')) || [];
displayRecentSearches();

// Auto-update timer
let updateTimer;

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        showLoading();
        const weatherData = await fetchWeatherData(city);
        displayWeatherData(weatherData);
        updateRecentSearches(city);
        startAutoUpdate(city);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function fetchWeatherData(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(response.status === 404 
            ? 'City not found. Please check the spelling and try again.' 
            : 'Failed to fetch weather data. Please try again later.');
    }

    return await response.json();
}

function displayWeatherData(data) {
    weatherCard.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    // Update DOM elements with weather data
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('weatherDescription').textContent = data.weather[0].description
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    // Update weather icon
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
}

function updateRecentSearches(city) {
    // Remove the city if it already exists and add it to the beginning
    recentSearchesList = recentSearchesList.filter(item => item.toLowerCase() !== city.toLowerCase());
    recentSearchesList.unshift(city);
    
    // Keep only the last 5 searches
    if (recentSearchesList.length > 5) {
        recentSearchesList.pop();
    }

    // Save to localStorage and update display
    localStorage.setItem('recentSearches', JSON.stringify(recentSearchesList));
    displayRecentSearches();
}

function displayRecentSearches() {
    recentSearches.innerHTML = '';
    recentSearchesList.forEach(city => {
        const button = document.createElement('button');
        button.className = 'recent-search-item';
        button.textContent = city;
        button.addEventListener('click', () => {
            cityInput.value = city;
            handleSearch();
        });
        recentSearches.appendChild(button);
    });
}

function startAutoUpdate(city) {
    // Clear existing timer if any
    if (updateTimer) {
        clearInterval(updateTimer);
    }

    // Set new timer for 10-minute updates
    updateTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
            fetchWeatherData(city)
                .then(displayWeatherData)
                .catch(error => showError(error.message));
        }
    }, 600000); // 10 minutes in milliseconds
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && cityInput.value.trim()) {
        handleSearch();
    }
});