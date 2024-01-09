//=============================== DOM Traversal ======================================//
const citySearch = $("#citySearch");
const submitBtn = $("#searchBtn");
const history = $("#history");
const cardContainer = $("#fiveDayCardContainer");
const weather = $("#weather");

//================================ Functions ====================================//

//========== Get lon and Lat from city  =========//

// Using async/await to wait for a response before moving to next line
const getGeoCode = async (aCity) => {
    // Use try/catch to catch any errors
    try {
        const geoResponse = await fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${aCity}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`
        );

        const geoData = await geoResponse.json();

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        // Once got the lon and lat, run both functions at once (they don't need to wait on each other)
        forecast(lat, lon);
        fiveDay(lat, lon);

        //if there is an error run this.
    } catch (error) {
        weather.empty();
        cardContainer.empty();
        weather.append(
            $(`<h1>We could not find this city. Please try again</h1>`)
        );
        setTimeout(() => {
            getGeoCode("orlando");
            }, 3000);
    }
};
// END - getGeoCode //

//========== Get today's weather and append it page =========//
const forecast = async (lat, lon) => {
    weather.empty();
    const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );
    const weatherData = await weatherResponse.json();
    const icon = weatherData.weather[0].icon;
    const temp = weatherData.main.temp;
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;

    // use Jquery to append on page
    const weatherCard = $(`<div class ="ms-3">
                            <div class="d-flex align-items-center">
                                <h1>${weatherData.name} ${dayjs().format("(MM-DD-YYYY)")}</h1>
                                <img src= ${`https://openweathermap.org/img/wn/${icon}@2x.png`}>
                            </div>
                            <p>Temp: ${temp}</p>
                            <p>Wind: ${wind}</p>
                            <p>Humidity: ${humidity}</p>
                            </div>`);

    weather.append(weatherCard);
};
// END - forecast

//========== Get 5 day forecast and append it page =========//
const fiveDay = async (lat, lon) => {
    // clears forecast before writing new ones
    cardContainer.empty();

    const fiveDayResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=28a50b02ae4b700f3cf73b5f494e201a`
    );

    const fiveDayData = await fiveDayResponse.json();

    // Filter the list to keep only data for 15:00 hr
    const hour12 = fiveDayData.list.filter((list) =>
        list.dt_txt.includes("15:00")
    );

    // loops through each `list`, get the necessary values and append it to page
    hour12.forEach((list) => {
        const date = list.dt_txt.split(" ")[0].substring(5);
        const temperature = list.main.temp;
        const icon = list.weather[0].icon;
        const wind = list.wind.speed;
        const humidity = list.main.humidity;

        // Create a new card for each day
        const card =
            $(`<div class="bg-dark-subtle bg-gradient col-md-2 box-shadow rounded">
                        <h2 class="m-2">${date}-${dayjs().format("YYYY")}</h2>
                        <img class="weather-icon"src= ${`https://openweathermap.org/img/wn/${icon}@2x.png`}>
                        <p class="ms-2">Temp: ${temperature.toFixed(2)}°F</p>
                        <p class="ms-2">Wind: ${wind} MPH</p>
                        <p class="ms-2">Humidity: ${humidity}%</p>
                      </div>`);

        cardContainer.append(card);
    });
};
// END - fiveDay

//========== Display Cities on page function  =========//
const displayCities = () => {
    // Clears the previous buttons before calling localStorage to re-add them
    history.empty();

    // Get cities from local storage, make it a btn, put a handler, and put it on the page
    const storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities) {
        storedCities.forEach((city) => {
            const listCities = $(
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
    const addToStoredCities = JSON.parse(localStorage.getItem("cities"));
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

// init function
getGeoCode("orlando");
displayCities();
