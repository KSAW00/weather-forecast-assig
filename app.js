const API_KEY = '8af9aa0170866104c9aa4cfa7e274a59';
const weatherContainer = document.getElementById('weather-container');
const forecastContainer = document.getElementById('forecast-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

async function fetchWeatherData(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('City not found');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
  } catch (error) {
    alert(error.message);
  }
}

function displayCurrentWeather(data) {
  const { name, weather, main, wind } = data;

  document.getElementById('city-name').textContent = name;
  document.getElementById('current-date').textContent = new Date().toLocaleDateString();
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById('current-temp').textContent = `${main.temp}°C`;
  document.getElementById('weather-desc').textContent = weather[0].description;
  document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${wind.speed} m/s`;

  weatherContainer.classList.remove('hidden');
}

function displayForecast(data) {
  forecastContainer.innerHTML = '';
  const forecastList = data.list.filter((_, index) => index % 8 === 0);

  forecastList.forEach((forecast) => {
    const { dt_txt, main, weather, wind } = forecast;

    const card = document.createElement('div');
    card.className = 'p-4 bg-zinc-700 shadow rounded-lg';

    card.innerHTML = `
      <p class="text-sm font-bold">${new Date(dt_txt).toLocaleDateString()}</p>
      <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon" class="h-12 mx-auto">
      <p class="text-lg">${main.temp}°C</p>
      <p class="text-sm">Wind: ${wind.speed} m/s</p>
      <p class="text-sm">Humidity: ${main.humidity}%</p>
    `;

    forecastContainer.appendChild(card);
  });

  forecastContainer.classList.remove('hidden');
}

searchBtn.addEventListener('click', () => {
  const city = searchInput.value.trim();
  if (city) {
    fetchWeatherData(city);
  } else {
    alert('Please enter a city name');
  }
});
