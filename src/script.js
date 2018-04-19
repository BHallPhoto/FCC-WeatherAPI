// Time and date window function
window.onload = function () {

    const timeNoSecond = new Date().toLocaleTimeString([], {
        "day": "2-digit",
        "hour": "2-digit",
        "hour12": true,
        "minute": "2-digit",
        "month": "long",
        "weekday": "short"
    });

    document.querySelector(".currentTime").innerHTML = timeNoSecond;

};

// document ready json with jQuery
$(document).ready(() => {

    const apiKey = "0f3fd9a2b62cb8cd";
    let dataUrl = "";

    function parseData (data) {

        const weatherData = {
                "city": data.current_observation.display_location.city,
                "condition": data.current_observation.weather,
                "humidity": data.current_observation.relative_humidity,
                "state": data.current_observation.display_location.state_name,
                "tempF": data.current_observation.temp_f,
                "windDir": data.current_observation.wind_dir,
                "windSpd": data.current_observation.wind_mph
            },
            {
                city,
                condition,
                humidity,
                state,
                tempF,
                windDir,
                windSpd
            } = weatherData,
            fullCityState = city + ", " + state;

        document.querySelector(".cityState").innerHTML = fullCityState;
        document.querySelector(".temp").innerHTML = tempF;
        document.querySelector(".condition").innerHTML = condition;
        document.querySelector(".humidity").innerHTML = humidity;
        document.querySelector(".windSpeed").innerHTML = windSpd;
        document.querySelector(".windDirection").innerHTML = windDir;

    }

    function getJson (data) {

        $.ajax({
            "type": "GET",
            "url": dataUrl,
            "data": data,
            "async": false,
            "beforeSend": (xhr) => {

                if (xhr && xhr.overrideMimeType) {

                    xhr.overrideMimeType("application/json;charset=utf-8");

                }

            },
            "dataType": "json",
            "success": (data) => {

                parseData(data);

            }

        });

    }

    function success (position) {

        dataUrl = "https://cors-anywhere.herokuapp.com/http://api.wunderground.com/api/" + apiKey + "/geolookup/conditions/q/" + position.coords.latitude + "," + position.coords.longitude + ".json";
        getJson(dataUrl);

    }

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(success);

    } else {

        // eslint-disable-next-line
        prompt("Your browser does not support GeoLocation. You can use Search to search for a City Lookup.");

    }

});
