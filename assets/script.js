const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv = document.querySelector(".weather-card");
const currentWeatherDiv = document.querySelector(".current-weather");
const recentSearchesDiv = document.querySelector(".recent-searches");

// API KEY
const API_KEY = "38fa05b5edfdffe600b9a1faf86df7a1";

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {  // HTML for current weather card
        return ` 
        <div class="details">
            <h2> ${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
            <h4>Temperature: ${weatherItem.main.temp.toFixed(0)}°F</h4>
            <h4>Wind: ${weatherItem.wind.speed.toFixed(0)}mph</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </div>
        <div class="icon">
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="current weather">
            <h4>${weatherItem.weather[0].description}</h4>
        </div>`;
    } else { // HTML for five day forecast
        return ` 
        <li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temp: ${weatherItem.main.temp.toFixed(0)}°F</h4>
            <h4>Wind: ${weatherItem.wind.speed.toFixed(0)}mph</h4>
            <h4>Humidity: ${weatherItem.main.humidity}%</h4>
        </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;

    fetch(WEATHER_API).then(response => response.json()).then(data => {
        // Picking the forecasts to be able to display one day per forecast
        const uniqueForecastDays = new Set();
        const fiveDaysForecast = [];

        for (let forecast of data.list) {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.has(forecastDate)) {
                uniqueForecastDays.add(forecastDate);
                fiveDaysForecast.push(forecast);
                //if (fiveDaysForecast.length === 5) break; // Stop once we have 5 unique days
            }
        }
        localStorage.setItem('weatherData', JSON.stringify({
            cityName,
            weatherData:fiveDaysForecast
        }));

        displayWeatherData(cityName, fiveDaysForecast);
        
    }).catch(() => {
        alert("An error occurred when fetching forecast");
    });
};

const displayWeatherData = (cityName, fiveDaysForecast) =>{
        // Clearing previous weather with an empty string
        cityInput.value = "";
        weatherCardsDiv.innerHTML = "";
        currentWeatherDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) => {
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    };

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); // This will get the city entered by the user and remove extra spaces with .trim()
    if (!cityName) return; // Return if cityName is empty

    const GEOCODING_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    // This is how we use the geocode API to get the lat and lon of the city entered
    fetch(GEOCODING_API).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`); // Return if no coordinates found
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates");
    });
};


function addSearch() {
    let savedSearch  = searchButton.value.trim();
 
    if (query) {
        let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        
        // Remove duplicates
        searches = searches.filter(search => search !== savedSearch);
    
        // Add the new search to the beginning of the array
        searches.unshift(savedSearch);
    
        // Keep only the latest 5 searches
        if (searches.length > 5) {
          searches.pop();
        }
    
        // Save the updated searches array to local storage
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        
        // Clear the search input
        searchInput.value = '';
    
        // Update the displayed list
        loadRecentSearches();
      }
    };


function loadRecentSearches() {
    const searchList = document.getElementById('search-list');
    searchList.innerHTML = '';
  
    const searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
  
    searches.forEach(search => {
      const li = document.createElement('li');
      li.textContent = search;
      li.className = 'search-item';
      li.onclick = () => {
        document.getElementById('search-input').value = search;
      };
      searchList.appendChild(li);
    });
  }



// Load weather data from local storage on page load
window.addEventListener('load', () => {
    const storedWeatherData = JSON.parse(localStorage.getItem('weatherData'));
    if (storedWeatherData) {
        displayWeatherData(storedWeatherData.cityName, storedWeatherData.weatherData);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadRecentSearches();
});

searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
