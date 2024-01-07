//=============================== DOM Traversal ======================================//

let cityName = $("#city");
let submitBtn = $("#searchBtn");
let history = $("#history");

//=============================== Global Variables ===================================//


//================================ Main function ====================================//

const getGeoCodeAndForecast = async (aCity) => {

    let geoResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${aCity}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`);

    let geoData = await geoResponse.json();
        let lat = geoData[0].lat;
        let lon = geoData[0].lon;

    let weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28a50b02ae4b700f3cf73b5f494e201a`);
    let weatherData = await weatherResponse.json();

    console.log("Today's forecast for - "+weatherData.name)

    let fiveDayResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=28a50b02ae4b700f3cf73b5f494e201a`);

    let fiveDayData = await fiveDayResponse.json();

    console.log("5 day forecast for - "+fiveDayData.city.name);

        
} // END - getGeoCodeAndForecast //

const forecast = async () => {
    const result = await getGeoCodeAndForecast(cityName.val())
    console.log(result);
  }


  const displayCities = () => {
    // Clears the previous buttons before calling localStorage to re-add them
    history.empty();
    let storedCities = JSON.parse(localStorage.getItem('cities'));
    if(storedCities) {
        storedCities.forEach((city) => {
            let listCities = $(`<button type="button" class="btn btn-secondary mt-1"> ${city} </button>`);
            listCities.on("click", () => {
                getGeoCodeAndForecast(city)
                console.log("recent searched - "+city);
            })
            history.append(listCities)
        });
        
    }

  }

//========== Add To Recent Searches function =========//

const addToRecentSearches = () => {
    let addToStoredCities = JSON.parse(localStorage.getItem('cities'));
    if (addToStoredCities.length > 3) {
        addToStoredCities.pop();
    }

    addToStoredCities.unshift(cityName.val());
    localStorage.setItem('cities', JSON.stringify(addToStoredCities));
    displayCities();

} // END - addToRecentSearches //


submitBtn.on("click", function (event) {
    event.preventDefault();
      forecast();
      addToRecentSearches();
      cityName.val("");
});

displayCities();

/* 
create function to get the lat and long from city with weather API
*/

/* 
create function to display recent 10 history (go to pokemon to display from array)
need to be able to click and search it. 
Use <button type="button" class="btn btn-primary mt-1">Search</button> and 
add an index to click it and call that specific object? with lat and log
*/
