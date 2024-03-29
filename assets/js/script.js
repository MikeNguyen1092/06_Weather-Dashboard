//=============================== DOM Traversal ======================================//
const citySearch = $("#citySearch");
const submitBtn = $("#searchBtn");
const history = $("#history");
const cardContainer = $("#fiveDayCardContainer");
const weather = $("#weather");
const clearBtn = $("#clearBtn");

//================================== Functions ======================================//

//========== Get lon and at from city  =========//

// Using async/await to wait for a response before moving to next line
const getGeoCode = async (aCity) => {
	// Use try/catch to catch any errors
	try {
		const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${aCity}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`);

		const geoData = await geoResponse.json();
		const lat = geoData[0].lat;
		const lon = geoData[0].lon;

		// Once got the lon and lat, pass it to both functions to run at once (they don't need to wait on each other)
		forecast(lat, lon);
		fiveDay(lat, lon);

		//if there is an error run this.
	} catch (error) {
		weather.empty();
		cardContainer.empty();
		weather.append($(`<h1>We could not find this city. Please try again</h1>`));
		setTimeout(() => {
			getGeoCode("orlando");
		}, 3000);
	}
};
// END - getGeoCode //

//========== Get today's weather and append it =========//
const forecast = async (lat, lon) => {
	weather.empty();
	const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=28a50b02ae4b700f3cf73b5f494e201a`);
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

//========== Get 5 day forecast and append it =========//
const fiveDay = async (lat, lon) => {
	// clears forecast before writing new ones
	cardContainer.empty();

	const fiveDayResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=28a50b02ae4b700f3cf73b5f494e201a`);

	const fiveDayData = await fiveDayResponse.json();

	// Filter the list to keep only data for 15:00 hr
	const hour15 = fiveDayData.list.filter((hours) => hours.dt_txt.includes("15:00"));

	// loops through each `list`, get the necessary values and append it to page
	hour15.forEach((index) => {
		const date = index.dt_txt.split(" ")[0].substring(5);
		const temperature = index.main.temp;
		const icon = index.weather[0].icon;
		const wind = index.wind.speed;
		const humidity = index.main.humidity;

		// Create a new card for each day and append it page
		const card = $(`<div class="bg-dark-subtle bg-gradient col-md-2 box-shadow rounded">
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

//========== Display Cities from local storage  =========//
const displayCities = () => {
	// Clears the previous buttons before calling localStorage to re-add them
	history.empty();

	// Get cities from local storage, make it a btn, put a handler, and put it on the page
	const storedCities = JSON.parse(localStorage.getItem("cities"));
	if (storedCities) {
		storedCities.forEach((city) => {
			const listCities = $(`<button type="button" class="btn btn-secondary mt-1"> ${city} </button>`);
			listCities.on("click", () => {
				getGeoCode(city);
			});
			history.append(listCities);
		});
	}
};
// END - displayCities

//========== Add To Recent Searches =========//
const addToRecentSearches = () => {
	// Get array in local storage
	let addToStoredCities = JSON.parse(localStorage.getItem("cities"));

	// Check to see if it is not an array
	if (!Array.isArray(addToStoredCities)) {
		addToStoredCities = [];

		// Delete the last index if array length is over 9
	} else if (addToStoredCities.length > 9) {
		addToStoredCities.pop();
	}

	// Add new city to beginning of the array and update local storage
	addToStoredCities.unshift(citySearch.val());
	localStorage.setItem("cities", JSON.stringify(addToStoredCities));
	displayCities();
};
// END - addToRecentSearches //

//============== Handler ===============//
submitBtn.on("click", (event) => {
	event.preventDefault(event);
	// Get the value from the input section from html
	getGeoCode(citySearch.val());
	addToRecentSearches();
	citySearch.val("");
});

//===== Press 'Enter' on the input field to search ====//
citySearch.on("keydown", (event) =>{
	if (event.key === "Enter") {
		event.preventDefault();
		getGeoCode(citySearch.val());
		addToRecentSearches();
		citySearch.val("");
	}
});

//===== Clear history ======//
clearBtn.on("click", (event) => {
	event.preventDefault(event);
	localStorage.removeItem("cities");
	history.empty();
});



// Init
getGeoCode("orlando");
displayCities();
