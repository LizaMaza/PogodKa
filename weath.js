const API_KEY = "d28c97fac5b308bf6a046b48cf1b9755";

// элементы
const container = document.getElementById("weatherContainer");
const temperatureEl = document.getElementById("temperature");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const aqiEl = document.getElementById("aqi");
const tomorrowEl = document.getElementById("tomorrowForecast");
const recommendationEl = document.getElementById("recommendation");
const characterEl = document.getElementById("character");

// геолокация
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      loadWeather(lat, lon);
      loadAQI(lat, lon);
    },
    () => {
      weatherMessage.textContent = "Location access denied";
    }
  );
} else {
  weatherMessage.textContent = "Geolocation not supported";
}

// погода
async function loadWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  const now = data.list[0];
  const tomorrow = data.list[8];

  const temp = Math.round(now.main.temp);
  const feels = Math.round(now.main.feels_like);
  const humidity = now.main.humidity;
  const weatherMain = now.weather[0].main.toLowerCase();
  const weatherDesc = now.weather[0].description;

  temperatureEl.textContent = `${temp}°C`;
  feelsLikeEl.textContent = `Feels like ${feels}°C`;
  humidityEl.textContent = `Humidity: ${humidity}%`;
  tomorrowEl.textContent = `Tomorrow: ${tomorrow.weather[0].main}`;

  // Pass both weather and temperature 
  setBackground(weatherMain, temp);
  setCharacter(weatherMain, temp);
  setRecommendation(temp, weatherMain);
}

// AQI
async function loadAQI(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  const aqi = data.list[0].main.aqi;
  aqiEl.textContent = `AQI: ${aqi}`;
}


function setBackground(weather, temp) {
  container.className = "container";

  // rain weather
  if (weather.includes("rain")) {
    container.classList.add("rain-bg");
    return;
  }

  // sun
  if (weather.includes("sun")) {
    container.classList.add("sunny-bg");
    return;
  }

  if (weather.includes("snow") || temp <= 0) {
    container.classList.add("snow-bg");
    return;
  } 

  // Temperature-based fallback for clear conditions
  if (temp >= 25) {
    container.classList.add("sunny-bg");
  } else if (temp >= 17) {
    container.classList.add("sunny-bg");
  } else if (temp >= 10) {
    container.classList.add("cloudy-bg");
  } else {
    container.classList.add("cloudy-bg");
  }
} 

// персонаж
function setCharacter(weather, temp) {
  let img = "sunny.png";

  // Rain and snow take priority
  if (weather.includes("rain")) {
    img = "rainy.png";
  } else if (weather.includes("snow") || temp <= 0) {
    img = "cold.png";
  } else {
    // Use temperature to decide character when it's not rainy/snowy
    if (temp <= 5) {
      img = "cold.png";
    } else if (temp <= 15) {
      img = "cloud.png";
    } else {
      img = "sunny.png";
    }
  }

  characterEl.style.backgroundImage = `url('${img}')`;
} 

// Recommendations based on temperature and weather 
function setRecommendation(temp, weather) {
  // Rain takes precedence
  if (weather.includes("rain")) {
    recommendationEl.textContent = "Today's style: wet but determined. Umbrella recommended.";
    return;
  }

  if (temp <= 0) {
    recommendationEl.textContent = "A hat is not optional. It's survival gear.";
  } else if (temp <= 10) {
    recommendationEl.textContent = "Grab a warm jacket — it's chilly out.";
  } else if (temp <= 16) {
    recommendationEl.textContent = "Hoodie suits you perfectly today.";
  } else if (temp <= 24) {
    recommendationEl.textContent = "Light clothes. Heavy confidence";
  } 
  
}