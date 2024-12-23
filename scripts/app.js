// API configuration
const API_KEY = 'a7f737c640fcab223de39b5daba4f8e7';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'; // Updated forecast endpoint

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const recentSearches = document.getElementById('recentSearches');
const themeToggle = document.getElementById('themeToggle');
const dynamicBgToggle = document.getElementById('dynamicBgToggle');
const forecastSection = document.getElementById('forecastSection');
const forecastContainer = document.getElementById('forecastContainer');

// Theme state
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let isDynamicBg = localStorage.getItem('dynamicBg') === 'true';
let lastWeatherData = null;

// Initialize theme
document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
themeToggle.innerHTML = `<i class="fas fa-${isDarkMode ? 'sun' : 'moon'}"></i>`;
dynamicBgToggle.classList.toggle('active', isDynamicBg);

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
themeToggle.addEventListener('click', toggleTheme);
dynamicBgToggle.addEventListener('click', toggleDynamicBackground);

// Load recent searches from localStorage
let recentSearchesList = JSON.parse(localStorage.getItem('recentSearches')) || [];
displayRecentSearches();

// Auto-update timer
let updateTimer;

// Theme functions
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = `<i class="fas fa-${isDarkMode ? 'sun' : 'moon'}"></i>`;
    localStorage.setItem('darkMode', isDarkMode);
}

function toggleDynamicBackground() {
    isDynamicBg = !isDynamicBg;
    dynamicBgToggle.classList.toggle('active', isDynamicBg);
    localStorage.setItem('dynamicBg', isDynamicBg);
    if (isDynamicBg && lastWeatherData) {
        setDynamicBackground(lastWeatherData.weather[0].main);
    } else {
        document.body.className = '';
    }
}

function setDynamicBackground(weatherMain) {
    if (!isDynamicBg) return;
    
    const weatherMap = {
        Clear: 'bg-clear',
        Clouds: 'bg-clouds',
        Rain: 'bg-rain',
        Snow: 'bg-snow',
        Thunderstorm: 'bg-thunderstorm'
    };
    
    document.body.className = weatherMap[weatherMain] || '';
}

// Weather data functions
async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        showLoading();
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(city);
        
        displayWeatherData(weatherData);
        displayForecastData(forecastData);
        updateRecentSearches(city);
        startAutoUpdate(city);
        
        if (isDynamicBg) {
            setDynamicBackground(weatherData.weather[0].main);
        }
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

async function fetchWeatherData(city) {
    const url = `${WEATHER_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(response.status === 404 
            ? 'City not found. Please check the spelling and try again.' 
            : 'Failed to fetch weather data. Please try again later.');
    }

    return await response.json();
}

async function fetchForecastData(city) {
    const url = `${FORECAST_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
    }
    
    return await response.json();
}

function displayWeatherData(data) {
    weatherCard.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    lastWeatherData = data;

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

    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function displayForecastData(data) {
    forecastSection.classList.remove('hidden');
    forecastContainer.innerHTML = '';
    
    // Group forecast data by day
    const dailyForecasts = groupForecastsByDay(data.list);
    
    // Display forecast for next 5 days
    Object.values(dailyForecasts).slice(1, 6).forEach(dayData => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const date = new Date(dayData.date);
        const minTemp = Math.min(...dayData.temps);
        const maxTemp = Math.max(...dayData.temps);
        const avgHumidity = Math.round(dayData.humidities.reduce((a, b) => a + b) / dayData.humidities.length);
        const avgWindSpeed = Math.round(dayData.windSpeeds.reduce((a, b) => a + b) / dayData.windSpeeds.length * 3.6); // Convert to km/h
        const mostFrequentWeather = getMostFrequentWeather(dayData.weatherTypes);
        
        card.innerHTML = `
            <div class="date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${mostFrequentWeather.icon}@2x.png" alt="${mostFrequentWeather.description}">
            </div>
            <div class="temp-range">
                <span class="high">${Math.round(maxTemp)}°C</span> / 
                <span class="low">${Math.round(minTemp)}°C</span>
            </div>
            <div class="details">
                <div>
                    <i class="fas fa-tint"></i>
                    <span>${avgHumidity}%</span>
                </div>
                <div>
                    <i class="fas fa-wind"></i>
                    <span>${avgWindSpeed} km/h</span>
                </div>
                <div>
                    <i class="fas fa-cloud"></i>
                    <span>${mostFrequentWeather.description}</span>
                </div>
            </div>
        `;
        
        forecastContainer.appendChild(card);
    });
}

function groupForecastsByDay(forecastList) {
    const dailyForecasts = {};
    
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                date: date,
                temps: [],
                humidities: [],
                windSpeeds: [],
                weatherTypes: []
            };
        }
        
        dailyForecasts[dateKey].temps.push(forecast.main.temp);
        dailyForecasts[dateKey].humidities.push(forecast.main.humidity);
        dailyForecasts[dateKey].windSpeeds.push(forecast.wind.speed);
        dailyForecasts[dateKey].weatherTypes.push({
            main: forecast.weather[0].main,
            description: forecast.weather[0].description,
            icon: forecast.weather[0].icon
        });
    });
    
    return dailyForecasts;
}

function getMostFrequentWeather(weatherTypes) {
    const weatherFrequency = {};
    let maxFreq = 0;
    let mostFrequentWeather = null;
    
    weatherTypes.forEach(weather => {
        const key = weather.main;
        weatherFrequency[key] = (weatherFrequency[key] || 0) + 1;
        
        if (weatherFrequency[key] > maxFreq) {
            maxFreq = weatherFrequency[key];
            mostFrequentWeather = weather;
        }
    });
    
    return mostFrequentWeather;
}

function updateRecentSearches(city) {
    recentSearchesList = recentSearchesList.filter(item => item.toLowerCase() !== city.toLowerCase());
    recentSearchesList.unshift(city);
    
    if (recentSearchesList.length > 5) {
        recentSearchesList.pop();
    }

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
    if (updateTimer) {
        clearInterval(updateTimer);
    }

    updateTimer = setInterval(() => {
        if (document.visibilityState === 'visible') {
            handleSearch();
        }
    }, 600000); // 10 minutes in milliseconds
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    forecastSection.classList.add('hidden');
}

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    weatherCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
    forecastSection.classList.add('hidden');
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