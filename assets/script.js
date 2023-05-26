const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const forecastDiv = document.getElementById('forecast');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value;
  if (city.trim() !== '') {
    getCoordinates(city)
      .then(coordinates => getForecast(coordinates.lat, coordinates.lon))
      .catch(error => {
        console.log('Error fetching coordinates:', error);
      });
  }
});

function getCoordinates(city) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      saveCity(city); // Save the searched city to local storage
      return { lat, lon };
    });
}

function getForecast(lat, lon) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key

  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.log('Error fetching weather data:', error);
    });
}

function displayForecast(data) {
  forecastDiv.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    const forecastItem = data.list[i];

    const date = new Date(forecastItem.dt * 1000).toLocaleDateString();
    const temperature = Math.round(forecastItem.main.temp - 273.15);
    const weatherDescription = forecastItem.weather[0].description;

    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');

    forecastCard.innerHTML = `
      <div class="date">${date}</div>
      <div class="temperature">${temperature}°C</div>
      <div class="description">${weatherDescription}</div>
    `;

    forecastDiv.appendChild(forecastCard);
  }
}

function saveCity(city) {
  let cities = [];
  if (localStorage.getItem('cities')) {
    cities = JSON.parse(localStorage.getItem('cities'));
  }
  cities.push(city);
  localStorage.setItem('cities', JSON.stringify(cities));
}