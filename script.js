const apiKey = "ece938ec0383f140283f8f75a3e51f28";

document.getElementById("searchBtn")
    .addEventListener("click", getWeather);

function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) {
        alert("Enter city");
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            if (data.cod !== 200) {
                alert(data.message);
                return;
            }
            updateUI(data);
            getHourlyForecast(city);
        });
}

function updateUI(data) {
    document.getElementById("city").innerText = data.name;
    document.getElementById("temp").innerText = `${data.main.temp}°C`;
    document.getElementById("condition").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `Wind: ${data.wind.speed} m/s`;

    document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    runAI(data);
}

function getHourlyForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            showHourlyForecast(data.list);
        });
}

function showHourlyForecast(list) {
    const container = document.getElementById("hourlyContainer");
    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const hour = list[i];
        const time = new Date(hour.dt_txt)
            .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

        const card = document.createElement("div");
        card.className = "hour-card";
        card.innerHTML = `
            <p>${time}</p>
            <img src="https://openweathermap.org/img/wn/${hour.weather[0].icon}.png">
            <p>${Math.round(hour.main.temp)}°C</p>
            <p>${hour.weather[0].main}</p>
        `;
        container.appendChild(card);
    }
}

function runAI(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].main.toLowerCase();

    let insight = "Weather looks pleasant today.";

    if (temp > 30 && humidity > 70) {
        insight = "It is hot and humid. Drink water and avoid afternoon sun.";
    } else if (condition.includes("rain")) {
        insight = "Rain expected. Carry an umbrella.";
    } else if (temp < 15) {
        insight = "It is cold. Wear warm clothes.";
    }

    document.getElementById("aiText").innerText = insight;
}
