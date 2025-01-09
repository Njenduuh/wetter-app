# Weather Dashboard

A responsive weather dashboard application that allows users to check current weather conditions and 5-day forecasts for cities worldwide. Built with HTML, CSS, and vanilla JavaScript, utilizing the OpenWeatherMap API.

## Features

- **Current Weather Display**
  - Temperature
  - Humidity
  - Wind Speed
  - Weather Condition with Icons
  - "Feels Like" Temperature

- **5-Day Weather Forecast**
  - Daily High/Low Temperatures
  - Weather Conditions
  - Humidity Levels
  - Wind Speed

- **Theme Customization**
  - Light/Dark Mode Toggle
  - Dynamic Weather-based Backgrounds
  - Responsive Design for All Devices

- **Additional Features**
  - Recent Search History
  - Automatic Weather Updates (Every 10 Minutes)
  - Loading Animations
  - Error Handling
  - Weather-specific Background Images

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- OpenWeatherMap API
- Font Awesome Icons

## Setup and Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/weather-dashboard.git
```

2. Navigate to the project directory:
```bash
cd weather-dashboard
```

3. Create an `images` folder and add weather background images:
```
images/
├── clear-sky.jpg
├── cloudy.jpg
├── rain.jpg
├── snow.jpg
└── thunderstorm.jpg
```

4. Open `script.js` and replace the API key:
```javascript
const API_KEY = 'your_api_key_here';
```

5. Open `index.html` in your web browser to run the application.

## Getting an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to your API keys section
4. Copy your API key and replace it in the `script.js` file

## Usage

1. Enter a city name in the search bar
2. Click the search button or press Enter
3. View current weather and 5-day forecast
4. Toggle between light/dark modes using the moon/sun icon
5. Toggle dynamic backgrounds using the image icon
6. Click on recent searches to quickly view weather for previously searched cities

## Project Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── styles.css         # Stylesheet
├── script.js         # JavaScript functionality
└── images/           # Background images for weather conditions
    ├── clear-sky.jpg
    ├── cloudy.jpg
    ├── rain.jpg
    ├── snow.jpg
    └── thunderstorm.jpg
```

## Deployment

The project can be easily deployed using Vercel:

1. Visit [Vercel](https://vercel.com)
2. Sign up/Log in with GitHub
3. Upload your project
4. Click "Deploy"



## Contributin
1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org)
- Icons by [Font Awesome](https://fontawesome.com)