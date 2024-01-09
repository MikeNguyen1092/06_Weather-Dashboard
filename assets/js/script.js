//=============================== DOM Traversal ======================================//

let citySearch = $("#citySearch");
let submitBtn = $("#searchBtn");
let history = $("#history");
let nameOfCity = $("#nameOfCity");
let todayTemp = $("#temp");
let todayWind = $("#wind");
let todayHumidity = $("#humidity");
let weatherIcon = $("#weatherIcon");

//=============================== Global Variables ===================================//

//================================ Main function ====================================//

//========== Get lon and Lat from city  =========//
const getGeoCode = async (aCity) => {
    let geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${aCity}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );

    let geoData = await geoResponse.json();

    let lat = geoData[0].lat;
    let lon = geoData[0].lon;

    forecast(lat, lon);
    fiveDay(lat, lon);
};
// END - getGeoCode //

//========== Get today's weather and append it page =========//
const forecast = async (lat, lon) => {
    let weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );
    let weatherData = await weatherResponse.json();

    nameOfCity.text(weatherData.name + " " + dayjs().format("(MM/DD/YYYY)"));
    weatherIcon.attr(
        "src",
        `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`
    );
    todayTemp.text("Temp: " + weatherData.main.temp);
    todayWind.text("Wind: " + weatherData.wind.speed);
    todayHumidity.text("Humidity: " + weatherData.main.humidity);
};
// END - forecast

//========== Get 5 day forecast and append it page =========//
const fiveDay = async (lat, lon) => {
    $("#cardContainer").empty();
    let fiveDayResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );

    let fiveDayData = await fiveDayResponse.json();

    // Filter the list to keep only data for 12:00 hr
    let hour12 = fiveDayData.list.filter((list) => list.dt_txt.includes("12:00"));

    hour12.forEach((list) => {
        const date = list.dt_txt.split(" ")[0].substring(5);
        const temperature = list.main.temp;
        const icon = list.weather[0].icon

        // Create a new card for each day
        let card = $(`<div class="card">
                        <p>${date}</p>
                        <img src= ${`https://openweathermap.org/img/wn/${icon}.png`}
                        <p>Temp: ${temperature.toFixed(2)}°F</p>
                      </div>`);

        $('#cardContainer').append(card);
    });
};


// END - fiveDay

//========== Display Cities on page function  =========//
const displayCities = () => {
    // Clears the previous buttons before calling localStorage to re-add them
    history.empty();

    // Get cities from local storage, make it a btn, put a handler, and put it on the page
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities) {
        storedCities.forEach((city) => {
            let listCities = $(
                `<button type="button" class="btn btn-secondary mt-1"> ${city} </button>`
            );
            listCities.on("click", () => {
                getGeoCode(city);
            });
            history.append(listCities);
        });
    }
};
// END - displayCities

//========== Add To Recent Searches function =========//
const addToRecentSearches = () => {
    let addToStoredCities = JSON.parse(localStorage.getItem("cities"));
    if (!Array.isArray(addToStoredCities)) {
        addToStoredCities = [];
    } else if (addToStoredCities.length > 9) {
        addToStoredCities.pop();
    }

    addToStoredCities.unshift(citySearch.val());
    localStorage.setItem("cities", JSON.stringify(addToStoredCities));
    displayCities();
};
// END - addToRecentSearches //

//===== Handler =====//
submitBtn.on("click", (event) => {
    event.preventDefault(event);
    // Get the value from the input section from html
    getGeoCode(citySearch.val());
    addToRecentSearches();
    citySearch.val("");
});

getGeoCode("orlando");
displayCities();
