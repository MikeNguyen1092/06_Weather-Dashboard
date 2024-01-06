//=============================== DOM Traversal ======================================//

let cityName = $("#city");
let submitBtn = $("#searchBtn");

//================================ Main function ====================================//

function getGeoCode() {

    if (cityName !== "") {
        
        fetch(
            `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.val().trim()}&limit=1&appid=28a50b02ae4b700f3cf73b5f494e201a`
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    console.log(data[i].lat);
                    console.log(data[i].lon);
                }
            });
        } 
} // END - getGeoCode //




// function to get geocoding API

submitBtn.on("click", function (event) {
    event.preventDefault();

    getGeoCode();
    
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
