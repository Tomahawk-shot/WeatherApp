async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "164413562f7661ba68e2a8ff94dbda6e"; 
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const weatherRes = await fetch(weatherUrl);
    if (!weatherRes.ok) throw new Error("City not found");
    const weatherData = await weatherRes.json();

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const weather = `
      <div>
        <p><strong>${weatherData.name}</strong></p>
        <p>🌡️ Temp: ${weatherData.main.temp} °C</p>
        <p>🌬️ Wind: ${weatherData.wind.speed} m/s</p>
        <p>☁️ ${weatherData.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="Weather Icon">
      </div>
    `;
    document.getElementById("weatherResult").innerHTML = weather;

    let forecastHTML = "<h3>5-Day Forecast</h3>";
    forecastData.list.slice(0, 5).forEach(item => {
      forecastHTML += `
        <div>
          <p><strong>${new Date(item.dt * 1000).toLocaleDateString()}</strong></p>
          <p>🌡️ Temp: ${item.main.temp} °C</p>
          <p>☁️ ${item.weather[0].description}</p>
          <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="Weather Icon">
        </div>
      `;
    });
    document.getElementById("forecastResult").innerHTML = forecastHTML;

    saveSearchHistory(city);

  } catch (err) {
    document.getElementById("weatherResult").textContent = "❌ Error: " + err.message;
  }
}

function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("history", JSON.stringify(history));
    displaySearchHistory();
  }
}

function displaySearchHistory() {
  const history = JSON.parse(localStorage.getItem("history")) || [];
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  history.forEach(city => {
    const historyCard = document.createElement("div");
    historyCard.classList.add("history-card");
    historyCard.innerHTML = `
      <span class="city-name">${city}</span>
      <img class="history-icon" src="http://openweathermap.org/img/wn/01d.png" alt="Weather Icon">
    `;
    historyCard.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    historyList.appendChild(historyCard);
  });
}

window.onload = displaySearchHistory;
