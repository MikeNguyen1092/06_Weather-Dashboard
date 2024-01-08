//=============================== DOM Traversal ======================================//

let citySearch = $("#citySearch");
let submitBtn = $("#searchBtn");
let history = $("#history");
let nameOfCity = $("#nameOfCity")
let todayTemp = $("#temp");
let todayWind = $("#wind");
let todayHumidity = $("#humidity");


//=============================== Global Variables ===================================//

addToStoredCities = []

//================================ Main function ====================================//

const getData = async (city) => {
    const coordinates = await getGeoCode(city);
    forecast(coordinates);
    fiveDay(coordinates);

};

const getGeoCode = async (aCity) => {
    let geoResponse = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${aCity}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );

    let geoData = await geoResponse.json();
    let lat = geoData[0].lat;
    let lon = geoData[0].lon;

    console.log(lat);
    console.log(lon);

    return [lat, lon]
};
// END - getGeoCode //

const forecast = async (coordinates) => {
    let lat = coordinates[0];
    let lon = coordinates[1];
    
    let weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );
    let weatherData = await weatherResponse.json();

        nameOfCity.text(weatherData.name);
        todayTemp.text(weatherData.main.temp)
        todayWind.text(weatherData.wind.speed)
        todayHumidity.text(weatherData.main.humidity)

    console.log(weatherData);
}

const fiveDay = async (coordinates) => {
    let lat = coordinates[0];
    let lon = coordinates[1];

        let fiveDayResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );

    let fiveDayData = await fiveDayResponse.json();

    console.log(fiveDayData);
}

//========== Display Cities on page function  =========//

const displayCities = () => {
    // Clears the previous buttons before calling localStorage to re-add them
    history.empty();
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities) {
        storedCities.forEach((city) => {
            let listCities = $(
                `<button type="button" class="btn btn-secondary mt-1"> ${city} </button>`
            );
            listCities.on("click", () => {
                getData(city);
                console.log("recent searched - " + city);
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

submitBtn.on("click", function (event) {
    event.preventDefault();
    getData(citySearch.val());
    addToRecentSearches();
    citySearch.val("");
});

displayCities();
