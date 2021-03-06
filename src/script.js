/**
 * Weather API for FreeCodeCamp
 * TODO:
 * - Add Search for City, anywhere!
 * - continue to work on City search...
 */

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

    let dataUrl = "",
        _windDeg = "";

    const apiKey = "0f3fd9a2b62cb8cd",
        windDegDir = function () {

            const _wind = {
                    "_from": "from",
                    "numDeg": _windDeg,
                    "deg": "deg"
                },
                {
                    _from,
                    numDeg,
                    deg
                } = _wind,
                _xWind1 = "wi wi-wind ",
                _xWind2 = _from + "-" + numDeg + "-" + deg,
                xxI = _xWind1.concat(_xWind2);

            return xxI;
        },
        windScale = function (windSpd) {

            const grades = [
                {"speed": 0, "desc": "Calm"},
                {"speed": 2, "desc": "Light air"},
                {"speed": 6, "desc": "Light breeze"},
                {"speed": 12, "desc": "Gentle breeze"},
                {"speed": 20, "desc": "Moderate breeze"},
                {"speed": 29, "desc": "Fresh breeze"},
                {"speed": 39, "desc": "Strong breeze"},
                {"speed": 50, "desc": "High wind"},
                {"speed": 62, "desc": "Gale"},
                {"speed": 75, "desc": "Strong gale"},
                {"speed": 89, "desc": "Storm"},
                {"speed": 103, "desc": "Violent Storm"},
                {"speed": 118, "desc": "Hurricane"}
            ];
            let speedDesc = {};

            if (windSpd <= grades[1].speed) {
                return "Calm";
            }
            speedDesc = grades.filter((spd) => {
                return spd.speed < windSpd;
            });

            return speedDesc.pop().desc;

        },
        input = document.getElementById("searchInput");

    // parseData() retreives the data from url and parses it out to innerHTML.
    function parseData (data) {
        // Parsing data to the DOM
        _windDeg = data.current_observation.wind_degrees;

        const weatherData = {
                "city": data.current_observation.display_location.city,
                "condition": data.current_observation.weather,
                "humidity": data.current_observation.relative_humidity,
                "icon": data.current_observation.icon_url,
                "state": data.current_observation.display_location.state_name,
                "tempF": data.current_observation.temp_f,
                "windDir": data.current_observation.wind_dir,
                "windSpd": data.current_observation.wind_mph
            },
            {
                city,
                condition,
                humidity,
                icon,
                state,
                tempF,
                windDir,
                windSpd
            } = weatherData,
            fullCityState = city + ", " + state,
            humidityNoPercent = String(humidity).replace(/\D ?/g, ""),
            myIcons = icon.replace(/k/g, "i");

        document.querySelector(".cityState").innerHTML = fullCityState;
        document.querySelector(".temp").innerHTML = tempF;
        document.querySelector(".condition").innerHTML = condition;
        document.querySelector(".humidity").innerHTML = humidityNoPercent + " ";
        document.querySelector(".windScale").innerHTML = windScale(windSpd);
        document.querySelector(".windSpeed").innerHTML = " " + windSpd + " MPH";
        document.querySelector(".windDirection").innerHTML = windDir;
        document.querySelector("#windDirection").setAttribute("class", windDegDir());
        document.querySelector("#currIcon").setAttribute("src", myIcons);

    }
    // Get JSON Data from WeatherUnderground then send data to parseData();
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

    // Once succes, success() gets the url and sends it to getJson(dataUrl);
    function success (position) {

        dataUrl = "https://cors-anywhere.herokuapp.com/http://api.wunderground.com/api/" + apiKey + "/geolookup/conditions/q/" + position.coords.latitude + "," + position.coords.longitude + ".json";
        getJson(dataUrl);

    }

    // Checks whether or not if GeoLocation is turned on, if so success(position);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success);
    } else {
        // eslint-disable-next-line
        prompt("Your browser does not support GeoLocation. You can use Search to search for a City Lookup.");
        // FIXME: Add Search somewhere in this area, or point to search function.
    }

    // Button for switching between F and C
    document.querySelector("#degBtn").addEventListener("click", () => {
        const aI = document.querySelector(".deg"),
            aI2 = aI.getAttribute("deg"),
            aI3 = String(aI2);

        if (aI3 === "f") {

            const valFar = document.querySelector(".temp").innerHTML,
                convFtoC = (valFar - 32) * 0.5556,
                convFtoCtoNum = Number(convFtoC),
                floorIt = Number(Math.round(convFtoCtoNum * 10) / 10);

            document.querySelector(".temp").innerHTML = floorIt;
            document.querySelector(".deg").innerHTML = " C";
            document.querySelector(".deg").setAttribute("deg", "c");
        } else {
            const valCel = document.querySelector(".temp").innerHTML,
                convCtoF = (valCel * 1.8) + 32,
                convCtoFtoNum = Number(convCtoF),
                roundIt = Number(Math.round(convCtoFtoNum * 10) / 10);

            document.querySelector(".temp").innerHTML = roundIt;
            document.querySelector(".deg").innerHTML = " F";
            document.querySelector(".deg").setAttribute("deg", "f");
        }
    });

    // Button to search for City FIXME:

    input.addEventListener("keydown", (event) => {
        const query = document.getElementById("searchInput").value,
            searchDataUrl = "https://cors-anywhere.herokuapp.com/https://autocomplete.wunderground.com/aq?format=JSON&query=",
            srchData = searchDataUrl.replace(/\s+/g, "%20");

        if (event.keyCode === 13) {
            console.log("hey");
        } else {
            $.getJSON(srchData + query, (json) => {
                $.each(json.RESULTS, (index, location) => {
                    console.log(location);
                });
            });
        }


    });

    // $("#button").click(() => {
    //     const query = document.querySelector("#searchInput").value,
    //         searchDataUrl = "https://cors-anywhere.herokuapp.com/https://autocomplete.wunderground.com/aq?format=JSON&query=",
    //         srchData = searchDataUrl.replace(/\s+/g, "%20");

    //     $.getJSON(srchData + query, (json) => {
    //         $.each(json.RESULTS, (index, location) => {
    //             console.log(index, location);
    //         });
    //     });

    // });

});
