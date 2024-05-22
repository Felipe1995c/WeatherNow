const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
// API KEY
const API_KEY = "38fa05b5edfdffe600b9a1faf86df7a1";

const createWeatherCard = (weatherItem) => {
    return ` <li class="card">
    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
    <h4>Temp: °F</h4>
    <h4>Wind: mph</h4>
    <h4>Humidity: %</h4>
</li>`;
}

// LAT AND LON
const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API).then(response => response.json()).then(data => {
        //Picking the forecasts to be able to display one days forecast
        const uniqueForecastDays =[];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach



    });
};



const getCityCoordinates = () => {
    const cityName = cityInput.value.trim(); //This will get city entered by user and remove extra spaces with .trim()
    if(!cityName) return; // Returns if cityName is empty

   const GEOCODING_API = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;


   //This is how we us the geocode API to get the lat and lon of the cities entered
   fetch(GEOCODING_API).then(response => response.json()).then(data => {
   if(!data.length) return alert(`No coordinates found for ${cityName}`); //return if cityName is empty
   const {name, lat, lon} = data[0];
   getWeatherDetails(name, lat, lon);
   }).catch(() => {
    alert("An error occurred while fetching the coordinates");

   });
}

searchButton.addEventListener("click", getCityCoordinates)