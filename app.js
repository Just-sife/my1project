// DOM Elements
const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const unitChanger = document.querySelector("#unit-changer");

// Weather Display Elements
const locationElement = document.querySelector("#location");
const tempElement = document.querySelector("#temp");
const weatherStatusElement = document.querySelector("#weather-status");
const windSpeedElement = document.querySelector("#wind-speed");
const humidityElement = document.querySelector("#humidity");
const iconElement = document.querySelector("#icon");

// Error Display Element
const altDisplay = document.querySelector("#alt-display");

// Main Display Container
const primaryDisplay = document.querySelector("#primary-display");

let data;


//////////////////////////
// Handling the request
function reqSender(query) {

    let baseUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=5f3db752f9a40d947dd95f28da45b4bc&units=metric`; 

    fetch(baseUrl)
        .then(handleResponse)
        .then(updateWeatherDisplay)
        .catch(handleError);

    
    searchInput.value = "";
}

function handleResponse(response) {

    if (response.status === 404) {
        throw new Error('Location not found. Please try again.');
    } else if (!response.ok) {
        throw new Error('Failed to fetch data. Please try again.');
    }
    return response.json();

}

function updateWeatherDisplay(dataObject) {
    data = dataObject

    // Update weather display elements
    weatherStatusElement.innerText = `>${data.weather[0].description}`.toUpperCase();
    humidityElement.innerText = `>Humidity: ${data.main.humidity}%`;
    iconElement.src = `wicones/${data.weather[0].icon}@2x.png`;
    locationElement.innerText = data.name;
    celChanger()

    altDisplay.classList.add("vanish");
    
}

function displayError(message) {
    // Hide primary display and show error messages
    altDisplay.classList.remove("vanish");

    altDisplay.innerText = message
}

function handleError(error) {
    displayError(error.message);

    console.error("Error fetching data:", error);
}



function ferChanger() {
    tempElement.innerHTML = `${Math.round(data.main.temp * 9 / 5) + 32}` + " °F";
    windSpeedElement.innerText = `>Wind Spead: ${Math.round(data.wind.speed) * 2.237}MPH`;
}
function celChanger() {
    tempElement.innerHTML = `${data.main.temp}` + " °C";
    windSpeedElement.innerText = `>Wind Spead: ${data.wind.speed} m/s`;
}

let isFer = true;
unitChanger.addEventListener("click", () => {
    if (isFer) {
        ferChanger();
    } else {
        celChanger();
    }
    isFer = !isFer;
});



// search events
searchButton.addEventListener("click", () => {
    if (searchInput.value) {
        reqSender(searchInput.value)
    }
})
searchInput.addEventListener("keypress", (event) => {
    if (searchInput.value && event.code === "Enter") {
        reqSender(searchInput.value)
    }
})
// Interactive Events
searchButton.addEventListener("mouseenter", function () {
    searchInput.classList.remove("hide");
    searchInput.classList.add("show");
});
searchButton.addEventListener("mouseleave", function () {
    searchInput.classList.remove("show");
    searchInput.classList.add("hide");
});
searchInput.addEventListener("mouseenter", function () {
    searchInput.classList.remove("hide");
    searchInput.classList.add("show");
});
searchInput.addEventListener("mouseleave", function () {
    searchInput.classList.remove("show");
    searchInput.classList.add("hide");
});

// Unit Changer effect
unitChanger.addEventListener("mousedown", () => {
    unitChanger.style.cssText = "background-color: white; color: black;"
    unitChanger.addEventListener("mouseup", () => {
        unitChanger.style.cssText = "background-color: transparent, color: white"
    })
})



// clock functions


function getTimeInTimeZone(timeZone) {
    let now = new Date();

    let utcTime = now.getTime();

    let timeZoneOffset = now.getTimezoneOffset();

    let timeZoneOffsetMs = timeZoneOffset * 60 * 1000;

    let targetTimeZoneOffset = timeZone * 1000;

    let localTime = new Date(utcTime + timeZoneOffsetMs + targetTimeZoneOffset);

    return localTime;
}

function updateTimeDisplay(timeZone) {
    
    let currentTime = getTimeInTimeZone(timeZone);

    let hours = currentTime.getHours();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    let minutes = currentTime.getMinutes().toString().padStart(2, '0');
    let seconds = currentTime.getSeconds().toString().padStart(2, '0');

    let timeDisplay = document.getElementById('time-display');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

}

// Set the time...
setInterval(() => {
    updateTimeDisplay(data.timezone);
}, 1000);


function loadingPause() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    });
}

function hideLoadingScreen() {
    document.querySelector('#loading-screen').style.display = "none";
    document.querySelector("main").classList.remove("vanish")
}

loadingPause().then(hideLoadingScreen);
reqSender("casablanca")

