$(document).ready(function () {
    
    //DOM variables
    var UVEl = $("<button>");
    var colEl = $("<div>");
    var cardEl = $("<div>");
    var tempEl = $("<h4>");
    var iconEl = $("<img>");
    var humidityEl = $("<h4>");
    var dateEl = $("<h4>");

    //JS Variables
    var city = "Atlanta";
    var today = new Date();
    var date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

    //Function Definitions
    function currentWeather(city) {
        console.log(city);
        var queryURLcurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ba38bb11b45233a9a2d3b321afc00ba8";
        //Get current city weather from Current Weather API
        $.ajax({
            url: queryURLcurrent,
            method: "GET"
        }).then(function (response) {
            console.log(response)
            console.log(response.name);
            console.log(response.main.temp);
            console.log(response.main.humidity);
            console.log(response.wind.speed);

            //Insert relevant data from API to targeted elements by ID
            $("#city-name").text(response.name + " (" + date + ") ");
            var icon = response.weather[0].icon;

            //Append weather icon (from API) to city name element
            $("#weather-icon").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
            $("#weather-icon").attr("alt", "weather icon");

            //Convert temp from deg. Kelvin to deg. F and convert to integer while inserting text
            $("#temperature").text(parseInt(((response.main.temp) - 273.15) * 1.8) + 32);
            $("#humidity").text(response.main.humidity);
            $("#wind-speed").text(response.wind.speed);
            var cityLat = response.coord.lat;
            var cityLon = response.coord.lon;

            $("#button" + city).on("click", function () {
                localStorage.getItem("cityName" + city);
                currentWeather(city);
            })

            //Get UV index from UV Index API
            var queryUVindex = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=ba38bb11b45233a9a2d3b321afc00ba8";

            $.ajax({
                url: queryUVindex,
                method: "GET"
            }).then(function (responseUV) {
                var UVindex = responseUV[0].value;
                console.log(UVindex);
                UVEl.remove();
                UVEl = $("<button>");
                UVEl.text(UVindex);
                UVEl.attr("class", "btn-success");
                $("#UV-index").append(UVEl);

                //apply coloring to UV index depending on favorable, moderate, or severe value
                if (UVindex >= 3 && UVindex <= 6) {
                    UVEl.attr("class", "btn-warning");
                } else if (UVindex > 6) {
                    UVEl.attr("class", "btn-danger");
                }

            })
        });

        // Start 5 day forecast
        var queryURLfiveday = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=ba38bb11b45233a9a2d3b321afc00ba8"
        $.ajax({
            url: queryURLfiveday,
            method: "GET"
        }).then(function (responseFiveDay) {
            console.log(responseFiveDay);
            $("#forecastRow").empty();
            var a = 1;

            //dynamically build small cards to display weather conditions for the next 5 days
            for (i = 0; i < 5; i++) {
                colEl = $("<div>");
                colEl.attr("class", "col-sm-2");
                $("#forecastRow").append(colEl);
                cardEl = $("<div>");
                cardEl.attr("class", "card small card-body");
                colEl.append(cardEl);
                dateEl = $("<h5>");
                var date = responseFiveDay.list[a].dt_txt.slice(0, -9)
                dateEl.text(date);
                cardEl.append(dateEl);
                var icon = responseFiveDay.list[a].weather[0].icon;
                iconEl = $("<img>");
                iconEl.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png");
                iconEl.attr("width", 40);
                iconEl.attr("height", 40);
                cardEl.append(iconEl);
                tempEl = $("<h5>");
                var temp = parseInt(((responseFiveDay.list[a].main.temp - 273.15) * 1.8) + 32);
                tempEl.text("Temp.: " + temp + " deg. F");
                cardEl.append(tempEl);
                humidityEl = $("<h5>");
                humidityEl.text("Humidity: " + responseFiveDay.list[a].main.humidity + "%");
                cardEl.append(humidityEl);
                a = a + 8;
                console.log(a);
            }
        })
    };

    //Initialize page with last city from prior session
    function getLastCity(city) {
        city = localStorage.getItem("lastCity");
        console.log(city);
        currentWeather(city);
    }

    //Function calls
    getLastCity(city);

    //Event listeners
    $("#searchBtn").on("click", function () {
        var city = $("#searchText").val();
        if (city === "") {
            alert("Enter a city name!");
            return;
        }

        //Add search history button with city name below search input field
        var cityButtonEl = $("<button>");
        cityButtonEl.text(city);
        cityButtonEl.attr("id", "button" + city);
        cityButtonEl.attr("class", "btn-light btn-lg btn-block");
        $("#searchCol").append(cityButtonEl);
        localStorage.setItem("cityName" + city, city);

        //Store last city searched
        localStorage.setItem("lastCity", city);

        currentWeather(city);
    })

})