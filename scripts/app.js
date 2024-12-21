// script.js

const apiKey = "a7f737c640fcab223de39b5daba4f8e7";
const baseUrl = "https://api.openweathermap.org/data/2.5/";

// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");
const errorMessage = document.getElementById("error-message");
const forecastCards = document.getElementById("forecast-cards");

// Fetch Weather Data
const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    updateWeatherDisplay(data);
  } catch (error) {
    showError(error.message);
  }
};

// Update Weather Display
const updateWeatherDisplay = (data) => {
  errorMessage.classList.add("hidden");

  cityName.textContent = data.name;
  temperature.textContent = `Temperature: ${data.main.temp} °C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} km/h`;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

// Show Error Message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

// Event Listener
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city) fetchWeatherData(city);
});
