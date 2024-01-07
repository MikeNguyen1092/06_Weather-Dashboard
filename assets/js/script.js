//=============================== DOM Traversal ======================================//

let cityName = $("#city");
let submitBtn = $("#searchBtn");

//=============================== Global Variables ===================================//

let cities = [];

//================================ Main function ====================================//

const getGeoCodeAndForecast = async () => {

    let geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName.val().trim()}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`);

    let geoData = await geoResponse.json();
        let lat = geoData[0].lat;
        let lon = geoData[0].lon;

    let weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28a50b02ae4b700f3cf73b5f494e201a`);
    let weatherData = await weatherResponse.json();

    console.log(weatherData)

    let fiveDayResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=28a50b02ae4b700f3cf73b5f494e201a`);

    let fiveDayData = await fiveDayResponse.json();

    console.log(fiveDayData.list);

        
} // END - getGeoCodeAndForecast //

const forecast = async () => {
    const result = await getGeoCodeAndForecast()
    console.log(result);
  }

//========== Add To Recent Searches function =========//

const addToRecentSearches = () => {
    if (cities.length > 3) {
        cities.pop();
    }

    cities.unshift(cityName.val());
    localStorage.setItem('cities', JSON.stringify(cities));
}

// End - addToRecentSearches //


submitBtn.on("click", function (event) {
    event.preventDefault();
      forecast();
      addToRecentSearches()
});

/* 
create function to get the lat and long from city with weather API
*/

/* 
create function to display recent 10 history (go to pokemon to display from array)
need to be able to click and search it. 
Use <button type="button" class="btn btn-primary mt-1">Search</button> and 
add an index to click it and call that specific object? with lat and log
*/
