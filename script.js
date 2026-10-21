const API_KEY = "b8c981864bc48ab6b70062fd0a369593";

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const message = document.getElementById("message");
const weatherInfo = document.getElementById("weatherInfo");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();

    if (!city) return;

    if (API_KEY === "YOUR_API_KEY") {
        message.textContent = "Please add your weather API key in script.js.";
        weatherInfo.hidden = true;
        return;
    }

    message.textContent = "Loading weather...";
    weatherInfo.hidden = true;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message === "city not found"
                    ? "City not found. Please try another city"
                    : data.message || "Unable to get weather."
            );
        }

        document.getElementById("cityName").textContent =
            `${data.name}, ${data.sys.country}`;
        document.getElementById("temperature").textContent =
            `${Math.round(data.main.temp)}°C`;
        document.getElementById("description").textContent =
            data.weather[0].description;
        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;
        document.getElementById("wind").textContent =
            `${data.wind.speed} m/s`;

        const icon = document.getElementById("weatherIcon");
        icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        icon.alt=data.weather[0].description;

        message.textContent = "Weather updated succesfuly";
        weatherInfo.hidden = false;
    } catch (error) {
        message.textContent = error.message || "Something went wrong";
        weatherInfo.hidden = true;
    }
});